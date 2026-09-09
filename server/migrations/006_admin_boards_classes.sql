-- Migration: real database support for the Admin > Boards and Admin >
-- Classes screens (previously backed by client/src/admin/mockData.js's
-- localStorage store — see that file's header comment).
--
-- Only needed if your database was created BEFORE this change. Run:
--   mysql -u root -p chemquest < migrations/006_admin_boards_classes.sql
--
-- What this does:
--   1. Adds `boards.status` ('active' | 'draft') so the admin can unpublish
--      a board without deleting it — mirrors `subjects.status`, which
--      already exists (see 005_add_subjects.sql).
--   2. Creates `board_subjects` and `class_subjects`, many-to-many join
--      tables recording which subjects are offered on which board / at
--      which grade — the admin mock modeled this as a `subjectIds` array
--      on each Board/Class row; those relations don't exist anywhere in
--      schema.sql yet.

USE chemquest;

SET @col_exists := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'boards' AND COLUMN_NAME = 'status'
);
SET @sql := IF(@col_exists = 0,
  'ALTER TABLE boards ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT ''active'' AFTER sort_order',
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

CREATE TABLE IF NOT EXISTS board_subjects (
  board_code    VARCHAR(10) NOT NULL,
  subject_code  VARCHAR(30) NOT NULL,
  PRIMARY KEY (board_code, subject_code),
  CONSTRAINT fk_board_subjects_board FOREIGN KEY (board_code) REFERENCES boards(code) ON DELETE CASCADE,
  CONSTRAINT fk_board_subjects_subject FOREIGN KEY (subject_code) REFERENCES subjects(code) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS class_subjects (
  grade         INT NOT NULL,
  subject_code  VARCHAR(30) NOT NULL,
  PRIMARY KEY (grade, subject_code),
  CONSTRAINT fk_class_subjects_class FOREIGN KEY (grade) REFERENCES classes(grade) ON DELETE CASCADE,
  CONSTRAINT fk_class_subjects_subject FOREIGN KEY (subject_code) REFERENCES subjects(code) ON DELETE CASCADE
) ENGINE=InnoDB;
