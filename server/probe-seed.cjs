const pool = require("./src/config/db.js");
(async () => {
  for (const sid of [4, 5, 6, 9, 11, 12, 13]) {
    const [[st]] = await pool.query("SELECT COUNT(*) n FROM players WHERE school_id=? AND role='STUDENT'", [sid]);
    const [[co]] = await pool.query("SELECT COUNT(*) n FROM player_completions pc JOIN players p ON p.id=pc.player_id WHERE p.school_id=?", [sid]);
    const [[qa]] = await pool.query("SELECT COUNT(*) n FROM quiz_attempts q JOIN players p ON p.id=q.player_id WHERE p.school_id=?", [sid]);
    const [[pb]] = await pool.query("SELECT COUNT(*) n FROM player_badges b JOIN players p ON p.id=b.player_id WHERE p.school_id=?", [sid]);
    const [[ma]] = await pool.query("SELECT COUNT(*) n FROM mastery m JOIN players p ON p.id=m.player_id WHERE p.school_id=?", [sid]);
    console.log(`school ${sid}: students=${st.n} completions=${co.n} attempts=${qa.n} badges=${pb.n} mastery=${ma.n}`);
  }
  process.exit(0);
})().catch((e) => { console.error(e.message); process.exit(1); });