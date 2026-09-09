-- Migration: Section entity + Course/Chapter split (StudyQuest multi-
-- subject curriculum work, design phase). Only needed if your database
-- was created BEFORE this change. Run:
--   mysql -u root -p chemquest < migrations/010_sections_and_chapters.sql
--
-- =========================================================================
-- WHAT THIS DOES
-- =========================================================================
--   1. `sections` - a within-school subdivision of a Board+Class (e.g.
--      "10-A" at School X). Scoped by school_id because two schools' "10-A"
--      are different rosters, the same reasoning schools.id already gates
--      every teacher.js query on. Added as a genuinely new concept - no
--      existing table modeled this at all.
--   2. `players.section_id` (nullable) - a student's section, once
--      assigned. NULLABLE, not required: every existing student row
--      predates sections and must keep working ungrouped rather than
--      breaking on this migration (same reasoning as migration 007's
--      players.status default).
--   3. `chapters` - the missing middle layer between a Course and a
--      Lesson. IMPORTANT NAMING NOTE: in this codebase, "Course" on the
--      Admin > Courses screen already IS the real `worlds` table (one row
--      per World Map topic - see CoursesPage.jsx and schema.sql's worlds
--      comment). This migration does not rename or duplicate `worlds`; it
--      adds `chapters` as a child of `worlds`, following the same
--      board_code-nullable override-or-shared pattern `lessons`/
--      `questions` already use (NULL = shared template, a real board_code
--      = that board's override).
--   4. `lessons.chapter_id` (nullable) - a lesson's chapter, once
--      assigned. NULLABLE for the same reason as players.section_id:
--      every lesson in the database today has no chapter and must keep
--      rendering directly under its Course exactly as it does now.
--   5. `teacher_sections` - extends the existing teacher_subjects/
--      teacher_boards/teacher_classes pattern (migration 007) so a
--      section can be assigned to a teacher the same way. See the
--      IMPORTANT LIMITATION note below before building UI/authorization
--      on top of this.
--
-- =========================================================================
-- WHAT THIS DELIBERATELY DOES NOT DO YET
-- =========================================================================
--   - Does NOT backfill section_id for existing students, or chapter_id
--     for existing lessons. Every existing row stays exactly as it
--     displays today until an admin/teacher explicitly assigns one.
--   - Does NOT add Admin routes/pages for Sections or Chapters, or wire
--     Courses (worlds) into the ResourcePage real-data pattern. Those are
--     the natural next phase once this schema is confirmed.
--   - Does NOT touch server/src/routes/teacher.js's authorization -
--     resolveScope() there currently filters ONLY by school_id; it does
--     not consult teacher_subjects/teacher_boards/teacher_classes/
--     teacher_sections at all today, so a teacher can already see every
--     grade/board/subject within their own school regardless of
--     assignment. Making Section-aware, server-enforced authorization
--     real is separate follow-up work, not a side effect of this
--     migration.
--
-- =========================================================================
-- IMPORTANT LIMITATION - read before building on teacher_sections
-- =========================================================================
--   teacher_subjects/teacher_boards/teacher_classes/teacher_sections are
--   four INDEPENDENT many-to-many tables (a teacher's subjects, boards,
--   classes and sections are each their own unrelated list). That can't
--   express "Teacher A teaches Chemistry ONLY for 10-A, not 10-B" - it
--   can only express "Teacher A teaches Chemistry" and separately
--   "Teacher A is assigned to 10-A" as unrelated facts, which is exactly
--   the precision the StudyQuest brief's teacher-assignment section
--   calls for. Representing precise (subject, board, grade, section)
--   combinations per teacher needs a fifth, different-shaped table (one
--   row per combination, not four parallel lists) - deliberately left for
--   the authorization follow-up phase rather than guessed at here, since
--   it also changes how TeachersPage.jsx's assignment UI works.

USE chemquest;

CREATE TABLE IF NOT EXISTS sections (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  school_id   INT NOT NULL,
  board_code  VARCHAR(10) NOT NULL,
  grade       INT NOT NULL,
  name        VARCHAR(20) NOT NULL,   -- 'A', 'B', 'Section 1', ...
  sort_order  INT NOT NULL DEFAULT 0,
  UNIQUE KEY uq_sections_identity (school_id, board_code, grade, name),
  CONSTRAINT fk_sections_school FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
  CONSTRAINT fk_sections_board FOREIGN KEY (board_code) REFERENCES boards(code) ON DELETE CASCADE,
  CONSTRAINT fk_sections_class FOREIGN KEY (grade) REFERENCES classes(grade) ON DELETE CASCADE
) ENGINE=InnoDB;

SET @col_exists := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'players' AND COLUMN_NAME = 'section_id'
);
SET @sql := IF(@col_exists = 0,
  'ALTER TABLE players ADD COLUMN section_id INT NULL AFTER school_id, ADD CONSTRAINT fk_players_section FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE SET NULL',
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

CREATE TABLE IF NOT EXISTS chapters (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  world_id      VARCHAR(40) NOT NULL,   -- the "Course" (Admin > Courses == worlds)
  board_code    VARCHAR(10) NULL,       -- NULL = shared template, else that board's override
  title         VARCHAR(150) NOT NULL,
  description   VARCHAR(500) NOT NULL DEFAULT '',
  sort_order    INT NOT NULL DEFAULT 0,
  status        ENUM('published', 'draft') NOT NULL DEFAULT 'published',
  CONSTRAINT fk_chapters_world FOREIGN KEY (world_id) REFERENCES worlds(id) ON DELETE CASCADE,
  CONSTRAINT fk_chapters_board FOREIGN KEY (board_code) REFERENCES boards(code) ON DELETE CASCADE,
  INDEX idx_chapters_lookup (world_id, board_code, sort_order)
) ENGINE=InnoDB;

SET @col_exists := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'lessons' AND COLUMN_NAME = 'chapter_id'
);
SET @sql := IF(@col_exists = 0,
  'ALTER TABLE lessons ADD COLUMN chapter_id INT NULL AFTER world_id, ADD CONSTRAINT fk_lessons_chapter FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE SET NULL',
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

CREATE TABLE IF NOT EXISTS teacher_sections (
  teacher_id  CHAR(36) NOT NULL,
  section_id  INT NOT NULL,
  PRIMARY KEY (teacher_id, section_id),
  CONSTRAINT fk_teacher_sections_teacher FOREIGN KEY (teacher_id) REFERENCES players(id) ON DELETE CASCADE,
  CONSTRAINT fk_teacher_sections_section FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE
) ENGINE=InnoDB;
