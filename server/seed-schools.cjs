const pool = require("./src/config/db.js");
const { hashPassword } = require("./src/lib/password");
const { randomUUID } = require("crypto");

const FIRST = ["Arjun", "Aisha", "Rohan", "Meera", "Vikram", "Sneha", "Aditya", "Priyanka", "Karthik", "Divya", "Rahul", "Ananya", "Siddharth", "Lakshmi", "Varun", "Pooja", "Nikhil", "Kavya", "Sanjay", "Ishita"];
const LAST = ["Sharma", "Verma", "Patel", "Nair", "Reddy", "Iyer", "Singh", "Gupta", "Menon", "Kulkarni", "Desai", "Bose", "Chatterjee", "Rao", "George", "Pillai", "Mishra", "Joshi", "Khan", "Nayak"];
// Subject codes as stored in the DB: lowercase. Only the codes below that
// actually have worlds can produce lesson completions for a student.
const SUBJECT_POOL = ["chemistry", "physics", "mathematics", "biology", "english", "computer-science", "tamil"];
const WORLD_SUBJECTS = ["chemistry", "physics", "mathematics", "english", "biology"];

function slug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function pickSubject() {
  const subj = [...SUBJECT_POOL];
  const picked = [];
  for (let i = 0; i < 3 + Math.floor(Math.random() * 2); i++) {
    picked.push(subj.splice(Math.floor(Math.random() * subj.length), 1)[0]);
  }
  const lead = WORLD_SUBJECTS[Math.floor(Math.random() * WORLD_SUBJECTS.length)];
  if (!picked.includes(lead)) picked[0] = lead;
  return picked.join(",");
}

function randLevel(grade) {
  const base = Math.floor(grade) * 1.4;
  return Math.max(2, Math.min(22, Math.round(base + Math.random() * 6)));
}

function randBetween(a, b) {
  return a + Math.floor(Math.random() * (b - a + 1));
}

async function main() {
  const [schools] = await pool.query("SELECT id, name FROM schools ORDER BY id");
  const [teachers] = await pool.query(
    "SELECT id, name, current_grade, current_board, school_id, subjects FROM players WHERE role='TEACHER'"
  );
  const [worlds] = await pool.query("SELECT id, subject_code FROM worlds ORDER BY sort_order");
  const [quizzes] = await pool.query("SELECT id, subject_code, question_count FROM quizzes WHERE visibility='published'");
  const [badges] = await pool.query("SELECT id FROM badges");
  const [classRows] = await pool.query("SELECT grade FROM classes ORDER BY CAST(grade AS UNSIGNED)");

  const worldBySubject = {};
  for (const w of worlds) (worldBySubject[w.subject_code] ??= []).push(w);

  const teacherBySchool = {};
  for (const t of teachers) (teacherBySchool[t.school_id] ??= []).push(t);

  let created = 0;
  for (const sc of schools) {
    const [[cnt]] = await pool.query("SELECT COUNT(*) n FROM players WHERE role='STUDENT' AND school_id=?", [sc.id]);
    if (cnt.n > 0) {
      console.log(`school #${sc.id} ${sc.name}: already ${cnt.n} students - skip`);
      continue;
    }
    const tch = teacherBySchool[sc.id] || [];
    const board = tch[0]?.current_board || "CBSE";
    const gradeSet = new Set(tch.map((t) => t.current_grade).filter(Boolean));
    for (const g of classRows) {
      if (gradeSet.size >= 3) break;
      if (!gradeSet.has(g.grade) && gradeSet.size < 3) gradeSet.add(String(g.grade));
    }
    if (!gradeSet.size) gradeSet.add("9");
    const grades = [...gradeSet];
    const count = grades.length >= 2 ? 6 : 5;
    const schoolSlug = slug(sc.name || `school-${sc.id}`);
    const students = [];

    for (let i = 0; i < count; i++) {
      const grade = grades[i % grades.length];
      const name = `${FIRST[Math.floor(Math.random() * FIRST.length)]} ${LAST[Math.floor(Math.random() * LAST.length)]}`;
      const id = randomUUID();
      const email = `${schoolSlug}.student${i + 1}@demo.chemquest.gg`;
      const pw = await hashPassword("demo1234");
      const subjects = pickSubject();
      const level = randLevel(grade);
      const xp = randBetween(400, 3200);
      const streak = randBetween(0, 9);
      students.push({ id, name, email, pw, grade, board, level, xp, streak, subjects });
      await pool.query(
        `INSERT INTO players (id, name, email, password_hash, role, status, level, coins, xp, total_xp_earned, streak,
          current_grade, current_board, current_subject, school_name, school_id, subjects, language, created_at, updated_at)
         VALUES (?,?,?,?, 'STUDENT','active',?,?,?,?,?,?,?,?,?,?,?, 'en', NOW(), NOW())`,
        [id, name, email, pw, level, randBetween(0, 400), xp, xp, streak, grade, board, subjects.split(",")[0], sc.name, sc.id, subjects]
      );
      created++;
    }

    for (const s of students) {
      const subjList = s.subjects.split(",");
      const mainSubject = subjList[0];
      const myWorlds = (worldBySubject[mainSubject] || []).slice(0, 6);
      if (!myWorlds.length) continue;
      const compCount = randBetween(10, 16);
      const totalXp = s.xp;
      for (let c = 0; c < compCount; c++) {
        const w = myWorlds[c % myWorlds.length];
        const accuracy = randBetween(55, 98);
        const stars = accuracy >= 85 ? 3 : accuracy >= 70 ? 2 : 1;
        const xp = randBetween(15, 60);
        // The PK is the full (player, grade, board, world, lesson, difficulty)
        // tuple, so derive each component from c so no tuple repeats.
        const lessonId = String((c % 6) + 1).padStart(2, "0");
        const difficulty = ["easy", "medium", "hard"][Math.floor(c / 6) % 3];
        await pool.query(
          `INSERT INTO player_completions (player_id, grade, board, world_id, lesson_id, difficulty_id, accuracy, stars, xp, coins, completed_at)
           VALUES (?,?,?,?,?,?,?,?,?,?, DATE_SUB(NOW(), INTERVAL ? HOUR))`,
          [s.id, s.grade, s.board, w.id, lessonId, difficulty, accuracy, stars, xp, Math.floor(xp / 2), randBetween(1, 30 * 24 + c)]
        );
        s.xpUsed = (s.xpUsed || 0) + xp;
      }

      const quizPool = quizzes.filter((q) => q.subject_code === mainSubject);
      if (quizPool.length) {
        const attemptCount = randBetween(3, 8);
        for (let t = 0; t < attemptCount; t++) {
          const q = quizPool[t % quizPool.length];
          const total = q.question_count || 8;
          const correct = Math.max(2, Math.round((randBetween(52, 98) / 100) * total));
          const acc = Math.round((correct / total) * 100);
          await pool.query(
            `INSERT INTO quiz_attempts (id, quiz_id, player_id, started_at, completed_at, time_taken_ms, total_questions, correct_count, incorrect_count, skipped_count, score, accuracy, xp_earned, coins_earned, status)
             VALUES (?,?,?, DATE_SUB(NOW(), INTERVAL ? DAY), DATE_SUB(NOW(), INTERVAL ? DAY), ?, ?, ?, ?, 0, ?, ?, ?, 0, 'completed')`,
            [randomUUID().slice(0, 30), q.id, s.id, t, t, randBetween(120000, 900000), total, correct, total - correct, acc, acc, randBetween(30, 120), randBetween(20, 60)]
          );
        }
      }

      for (let bi = 0; bi < Math.min(3 + Math.floor(Math.random() * 4), badges.length); bi++) {
        const badge = badges[bi];
        await pool.query("INSERT IGNORE INTO player_badges (player_id, badge_id, earned_at) VALUES (?,?, DATE_SUB(NOW(), INTERVAL ? DAY))", [s.id, badge.id, randBetween(1, 30)]);
      }

      for (let m = 0; m < 3; m++) {
        const subj = subjList[m % subjList.length];
        await pool.query(
          `INSERT INTO mastery (player_id, subject_code, unit_id, chapter_id, concept_id, total_attempts, correct_count, accuracy, mastery_level, last_attempted_at)
           VALUES (?,?,?,?,?,?,?,?,?, DATE_SUB(NOW(), INTERVAL 1 DAY))`,
          [s.id, subj, randBetween(1, 30), randBetween(1, 134), randBetween(1, 134), randBetween(2, 12), randBetween(1, 10), randBetween(40, 100), ["learning", "practicing", "strong"][randBetween(0, 2)]]
        );
      }
    }

    for (const t of tch) {
      if (!t.subjects) {
        await pool.query("UPDATE players SET subjects=? WHERE id=?", [pickSubject(), t.id]);
      }
    }

    console.log(`school #${sc.id} ${sc.name}: seeded ${count} students (grades ${grades.join(",")}, board ${board})`);
  }

  const nicerNames = {
    4: "Green Meadows School", 5: "SRM Public School", 6: "Blue Ridge International",
    9: "Green Valley Academy", 11: "Nova Springs School", 12: "Giri Public School", 13: "Giri Model School",
  };
  for (const [id, name] of Object.entries(nicerNames)) {
    await pool.query("UPDATE schools SET name=? WHERE id=?", [name, Number(id)]);
  }

  console.log(`\nCreated ${created} students total. School names tidied.`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});