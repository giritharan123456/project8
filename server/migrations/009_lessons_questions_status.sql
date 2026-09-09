-- Migration: real database support for the Admin > Lessons and
-- Admin > Questions screens (previously mock/localStorage).
--
-- Only needed if your database was created BEFORE this change. Run:
--   mysql -u root -p chemquest < migrations/009_lessons_questions_status.sql
--
-- What this does:
--   Adds a `status` ('published' | 'draft') column to `lessons` and
--   `questions`, mirroring `boards.status`/`subjects.status`/
--   `players.status` (see migration 007's comment for the same pattern).
--   Neither table had a status/draft concept before - every row on an
--   existing database defaults to 'published' so no currently-live
--   lesson/question content disappears from gameplay after this runs.
--
--   Does NOT add a chapter or lesson relationship to either table - the
--   Admin > Lessons/Questions screens were repointed to select a real
--   Course (worlds.id) instead of the mock chapterId/lessonId fields they
--   shipped with. See client/src/admin/pages/LessonsPage.jsx and
--   QuestionsPage.jsx.

USE chemquest;

SET @lessons_status_exists := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'lessons' AND COLUMN_NAME = 'status'
);
SET @sql := IF(@lessons_status_exists = 0,
  'ALTER TABLE lessons ADD COLUMN status ENUM(''published'', ''draft'') NOT NULL DEFAULT ''published'' AFTER sort_order',
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @questions_status_exists := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'questions' AND COLUMN_NAME = 'status'
);
SET @sql := IF(@questions_status_exists = 0,
  'ALTER TABLE questions ADD COLUMN status ENUM(''published'', ''draft'') NOT NULL DEFAULT ''published'' AFTER sort_order',
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
