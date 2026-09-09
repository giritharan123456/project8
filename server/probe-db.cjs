const pool = require("./src/config/db.js");
(async () => {
  const [sch] = await pool.query(
    `SELECT s.id, s.name,
       (SELECT COUNT(*) FROM players p WHERE p.role='STUDENT' AND p.school_id=s.id) stu,
       (SELECT COUNT(*) FROM players p WHERE p.role='TEACHER' AND p.school_id=s.id) tea
     FROM schools s ORDER BY s.id`
  );
  console.log("SCHOOLS:");
  sch.forEach((r) => console.log(`  #${r.id} ${r.name} | students=${r.stu} teachers=${r.tea}`));

  const [tea] = await pool.query(
    `SELECT id, name, email, current_grade, current_board, school_id FROM players WHERE role='TEACHER' ORDER BY id`
  );
  console.log("TEACHERS:");
  tea.forEach((r) => console.log(`  ${r.id} ${r.name} ${r.email} grade=${r.current_grade} board=${r.current_board} school=${r.school_id}`));

  const count = async (q) => (await pool.query(q))[0][0].n;
  console.log({
    assignments: await count("SELECT COUNT(*) n FROM assignments"),
    learning_contents: await count("SELECT COUNT(*) n FROM learning_contents"),
    questions: await count("SELECT COUNT(*) n FROM questions"),
    quizzes: await count("SELECT COUNT(*) n FROM quizzes"),
    completions: await count("SELECT COUNT(*) n FROM player_completions"),
    quiz_attempts: await count("SELECT COUNT(*) n FROM quiz_attempts"),
    worlds: await count("SELECT COUNT(*) n FROM worlds"),
    lessons: await count("SELECT COUNT(*) n FROM lessons"),
    units: await count("SELECT COUNT(*) n FROM units"),
    concepts: await count("SELECT COUNT(*) n FROM concepts"),
    subjects: await count("SELECT COUNT(*) n FROM subjects"),
    schools: await count("SELECT COUNT(*) n FROM schools"),
  });
  process.exit(0);
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});