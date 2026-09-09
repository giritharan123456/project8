// Notification management — localStorage-backed store with event-specific
// factory functions. Compatible with the existing NotificationBell component
// that reads from "learnquest:notifications:v1".

const STORAGE_KEY = "learnquest:notifications:v1";

let idCounter = Date.now();

function nextId() {
  return `notif_${++idCounter}`;
}

function timeAgo(date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// ── Event-specific generators ────────────────────────────────────────

export function generateAssignmentNotification(assignment) {
  return {
    id: nextId(),
    title: "New Assignment",
    body: `"${assignment.title}" is due ${
      assignment.dueDate
        ? new Date(assignment.dueDate).toLocaleDateString()
        : "soon"
    }.`,
    type: "assignment",
    time: timeAgo(new Date()),
    read: false,
    timestamp: Date.now(),
  };
}

export function generateQuizNotification(quiz) {
  return {
    id: nextId(),
    title: "Quiz Available",
    body: `A new quiz "${quiz.title}" is ready for you — ${quiz.questionCount ?? "?"} questions.`,
    type: "quiz",
    time: timeAgo(new Date()),
    read: false,
    timestamp: Date.now(),
  };
}

export function generateAchievementNotification(achievement) {
  return {
    id: nextId(),
    title: "Achievement Unlocked!",
    body: `You earned "${achievement.name}" — ${achievement.description ?? ""}`,
    type: "achievement",
    time: timeAgo(new Date()),
    read: false,
    timestamp: Date.now(),
  };
}

export function generateStreakNotification(streak) {
  return {
    id: nextId(),
    title: `${streak}-Day Streak!`,
    body: `Incredible! You've been learning for ${streak} days straight. Keep it up!`,
    type: "streak",
    time: timeAgo(new Date()),
    read: false,
    timestamp: Date.now(),
  };
}

export function generateMasteryNotification(concept, level) {
  const label =
    level === "mastered"
      ? "mastered"
      : level === "strong"
      ? "reached Strong level in"
      : level === "practicing"
      ? "is now Practicing"
      : "progress updated for";
  return {
    id: nextId(),
    title: "Mastery Update",
    body: `You ${label} "${concept}".`,
    type: "mastery",
    time: timeAgo(new Date()),
    read: false,
    timestamp: Date.now(),
  };
}

export function generateLeaderboardNotification(rank) {
  return {
    id: nextId(),
    title: "Leaderboard Update",
    body: `You've moved to position #${rank} on the leaderboard!`,
    type: "leaderboard",
    time: timeAgo(new Date()),
    read: false,
    timestamp: Date.now(),
  };
}

export function generateDeadlineNotification(assignment) {
  const due = assignment.dueDate ? new Date(assignment.dueDate) : null;
  const timeStr = due ? due.toLocaleDateString() : "soon";
  return {
    id: nextId(),
    title: "Deadline Approaching",
    body: `"${assignment.title}" is due ${timeStr}. Don't forget to submit!`,
    type: "deadline",
    time: timeAgo(new Date()),
    read: false,
    timestamp: Date.now(),
  };
}

export function generateNewContentNotification(content) {
  return {
    id: nextId(),
    title: "New Content Available",
    body: `${content.type ?? "Lesson"} "${content.title}" has been added.`,
    type: "content",
    time: timeAgo(new Date()),
    read: false,
    timestamp: Date.now(),
  };
}

// ── Storage helpers ──────────────────────────────────────────────────

function safeParse(raw) {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getNotifications() {
  if (typeof window === "undefined") return [];
  try {
    return safeParse(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return [];
  }
}

export function addNotification(notification) {
  const list = getNotifications();
  const next = [notification, ...list].slice(0, 100); // cap at 100
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // storage unavailable — notification still returned
  }
  return next;
}

export function markAsRead(notificationId) {
  const list = getNotifications().map((n) =>
    n.id === notificationId ? { ...n, read: true } : n
  );
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // silently fail
  }
  return list;
}

export function markAllAsRead() {
  const list = getNotifications().map((n) => ({ ...n, read: true }));
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // silently fail
  }
  return list;
}

export function getUnreadCount() {
  return getNotifications().filter((n) => !n.read).length;
}

export function clearOldNotifications(daysOld = 30) {
  const cutoff = Date.now() - daysOld * 24 * 60 * 60 * 1000;
  const list = getNotifications().filter(
    (n) => (n.timestamp ?? 0) > cutoff
  );
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // silently fail
  }
  return list;
}
