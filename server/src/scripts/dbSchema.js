require("dotenv").config({ path: require("path").join(__dirname, "..", "..", ".env") });
const pool = require("../config/db");
(async () => {
  const tables = ["quizzes", "quiz_questions", "quiz_attempts", "quiz_submissions", "quiz_answers", "questions", "xp_transactions", "mastery", "player_completions", "player_badges", "assignments", "notifications", "player_challenges", "challenges", "worlds", "units", "concepts", "subjects", "boards"];
  for (const t of tables) {
    try {
      const [cols] = await pool.query("DESCRIBE `" + t + "`");
      console.log("### " + t);
      console.log(cols.map((c) => c.Field + ":" + c.Type + (c.Key ? "(K)" : "")).join(" | "));
    } catch (e) {
      console.log("### " + t + " = missing");
    }
  }
  await pool.end();
})().catch((e) => { console.error("ERR", e.message); process.exit(1); });