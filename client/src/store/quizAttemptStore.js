// client/src/store/quizAttemptStore.js
//
// Per-attempt persistence for formal tests. Every attempt gets its own unique
// id and its own record — retaking a test appends a NEW record instead of
// overwriting the old one, so attempt history stays intact (multi-attempt
// safe). Also stores an in-progress "pending" quiz so a mid-test refresh can
// resume where the student left off instead of losing everything.
const COMPLETED_KEY = "chemquest:quiz-attempts:v1";
const PENDING_KEY = "chemquest:quiz-pending:v1";

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full / private mode — attempts just won't persist
  }
}

// ---------- Completed attempts ----------

export function getCompletedAttempts(quizId) {
  const all = readJSON(COMPLETED_KEY, []);
  return quizId ? all.filter((a) => a.quizId === quizId) : all;
}

export function getCompletedAttempt(attemptId) {
  return readJSON(COMPLETED_KEY, []).find((a) => a.attemptId === attemptId) ?? null;
}

// Appends (never overwrites) a completed attempt record. `payload` should
// carry: attemptId, quizId, testId, title, subject, difficultyLabel,
// startedAt, submittedAt, timeTaken, answers, marked, visited, and the
// submitted results object.
export function recordCompletedAttempt(payload) {
  const all = readJSON(COMPLETED_KEY, []);
  const existing = all.findIndex((a) => a.attemptId === payload.attemptId);
  if (existing >= 0) {
    all[existing] = { ...all[existing], ...payload };
  } else {
    all.push({ ...payload, submittedAt: Date.now() });
  }
  writeJSON(COMPLETED_KEY, all);
  return all;
}

// ---------- In-progress (pending) attempt, for resume ----------

export function getPendingAttempt(attemptId) {
  const pending = readJSON(PENDING_KEY, null);
  return pending?.attemptId === attemptId ? pending : null;
}

export function savePendingAttempt(payload) {
  writeJSON(PENDING_KEY, { ...payload, savedAt: Date.now() });
}

// Finds the pending record for a given quiz (there is only ever one active
// per quiz), even when the caller doesn't know the attempt id yet.
export function getAnyPendingAttempt(quizId) {
  const pending = readJSON(PENDING_KEY, null);
  return pending?.quizId === quizId ? pending : null;
}

export function clearPendingAttempt(attemptId) {
  const pending = readJSON(PENDING_KEY, null);
  if (pending?.attemptId === attemptId) writeJSON(PENDING_KEY, null);
}

// ---------- Attempt stats for the hub ----------

export function getTestStats(testId) {
  const attempts = getCompletedAttempts();
  const mine = attempts.filter((a) => a.testId === testId);
  if (!mine.length) {
    return { attempts: 0, bestScore: null, averageScore: null, lastScore: null, lastAt: null };
  }
  const scores = mine.map((a) => a.results?.score ?? 0);
  return {
    attempts: mine.length,
    bestScore: Math.max(...scores),
    averageScore: Math.round(scores.reduce((s, x) => s + x, 0) / scores.length),
    lastScore: scores[scores.length - 1],
    lastAt: mine[mine.length - 1].submittedAt,
  };
}