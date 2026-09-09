const express = require("express");
const { v4: uuidv4 } = require("uuid");
const pool = require("../config/db");
const { requireRole } = require("../middleware/auth");
const { ROLES, ALL_ROLES } = require("../lib/auth");
const { findOrCreateSchool } = require("../lib/schools");
const { hashPassword } = require("../lib/password");

const router = express.Router();

const ACCOUNT_STATUSES = Object.freeze(["active", "inactive", "suspended"]);

// Every route in this file is ADMIN-only. This is the real, server-side
// enforcement backing the /admin/* frontend routes (see
// client/src/components/ProtectedRoute.jsx) - the frontend guard alone is
// just UX, since a route guard can't stop someone from calling the API
// directly, so this middleware is what actually keeps STUDENT and TEACHER
// accounts out.
router.use(requireRole(ROLES.ADMIN));

// GET /api/admin/users?role=TEACHER&school_id=3 - list real accounts
// (players with a non-null email, i.e. anyone who has signed up),
// optionally filtered by role and/or school. Includes each account's
// school (Section 4) so the Admin > Students/Teachers pages can show and
// manage the school split, even though ADMIN itself isn't scoped to one.
router.get("/users", async (req, res, next) => {
  try {
    const { role, school_id: schoolId } = req.query;
    const params = [];
    let sql = `SELECT p.id, p.name, p.email, p.role, p.level, p.xp, p.created_at,
                      p.school_id, s.name AS school_name
               FROM players p
               LEFT JOIN schools s ON s.id = p.school_id
               WHERE p.email IS NOT NULL`;
    if (role) {
      if (!ALL_ROLES.includes(role)) return res.status(400).json({ message: `Unknown role: ${role}` });
      sql += " AND p.role = ?";
      params.push(role);
    }
    if (schoolId) {
      sql += " AND p.school_id = ?";
      params.push(Number(schoolId));
    }
    sql += " ORDER BY p.created_at DESC";
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/admin/users/:id/role - { role } - the only way a TEACHER or
// ADMIN account gets created: an existing admin promotes an account that
// signed up normally (as a STUDENT, per POST /api/auth/signup). Also lets
// an admin demote/manage roles generally.
router.patch("/users/:id/role", async (req, res, next) => {
  try {
    const { role } = req.body || {};
    if (!role || !ALL_ROLES.includes(role)) {
      return res.status(400).json({ message: `role must be one of: ${ALL_ROLES.join(", ")}` });
    }
    const [result] = await pool.query("UPDATE players SET role = ? WHERE id = ?", [role, req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "User not found" });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/admin/users/:id/school - { schoolId } - moves an account to a
// different school, or { schoolId: null } to unlink it (e.g. a pre-
// Section-4 account requireSchool is currently blocking from the Teacher
// Portal). This is deliberately admin-only: neither a student nor a
// teacher can self-reassign their own school_id anywhere in the API.
router.patch("/users/:id/school", async (req, res, next) => {
  try {
    const { schoolId } = req.body || {};
    let resolvedId = null;
    if (schoolId !== null && schoolId !== undefined && schoolId !== "") {
      const [rows] = await pool.query("SELECT id FROM schools WHERE id = ?", [Number(schoolId)]);
      if (rows.length === 0) return res.status(400).json({ message: "Unknown school." });
      resolvedId = rows[0].id;
    }
    const [result] = await pool.query("UPDATE players SET school_id = ? WHERE id = ?", [resolvedId, req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "User not found" });
    res.json({ ok: true, schoolId: resolvedId });
  } catch (err) {
    next(err);
  }
});

// =========================================================================
// Students & Teachers (Admin > Students, Admin > Teachers) - real
// accounts on the `players` table (role STUDENT / TEACHER, email set),
// same rows GET /users above already lists. These add full CRUD plus,
// for teachers, the subjects/boards/classes they're assigned to teach
// (migrations/007_admin_students_teachers.sql's teacher_subjects/
// teacher_boards/teacher_classes join tables).
// =========================================================================

function validateAccountStatus(status) {
  if (status === undefined) return undefined;
  if (!ACCOUNT_STATUSES.includes(status)) {
    throw Object.assign(new Error(`status must be one of: ${ACCOUNT_STATUSES.join(", ")}`), { statusCode: 400 });
  }
  return status;
}

// Shared create-account helper for POST /students and POST /teachers - an
// admin-created account needs the same credential setup a public signup
// gets (hashed password, unique email), just without the anonymous-
// session dance auth.js's /signup does, since there's no browser session
// to attach to here.
async function createAccount({ name, email, password, role, grade, board, status }) {
  if (!name || !String(name).trim()) throw Object.assign(new Error("Name is required."), { statusCode: 400 });
  if (!email || !String(email).trim()) throw Object.assign(new Error("Email is required."), { statusCode: 400 });
  if (!password || String(password).length < 8) {
    throw Object.assign(new Error("Password must be at least 8 characters."), { statusCode: 400 });
  }
  const resolvedStatus = validateAccountStatus(status) || "active";

  const [existing] = await pool.query("SELECT id FROM players WHERE email = ?", [email]);
  if (existing.length > 0) throw Object.assign(new Error("An account with that email already exists."), { statusCode: 409 });

  const id = uuidv4();
  const passwordHash = await hashPassword(String(password));
  await pool.query(
    `INSERT INTO players (id, name, email, password_hash, role, status, current_grade, current_board)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, String(name).trim(), email, passwordHash, role, resolvedStatus, grade ? String(grade) : "9", board || "CBSE"]
  );
  return id;
}

function computeAvgQuizScore(row) {
  if (!row.quizAttemptCount) return null;
  return Math.round((row.quizCorrectCount / row.quizAttemptCount) * 100);
}

// GET /api/admin/students - real STUDENT accounts, with lesson-completion
// count and average quiz-question accuracy computed from
// player_completions / quiz_submissions (there's no per-quiz "attempt"
// concept in the real schema yet - Admin > Quizzes is still mock - so
// this is accuracy across individual question submissions, not attempts).
router.get("/students", async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.id, p.name, p.email, p.current_grade AS grade, p.current_board AS board,
              p.status, p.level, p.xp, p.coins, p.school_id, s.name AS schoolName,
              (SELECT COUNT(*) FROM player_completions pc WHERE pc.player_id = p.id) AS lessonsCompletedCount,
              (SELECT COUNT(*) FROM quiz_submissions qs WHERE qs.player_id = p.id) AS quizAttemptCount,
              (SELECT COUNT(*) FROM quiz_submissions qs WHERE qs.player_id = p.id AND qs.correct = 1) AS quizCorrectCount
       FROM players p
       LEFT JOIN schools s ON s.id = p.school_id
       WHERE p.role = 'STUDENT' AND p.email IS NOT NULL
       ORDER BY p.created_at DESC`
    );
    res.json(
      rows.map((r) => ({
        id: r.id,
        name: r.name,
        email: r.email,
        grade: r.grade,
        board: r.board,
        status: r.status,
        level: r.level,
        xp: r.xp,
        coins: r.coins,
        schoolId: r.school_id,
        schoolName: r.schoolName,
        lessonsCompletedCount: r.lessonsCompletedCount,
        avgQuizScore: computeAvgQuizScore(r),
      }))
    );
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/students/:id/progress - full completed-lesson list for
// the Students > View Progress modal. Split out from the list endpoint
// above so listing every student stays cheap. quizAttempts is always
// empty for now - real quiz_submissions are per-question, not per-quiz,
// and Admin > Quizzes has no real table yet to name a quiz by.
router.get("/students/:id/progress", async (req, res, next) => {
  try {
    const [completions] = await pool.query(
      `SELECT world_id, lesson_id, accuracy, stars, completed_at
       FROM player_completions WHERE player_id = ? ORDER BY completed_at DESC`,
      [req.params.id]
    );
    res.json({
      completedLessons: completions.map((c) => ({
        lessonId: c.lesson_id,
        worldId: c.world_id,
        accuracy: c.accuracy,
        stars: c.stars,
        completedAt: c.completed_at,
      })),
      quizAttempts: [],
    });
  } catch (err) {
    next(err);
  }
});

router.post("/students", async (req, res, next) => {
  try {
    const { name, email, password, grade, board, level, xp, coins, status } = req.body || {};
    const id = await createAccount({ name, email, password, role: "STUDENT", grade, board, status });
    if (level !== undefined || xp !== undefined || coins !== undefined) {
      await pool.query(
        `UPDATE players SET level = COALESCE(?, level), xp = COALESCE(?, xp), coins = COALESCE(?, coins) WHERE id = ?`,
        [level === undefined ? null : Number(level), xp === undefined ? null : Number(xp), coins === undefined ? null : Number(coins), id]
      );
    }
    res.status(201).json({ id });
  } catch (err) {
    if (err.statusCode) return res.status(err.statusCode).json({ message: err.message });
    next(err);
  }
});

router.patch("/students/:id", async (req, res, next) => {
  try {
    const { name, email, grade, board, level, xp, coins, status } = req.body || {};
    const resolvedStatus = validateAccountStatus(status);
    const [result] = await pool.query(
      `UPDATE players SET name = COALESCE(?, name), email = COALESCE(?, email),
              current_grade = COALESCE(?, current_grade), current_board = COALESCE(?, current_board),
              level = COALESCE(?, level), xp = COALESCE(?, xp), coins = COALESCE(?, coins),
              status = COALESCE(?, status)
       WHERE id = ? AND role = 'STUDENT'`,
      [
        name ?? null, email ?? null, grade === undefined ? null : String(grade), board ?? null,
        level === undefined ? null : Number(level), xp === undefined ? null : Number(xp),
        coins === undefined ? null : Number(coins), resolvedStatus ?? null, req.params.id,
      ]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: "Student not found" });
    res.json({ ok: true });
  } catch (err) {
    if (err.statusCode) return res.status(err.statusCode).json({ message: err.message });
    if (err.code === "ER_DUP_ENTRY") return res.status(409).json({ message: "An account with that email already exists." });
    next(err);
  }
});

router.delete("/students/:id", async (req, res, next) => {
  try {
    const [result] = await pool.query("DELETE FROM players WHERE id = ? AND role = 'STUDENT'", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Student not found" });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// =========================================================================
// Teachers - same shape as Students above, plus the subjects/boards/
// classes assignment multiselects.
// =========================================================================

async function getTeacherAssignments(teacherIds) {
  if (teacherIds.length === 0) return { subjects: {}, boards: {}, classes: {} };
  const [subjectRows] = await pool.query(
    `SELECT teacher_id, subject_code FROM teacher_subjects WHERE teacher_id IN (?)`,
    [teacherIds]
  );
  const [boardRows] = await pool.query(
    `SELECT teacher_id, board_code FROM teacher_boards WHERE teacher_id IN (?)`,
    [teacherIds]
  );
  const [classRows] = await pool.query(
    `SELECT teacher_id, grade FROM teacher_classes WHERE teacher_id IN (?)`,
    [teacherIds]
  );
  const group = (rows, key) =>
    rows.reduce((acc, r) => {
      (acc[r.teacher_id] ??= []).push(r[key]);
      return acc;
    }, {});
  return {
    subjects: group(subjectRows, "subject_code"),
    boards: group(boardRows, "board_code"),
    classes: group(classRows, "grade"),
  };
}

async function setTeacherAssignments(teacherId, { subjectIds, boardIds, classIds }) {
  if (subjectIds !== undefined) {
    await pool.query("DELETE FROM teacher_subjects WHERE teacher_id = ?", [teacherId]);
    const ids = (subjectIds || []).filter(Boolean);
    if (ids.length > 0) {
      await pool.query(
        `INSERT INTO teacher_subjects (teacher_id, subject_code) VALUES ${ids.map(() => "(?, ?)").join(", ")}`,
        ids.flatMap((code) => [teacherId, code])
      );
    }
  }
  if (boardIds !== undefined) {
    await pool.query("DELETE FROM teacher_boards WHERE teacher_id = ?", [teacherId]);
    const ids = (boardIds || []).filter(Boolean);
    if (ids.length > 0) {
      await pool.query(
        `INSERT INTO teacher_boards (teacher_id, board_code) VALUES ${ids.map(() => "(?, ?)").join(", ")}`,
        ids.flatMap((code) => [teacherId, code])
      );
    }
  }
  if (classIds !== undefined) {
    await pool.query("DELETE FROM teacher_classes WHERE teacher_id = ?", [teacherId]);
    const ids = (classIds || []).filter(Boolean);
    if (ids.length > 0) {
      await pool.query(
        `INSERT INTO teacher_classes (teacher_id, grade) VALUES ${ids.map(() => "(?, ?)").join(", ")}`,
        ids.flatMap((grade) => [teacherId, Number(grade)])
      );
    }
  }
}

router.get("/teachers", async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.id, p.name, p.email, p.status, p.school_id, s.name AS schoolName
       FROM players p
       LEFT JOIN schools s ON s.id = p.school_id
       WHERE p.role = 'TEACHER' AND p.email IS NOT NULL
       ORDER BY p.created_at DESC`
    );
    const ids = rows.map((r) => r.id);
    const assignments = await getTeacherAssignments(ids);
    res.json(
      rows.map((r) => ({
        id: r.id,
        name: r.name,
        email: r.email,
        status: r.status,
        schoolId: r.school_id,
        schoolName: r.schoolName,
        subjectIds: assignments.subjects[r.id] ?? [],
        boardIds: assignments.boards[r.id] ?? [],
        classIds: (assignments.classes[r.id] ?? []).map(String),
      }))
    );
  } catch (err) {
    next(err);
  }
});

router.post("/teachers", async (req, res, next) => {
  try {
    const { name, email, password, status, subjectIds, boardIds, classIds } = req.body || {};
    const id = await createAccount({ name, email, password, role: "TEACHER", status });
    await setTeacherAssignments(id, { subjectIds, boardIds, classIds });
    res.status(201).json({ id });
  } catch (err) {
    if (err.statusCode) return res.status(err.statusCode).json({ message: err.message });
    next(err);
  }
});

router.patch("/teachers/:id", async (req, res, next) => {
  try {
    const { name, email, status, subjectIds, boardIds, classIds } = req.body || {};
    const resolvedStatus = validateAccountStatus(status);
    const [result] = await pool.query(
      `UPDATE players SET name = COALESCE(?, name), email = COALESCE(?, email), status = COALESCE(?, status)
       WHERE id = ? AND role = 'TEACHER'`,
      [name ?? null, email ?? null, resolvedStatus ?? null, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: "Teacher not found" });
    await setTeacherAssignments(req.params.id, { subjectIds, boardIds, classIds });
    res.json({ ok: true });
  } catch (err) {
    if (err.statusCode) return res.status(err.statusCode).json({ message: err.message });
    if (err.code === "ER_DUP_ENTRY") return res.status(409).json({ message: "An account with that email already exists." });
    next(err);
  }
});

router.delete("/teachers/:id", async (req, res, next) => {
  try {
    const [result] = await pool.query("DELETE FROM players WHERE id = ? AND role = 'TEACHER'", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Teacher not found" });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/schools - every school on file, with headcounts. Backs
// an Admin > Schools page for managing the school list directly (Section
// 4), separate from the free-text field on the registration form.
router.get("/schools", async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT s.id, s.name, s.created_at,
              COUNT(CASE WHEN p.role = 'STUDENT' THEN 1 END) AS studentCount,
              COUNT(CASE WHEN p.role = 'TEACHER' THEN 1 END) AS teacherCount
       FROM schools s
       LEFT JOIN players p ON p.school_id = s.id
       GROUP BY s.id, s.name, s.created_at
       ORDER BY s.name`
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/schools - { name } - creates a school directly (rather
// than waiting for the first signup to create it), reusing the same
// find-or-create as signup so this can never produce a duplicate school
// that only differs by case/whitespace.
router.post("/schools", async (req, res, next) => {
  try {
    const { name } = req.body || {};
    if (!name || !String(name).trim()) return res.status(400).json({ message: "School name is required." });
    const id = await findOrCreateSchool(name);
    const [rows] = await pool.query("SELECT id, name, created_at FROM schools WHERE id = ?", [id]);
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.message?.includes("too long")) return res.status(400).json({ message: err.message });
    next(err);
  }
});

// PATCH /api/admin/schools/:id - { name } - rename a school.
router.patch("/schools/:id", async (req, res, next) => {
  try {
    const { name } = req.body || {};
    if (!name || !String(name).trim()) return res.status(400).json({ message: "School name is required." });
    const trimmed = String(name).trim();
    if (trimmed.length > 150) return res.status(400).json({ message: "School name is too long." });

    const [result] = await pool.query(
      "UPDATE schools SET name = ?, normalized_name = ? WHERE id = ?",
      [trimmed, trimmed.toLowerCase(), req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: "School not found" });
    res.json({ ok: true });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "A school with that name already exists." });
    }
    next(err);
  }
});

// DELETE /api/admin/schools/:id - only when no accounts still reference
// it. Blocking this (rather than letting ON DELETE SET NULL silently
// orphan a whole school's students/teachers) means a schools list can
// never lose a row a teacher's account still depends on without an admin
// explicitly reassigning them first (PATCH /api/admin/users/:id/school).
router.delete("/schools/:id", async (req, res, next) => {
  try {
    const [[{ inUse }]] = await pool.query(
      "SELECT COUNT(*) AS inUse FROM players WHERE school_id = ?",
      [req.params.id]
    );
    if (inUse > 0) {
      return res.status(409).json({ message: `${inUse} account(s) still belong to this school. Reassign them first.` });
    }
    const [result] = await pool.query("DELETE FROM schools WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "School not found" });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// =========================================================================
// Admin Users (Admin > Admin Users) - real `admin_users` table (see
// migrations/008_admin_console_users.sql). Console accounts with access to
// /admin and what each can manage - distinct from GET /users above, which
// lists real STUDENT/TEACHER/ADMIN platform accounts on `players`. See
// that migration's header comment for why the two aren't the same table.
// =========================================================================

const ADMIN_CONSOLE_ROLES = Object.freeze(["Super Admin", "Admin", "Support"]);
const ADMIN_PERMISSIONS = Object.freeze(["Content", "People", "Reports", "Settings"]);

function cleanPermissions(permissions) {
  if (permissions === undefined) return undefined;
  const list = Array.isArray(permissions) ? permissions : [];
  return list.filter((p) => ADMIN_PERMISSIONS.includes(p));
}

function serializeAdminUser(r) {
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    role: r.role,
    permissions: r.permissions ?? [],
    status: r.status,
    lastLogin: r.last_login ? new Date(r.last_login).toISOString().slice(0, 10) : null,
  };
}

router.get("/admin-users", async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, name, email, role, permissions, status, last_login
       FROM admin_users ORDER BY created_at DESC`
    );
    res.json(rows.map(serializeAdminUser));
  } catch (err) {
    next(err);
  }
});

router.post("/admin-users", async (req, res, next) => {
  try {
    const { name, email, role, permissions, status } = req.body || {};
    if (!name || !String(name).trim()) return res.status(400).json({ message: "Name is required." });
    if (!email || !String(email).trim()) return res.status(400).json({ message: "Email is required." });
    if (!role || !ADMIN_CONSOLE_ROLES.includes(role)) {
      return res.status(400).json({ message: `role must be one of: ${ADMIN_CONSOLE_ROLES.join(", ")}` });
    }
    const resolvedStatus = validateAccountStatus(status) || "active";
    const id = uuidv4();
    await pool.query(
      `INSERT INTO admin_users (id, name, email, role, permissions, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, String(name).trim(), String(email).trim(), role, JSON.stringify(cleanPermissions(permissions) ?? []), resolvedStatus]
    );
    res.status(201).json(serializeAdminUser({ id, name, email, role, permissions: cleanPermissions(permissions) ?? [], status: resolvedStatus, last_login: null }));
  } catch (err) {
    if (err.statusCode) return res.status(err.statusCode).json({ message: err.message });
    if (err.code === "ER_DUP_ENTRY") return res.status(409).json({ message: "An admin user with that email already exists." });
    next(err);
  }
});

router.patch("/admin-users/:id", async (req, res, next) => {
  try {
    const { name, email, role, permissions, status } = req.body || {};
    if (role !== undefined && !ADMIN_CONSOLE_ROLES.includes(role)) {
      return res.status(400).json({ message: `role must be one of: ${ADMIN_CONSOLE_ROLES.join(", ")}` });
    }
    const resolvedStatus = validateAccountStatus(status);
    const resolvedPermissions = cleanPermissions(permissions);
    const [result] = await pool.query(
      `UPDATE admin_users SET name = COALESCE(?, name), email = COALESCE(?, email),
              role = COALESCE(?, role), permissions = COALESCE(?, permissions),
              status = COALESCE(?, status)
       WHERE id = ?`,
      [
        name ?? null, email ?? null, role ?? null,
        resolvedPermissions === undefined ? null : JSON.stringify(resolvedPermissions),
        resolvedStatus ?? null, req.params.id,
      ]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: "Admin user not found" });
    res.json({ ok: true });
  } catch (err) {
    if (err.statusCode) return res.status(err.statusCode).json({ message: err.message });
    if (err.code === "ER_DUP_ENTRY") return res.status(409).json({ message: "An admin user with that email already exists." });
    next(err);
  }
});

router.delete("/admin-users/:id", async (req, res, next) => {
  try {
    const [result] = await pool.query("DELETE FROM admin_users WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Admin user not found" });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// =========================================================================
// Subjects (Admin > Subjects) - real `subjects` table (see
// migrations/005_add_subjects.sql). `worldsCount` is computed, not stored.
// =========================================================================

router.get("/subjects", async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT s.code, s.name, s.icon, s.description, s.status, s.sort_order,
              COUNT(w.id) AS worldsCount
       FROM subjects s
       LEFT JOIN worlds w ON w.subject_code = s.code
       GROUP BY s.code, s.name, s.icon, s.description, s.status, s.sort_order
       ORDER BY s.sort_order ASC`
    );
    res.json(rows.map((r) => ({ id: r.code, ...r })));
  } catch (err) {
    next(err);
  }
});

router.post("/subjects", async (req, res, next) => {
  try {
    const { id, code, name, icon, description, status, sortOrder } = req.body || {};
    const rawCode = code || id;
    if (!rawCode || !String(rawCode).trim()) return res.status(400).json({ message: "Code is required." });
    if (!name || !String(name).trim()) return res.status(400).json({ message: "Name is required." });
    const cleanCode = String(rawCode).trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");
    await pool.query(
      `INSERT INTO subjects (code, name, icon, description, status, sort_order)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [cleanCode, name, icon || "BookOpen", description || "", status || "active", Number(sortOrder) || 0]
    );
    res.status(201).json({ id: cleanCode, code: cleanCode, name, icon, description, status, sortOrder, worldsCount: 0 });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") return res.status(409).json({ message: "A subject with that code already exists." });
    next(err);
  }
});

router.patch("/subjects/:code", async (req, res, next) => {
  try {
    const { name, icon, description, status, sortOrder } = req.body || {};
    const [result] = await pool.query(
      `UPDATE subjects SET name = COALESCE(?, name), icon = COALESCE(?, icon),
              description = COALESCE(?, description), status = COALESCE(?, status),
              sort_order = COALESCE(?, sort_order)
       WHERE code = ?`,
      [name ?? null, icon ?? null, description ?? null, status ?? null, sortOrder === undefined ? null : Number(sortOrder), req.params.code]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: "Subject not found" });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

router.delete("/subjects/:code", async (req, res, next) => {
  try {
    const [result] = await pool.query("DELETE FROM subjects WHERE code = ?", [req.params.code]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Subject not found" });
    res.json({ ok: true });
  } catch (err) {
    if (err.code === "ER_ROW_IS_REFERENCED_2" || err.code === "ER_ROW_IS_REFERENCED") {
      return res.status(409).json({ message: "This subject still has worlds/boards/classes referencing it. Remove those first." });
    }
    next(err);
  }
});

// =========================================================================
// Boards (Admin > Boards) - real `boards` table, grouped under
// `board_categories`, with a `board_subjects` join table for the
// "Subjects Offered" multiselect (see migrations/006_admin_boards_classes.sql).
// =========================================================================

// Resolves a free-text category name to a board_categories.id, creating
// the row the first time it's seen - same find-or-create shape as
// findOrCreateSchool() in lib/schools.js.
async function findOrCreateBoardCategory(rawName) {
  const trimmed = String(rawName || "").trim();
  if (!trimmed) throw new Error("Category is required.");
  const [existing] = await pool.query("SELECT id FROM board_categories WHERE category = ?", [trimmed]);
  if (existing.length > 0) return existing[0].id;
  const [[{ maxOrder }]] = await pool.query("SELECT COALESCE(MAX(sort_order), -1) AS maxOrder FROM board_categories");
  const [result] = await pool.query(
    "INSERT INTO board_categories (category, sort_order) VALUES (?, ?)",
    [trimmed, maxOrder + 1]
  );
  return result.insertId;
}

router.get("/boards", async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT b.code, b.name, b.type, b.description, b.courses, b.lessons,
              b.icon, b.sort_order, b.status, c.category
       FROM boards b
       JOIN board_categories c ON c.id = b.category_id
       ORDER BY b.sort_order ASC`
    );
    const [subjectRows] = await pool.query("SELECT board_code, subject_code FROM board_subjects");
    const subjectsByBoard = subjectRows.reduce((acc, r) => {
      (acc[r.board_code] ??= []).push(r.subject_code);
      return acc;
    }, {});
    res.json(rows.map((r) => ({ id: r.code, ...r, subjectIds: subjectsByBoard[r.code] ?? [] })));
  } catch (err) {
    next(err);
  }
});

async function setBoardSubjects(boardCode, subjectIds) {
  await pool.query("DELETE FROM board_subjects WHERE board_code = ?", [boardCode]);
  const ids = Array.isArray(subjectIds) ? subjectIds.filter(Boolean) : [];
  if (ids.length === 0) return;
  await pool.query(
    `INSERT INTO board_subjects (board_code, subject_code) VALUES ${ids.map(() => "(?, ?)").join(", ")}`,
    ids.flatMap((subjectCode) => [boardCode, subjectCode])
  );
}

router.post("/boards", async (req, res, next) => {
  try {
    const { id, code, name, type, category, description, courses, lessons, icon, status, subjectIds } = req.body || {};
    const boardCode = String(code || id || "").trim().toUpperCase();
    if (!boardCode) return res.status(400).json({ message: "Board code is required." });
    if (!name || !String(name).trim()) return res.status(400).json({ message: "Name is required." });
    const categoryId = await findOrCreateBoardCategory(category || "State Boards");
    await pool.query(
      `INSERT INTO boards (code, category_id, name, type, description, courses, lessons, icon, sort_order, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        boardCode, categoryId, name, type || "State Board", description || "",
        Number(courses) || 0, Number(lessons) || 0, icon || "Landmark", 0, status || "active",
      ]
    );
    await setBoardSubjects(boardCode, subjectIds);
    res.status(201).json({ id: boardCode, code: boardCode });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") return res.status(409).json({ message: "A board with that code already exists." });
    if (err.message?.includes("required")) return res.status(400).json({ message: err.message });
    next(err);
  }
});

router.patch("/boards/:code", async (req, res, next) => {
  try {
    const { name, type, category, description, courses, lessons, icon, status, subjectIds } = req.body || {};
    const categoryId = category ? await findOrCreateBoardCategory(category) : undefined;
    const [result] = await pool.query(
      `UPDATE boards SET name = COALESCE(?, name), type = COALESCE(?, type),
              category_id = COALESCE(?, category_id), description = COALESCE(?, description),
              courses = COALESCE(?, courses), lessons = COALESCE(?, lessons),
              icon = COALESCE(?, icon), status = COALESCE(?, status)
       WHERE code = ?`,
      [
        name ?? null, type ?? null, categoryId ?? null, description ?? null,
        courses === undefined ? null : Number(courses), lessons === undefined ? null : Number(lessons),
        icon ?? null, status ?? null, req.params.code,
      ]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: "Board not found" });
    if (subjectIds !== undefined) await setBoardSubjects(req.params.code, subjectIds);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

router.delete("/boards/:code", async (req, res, next) => {
  try {
    // boards -> lessons/questions is ON DELETE CASCADE at the DB level
    // (board-specific content overrides disappear along with their board,
    // by original schema design - see schema.sql). That's silent data
    // loss for an admin clicking Delete, so check first and block with
    // 409 instead of letting the cascade run, mirroring how DELETE
    // /schools/:id protects against orphaning accounts above.
    const [[{ inUse }]] = await pool.query(
      `SELECT (SELECT COUNT(*) FROM lessons WHERE board_code = ?) +
              (SELECT COUNT(*) FROM questions WHERE board_code = ?) AS inUse`,
      [req.params.code, req.params.code]
    );
    if (inUse > 0) {
      return res.status(409).json({ message: `${inUse} lesson(s)/question(s) still override content for this board. Remove those first.` });
    }
    const [result] = await pool.query("DELETE FROM boards WHERE code = ?", [req.params.code]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Board not found" });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// =========================================================================
// Classes (Admin > Classes) - real `classes` table (PK = grade), with a
// `class_subjects` join table for the "Subjects Offered" multiselect.
// =========================================================================

router.get("/classes", async (req, res, next) => {
  try {
    const [rows] = await pool.query("SELECT * FROM classes ORDER BY grade ASC");
    const [subjectRows] = await pool.query("SELECT grade, subject_code FROM class_subjects");
    const subjectsByGrade = subjectRows.reduce((acc, r) => {
      (acc[r.grade] ??= []).push(r.subject_code);
      return acc;
    }, {});
    res.json(
      rows.map((r) => ({
        id: String(r.grade),
        grade: r.grade,
        icon: r.icon,
        courses: r.courses,
        lessons: r.lessons,
        questions: r.questions,
        difficultyLabel: r.difficulty_label,
        subjectIds: subjectsByGrade[r.grade] ?? [],
      }))
    );
  } catch (err) {
    next(err);
  }
});

async function setClassSubjects(grade, subjectIds) {
  await pool.query("DELETE FROM class_subjects WHERE grade = ?", [grade]);
  const ids = Array.isArray(subjectIds) ? subjectIds.filter(Boolean) : [];
  if (ids.length === 0) return;
  await pool.query(
    `INSERT INTO class_subjects (grade, subject_code) VALUES ${ids.map(() => "(?, ?)").join(", ")}`,
    ids.flatMap((subjectCode) => [grade, subjectCode])
  );
}

router.post("/classes", async (req, res, next) => {
  try {
    const { id, grade, icon, courses, lessons, questions, difficultyLabel, subjectIds } = req.body || {};
    const gradeNum = Number(grade ?? id);
    if (!gradeNum) return res.status(400).json({ message: "Grade is required." });
    if (!difficultyLabel || !String(difficultyLabel).trim()) {
      return res.status(400).json({ message: "Difficulty label is required." });
    }
    await pool.query(
      `INSERT INTO classes (grade, icon, courses, lessons, questions, difficulty_label)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [gradeNum, icon || "Sprout", Number(courses) || 0, Number(lessons) || 0, Number(questions) || 0, difficultyLabel]
    );
    await setClassSubjects(gradeNum, subjectIds);
    res.status(201).json({ id: String(gradeNum), grade: gradeNum });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") return res.status(409).json({ message: "A class with that grade already exists." });
    next(err);
  }
});

router.patch("/classes/:grade", async (req, res, next) => {
  try {
    const { icon, courses, lessons, questions, difficultyLabel, subjectIds } = req.body || {};
    const [result] = await pool.query(
      `UPDATE classes SET icon = COALESCE(?, icon), courses = COALESCE(?, courses),
              lessons = COALESCE(?, lessons), questions = COALESCE(?, questions),
              difficulty_label = COALESCE(?, difficulty_label)
       WHERE grade = ?`,
      [
        icon ?? null, courses === undefined ? null : Number(courses),
        lessons === undefined ? null : Number(lessons),
        questions === undefined ? null : Number(questions),
        difficultyLabel ?? null, req.params.grade,
      ]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: "Class not found" });
    if (subjectIds !== undefined) await setClassSubjects(Number(req.params.grade), subjectIds);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

router.delete("/classes/:grade", async (req, res, next) => {
  try {
    const [result] = await pool.query("DELETE FROM classes WHERE grade = ?", [req.params.grade]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Class not found" });
    res.json({ ok: true });
  } catch (err) {
    if (err.code === "ER_ROW_IS_REFERENCED_2" || err.code === "ER_ROW_IS_REFERENCED") {
      return res.status(409).json({ message: "This class still has content referencing it. Remove those first." });
    }
    next(err);
  }
});

// =========================================================================
// Courses lookup (read-only) - real `worlds` table. Admin > Courses
// itself is still mock/localStorage (full CRUD there is a later phase),
// but Lessons and Questions below need a real, validated Course to
// attach to, so this gives their dropdowns/foreign-key checks something
// real to point at without building the full Courses CRUD yet. Same
// "reuse real catalog data for a dropdown" pattern client/src/admin/api.js
// already uses for Board/Class/Subject filters on the Leaderboard report.
// =========================================================================

router.get("/courses", async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, subject_code AS subjectCode, topic FROM worlds ORDER BY sort_order ASC"
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

async function assertCourseExists(worldId) {
  if (!worldId || !String(worldId).trim()) {
    throw Object.assign(new Error("Course is required."), { statusCode: 400 });
  }
  const [rows] = await pool.query("SELECT id FROM worlds WHERE id = ?", [worldId]);
  if (rows.length === 0) throw Object.assign(new Error(`Unknown course "${worldId}".`), { statusCode: 400 });
}

// Board Override is optional on both Lessons and Questions (NULL = shared
// template every board falls back to, Section 8) - only validate it
// against `boards` when one was actually given.
async function assertBoardExistsIfGiven(boardCode) {
  if (boardCode === undefined || boardCode === null || boardCode === "") return null;
  const [rows] = await pool.query("SELECT code FROM boards WHERE code = ?", [boardCode]);
  if (rows.length === 0) throw Object.assign(new Error(`Unknown board "${boardCode}".`), { statusCode: 400 });
  return boardCode;
}

const CONTENT_STATUSES = Object.freeze(["published", "draft"]);
function validateContentStatus(status) {
  if (status === undefined) return undefined;
  if (!CONTENT_STATUSES.includes(status)) {
    throw Object.assign(new Error(`status must be one of: ${CONTENT_STATUSES.join(", ")}`), { statusCode: 400 });
  }
  return status;
}

// =========================================================================
// Lessons (Admin > Lessons) - real `lessons` table. The mock version of
// this page grouped lessons under a `chapterId` that has no real table
// (Chapters is still a later, unbuilt phase - see migrations/
// 009_lessons_questions_status.sql's header). Repointed to the real
// relation instead: a lesson belongs to a Course (`world_id`), with an
// optional per-board override, exactly as `lessons` already models it.
// =========================================================================

function serializeLesson(r) {
  return {
    id: r.id,
    courseId: r.world_id,
    courseName: r.courseName ?? null,
    board: r.board_code,
    lessonKey: r.lesson_key,
    title: r.title,
    description: r.description,
    sortOrder: r.sort_order,
    status: r.status,
  };
}

router.get("/lessons", async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT l.id, l.world_id, w.name AS courseName, l.board_code, l.lesson_key,
              l.title, l.description, l.sort_order, l.status
       FROM lessons l LEFT JOIN worlds w ON w.id = l.world_id
       ORDER BY l.world_id ASC, l.sort_order ASC`
    );
    res.json(rows.map(serializeLesson));
  } catch (err) {
    next(err);
  }
});

router.post("/lessons", async (req, res, next) => {
  try {
    const { title, courseId, description, board, sortOrder, status } = req.body || {};
    if (!title || !String(title).trim()) return res.status(400).json({ message: "Title is required." });
    await assertCourseExists(courseId);
    const boardCode = await assertBoardExistsIfGiven(board);
    const resolvedStatus = validateContentStatus(status) || "published";

    // lesson_key (l1, l2, ...) and a default sort position are derived
    // from how many lessons already exist in this exact Course+Board
    // scope - the form (kept as-is per the mock UI) never collects a key
    // directly. "<=>" is MySQL's NULL-safe equals, needed since boardCode
    // is often NULL (the shared template).
    const [[{ cnt }]] = await pool.query(
      "SELECT COUNT(*) AS cnt FROM lessons WHERE world_id = ? AND board_code <=> ?",
      [courseId, boardCode]
    );
    const lessonKey = `l${cnt + 1}`;
    const resolvedSortOrder = sortOrder === undefined || sortOrder === "" ? cnt : Number(sortOrder);

    const [result] = await pool.query(
      `INSERT INTO lessons (world_id, board_code, lesson_key, title, description, sort_order, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [courseId, boardCode, lessonKey, String(title).trim(), description || "", resolvedSortOrder, resolvedStatus]
    );
    res.status(201).json({
      id: result.insertId, courseId, board: boardCode, lessonKey, title, description: description || "",
      sortOrder: resolvedSortOrder, status: resolvedStatus,
    });
  } catch (err) {
    if (err.statusCode) return res.status(err.statusCode).json({ message: err.message });
    next(err);
  }
});

router.patch("/lessons/:id", async (req, res, next) => {
  try {
    const { title, courseId, description, board, sortOrder, status } = req.body || {};
    if (courseId !== undefined) await assertCourseExists(courseId);
    const boardProvided = board !== undefined;
    const boardCode = boardProvided ? await assertBoardExistsIfGiven(board) : undefined;
    const resolvedStatus = validateContentStatus(status);

    const [result] = await pool.query(
      `UPDATE lessons SET title = COALESCE(?, title), world_id = COALESCE(?, world_id),
              description = COALESCE(?, description), sort_order = COALESCE(?, sort_order),
              status = COALESCE(?, status)${boardProvided ? ", board_code = ?" : ""}
       WHERE id = ?`,
      boardProvided
        ? [
            title ?? null, courseId ?? null, description ?? null,
            sortOrder === undefined ? null : Number(sortOrder), resolvedStatus ?? null, boardCode, req.params.id,
          ]
        : [
            title ?? null, courseId ?? null, description ?? null,
            sortOrder === undefined ? null : Number(sortOrder), resolvedStatus ?? null, req.params.id,
          ]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: "Lesson not found" });
    res.json({ ok: true });
  } catch (err) {
    if (err.statusCode) return res.status(err.statusCode).json({ message: err.message });
    next(err);
  }
});

router.delete("/lessons/:id", async (req, res, next) => {
  try {
    const [result] = await pool.query("DELETE FROM lessons WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Lesson not found" });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// =========================================================================
// Questions (Admin > Questions) - real `questions` table. The mock
// version of this page tied a question to a `lessonId`, but the real
// battle engine (lib/gameLogic.js's getQuestionPool) never filters
// questions by lesson - only by Course (world_id) + Board override +
// Difficulty. Repointed to match: no lesson relationship, real or fake.
// =========================================================================

const QUESTION_DIFFICULTIES = Object.freeze(["easy", "medium", "hard", "expert"]);
const QUESTION_TYPES = Object.freeze(["mcq", "multi_select", "true_false", "fill_blank", "numerical", "sequence", "match_following"]);

function serializeQuestion(r) {
  return {
    id: r.id,
    courseId: r.world_id,
    courseName: r.courseName ?? null,
    board: r.board_code,
    difficulty: r.difficulty_id,
    type: r.type,
    questionText: r.question_text,
    correctAnswer: r.correct_answer,
    explanation: r.explanation,
    sortOrder: r.sort_order,
    status: r.status,
  };
}

router.get("/questions", async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT q.id, q.world_id, w.name AS courseName, q.board_code, q.difficulty_id, q.type,
              q.question_text, q.correct_answer, q.explanation, q.sort_order, q.status
       FROM questions q LEFT JOIN worlds w ON w.id = q.world_id
       ORDER BY q.world_id ASC, q.difficulty_id ASC, q.sort_order ASC`
    );
    res.json(rows.map(serializeQuestion));
  } catch (err) {
    next(err);
  }
});

router.post("/questions", async (req, res, next) => {
  try {
    const { questionText, courseId, board, difficulty, type, correctAnswer, explanation, sortOrder, status } = req.body || {};
    if (!questionText || !String(questionText).trim()) return res.status(400).json({ message: "Question text is required." });
    if (!correctAnswer || !String(correctAnswer).trim()) return res.status(400).json({ message: "Correct answer is required." });
    if (!difficulty || !QUESTION_DIFFICULTIES.includes(difficulty)) {
      return res.status(400).json({ message: `difficulty must be one of: ${QUESTION_DIFFICULTIES.join(", ")}` });
    }
    const questionType = type || "mcq";
    if (!QUESTION_TYPES.includes(questionType)) {
      return res.status(400).json({ message: `type must be one of: ${QUESTION_TYPES.join(", ")}` });
    }
    await assertCourseExists(courseId);
    const boardCode = await assertBoardExistsIfGiven(board);
    const resolvedStatus = validateContentStatus(status) || "published";

    const [[{ cnt }]] = await pool.query(
      "SELECT COUNT(*) AS cnt FROM questions WHERE world_id = ? AND board_code <=> ? AND difficulty_id = ?",
      [courseId, boardCode, difficulty]
    );
    const resolvedSortOrder = sortOrder === undefined || sortOrder === "" ? cnt : Number(sortOrder);

    const [result] = await pool.query(
      `INSERT INTO questions (world_id, board_code, difficulty_id, type, question_text, correct_answer, explanation, sort_order, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        courseId, boardCode, difficulty, questionType, String(questionText).trim(),
        String(correctAnswer).trim(), explanation || "", resolvedSortOrder, resolvedStatus,
      ]
    );
    res.status(201).json({
      id: result.insertId, courseId, board: boardCode, difficulty, type: questionType,
      questionText, correctAnswer, explanation: explanation || "", sortOrder: resolvedSortOrder, status: resolvedStatus,
    });
  } catch (err) {
    if (err.statusCode) return res.status(err.statusCode).json({ message: err.message });
    next(err);
  }
});

router.patch("/questions/:id", async (req, res, next) => {
  try {
    const { questionText, courseId, board, difficulty, type, correctAnswer, explanation, sortOrder, status } = req.body || {};
    if (difficulty !== undefined && !QUESTION_DIFFICULTIES.includes(difficulty)) {
      return res.status(400).json({ message: `difficulty must be one of: ${QUESTION_DIFFICULTIES.join(", ")}` });
    }
    if (type !== undefined && !QUESTION_TYPES.includes(type)) {
      return res.status(400).json({ message: `type must be one of: ${QUESTION_TYPES.join(", ")}` });
    }
    if (courseId !== undefined) await assertCourseExists(courseId);
    const boardProvided = board !== undefined;
    const boardCode = boardProvided ? await assertBoardExistsIfGiven(board) : undefined;
    const resolvedStatus = validateContentStatus(status);

    const [result] = await pool.query(
      `UPDATE questions SET question_text = COALESCE(?, question_text), world_id = COALESCE(?, world_id),
              difficulty_id = COALESCE(?, difficulty_id), type = COALESCE(?, type),
              correct_answer = COALESCE(?, correct_answer), explanation = COALESCE(?, explanation),
              sort_order = COALESCE(?, sort_order), status = COALESCE(?, status)${boardProvided ? ", board_code = ?" : ""}
       WHERE id = ?`,
      boardProvided
        ? [
            questionText ?? null, courseId ?? null, difficulty ?? null, type ?? null,
            correctAnswer ?? null, explanation ?? null, sortOrder === undefined ? null : Number(sortOrder),
            resolvedStatus ?? null, boardCode, req.params.id,
          ]
        : [
            questionText ?? null, courseId ?? null, difficulty ?? null, type ?? null,
            correctAnswer ?? null, explanation ?? null, sortOrder === undefined ? null : Number(sortOrder),
            resolvedStatus ?? null, req.params.id,
          ]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: "Question not found" });
    res.json({ ok: true });
  } catch (err) {
    if (err.statusCode) return res.status(err.statusCode).json({ message: err.message });
    next(err);
  }
});

router.delete("/questions/:id", async (req, res, next) => {
  try {
    const [result] = await pool.query("DELETE FROM questions WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Question not found" });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/stats - small admin-only dashboard summary.
router.get("/stats", async (req, res, next) => {
  try {
    const [[{ totalPlayers }]] = await pool.query("SELECT COUNT(*) AS totalPlayers FROM players");
    const [[{ totalStudents }]] = await pool.query(
      "SELECT COUNT(*) AS totalStudents FROM players WHERE role = 'STUDENT' AND email IS NOT NULL"
    );
    const [[{ totalTeachers }]] = await pool.query(
      "SELECT COUNT(*) AS totalTeachers FROM players WHERE role = 'TEACHER'"
    );
    const [[{ totalSchools }]] = await pool.query("SELECT COUNT(*) AS totalSchools FROM schools");
    res.json({ totalPlayers, totalStudents, totalTeachers, totalSchools });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/content-coverage - Section 53. Powers the Admin > Content
// Completeness dashboard: how far each subject has been authored across the
// full curriculum hierarchy (worlds > lessons, units > concepts > topics >
// learning contents) plus the question bank, quizzes and quiz<->question
// links. Every metric is source-of-truth COUNT() from the live DB, so the
// page never drifts from what players can actually reach.
router.get("/content-coverage", async (req, res, next) => {
  try {
    const [[{ totalSubjects }]] = await pool.query("SELECT COUNT(*) AS totalSubjects FROM subjects WHERE status = 'active'");
    const [[{ totalWorlds }]] = await pool.query("SELECT COUNT(*) AS totalWorlds FROM worlds");
    const [[{ totalLessons }]] = await pool.query("SELECT COUNT(*) AS totalLessons FROM lessons");
    const [[{ totalQuestions }]] = await pool.query("SELECT COUNT(*) AS totalQuestions FROM questions");
    const [[{ totalQuizzes }]] = await pool.query("SELECT COUNT(*) AS totalQuizzes FROM quizzes");
    const [[{ totalQuizQuestions }]] = await pool.query("SELECT COUNT(*) AS totalQuizQuestions FROM quiz_questions");
    const [[{ totalUnits }]] = await pool.query("SELECT COUNT(*) AS totalUnits FROM units");
    const [[{ totalConcepts }]] = await pool.query("SELECT COUNT(*) AS totalConcepts FROM concepts");
    const [[{ totalTopics }]] = await pool.query("SELECT COUNT(*) AS totalTopics FROM topics");
    const [[{ totalLearningContents }]] = await pool.query("SELECT COUNT(*) AS totalLearningContents FROM learning_contents");

    const [rows] = await pool.query(`
      SELECT
        s.code AS subjectCode,
        s.name AS name,
        s.icon AS icon,
        s.status AS status,
        COALESCE(wd.worlds, 0)        AS worlds,
        COALESCE(ls.lessons, 0)       AS lessons,
        COALESCE(un.units, 0)         AS units,
        COALESCE(co.concepts, 0)      AS concepts,
        COALESCE(to2.topics, 0)       AS topics,
        COALESCE(lc.learningContents, 0) AS learningContents,
        COALESCE(qu.questions, 0)     AS questions,
        COALESCE(qz.quizzes, 0)       AS quizzes,
        COALESCE(qq.quizQuestions, 0) AS quizQuestions
      FROM subjects s
      LEFT JOIN (SELECT subject_code, COUNT(*) AS worlds FROM worlds GROUP BY subject_code) wd
        ON wd.subject_code = s.code
      LEFT JOIN (SELECT w.subject_code, COUNT(l.id) AS lessons FROM lessons l JOIN worlds w ON w.id = l.world_id GROUP BY w.subject_code) ls
        ON ls.subject_code = s.code
      LEFT JOIN (SELECT subject_code, COUNT(*) AS units FROM units GROUP BY subject_code) un
        ON un.subject_code = s.code
      LEFT JOIN (SELECT un2.subject_code, COUNT(co2.id) AS concepts FROM concepts co2 JOIN units un2 ON un2.id = co2.unit_id GROUP BY un2.subject_code) co
        ON co.subject_code = s.code
      LEFT JOIN (SELECT un3.subject_code, COUNT(to3.id) AS topics FROM topics to3 JOIN concepts co3 ON co3.id = to3.concept_id JOIN units un3 ON un3.id = co3.unit_id GROUP BY un3.subject_code) to2
        ON to2.subject_code = s.code
      LEFT JOIN (SELECT un4.subject_code, COUNT(lc2.id) AS learningContents FROM learning_contents lc2 JOIN topics to4 ON to4.id = lc2.topic_id JOIN concepts co4 ON co4.id = to4.concept_id JOIN units un4 ON un4.id = co4.unit_id GROUP BY un4.subject_code) lc
        ON lc.subject_code = s.code
      LEFT JOIN (SELECT w2.subject_code, COUNT(q2.id) AS questions FROM questions q2 JOIN worlds w2 ON w2.id = q2.world_id GROUP BY w2.subject_code) qu
        ON qu.subject_code = s.code
      LEFT JOIN (SELECT subject_code, COUNT(*) AS quizzes FROM quizzes GROUP BY subject_code) qz
        ON qz.subject_code = s.code
      LEFT JOIN (SELECT q3.subject_code, COUNT(qq2.id) AS quizQuestions FROM quiz_questions qq2 JOIN quizzes q3 ON q3.id = qq2.quiz_id GROUP BY q3.subject_code) qq
        ON qq.subject_code = s.code
      ORDER BY s.sort_order ASC, s.code ASC
    `);

    // Completeness score: share of non-empty content layers out of the set a
    // subject should eventually have. "Expected" layers are the ones every
    // active subject must have to be player-ready.
    const EXPECTED_LAYERS = [
      "worlds", "lessons", "units", "concepts", "topics",
      "learningContents", "questions", "quizzes", "quizQuestions",
    ];
    const gaps = [];
    const perSubject = rows.map((r) => {
      let filled = 0;
      for (const layer of EXPECTED_LAYERS) {
        if (Number(r[layer]) > 0) filled += 1;
        else if (r.status === "active") {
          gaps.push({
            subjectCode: r.subjectCode,
            layer,
            actual: Number(r[layer]),
            message: `${r.name} has no ${layer.replace(/([A-Z])/g, " $1").toLowerCase()}`,
          });
        }
      }
      return {
        ...r,
        worlds: Number(r.worlds),
        lessons: Number(r.lessons),
        units: Number(r.units),
        concepts: Number(r.concepts),
        topics: Number(r.topics),
        learningContents: Number(r.learningContents),
        questions: Number(r.questions),
        quizzes: Number(r.quizzes),
        quizQuestions: Number(r.quizQuestions),
        completeness: Math.round((filled / EXPECTED_LAYERS.length) * 100),
      };
    });

    const healthy = perSubject.filter((x) => x.status === "active" && x.completeness === 100).length;
    const attention = perSubject.filter((x) => x.status === "active" && x.completeness > 0 && x.completeness < 100).length;
    const emptyActive = perSubject.filter((x) => x.status === "active" && x.completeness === 0).length;
    const overall = perSubject.filter((x) => x.status === "active")
      .reduce((acc, x) => acc + x.completeness, 0);

    res.json({
      generatedAt: new Date().toISOString(),
      totals: {
        subjects: totalSubjects,
        worlds: totalWorlds,
        lessons: totalLessons,
        questions: totalQuestions,
        quizzes: totalQuizzes,
        quizQuestions: totalQuizQuestions,
        units: totalUnits,
        concepts: totalConcepts,
        topics: totalTopics,
        learningContents: totalLearningContents,
      },
      summary: {
        healthy,
        attention,
        emptyActive,
        overallCompleteness: perSubject.filter((x) => x.status === "active").length
          ? Math.round(overall / perSubject.filter((x) => x.status === "active").length)
          : 0,
        status: emptyActive > 0 ? "critical" : attention > 0 ? "attention" : "healthy",
      },
      perSubject,
      gaps,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
