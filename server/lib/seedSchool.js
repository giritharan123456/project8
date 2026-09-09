// Seed a realistic student cohort into a school that has none.
//
// Used at TEACHER signup (routes/auth.js) so a teacher who registers a
// brand-new school never lands on an empty dashboard / "no student linked
// to this school yet" exports, and by scripts/backfillEmptySchools.js to
// repair any school that already has a teacher but no students.
//
// Idempotent: if the school already has students it does nothing.

const pool = require("../src/config/db");
const { hashPassword } = require("../src/lib/password");
const { randomUUID } = require("crypto");
const fs = require("fs");
const TRACE_FILE = process.env.SEED_TRACE_FILE || null;
async function trace(label, tStart) {
  if (!TRACE_FILE) return;
  try { fs.appendFileSync(TRACE_FILE, `${label} +${Date.now() - tStart}ms\n`); } catch {}
}

const FIRST = ["Arjun", "Aisha", "Rohan", "Meera", "Vikram", "Sneha", "Aditya", "Priyanka", "Karthik", "Divya", "Rahul", "Ananya", "Siddharth", "Lakshmi", "Varun", "Pooja", "Nikhil", "Kavya", "Sanjay", "Ishita"];
const LAST = ["Sharma", "Verma", "Patel", "Nair", "Reddy", "Iyer", "Singh", "Gupta", "Menon", "Kulkarni", "Desai", "Bose", "Chatterjee", "Rao", "George", "Pillai", "Mishra", "Joshi", "Khan", "Nayak"];
// Subject codes as stored in the DB: lowercase. Only codes that have worlds
// can produce lesson completions for a student.
const SUBJECT_POOL = ["chemistry", "physics", "mathematics", "biology", "english", "computer-science", "tamil"];
const WORLD_SUBJECTS = ["chemistry", "physics", "mathematics", "english", "biology"];

// Resolves { subjects } (display names like "Chemistry", or codes like
// "chemistry", as stored on a TEACHER row) into canonical subject codes,
// from the real `subjects` table so this never drifts from the catalog.
async function toSubjectCodes(list) {
  const [subjRows] = await pool.query("SELECT code, name FROM subjects WHERE status='active'");
  const byLowerName = new Map(subjRows.map((r) => [String(r.name).toLowerCase(), r.code]));
  const knownCodes = new Set(subjRows.map((r) => r.code));
  const out = [];
  for (const item of list || []) {
    const s = String(item).trim();
    if (!s) continue;
    const code = byLowerName.get(s.toLowerCase()) || (knownCodes.has(s.toLowerCase()) ? s.toLowerCase() : null);
    if (code && !out.includes(code)) out.push(code);
  }
  return out;
}

function slug(name) {
  return String(name || "school")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
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
  const base = Math.floor(Number(grade) || 9) * 1.4;
  return Math.max(2, Math.min(22, Math.round(base + Math.random() * 6)));
}

function randBetween(a, b) {
  return a + Math.floor(Math.random() * (b - a + 1));
}

// `opts.grades` defaults to the teacher's grade, padded to a realistic mix.
async function buildGradeSet(opts) {
  const wanted = [...new Set((opts.grades || []).map((g) => String(g)).filter(Boolean))];
  if (!wanted.length) return ["9"];
  const [classRows] = await pool.query("SELECT grade FROM classes ORDER BY CAST(grade AS UNSIGNED)");
  for (const row of classRows) {
    if (wanted.length >= 3) break;
    if (!wanted.includes(String(row.grade))) wanted.push(String(row.grade));
  }
  if (wanted.length >= 2 && wanted.length < 3) wanted.push("9");
  return wanted;
}

async function seedSchoolCohort(schoolId, opts = {}) {
  const tStart = Date.now();
  const [[cnt]] = await pool.query("SELECT COUNT(*) n FROM players WHERE role='STUDENT' AND school_id=?", [schoolId]);
  if (cnt.n > 0) return { seeded: false, studentCount: 0, reason: "already has students" };
  await trace("count-check", tStart);

  const [[school]] = await pool.query("SELECT name FROM schools WHERE id=?", [schoolId]);
  const board = opts.board || "CBSE";
  const grades = await buildGradeSet(opts);
  const count = grades.length >= 2 ? 6 : 5;

  const [worlds] = await pool.query("SELECT id, subject_code FROM worlds ORDER BY sort_order");
  const [quizzes] = await pool.query("SELECT id, subject_code, question_count FROM quizzes WHERE visibility='published'");
  const [badges] = await pool.query("SELECT id FROM badges");
  await trace("fetched worlds/quizzes/badges", tStart);
  const worldBySubject = {};
  for (const w of worlds) (worldBySubject[w.subject_code] ??= []).push(w);

  // Subject scoping (Section 3 / teacher signup): when the signup form
  // supplies the teacher's teaching subjects, the whole demo cohort is
  // built around exactly those subjects - completions, quiz attempts and
  // mastery all reference the chosen ones, so the teacher portal's
  // subject-scoped queries (routes/teacher.js) return real data instead
  // of empty lists. With no subjects passed (the backfill path), it falls
  // back to the previous random-subject mix.
  const chosenCodes = await toSubjectCodes(opts.subjects);
  const useChosen = chosenCodes.length > 0;
  const activitySubjects = useChosen
    ? chosenCodes.filter((c) => (worldBySubject[c] || []).length > 0 || quizzes.some((q) => q.subject_code === c))
    : [];
  const mainSubjects = activitySubjects.length
    ? activitySubjects
    : useChosen
      ? chosenCodes
      : SUBJECT_POOL;

  const schoolName = school ? school.name : `School ${schoolId}`;
  const schoolSlug = slug(schoolName);
  const pw = await hashPassword("demo1234");
  await trace("hashed pw", tStart);

  const students = [];
  const studentRows = [];
  for (let i = 0; i < count; i++) {
    const grade = grades[i % grades.length];
    const name = `${FIRST[Math.floor(Math.random() * FIRST.length)]} ${LAST[Math.floor(Math.random() * LAST.length)]}`;
    const id = randomUUID();
    const email = `${schoolSlug}.student${i + 1}@demo.chemquest.gg`;
    const subjects = useChosen ? chosenCodes.join(",") : pickSubject();
    const mainSubject = mainSubjects[i % mainSubjects.length];
    const level = randLevel(grade);
    const xp = randBetween(400, 3200);
    const streak = randBetween(0, 9);
    students.push({ id, name, email, pw, grade, board, level, xp, streak, subjects, mainSubject });
    studentRows.push([
      id, name, email, pw, level, randBetween(0, 400), xp, xp, streak, grade, board, mainSubject, schoolName, schoolId, subjects,
    ]);
  }

  const completionRows = [];
  const attemptRows = [];
  const badgeRows = [];
  const masteryRows = [];

  for (const s of students) {
    const mainSubject = s.mainSubject;
    const myWorlds = (worldBySubject[mainSubject] || []).slice(0, 6);
    if (myWorlds.length) {
      const compCount = randBetween(10, 16);
      for (let c = 0; c < compCount; c++) {
        const w = myWorlds[c % myWorlds.length];
        const accuracy = randBetween(55, 98);
        const stars = accuracy >= 85 ? 3 : accuracy >= 70 ? 2 : 1;
        const xp = randBetween(15, 60);
        const lessonId = String((c % 6) + 1).padStart(2, "0");
        const difficulty = ["easy", "medium", "hard"][Math.floor(c / 6) % 3];
        completionRows.push([
          s.id, s.grade, s.board, w.id, lessonId, difficulty, accuracy, stars, xp, Math.floor(xp / 2), randBetween(1, 30 * 24 + c),
        ]);
      }
    }

    const quizPool = quizzes.filter((q) => q.subject_code === mainSubject);
    if (quizPool.length) {
      const attemptCount = randBetween(3, 8);
      for (let t = 0; t < attemptCount; t++) {
        const q = quizPool[t % quizPool.length];
        const total = q.question_count || 8;
        const correct = Math.max(2, Math.round((randBetween(52, 98) / 100) * total));
        const acc = Math.round((correct / total) * 100);
        attemptRows.push([
          randomUUID().slice(0, 30), q.id, s.id, t, t, randBetween(120000, 900000), total, correct, total - correct, acc, acc, randBetween(30, 120),
        ]);
      }
    }

    for (let bi = 0; bi < Math.min(3 + Math.floor(Math.random() * 4), badges.length); bi++) {
      const badge = badges[bi];
      badgeRows.push([s.id, badge.id, randBetween(1, 30)]);
    }

    for (let m = 0; m < 3; m++) {
      const subj = mainSubjects[m % mainSubjects.length];
      masteryRows.push([
        s.id, subj, randBetween(1, 30), randBetween(1, 134), randBetween(1, 134), randBetween(2, 12), randBetween(1, 10), randBetween(40, 100), ["learning", "practicing", "strong"][randBetween(0, 2)],
      ]);
    }
  }

  await trace("built rows in JS", tStart);
  // One players INSERT for the whole cohort plus one batched multi-row
  // insert per activity table - keeps teacher signup fast (~1s instead of
  // ~160 sequential round trips to the managed/cloud MySQL instance).
  await pool.query(
    `INSERT INTO players (id, name, email, password_hash, role, status, level, coins, xp, total_xp_earned, streak,
      current_grade, current_board, current_subject, school_name, school_id, subjects, language, created_at, updated_at)
     VALUES ${studentRows.map(() => "(?,?,?,?, 'STUDENT','active',?,?,?,?,?,?,?,?,?,?,?, 'en', NOW(), NOW())").join(",")}`,
    studentRows.flat()
  );
  await trace("inserted students", tStart);

  if (completionRows.length) {
    await pool.query(
      `INSERT INTO player_completions (player_id, grade, board, world_id, lesson_id, difficulty_id, accuracy, stars, xp, coins, completed_at)
       VALUES ${completionRows.map(() => "(?,?,?,?,?,?,?,?,?,?, DATE_SUB(NOW(), INTERVAL ? HOUR))").join(",")}`,
      completionRows.flat()
    );
  }
  if (attemptRows.length) {
    await pool.query(
      `INSERT INTO quiz_attempts (id, quiz_id, player_id, started_at, completed_at, time_taken_ms, total_questions, correct_count, incorrect_count, skipped_count, score, accuracy, xp_earned, coins_earned, status)
       VALUES ${attemptRows.map(() => "(?,?,?, DATE_SUB(NOW(), INTERVAL ? DAY), DATE_SUB(NOW(), INTERVAL ? DAY), ?, ?, ?, ?, 0, ?, ?, ?, 0, 'completed')").join(",")}`,
      attemptRows.flat()
    );
  }
  if (badgeRows.length) {
    await pool.query(
      `INSERT IGNORE INTO player_badges (player_id, badge_id, earned_at) VALUES ${badgeRows.map(() => "(?,?, DATE_SUB(NOW(), INTERVAL ? DAY))").join(",")}`,
      badgeRows.flat()
    );
  }
  if (masteryRows.length) {
    await pool.query(
      `INSERT INTO mastery (player_id, subject_code, unit_id, chapter_id, concept_id, total_attempts, correct_count, accuracy, mastery_level, last_attempted_at)
       VALUES ${masteryRows.map(() => "(?,?,?,?,?,?,?,?,?, DATE_SUB(NOW(), INTERVAL 1 DAY))").join(",")}`,
      masteryRows.flat()
    );
  }
  await trace("inserted activity (completions/attempts/badges/mastery)", tStart);

  return { seeded: true, studentCount: students.length, grades: [...grades], board };
}

module.exports = { seedSchoolCohort };