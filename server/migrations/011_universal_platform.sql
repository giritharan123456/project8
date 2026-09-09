-- Migration 011: Universal Platform Tables
-- Adds 22 new tables covering curriculum hierarchy, quizzes, mastery,
-- flashcards, challenges, badges, notifications, streams, and more.
-- Safe to re-run: every CREATE TABLE uses IF NOT EXISTS.

USE chemquest;

-- =========================================================================
-- 1. units – between subjects and chapters
-- =========================================================================
CREATE TABLE IF NOT EXISTS units (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  subject_code  VARCHAR(30) NOT NULL,
  name          VARCHAR(150) NOT NULL,
  description   VARCHAR(500),
  icon          VARCHAR(40),
  sort_order    INT DEFAULT 0,
  status        ENUM('published','draft') DEFAULT 'published',
  CONSTRAINT fk_units_subject FOREIGN KEY (subject_code)
    REFERENCES subjects(code) ON DELETE CASCADE,
  INDEX idx_units_lookup (subject_code, sort_order)
) ENGINE=InnoDB;

-- =========================================================================
-- 2. concepts – between chapters and topics
-- =========================================================================
CREATE TABLE IF NOT EXISTS concepts (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  unit_id           INT NOT NULL,
  name              VARCHAR(150) NOT NULL,
  description       VARCHAR(500),
  sort_order        INT DEFAULT 0,
  difficulty_level  VARCHAR(20) DEFAULT 'intermediate',
  status            ENUM('published','draft') DEFAULT 'published',
  CONSTRAINT fk_concepts_unit FOREIGN KEY (unit_id)
    REFERENCES units(id) ON DELETE CASCADE,
  INDEX idx_concepts_lookup (unit_id, sort_order)
) ENGINE=InnoDB;

-- =========================================================================
-- 3. topics – leaf level of curriculum
-- =========================================================================
CREATE TABLE IF NOT EXISTS topics (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  concept_id    INT NOT NULL,
  name          VARCHAR(150) NOT NULL,
  content_text  TEXT,
  sort_order    INT DEFAULT 0,
  status        ENUM('published','draft') DEFAULT 'published',
  CONSTRAINT fk_topics_concept FOREIGN KEY (concept_id)
    REFERENCES concepts(id) ON DELETE CASCADE,
  INDEX idx_topics_lookup (concept_id, sort_order)
) ENGINE=InnoDB;

-- =========================================================================
-- 4. learning_contents – rich media per topic
-- =========================================================================
CREATE TABLE IF NOT EXISTS learning_contents (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  topic_id      INT NOT NULL,
  content_type  ENUM('text','image','video','audio','diagram','formula','example','flashcard') NOT NULL,
  title         VARCHAR(200),
  content_body  TEXT NOT NULL,
  media_url     VARCHAR(500),
  sort_order    INT DEFAULT 0,
  CONSTRAINT fk_learning_contents_topic FOREIGN KEY (topic_id)
    REFERENCES topics(id) ON DELETE CASCADE,
  INDEX idx_learning_contents_lookup (topic_id, sort_order)
) ENGINE=InnoDB;

-- =========================================================================
-- 5. quizzes – formal quiz entity
-- =========================================================================
CREATE TABLE IF NOT EXISTS quizzes (
  id                    VARCHAR(30) PRIMARY KEY,
  title                 VARCHAR(200) NOT NULL,
  description           TEXT,
  standard_id           VARCHAR(10),
  subject_code          VARCHAR(30),
  unit_id               INT,
  chapter_id            INT,
  concept_id            INT,
  question_count        INT DEFAULT 10,
  difficulty            VARCHAR(20) DEFAULT 'medium',
  time_limit_minutes    INT DEFAULT 30,
  max_attempts          INT DEFAULT 3,
  xp_reward             INT DEFAULT 100,
  coins_reward          INT DEFAULT 50,
  passing_score         INT DEFAULT 60,
  mastery_threshold     INT DEFAULT 80,
  randomize_questions   TINYINT(1) DEFAULT 1,
  randomize_options     TINYINT(1) DEFAULT 1,
  start_date            DATETIME,
  end_date              DATETIME,
  visibility            ENUM('published','draft','archived') DEFAULT 'draft',
  game_mode             ENUM('practice','test','live','homework','challenge','mastery') DEFAULT 'practice',
  created_by            CHAR(36),
  created_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_quizzes_subject FOREIGN KEY (subject_code)
    REFERENCES subjects(code) ON DELETE SET NULL,
  CONSTRAINT fk_quizzes_unit FOREIGN KEY (unit_id)
    REFERENCES units(id) ON DELETE SET NULL,
  CONSTRAINT fk_quizzes_chapter FOREIGN KEY (chapter_id)
    REFERENCES chapters(id) ON DELETE SET NULL,
  CONSTRAINT fk_quizzes_concept FOREIGN KEY (concept_id)
    REFERENCES concepts(id) ON DELETE SET NULL,
  CONSTRAINT fk_quizzes_creator FOREIGN KEY (created_by)
    REFERENCES players(id) ON DELETE SET NULL,
  INDEX idx_quizzes_subject_standard (subject_code, standard_id),
  INDEX idx_quizzes_creator (created_by)
) ENGINE=InnoDB;

-- =========================================================================
-- 6. quiz_questions – linking quiz ↔ question bank
-- =========================================================================
CREATE TABLE IF NOT EXISTS quiz_questions (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  quiz_id       VARCHAR(30) NOT NULL,
  question_id   INT NOT NULL,
  sort_order    INT DEFAULT 0,
  marks         INT DEFAULT 1,
  UNIQUE KEY uq_quiz_question (quiz_id, question_id),
  CONSTRAINT fk_quiz_questions_quiz FOREIGN KEY (quiz_id)
    REFERENCES quizzes(id) ON DELETE CASCADE,
  CONSTRAINT fk_quiz_questions_question FOREIGN KEY (question_id)
    REFERENCES questions(id) ON DELETE CASCADE,
  INDEX idx_quiz_questions_quiz (quiz_id)
) ENGINE=InnoDB;

-- =========================================================================
-- 7. quiz_attempts – player attempt at a quiz
-- =========================================================================
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id                VARCHAR(30) PRIMARY KEY,
  quiz_id           VARCHAR(30) NOT NULL,
  player_id         CHAR(36) NOT NULL,
  started_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at      TIMESTAMP NULL,
  time_taken_ms     INT NULL,
  total_questions   INT DEFAULT 0,
  correct_count     INT DEFAULT 0,
  incorrect_count   INT DEFAULT 0,
  skipped_count     INT DEFAULT 0,
  score             DECIMAL(5,2) DEFAULT 0,
  accuracy          DECIMAL(5,2) DEFAULT 0,
  xp_earned         INT DEFAULT 0,
  coins_earned      INT DEFAULT 0,
  status            ENUM('in_progress','completed','abandoned') DEFAULT 'in_progress',
  CONSTRAINT fk_quiz_attempts_quiz FOREIGN KEY (quiz_id)
    REFERENCES quizzes(id) ON DELETE CASCADE,
  CONSTRAINT fk_quiz_attempts_player FOREIGN KEY (player_id)
    REFERENCES players(id) ON DELETE CASCADE,
  INDEX idx_quiz_attempts_quiz_player (quiz_id, player_id),
  INDEX idx_quiz_attempts_player_date (player_id, started_at)
) ENGINE=InnoDB;

-- =========================================================================
-- 8. quiz_answers – per-question answer in an attempt
-- =========================================================================
CREATE TABLE IF NOT EXISTS quiz_answers (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  attempt_id        VARCHAR(30) NOT NULL,
  question_id       INT NOT NULL,
  selected_answer   VARCHAR(300),
  correct           TINYINT(1) DEFAULT 0,
  time_taken_ms     INT,
  xp_earned         INT DEFAULT 0,
  CONSTRAINT fk_quiz_answers_attempt FOREIGN KEY (attempt_id)
    REFERENCES quiz_attempts(id) ON DELETE CASCADE,
  CONSTRAINT fk_quiz_answers_question FOREIGN KEY (question_id)
    REFERENCES questions(id) ON DELETE CASCADE,
  INDEX idx_quiz_answers_attempt (attempt_id)
) ENGINE=InnoDB;

-- =========================================================================
-- 9. mastery – concept-level mastery tracking
-- =========================================================================
CREATE TABLE IF NOT EXISTS mastery (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  player_id         CHAR(36) NOT NULL,
  subject_code      VARCHAR(30) NOT NULL,
  unit_id           INT,
  chapter_id        INT,
  concept_id        INT,
  total_attempts    INT DEFAULT 0,
  correct_count     INT DEFAULT 0,
  accuracy          DECIMAL(5,2) DEFAULT 0,
  mastery_level     ENUM('not_started','learning','practicing','strong','mastered') DEFAULT 'not_started',
  last_attempted_at TIMESTAMP,
  UNIQUE KEY uq_mastery_combination (player_id, subject_code, unit_id, chapter_id, concept_id),
  CONSTRAINT fk_mastery_player FOREIGN KEY (player_id)
    REFERENCES players(id) ON DELETE CASCADE,
  INDEX idx_mastery_player_subject (player_id, subject_code)
) ENGINE=InnoDB;

-- =========================================================================
-- 10. assignments – teacher-assigned quizzes
-- =========================================================================
CREATE TABLE IF NOT EXISTS assignments (
  id                  VARCHAR(30) PRIMARY KEY,
  quiz_id             VARCHAR(30) NOT NULL,
  teacher_id          CHAR(36) NOT NULL,
  class_id            INT,
  board_code          VARCHAR(10),
  section_id          INT,
  title               VARCHAR(200) NOT NULL,
  instructions        TEXT,
  start_date          DATETIME,
  due_date            DATETIME NOT NULL,
  max_attempts        INT DEFAULT 3,
  time_limit_minutes  INT,
  status              ENUM('published','draft','archived') DEFAULT 'draft',
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_assignments_quiz FOREIGN KEY (quiz_id)
    REFERENCES quizzes(id) ON DELETE CASCADE,
  CONSTRAINT fk_assignments_teacher FOREIGN KEY (teacher_id)
    REFERENCES players(id) ON DELETE CASCADE,
  CONSTRAINT fk_assignments_class FOREIGN KEY (class_id)
    REFERENCES classes(grade) ON DELETE CASCADE,
  CONSTRAINT fk_assignments_board FOREIGN KEY (board_code)
    REFERENCES boards(code) ON DELETE SET NULL,
  INDEX idx_assignments_teacher (teacher_id),
  INDEX idx_assignments_class_board (class_id, board_code)
) ENGINE=InnoDB;

-- =========================================================================
-- 11. notifications – in-app notification feed
-- =========================================================================
CREATE TABLE IF NOT EXISTS notifications (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  player_id     CHAR(36) NOT NULL,
  type          ENUM('assignment','quiz','challenge','achievement','streak','announcement','deadline','mastery','leaderboard','content') NOT NULL,
  title         VARCHAR(200) NOT NULL,
  message       TEXT,
  link          VARCHAR(500),
  `read`        TINYINT(1) DEFAULT 0,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notifications_player FOREIGN KEY (player_id)
    REFERENCES players(id) ON DELETE CASCADE,
  INDEX idx_notifications_player_read (player_id, `read`, created_at)
) ENGINE=InnoDB;

-- =========================================================================
-- 12. flashcard_sets – collection of flashcards
-- =========================================================================
CREATE TABLE IF NOT EXISTS flashcard_sets (
  id            VARCHAR(30) PRIMARY KEY,
  player_id     CHAR(36),
  subject_code  VARCHAR(30),
  title         VARCHAR(200) NOT NULL,
  description   TEXT,
  card_count    INT DEFAULT 0,
  is_public     TINYINT(1) DEFAULT 0,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_flashcard_sets_player FOREIGN KEY (player_id)
    REFERENCES players(id) ON DELETE SET NULL,
  INDEX idx_flashcard_sets_player (player_id),
  INDEX idx_flashcard_sets_subject (subject_code)
) ENGINE=InnoDB;

-- =========================================================================
-- 13. flashcards – individual cards within a set
-- =========================================================================
CREATE TABLE IF NOT EXISTS flashcards (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  set_id            VARCHAR(30) NOT NULL,
  front_text        TEXT NOT NULL,
  back_text         TEXT NOT NULL,
  front_media       VARCHAR(500),
  back_media        VARCHAR(500),
  difficulty        ENUM('easy','medium','hard') DEFAULT 'medium',
  next_review_at    TIMESTAMP,
  review_count      INT DEFAULT 0,
  ease_factor       DECIMAL(3,2) DEFAULT 2.50,
  sort_order        INT DEFAULT 0,
  CONSTRAINT fk_flashcards_set FOREIGN KEY (set_id)
    REFERENCES flashcard_sets(id) ON DELETE CASCADE,
  INDEX idx_flashcards_set (set_id, sort_order)
) ENGINE=InnoDB;

-- =========================================================================
-- 14. challenges – daily / weekly / special challenges
-- =========================================================================
CREATE TABLE IF NOT EXISTS challenges (
  id              VARCHAR(30) PRIMARY KEY,
  title           VARCHAR(200) NOT NULL,
  description     TEXT,
  subject_code    VARCHAR(30),
  challenge_type  ENUM('daily','weekly','special') DEFAULT 'daily',
  target_count    INT DEFAULT 10,
  xp_reward       INT DEFAULT 50,
  coins_reward    INT DEFAULT 25,
  start_date      DATETIME,
  end_date        DATETIME,
  status          ENUM('active','completed','expired') DEFAULT 'active',
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_challenges_type_status (challenge_type, status)
) ENGINE=InnoDB;

-- =========================================================================
-- 15. player_challenges – per-player progress on a challenge
-- =========================================================================
CREATE TABLE IF NOT EXISTS player_challenges (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  player_id     CHAR(36) NOT NULL,
  challenge_id  VARCHAR(30) NOT NULL,
  progress      INT DEFAULT 0,
  completed     TINYINT(1) DEFAULT 0,
  claimed       TINYINT(1) DEFAULT 0,
  completed_at  TIMESTAMP NULL,
  UNIQUE KEY uq_player_challenge (player_id, challenge_id),
  CONSTRAINT fk_player_challenges_player FOREIGN KEY (player_id)
    REFERENCES players(id) ON DELETE CASCADE,
  CONSTRAINT fk_player_challenges_challenge FOREIGN KEY (challenge_id)
    REFERENCES challenges(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =========================================================================
-- 16. xp_transactions – XP ledger
-- =========================================================================
CREATE TABLE IF NOT EXISTS xp_transactions (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  player_id     CHAR(36) NOT NULL,
  amount        INT NOT NULL,
  source        VARCHAR(50) NOT NULL,
  reference_id  VARCHAR(100),
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_xp_transactions_player FOREIGN KEY (player_id)
    REFERENCES players(id) ON DELETE CASCADE,
  INDEX idx_xp_transactions_player_date (player_id, created_at)
) ENGINE=InnoDB;

-- =========================================================================
-- 17. badges – badge definitions
-- =========================================================================
CREATE TABLE IF NOT EXISTS badges (
  id            VARCHAR(30) PRIMARY KEY,
  name          VARCHAR(80) NOT NULL,
  description   VARCHAR(200) NOT NULL,
  icon          VARCHAR(40) NOT NULL,
  category      ENUM('learning','accuracy','speed','consistency','mastery','exploration','challenge','streak') NOT NULL,
  xp_reward     INT DEFAULT 0,
  sort_order    INT DEFAULT 0,
  status        ENUM('active','hidden') DEFAULT 'active'
) ENGINE=InnoDB;

-- =========================================================================
-- 18. player_badges – earned badges per player
-- =========================================================================
CREATE TABLE IF NOT EXISTS player_badges (
  player_id   CHAR(36) NOT NULL,
  badge_id    VARCHAR(30) NOT NULL,
  earned_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (player_id, badge_id),
  CONSTRAINT fk_player_badges_player FOREIGN KEY (player_id)
    REFERENCES players(id) ON DELETE CASCADE,
  CONSTRAINT fk_player_badges_badge FOREIGN KEY (badge_id)
    REFERENCES badges(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =========================================================================
-- 19. streams – for grades 11-12
-- =========================================================================
CREATE TABLE IF NOT EXISTS streams (
  id          VARCHAR(20) PRIMARY KEY,
  name        VARCHAR(60) NOT NULL,
  description VARCHAR(200),
  sort_order  INT DEFAULT 0
) ENGINE=InnoDB;

-- =========================================================================
-- 20. class_streams – grade ↔ stream mapping
-- =========================================================================
CREATE TABLE IF NOT EXISTS class_streams (
  grade       INT NOT NULL,
  stream_id   VARCHAR(20) NOT NULL,
  PRIMARY KEY (grade, stream_id),
  CONSTRAINT fk_class_streams_class FOREIGN KEY (grade)
    REFERENCES classes(grade) ON DELETE CASCADE,
  CONSTRAINT fk_class_streams_stream FOREIGN KEY (stream_id)
    REFERENCES streams(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =========================================================================
-- 21. audit_logs – system-wide action log
-- =========================================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  user_id         CHAR(36),
  action          VARCHAR(50) NOT NULL,
  resource_type   VARCHAR(50) NOT NULL,
  resource_id     VARCHAR(100),
  details         JSON,
  ip_address      VARCHAR(45),
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_audit_logs_user_date (user_id, created_at),
  INDEX idx_audit_logs_resource_date (resource_type, created_at)
) ENGINE=InnoDB;

-- =========================================================================
-- 22. report_templates – saved report configurations
-- =========================================================================
CREATE TABLE IF NOT EXISTS report_templates (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  description   TEXT,
  report_type   ENUM('student','class','subject','quiz','leaderboard') NOT NULL,
  config        JSON,
  created_by    CHAR(36),
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
