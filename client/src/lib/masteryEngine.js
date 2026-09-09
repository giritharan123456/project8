// Mastery calculation engine â€” tracks concept/subject mastery from quiz
// performance data. All functions are pure (no side-effects) so they can
// be used in components, stores, or test harnesses alike.

export const MASTERY_LEVELS = {
  NOT_STARTED: "not_started",
  LEARNING: "learning",
  PRACTICING: "practicing",
  STRONG: "strong",
  MASTERED: "mastered",
};

const MASTERY_ORDER = [
  MASTERY_LEVELS.NOT_STARTED,
  MASTERY_LEVELS.LEARNING,
  MASTERY_LEVELS.PRACTICING,
  MASTERY_LEVELS.STRONG,
  MASTERY_LEVELS.MASTERED,
];

// Thresholds: minimum accuracy (%) AND minimum attempts to reach each level.
const THRESHOLDS = {
  [MASTERY_LEVELS.NOT_STARTED]: { accuracy: 0, attempts: 0 },
  [MASTERY_LEVELS.LEARNING]: { accuracy: 0, attempts: 1 },
  [MASTERY_LEVELS.PRACTICING]: { accuracy: 50, attempts: 3 },
  [MASTERY_LEVELS.STRONG]: { accuracy: 75, attempts: 5 },
  [MASTERY_LEVELS.MASTERED]: { accuracy: 90, attempts: 8 },
};

// â”€â”€ Core calculations â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export function calculateMasteryLevel(accuracy, totalAttempts) {
  if (totalAttempts <= 0) return MASTERY_LEVELS.NOT_STARTED;

  let level = MASTERY_LEVELS.LEARNING;
  for (const key of MASTERY_ORDER) {
    const t = THRESHOLDS[key];
    if (accuracy >= t.accuracy && totalAttempts >= t.attempts) {
      level = key;
    }
  }
  return level;
}

export function calculateConceptMastery(answers) {
  if (!answers || answers.length === 0) {
    return {
      level: MASTERY_LEVELS.NOT_STARTED,
      accuracy: 0,
      totalAttempts: 0,
      correctCount: 0,
    };
  }

  const totalAttempts = answers.length;
  const correctCount = answers.filter((a) => a.correct).length;
  const accuracy = Math.round((correctCount / totalAttempts) * 100);

  return {
    level: calculateMasteryLevel(accuracy, totalAttempts),
    accuracy,
    totalAttempts,
    correctCount,
  };
}

export function calculateSubjectMastery(conceptMasteries) {
  if (!conceptMasteries || conceptMasteries.length === 0) {
    return {
      level: MASTERY_LEVELS.NOT_STARTED,
      accuracy: 0,
      totalAttempts: 0,
      correctCount: 0,
      conceptCount: 0,
      masteredCount: 0,
    };
  }

  const totalAttempts = conceptMasteries.reduce((s, c) => s + c.totalAttempts, 0);
  const correctCount = conceptMasteries.reduce((s, c) => s + c.correctCount, 0);
  const accuracy = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 0;
  const masteredCount = conceptMasteries.filter(
    (c) => c.level === MASTERY_LEVELS.MASTERED
  ).length;

  return {
    level: calculateMasteryLevel(accuracy, totalAttempts),
    accuracy,
    totalAttempts,
    correctCount,
    conceptCount: conceptMasteries.length,
    masteredCount,
  };
}

// â”€â”€ UI helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const MASTERY_COLORS = {
  [MASTERY_LEVELS.NOT_STARTED]: "#3A3E68",
  [MASTERY_LEVELS.LEARNING]: "#F87171",
  [MASTERY_LEVELS.PRACTICING]: "#FCD34D",
  [MASTERY_LEVELS.STRONG]: "#38D9F4",
  [MASTERY_LEVELS.MASTERED]: "#4ADE80",
};

const MASTERY_LABELS = {
  [MASTERY_LEVELS.NOT_STARTED]: "Not Started",
  [MASTERY_LEVELS.LEARNING]: "Learning",
  [MASTERY_LEVELS.PRACTICING]: "Practicing",
  [MASTERY_LEVELS.STRONG]: "Strong",
  [MASTERY_LEVELS.MASTERED]: "Mastered",
};

const MASTERY_ICONS = {
  [MASTERY_LEVELS.NOT_STARTED]: "Circle",
  [MASTERY_LEVELS.LEARNING]: "BookOpen",
  [MASTERY_LEVELS.PRACTICING]: "Target",
  [MASTERY_LEVELS.STRONG]: "Zap",
  [MASTERY_LEVELS.MASTERED]: "Crown",
};

export function getMasteryColor(level) {
  return MASTERY_COLORS[level] ?? MASTERY_COLORS[MASTERY_LEVELS.NOT_STARTED];
}

export function getMasteryLabel(level) {
  return MASTERY_LABELS[level] ?? "Unknown";
}

export function getMasteryIcon(level) {
  return MASTERY_ICONS[level] ?? "Circle";
}

// â”€â”€ Progression helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export function isNextConceptUnlocked(currentMastery, requiredLevel) {
  const requiredIdx = MASTERY_ORDER.indexOf(requiredLevel);
  const currentIdx = MASTERY_ORDER.indexOf(currentMastery);
  if (requiredIdx === -1) return true;
  return currentIdx >= requiredIdx;
}

export function getMasteryProgress(correctCount, totalAttempts, targetAccuracy = 80) {
  if (totalAttempts <= 0) return 0;
  const currentAccuracy = (correctCount / totalAttempts) * 100;
  return Math.min(100, Math.round((currentAccuracy / targetAccuracy) * 100));
}

// Returns the next mastery level a student should aim for, or null if
// already mastered.
export function getNextMasteryTarget(currentLevel) {
  const idx = MASTERY_ORDER.indexOf(currentLevel);
  if (idx === -1 || idx >= MASTERY_ORDER.length - 1) return null;
  return MASTERY_ORDER[idx + 1];
}

// Returns a number 0-100 representing overall mastery across all concepts.
export function getOverallMasteryPercentage(conceptMasteries) {
  if (!conceptMasteries || conceptMasteries.length === 0) return 0;
  const weights = {
    [MASTERY_LEVELS.NOT_STARTED]: 0,
    [MASTERY_LEVELS.LEARNING]: 20,
    [MASTERY_LEVELS.PRACTICING]: 50,
    [MASTERY_LEVELS.STRONG]: 80,
    [MASTERY_LEVELS.MASTERED]: 100,
  };
  const total = conceptMasteries.reduce(
    (s, c) => s + (weights[c.level] ?? 0),
    0
  );
  return Math.round(total / conceptMasteries.length);
}
