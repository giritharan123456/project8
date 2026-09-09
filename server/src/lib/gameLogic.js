// Server-side port of chemquest-landing/src/data/content.js's pure
// generators + src/store/playerStore.js's "live" overlays. Same math, same
// return shapes (so the frontend pages need zero changes when
// VITE_USE_MOCK_API=false) - the only difference is progress now comes from
// MySQL (player_completions / player_boss_defeats) instead of localStorage.

const pool = require("../config/db");

const DEFAULT_GRADE = "9";
const DEFAULT_BOARD = "CBSE";
const DEFAULT_SUBJECT = "chemistry";

// Tiny deterministic string hash - NOT cryptographic, just enough to turn
// "9-CBSE" vs "9-TN" into different-but-stable mock progress so a curriculum
// nobody has actually played yet still shows *some* progress on the map.
function seededRatio(seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h << 5) - h + seed.charCodeAt(i);
    h |= 0;
  }
  return (Math.abs(h) % 1000) / 1000;
}

function starsForProgress(progress) {
  if (progress >= 90) return 3;
  if (progress >= 70) return 2;
  if (progress >= 50) return 1;
  return 0;
}

function normGrade(grade) {
  return String(grade ?? DEFAULT_GRADE);
}
function normBoard(board) {
  return board ?? DEFAULT_BOARD;
}
// The client's subjectCatalog.js codes are short display codes ("CHEM",
// "MATH"), but the `subjects`/`worlds` tables key off full lowercase names
// ("chemistry", "mathematics" - see seedData.js SUBJECTS + WORLD_TEMPLATE
// subjectCode). Without this translation, every call that passes a short
// code (e.g. GET /api/courses?subject=MATH) silently matches zero DB rows.
const CLIENT_CODE_TO_DB_SUBJECT = {
  CHEM: "chemistry",
  MATH: "mathematics",
  PHY: "physics",
  BIO: "biology",
  ENG: "english",
  SST: "social-science",
  CS: "computer-science",
  ACC: "accountancy",
  BST: "commerce",
  ECO: "economics",
};

function normSubject(subject) {
  if (!subject) return DEFAULT_SUBJECT;
  return CLIENT_CODE_TO_DB_SUBJECT[subject.toUpperCase()] ?? subject;
}

// --- Content lookups (subjects / worlds / lessons / questions from MySQL) -

// Subject Selection screen, ahead of Board/Class selection.
async function getSubjects() {
  const [rows] = await pool.query("SELECT * FROM subjects ORDER BY sort_order ASC");
  return rows.map((s) => ({
    code: s.code,
    name: s.name,
    icon: s.icon,
    description: s.description,
    status: s.status,
  }));
}

async function getWorldTemplate(subject) {
  subject = normSubject(subject);
  const [rows] = await pool.query(
    "SELECT * FROM worlds WHERE subject_code = ? ORDER BY sort_order ASC",
    [subject]
  );
  return rows.map((w) => ({
    id: w.id,
    name: w.name,
    topic: w.topic,
    icon: w.icon,
    boss: w.boss,
    isFinal: !!w.is_final,
  }));
}

async function getDifficulties() {
  const [rows] = await pool.query("SELECT * FROM difficulties ORDER BY sort_order ASC");
  return rows.map((d) => ({
    id: d.id,
    label: d.label,
    description: d.description,
    xp: d.xp,
    coins: d.coins,
    unlockThreshold: d.unlock_threshold,
  }));
}

// Section 8: prefer a board-specific override, fall back to the shared
// template (board_code IS NULL) when none exists.
async function getLessonsForWorld(board, worldId) {
  const [overrideRows] = await pool.query(
    "SELECT * FROM lessons WHERE world_id = ? AND board_code = ? ORDER BY sort_order ASC",
    [worldId, board]
  );
  const rows = overrideRows.length > 0
    ? overrideRows
    : (await pool.query(
        "SELECT * FROM lessons WHERE world_id = ? AND board_code IS NULL ORDER BY sort_order ASC",
        [worldId]
      ))[0];
  return rows.map((l) => ({ id: l.lesson_key, title: l.title, description: l.description }));
}

async function getQuestionPool(board, worldId, difficultyId) {
  const [overrideRows] = await pool.query(
    "SELECT * FROM questions WHERE world_id = ? AND board_code = ? AND difficulty_id = ? ORDER BY sort_order ASC",
    [worldId, board, difficultyId]
  );
  const rows = overrideRows.length > 0
    ? overrideRows
    : (await pool.query(
        "SELECT * FROM questions WHERE world_id = ? AND board_code IS NULL AND difficulty_id = ? ORDER BY sort_order ASC",
        [worldId, difficultyId]
      ))[0];
  return rows.map((r) => ({
    q: r.question_text,
    type: r.type,
    options: r.options_json || null,
    pairs: r.pairs_json || null,
    image: r.image || null,
    answer: r.correct_answer,
    explanation: r.explanation,
  }));
}

// --- World map (Section 10) ---------------------------------------------

// Pure seeded-mock world map, same algorithm as content.js's getWorldMap.
function buildSeededWorldMap(worldTemplate, grade, board, subject) {
  let previousCleared = true;
  const worlds = worldTemplate.map((world, i) => {
    const seed = `${subject}-${grade}-${board}-${world.id}`;
    const roll = seededRatio(seed);
    let status = "locked";
    let progress = 0;
    if (previousCleared) {
      progress = i === 0 ? Math.round(35 + roll * 65) : Math.round(roll * 100);
      status = progress >= 100 ? "completed" : "unlocked";
      progress = Math.min(progress, status === "completed" ? 100 : 96);
    }
    previousCleared = status === "completed";
    return {
      ...world,
      status,
      progress,
      stars: status === "completed" ? starsForProgress(progress) : 0,
      xp: status === "completed" ? Math.round(180 + roll * 320) : 0,
    };
  });

  const completedCount = worlds.filter((w) => w.status === "completed").length;
  const totalStars = worlds.reduce((sum, w) => sum + w.stars, 0);
  const totalXp = worlds.reduce((sum, w) => sum + w.xp, 0);
  const overallProgress = Math.round(
    worlds.reduce((sum, w) => sum + (w.status === "completed" ? 100 : w.progress), 0) / worlds.length
  );
  return { worlds, completedCount, totalStars, totalXp, overallProgress };
}

// Live version: overlays real player_completions/player_boss_defeats on top
// of the seeded mock, same precedence as playerStore.js's getWorldMapLive
// ("no real play in this world yet" -> respect the seeded mock).
async function getWorldMapLive(playerId, grade, board, subject) {
  grade = normGrade(grade);
  board = normBoard(board);
  subject = normSubject(subject);
  const worldTemplate = await getWorldTemplate(subject);
  const base = buildSeededWorldMap(worldTemplate, grade, board, subject);

  // world_id is globally unique across subjects (see worlds.subject_code in
  // schema.sql), so these queries don't need a subject filter of their own -
  // they're already scoped by which worlds are in worldTemplate above.
  const worldIds = worldTemplate.map((w) => w.id);
  const [completions] = worldIds.length
    ? await pool.query(
        "SELECT * FROM player_completions WHERE player_id = ? AND grade = ? AND board = ? AND world_id IN (?)",
        [playerId, grade, board, worldIds]
      )
    : [[]];
  const [bossDefeats] = worldIds.length
    ? await pool.query(
        "SELECT world_id FROM player_boss_defeats WHERE player_id = ? AND grade = ? AND board = ? AND world_id IN (?)",
        [playerId, grade, board, worldIds]
      )
    : [[]];
  const bossDefeatedSet = new Set(bossDefeats.map((b) => b.world_id));

  let previousCleared = true;
  const worlds = [];
  for (const world of base.worlds) {
    const lessonDefs = await getLessonsForWorld(board, world.id);
    const total = lessonDefs.length || 1;
    const bossDone = bossDefeatedSet.has(world.id);

    let lessonsCleared = 0;
    let worldXpFromPlay = 0;
    let anyRealCompletion = false;

    for (const lesson of lessonDefs) {
      const easyRow = completions.find(
        (c) => c.world_id === world.id && c.lesson_id === lesson.id && c.difficulty_id === "easy"
      );
      if (easyRow) {
        lessonsCleared += 1;
        anyRealCompletion = true;
      }
      for (const c of completions) {
        if (c.world_id === world.id && c.lesson_id === lesson.id) worldXpFromPlay += c.xp;
      }
    }

    const hasRealData = anyRealCompletion || bossDone;
    if (!hasRealData) {
      const result = previousCleared ? world : { ...world, status: "locked", progress: 0, stars: 0, xp: 0 };
      previousCleared = result.status === "completed";
      worlds.push(result);
      continue;
    }

    const progress = bossDone ? 100 : Math.min(96, Math.round((lessonsCleared / total) * 100));
    const status = bossDone ? "completed" : "unlocked";
    const stars = bossDone ? 3 : starsForProgress(progress);
    previousCleared = status === "completed";
    worlds.push({ ...world, status, progress, stars, xp: worldXpFromPlay });
  }

  const completedCount = worlds.filter((w) => w.status === "completed").length;
  const totalStars = worlds.reduce((sum, w) => sum + w.stars, 0);
  const totalXp = worlds.reduce((sum, w) => sum + w.xp, 0);
  const overallProgress = Math.round(
    worlds.reduce((sum, w) => sum + (w.status === "completed" ? 100 : w.progress), 0) / worlds.length
  );
  return { worlds, completedCount, totalStars, totalXp, overallProgress };
}

// --- Course / Chapter screen (Section 11) --------------------------------

async function getCourseDetailLive(playerId, grade, board, worldId, subject) {
  grade = normGrade(grade);
  board = normBoard(board);
  subject = normSubject(subject);
  const { worlds } = await getWorldMapLive(playerId, grade, board, subject);
  const world = worlds.find((w) => w.id === worldId);
  if (!world) return null;

  const lessonDefs = await getLessonsForWorld(board, worldId);
  const total = lessonDefs.length;

  const [completions] = await pool.query(
    "SELECT * FROM player_completions WHERE player_id = ? AND grade = ? AND board = ? AND world_id = ?",
    [playerId, grade, board, worldId]
  );
  const [bossDefeats] = await pool.query(
    "SELECT 1 FROM player_boss_defeats WHERE player_id = ? AND grade = ? AND board = ? AND world_id = ?",
    [playerId, grade, board, worldId]
  );
  const bossDone = bossDefeats.length > 0;

  const completionByLesson = (lessonId) =>
    completions.find((c) => c.lesson_id === lessonId && c.difficulty_id === "easy") || null;

  let anyReal = false;
  const seededLessons = buildSeededLessons(worldTemplateRoll(subject, grade, board, worldId), lessonDefs, world);
  const lessons = seededLessons.map((lesson) => {
    const completion = completionByLesson(lesson.id);
    if (!completion) return lesson;
    anyReal = true;
    return { ...lesson, status: "completed", progress: 100, stars: completion.stars, xp: completion.xp };
  });

  if (!anyReal && !bossDone) {
    const allLessonsCleared = total > 0 && lessons.every((l) => l.status === "completed");
    const bossStatus = world.status === "completed" ? "defeated" : allLessonsCleared ? "ready" : "locked";
    return { world, lessons, bossStatus };
  }

  let unlockedNext = false;
  const finalLessons = lessons.map((lesson) => {
    if (lesson.status === "completed") return lesson;
    if (!unlockedNext) {
      unlockedNext = true;
      return { ...lesson, status: "unlocked" };
    }
    return { ...lesson, status: "locked" };
  });

  const allLessonsCleared = finalLessons.length > 0 && finalLessons.every((l) => l.status === "completed");
  const bossStatus = bossDone ? "defeated" : allLessonsCleared ? "ready" : "locked";

  const worldProgress = Math.round(
    (finalLessons.filter((l) => l.status === "completed").length / (finalLessons.length || 1)) * 100
  );
  let worldXpFromPlay = 0;
  for (const c of completions) worldXpFromPlay += c.xp;
  const worldStars = bossDone ? 3 : starsForProgress(worldProgress);

  return {
    world: {
      ...world,
      status: bossDone ? "completed" : "unlocked",
      progress: bossDone ? 100 : worldProgress,
      xp: worldXpFromPlay,
      stars: worldStars,
    },
    lessons: finalLessons,
    bossStatus,
  };
}

function worldTemplateRoll(subject, grade, board, worldId) {
  return { subject, grade, board, worldId };
}

// Builds the seeded-mock lesson list (same algorithm as content.js's
// getCourseDetail) before any live completions are overlaid.
function buildSeededLessons({ subject, grade, board, worldId }, lessonDefs, world) {
  const total = lessonDefs.length;
  const completedCount =
    world.status === "completed" ? total : Math.min(total, Math.floor((world.progress / 100) * total));

  return lessonDefs.map((lesson, i) => {
    const roll = seededRatio(`${subject}-${grade}-${board}-${worldId}-lesson-${lesson.id}`);
    if (world.status === "locked") {
      return { ...lesson, status: "locked", progress: 0, stars: 0, xp: 0 };
    }
    if (i < completedCount) {
      const score = Math.round(65 + roll * 35);
      return { ...lesson, status: "completed", progress: 100, stars: starsForProgress(score), xp: Math.round(20 + roll * 40) };
    }
    if (i === completedCount) {
      return { ...lesson, status: "unlocked", progress: Math.round(roll * 45), stars: 0, xp: 0 };
    }
    return { ...lesson, status: "locked", progress: 0, stars: 0, xp: 0 };
  });
}

// --- Difficulty select (Section 13) --------------------------------------

async function getDifficultyProgressLive(playerId, grade, board, worldId, lessonId, subject) {
  grade = normGrade(grade);
  board = normBoard(board);
  subject = normSubject(subject);
  const detail = await getCourseDetailLive(playerId, grade, board, worldId, subject);
  if (!detail) return null;
  const lesson = detail.lessons.find((l) => l.id === lessonId);
  if (!lesson) return null;

  const difficulties = await getDifficulties();

  if (lesson.status === "locked") {
    return {
      world: detail.world,
      lesson,
      difficulties: difficulties.map((d) => ({ ...d, status: "locked", bestScore: 0 })),
    };
  }

  const [completions] = await pool.query(
    "SELECT * FROM player_completions WHERE player_id = ? AND grade = ? AND board = ? AND world_id = ? AND lesson_id = ?",
    [playerId, grade, board, worldId, lessonId]
  );

  const clearedCount =
    lesson.status === "completed"
      ? difficulties.length
      : Math.min(difficulties.length, Math.floor((lesson.progress / 100) * difficulties.length));

  let previousUnlockedNext = true;
  const seeded = difficulties.map((d, i) => {
    const roll = seededRatio(`${subject}-${grade}-${board}-${worldId}-${lessonId}-${d.id}`);
    let status = "locked";
    let bestScore = 0;
    if (previousUnlockedNext) {
      if (i < clearedCount) {
        bestScore = Math.round(60 + roll * 40);
        status = "completed";
      } else if (i === clearedCount) {
        status = "unlocked";
      }
    }
    previousUnlockedNext = status === "completed" && (d.unlockThreshold == null || bestScore >= d.unlockThreshold);
    return { ...d, status, bestScore };
  });

  let anyReal = false;
  let previousCleared = true;
  const live = seeded.map((difficulty) => {
    const completion = completions.find((c) => c.difficulty_id === difficulty.id);
    if (completion) {
      anyReal = true;
      previousCleared = difficulty.unlockThreshold == null || completion.accuracy >= difficulty.unlockThreshold;
      return { ...difficulty, status: "completed", bestScore: completion.accuracy };
    }
    if (previousCleared) {
      previousCleared = false;
      return { ...difficulty, status: "unlocked", bestScore: 0 };
    }
    return { ...difficulty, status: "locked", bestScore: 0 };
  });

  return { world: detail.world, lesson, difficulties: anyReal ? live : seeded };
}

// --- Battle / Boss Battle question building (Sections 14 & 21) ----------

const MONSTER_TYPES = ["Slime", "Wisp", "Golem", "Sprite", "Fiend", "Serpent"];
// Derives a monster-name prefix from the world's own name instead of a
// hardcoded per-world-id map, so any subject's worlds (not just Chemistry's)
// get a sensible enemy name for free - e.g. "Algebra Atoll" -> "Algebra",
// "Atom Valley" -> "Atom".
function worldMonsterPrefix(world) {
  return world?.name?.split(" ")[0] || "Mystic";
}
const TIMER_BY_DIFFICULTY = { easy: 30, medium: 25, hard: 20, expert: 15 };
const BOSS_TIMER_BY_DIFFICULTY = { easy: 25, medium: 20, hard: 18, expert: 15 };
const BOSS_DIFFICULTY_MIX = ["easy", "easy", "medium", "medium", "medium", "hard", "hard", "hard", "expert", "expert"];
const BOSS_REWARD = { xp: 500, coins: 250 };

async function getBattleData(playerId, grade, board, worldId, lessonId, difficultyId, subject) {
  grade = normGrade(grade);
  board = normBoard(board);
  subject = normSubject(subject);
  const detail = await getCourseDetailLive(playerId, grade, board, worldId, subject);
  if (!detail) return null;
  const lesson = detail.lessons.find((l) => l.id === lessonId);
  if (!lesson || lesson.status === "locked") return null;

  const difficulties = await getDifficulties();
  const difficulty = difficulties.find((d) => d.id === difficultyId);
  if (!difficulty) return null;

  const pool_ = await getQuestionPool(board, worldId, difficultyId);
  if (pool_.length === 0) return null;

  const roll = seededRatio(`${subject}-${grade}-${board}-${worldId}-${lessonId}-${difficultyId}-enemy`);
  const monster = MONSTER_TYPES[Math.floor(roll * MONSTER_TYPES.length)];
  const enemyName = `${worldMonsterPrefix(detail.world)} ${monster}`;

  const count = pool_.length;
  const baseXp = Math.floor(difficulty.xp / count);
  const baseCoins = Math.floor(difficulty.coins / count);
  const questions = pool_.map((item, i) => ({
    id: `${worldId}-${lessonId}-${difficultyId}-${i}`,
    class: grade,
    board,
    course: detail.world.name,
    lesson: lesson.title,
    difficulty: difficultyId,
    question: item.q,
    type: item.type ?? "mcq",
    options: item.options ?? null,
    pairs: item.pairs ?? null,
    image: item.image ?? null,
    correctAnswer: item.answer,
    explanation: item.explanation,
    xp: i === count - 1 ? difficulty.xp - baseXp * (count - 1) : baseXp,
    coins: i === count - 1 ? difficulty.coins - baseCoins * (count - 1) : baseCoins,
    timer: TIMER_BY_DIFFICULTY[difficultyId] ?? 25,
  }));

  return { world: detail.world, lesson, difficulty, enemyName, questions };
}

async function getBossBattleData(playerId, grade, board, worldId, subject) {
  grade = normGrade(grade);
  board = normBoard(board);
  subject = normSubject(subject);
  const detail = await getCourseDetailLive(playerId, grade, board, worldId, subject);
  if (!detail) return null;
  const { world, bossStatus } = detail;
  if (bossStatus === "locked") return { world, bossStatus, questions: null };

  const pools = {
    easy: await getQuestionPool(board, worldId, "easy"),
    medium: await getQuestionPool(board, worldId, "medium"),
    hard: await getQuestionPool(board, worldId, "hard"),
    expert: await getQuestionPool(board, worldId, "expert"),
  };
  if (Object.values(pools).every((p) => p.length === 0)) return null;

  const difficulties = await getDifficulties();
  const cursors = { easy: 0, medium: 0, hard: 0, expert: 0 };
  const questions = BOSS_DIFFICULTY_MIX.map((difficultyId, i) => {
    const p = pools[difficultyId] ?? [];
    const item = p.length > 0 ? p[cursors[difficultyId] % p.length] : null;
    cursors[difficultyId] += 1;
    if (!item) return null;
    const tier = difficulties.find((d) => d.id === difficultyId);
    return {
      id: `${worldId}-boss-${difficultyId}-${i}`,
      class: grade,
      board,
      course: world.name,
      lesson: `${world.boss} (Boss)`,
      difficulty: difficultyId,
      question: item.q,
      type: item.type ?? "mcq",
      options: item.options ?? null,
      pairs: item.pairs ?? null,
      image: item.image ?? null,
      correctAnswer: item.answer,
      explanation: item.explanation,
      xp: tier?.xp ?? 20,
      coins: tier?.coins ?? 10,
      timer: BOSS_TIMER_BY_DIFFICULTY[difficultyId] ?? 20,
    };
  }).filter(Boolean);

  if (questions.length === 0) return null;

  const worldTemplate = await getWorldTemplate(subject);
  const worldIndex = worldTemplate.findIndex((w) => w.id === worldId);
  const nextWorld = worldIndex >= 0 && worldIndex + 1 < worldTemplate.length ? worldTemplate[worldIndex + 1] : null;

  return { world, bossStatus, questions, nextWorld, reward: BOSS_REWARD };
}

// --- Dashboard (Section 23) -----------------------------------------------

async function getDashboardDataLive(playerId, grade, board, subject) {
  const currentGrade = normGrade(grade);
  const currentBoard = normBoard(board);
  const currentSubject = normSubject(subject);
  const { worlds, completedCount, totalStars, totalXp, overallProgress } = await getWorldMapLive(
    playerId,
    currentGrade,
    currentBoard,
    currentSubject
  );

  const continueWorld =
    worlds.find((w) => w.status === "unlocked") ?? worlds.find((w) => w.status !== "completed") ?? null;

  const otherCombos = [
    { grade: "9", board: "TN" },
    { grade: "10", board: "CBSE" },
  ].filter((c) => !(c.grade === currentGrade && c.board === currentBoard));

  const curricula = [
    { grade: currentGrade, board: currentBoard, subject: currentSubject, current: true, overallProgress, totalStars },
    ...(await Promise.all(
      otherCombos.map(async (c) => {
        const map = await getWorldMapLive(playerId, c.grade, c.board, currentSubject);
        return { grade: c.grade, board: c.board, subject: currentSubject, current: false, overallProgress: map.overallProgress, totalStars: map.totalStars };
      })
    )),
  ];

  const badgesUnlocked = (await getAchievementsLive(playerId, currentGrade, currentBoard, currentSubject)).filter((b) => b.unlocked).length;

  return { worlds, completedCount, totalStars, totalXp, overallProgress, continueWorld, curricula, badgesUnlocked };
}

// --- Achievements (Section 25) --------------------------------------------

async function getAchievementsLive(playerId, grade, board, subject) {
  grade = normGrade(grade);
  board = normBoard(board);
  subject = normSubject(subject);
  const [defs] = await pool.query("SELECT * FROM achievement_defs ORDER BY sort_order ASC");
  const [player] = await pool.query("SELECT streak FROM players WHERE id = ?", [playerId]);
  const streak = player[0]?.streak ?? 0;

  const worldTemplate = await getWorldTemplate(subject);
  const worldIds = worldTemplate.map((w) => w.id);
  const [completions] = worldIds.length
    ? await pool.query(
        "SELECT * FROM player_completions WHERE player_id = ? AND grade = ? AND board = ? AND world_id IN (?)",
        [playerId, grade, board, worldIds]
      )
    : [[]];
  const [bossDefeats] = worldIds.length
    ? await pool.query(
        "SELECT world_id FROM player_boss_defeats WHERE player_id = ? AND grade = ? AND board = ? AND world_id IN (?)",
        [playerId, grade, board, worldIds]
      )
    : [[]];

  const hasAnyCompletion = completions.length > 0;
  const hasPerfectScore = completions.some((c) => c.accuracy >= 100);
  const worldsTouched = new Set(completions.map((c) => c.world_id));
  const allWorldsVisited = worldTemplate.length > 0 && worldTemplate.every((w) => worldsTouched.has(w.id));

  // "atomic-expert" (First-World Expert) checks the first world in
  // whichever subject's template is active, not a hardcoded Chemistry id -
  // that's "atom-valley" for Chemistry, "algebra-atoll" for Mathematics, etc.
  const firstWorldId = worldTemplate[0]?.id ?? null;
  const firstWorldLessons = firstWorldId ? await getLessonsForWorld(board, firstWorldId) : [];
  const difficulties = await getDifficulties();
  const atomicExpertDone =
    firstWorldLessons.length > 0 &&
    firstWorldLessons.every((lesson) =>
      difficulties.some((d) => {
        const row = completions.find((c) => c.world_id === firstWorldId && c.lesson_id === lesson.id && c.difficulty_id === d.id);
        return (row?.accuracy ?? 0) >= 90;
      })
    );

  const { totalStars } = await getWorldMapLive(playerId, grade, board, subject);

  const progressById = {
    "first-quest": { unlocked: hasAnyCompletion },
    "streak-7": { unlocked: streak >= 7, progressCurrent: Math.min(streak, 7), progressTarget: 7 },
    "atomic-expert": { unlocked: atomicExpertDone },
    "lab-explorer": { unlocked: allWorldsVisited },
    "boss-slayer": { unlocked: bossDefeats.length >= 3, progressCurrent: Math.min(bossDefeats.length, 3), progressTarget: 3 },
    "50-stars": { unlocked: totalStars >= 50, progressCurrent: Math.min(totalStars, 50), progressTarget: 50 },
    "perfect-score": { unlocked: hasPerfectScore, progressCurrent: hasPerfectScore ? 1 : 0, progressTarget: 1 },
    "chemistry-legend": {
      unlocked: bossDefeats.length >= worldTemplate.length,
      progressCurrent: bossDefeats.length,
      progressTarget: worldTemplate.length,
    },
  };

  return defs.map((a) => {
    const live = progressById[a.id];
    const base = { id: a.id, icon: a.icon, name: a.name, description: a.description };
    if (!live) return { ...base, unlocked: false };
    return {
      ...base,
      unlocked: live.unlocked,
      progressCurrent: live.progressCurrent,
      progressTarget: live.progressTarget,
      unlockedMeta: live.unlocked ? "Unlocked" : undefined,
    };
  });
}

// --- Leaderboard (Section 27) ---------------------------------------------

const LEADERBOARD_NAMES = [
  "Aarav", "Diya", "Kabir", "Meera", "Rohan", "Ishita", "Vihaan", "Ananya",
  "Aryan", "Priya", "Sai", "Tara", "Dev", "Kavya", "Arjun", "Nisha",
  "Vikram", "Sneha", "Karthik", "Pooja",
];

async function getLeaderboardData(playerId, scope, period, grade, board, subject) {
  grade = normGrade(grade);
  board = normBoard(board);
  subject = normSubject(subject);
  const seedBase = `${scope}-${period}-${grade}-${board}-${subject}`;

  const others = LEADERBOARD_NAMES.map((name) => {
    const roll = seededRatio(`${seedBase}-${name}`);
    return {
      name,
      level: 8 + Math.floor(roll * 20),
      xp: 600 + Math.floor(roll * 9400),
      stars: 15 + Math.floor(roll * 210),
      isYou: false,
    };
  });

  const [playerRows] = await pool.query("SELECT name, level, xp FROM players WHERE id = ?", [playerId]);
  const player = playerRows[0] ?? { name: "Chemist", level: 12, xp: 850 };
  const { totalStars } = await getWorldMapLive(playerId, grade, board, subject);

  const you = {
    name: player.name,
    level: player.level,
    xp: player.level * 700 + player.xp,
    stars: totalStars,
    isYou: true,
  };

  const rows = [...others, you].sort((a, b) => b.xp - a.xp).map((row, i) => ({ ...row, rank: i + 1 }));
  const yourRow = rows.find((r) => r.isYou);
  return { rows, yourRow };
}

module.exports = {
  seededRatio,
  starsForProgress,
  normGrade,
  normBoard,
  normSubject,
  getSubjects,
  getWorldTemplate,
  getDifficulties,
  getLessonsForWorld,
  getQuestionPool,
  getWorldMapLive,
  getCourseDetailLive,
  getDifficultyProgressLive,
  getBattleData,
  getBossBattleData,
  getDashboardDataLive,
  getAchievementsLive,
  getLeaderboardData,
  DEFAULT_GRADE,
  DEFAULT_BOARD,
  DEFAULT_SUBJECT,
};
