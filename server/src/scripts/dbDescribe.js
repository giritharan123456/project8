require("dotenv").config({ path: require("path").join(__dirname, "..", "..", ".env") });
const pool = require("../config/db");
(async () => {
  const counts = ["players", "teachers", "admin_users", "topics", "concepts", "xp_transactions", "player_completions", "quiz_submissions", "quiz_answers", "quest_claims", "player_badges", "mastery", "worlds", "board_categories", "boards"];
  for (const t of counts) {
    try { const [r] = await pool.query("SELECT COUNT(*) c FROM `" + t + "`"); console.log(t + "=" + r[0].c); } catch (e) { console.log(t + "=<missing>"); }
  }
  console.log("---DESCRIBE players---");
  const [p] = await pool.query("DESCRIBE players");
  console.log(p.map((c) => c.Field + ":" + c.Type + (c.Null === "NO" ? "*" : "")).join("\n"));
  console.log("---DESCRIBE teachers---");
  try { const [t] = await pool.query("DESCRIBE teachers"); console.log(t.map((c) => c.Field + ":" + c.Type).join("\n")); } catch (e) { console.log(e.message); }
  console.log("---DESCRIBE classes---");
  const [cl] = await pool.query("DESCRIBE classes");
  console.log(cl.map((c) => c.Field + ":" + c.Type).join("\n"));
  await pool.end();
})().catch((e) => { console.error("ERR", e.message); process.exit(1); });