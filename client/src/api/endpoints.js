// Scalable API layer (Sections 39–40). Every function here matches one of
// the documented endpoints from the brief:
//
//   GET  /api/boards
//   GET  /api/classes
//   GET  /api/courses?board=&class=
//   GET  /api/lessons?course=
//   GET  /api/levels?lesson=
//   GET  /api/questions?lesson=&difficulty=
//   GET  /api/player
//   GET  /api/player/progress
//   POST /api/player/progress
//   GET  /api/achievements
//   GET  /api/leaderboard
//   GET  /api/quests
//   POST /api/quiz/submit
//
// Every function is async and returns the same shape whether USE_MOCK_API
// is true or false (see config.js) — pages call these, never content.js or
// playerStore.js directly, so flipping the mock flag later is the only
// change a real backend migration needs.
import { USE_MOCK_API } from "./config.js";
import { apiFetch, invalidateCache } from "./client.js";
import { mockDelay } from "./mockDelay.js";
import {
  BOARD_CATEGORIES,
  CLASSES,
  MOCK_PLAYER,
  MOCK_ACHIEVEMENTS,
  MOCK_DAILY_QUESTS,
  getLeaderboardData,
  getBattleData,
  getBossBattleData,
} from "../data/content.js";
import {
  getPlayerState,
  getWorldMapLive,
  getCourseDetailLive,
  getDifficultyProgressLive,
  getDashboardDataLive,
  addRewards,
  recordLessonCompletion,
  completionKey,
  getClaimedQuestIds,
  claimDailyQuest,
} from "../store/playerStore.js";

// GET /api/boards — Section 7's board categories, flattened board list.
export async function getBoards() {
  if (USE_MOCK_API) {
    await mockDelay();
    return BOARD_CATEGORIES;
  }
  return apiFetch("/boards");
}

// GET /api/classes — Section 6's class cards.
export async function getClasses() {
  if (USE_MOCK_API) {
    await mockDelay();
    return CLASSES;
  }
  return apiFetch("/classes");
}

// GET /api/courses?board=&class=&subject= — Section 10's World map for a
// given Subject + Class + Board (Section 8: fully determined by these two
// params per subject, never mixed). subject defaults to "chemistry" when
// omitted, matching server/src/lib/gameLogic.js DEFAULT_SUBJECT.
export async function getCourses({ grade, board, subject }) {
  if (USE_MOCK_API) {
    await mockDelay();
    return getWorldMapLive(grade, board, subject);
  }
  return apiFetch(
    `/courses?board=${encodeURIComponent(board)}&class=${encodeURIComponent(grade)}${subject ? `&subject=${encodeURIComponent(subject)}` : ""}`
  );
}

// GET /api/lessons?course=&subject= — Section 11's Course/Chapter screen for one
// world (courseId here is the world id, e.g. "atom-valley").
export async function getLessons({ grade, board, worldId, subject }) {
  if (USE_MOCK_API) {
    await mockDelay();
    return getCourseDetailLive(grade, board, worldId, subject);
  }
  return apiFetch(
    `/lessons?course=${encodeURIComponent(worldId)}&board=${encodeURIComponent(board)}&class=${encodeURIComponent(grade)}${subject ? `&subject=${encodeURIComponent(subject)}` : ""}`
  );
}

// GET /api/levels?lesson=&subject= — Section 13's difficulty tiers + unlock state
// for one lesson.
export async function getLevels({ grade, board, worldId, lessonId, subject }) {
  if (USE_MOCK_API) {
    await mockDelay();
    return getDifficultyProgressLive(grade, board, worldId, lessonId, subject);
  }
  return apiFetch(
    `/levels?lesson=${encodeURIComponent(lessonId)}&course=${encodeURIComponent(worldId)}&board=${encodeURIComponent(board)}&class=${encodeURIComponent(grade)}${subject ? `&subject=${encodeURIComponent(subject)}` : ""}`
  );
}

// GET /api/questions?lesson=&difficulty=&subject= — Section 15/16's question pool
// for one lesson + difficulty tier, already shaped into a full battle
// (enemy, reward split, timer per question) matching getBattleData's
// return shape.
export async function getQuestions({ grade, board, worldId, lessonId, difficultyId, subject }) {
  if (USE_MOCK_API) {
    await mockDelay();
    return getBattleData(grade, board, worldId, lessonId, difficultyId, subject);
  }
  return apiFetch(
    `/questions?lesson=${encodeURIComponent(lessonId)}&difficulty=${encodeURIComponent(difficultyId)}&course=${encodeURIComponent(worldId)}&board=${encodeURIComponent(board)}&class=${encodeURIComponent(grade)}${subject ? `&subject=${encodeURIComponent(subject)}` : ""}`
  );
}

// GET /api/questions (boss variant) — same endpoint family, used by the
// Boss Battle screen (Section 21) instead of a regular lesson battle.
export async function getBossQuestions({ grade, board, worldId, subject }) {
  if (USE_MOCK_API) {
    await mockDelay();
    return getBossBattleData(grade, board, worldId, subject);
  }
  return apiFetch(
    `/questions?boss=1&course=${encodeURIComponent(worldId)}&board=${encodeURIComponent(board)}&class=${encodeURIComponent(grade)}${subject ? `&subject=${encodeURIComponent(subject)}` : ""}`
  );
}

// GET /api/player — Section 23/24's player HUD + profile basics.
export async function getPlayer({ grade, board } = {}) {
  if (USE_MOCK_API) {
    await mockDelay();
    const stored = getPlayerState();
    return {
      ...MOCK_PLAYER,
      coins: stored.coins,
      xp: stored.xp,
      grade: grade ?? "9",
      board: board ?? "CBSE",
    };
  }
  return apiFetch("/player");
}

// GET /api/player/progress — Section 28's per-Class+Board progress list,
// plus the Dashboard's full derived data (worlds, badges, quests, recent
// achievements) since that's all "player progress" from the client's
// point of view.
export async function getPlayerProgress({ grade, board, subject }) {
  if (USE_MOCK_API) {
    await mockDelay();
    return getDashboardDataLive(grade, board, subject);
  }
  return apiFetch(
    `/player/progress?board=${encodeURIComponent(board)}&class=${encodeURIComponent(grade)}${subject ? `&subject=${encodeURIComponent(subject)}` : ""}`
  );
}

// POST /api/player/progress — records a completed lesson/battle result
// (Section 17–19: XP, coins, stars) and, for a boss clear, the boss-defeat
// flag (Section 21). Invalidates the player-progress cache so the next
// GET reflects it immediately once a real backend is wired in.
export async function postPlayerProgress({
  grade,
  board,
  subject,
  worldId,
  lessonId,
  difficultyId,
  xp,
  coins,
  accuracy,
  stars,
}) {
  if (USE_MOCK_API) {
    await mockDelay();
    addRewards(xp, coins);
    recordLessonCompletion(completionKey(grade, board, worldId, lessonId, difficultyId), {
      accuracy,
      stars,
      xp,
      coins,
      completedAt: Date.now(),
    });
    return { ok: true };
  }
  const result = await apiFetch("/player/progress", {
    method: "POST",
    body: { grade, board, subject, worldId, lessonId, difficultyId, xp, coins, accuracy, stars },
  });
  invalidateCache("/player");
  return result;
}

// GET /api/achievements — Section 25's achievement grid (locked/unlocked).
export async function getAchievements() {
  if (USE_MOCK_API) {
    await mockDelay();
    return MOCK_ACHIEVEMENTS;
  }
  return apiFetch("/achievements");
}

// GET /api/leaderboard — Section 27's ranked list, filterable by scope
// (global/class/board) and period (weekly/monthly/all-time).
export async function getLeaderboard({ scope, period, grade, board, subject }) {
  if (USE_MOCK_API) {
    await mockDelay();
    return getLeaderboardData(scope, period, grade, board, true);
  }
  return apiFetch(
    `/leaderboard?scope=${encodeURIComponent(scope)}&period=${encodeURIComponent(period)}&board=${encodeURIComponent(board)}&class=${encodeURIComponent(grade)}${subject ? `&subject=${encodeURIComponent(subject)}` : ""}`
  );
}

// GET /api/quests — Section 26's daily quest list with today's claimed
// state folded in.
export async function getQuests() {
  if (USE_MOCK_API) {
    await mockDelay();
    const claimed = getClaimedQuestIds();
    return MOCK_DAILY_QUESTS.map((q) => ({ ...q, claimed: claimed.includes(q.id) }));
  }
  return apiFetch("/quests");
}

// POST /api/quiz/submit — generic per-question submission endpoint from
// Section 40. Battle/Boss screens currently batch a whole level's result
// through postPlayerProgress above; this is the finer-grained per-question
// variant for a future analytics/adaptive-difficulty use case.
export async function postQuizSubmit({ questionId, selectedAnswer, correct, timeTakenMs }) {
  if (USE_MOCK_API) {
    await mockDelay();
    return { ok: true, questionId, correct };
  }
  return apiFetch("/quiz/submit", {
    method: "POST",
    body: { questionId, selectedAnswer, correct, timeTakenMs },
  });
}

// Daily quest claim — not in Section 40's list verbatim, but the natural
// mutation counterpart to GET /api/quests, so it lives in the same file
// under the same mock/real switch.
export async function postClaimQuest({ questId, xp, coins }) {
  if (USE_MOCK_API) {
    await mockDelay();
    const ok = claimDailyQuest(questId, xp, coins);
    return { ok };
  }
  const result = await apiFetch(`/quests/${encodeURIComponent(questId)}/claim`, { method: "POST" });
  invalidateCache("/quests");
  return result;
}

// ============================================================================
// Quiz management
// ============================================================================

export async function getQuizzes(filters = {}) {
  if (USE_MOCK_API) {
    await mockDelay();
    return [
      { id: "quiz-1", title: "Atomic Structure Basics", subject: "CHEM", worldId: "atom-valley", questionCount: 10, difficulty: "easy", createdAt: Date.now() - 86400000 },
      { id: "quiz-2", title: "Chemical Bonding", subject: "CHEM", worldId: "bonding-cave", questionCount: 15, difficulty: "medium", createdAt: Date.now() - 172800000 },
      { id: "quiz-3", title: "Algebra Fundamentals", subject: "MATH", worldId: "algebra-atrium", questionCount: 10, difficulty: "easy", createdAt: Date.now() - 259200000 },
    ].filter((q) => {
      if (filters.subject && q.subject !== filters.subject) return false;
      if (filters.worldId && q.worldId !== filters.worldId) return false;
      if (filters.difficulty && q.difficulty !== filters.difficulty) return false;
      return true;
    });
  }
  const params = new URLSearchParams();
  if (filters.subject) params.set("subject", filters.subject);
  if (filters.worldId) params.set("worldId", filters.worldId);
  if (filters.difficulty) params.set("difficulty", filters.difficulty);
  const qs = params.toString();
  return apiFetch(`/quizzes${qs ? `?${qs}` : ""}`);
}

export async function getQuizById(quizId) {
  if (USE_MOCK_API) {
    await mockDelay();
    return {
      id: quizId,
      title: "Atomic Structure Basics",
      subject: "CHEM",
      worldId: "atom-valley",
      timeLimit: 1800,
      questions: [
        { id: "q1", text: "What is the atomic number of Carbon?", type: "mcq", options: ["4", "6", "8", "12"], correctAnswer: "6", explanation: "Carbon has 6 protons, so its atomic number is 6." },
        { id: "q2", text: "True or False: Neutrons have a negative charge.", type: "true_false", options: ["True", "False"], correctAnswer: "False", explanation: "Neutrons are neutral — they carry no electric charge." },
        { id: "q3", text: "The mass number is the sum of ___ and ___.", type: "fill_blank", correctAnswer: "protons, neutrons", explanation: "Mass number = protons + neutrons." },
      ],
    };
  }
  return apiFetch(`/quizzes/${encodeURIComponent(quizId)}`);
}

export async function createQuiz(quizData) {
  if (USE_MOCK_API) {
    await mockDelay();
    return { id: `quiz-${Date.now()}`, ...quizData, createdAt: Date.now() };
  }
  return apiFetch("/quizzes", { method: "POST", body: quizData });
}

export async function startQuizAttempt(quizId) {
  if (USE_MOCK_API) {
    await mockDelay();
    return { attemptId: `att-${Date.now()}`, quizId, startedAt: Date.now(), answers: {} };
  }
  return apiFetch(`/quizzes/${encodeURIComponent(quizId)}/attempts`, { method: "POST" });
}

export async function submitQuizAnswer(attemptId, answer) {
  if (USE_MOCK_API) {
    await mockDelay();
    return { ok: true, attemptId, ...answer };
  }
  return apiFetch(`/attempts/${encodeURIComponent(attemptId)}/answers`, {
    method: "POST",
    body: answer,
  });
}

export async function completeQuizAttempt(attemptId) {
  if (USE_MOCK_API) {
    await mockDelay();
    return {
      ok: true,
      attemptId,
      score: 80,
      accuracy: 80,
      totalQuestions: 10,
      correctCount: 8,
      incorrectCount: 1,
      skippedCount: 1,
      timeTaken: 920,
      xpEarned: 80,
      coinsEarned: 40,
    };
  }
  const result = await apiFetch(`/attempts/${encodeURIComponent(attemptId)}/complete`, {
    method: "POST",
  });
  invalidateCache("/player");
  return result;
}

export async function getQuizAttempts(quizId) {
  if (USE_MOCK_API) {
    await mockDelay();
    return [
      { attemptId: "att-1", score: 70, accuracy: 70, startedAt: Date.now() - 86400000, timeTaken: 1050 },
      { attemptId: "att-2", score: 85, accuracy: 85, startedAt: Date.now() - 43200000, timeTaken: 900 },
    ];
  }
  return apiFetch(`/quizzes/${encodeURIComponent(quizId)}/attempts`);
}

// ============================================================================
// Practice
// ============================================================================

export async function getPracticeQuestions(filters = {}) {
  if (USE_MOCK_API) {
    await mockDelay();
    const { QUESTION_BANK } = await import("../data/content.js");
    const worldId = filters.worldId ?? "atom-valley";
    const difficulty = filters.difficulty ?? "easy";
    const pool = QUESTION_BANK[worldId]?.[difficulty] ?? QUESTION_BANK["atom-valley"].easy;
    const count = filters.count ?? 5;
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, count);
    return shuffled.map((q, i) => ({
      id: `pq-${Date.now()}-${i}`,
      text: q.q,
      type: q.type ?? "mcq",
      options: q.options,
      correctAnswer: q.answer,
      explanation: q.explanation,
      pairs: q.pairs,
      image: q.image,
      hint: q.explanation?.slice(0, 60) + "...",
    }));
  }
  const params = new URLSearchParams();
  if (filters.worldId) params.set("worldId", filters.worldId);
  if (filters.difficulty) params.set("difficulty", filters.difficulty);
  if (filters.count) params.set("count", String(filters.count));
  const qs = params.toString();
  return apiFetch(`/practice/questions${qs ? `?${qs}` : ""}`);
}

export async function submitPracticeAnswer(answer) {
  if (USE_MOCK_API) {
    await mockDelay();
    return { ok: true, correct: answer.correct, explanation: answer.explanation ?? "" };
  }
  return apiFetch("/practice/answers", { method: "POST", body: answer });
}

// ============================================================================
// Mastery
// ============================================================================

export async function getMastery(playerId, subjectCode) {
  if (USE_MOCK_API) {
    await mockDelay();
    return {
      playerId: playerId ?? "player-1",
      subjectCode: subjectCode ?? "CHEM",
      overallMastery: 68,
      concepts: [
        { id: "c1", name: "Atomic Structure", mastery: 85, questionsAttempted: 42, correctCount: 36 },
        { id: "c2", name: "Chemical Bonding", mastery: 72, questionsAttempted: 35, correctCount: 25 },
        { id: "c3", name: "Chemical Reactions", mastery: 55, questionsAttempted: 28, correctCount: 15 },
        { id: "c4", name: "Acids & Bases", mastery: 40, questionsAttempted: 20, correctCount: 8 },
        { id: "c5", name: "Molecules & Compounds", mastery: 90, questionsAttempted: 50, correctCount: 45 },
      ],
      lastUpdated: Date.now(),
    };
  }
  return apiFetch(`/mastery?playerId=${encodeURIComponent(playerId ?? "player-1")}&subject=${encodeURIComponent(subjectCode ?? "CHEM")}`);
}

export async function updateMastery(data) {
  if (USE_MOCK_API) {
    await mockDelay();
    return { ok: true, ...data };
  }
  return apiFetch("/mastery", { method: "POST", body: data });
}

// ============================================================================
// Flashcards
// ============================================================================

const MOCK_FLASHCARD_SETS = [
  {
    id: "fs-1",
    title: "Atomic Structure Terms",
    subject: "CHEM",
    description: "Key terms for atomic structure",
    cardCount: 12,
    createdAt: Date.now() - 604800000,
    cards: [
      { id: "fc-1", front: "Proton", back: "A positively charged subatomic particle found in the nucleus.", known: false, reviewCount: 0 },
      { id: "fc-2", front: "Neutron", back: "A neutral subatomic particle found in the nucleus with no electric charge.", known: true, reviewCount: 3 },
      { id: "fc-3", front: "Electron", back: "A negatively charged subatomic particle that orbits the nucleus in shells.", known: false, reviewCount: 1 },
      { id: "fc-4", front: "Atomic Number", back: "The number of protons in an atom's nucleus, defining the element.", known: true, reviewCount: 2 },
      { id: "fc-5", front: "Mass Number", back: "The total number of protons and neutrons in an atom's nucleus.", known: false, reviewCount: 0 },
      { id: "fc-6", front: "Isotope", back: "Atoms of the same element with different numbers of neutrons.", known: true, reviewCount: 4 },
    ],
  },
  {
    id: "fs-2",
    title: "Chemical Bonding",
    subject: "CHEM",
    description: "Bond types and their properties",
    cardCount: 8,
    createdAt: Date.now() - 432000000,
    cards: [
      { id: "fc-7", front: "Ionic Bond", back: "A bond formed by the transfer of electrons from one atom to another.", known: false, reviewCount: 0 },
      { id: "fc-8", front: "Covalent Bond", back: "A bond formed by the sharing of electron pairs between atoms.", known: false, reviewCount: 1 },
      { id: "fc-9", front: "Metallic Bond", back: "A bond involving a 'sea of delocalized electrons' shared among metal atoms.", known: true, reviewCount: 2 },
    ],
  },
];

export async function getFlashcardSets(filters = {}) {
  if (USE_MOCK_API) {
    await mockDelay();
    return MOCK_FLASHCARD_SETS.filter((s) => {
      if (filters.subject && s.subject !== filters.subject) return false;
      return true;
    });
  }
  const params = new URLSearchParams();
  if (filters.subject) params.set("subject", filters.subject);
  const qs = params.toString();
  return apiFetch(`/flashcards/sets${qs ? `?${qs}` : ""}`);
}

export async function createFlashcardSet(data) {
  if (USE_MOCK_API) {
    await mockDelay();
    const newSet = {
      id: `fs-${Date.now()}`,
      ...data,
      cardCount: 0,
      cards: [],
      createdAt: Date.now(),
    };
    MOCK_FLASHCARD_SETS.push(newSet);
    return newSet;
  }
  return apiFetch("/flashcards/sets", { method: "POST", body: data });
}

export async function getFlashcards(setId) {
  if (USE_MOCK_API) {
    await mockDelay();
    const set = MOCK_FLASHCARD_SETS.find((s) => s.id === setId);
    return set?.cards ?? [];
  }
  return apiFetch(`/flashcards/sets/${encodeURIComponent(setId)}/cards`);
}

export async function createFlashcard(data) {
  if (USE_MOCK_API) {
    await mockDelay();
    return {
      id: `fc-${Date.now()}`,
      ...data,
      known: false,
      reviewCount: 0,
      createdAt: Date.now(),
    };
  }
  return apiFetch(`/flashcards/sets/${encodeURIComponent(data.setId)}/cards`, {
    method: "POST",
    body: data,
  });
}

export async function updateFlashcardReview(id, data) {
  if (USE_MOCK_API) {
    await mockDelay();
    return { ok: true, id, ...data };
  }
  return apiFetch(`/flashcards/${encodeURIComponent(id)}/review`, {
    method: "PUT",
    body: data,
  });
}

// ============================================================================
// Notifications
// ============================================================================

export async function getNotifications() {
  if (USE_MOCK_API) {
    await mockDelay();
    return [
      { id: "n1", title: "New Achievement Unlocked!", message: "You earned the Boss Slayer badge.", read: false, createdAt: Date.now() - 3600000 },
      { id: "n2", title: "Daily Streak Bonus", message: "7-day streak! +50 bonus XP.", read: true, createdAt: Date.now() - 7200000 },
      { id: "n3", title: "Weekly Challenge Complete", message: "Answer 50 questions correctly.", read: false, createdAt: Date.now() - 86400000 },
    ];
  }
  return apiFetch("/notifications");
}

export async function markNotificationRead(id) {
  if (USE_MOCK_API) {
    await mockDelay();
    return { ok: true, id };
  }
  return apiFetch(`/notifications/${encodeURIComponent(id)}/read`, { method: "PUT" });
}

// ============================================================================
// Assignments
// ============================================================================

export async function getAssignments(filters = {}) {
  if (USE_MOCK_API) {
    await mockDelay();
    return [
      { id: "a1", title: "Chapter 3 Quiz: Chemical Bonding", subject: "CHEM", dueDate: Date.now() + 172800000, status: "pending", score: null },
      { id: "a2", title: "Atomic Structure Practice Set", subject: "CHEM", dueDate: Date.now() + 86400000, status: "completed", score: 88 },
      { id: "a3", title: "Algebra Homework: Linear Equations", subject: "MATH", dueDate: Date.now() + 259200000, status: "pending", score: null },
    ].filter((a) => {
      if (filters.subject && a.subject !== filters.subject) return false;
      if (filters.status && a.status !== filters.status) return false;
      return true;
    });
  }
  const params = new URLSearchParams();
  if (filters.subject) params.set("subject", filters.subject);
  if (filters.status) params.set("status", filters.status);
  const qs = params.toString();
  return apiFetch(`/assignments${qs ? `?${qs}` : ""}`);
}

export async function getAssignmentById(id) {
  if (USE_MOCK_API) {
    await mockDelay();
    return {
      id,
      title: "Chapter 3 Quiz: Chemical Bonding",
      subject: "CHEM",
      description: "Complete this quiz on chemical bonding concepts.",
      dueDate: Date.now() + 172800000,
      questionCount: 10,
      timeLimit: 1800,
      status: "pending",
    };
  }
  return apiFetch(`/assignments/${encodeURIComponent(id)}`);
}

// ============================================================================
// Challenges
// ============================================================================

export async function getChallenges() {
  if (USE_MOCK_API) {
    await mockDelay();
    return [
      { id: "ch1", title: "Answer 20 questions correctly", type: "correct_answers", progress: 14, target: 20, xpReward: 150, coinReward: 75, expiresAt: Date.now() + 86400000, completed: false },
      { id: "ch2", title: "Complete 3 quizzes", type: "complete_quizzes", progress: 3, target: 3, xpReward: 200, coinReward: 100, expiresAt: Date.now() + 86400000, completed: true, claimed: false },
      { id: "ch3", title: "Maintain a 5 day streak", type: "maintain_streak", progress: 5, target: 5, xpReward: 300, coinReward: 150, expiresAt: Date.now() + 172800000, completed: true, claimed: true },
      { id: "ch4", title: "Score 90%+ on 2 quizzes", type: "high_scores", progress: 1, target: 2, xpReward: 250, coinReward: 125, expiresAt: Date.now() + 259200000, completed: false },
      { id: "ch5", title: "Practice 15 questions", type: "practice_questions", progress: 8, target: 15, xpReward: 100, coinReward: 50, expiresAt: Date.now() + 43200000, completed: false },
    ];
  }
  return apiFetch("/challenges");
}

export async function claimChallengeReward(id) {
  if (USE_MOCK_API) {
    await mockDelay();
    return { ok: true, id, claimed: true };
  }
  const result = await apiFetch(`/challenges/${encodeURIComponent(id)}/claim`, { method: "POST" });
  invalidateCache("/challenges");
  return result;
}

// ============================================================================
// Progress detailed
// ============================================================================

export async function getDetailedProgress(filters = {}) {
  if (USE_MOCK_API) {
    await mockDelay();
    const { getWorldMapLive: gml } = await import("../store/playerStore.js");
    const grade = filters.grade ?? "9";
    const board = filters.board ?? "CBSE";
    const subject = filters.subject ?? "CHEM";
    const worldMap = gml(grade, board, subject);
    return {
      overall: {
        totalXP: 2450,
        totalStars: 18,
        levelsCompleted: 12,
        accuracy: 78,
        streak: 7,
        timeSpent: 14400,
      },
      subjects: [
        { code: "CHEM", name: "Chemistry", mastery: 72, progress: worldMap.overallProgress, stars: worldMap.totalStars, levelsCompleted: 12 },
        { code: "MATH", name: "Mathematics", mastery: 65, progress: 45, stars: 6, levelsCompleted: 4 },
        { code: "PHY", name: "Physics", mastery: 58, progress: 30, stars: 4, levelsCompleted: 3 },
      ],
      recentActivity: [
        { id: "ra1", type: "level_complete", title: "Completed Isotopes - Easy", xp: 20, coins: 10, timestamp: Date.now() - 3600000 },
        { id: "ra2", type: "quiz_complete", title: "Scored 85% on Atomic Structure Quiz", xp: 85, coins: 42, timestamp: Date.now() - 7200000 },
        { id: "ra3", type: "boss_defeated", title: "Defeated Proton Guardian", xp: 100, coins: 50, timestamp: Date.now() - 86400000 },
      ],
      weakConcepts: [
        { name: "Chemical Reactions", accuracy: 45, recommendation: "Review Types of Reactions and practice more questions." },
        { name: "Acids & Bases", accuracy: 52, recommendation: "Focus on the pH Scale and Neutralization concepts." },
      ],
    };
  }
  const params = new URLSearchParams();
  if (filters.grade) params.set("grade", filters.grade);
  if (filters.board) params.set("board", filters.board);
  if (filters.subject) params.set("subject", filters.subject);
  const qs = params.toString();
  return apiFetch(`/progress/detailed${qs ? `?${qs}` : ""}`);
}

export async function getSubjectMastery(subjectCode) {
  if (USE_MOCK_API) {
    await mockDelay();
    return getMastery("player-1", subjectCode);
  }
  return apiFetch(`/progress/mastery/${encodeURIComponent(subjectCode)}`);
}

// ============================================================================
// AI
// ============================================================================

export async function generateAIQuiz(data) {
  if (USE_MOCK_API) {
    await mockDelay();
    return {
      id: `ai-quiz-${Date.now()}`,
      title: `AI Quiz: ${data.topic ?? "General"}`,
      questions: [
        { id: "aiq-1", text: "What is the atomic number of Oxygen?", type: "mcq", options: ["6", "7", "8", "9"], correctAnswer: "8", explanation: "Oxygen has 8 protons." },
        { id: "aiq-2", text: "Water has the formula ___", type: "fill_blank", correctAnswer: "H2O", explanation: "Water is two hydrogen atoms bonded to one oxygen atom." },
        { id: "aiq-3", text: "True or False: Metals are good conductors of electricity.", type: "true_false", options: ["True", "False"], correctAnswer: "True", explanation: "Metals have free electrons that allow them to conduct electricity." },
      ],
    };
  }
  return apiFetch("/ai/quiz", { method: "POST", body: data });
}

export async function getAIHint(questionId) {
  if (USE_MOCK_API) {
    await mockDelay();
    return {
      questionId,
      hint: "Think about the key properties of the concept and eliminate options that don't match the definition.",
    };
  }
  return apiFetch(`/ai/hint/${encodeURIComponent(questionId)}`);
}

export async function getAIExplanation(questionId) {
  if (USE_MOCK_API) {
    await mockDelay();
    return {
      questionId,
      explanation: "This concept involves understanding the fundamental structure and properties. Review the key definition and practice similar questions to build confidence.",
    };
  }
  return apiFetch(`/ai/explanation/${encodeURIComponent(questionId)}`);
}
