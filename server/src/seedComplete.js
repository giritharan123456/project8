// Seeds the universal-platform tables added by migrations/011_universal_platform.sql
// (badges, streams, class_streams, challenges, flashcard_sets, flashcards, quizzes,
// achievement definitions expansion). Safe to re-run: TRUNCATEs the new content
// tables first, leaves player-owned tables untouched.
//
//   npm run seed:complete

require("dotenv").config();
const pool = require("./config/db");
const {
  SUBJECTS,
  ACHIEVEMENT_DEFS,
  CHALLENGE_DEFS,
  FLASHCARD_SETS,
  FLASHCARDS,
  ALL_QUESTIONS,
  DAILY_QUEST_DEFS,
  QUIZZES,
} = require("./data/seedDataComplete");
const { WORLD_TEMPLATE } = require("./data/seedData");

async function run() {
  const conn = await pool.getConnection();
  try {
    console.log("Clearing universal-platform content tables...");
    await conn.query("SET FOREIGN_KEY_CHECKS = 0");
    for (const table of [
      "flashcards",
      "flashcard_sets",
      "player_challenges",
      "challenges",
      "class_streams",
      "streams",
      "player_badges",
      "badges",
      "quiz_questions",
      "quizzes",
      "concepts",
      "topics",
      "learning_contents",
      "units",
    ]) {
      await conn.query(`TRUNCATE TABLE ${table}`);
    }
    await conn.query("SET FOREIGN_KEY_CHECKS = 1");

    console.log("Seeding subjects (ensure all 9 exist)...");
    for (const [i, s] of SUBJECTS.entries()) {
      await conn.query(
        "INSERT INTO subjects (code, name, icon, description, status, sort_order) VALUES (?,?,?,?,?,?) ON DUPLICATE KEY UPDATE name=VALUES(name), icon=VALUES(icon), description=VALUES(description), status=VALUES(status)",
        [s.code, s.name, s.icon, s.description, s.status || "active", i]
      );
    }

    console.log("Seeding achievement definitions...");
    const [achCount] = await conn.query("SELECT COUNT(*) as c FROM achievement_defs");
    if (Number(achCount[0].c) === 0) {
      for (const [i, a] of ACHIEVEMENT_DEFS.entries()) {
        await conn.query(
          "INSERT INTO achievement_defs (id, icon, name, description, sort_order) VALUES (?,?,?,?,?)",
          [a.id, a.icon, a.name, a.description, i]
        );
      }
    } else {
      console.log(`  (${achCount[0].c} existing achievement_defs kept)`);
    }

    console.log("Seeding daily quest definitions (if empty)...");
    const [dqCount] = await conn.query("SELECT COUNT(*) as c FROM daily_quest_defs");
    if (Number(dqCount[0].c) === 0) {
      for (const [i, q] of DAILY_QUEST_DEFS.entries()) {
        await conn.query(
          "INSERT INTO daily_quest_defs (id, title, target, xp, coins, sort_order) VALUES (?,?,?,?,?,?)",
          [q.id, q.title, q.target, q.xp, q.coins, i]
        );
      }
    } else {
      console.log(`  (${dqCount[0].c} existing daily_quest_defs kept)`);
    }

    console.log("Seeding badges...");
    const BADGES = [
      { id: "first-quiz", name: "First Quiz", description: "Completed your first quiz", icon: "Target", category: "learning", xp_reward: 50, sort_order: 1 },
      { id: "quiz-10", name: "Quiz Champion", description: "Completed 10 quizzes", icon: "Swords", category: "learning", xp_reward: 100, sort_order: 2 },
      { id: "perfect-score", name: "Perfect Score", description: "Scored 100% on a quiz", icon: "Award", category: "accuracy", xp_reward: 150, sort_order: 3 },
      { id: "accuracy-90", name: "Sharp Shooter", description: "Achieved 90%+ accuracy", icon: "Crosshair", category: "accuracy", xp_reward: 100, sort_order: 4 },
      { id: "speed-solver", name: "Speed Solver", description: "Answered in under 5 seconds", icon: "Zap", category: "speed", xp_reward: 80, sort_order: 5 },
      { id: "streak-7", name: "Weekly Warrior", description: "7 day streak", icon: "Flame", category: "streak", xp_reward: 100, sort_order: 6 },
      { id: "streak-30", name: "Monthly Master", description: "30 day streak", icon: "Flame", category: "streak", xp_reward: 300, sort_order: 7 },
      { id: "concept-master", name: "Concept Master", description: "Mastered your first concept", icon: "Crown", category: "mastery", xp_reward: 120, sort_order: 8 },
      { id: "subject-master", name: "Subject Master", description: "Mastered an entire subject", icon: "BookOpen", category: "mastery", xp_reward: 500, sort_order: 9 },
      { id: "explorer", name: "Explorer", description: "Visited 5 different worlds", icon: "Map", category: "exploration", xp_reward: 80, sort_order: 10 },
      { id: "challenge-taker", name: "Challenge Taker", description: "Completed your first challenge", icon: "Flag", category: "challenge", xp_reward: 80, sort_order: 11 },
      { id: "daily-devotee", name: "Daily Devotee", description: "Played 3 days in a row", icon: "CalendarCheck", category: "consistency", xp_reward: 60, sort_order: 12 },
      { id: "question-100", name: "Century", description: "Answered 100 questions", icon: "ListChecks", category: "consistency", xp_reward: 150, sort_order: 13 },
      { id: "boss-slayer", name: "Boss Slayer", description: "Defeated 3 chapter bosses", icon: "Skull", category: "exploration", xp_reward: 150, sort_order: 14 },
      { id: "level-5", name: "Level Up!", description: "Reached Level 5", icon: "TrendingUp", category: "learning", xp_reward: 100, sort_order: 15 },
      { id: "level-10", name: "Rising Star", description: "Reached Level 10", icon: "Star", category: "learning", xp_reward: 200, sort_order: 16 },
      { id: "level-25", name: "Upward Trajectory", description: "Reached Level 25", icon: "Rocket", category: "learning", xp_reward: 400, sort_order: 17 },
      { id: "level-50", name: "Learning Legend", description: "Reached Level 50", icon: "Medal", category: "learning", xp_reward: 1000, sort_order: 18 },
    ];
    for (const [i, b] of BADGES.entries()) {
      await conn.query(
        "INSERT INTO badges (id, name, description, icon, category, xp_reward, sort_order, status) VALUES (?,?,?,?,?,?,?,'active')",
        [b.id, b.name, b.description, b.icon, b.category, b.xp_reward, b.sort_order || i]
      );
    }

    console.log("Seeding streams...");
    const STREAMS = [
      { id: "science", name: "Science Stream", description: "Physics, Chemistry, Biology, Mathematics, Computer Science", sort_order: 1 },
      { id: "commerce", name: "Commerce Stream", description: "Accountancy, Business Studies, Economics, Mathematics", sort_order: 2 },
      { id: "arts", name: "Arts Stream", description: "History, Psychology, Political Science, Economics, Geography", sort_order: 3 },
    ];
    for (const [i, st] of STREAMS.entries()) {
      await conn.query(
        "INSERT INTO streams (id, name, description, sort_order) VALUES (?,?,?,?)",
        [st.id, st.name, st.description, st.sort_order]
      );
    }

    console.log("Seeding class_streams (grades 11-12)...");
    const CLASS_STREAMS = [
      [11, "science"], [11, "commerce"], [11, "arts"],
      [12, "science"], [12, "commerce"], [12, "arts"],
    ];
    for (const [grade, streamId] of CLASS_STREAMS) {
      await conn.query(
        "INSERT IGNORE INTO class_streams (grade, stream_id) VALUES (?,?)",
        [grade, streamId]
      );
    }

    console.log("Seeding challenges...");
    for (const [i, c] of CHALLENGE_DEFS.entries()) {
      await conn.query(
        `INSERT INTO challenges (id, title, description, subject_code, challenge_type, target_count, xp_reward, coins_reward, start_date, end_date, status)
         VALUES (?,?,?,?,?,?,?,?,?,?,'active')`,
        [
          c.id,
          c.title,
          c.description || "",
          c.subject_code || null,
          c.challenge_type || "daily",
          c.target_count || 10,
          c.xp_reward || 50,
          c.coins_reward || 25,
          new Date(Date.now() - 86400000),
          new Date(Date.now() + 7 * 86400000),
        ]
      );
    }

    console.log("Seeding flashcard sets...");
    for (const [i, set] of FLASHCARD_SETS.entries()) {
      await conn.query(
        "INSERT INTO flashcard_sets (id, subject_code, title, description, card_count, is_public) VALUES (?,?,?,?,0,1)",
        [set.id, set.subject_code || null, set.title, set.description || "", set.card_count || 0]
      );
    }

    console.log("Seeding flashcards...");
    for (const [i, card] of FLASHCARDS.entries()) {
      await conn.query(
        "INSERT INTO flashcards (set_id, front_text, back_text, difficulty, sort_order) VALUES (?,?,?,?,?)",
        [card.setId, card.front, card.back, card.difficulty || "medium", i % 20]
      );
    }

    console.log("Seeding sample quizzes...");
    // Resolve a real world for each quiz subject so the linked questions can
    // satisfy the worlds(id) FK. Subjects with authored worlds reuse the first
    // non-final one; subjects without one get a lightweight practice-hub world
    // so their quizzes aren't silently dropped (INSERT IGNORE swallows FK
    // failures, which previously left every quiz with zero questions).
    const worldBySubject = {};
    for (const w of WORLD_TEMPLATE) {
      const subjectCode = w.subjectCode || "chemistry";
      if (!w.isFinal && !worldBySubject[subjectCode]) {
        worldBySubject[subjectCode] = w.id;
      }
    }
    for (const q of QUIZZES) {
      let worldId = worldBySubject[q.subject_code];
      if (!worldId) {
        const subject = SUBJECTS.find((s) => s.code === q.subject_code);
        worldId = `${q.subject_code}-quiz-hub`;
        await conn.query(
          "INSERT IGNORE INTO worlds (id, subject_code, name, topic, icon, boss, is_final, sort_order) VALUES (?,?,?,?,?,?,0,0)",
          [
            worldId,
            q.subject_code,
            subject ? subject.name : q.subject_code,
            "Quiz Catalogue",
            subject ? subject.icon : "Target",
            "Quiz Colossus",
          ]
        );
        worldBySubject[q.subject_code] = worldId;
      }

      await conn.query(
        `INSERT INTO quizzes (id, title, description, subject_code, difficulty, question_count, time_limit_minutes, max_attempts, xp_reward, coins_reward, passing_score, mastery_threshold, randomize_questions, randomize_options, visibility, game_mode)
         VALUES (?,?,?,?,?,10,?,3,100,50,60,80,1,1,'published','practice')`,
        [q.id, q.title, q.description, q.subject_code, q.difficulty, q.min]
      );

      // Link up to 10 questions of the same subject that exist in ALL_QUESTIONS
      const questionPool = ALL_QUESTIONS.filter(
        (qu) => qu.subject === q.subject_code && qu.difficulty === q.difficulty
      ).slice(0, 10);
      for (const [qi, question] of questionPool.entries()) {
        // questions.id is INT AUTO_INCREMENT - re-use an existing match for
        // the same (world, text) so re-running seed:complete stays idempotent.
        const [[existing]] = await conn.query(
          "SELECT id FROM questions WHERE world_id = ? AND question_text = ? AND board_code IS NULL ORDER BY id DESC LIMIT 1",
          [worldId, question.text]
        );
        let questionId;
        if (existing) {
          questionId = existing.id;
        } else {
          const [res] = await conn.query(
            `INSERT INTO questions
              (world_id, board_code, difficulty_id, type, question_text, options_json, pairs_json, image, correct_answer, explanation, sort_order)
             VALUES (?,NULL,?,?,?,?,NULL,NULL,?,?,?)`,
            [
              worldId,
              question.difficulty || "easy",
              question.type || "mcq",
              question.text,
              question.options ? JSON.stringify(question.options) : null,
              question.answer,
              question.explanation || "No explanation provided.",
              qi,
            ]
          );
          questionId = res.insertId;
        }
        await conn.query(
          "INSERT IGNORE INTO quiz_questions (quiz_id, question_id, sort_order, marks) VALUES (?,?,?,1)",
          [q.id, questionId, qi]
        );
      }
    }

    console.log("Seed complete.");
  } finally {
    conn.release();
    await pool.end();
  }
}

run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});