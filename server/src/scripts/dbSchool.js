require("dotenv").config({ path: require("path").join(__dirname, "..", "..", ".env") });
const pool = require("../config/db");
(async () => {
  console.log("---schools---");
  try { const [t] = await pool.query("SELECT * FROM schools"); console.log(JSON.stringify(t, null, 1)); } catch (e) { console.log(e.message); }
  console.log("---player school_ids---");
  try {
    const [t] = await pool.query("SELECT school_id, COUNT(*) c FROM players GROUP BY school_id");
    console.log(JSON.stringify(t));
  } catch (e) { console.log(e.message); }
  console.log("---subjects field on demo teachers---");
  try {
    const [t] = await pool.query("SELECT name, school_id, subjects, id FROM players WHERE role='TEACHER'");
    console.log(JSON.stringify(t.map(r => ({ name: r.name, sid: r.school_id, subs: r.subjects, id8: r.id.slice(0,8) }))));
  } catch (e) { console.log(e.message); }
  console.log("---quizzes rows---");
  try {
    const [t] = await pool.query("SELECT id, title, standard_id, subject_code, unit_id, chapter_id, concept_id, difficulty, question_count, game_mode, created_by FROM quizzes LIMIT 12");
    console.log(JSON.stringify(t, null, 1));
  } catch (e) { console.log(e.message); }
  console.log("---quiz_questions count by quiz---");
  try {
    const [t] = await pool.query("SELECT quiz_id, COUNT(*) c FROM quiz_questions GROUP BY quiz_id");
    console.log(JSON.stringify(t));
  } catch (e) { console.log(e.message); }
  console.log("---difficulties---");
  try { const [t] = await pool.query("SELECT id, label FROM difficulties"); console.log(JSON.stringify(t)); } catch (e) { console.log(e.message); }
  await pool.end();
})().catch((e) => { console.error("ERR", e.message); process.exit(1); });