require("dotenv").config({ path: require("path").join(__dirname, "..", "..", ".env") });
const pool = require("../config/db");
(async () => {
  const [tables] = await pool.query(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = DATABASE() ORDER BY table_name"
  );
  console.log("TABLES:");
  console.log(tables.map((t) => t.TABLE_NAME).join("\n"));
  const interesting = [
    "users", "students", "teachers", "admins", "classes", "subjects", "units", "tests",
    "quizzes", "questions", "attempts", "results", "assignments", "challenges",
    "progress", "player_progress", "notifications", "streams", "badges",
    "achievement_defs", "learning_contents", "player_achievements", "player_challenges",
    "quiz_attempts", "class_streams", "reports"
  ];
  for (const t of interesting) {
    try {
      const [r] = await pool.query("SELECT COUNT(*) c FROM `" + t + "`");
      console.log(t + "=" + r[0].c);
    } catch (e) {
      console.log(t + "=<missing>");
    }
  }
  await pool.end();
})().catch((e) => { console.error("ERR", e.message); process.exit(1); });