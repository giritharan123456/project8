require("dotenv").config({ path: require("path").join(__dirname, "..", "..", ".env") });
const pool = require("../config/db");

function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rng = mulberry32(20260909);
const rand = (min, max) => Math.floor(rng() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(rng() * arr.length)];
const daysAgo = (d) => {
  const dt = new Date(Date.now() - d * 86400000);
  return dt.toISOString().slice(0, 19).replace("T", " ");
};
const dateKey = (d) => {
  const dt = new Date(Date.now() - d * 86400000);
  return dt.toISOString().slice(0, 10);
};

let totalInserts = 0;
async function insertMany(table, cols, rows) {
  if (!rows.length) return;
  const safeCols = cols.map((c) => (c === "read" ? "`read`" : c));
  const placeholders = cols.map(() => "?").join(",");
  const chunk = 400;
  for (let i = 0; i < rows.length; i += chunk) {
    const slice = rows.slice(i, i + chunk);
    const sql = `INSERT INTO ${table} (${safeCols.join(",")}) VALUES ${slice.map(() => `(${placeholders})`).join(",")}`;
    await pool.query(sql, slice.flat());
    totalInserts += slice.length;
  }
}

(async () => {
  console.log("Loading reference data...");
  const [subjects] = await pool.query("SELECT * FROM subjects ORDER BY sort_order");
  const [worlds] = await pool.query("SELECT * FROM worlds ORDER BY sort_order");
  const [lessons] = await pool.query("SELECT * FROM lessons WHERE board_code IS NULL ORDER BY world_id, sort_order");
  const [diffs] = await pool.query("SELECT id FROM difficulties");
  const [diffsFull] = await pool.query("SELECT id, xp, coins FROM difficulties");
  const [quizzes] = await pool.query("SELECT * FROM quizzes");
  const [quizQs] = await pool.query("SELECT quiz_id, question_id FROM quiz_questions");
  const [questions] = await pool.query("SELECT * FROM questions");
  const [badges] = await pool.query("SELECT * FROM badges");
  const [challenges] = await pool.query("SELECT * FROM challenges");
  const [questDefs] = await pool.query("SELECT * FROM daily_quest_defs");
  const [shopItems] = await pool.query("SELECT * FROM shop_items");
  const [students] = await pool.query("SELECT id, name, current_grade, current_board FROM players WHERE role='STUDENT' AND email LIKE '%@demo.chemquest.gg'");
  const [teachers] = await pool.query("SELECT id, current_grade, current_board FROM players WHERE role='TEACHER' AND email LIKE '%@demo.chemquest.gg'");

  const diffById = Object.fromEntries(diffsFull.map((d) => [d.id, d]));
  const questIds = questDefs.map((q) => q.id);
  const questById = Object.fromEntries(questDefs.map((q) => [q.id, q]));
  const quizBySubject = {};
  for (const z of quizzes) if (z.visibility === "published") (quizBySubject[z.subject_code] = quizBySubject[z.subject_code] || []).push(z);
  const qsByQuiz = {};
  for (const o of quizQs) (qsByQuiz[o.quiz_id] = qsByQuiz[o.quiz_id] || []).push(o.question_id);
  const questionById = Object.fromEntries(questions.map((x) => [x.id, x]));
  const challengeById = Object.fromEntries(challenges.map((c) => [c.id, c]));

  if (!students.length) {
    console.log("No demo students found; aborting.");
    process.exit(1);
  }

  const worldsBySubject = {};
  for (const w of worlds) (worldsBySubject[w.subject_code] = worldsBySubject[w.subject_code] || []).push(w);
  const lessonsByWorld = {};
  for (const l of lessons) (lessonsByWorld[l.world_id] = lessonsByWorld[l.world_id] || []).push(l);

  // =============================================================
  // 1. CURRICULUM TOP-UP
  // =============================================================
  const NEW_WORLDS = [
    { id: "language-and-literature-meadows", subject_code: "tamil", name: "Language & Literature Meadows", topic: "Grammar, Prose & Poetry", icon: "BookOpen", boss: "Metaphor Beast", is_final: 0 },
    { id: "society-and-civics-savanna", subject_code: "social-science", name: "Society & Civics Savanna", topic: "Civics, Polity & Society", icon: "Landmark", boss: "Constitution Colossus", is_final: 0 },
  ];
  for (const nw of NEW_WORLDS) {
    const exists = await pool.query("SELECT COUNT(*) n FROM worlds WHERE id=?", [nw.id]);
    if (!exists[0][0].n) {
      await pool.query("INSERT INTO worlds (id, subject_code, name, topic, icon, boss, is_final, sort_order) VALUES (?,?,?,?,?,?,?,?)", [nw.id, nw.subject_code, nw.name, nw.topic, nw.icon, nw.boss, nw.is_final, 9999]);
      totalInserts++;
    }
    if (!worldsBySubject[nw.subject_code]) worldsBySubject[nw.subject_code] = [];
    worldsBySubject[nw.subject_code].push({ id: nw.id, subject_code: nw.subject_code, name: nw.name, topic: nw.topic, icon: nw.icon, boss: nw.boss, is_final: 0 });
  }

  const allWorlds = [...worlds];
  const knownIds = new Set(worlds.map((w) => w.id));
  for (const nw of NEW_WORLDS) if (!knownIds.has(nw.id)) allWorlds.push(nw);
  // In-memory record of which worlds already have a unit (units has no world_id).
  const [existingUnits] = await pool.query("SELECT subject_code, name FROM units");
  const existingUnitKeys = new Set(existingUnits.map((u) => `${u.subject_code}|${u.name}`));

  // Lessons for worlds that have none.
  let sortCounter = 0;
  for (const w of allWorlds) {
    if ((lessonsByWorld[w.id] || []).length) continue;
    for (let i = 1; i <= 3; i++) {
      const key = `l${i}`;
      const title = `${w.topic || w.name} - Lesson ${i}`;
      const desc = `Self-learning lesson ${i} in ${w.name}.`;
      const [r] = await pool.query("INSERT INTO lessons (world_id, lesson_key, title, description, sort_order, status) VALUES (?,?,?,?,?, 'published')", [w.id, key, title, desc, sortCounter * 10]);
      lessonsByWorld[w.id] = lessonsByWorld[w.id] || [];
      lessonsByWorld[w.id].push({ id: r.insertId, world_id: w.id, lesson_key: key, title, description: desc });
      sortCounter++;
    }
  }

  // Questions + quiz for subjects with no questions at all.
  for (const subj of subjects) {
    if (subj.status !== "active") continue;
    const hasQuestions = questions.some((qq) => {
      const w = worlds.find((x) => x.id === qq.world_id);
      return w && w.subject_code === subj.code;
    });
    if (hasQuestions) continue;
    const wid = (worldsBySubject[subj.code] || [])[0];
    if (!wid) continue;
    const stems = [
      `Which of the following is a foundational topic in ${subj.name}?`,
      `In ${subj.name}, which term best describes a core principle of the subject?`,
      `Which key idea belongs to ${subj.name}?`,
      `What is the best first step when learning ${subj.name}?`,
      `Which option is an example of ${subj.name} applied in daily life?`,
      `A well-structured ${subj.name} lesson typically begins with:`,
      `Which of these is a primary source of information in ${subj.name}?`,
      `Which activity best builds mastery in ${subj.name}?`,
      `In ${subj.name}, reviewing past lessons helps you to:`,
      `The most important habit for succeeding in ${subj.name} is:`,
    ];
    const newQ = [];
    for (let i = 0; i < 10; i++) {
      const [r] = await pool.query(
        "INSERT INTO questions (world_id, board_code, difficulty_id, type, question_text, options_json, correct_answer, explanation, sort_order, status) VALUES (?,?,?,?,?,?,?,?,?, 'published')",
        [wid.id, null, diffs[i % diffs.length].id, "multiple-choice", stems[i], JSON.stringify([stems[i], "Option B", "Option C", "Option D"]), stems[i], "This is the correct foundational concept for " + subj.name + ".", i]
      );
      newQ.push(r.insertId);
    }
    const quizId = `QUIZ_${subj.code.slice(0, 3).toUpperCase()}_001`;
    await pool.query("INSERT INTO quizzes (id, title, description, standard_id, subject_code, difficulty, question_count, time_limit_minutes, max_attempts, xp_reward, coins_reward, passing_score, mastery_threshold, visibility, game_mode) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?, 'published', 'practice')", [quizId, `${subj.name} Essentials`, `Foundational quiz for ${subj.name}.`, "9", subj.code, "easy", 10, 20, 3, 100, 50, 60, 80]);
    for (let i = 0; i < newQ.length; i++) {
      await pool.query("INSERT INTO quiz_questions (quiz_id, question_id, sort_order, marks) VALUES (?,?,?,1)", [quizId, newQ[i], i]);
    }
    totalInserts += 10 + 1 + 10;
  }

  // Units / concepts / topics / learning contents generated from worlds & lessons.
  const unitIdByWorld = {};
  const conceptIdByLesson = {};
  let unitSort = 0;
  for (const w of allWorlds) {
    const lws = lessonsByWorld[w.id] || [];
    const unitName = w.topic || w.name;
    if (existingUnitKeys.has(`${w.subject_code}|${unitName}`)) continue;
    const [ur] = await pool.query("INSERT INTO units (subject_code, name, description, icon, sort_order, status) VALUES (?,?,?,?,?, 'published')", [w.subject_code, unitName, `Unit built around ${w.name} in ${w.subject_code}.`, w.icon, ++unitSort * 10]);
    unitIdByWorld[w.id] = ur.insertId;
    for (let i = 0; i < lws.length; i++) {
      const l = lws[i];
      const [cr] = await pool.query("INSERT INTO concepts (unit_id, name, description, sort_order, difficulty_level, status) VALUES (?,?,?,?,?, 'published')", [ur.insertId, l.title, `Concept "${l.title}" from the ${w.name} curriculum.`, i * 10, i < 2 ? "beginner" : i < 4 ? "intermediate" : "advanced"]);
      conceptIdByLesson[l.id] = cr.insertId;
      const topicNames = [`${l.title} - Foundations`, `${l.title} - Key Ideas`, `${l.title} - Practice & Application`];
      for (let t = 0; t < topicNames.length; t++) {
        const [tr] = await pool.query("INSERT INTO topics (concept_id, name, content_text, sort_order, status) VALUES (?,?,?,?, 'published')", [cr.insertId, topicNames[t], `${topicNames[t]}: a focused study note tied to ${w.name} / ${l.title}.`, t]);
        for (let c = 0; c < 2; c++) {
          await pool.query("INSERT INTO learning_contents (topic_id, content_type, title, content_body, sort_order) VALUES (?,?,?,?,?)", [
            tr.insertId,
            c === 0 ? "text" : "example",
            `${topicNames[t]} - ${c === 0 ? "Explanation" : "Worked Example"}`,
            c === 0 ? `Reading note for "${topicNames[t]}". Focus: ${w.name} -> ${l.title}.` : `Worked example for "${topicNames[t]}": step-by-step walkthrough with practice hints.`,
            c,
          ]);
        }
      }
    }
  }
  console.log(`Curriculum: ${Object.keys(unitIdByWorld).length} units, ${Object.keys(conceptIdByLesson).length} concepts seeded.`);

  // Backfill concept->lesson map from DB for worlds whose units already existed
  // (so mastery seeding still resolves concept ids on re-runs).
  for (const w of allWorlds) {
    if (unitIdByWorld[w.id]) continue;
    const unitName = w.topic || w.name;
    const [um] = await pool.query("SELECT id FROM units WHERE subject_code=? AND name=? LIMIT 1", [w.subject_code, unitName]);
    const uid = um[0] && um[0].id;
    if (!uid) continue;
    unitIdByWorld[w.id] = uid;
    const lws = lessonsByWorld[w.id] || [];
    for (const l of lws) {
      const [cm] = await pool.query("SELECT id FROM concepts WHERE unit_id=? AND name=? LIMIT 1", [uid, l.title]);
      if (cm[0]) conceptIdByLesson[l.id] = cm[0].id;
    }
  }
  console.log(`Concept map ready for ${Object.keys(conceptIdByLesson).length} lessons.`);

  // Teacher without a section (Kavita - english, school 2, grade 8) gets the ICSE g8 section.
  await pool.query("INSERT IGNORE INTO teacher_sections (teacher_id, section_id) SELECT id, 4 FROM players WHERE email=? AND NOT EXISTS (SELECT 1 FROM teacher_sections ts WHERE ts.teacher_id=players.id)", ["kavita.reddy@demo.chemquest.gg"]);

  // =============================================================
  // 2. PLAYER ACTIVITY
  // =============================================================
  const demoStudentIds = students.map((s) => s.id);
  const demoTeacherIds = teachers.map((t) => t.id);

  // Clean slate (idempotent re-runs) - scoped to demo players only.
  const [priorSets] = await pool.query("SELECT id FROM flashcard_sets WHERE player_id IN (?)", [demoStudentIds]);
  if (priorSets.length) {
    await pool.query("DELETE FROM flashcards WHERE set_id IN (?)", [priorSets.map((x) => x.id)]);
    await pool.query("DELETE FROM flashcard_sets WHERE player_id IN (?)", [demoStudentIds]);
  }
  const [priorAttempts] = await pool.query("SELECT id FROM quiz_attempts WHERE player_id IN (?)", [demoStudentIds]);
  if (priorAttempts.length) await pool.query("DELETE FROM quiz_answers WHERE attempt_id IN (?)", [priorAttempts.map((x) => x.id)]);
  for (const t of ["quiz_attempts", "player_completions", "player_boss_defeats", "quiz_submissions", "xp_transactions", "mastery", "player_badges", "player_challenges", "quest_claims", "notifications", "player_shop_items", "player_equipped", "player_powerups"]) {
    await pool.query(`DELETE FROM ${t} WHERE player_id IN (?)`, [demoStudentIds]);
  }
  await pool.query("DELETE FROM assignments WHERE teacher_id IN (?)", [demoTeacherIds]);

  const plan = {};
  for (const s of students) {
    const g = s.current_grade;
    const list = [];
    const codes = g >= 11 ? ["physics", "mathematics", "chemistry", "biology", "history", "computer-science", "geography"] : g >= 9 ? ["chemistry", "mathematics", "physics", "english"] : ["chemistry", "physics", "english", "mathematics"];
    for (const c of codes) for (const w of worldsBySubject[c] || []) if (!w.is_final) list.push(w);
    if (g >= 11) {
      for (const id of ["final-physics-frontier", "final-mathematics-kingdom", "final-chemistry-kingdom"]) {
        const w = worlds.find((x) => x.id === id);
        if (w) list.push(w);
      }
    } else if (g >= 9) {
      for (const id of ["final-chemistry-kingdom", "final-mathematics-kingdom"]) {
        const w = worlds.find((x) => x.id === id);
        if (w) list.push(w);
      }
    }
    plan[s.id] = [...new Map(list.map((w) => [w.id, w])).values()].slice(0, 9);
  }

  const completionRows = [];
  const bossRows = [];
  const xpRows = [];
  const masteryRows = [];
  const badgeRows = [];
  const challengeRows = [];
  const questRows = [];
  const notifRows = [];
  const attemptRows = [];
  const answerRows = [];
  const submissionRows = [];
  const fsCardRows = [];
  const shopRows = [];
  const equipRows = [];
  const powerRows = [];

  const badgeIds = badges.map((b) => b.id);
  const challengeIds = challenges.map((c) => c.id);
  const avatarItems = shopItems.filter((s) => s.category === "avatars");
  const skinItems = shopItems.filter((s) => s.category === "skins");
  const bgItems = shopItems.filter((s) => s.category === "backgrounds");
  const frameItems = shopItems.filter((s) => s.category === "frames");
  const powerBase = shopItems.filter((s) => s.category === "powerups");

  let attemptSeq = 0;
  for (let si = 0; si < students.length; si++) {
    const s = students[si];
    const g = s.current_grade;
    const b = s.current_board;
    const wPlan = plan[s.id] || [];
    const completedWorlds = [];

    for (const w of wPlan) {
      const lws = lessonsByWorld[w.id] || [];
      const useLessons = lws.slice(0, 5);
      if (!useLessons.length) continue;
      for (let li = 0; li < useLessons.length; li++) {
        const l = useLessons[li];
        const d = diffs[li % diffs.length].id;
        let acc = li === 0 ? rand(78, 96) : li === 2 ? rand(88, 99) : rand(60, 94);
        if (w.subject_code === "mathematics" && li === useLessons.length - 1) acc = rand(42, 55);
        if (si === 0 && completionRows.length === 0) acc = 100;
        if (acc >= 100) acc = 100;
        const dl = diffById[d];
        const xpGain = dl.xp + (acc >= 90 ? 15 : acc >= 60 ? 5 : 0);
        const coinGain = dl.coins + Math.floor(acc / 25);
        completionRows.push([s.id, String(g), b, w.id, l.lesson_key, d, acc, acc >= 90 ? 3 : acc >= 60 ? 2 : 1, xpGain, coinGain, daysAgo(rand(0, 27))]);
        xpRows.push([s.id, xpGain, "lesson_completion", `${w.id}:${l.lesson_key}:${d}`, daysAgo(rand(0, 27))]);
      }
      if (!w.is_final) completedWorlds.push(w.id);
    }
    for (const wid of completedWorlds.slice(0, 6)) {
      bossRows.push([s.id, String(g), b, wid, daysAgo(rand(0, 20))]);
    }

    // Quiz attempts + answers + submissions.
    const myQuizzes = [];
    for (const w of wPlan) {
      const list = quizBySubject[w.subject_code];
      if (list && list.length) myQuizzes.push(list[0]);
    }
    for (const z of [...new Map(myQuizzes.map((x) => [x.id, x])).values()].slice(0, 2)) {
      attemptSeq++;
      const aid = `qa-${si}-${attemptSeq}`;
      const qids = qsByQuiz[z.id] || [];
      if (!qids.length) continue;
      const total = Math.min(z.question_count || 10, qids.length);
      const correct = Math.round(total * rand(0.5, 0.95)) || 1;
      const accuracy = Math.round((correct / total) * 100);
      const xpZ = z.xp_reward + (accuracy >= 90 ? 25 : 0);
      attemptRows.push([aid, z.id, s.id, daysAgo(rand(1, 3)), daysAgo(rand(0, 2)), rand(18000, 900000), total, correct, total - correct, 0, accuracy, accuracy, xpZ, z.coins_reward, "completed"]);
      for (let qi = 0; qi < qids.length; qi++) {
        const qid = qids[qi];
        const ok = qi < correct;
        const src = questionById[qid];
        const ans = ok ? String(src ? src.correct_answer : "yes").slice(0, 80) : String(src ? (Array.isArray(src.options_json) ? src.options_json[0] : "wrong") : "no").slice(0, 80);
        answerRows.push([aid, qid, ans, ok ? 1 : 0, rand(1500, 80000), ok ? 6 : 0]);
        submissionRows.push([s.id, String(qid), ans, ok ? 1 : 0, rand(1500, 80000), daysAgo(rand(0, 4))]);
      }
      xpRows.push([s.id, xpZ, "quiz_completion", z.id, daysAgo(rand(0, 3))]);
    }

    // Mastery per subject's units & concepts.
    const subjectsDone = [...new Set(wPlan.map((w) => w.subject_code))];
    for (const sub of subjectsDone.slice(0, 4)) {
      const subWorlds = wPlan.filter((w) => w.subject_code === sub).slice(0, 3);
      for (const w of subWorlds) {
        const uid = unitIdByWorld[w.id];
        const lws = lessonsByWorld[w.id] || [];
        const concept = lws[0] ? conceptIdByLesson[lws[0].id] : null;
        if (!uid || !concept) continue;
        const attempts = rand(4, 26);
        const correct = Math.round(attempts * (rng() * 0.5 + 0.4));
        const lvl = correct / attempts >= 0.85 ? "mastered" : correct / attempts >= 0.7 ? "strong" : correct / attempts >= 0.55 ? "practicing" : "learning";
        masteryRows.push([s.id, sub, uid, null, concept, attempts, correct, Math.round((correct / attempts) * 100), lvl, daysAgo(rand(0, 15))]);
      }
    }

    // Badges.
    badgeRows.push([s.id, "first-quiz", daysAgo(rand(3, 20))]);
    badgeRows.push([s.id, "quiz-10", daysAgo(rand(1, 10))]);
    badgeRows.push([s.id, "streak-7", daysAgo(rand(1, 6))]);
    badgeRows.push([s.id, "daily-devotee", daysAgo(rand(1, 8))]);
    badgeRows.push([s.id, "explorer", daysAgo(rand(2, 15))]);
    badgeRows.push([s.id, "challenge-taker", daysAgo(rand(2, 12))]);
    badgeRows.push([s.id, "level-5", daysAgo(rand(3, 12))]);
    if (completedWorlds.length >= 3) badgeRows.push([s.id, "boss-slayer", daysAgo(rand(0, 9))]);
    if (rng() < 0.75) badgeRows.push([s.id, "concept-master", daysAgo(rand(0, 9))]);
    if (rng() < 0.5) badgeRows.push([s.id, "accuracy-90", daysAgo(rand(0, 9))]);
    if (rng() < 0.35) badgeRows.push([s.id, "perfect-score", daysAgo(rand(0, 12))]);

    // Challenges.
    for (let ci = 0; ci < Math.min(challengeIds.length, 8); ci++) {
      const cid = challengeIds[ci];
      const tgt = (challengeById[cid] || {}).target_count || 10;
      const done = rng() < 0.5;
      challengeRows.push([s.id, cid, done ? tgt : rand(1, tgt), done ? 1 : 0, done ? 1 : 0, done ? daysAgo(rand(0, 5)) : null]);
    }

    // Quest claims (recent days).
    for (let di = 0; di < 3; di++) {
      questRows.push([s.id, questIds[di % Math.max(questIds.length, 1)], dateKey(di), daysAgo(di)]);
    }

    // Notifications.
    const ntypes = [
      ["assignment", "New assignment ready", "A new assignment has been published for your class."],
      ["quiz", "Quiz graded", "Your latest quiz results are now available."],
      ["achievement", "Badge unlocked!", "You earned a new badge - keep up the great work!"],
      ["streak", "Streak at risk", "Complete a lesson today to keep your streak alive."],
      ["mastery", "Mastery update", "Your mastery levels were recalculated after this week's practice."],
    ];
    const pickN = ntypes.slice(0, rand(4, 5));
    for (let i = 0; i < pickN.length; i++) {
      notifRows.push([s.id, pickN[i][0], pickN[i][1], pickN[i][2], null, rng() < 0.4 ? 1 : 0, daysAgo(i * 2 + 1)]);
    }

    // Flashcard sets + cards.
    const setTitles = [`Grade ${g} Revision`, `Weekly ${b} Sprint`];
    for (let t = 0; t < setTitles.length; t++) {
      const setId = `fs-${si}-${t}`;
      await pool.query("INSERT INTO flashcard_sets (id, player_id, subject_code, title, description, card_count, is_public, created_at) VALUES (?,?,?,?,?,?,0,?)", [
        setId,
        s.id,
        wPlan[0] ? wPlan[0].subject_code : "chemistry",
        setTitles[t],
        `Personal flashcard set for grade ${g} revision.`,
        6,
        daysAgo(rand(0, 10)),
      ]);
      for (let i = 0; i < 6; i++) fsCardRows.push([setId, `Flashcard ${i + 1} - ${setTitles[t]}`, `Answer for card ${i + 1} with key revision points.`, null, null, ["easy", "medium", "hard"][i % 3], null, rand(0, 12), 2.5, i]);
    }

    // Shop, equipped, powerups.
    const buyAvatar = pick(avatarItems);
    const buySkin = pick(skinItems);
    const buyBg = pick(bgItems);
    const buyFrame = pick(frameItems);
    shopRows.push([s.id, buyAvatar.id, daysAgo(rand(0, 20))]);
    if (rng() < 0.8) shopRows.push([s.id, buySkin.id, daysAgo(rand(0, 15))]);
    shopRows.push([s.id, buyBg.id, daysAgo(rand(0, 18))]);
    shopRows.push([s.id, buyFrame.id, daysAgo(rand(0, 12))]);
    const otherSkins = skinItems.filter((i) => i.id !== buySkin.id);
    if (rng() < 0.5 && otherSkins.length) shopRows.push([s.id, pick(otherSkins).id, daysAgo(rand(0, 10))]);
    equipRows.push([s.id, "avatar", buyAvatar.id]);
    equipRows.push([s.id, "skin", buySkin.id]);
    equipRows.push([s.id, "background", buyBg.id]);
    equipRows.push([s.id, "frame", buyFrame.id]);
    const extras = powerBase.filter((p) => p.id !== "pu-hint" && p.id !== "pu-shield");
    const third = pick(extras.length ? extras : powerBase) || { id: "pu-doublexp" };
    powerRows.push([s.id, "pu-hint", rand(2, 5)]);
    powerRows.push([s.id, "pu-shield", rand(1, 3)]);
    powerRows.push([s.id, third.id, rand(1, 2)]);
  }

  console.log("Inserting activity rows...");
  await insertMany("player_completions", ["player_id", "grade", "board", "world_id", "lesson_id", "difficulty_id", "accuracy", "stars", "xp", "coins", "completed_at"], completionRows);
  await insertMany("player_boss_defeats", ["player_id", "grade", "board", "world_id", "defeated_at"], bossRows);
  await insertMany("xp_transactions", ["player_id", "amount", "source", "reference_id", "created_at"], xpRows);
  await insertMany("mastery", ["player_id", "subject_code", "unit_id", "chapter_id", "concept_id", "total_attempts", "correct_count", "accuracy", "mastery_level", "last_attempted_at"], masteryRows);
  await insertMany("player_badges", ["player_id", "badge_id", "earned_at"], badgeRows);
  await insertMany("player_challenges", ["player_id", "challenge_id", "progress", "completed", "claimed", "completed_at"], challengeRows);
  await insertMany("quest_claims", ["player_id", "quest_id", "date_key", "claimed_at"], questRows);
  await insertMany("notifications", ["player_id", "type", "title", "message", "link", "read", "created_at"], notifRows);
  await insertMany("quiz_attempts", ["id", "quiz_id", "player_id", "started_at", "completed_at", "time_taken_ms", "total_questions", "correct_count", "incorrect_count", "skipped_count", "score", "accuracy", "xp_earned", "coins_earned", "status"], attemptRows);
  await insertMany("quiz_answers", ["attempt_id", "question_id", "selected_answer", "correct", "time_taken_ms", "xp_earned"], answerRows);
  await insertMany("quiz_submissions", ["player_id", "question_id", "selected_answer", "correct", "time_taken_ms", "created_at"], submissionRows);
  await insertMany("flashcards", ["set_id", "front_text", "back_text", "front_media", "back_media", "difficulty", "next_review_at", "review_count", "ease_factor", "sort_order"], fsCardRows);
  await insertMany("player_shop_items", ["player_id", "item_id", "owned_at"], shopRows);
  await insertMany("player_equipped", ["player_id", "category", "item_id"], equipRows);
  await insertMany("player_powerups", ["player_id", "item_id", "count"], powerRows);

  // =============================================================
  // 3. ASSIGNMENTS for demo teachers
  // =============================================================
  const assignmentRows = [];
  let asgSeq = 0;
  for (const t of teachers) {
    const tsubs = await pool.query("SELECT subject_code FROM teacher_subjects WHERE teacher_id=?", [t.id]);
    const tsections = await pool.query("SELECT section_id FROM teacher_sections WHERE teacher_id=?", [t.id]);
    const tgrades = await pool.query("SELECT grade FROM teacher_classes WHERE teacher_id=?", [t.id]);
    const subjCodes = tsubs[0].map((r) => r.subject_code);
    const secIds = tsections[0].map((r) => r.section_id);
    const grades = tgrades[0].map((r) => r.grade);
    for (const sub of subjCodes) {
      const qz = (quizBySubject[sub] || [])[0];
      if (!qz) continue;
      asgSeq++;
      const sec = secIds[0] || null;
      const grade = grades[0] || null;
      assignmentRows.push([`asg-${t.id.slice(0, 6)}-${asgSeq}`, qz.id, t.id, grade, t.current_board, sec, `${qz.title} - Assignment ${asgSeq}`, `Complete the ${qz.title} quiz by the due date. Show your working where applicable.`, daysAgo(7), daysAgo(-2), 3, qz.time_limit_minutes || 30, "published", daysAgo(7)]);
    }
  }
  await insertMany("assignments", ["id", "quiz_id", "teacher_id", "class_id", "board_code", "section_id", "title", "instructions", "start_date", "due_date", "max_attempts", "time_limit_minutes", "status", "created_at"], assignmentRows);

  // Public flashcard set if none exist (shareable sets for the library).
  const [pubSets] = await pool.query("SELECT COUNT(*) n FROM flashcard_sets WHERE is_public=1");
  if (!pubSets[0].n) {
    const setId = "fs-public-chem9";
    await pool.query("INSERT INTO flashcard_sets (id, player_id, subject_code, title, description, card_count, is_public, created_at) VALUES (?,?,?,?,?,?,1,?)", [setId, null, "chemistry", "Grade 9 Chemistry Essentials", "Public set covering atoms, molecules and bonding.", 8, daysAgo(5)]);
    for (let i = 0; i < 8; i++) {
      await pool.query("INSERT INTO flashcards (set_id, front_text, back_text, difficulty, review_count, ease_factor, sort_order) VALUES (?,?,?,?,?,2.5,?)", [setId, `Chem Card ${i + 1}`, `Answer ${i + 1}`, ["easy", "medium", "hard"][i % 3], 0, i]);
    }
  }

  // =============================================================
  // 4. FINAL COUNTS
  // =============================================================
  const tables = ["player_completions", "player_boss_defeats", "quiz_attempts", "quiz_answers", "quiz_submissions", "xp_transactions", "mastery", "player_badges", "player_challenges", "quest_claims", "notifications", "flashcard_sets", "flashcards", "player_shop_items", "player_equipped", "player_powerups", "assignments", "units", "concepts", "topics", "learning_contents"];
  console.log("\n=== FINAL COUNTS ===");
  for (const t of tables) {
    const [c] = await pool.query(`SELECT COUNT(*) n FROM ${t}`);
    console.log(`  ${t}: ${c[0].n}`);
  }
  console.log(`\nTotal rows inserted this run: ${totalInserts}`);
  await pool.end();
})().catch((e) => {
  console.error("SEED ERR", e);
  process.exit(1);
});