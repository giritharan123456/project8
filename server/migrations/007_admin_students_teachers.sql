-- Migration: real database support for the Admin > Students and Admin >
-- Teachers screens (previously backed by client/src/admin/mockData.js's
-- localStorage store — see that file's header comment).
--
-- Only needed if your database was created BEFORE this change. Run:
--   mysql -u root -p chemquest < migrations/007_admin_students_teachers.sql
--
-- What this does:
--   1. Adds `players.status` ('active' | 'inactive' | 'suspended') so an
--      admin can deactivate/suspend an account without deleting it —
--      mirrors `boards.status`/`subjects.status`. Defaults every existing
--      row to 'active' so nobody currently signed up gets locked out.
--   2. Creates `teacher_subjects`, `teacher_boards`, `teacher_classes` —
--      many-to-many join tables recording what a TEACHER account is
--      assigned to teach. The admin mock modeled this as `subjectIds`/
--      `boardIds`/`classIds` arrays on each Teacher row; those relations
--      don't exist anywhere in schema.sql yet.

USE chemquest;

SET @col_exists := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'players' AND COLUMN_NAME = 'status'
);
SET @sql := IF(@col_exists = 0,
  'ALTER TABLE players ADD COLUMN status ENUM(''active'', ''inactive'', ''suspended'') NOT NULL DEFAULT ''active'' AFTER role',
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

CREATE TABLE IF NOT EXISTS teacher_subjects (
  teacher_id    CHAR(36) NOT NULL,
  subject_code  VARCHAR(30) NOT NULL,
  PRIMARY KEY (teacher_id, subject_code),
  CONSTRAINT fk_teacher_subjects_teacher FOREIGN KEY (teacher_id) REFERENCES players(id) ON DELETE CASCADE,
  CONSTRAINT fk_teacher_subjects_subject FOREIGN KEY (subject_code) REFERENCES subjects(code) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS teacher_boards (
  teacher_id  CHAR(36) NOT NULL,
  board_code  VARCHAR(10) NOT NULL,
  PRIMARY KEY (teacher_id, board_code),
  CONSTRAINT fk_teacher_boards_teacher FOREIGN KEY (teacher_id) REFERENCES players(id) ON DELETE CASCADE,
  CONSTRAINT fk_teacher_boards_board FOREIGN KEY (board_code) REFERENCES boards(code) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS teacher_classes (
  teacher_id  CHAR(36) NOT NULL,
  grade       INT NOT NULL,
  PRIMARY KEY (teacher_id, grade),
  CONSTRAINT fk_teacher_classes_teacher FOREIGN KEY (teacher_id) REFERENCES players(id) ON DELETE CASCADE,
  CONSTRAINT fk_teacher_classes_class FOREIGN KEY (grade) REFERENCES classes(grade) ON DELETE CASCADE
) ENGINE=InnoDB;
