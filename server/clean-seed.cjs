const pool = require("./src/config/db.js");
(async () => {
  const [rows] = await pool.query(
    "SELECT id FROM players WHERE role='STUDENT' AND email LIKE '%.student%@demo.chemquest.gg'"
  );
  const ids = rows.map((r) => r.id);
  console.log("cleaning", ids.length, "seeded students");
  if (!ids.length) process.exit(0);
  const del = async (tbl, col) => {
    if (!ids.length) return;
    await pool.query(`DELETE FROM ${tbl} WHERE ${col} IN (?)`, [ids]);
  };
  await del("player_completions", "player_id");
  await del("quiz_attempts", "player_id");
  await del("player_badges", "player_id");
  await del("mastery", "player_id");
  await pool.query("DELETE FROM players WHERE id IN (?)", [ids]);
  const [teachers] = await pool.query(
    "SELECT id, subjects FROM players WHERE role='TEACHER' AND school_id IN (12,13)"
  );
  for (const t of teachers) {
    if (t.subjects && /[A-Z]/.test(t.subjects)) {
      await pool.query("UPDATE players SET subjects=NULL WHERE id=?", [t.id]);
    }
  }
  console.log("done");
  process.exit(0);
})().catch((e) => { console.error(e.message); process.exit(1); });