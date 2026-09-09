// Validates LearnQuest content integrity end-to-end.
//
//   npm run validate              -> validates the seed data files (no DB needed)
//   npm run validate:db           -> validates the live MySQL database
//
// Data mode checks the canonical seed sources (seedData.js + seedDataComplete.js):
// every subject, question, quiz, flashcard, achievement and challenge must be
// structurally sound and every quiz must be able to link questions. DB mode
// runs the same ideas against the running MySQL database: hierarchy counts per
// subject, FK integrity (orphan questions / quiz_questions / quizzes), and the
// quiz<->question link that `npm run seed:complete` creates.

require("dotenv").config();

const DATA_CHECK = process.argv.includes("--db") ? false : true;

const {
  SUBJECTS,
  DIFFICULTIES,
  ACHIEVEMENT_DEFS,
  CHALLENGE_DEFS,
  FLASHCARD_SETS,
  FLASHCARDS,
  ALL_QUESTIONS,
  DAILY_QUEST_DEFS,
  QUIZZES,
  SHOP_ITEMS,
  BOSS_DIFFICULTY_MIX,
} = require("../data/seedDataComplete");
const {
  WORLD_TEMPLATE,
  LESSONS_BY_WORLD,
  QUESTION_BANK,
} = require("../data/seedData");

const QUESTION_TYPES = new Set([
  "mcq",
  "multi_select",
  "true_false",
  "fill_blank",
  "numerical",
  "sequence",
  "match_following",
  "chemical_equation",
  "reaction",
  "drag_drop",
]);
const DIFFICULTY_IDS = new Set(DIFFICULTIES.map((d) => d.id));
const SUBJECT_CODES = new Set(SUBJECTS.map((s) => s.code));

const issues = [];
const summary = [];

function check(ok, label, extra) {
  if (!ok) issues.push(`${label}${extra ? ` - ${extra}` : ""}`);
  return ok;
}

function writeTable(title, rows, headers) {
  const widths = headers.map((h, i) =>
    Math.max(h.length, ...rows.map((r) => String(r[i] ?? "").length))
  );
  const line = (cells) =>
    "  " +
    cells
      .map((c, i) => String(c ?? "").padEnd(widths[i]))
      .join("|  ");

  summary.push("");
  summary.push(title);
  summary.push(line(headers));
  summary.push(line(widths.map((w) => "-".repeat(w))));
  for (const r of rows) summary.push(line(r));
}

function validateData() {
  console.log("Content validation (seed data mode)\n");

  // ---- Subjects -----------------------------------------------------------
  check(SUBJECTS.length > 0, "subjects: at least one subject");
  const subjectCodes = new Set();
  for (const s of SUBJECTS) {
    check(
      typeof s.code === "string" && s.code.length > 0,
      `subject ${s.name || "(no name)"}: has a code`
    );
    if (s.code) {
      if (subjectCodes.has(s.code)) {
        check(false, `subject ${s.code}: duplicate code`);
      }
      subjectCodes.add(s.code);
    }
    check(s.name && s.name.length > 0, `subject ${s.code ?? "?"}: has a name`);
    check(s.icon && s.icon.length > 0, `subject ${s.code ?? "?"}: has an icon`);
    check(
      ["active", "coming_soon", "inactive"].includes(s.status || "active"),
      `subject ${s.code ?? "?"}: valid status`
    );
  }

  // ---- Question bank --------------------------------------------------------
  check(ALL_QUESTIONS.length > 0, "questions: at least one question exists");
  const seenSubjectTexts = new Set();
  const perSubject = {};
  const perSubjectDifficulty = {};
  for (const q of ALL_QUESTIONS) {
    const subj = q.subject || "(missing subject)";
    check(
      SUBJECT_CODES.has(q.subject),
      `question "${(q.text || "").slice(0, 40)}...": subject "${subj}" is not a known subject`
    );
    check(
      typeof q.text === "string" && q.text.trim().length > 0,
      `question [${subj}]: has a text`
    );
    check(
      q.type && QUESTION_TYPES.has(q.type),
      `question "${(q.text || "").slice(0, 40)}...": type "${q.type ?? "?"}" is not supported`
    );
    check(
      DIFFICULTY_IDS.has(q.difficulty),
      `question "${(q.text || "").slice(0, 40)}...": difficulty "${q.difficulty ?? "?"}" is invalid`
    );
    check(
      typeof q.answer === "string" && q.answer.trim().length > 0,
      `question "${(q.text || "").slice(0, 40)}...": has an answer`
    );
    check(
      typeof q.explanation === "string" && q.explanation.trim().length > 0,
      `question "${(q.text || "").slice(0, 40)}...": has an explanation`
    );

    const key = `${subj}::${q.text}`;
    if (seenSubjectTexts.has(key)) {
      check(false, `question [${subj}]: duplicate text "${q.text}"`);
    }
    seenSubjectTexts.add(key);

    const opts = q.options;
    if (["mcq", "multi_select", "true_false", "sequence"].includes(q.type)) {
      check(
        Array.isArray(opts) && opts.length >= 2,
        `question "${(q.text || "").slice(0, 40)}...": needs >= 2 options for type "${q.type}"`
      );
    }
    if (q.type === "mcq" && Array.isArray(opts)) {
      check(
        opts.includes(q.answer),
        `question "${(q.text || "").slice(0, 40)}...": mcq answer not in options`
      );
    }
    if (q.type === "multi_select" && Array.isArray(opts)) {
      const answers = q.answer.split("|").filter(Boolean);
      check(
        answers.length >= 2,
        `question "${(q.text || "").slice(0, 40)}...": multi_select needs >= 2 answers separated by "|"`
      );
      check(
        answers.every((a) => opts.includes(a)),
        `question "${(q.text || "").slice(0, 40)}...": multi_select answer not in options`
      );
    }
    if (q.type === "numerical") {
      check(
        q.answer !== undefined && !Number.isNaN(Number(String(q.answer).replace(/,/g, ""))),
        `question "${(q.text || "").slice(0, 40)}...": numerical answer must be numeric`
      );
    }

    perSubject[subj] = (perSubject[subj] || 0) + 1;
    perSubjectDifficulty[subj] = perSubjectDifficulty[subj] || {};
    perSubjectDifficulty[subj][q.difficulty || "?"] =
      (perSubjectDifficulty[subj][q.difficulty || "?"] || 0) + 1;
  }

  const subjectQuestionRows = SUBJECTS.filter((s) => perSubject[s.code] > 0).map((s) => [
    s.code,
    perSubject[s.code] ?? 0,
    perSubjectDifficulty[s.code]?.easy ?? 0,
    perSubjectDifficulty[s.code]?.medium ?? 0,
    perSubjectDifficulty[s.code]?.hard ?? 0,
    perSubjectDifficulty[s.code]?.expert ?? 0,
  ]);
  writeTable(
    "Question bank coverage per subject",
    subjectQuestionRows,
    ["subject", "total", "easy", "medium", "hard", "expert"]
  );

  // ---- Curriculum hierarchy (base seedData.js) -------------------------------
  const worldBySubject = {};
  for (const w of WORLD_TEMPLATE) {
    const subjectCode = w.subjectCode || "chemistry";
    check(w.id && w.name && w.topic && w.boss, `world ${w.id ?? "?"}: has id/name/topic/boss`);
    worldBySubject[subjectCode] = [...(worldBySubject[subjectCode] || []), w.id];
    const lessons = LESSONS_BY_WORLD[w.id] || [];
    check(
      w.isFinal ? lessons.length >= 1 : lessons.length >= 1,
      `world ${w.id}: has at least one lesson`
    );
  }
  for (const worldId of Object.keys(LESSONS_BY_WORLD)) {
    check(
      WORLD_TEMPLATE.some((w) => w.id === worldId),
      `lessons: world "${worldId}" has no matching WORLD_TEMPLATE entry`
    );
  }
  for (const worldId of Object.keys(QUESTION_BANK)) {
    check(
      WORLD_TEMPLATE.some((w) => w.id === worldId),
      `questions: world "${worldId}" in QUESTION_BANK has no WORLD_TEMPLATE entry`
    );
  }
  for (const [worldId, byDifficulty] of Object.entries(QUESTION_BANK)) {
    for (const diff of Object.keys(byDifficulty)) {
      check(
        DIFFICULTY_IDS.has(diff),
        `QUESTions [${worldId}]: difficulty "${diff}" is invalid`
      );
      for (const item of byDifficulty[diff]) {
        check(
          typeof item.q === "string" && typeof item.answer === "string",
          `QUESTION_BANK [${worldId}/${diff}]: item must have "q" and "answer"`
        );
        if (item.type === "mcq" && Array.isArray(item.options)) {
          check(
            item.options.includes(item.answer),
            `QUESTION_BANK [${worldId}/${diff}]: mcq answer not in options for "${(item.q || "").slice(0, 40)}"`
          );
        }
      }
    }
  }

  const worldRows = WORLD_TEMPLATE.map((w) => {
    const subjectCode = w.subjectCode || "chemistry";
    return [
      w.id,
      subjectCode,
      (LESSONS_BY_WORLD[w.id] || []).length,
      w.isFinal ? "final" : "normal",
    ];
  });
  writeTable("Worlds and lessons (authored curriculum)", worldRows, ["world", "subject", "lessons", "type"]);

  // ---- Quizzes + quiz<->question linking -------------------------------------
  check(QUIZZES.length > 0, "quizzes: at least one quiz");
  const quizIds = new Set();
  const quizRows = [];
  for (const quiz of QUIZZES) {
    const id = quiz.id || "?";
    check(id !== "?", `quiz ${id}: has an id`);
    if (quizIds.has(id)) check(false, `quiz ${id}: duplicate id`);
    quizIds.add(id);
    check(quiz.title && quiz.title.length > 0, `quiz ${id}: has a title`);
    check(
      SUBJECT_CODES.has(quiz.subject_code),
      `quiz ${id}: subject "${quiz.subject_code}" is not a known subject`
    );
    check(
      DIFFICULTY_IDS.has(quiz.difficulty),
      `quiz ${id}: difficulty "${quiz.difficulty}" is invalid`
    );
    check(
      Number.isInteger(quiz.marks) && quiz.marks > 0,
      `quiz ${id}: marks is a positive integer`
    );
    check(
      Number.isInteger(quiz.min) && quiz.min > 0 && quiz.min <= 120,
      `quiz ${id}: time limit (min) is a sane number of minutes`
    );

    const poolSize = ALL_QUESTIONS.filter(
      (qu) => qu.subject === quiz.subject_code && qu.difficulty === quiz.difficulty
    ).length;
    const willLink = Math.min(10, poolSize);
    check(
      willLink >= 5,
      `quiz ${id}: few linked questions (pool=${poolSize}); expected >= 5 for a meaningful quiz`
    );
    if (willLink >= 5) {
      quizRows.push([id, quiz.subject_code, quiz.difficulty, poolSize, willLink]);
    }
  }
  if (quizRows.length) {
    writeTable("Quiz <-> question linking (up to 10 linked)", quizRows, ["quiz", "subject", "difficulty", "pool", "linked"]);
  }

  // ---- Flashcards -------------------------------------------------------------
  const setId = new Set(FLASHCARD_SETS.map((s) => s.id));
  check(
    setId.size === FLASHCARD_SETS.length,
    "flashcards: set ids are unique"
  );
  for (const s of FLASHCARD_SETS) {
    if (s.subject_code) {
      check(
        SUBJECT_CODES.has(s.subject_code),
        `flashcard set ${s.id}: subject "${s.subject_code}" is not a known subject`
      );
    }
  }
  for (const card of FLASHCARDS) {
    check(
      setId.has(card.setId),
      `flashcard "${(card.front || "").slice(0, 30)}...": setId ${card.setId} not found`
    );
  }

  // ---- Achievements / challenges / daily quests / shop --------------------------
  const idUniq = (arr, label) => {
    const ids = new Set();
    for (const x of arr) {
      if (ids.has(x.id)) check(false, `${label}: duplicate id "${x.id}"`);
      ids.add(x.id);
    }
  };
  idUniq(ACHIEVEMENT_DEFS, "achievements");
  idUniq(CHALLENGE_DEFS, "challenges");
  idUniq(DAILY_QUEST_DEFS, "daily quests");
  idUniq(SHOP_ITEMS, "shop items");
  for (const c of CHALLENGE_DEFS) {
    check(Number(c.targetValue) > 0, `challenge ${c.id}: targetValue is positive`);
  }
  for (const s of SHOP_ITEMS) {
    check(typeof s.price === "number" && s.price >= 0, `shop item ${s.id}: valid price`);
  }
  for (const d of BOSS_DIFFICULTY_MIX) {
    check(DIFFICULTY_IDS.has(d), `boss difficulty mix: "${d}" is invalid`);
  }
  check(
    BOSS_DIFFICULTY_MIX.length > 0,
    "boss difficulty mix: non-empty"
  );
}

async function validateDb() {
  let pool;
  try {
    pool = require("../config/db");
  } catch (err) {
    console.log("Content validation (database mode)\n");
    check(false, "could not load the database config", err.message);
    return;
  }

  console.log("Content validation (database mode)\n");
  let conn;
  try {
    conn = await pool.getConnection();
  } catch (err) {
    check(false, "database connection", err.message);
    return;
  }

  try {
    const q = async (sql, params) => {
      const [rows] = await conn.query(sql, params);
      return rows;
    };
    const group = (rows, key) => {
      const m = new Map();
      for (const r of rows) m.set(r[key], Number(r.n));
      return m;
    };

    // Hierarchy counts per subject.
    const subjects = await q("SELECT code, name FROM subjects ORDER BY sort_order");
    const worldCounts = await q(
      "SELECT subject_code AS s, COUNT(*) AS n FROM worlds GROUP BY subject_code"
    );
    const lessonCounts = await q(
      `SELECT w.subject_code AS s, COUNT(l.id) AS n
       FROM lessons l JOIN worlds w ON w.id = l.world_id
       GROUP BY w.subject_code`
    );
    const questionCounts = await q(
      `SELECT w.subject_code AS s, COUNT(q.id) AS n
       FROM questions q JOIN worlds w ON w.id = q.world_id
       GROUP BY w.subject_code`
    );
    const unitCounts = await q("SELECT subject_code AS s, COUNT(*) AS n FROM units GROUP BY subject_code");

    const worlds = group(worldCounts, "s");
    const lessons = group(lessonCounts, "s");
    const questionsFor = group(questionCounts, "s");
    const units = group(unitCounts, "s");

    writeTable(
      "Live DB coverage per subject",
      subjects.map((s) => [
        s.code,
        worlds.get(s.code) || 0,
        lessons.get(s.code) || 0,
        questionsFor.get(s.code) || 0,
        units.get(s.code) || 0,
      ]),
      ["subject", "worlds", "lessons", "questions", "units"]
    );

    // FK integrity.
    const orphanQuestions = await q(
      "SELECT q.id FROM questions q LEFT JOIN worlds w ON w.id = q.world_id WHERE w.id IS NULL"
    );
    check(orphanQuestions.length === 0, "no orphan questions", `${orphanQuestions.length} found`);

    const orphanQuizQuestions = await q(
      `SELECT qq.id FROM quiz_questions qq
       LEFT JOIN quizzes q ON q.id = qq.quiz_id
       LEFT JOIN questions x ON x.id = qq.question_id
       WHERE q.id IS NULL OR x.id IS NULL`
    );
    check(orphanQuizQuestions.length === 0, "no orphan quiz_questions", `${orphanQuizQuestions.length} found`);

    const emptyQuizzes = await q(
      `SELECT q.id FROM quizzes q
       LEFT JOIN quiz_questions qq ON qq.quiz_id = q.id
       GROUP BY q.id HAVING COUNT(qq.id) = 0`
    );
    check(emptyQuizzes.length === 0, "no empty quizzes", `${emptyQuizzes.length} found`);

    const badDifficulties = await q(
      `SELECT DISTINCT q.difficulty_id FROM questions q
       LEFT JOIN difficulties d ON d.id = q.difficulty_id WHERE d.id IS NULL`
    );
    check(badDifficulties.length === 0, "no questions with invalid difficulty", `${badDifficulties.length} found`);

    const badTypes = await q(
      `SELECT DISTINCT type FROM questions WHERE type NOT IN (${[...QUESTION_TYPES].map(() => "?").join(",")})`,
      [...QUESTION_TYPES]
    );
    check(badTypes.length === 0, "no questions with unsupported type", `${badTypes.length} found`);

    // Quiz <-> question link counts per quiz.
    const quizLinkRows = await q(
      `SELECT q.id AS id, q.subject_code AS subject, q.difficulty AS difficulty, COUNT(qq.id) AS linked
       FROM quizzes q
       LEFT JOIN quiz_questions qq ON qq.quiz_id = q.id
       GROUP BY q.id, q.subject_code, q.difficulty
       ORDER BY q.id`
    );
    if (quizLinkRows.length) {
      writeTable(
        "Live quiz <-> question links",
        quizLinkRows.map((r) => [r.id, r.subject, r.difficulty, r.linked]),
        ["quiz", "subject", "difficulty", "linked"]
      );
    }
  } finally {
    conn.release();
    await pool.end();
  }
}

(async () => {
  if (DATA_CHECK) {
    validateData();
  } else {
    await validateDb();
  }

  console.log(summary.join("\n"));
  console.log("");

  if (issues.length) {
    console.log(`FAIL - ${issues.length} issue(s):`);
    for (const i of issues) console.log(`  - ${i}`);
    process.exit(1);
  }
  console.log("PASS - all content checks passed.");
})();