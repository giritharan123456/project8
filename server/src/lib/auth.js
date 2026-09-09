const jwt = require("jsonwebtoken");

const ROLES = Object.freeze({
  ADMIN: "ADMIN",
  TEACHER: "TEACHER",
  STUDENT: "STUDENT",
});

const ALL_ROLES = Object.values(ROLES);

// Roles a public caller is ever allowed to request for themselves via
// POST /api/auth/signup. ADMIN is deliberately excluded - the only ways
// to get an ADMIN account are src/scripts/createAdmin.js (run by whoever
// controls the server) or an existing ADMIN promoting someone via PATCH
// /api/admin/users/:id/role. Keeping this as an explicit allowlist (rather
// than "ALL_ROLES minus ADMIN") means adding a future privileged role to
// ROLES can't silently become self-registerable.
const SIGNUP_ROLES = Object.freeze([ROLES.STUDENT, ROLES.TEACHER]);

const JWT_SECRET = process.env.JWT_SECRET;
const AUTH_TTL_DAYS = Number(process.env.AUTH_TTL_DAYS || 7);

// Placeholder values that must never be used as a real secret - anyone
// who reads .env.example (i.e. anyone) knows these, so a deployment still
// running with one of these would sign auth tokens - including the
// `schoolId` claim routes/teacher.js trusts for the Section 4 school
// isolation - with a secret an attacker can just guess and forge.
const KNOWN_PLACEHOLDER_SECRETS = new Set([
  "change_this_to_a_long_random_string",
  "your_jwt_secret",
  "secret",
  "changeme",
]);

const MIN_SECRET_LENGTH = 32;

if (!JWT_SECRET) {
  // Fail loudly at boot rather than silently signing tokens with
  // `undefined` (which would make every token forgeable/guessable).
  throw new Error(
    "JWT_SECRET is not set. Copy server/.env.example to server/.env and set a real value."
  );
}

if (KNOWN_PLACEHOLDER_SECRETS.has(JWT_SECRET.trim().toLowerCase())) {
  throw new Error(
    "JWT_SECRET is still set to the placeholder value from .env.example. " +
      "Anyone can read that file and forge a valid auth token (including a fake " +
      "TEACHER/ADMIN role and schoolId) with it. Set a real, unique secret before " +
      "starting the server - e.g. `node -e \"console.log(require('crypto').randomBytes(48).toString('hex'))\"`."
  );
}

if (JWT_SECRET.length < MIN_SECRET_LENGTH) {
  // Not a placeholder, but short/guessable secrets are brute-forceable
  // offline once an attacker has even one valid token to test against.
  throw new Error(
    `JWT_SECRET is too short (${JWT_SECRET.length} chars). Use at least ${MIN_SECRET_LENGTH} ` +
      "random characters so auth tokens can't be brute-forced."
  );
}

// Signs the auth cookie payload for a logged-in account. Keep this payload
// small and non-sensitive - it round-trips to the browser on every request.
// `schoolId` (Section 4) is what routes/teacher.js filters every query
// by, so it has to live in the token, not just be looked up per-request -
// req.user is the single source of truth requireRole/requireSchool trust.
function signAuthToken(user) {
  return jwt.sign(
    { sub: user.id, role: user.role, email: user.email, name: user.name, schoolId: user.schoolId ?? null },
    JWT_SECRET,
    { expiresIn: `${AUTH_TTL_DAYS}d` }
  );
}

// Returns the decoded payload, or null if the token is missing/expired/
// tampered with. Callers should treat null the same as "not signed in".
function verifyAuthToken(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

module.exports = { ROLES, ALL_ROLES, SIGNUP_ROLES, AUTH_TTL_DAYS, signAuthToken, verifyAuthToken };
