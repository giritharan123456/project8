require("dotenv").config();
const pool = (require("./src/config/db").pool || require("./src/config/db")).promise();
(async () => {
  const [subs] = await pool.query("SELECT code, name FROM subjects ORDER BY sort_order");
  console.log("SUBJECTS", JSON.stringify(subs));
  const [teachers] = await pool.query("SELECT id, email, subjects FROM players WHERE role='TEACHER' LIMIT 20");
  console.log("TEACHERS\n" + teachers.map((t) => `${t.email} :: ${t.subjects}`).join("\n"));
  const [stud] = await pool.query("SELECT subjects, COUNT(*) c FROM players WHERE role='STUDENT' GROUP BY subjects LIMIT 12");
  console.log("STUDENT SUBJECT SETS\n" + stud.map((s) => `${s.subjects} x${s.c}`).join("\n"));
  process.exit(0);
})().catch((e) => { console.error(e.message); process.exit(1); });