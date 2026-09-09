const express = require("express");
const pool = require("../config/db");
const { hashPassword, verifyPassword } = require("../lib/password");
const { signAuthToken, ROLES, SIGNUP_ROLES, AUTH_TTL_DAYS } = require("../lib/auth");
const { AUTH_COOKIE_NAME } = require("../middleware/auth");
const { parseSubjects } = require("../lib/registration");
const { findOrCreateSchool } = require("../lib/schools");
const { seedSchoolCohort } = require("../../lib/seedSchool");

const router = express.Router();

function toPublicUser(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    schoolId: row.school_id ?? null,
    grade: row.current_grade ?? null,
    board: row.current_board ?? null,
  };
}

function setAuthCookie(res, token) {
  res.cookie(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: AUTH_TTL_DAYS * 24 * 60 * 60 * 1000,
  });
}

// --- Input validation helpers ---

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME_LEN = 100;
const MAX_EMAIL_LEN = 254;
const MIN_PASSWORD_LEN = 8;
const MAX_PASSWORD_LEN = 128;

function sanitizeString(val) {
  return String(val || "").trim();
}

// Validates { grade } against the real `classes` table rather than just
// checking it looks numeric - stops a caller from persisting a Class /
// Standard that doesn't correspond to any real curriculum row.
async function isKnownGrade(grade) {
  const [rows] = await pool.query("SELECT 1 FROM classes WHERE grade = ? LIMIT 1", [String(grade)]);
  return rows.length > 0;
}

// Same idea for { board } against the `boards` table.
async function isKnownBoard(board) {
  const [rows] = await pool.query("SELECT 1 FROM boards WHERE code = ? LIMIT 1", [board]);
  return rows.length > 0;
}

// POST /api/auth/signup - { name, email, password, confirmPassword, role,
// schoolName, board, grade, subjects } - attaches real credentials (plus
// the profile fields collected on the registration form, Section 3) to
// the current anonymous player rather than creating a second row, so
// nothing already recorded against this session is lost.
//
// SECURITY: `role` is checked against SIGNUP_ROLES (STUDENT | TEACHER
// only) - there is no value a caller can send here to become ADMIN.
// Admin accounts can only be created by an existing admin (PATCH
// /api/admin/users/:id/role) or the seed script (src/scripts/createAdmin.js).
// Any other value for `role`, or an omitted one, safely defaults to
// STUDENT rather than erroring, so old clients that don't send `role` yet
// keep working.
router.post("/signup", async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword, role, schoolName, board, grade, subjects } = req.body || {};

    // --- Input validation ---
    const trimmedName = sanitizeString(name);
    if (!trimmedName) return res.status(400).json({ message: "Name is required." });
    if (trimmedName.length > MAX_NAME_LEN) return res.status(400).json({ message: `Name must be at most ${MAX_NAME_LEN} characters.` });

    const trimmedEmail = sanitizeString(email);
    if (!trimmedEmail) return res.status(400).json({ message: "Email is required." });
    if (trimmedEmail.length > MAX_EMAIL_LEN) return res.status(400).json({ message: "Email is too long." });
    if (!EMAIL_RE.test(trimmedEmail)) return res.status(400).json({ message: "Please enter a valid email address." });

    if (!password || typeof password !== "string") return res.status(400).json({ message: "Password is required." });
    if (password.length < MIN_PASSWORD_LEN) return res.status(400).json({ message: `Password must be at least ${MIN_PASSWORD_LEN} characters.` });
    if (password.length > MAX_PASSWORD_LEN) return res.status(400).json({ message: `Password must be at most ${MAX_PASSWORD_LEN} characters.` });

    if (confirmPassword !== undefined && confirmPassword !== password) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    // Role selection, handled securely: only ever STUDENT or TEACHER, and
    // only from this fixed allowlist - never trust a raw client value
    // straight into the database.
    const requestedRole = typeof role === "string" ? role.trim().toUpperCase() : ROLES.STUDENT;
    if (!SIGNUP_ROLES.includes(requestedRole)) {
      return res.status(400).json({ message: `role must be one of: ${SIGNUP_ROLES.join(", ")}` });
    }

    if (!schoolName || !String(schoolName).trim()) {
      return res.status(400).json({ message: "School name is required." });
    }
    const trimmedSchool = String(schoolName).trim();
    if (trimmedSchool.length > 150) return res.status(400).json({ message: "School name is too long." });

    if (!board) return res.status(400).json({ message: "Board is required." });
    if (!(await isKnownBoard(board))) return res.status(400).json({ message: "Unrecognized board." });

    if (!grade) {
      return res
        .status(400)
        .json({ message: requestedRole === ROLES.TEACHER ? "Teaching class is required." : "Class / Standard is required." });
    }
    if (!(await isKnownGrade(grade))) return res.status(400).json({ message: "Unrecognized class / standard." });

    // Subjects are only meaningful for a TEACHER account (what they teach).
    // A STUDENT's subject is chosen in-app via the Subjects page / world
    // map, not at registration, so it's optional here — this mirrors the
    // client no longer showing the Subjects picker on the student signup
    // form (see SignUpPage.jsx).
    let subjectList;
    try {
      subjectList = parseSubjects(subjects, { required: requestedRole === ROLES.TEACHER });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }

    const [existing] = await pool.query("SELECT id FROM players WHERE email = ?", [trimmedEmail]);
    if (existing.length > 0) return res.status(409).json({ message: "An account with that email already exists." });

    // Section 4: resolve the typed school name to a real schools.id -
    // this is what every teacher/admin school-scoped query filters on,
    // school_name stays purely as the display label.
    const schoolId = await findOrCreateSchool(trimmedSchool);

    // A brand-new school has no students yet, so a teacher signing up for
    // the first time would otherwise land on an empty dashboard (0
    // students/classes/leaderboard/reports, "no student linked to this
    // school yet" exports). Seed a realistic demo cohort for the school
    // when it has none (idempotent - existing schools are left untouched).
    if (requestedRole === ROLES.TEACHER) {
      try {
        await seedSchoolCohort(schoolId, { board, grades: [String(grade)], subjects: subjectList });
      } catch (err) {
        // Never fail signup because seeding did - the account is still valid.
        console.error("seedSchoolCohort failed for school", schoolId, err.message || err);
      }
    }

    const passwordHash = await hashPassword(password);
    await pool.query(
      `UPDATE players
       SET name = ?, email = ?, password_hash = ?, role = ?,
           current_grade = ?, current_board = ?, school_name = ?, school_id = ?, subjects = ?
       WHERE id = ?`,
      [
        trimmedName,
        trimmedEmail,
        passwordHash,
        requestedRole,
        String(grade),
        board,
        trimmedSchool,
        schoolId,
        subjectList.join(","),
        req.playerId,
      ]
    );

    const [rows] = await pool.query("SELECT id, name, email, role, current_grade, current_board, school_id FROM players WHERE id = ?", [req.playerId]);
    const user = toPublicUser(rows[0]);
    setAuthCookie(res, signAuthToken(user));
    res.json({ ok: true, user });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login - { email, password } - verifies against the
// bcrypt hash and, on success, re-attaches the session cookie's anonymous
// player to the matched account (so gameplay routes that key off
// req.playerId immediately operate on the signed-in account's data) and
// sets the signed auth cookie that carries the account's role.
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    // --- Input validation ---
    if (!email || !password) return res.status(400).json({ message: "Email and password are required." });

    const trimmedEmail = sanitizeString(email);
    if (!EMAIL_RE.test(trimmedEmail)) return res.status(400).json({ message: "Please enter a valid email address." });

    // If user is already authenticated, redirect rather than re-login
    if (req.user) {
      return res.json({ ok: true, user: toPublicUser({ id: req.user.id, name: req.user.name, email: req.user.email, role: req.user.role, school_id: req.user.schoolId || null }) });
    }

    const [rows] = await pool.query("SELECT * FROM players WHERE email = ?", [trimmedEmail]);
    const account = rows[0];
    const valid = account ? await verifyPassword(password, account.password_hash) : false;
    if (!account || !valid) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const user = toPublicUser(account);
    setAuthCookie(res, signAuthToken(user));

    // Re-point the anonymous session cookie at the real account so
    // /api/player, /api/quiz/submit, etc. read/write this account's data
    // for the rest of the browser session, matching the cookie's TTL.
    res.cookie(process.env.SESSION_COOKIE_NAME || "cq_session", account.id, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: Number(process.env.SESSION_TTL_DAYS || 365) * 24 * 60 * 60 * 1000,
    });

    res.json({ ok: true, user });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/logout - clears the auth cookie. The anonymous session
// cookie is left alone on purpose: signing out returns to anonymous play
// rather than losing the session entirely.
router.post("/logout", (req, res) => {
  res.clearCookie(AUTH_COOKIE_NAME);
  res.json({ ok: true });
});

// GET /api/auth/me - returns the signed-in account (from the auth cookie
// via attachUser in app.js), or { user: null } if not signed in. The
// frontend's AuthContext calls this once on load to restore session state.
// Grade/board live on the players row (not the JWT, which stays small), so
// they're looked up here rather than round-tripped in the token.
router.get("/me", async (req, res, next) => {
  try {
    if (!req.user) return res.json({ user: null });
    const [rows] = await pool.query(
      "SELECT role, current_grade, current_board, school_id, subjects FROM players WHERE id = ?",
      [req.user.id]
    );
    if (!rows.length) return res.json({ user: null });
    return res.json({
      user: {
        ...req.user,
        grade: rows[0].current_grade ?? null,
        board: rows[0].current_board ?? null,
        schoolId: req.user.schoolId ?? rows[0].school_id ?? null,
        subjects: (rows[0].subjects || "").split(",").map((s) => s.trim()).filter(Boolean),
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/forgot-password - { email } - always returns the same
// generic response regardless of whether the address is registered
// (deliberate, per ForgotPasswordPage.jsx's comment - standard practice
// against account enumeration).
router.post("/forgot-password", async (req, res) => {
  res.json({ ok: true, message: "If an account matches that email, a reset link has been sent." });
});

module.exports = router;
