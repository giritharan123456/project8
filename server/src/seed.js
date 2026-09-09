// Populates the schema created by schema.sql with the curriculum content
// from src/data/seedData.js. Safe to re-run (TRUNCATEs content tables first;
// player-owned tables are left untouched).
//
//   npm run seed

require("dotenv").config();
const pool = require("./config/db");
const {
  SUBJECTS,
  DIFFICULTIES,
  CLASSES,
  BOARD_CATEGORIES,
  WORLD_TEMPLATE,
  LESSONS_BY_WORLD,
  LESSONS_BY_WORLD_BOARD_OVERRIDES,
  QUESTION_BANK,
  QUESTION_BANK_BOARD_OVERRIDES,
  SHOP_ITEMS,
  ACHIEVEMENT_DEFS,
  DAILY_QUEST_DEFS,
} = require("./data/seedData");

async function run() {
  const conn = await pool.getConnection();
  try {
    console.log("Clearing existing content tables...");
    await conn.query("SET FOREIGN_KEY_CHECKS = 0");
    for (const table of [
      "questions",
      "lessons",
      "worlds",
      "subjects",
      "boards",
      "board_categories",
      "classes",
      "difficulties",
      "shop_items",
      "achievement_defs",
      "daily_quest_defs",
    ]) {
      await conn.query(`TRUNCATE TABLE ${table}`);
    }
    await conn.query("SET FOREIGN_KEY_CHECKS = 1");

    console.log("Seeding subjects...");
    for (const [i, s] of SUBJECTS.entries()) {
      await conn.query(
        "INSERT INTO subjects (code, name, icon, description, status, sort_order) VALUES (?,?,?,?,?,?)",
        [s.code, s.name, s.icon, s.description, s.status || "active", i]
      );
    }

    console.log("Seeding difficulties...");
    for (const [i, d] of DIFFICULTIES.entries()) {
      await conn.query(
        "INSERT INTO difficulties (id, label, description, xp, coins, unlock_threshold, sort_order) VALUES (?,?,?,?,?,?,?)",
        [d.id, d.label, d.description, d.xp, d.coins, d.unlockThreshold, i]
      );
    }

    console.log("Seeding classes...");
    for (const c of CLASSES) {
      await conn.query(
        "INSERT INTO classes (grade, icon, courses, lessons, questions, difficulty_label) VALUES (?,?,?,?,?,?)",
        [c.grade, c.icon, c.courses, c.lessons, c.questions, c.difficulty]
      );
    }

    console.log("Seeding boards...");
    let boardSort = 0;
    for (const [catIndex, group] of BOARD_CATEGORIES.entries()) {
      const [result] = await conn.query(
        "INSERT INTO board_categories (category, sort_order) VALUES (?,?)",
        [group.category, catIndex]
      );
      const categoryId = result.insertId;
      for (const b of group.boards) {
        await conn.query(
          "INSERT INTO boards (code, category_id, name, type, description, courses, lessons, icon, sort_order) VALUES (?,?,?,?,?,?,?,?,?)",
          [b.code, categoryId, b.name, b.type, b.description, b.courses, b.lessons, b.icon, boardSort++]
        );
      }
    }

    console.log("Seeding worlds...");
    // sort_order is per-subject (0, 1, 2...) not a global running index, so
    // each subject's world map starts at its own world 0 - track a
    // per-subject counter instead of reusing the loop index i.
    const worldSortBySubject = {};
    for (const w of WORLD_TEMPLATE) {
      const subjectCode = w.subjectCode || "chemistry";
      const sortOrder = worldSortBySubject[subjectCode] ?? 0;
      worldSortBySubject[subjectCode] = sortOrder + 1;
      await conn.query(
        "INSERT INTO worlds (id, subject_code, name, topic, icon, boss, is_final, sort_order) VALUES (?,?,?,?,?,?,?,?)",
        [w.id, subjectCode, w.name, w.topic, w.icon, w.boss, w.isFinal ? 1 : 0, sortOrder]
      );
    }

    console.log("Seeding lessons (shared template)...");
    for (const [worldId, lessonList] of Object.entries(LESSONS_BY_WORLD)) {
      for (const [i, lesson] of lessonList.entries()) {
        await conn.query(
          "INSERT INTO lessons (world_id, board_code, lesson_key, title, description, sort_order) VALUES (?,NULL,?,?,?,?)",
          [worldId, lesson.id, lesson.title, lesson.description, i]
        );
      }
    }

    console.log("Seeding lessons (board overrides)...");
    for (const [key, lessonList] of Object.entries(LESSONS_BY_WORLD_BOARD_OVERRIDES)) {
      const [boardCode, worldId] = key.split(":");
      for (const [i, lesson] of lessonList.entries()) {
        await conn.query(
          "INSERT INTO lessons (world_id, board_code, lesson_key, title, description, sort_order) VALUES (?,?,?,?,?,?)",
          [worldId, boardCode, lesson.id, lesson.title, lesson.description, i]
        );
      }
    }

    console.log("Seeding questions (shared template)...");
    for (const [worldId, byDifficulty] of Object.entries(QUESTION_BANK)) {
      for (const [difficultyId, pool] of Object.entries(byDifficulty)) {
        for (const [i, item] of pool.entries()) {
          await conn.query(
            `INSERT INTO questions
              (world_id, board_code, difficulty_id, type, question_text, options_json, pairs_json, image, correct_answer, explanation, sort_order)
             VALUES (?,NULL,?,?,?,?,?,?,?,?,?)`,
            [
              worldId,
              difficultyId,
              item.type || "mcq",
              item.q,
              item.options ? JSON.stringify(item.options) : null,
              item.pairs ? JSON.stringify(item.pairs) : null,
              item.image || null,
              item.answer,
              item.explanation,
              i,
            ]
          );
        }
      }
    }

    console.log("Seeding questions (board overrides)...");
    for (const [key, byDifficulty] of Object.entries(QUESTION_BANK_BOARD_OVERRIDES)) {
      const [boardCode, worldId] = key.split(":");
      for (const [difficultyId, pool] of Object.entries(byDifficulty)) {
        for (const [i, item] of pool.entries()) {
          await conn.query(
            `INSERT INTO questions
              (world_id, board_code, difficulty_id, type, question_text, options_json, pairs_json, image, correct_answer, explanation, sort_order)
             VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
            [
              worldId,
              boardCode,
              difficultyId,
              item.type || "mcq",
              item.q,
              item.options ? JSON.stringify(item.options) : null,
              item.pairs ? JSON.stringify(item.pairs) : null,
              item.image || null,
              item.answer,
              item.explanation,
              i,
            ]
          );
        }
      }
    }

    console.log("Seeding shop items...");
    for (const [i, item] of SHOP_ITEMS.entries()) {
      await conn.query(
        "INSERT INTO shop_items (id, category, name, icon, price, description, sort_order) VALUES (?,?,?,?,?,?,?)",
        [item.id, item.category, item.name, item.icon, item.price, item.description || null, i]
      );
    }

    console.log("Seeding achievement definitions...");
    for (const [i, a] of ACHIEVEMENT_DEFS.entries()) {
      await conn.query(
        "INSERT INTO achievement_defs (id, icon, name, description, sort_order) VALUES (?,?,?,?,?)",
        [a.id, a.icon, a.name, a.description, i]
      );
    }

    console.log("Seeding daily quest definitions...");
    for (const [i, q] of DAILY_QUEST_DEFS.entries()) {
      await conn.query(
        "INSERT INTO daily_quest_defs (id, title, target, xp, coins, sort_order) VALUES (?,?,?,?,?,?)",
        [q.id, q.title, q.target, q.xp, q.coins, i]
      );
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
