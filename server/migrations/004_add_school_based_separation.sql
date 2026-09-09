-- Migration: school-based data separation (Section 4) on an existing
-- `chemquest` DB.
--
-- Only needed if your database was created BEFORE this change. A brand
-- new database created from the current schema.sql already has the
-- `schools` table and `players.school_id` column and does not need this
-- file.
--
--   mysql -u root -p chemquest < migrations/004_add_school_based_separation.sql
--
-- What this does:
--   1. Creates the `schools` table.
--   2. Adds `players.school_id` (nullable FK -> schools.id).
--   3. Backfills one `schools` row per distinct existing `school_name`,
--      and points every player with that school_name at it.
-- After running this, every STUDENT/TEACHER that had a school_name filled
-- in keeps working exactly as before, just now backed by a real school_id
-- instead of a free-text string. Existing players.school_name is left
-- alone (still the display label) - school_id is the new source of truth
-- for backend filtering. Any player who signed up before school_name was
-- required (migration 003) will have school_id = NULL; an admin can
-- assign one from the Admin > Schools page (PATCH /api/admin/users/:id).

USE chemquest;

CREATE TABLE IF NOT EXISTS schools (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  name             VARCHAR(150) NOT NULL,
  normalized_name  VARCHAR(150) NOT NULL,
  created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_schools_normalized_name (normalized_name)
) ENGINE=InnoDB;

ALTER TABLE players
  ADD COLUMN school_id INT NULL AFTER school_name,
  ADD CONSTRAINT fk_players_school FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE SET NULL,
  ADD INDEX idx_players_school_role (school_id, role);

-- Backfill: one school row per distinct trimmed school_name already on
-- file, matched case-insensitively (mirrors findOrCreateSchool()).
INSERT INTO schools (name, normalized_name)
SELECT DISTINCT
    TRIM(school_name)                    AS name,
    LOWER(TRIM(school_name))             AS normalized_name
FROM players
WHERE school_name IS NOT NULL AND TRIM(school_name) <> ''
ON DUPLICATE KEY UPDATE schools.name = schools.name; -- no-op, just skip existing

UPDATE players p
JOIN schools s ON s.normalized_name = LOWER(TRIM(p.school_name))
SET p.school_id = s.id
WHERE p.school_name IS NOT NULL AND TRIM(p.school_name) <> '';
