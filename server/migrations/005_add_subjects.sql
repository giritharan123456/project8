-- Migration: multi-subject curriculum support (Subject Selection screen)
-- on an existing `chemquest` DB.
--
-- Only needed if your database was created BEFORE this change. A brand
-- new database created from the current schema.sql already has the
-- `subjects` table and `worlds.subject_code` column and does not need
-- this file.
--
--   mysql -u root -p chemquest < migrations/005_add_subjects.sql
--
-- What this does:
--   1. Creates the `subjects` table.
--   2. Adds `worlds.subject_code` (FK -> subjects.code), defaulting every
--      existing row to 'chemistry' so the current Chemistry content keeps
--      working exactly as before with zero data loss.
--   3. Seeds the `subjects` table itself with 'chemistry' (active) plus
--      the other subjects on the roadmap (coming_soon until their own
--      worlds/lessons/questions are authored in seedData.js and re-seeded).
--
-- lessons/questions/player_completions/player_boss_defeats are untouched -
-- they key off world_id, and world_id -> subject is always resolvable via
-- this new worlds.subject_code column, so nothing downstream needs its own
-- subject column.

USE chemquest;

CREATE TABLE IF NOT EXISTS subjects (
  code        VARCHAR(30)  PRIMARY KEY,
  name        VARCHAR(60)  NOT NULL,
  icon        VARCHAR(40)  NOT NULL,
  description VARCHAR(200) NOT NULL,
  status      VARCHAR(20)  NOT NULL DEFAULT 'active',
  sort_order  INT NOT NULL
) ENGINE=InnoDB;

INSERT IGNORE INTO subjects (code, name, icon, description, status, sort_order) VALUES
  ('chemistry',        'Chemistry',         'FlaskConical', 'Atoms, bonding, reactions, and acids & bases.', 'active', 0),
  ('mathematics',       'Mathematics',       'Sigma',        'Algebra, geometry, fractions, statistics, and real-world math.', 'active', 1),
  ('physics',           'Physics',           'Zap',          'Motion, force, energy, and electricity.', 'coming_soon', 2),
  ('biology',           'Biology',           'Dna',          'Cells, the human body, plants, genetics, and ecology.', 'coming_soon', 3),
  ('english',           'English',           'BookOpen',     'Grammar, vocabulary, reading, writing, and communication.', 'coming_soon', 4),
  ('tamil',             'Tamil',             'Languages',    'Grammar, literature, vocabulary, reading, and writing.', 'coming_soon', 5),
  ('social-science',    'Social Science',    'Globe2',       'History, geography, civics, and economics.', 'coming_soon', 6),
  ('computer-science',  'Computer Science',  'Cpu',          'Programming, algorithms, databases, and networking.', 'coming_soon', 7),
  ('accountancy',       'Accountancy',       'BookText',     'Journal, ledger, trial balance, and financial statements.', 'coming_soon', 8),
  ('commerce',          'Commerce',          'Store',        'Trade, marketing, banking, and entrepreneurship.', 'coming_soon', 9),
  ('economics',         'Economics',         'TrendingUp',   'Microeconomics, macroeconomics, and markets.', 'coming_soon', 10),
  ('botany',            'Botany',            'Sprout',       'Plant structure, physiology, reproduction, and agriculture.', 'coming_soon', 11),
  ('zoology',           'Zoology',           'PawPrint',     'Animal biology, human physiology, evolution, and biodiversity.', 'coming_soon', 12);

SET @col_exists := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'worlds' AND COLUMN_NAME = 'subject_code'
);

SET @sql := IF(@col_exists = 0,
  'ALTER TABLE worlds ADD COLUMN subject_code VARCHAR(30) NOT NULL DEFAULT ''chemistry'' AFTER id',
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @fk_exists := (
  SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'worlds' AND CONSTRAINT_NAME = 'fk_worlds_subject'
);

SET @sql := IF(@fk_exists = 0,
  'ALTER TABLE worlds ADD CONSTRAINT fk_worlds_subject FOREIGN KEY (subject_code) REFERENCES subjects(code)',
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @idx_exists := (
  SELECT COUNT(*) FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'worlds' AND INDEX_NAME = 'idx_worlds_subject'
);

SET @sql := IF(@idx_exists = 0,
  'ALTER TABLE worlds ADD INDEX idx_worlds_subject (subject_code, sort_order)',
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Every world row that existed before this migration is Chemistry content;
-- the column default above already covers that, but this makes it explicit
-- for anyone reading the migration.
UPDATE worlds SET subject_code = 'chemistry' WHERE subject_code = '' OR subject_code IS NULL;

-- players.current_subject mirrors current_grade/current_board: the
-- player's last-used subject, defaulting to 'chemistry' for every existing
-- account so nothing changes for them until they pick a different subject.
SET @player_col_exists := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'players' AND COLUMN_NAME = 'current_subject'
);

SET @sql := IF(@player_col_exists = 0,
  'ALTER TABLE players ADD COLUMN current_subject VARCHAR(30) NOT NULL DEFAULT ''chemistry'' AFTER current_board',
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
