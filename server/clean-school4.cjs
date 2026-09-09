const pool = require("./src/config/db.js");
(async () => {
  const [rows] = await pool.query("SELECT id FROM players WHERE role='STUDENT' AND school_id=4");
  const ids = rows.map((r) => r.id);
  console.log("cleaning school4 students:", ids.length);
  if (!ids.length) process.exit(0);
  for (const [t, c] of [["player_completions", "player_id"], ["quiz_attempts", "player_id"], ["player_badges", "player_id"], ["mastery", "player_id"]]) {
    await pool.query(`DELETE FROM ${t} WHERE ${c} IN (?)`, [ids]);
  }
  await pool.query("DELETE FROM players WHERE id IN (?)", [ids]);
  console.log("done");
  process.exit(0);
})().catch((e) => { console.error(e.message); process.exit(1); });