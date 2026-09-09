// Security and validation helpers — pure utility functions for input
// sanitization, ownership checks, client-side rate limiting, and audit
// logging. No backend calls; everything runs in-browser.

// ── Input validation ─────────────────────────────────────────────────

export function validateEmail(email) {
  if (typeof email !== "string") return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

export function validatePassword(password) {
  if (typeof password !== "string") return { valid: false, errors: ["Password must be a string"] };
  const errors = [];
  if (password.length < 8) errors.push("At least 8 characters");
  if (password.length > 128) errors.push("At most 128 characters");
  if (!/[A-Z]/.test(password)) errors.push("At least one uppercase letter");
  if (!/[a-z]/.test(password)) errors.push("At least one lowercase letter");
  if (!/[0-9]/.test(password)) errors.push("At least one number");
  return { valid: errors.length === 0, errors };
}

export function validateName(name) {
  if (typeof name !== "string") return false;
  const trimmed = name.trim();
  if (trimmed.length < 1 || trimmed.length > 60) return false;
  // Allow letters, spaces, hyphens, apostrophes, and common diacritics
  return /^[a-zA-Z\u00C0-\u024F\u0600-\u06FF' -]+$/.test(trimmed);
}

export function sanitizeInput(input) {
  if (typeof input !== "string") return "";
  return input
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .trim();
}

export function validateQuizId(id) {
  if (typeof id !== "string" && typeof id !== "number") return false;
  const str = String(id).trim();
  return /^[a-zA-Z0-9_-]{3,64}$/.test(str);
}

// ── Rate limiting (client-side) ──────────────────────────────────────

export function createRateLimiter(maxRequests, windowMs) {
  const timestamps = [];

  return function isAllowed() {
    const now = Date.now();
    // Prune timestamps outside the window
    while (timestamps.length > 0 && timestamps[0] <= now - windowMs) {
      timestamps.shift();
    }
    if (timestamps.length >= maxRequests) {
      return false;
    }
    timestamps.push(now);
    return true;
  };
}

// ── Ownership / access checks ────────────────────────────────────────

export function canAccessStudentData(currentUser, studentId) {
  if (!currentUser || !studentId) return false;
  // Students can only access their own data
  if (currentUser.role === "student") {
    return currentUser.id === studentId;
  }
  // Teachers/admins can access any student
  if (currentUser.role === "teacher" || currentUser.role === "admin") {
    return true;
  }
  return false;
}

export function canAccessClassData(currentUser, classId) {
  if (!currentUser || !classId) return false;
  if (currentUser.role === "admin") return true;
  if (currentUser.role === "teacher") {
    return Array.isArray(currentUser.classIds) && currentUser.classIds.includes(classId);
  }
  if (currentUser.role === "student") {
    return currentUser.classId === classId;
  }
  return false;
}

export function canModifyResource(currentUser, resource) {
  if (!currentUser || !resource) return false;
  if (currentUser.role === "admin") return true;
  if (currentUser.role === "teacher") {
    return resource.createdBy === currentUser.id;
  }
  return false;
}

// ── Audit logging ────────────────────────────────────────────────────

const AUDIT_KEY = "learnquest:audit:v1";

function getStoredLogs() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(AUDIT_KEY);
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function logAuditAction(action, resourceType, resourceId, details = {}) {
  const entry = {
    id: `audit_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    action,
    resourceType,
    resourceId,
    details,
    timestamp: Date.now(),
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
  };

  const logs = [...getStoredLogs(), entry].slice(-500);
  try {
    window.localStorage.setItem(AUDIT_KEY, JSON.stringify(logs));
  } catch {
    // silently fail
  }
  return entry;
}

export function getAuditLogs(filters = {}) {
  let logs = getStoredLogs();

  if (filters.action) {
    logs = logs.filter((l) => l.action === filters.action);
  }
  if (filters.resourceType) {
    logs = logs.filter((l) => l.resourceType === filters.resourceType);
  }
  if (filters.since) {
    logs = logs.filter((l) => l.timestamp >= filters.since);
  }
  if (filters.limit) {
    logs = logs.slice(-filters.limit);
  }

  return logs;
}
