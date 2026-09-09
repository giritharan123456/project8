const pool = require("./src/config/db.js");
const { hashPassword } = require("./src/lib/password");
(async () => {
  const pw = await hashPassword("demo1234");
  await pool.query("UPDATE players SET password_hash=? WHERE email IN (?,?)", [pw, "tgiri7717@gmail.com", "tgiri7797@gmail.com"]);
  const [rows] = await pool.query("SELECT id, name, email, role, school_id FROM players WHERE email IN (?,?)", ["tgiri7717@gmail.com", "tgiri7797@gmail.com"]);
  rows.forEach((r) => console.log(`${r.email}: ${r.name}, role=${r.role}, school=${r.school_id} -> password reset to demo1234`));
  process.exit(0);
})().catch((e) => { console.error(e.message); process.exit(1); });