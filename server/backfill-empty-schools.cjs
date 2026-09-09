// One-shot repair: any school with a TEACHER but zero students gets a demo
// cohort so a signed-in teacher never sees an empty portal. Idempotent -
// schools that already have students are skipped. Usage: node -r dotenv/config backfill-empty-schools.cjs

const pool = require("./src/config/db");
const { seedSchoolCohort } = require("./lib/seedSchool");

async function main() {
  const [schools] = await pool.query("SELECT id, name FROM schools ORDER BY id");
  const [stu] = await pool.query("SELECT school_id, COUNT(*) c FROM players WHERE role='STUDENT' GROUP BY school_id");
  const [tea] = await pool.query("SELECT school_id, COUNT(*) c FROM players WHERE role='TEACHER' GROUP BY school_id");
  const [teachers] = await pool.query(
    "SELECT school_id, current_grade, current_board FROM players WHERE role='TEACHER'"
  );
  const studentsBySchool = Object.fromEntries(stu.map((r) => [r.school_id, r.c]));
  const teachersBySchool = Object.fromEntries(tea.map((r) => [r.school_id, r.c]));
  const teacherInfos = Object.groupBy
    ? Object.groupBy(teachers, (t) => t.school_id)
    : teachers.reduce((acc, t) => ((acc[t.school_id] ??= []).push(t), acc), {});

  let seeded = 0;
  let skipped = 0;
  for (const s of schools) {
    if ((studentsBySchool[s.id] || 0) > 0) {
      skipped++;
      continue;
    }
    const tch = teacherInfos[s.id] || [];
    if (!tch.length) {
      skipped++;
      continue;
    }
    const opts = {
      board: tch[0].current_board || "CBSE",
      grades: [...new Set(tch.map((t) => t.current_grade).filter(Boolean))],
    };
    const res = await seedSchoolCohort(s.id, opts);
    if (res.seeded) {
      seeded++;
      console.log(`school #${s.id} ${s.name}: seeded ${res.studentCount} students (${res.grades.join(",")}/${res.board})`);
    } else {
      console.log(`school #${s.id} ${s.name}: ${res.reason} - skip`);
    }
  }
  console.log(`\nDone. Seeded ${seeded} school(s), skipped ${skipped}.`);
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});