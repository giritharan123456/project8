require("dotenv").config({ path: require("path").join(__dirname, "..", "..", ".env") });
const pool = require("../config/db");

const TABLES = [
  "quizzes",
  "quiz_questions",
  "quiz_attempts",
  "quiz_answers",
  "quiz_attempt_answers",
  "quiz_submissions",
  "assignments",
  "assignment_submissions",
  "notifications",
  "player_completions",
  "player_boss_defeats",
  "mastery",
  "xp_transactions",
  "player_badges",
  "player_challenges",
  "quest_claims",
  "player_shop_items",
  "player_equipped",
  "player_powerups",
  "flashcard_sets",
  "flashcards",
  "shop_items",
  "units",
  "concepts",
  "topics",
  "learning_contents",
  "challenges",
  "badges",
  "subjects",
  "worlds",
  "lessons",
  "difficulties",
];

(async () => {
  for (const t of TABLES) {
    try {
      const [cols] = await pool.query(
        "SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_DEFAULT FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? ORDER BY ORDINAL_POSITION",
        [t]
      );
      if (cols.length === 0) {
        console.log(`\n== ${t} == <MISSING>`);
        continue;
      }
      console.log(`\n== ${t} (${cols.length} cols) ==`);
      console.log(cols.map((c) => `  ${c.COLUMN_NAME}: ${c.COLUMN_TYPE}${c.IS_NULLABLE === "NO" ? "*" : ""}${c.COLUMN_DEFAULT !== null ? ` =${c.COLUMN_DEFAULT}` : ""}`).join("\n"));
    } catch (e) {
      console.log(`\n== ${t} == ERR ${e.message}`);
    }
  }
  await pool.end();
})().catch((e) => {
  console.error("ERR", e.message);
  process.exit(1);
});