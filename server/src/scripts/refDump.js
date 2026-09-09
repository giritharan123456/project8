require("dotenv").config({ path: require("path").join(__dirname, "..", "..", ".env") });
const pool = require("../config/db");

async function q(sql, params) {
  const [rows] = await pool.query(sql, params || []);
  return rows;
}

(async () => {
  console.log("=== SUBJECTS with layer counts ===");
  const subjects = await q("SELECT s.code, s.name, s.status, s.sort_order, (SELECT COUNT(*) FROM worlds w WHERE w.subject_code=s.code) worlds, (SELECT COUNT(*) FROM lessons l JOIN worlds w ON l.world_id=w.id WHERE w.subject_code=s.code) lessons, (SELECT COUNT(*) FROM questions qq JOIN worlds w ON qq.world_id=w.id WHERE w.subject_code=s.code) questions, (SELECT COUNT(*) FROM quizzes qz WHERE qz.subject_code=s.code) quizzes FROM subjects s ORDER BY s.sort_order");
  for (const r of subjects) console.log(`${r.code} | ${r.name} | ${r.status} | worlds=${r.worlds} lessons=${r.lessons} questions=${r.questions} quizzes=${r.quizzes}`);

  console.log("\n=== WORLDS ===");
  const worlds = await q("SELECT id, subject_code, name, topic, is_final FROM worlds ORDER BY subject_code, sort_order");
  for (const w of worlds) console.log(`${w.id} | ${w.subject_code} | ${w.name} | ${w.topic} | final=${w.is_final}`);

  console.log("\n=== LESSONS (per world) ===");
  const lessons = await q("SELECT world_id, lesson_key, title FROM lessons WHERE board_code IS NULL ORDER BY world_id, sort_order");
  const byWorld = {};
  for (const l of lessons) (byWorld[l.world_id] = byWorld[l.world_id] || []).push(`${l.lesson_key}=${l.title}`);
  for (const g of Object.keys(byWorld)) console.log(`${g} -> ${byWorld[g].slice(0, 6).join(", ")}${byWorld[g].length > 6 ? "..." : ""}`);

  console.log("\n=== DIFFICULTIES ===");
  const diffs = await q("SELECT id, label, xp, coins FROM difficulties ORDER BY sort_order");
  for (const d of diffs) console.log(`${d.id} | ${d.label} | xp=${d.xp} coins=${d.coins}`);

  console.log("\n=== QUIZZES ===");
  const quizzes = await q("SELECT id, title, subject_code, difficulty, visibility, question_count, xp_reward, coins_reward, game_mode FROM quizzes");
  for (const z of quizzes) console.log(`${z.id} | ${z.title} | ${z.subject_code} | ${z.difficulty} | ${z.visibility} | n=${z.question_count} | ${z.game_mode}`);
  const quizQ = await q("SELECT quiz_id, COUNT(*) n, MIN(question_id) minq, MAX(question_id) maxq FROM quiz_questions GROUP BY quiz_id");
  console.log("quiz_question counts:");
  for (const z of quizQ) console.log(`  ${z.quiz_id} n=${z.n} minq=${z.minq} maxq=${z.maxq}`);

  console.log("\n=== BADGES ===");
  const badges = await q("SELECT id, name, category FROM badges ORDER BY sort_order");
  for (const b of badges) console.log(`${b.id} | ${b.name} | ${b.category}`);

  console.log("\n=== CHALLENGES ===");
  const chals = await q("SELECT id, title, challenge_type, target_count, status, subject_code FROM challenges");
  for (const c of chals) console.log(`${c.id} | ${c.title} | ${c.challenge_type} | ${c.subject_code} | target=${c.target_count} | ${c.status}`);

  console.log("\n=== DAILY QUEST DEFS ===");
  try {
    const dq = await q("SELECT * FROM daily_quest_defs");
    const cols = dq.length ? Object.keys(dq[0]) : [];
    console.log(`cols: ${cols.join(", ")}`);
    for (const d of dq) console.log(`${d.id} | ${d.title || d.name || ""} | ${d.target_count ?? ""}`);
  } catch (e) {
    console.log("ERR", e.message);
  }

  console.log("\n=== SHOP ITEMS ===");
  const shop = await q("SELECT id, category, name, icon, price FROM shop_items ORDER BY sort_order");
  for (const s of shop) console.log(`${s.id} | ${s.category} | ${s.name} | ${s.icon} | ${s.price}`);

  console.log("\n=== BOARDS ===");
  try {
    const boards = await q("SELECT * FROM boards");
    for (const b of boards) console.log(`${b.code} | ${b.name}`);
  } catch (e) {
    console.log("BOARDS ERR", e.message);
  }

  console.log("\n=== CLASSES ===");
  try {
    const cols = await q("SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='classes' ORDER BY ORDINAL_POSITION");
    console.log(`cols: ${cols.map((c) => c.COLUMN_NAME).join(", ")}`);
    const classes = await q("SELECT * FROM classes ORDER BY grade");
    for (const c of classes) console.log(`${JSON.stringify(c)}`);
  } catch (e) {
    console.log("CLASSES ERR", e.message);
  }

  console.log("\n=== DEMO PLAYERS ===");
  const players = await q("SELECT id, name, role, email, current_grade, current_board, school_id FROM players WHERE email LIKE '%@demo.learnquest.gg' ORDER BY role, name");
  for (const p of players) console.log(`${p.role} | ${p.name} | ${p.email} | g=${p.current_grade} b=${p.current_board} school=${p.school_id}`);

  console.log("\n=== SECTIONS ===");
  try {
    const secs = await q("SELECT id, school_id, name, grade, board_code FROM sections ORDER BY id");
    for (const s of secs) console.log(`${s.id} | school=${s.school_id} | ${s.name} | g=${s.grade} board=${s.board_code}`);
  } catch (e) {
    console.log("SECTIONS ERR", e.message);
  }

  console.log("\n=== QUESTIONS SAMPLE (chemistry) ===");
  try {
    const qs = await q("SELECT id, world_id, lesson_id, difficulty_id, question_text FROM questions WHERE world_id LIKE '%atom%' OR world_id LIKE '%molecule%' OR world_id LIKE '%bonding%' ORDER BY id LIMIT 8");
    for (const x of qs) console.log(`${x.id} | ${x.world_id} | ${x.lesson_id} | ${x.difficulty_id} | ${(x.question_text || "").slice(0, 60)}`);
    const q3 = await q("SELECT id, world_id, lesson_id, difficulty_id FROM questions ORDER BY id DESC LIMIT 5");
    console.log("LAST questions:");
    for (const x of q3) console.log(`${x.id} | ${x.world_id} | ${x.lesson_id} | ${x.difficulty_id}`);
  } catch (e) {
    console.log("QUESTIONS ERR", e.message);
  }

  console.log("\n=== QUESTIONS columns ===");
  try {
    const cols = await q("SELECT COLUMN_NAME, COLUMN_TYPE FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='questions' ORDER BY ORDINAL_POSITION");
    for (const c of cols) console.log(`  ${c.COLUMN_NAME}: ${c.COLUMN_TYPE}`);
  } catch (e) {
    console.log("QUESTIONS COLS ERR", e.message);
  }

  await pool.end();
})().catch((e) => {
  console.error("ERR", e);
  process.exit(1);
});