-- ChemQuest backend schema (Sections 39-40)
-- Open this in MySQL Workbench and run it against a fresh connection, or:
--   mysql -u root -p < schema.sql
--
-- Creates the `chemquest` database and every table the API in src/routes
-- reads from / writes to. Run `npm run seed` afterwards to populate the
-- curriculum content (boards, classes, worlds, lessons, questions, shop
-- items, achievement/quest definitions) from src/data/seedData.js.

CREATE DATABASE IF NOT EXISTS chemquest
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE chemquest;

-- =========================================================================
-- Curriculum / content tables (Section 41 "configurable curriculum shell")
-- =========================================================================

-- Board Selection screen (Section 7), grouped by category.
CREATE TABLE IF NOT EXISTS board_categories (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  category    VARCHAR(60) NOT NULL,
  sort_order  INT NOT NULL DEFAULT 0
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS boards (
  code            VARCHAR(10)  PRIMARY KEY,
  category_id     INT NOT NULL,
  name            VARCHAR(80)  NOT NULL,
  type            VARCHAR(40)  NOT NULL,
  description     VARCHAR(200) NOT NULL,
  courses         INT NOT NULL DEFAULT 0,
  lessons         INT NOT NULL DEFAULT 0,
  icon            VARCHAR(40)  NOT NULL,
  sort_order      INT NOT NULL DEFAULT 0,
  status          VARCHAR(20)  NOT NULL DEFAULT 'active', -- active | draft (Admin > Boards)
  CONSTRAINT fk_boards_category FOREIGN KEY (category_id)
    REFERENCES board_categories(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Class Selection screen (Section 6).
CREATE TABLE IF NOT EXISTS classes (
  grade             INT PRIMARY KEY,
  icon              VARCHAR(40) NOT NULL,
  courses           INT NOT NULL DEFAULT 0,
  lessons           INT NOT NULL DEFAULT 0,
  questions         INT NOT NULL DEFAULT 0,
  difficulty_label  VARCHAR(60) NOT NULL
) ENGINE=InnoDB;

-- Subjects (multi-subject curriculum shell). One row per subject shown on
-- the Subject Selection screen, ahead of Board/Class selection. `status`
-- lets a subject be listed as "coming_soon" before any worlds exist for it,
-- so the picker can show the full roadmap without broken links.
CREATE TABLE IF NOT EXISTS subjects (
  code        VARCHAR(30)  PRIMARY KEY,
  name        VARCHAR(60)  NOT NULL,
  icon        VARCHAR(40)  NOT NULL,
  description VARCHAR(200) NOT NULL,
  status      VARCHAR(20)  NOT NULL DEFAULT 'active', -- active | coming_soon
  sort_order  INT NOT NULL
) ENGINE=InnoDB;

-- Which subjects are offered on a given board / at a given grade (Admin >
-- Boards and Admin > Classes "Subjects Offered" multiselect). Many-to-many
-- because a board offers several subjects and a subject spans many boards.
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

-- World map (Section 10), now scoped per subject via subject_code. One row
-- per world within a subject; shared across every Class + Board for that
-- subject (the map itself never changes, only progress on it does). World
-- ids stay globally unique strings (e.g. "atom-valley" for Chemistry,
-- "algebra-atoll" for Mathematics) so lessons/questions/player_completions/
-- player_boss_defeats can keep referencing world_id alone - subject is
-- always derivable via this table, so none of those need their own
-- subject_code column.
CREATE TABLE IF NOT EXISTS worlds (
  id            VARCHAR(40) PRIMARY KEY,
  subject_code  VARCHAR(30) NOT NULL DEFAULT 'chemistry',
  name          VARCHAR(80) NOT NULL,
  topic         VARCHAR(120) NOT NULL,
  icon          VARCHAR(40) NOT NULL,
  boss          VARCHAR(80) NOT NULL,
  is_final      TINYINT(1) NOT NULL DEFAULT 0,
  sort_order    INT NOT NULL,
  CONSTRAINT fk_worlds_subject FOREIGN KEY (subject_code) REFERENCES subjects(code),
  INDEX idx_worlds_subject (subject_code, sort_order)
) ENGINE=InnoDB;

-- Difficulty System (Section 13) tiers, shared by every lesson.
CREATE TABLE IF NOT EXISTS difficulties (
  id                VARCHAR(10) PRIMARY KEY,   -- easy | medium | hard | expert
  label             VARCHAR(30) NOT NULL,
  description       VARCHAR(120) NOT NULL,
  xp                INT NOT NULL,
  coins             INT NOT NULL,
  unlock_threshold  INT NULL,                  -- % needed to unlock next tier
  sort_order        INT NOT NULL
) ENGINE=InnoDB;

-- The missing middle layer between a Course (`worlds`) and a Lesson. Same
-- board_code-nullable override-or-shared pattern lessons/questions
-- already use (NULL = shared template, a real board_code = that board's
-- override). Defined here, just above `lessons`, so lessons.chapter_id's
-- FK below has something to reference.
CREATE TABLE IF NOT EXISTS chapters (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  world_id      VARCHAR(40) NOT NULL,
  board_code    VARCHAR(10) NULL,
  title         VARCHAR(150) NOT NULL,
  description   VARCHAR(500) NOT NULL DEFAULT '',
  sort_order    INT NOT NULL DEFAULT 0,
  status        ENUM('published', 'draft') NOT NULL DEFAULT 'published',
  CONSTRAINT fk_chapters_world FOREIGN KEY (world_id) REFERENCES worlds(id) ON DELETE CASCADE,
  CONSTRAINT fk_chapters_board FOREIGN KEY (board_code) REFERENCES boards(code) ON DELETE CASCADE,
  INDEX idx_chapters_lookup (world_id, board_code, sort_order)
) ENGINE=InnoDB;

-- Course/Chapter screen (Section 11). board_code = NULL means "shared
-- template" (falls back for any board without its own override, Section 8).
-- "Course" here IS `worlds` (world_id) - see Admin > Courses (CoursesPage.jsx),
-- which already lists worlds rows, one per World Map topic. `chapters`
-- below is the middle layer between that Course and a Lesson.
CREATE TABLE IF NOT EXISTS lessons (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  world_id      VARCHAR(40) NOT NULL,
  -- A lesson's chapter, once assigned. Nullable: every lesson predates
  -- chapters and must keep rendering directly under its Course exactly as
  -- it does today until an admin explicitly groups it (migration 010).
  chapter_id    INT NULL,
  board_code    VARCHAR(10) NULL,
  lesson_key    VARCHAR(10) NOT NULL,           -- l1, l2, ...
  title         VARCHAR(150) NOT NULL,
  description   VARCHAR(500) NOT NULL,
  sort_order    INT NOT NULL,
  status        ENUM('published', 'draft') NOT NULL DEFAULT 'published',
  CONSTRAINT fk_lessons_world FOREIGN KEY (world_id) REFERENCES worlds(id) ON DELETE CASCADE,
  CONSTRAINT fk_lessons_chapter FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE SET NULL,
  CONSTRAINT fk_lessons_board FOREIGN KEY (board_code) REFERENCES boards(code) ON DELETE CASCADE,
  INDEX idx_lessons_lookup (world_id, board_code, sort_order)
) ENGINE=InnoDB;

-- Battle / Boss Battle question bank (Section 15/16). board_code = NULL
-- means shared template, same override-then-fallback rule as lessons.
CREATE TABLE IF NOT EXISTS questions (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  world_id        VARCHAR(40) NOT NULL,
  board_code      VARCHAR(10) NULL,
  difficulty_id   VARCHAR(10) NOT NULL,         -- easy | medium | hard | expert
  type            VARCHAR(30) NOT NULL DEFAULT 'mcq',
  question_text   VARCHAR(500) NOT NULL,
  options_json    JSON NULL,                    -- array of option strings, or null
  pairs_json      JSON NULL,                    -- [{left,right}] for match_following
  image           VARCHAR(60) NULL,              -- diagram key for QuestionDiagram.jsx
  correct_answer  VARCHAR(300) NOT NULL,
  explanation     VARCHAR(500) NOT NULL,
  sort_order      INT NOT NULL,
  status          ENUM('published', 'draft') NOT NULL DEFAULT 'published',
  CONSTRAINT fk_questions_world FOREIGN KEY (world_id) REFERENCES worlds(id) ON DELETE CASCADE,
  CONSTRAINT fk_questions_board FOREIGN KEY (board_code) REFERENCES boards(code) ON DELETE CASCADE,
  CONSTRAINT fk_questions_difficulty FOREIGN KEY (difficulty_id) REFERENCES difficulties(id),
  INDEX idx_questions_lookup (world_id, board_code, difficulty_id, sort_order)
) ENGINE=InnoDB;

-- Shop (Section 33): avatars, skins, backgrounds, power-ups, frames, effects.
CREATE TABLE IF NOT EXISTS shop_items (
  id           VARCHAR(20) PRIMARY KEY,
  category     VARCHAR(20) NOT NULL,            -- avatars|skins|backgrounds|powerups|frames|effects
  name         VARCHAR(80) NOT NULL,
  icon         VARCHAR(40) NOT NULL,
  price        INT NOT NULL,
  description  VARCHAR(200) NULL,
  sort_order   INT NOT NULL
) ENGINE=InnoDB;

-- Achievements (Section 25) static definitions; unlocked/progress are
-- computed per-player at request time (see src/lib/gameLogic.js).
CREATE TABLE IF NOT EXISTS achievement_defs (
  id           VARCHAR(30) PRIMARY KEY,
  icon         VARCHAR(40) NOT NULL,
  name         VARCHAR(80) NOT NULL,
  description  VARCHAR(200) NOT NULL,
  sort_order   INT NOT NULL
) ENGINE=InnoDB;

-- Daily Quests (Section 26) static definitions; claimed state is per-player,
-- per calendar day (quest_claims below).
CREATE TABLE IF NOT EXISTS daily_quest_defs (
  id          VARCHAR(10) PRIMARY KEY,
  title       VARCHAR(80) NOT NULL,
  target      INT NOT NULL,
  xp          INT NOT NULL,
  coins       INT NOT NULL,
  sort_order  INT NOT NULL
) ENGINE=InnoDB;

-- =========================================================================
-- Schools (Section 4 "school-based data separation")
-- =========================================================================

-- One row per school. Every STUDENT and TEACHER belongs to exactly one
-- school (players.school_id below); ADMIN accounts do not. `normalized_name`
-- (trimmed + lowercased) is what enforces "same school, same row" at
-- signup regardless of casing/whitespace - see findOrCreateSchool() in
-- src/lib/schools.js, which is the ONLY code path that inserts here.
CREATE TABLE IF NOT EXISTS schools (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  name             VARCHAR(150) NOT NULL,
  normalized_name  VARCHAR(150) NOT NULL,
  created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_schools_normalized_name (normalized_name)
) ENGINE=InnoDB;

-- A within-school subdivision of a Board+Class (e.g. "10-A" at this
-- school). Scoped by school_id because two schools' "10-A" are different
-- rosters - the same reasoning school_id already gates every
-- routes/teacher.js query on. Nobody is required to have one
-- (players.section_id below is nullable) - it's an optional refinement
-- under Board+Class, not a new required step in signup.
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

-- =========================================================================
-- Player tables
-- =========================================================================

-- One row per anonymous session cookie, optionally "claimed" by a real
-- account via POST /api/auth/signup|login. `role` drives all role-based
-- access control (see server/src/middleware/auth.js and
-- server/src/routes/admin.js / teacher.js): STUDENT is the default for
-- every anonymous player, and public signup can only ever produce a
-- STUDENT or TEACHER account (see the ALLOWED_SIGNUP_ROLES allowlist in
-- src/routes/auth.js) - ADMIN accounts can only be created by an existing
-- admin (see src/scripts/createAdmin.js and PATCH
-- /api/admin/users/:id/role). There is deliberately no field anywhere a
-- public caller can set to become ADMIN.
-- `school_name` and `subjects` are collected at signup for both STUDENT
-- and TEACHER accounts (see routes/auth.js); `current_grade` doubles as
-- "Class / Standard" for a student and "Teaching Class" for a teacher,
-- and `current_board` as their board, since the meaning is the same
-- column either way and the rest of the app already reads/writes it.
CREATE TABLE IF NOT EXISTS players (
  id                CHAR(36) PRIMARY KEY,
  name              VARCHAR(80) NOT NULL DEFAULT 'Chemist',
  email             VARCHAR(150) NULL UNIQUE,
  password_hash     VARCHAR(255) NULL,
  role              ENUM('ADMIN', 'TEACHER', 'STUDENT') NOT NULL DEFAULT 'STUDENT',
  -- Admin > Students/Teachers status toggle (Section 42). Doesn't gate
  -- login by itself today - routes/auth.js doesn't check it - it's an
  -- admin-facing flag an enforcement check can read later. Every existing
  -- row defaults to 'active' so no current account is affected.
  status            ENUM('active', 'inactive', 'suspended') NOT NULL DEFAULT 'active',
  level             INT NOT NULL DEFAULT 12,
  coins             INT NOT NULL DEFAULT 850,
  xp                INT NOT NULL DEFAULT 850,
  total_xp_earned   INT NOT NULL DEFAULT 0,
  streak            INT NOT NULL DEFAULT 0,
  last_played_date  DATE NULL,
  current_grade     VARCHAR(5) NOT NULL DEFAULT '9',
  current_board     VARCHAR(10) NOT NULL DEFAULT 'CBSE',
  current_subject   VARCHAR(30) NOT NULL DEFAULT 'chemistry',
  school_name       VARCHAR(150) NULL,
  -- The real relation everything is scoped by (Section 4). school_name
  -- above is kept as the free-text label the player typed at signup
  -- (display only, never trusted for access control); school_id is what
  -- routes/teacher.js and routes/admin.js filter on. ON DELETE SET NULL
  -- rather than CASCADE - deleting a school should orphan its accounts
  -- (visible to an admin as "no school"), never silently delete people.
  school_id         INT NULL,
  -- Optional refinement under school_id - which section (e.g. "10-A") of
  -- that school/board/class this account belongs to. NULL means
  -- unassigned; nothing currently requires this to be set (see
  -- migrations/010_sections_and_chapters.sql).
  section_id        INT NULL,
  subjects          VARCHAR(255) NULL,
  profile_photo     MEDIUMTEXT NULL,
  language          VARCHAR(10) NOT NULL DEFAULT 'en',
  created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_players_school FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE SET NULL,
  CONSTRAINT fk_players_section FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE SET NULL,
  INDEX idx_players_school_role (school_id, role)
) ENGINE=InnoDB;

-- Admin > Admin Users (console accounts) - who can sign in to /admin and
-- what they can manage there. Deliberately separate from `players` (role
-- ADMIN, the account that actually authenticates against
-- requireRole(ROLES.ADMIN)): this is a roster/permissions directory, not
-- a login table. password_hash is nullable and unused by the CRUD routes
-- today - reserved for if this table is ever wired into a real login flow.
CREATE TABLE IF NOT EXISTS admin_users (
  id             CHAR(36) PRIMARY KEY,
  name           VARCHAR(120) NOT NULL,
  email          VARCHAR(190) NOT NULL UNIQUE,
  password_hash  VARCHAR(255) NULL,
  role           ENUM('Super Admin', 'Admin', 'Support') NOT NULL DEFAULT 'Admin',
  permissions    JSON NULL,                     -- array of: Content | People | Reports | Settings
  status         ENUM('active', 'inactive', 'suspended') NOT NULL DEFAULT 'active',
  last_login     DATETIME NULL,
  created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- What a TEACHER account is assigned to teach (Admin > Teachers). Three
-- separate many-to-many tables rather than one wide one, since a teacher's
-- subjects/boards/classes are independent multiselects in the admin UI.
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

-- Extends the pattern above to sections. IMPORTANT: this and the three
-- tables above are INDEPENDENT many-to-many lists (a teacher's subjects,
-- boards, classes and sections are each their own unrelated set) - they
-- can't express "Chemistry ONLY for 10-A, not 10-B" as a single fact, only
-- "teaches Chemistry" and "assigned to 10-A" separately. Precise
-- (subject, board, grade, section) combinations per teacher need a
-- differently-shaped table - deliberately left for the server-side
-- teacher-authorization follow-up phase (see migrations/
-- 010_sections_and_chapters.sql's IMPORTANT LIMITATION note).
CREATE TABLE IF NOT EXISTS teacher_sections (
  teacher_id  CHAR(36) NOT NULL,
  section_id  INT NOT NULL,
  PRIMARY KEY (teacher_id, section_id),
  CONSTRAINT fk_teacher_sections_teacher FOREIGN KEY (teacher_id) REFERENCES players(id) ON DELETE CASCADE,
  CONSTRAINT fk_teacher_sections_section FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Recorded lesson+difficulty clears (POST /api/player/progress). Best
-- accuracy per key is kept, mirroring playerStore.recordLessonCompletion.
CREATE TABLE IF NOT EXISTS player_completions (
  player_id      CHAR(36) NOT NULL,
  grade          VARCHAR(5) NOT NULL,
  board          VARCHAR(10) NOT NULL,
  world_id       VARCHAR(40) NOT NULL,
  lesson_id      VARCHAR(10) NOT NULL,
  difficulty_id  VARCHAR(10) NOT NULL,
  accuracy       INT NOT NULL,
  stars          INT NOT NULL,
  xp             INT NOT NULL,
  coins          INT NOT NULL,
  completed_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (player_id, grade, board, world_id, lesson_id, difficulty_id),
  CONSTRAINT fk_completions_player FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Chapter Boss Battle clears (Section 21).
CREATE TABLE IF NOT EXISTS player_boss_defeats (
  player_id     CHAR(36) NOT NULL,
  grade         VARCHAR(5) NOT NULL,
  board         VARCHAR(10) NOT NULL,
  world_id      VARCHAR(40) NOT NULL,
  defeated_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (player_id, grade, board, world_id),
  CONSTRAINT fk_bossdefeats_player FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Owned cosmetic shop items (one-time purchase, category != powerups).
CREATE TABLE IF NOT EXISTS player_shop_items (
  player_id  CHAR(36) NOT NULL,
  item_id    VARCHAR(20) NOT NULL,
  owned_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (player_id, item_id),
  CONSTRAINT fk_shopowned_player FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
  CONSTRAINT fk_shopowned_item FOREIGN KEY (item_id) REFERENCES shop_items(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Currently equipped cosmetic per category (avatars/skins/backgrounds/frames/effects).
CREATE TABLE IF NOT EXISTS player_equipped (
  player_id  CHAR(36) NOT NULL,
  category   VARCHAR(20) NOT NULL,
  item_id    VARCHAR(20) NOT NULL,
  PRIMARY KEY (player_id, category),
  CONSTRAINT fk_equipped_player FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
  CONSTRAINT fk_equipped_item FOREIGN KEY (item_id) REFERENCES shop_items(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Stackable power-up charges (Section 20) - bought in Shop, spent in Battle.
CREATE TABLE IF NOT EXISTS player_powerups (
  player_id  CHAR(36) NOT NULL,
  item_id    VARCHAR(20) NOT NULL,
  count      INT NOT NULL DEFAULT 0,
  PRIMARY KEY (player_id, item_id),
  CONSTRAINT fk_powerups_player FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
  CONSTRAINT fk_powerups_item FOREIGN KEY (item_id) REFERENCES shop_items(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Daily quest claims, keyed by calendar day so a quest becomes claimable
-- again the next day with no cron job required.
CREATE TABLE IF NOT EXISTS quest_claims (
  player_id   CHAR(36) NOT NULL,
  quest_id    VARCHAR(10) NOT NULL,
  date_key    CHAR(10) NOT NULL,                -- YYYY-MM-DD
  claimed_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (player_id, quest_id, date_key),
  CONSTRAINT fk_questclaims_player FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
  CONSTRAINT fk_questclaims_quest FOREIGN KEY (quest_id) REFERENCES daily_quest_defs(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Per-question submissions (POST /api/quiz/submit) - finer-grained than
-- player_completions, kept for future analytics / adaptive difficulty.
CREATE TABLE IF NOT EXISTS quiz_submissions (
  id               BIGINT AUTO_INCREMENT PRIMARY KEY,
  player_id        CHAR(36) NOT NULL,
  question_id      VARCHAR(60) NOT NULL,
  selected_answer  VARCHAR(300) NULL,
  correct          TINYINT(1) NOT NULL,
  time_taken_ms    INT NULL,
  created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_submissions_player FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
  INDEX idx_submissions_player (player_id, created_at)
) ENGINE=InnoDB;
