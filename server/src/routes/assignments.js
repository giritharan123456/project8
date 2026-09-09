const express = require("express");
const crypto = require("crypto");
const pool = require("../config/db");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

// GET /api/assignments - List assignments (filtered by teacher or student)
router.get("/", requireAuth, async (req, res, next) => {
  try {
    const { subject, status, page = 1, limit = 20 } = req.query;
    const offset = (Math.max(1, Number(page)) - 1) * Number(limit);
    const where = [];
    const params = [];

    if (req.user.role === "STUDENT") {
      // Students see assignments for their section, or their board+grade when
      // an assignment isn't pinned to a specific section.
      const [[me]] = await pool.query(
        "SELECT section_id, current_grade, current_board FROM players WHERE id = ?",
        [req.user.id]
      );
      if (me) {
        where.push(`(a.section_id = ? OR (a.section_id IS NULL AND a.board_code = ? AND a.class_id = CAST(? AS UNSIGNED)))`);
        params.push(me.section_id || null, me.current_board, me.current_grade);
      } else {
        where.push("1 = 0");
      }
    } else if (req.user.role === "TEACHER") {
      where.push("a.teacher_id = ?");
      params.push(req.user.id);
    }
    // ADMIN sees all

    if (subject) { where.push("a.quiz_id IN (SELECT id FROM quizzes WHERE subject_code = ?)"); params.push(subject); }
    if (status) { where.push("a.status = ?"); params.push(status); } else { where.push("a.status = 'published'"); }

    const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const [rows] = await pool.query(
      `SELECT a.*, p.name AS creator_name,
              (SELECT COUNT(*) FROM quiz_attempts qa WHERE qa.quiz_id = a.quiz_id) AS submission_count,
              (SELECT title FROM quizzes q WHERE q.id = a.quiz_id) AS quiz_title
       FROM assignments a
       LEFT JOIN players p ON p.id = a.teacher_id
       ${whereClause}
       ORDER BY a.due_date ASC
       LIMIT ? OFFSET ?`,
      [...params, Number(limit), offset]
    );

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total FROM assignments a ${whereClause}`,
      params
    );

    res.json({ assignments: rows, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    next(err);
  }
});

// POST /api/assignments - Create assignment (requireRole ADMIN/TEACHER)
router.post("/", requireAuth, requireRole("ADMIN", "TEACHER"), async (req, res, next) => {
  try {
    const {
      title, description, quizId,
      targetGrade, targetBoard, targetSection,
      dueDate, maxAttempts, timeLimitMinutes, status,
    } = req.body || {};

    if (!title || !quizId) return res.status(400).json({ message: "title and quizId are required." });

    const assignmentId = `asg-${Date.now().toString(36)}-${crypto.randomBytes(3).toString("hex")}`;
    await pool.query(
      `INSERT INTO assignments
       (id, title, instructions, quiz_id, teacher_id, class_id, board_code, section_id,
        start_date, due_date, max_attempts, time_limit_minutes, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?)`,
      [
        assignmentId,
        title,
        description || "",
        quizId,
        req.user.id,
        targetGrade || null,
        targetBoard || null,
        targetSection ? Number(targetSection) || null : null,
        dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        maxAttempts || 3,
        timeLimitMinutes || null,
        status || "published",
      ]
    );

    res.status(201).json({ id: assignmentId, title, message: "Assignment created." });
  } catch (err) {
    next(err);
  }
});

// GET /api/assignments/:id - Get assignment details
router.get("/:id", requireAuth, async (req, res, next) => {
  try {
    const [assignments] = await pool.query(
      `SELECT a.*, p.name AS creator_name,
              (SELECT title FROM quizzes q WHERE q.id = a.quiz_id) AS quiz_title
       FROM assignments a
       LEFT JOIN players p ON p.id = a.teacher_id
       WHERE a.id = ?`,
      [req.params.id]
    );
    if (!assignments.length) return res.status(404).json({ message: "Assignment not found." });

    // If student, check they have access
    if (req.user.role === "STUDENT") {
      const a = assignments[0];
      const [[me]] = await pool.query(
        "SELECT section_id FROM players WHERE id = ?",
        [req.user.id]
      );
      if (a.section_id && me && a.section_id !== me.section_id) {
        return res.status(403).json({ message: "You don't have access to this assignment." });
      }
      if (!a.section_id && me) {
        const [[ok]] = await pool.query(
          "SELECT 1 AS ok FROM players WHERE id = ? AND current_board = ? AND CAST(current_grade AS UNSIGNED) = ?",
          [req.user.id, a.board_code, a.class_id]
        );
        if (!ok) return res.status(403).json({ message: "You don't have access to this assignment." });
      }
    }

    const [[{ mySubmissions }]] = await pool.query(
      `SELECT COUNT(*) AS mySubmissions
       FROM quiz_attempts
       WHERE quiz_id = ? AND player_id = ?`,
      [assignments[0].quiz_id, req.user.id]
    );

    res.json({ assignment: assignments[0], mySubmissions });
  } catch (err) {
    next(err);
  }
});

// PUT /api/assignments/:id - Update assignment
router.put("/:id", requireAuth, requireRole("ADMIN", "TEACHER"), async (req, res, next) => {
  try {
    const [existing] = await pool.query("SELECT * FROM assignments WHERE id = ?", [req.params.id]);
    if (!existing.length) return res.status(404).json({ message: "Assignment not found." });
    if (existing[0].teacher_id !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "You can only edit your own assignments." });
    }

    const {
      title, description, quizId,
      targetGrade, targetBoard, targetSection,
      dueDate, maxAttempts, timeLimitMinutes, status,
    } = req.body || {};

    await pool.query(
      `UPDATE assignments SET
       title = COALESCE(?, title), instructions = COALESCE(?, instructions),
       quiz_id = COALESCE(?, quiz_id), class_id = COALESCE(?, class_id),
       board_code = COALESCE(?, board_code), section_id = COALESCE(?, section_id),
       due_date = COALESCE(?, due_date), max_attempts = COALESCE(?, max_attempts),
       time_limit_minutes = COALESCE(?, time_limit_minutes), status = COALESCE(?, status)
       WHERE id = ?`,
      [title, description, quizId, targetGrade, targetBoard, targetSection,
        dueDate, maxAttempts, timeLimitMinutes, status, req.params.id]
    );

    res.json({ ok: true, message: "Assignment updated." });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/assignments/:id - Delete assignment
router.delete("/:id", requireAuth, requireRole("ADMIN", "TEACHER"), async (req, res, next) => {
  try {
    const [existing] = await pool.query("SELECT * FROM assignments WHERE id = ?", [req.params.id]);
    if (!existing.length) return res.status(404).json({ message: "Assignment not found." });
    if (existing[0].teacher_id !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "You can only delete your own assignments." });
    }

    await pool.query("DELETE FROM assignments WHERE id = ?", [req.params.id]);
    res.json({ ok: true, message: "Assignment deleted." });
  } catch (err) {
    next(err);
  }
});

// GET /api/assignments/:id/submissions - Get student submissions (quiz attempts on the assigned quiz)
router.get("/:id/submissions", requireAuth, requireRole("ADMIN", "TEACHER"), async (req, res, next) => {
  try {
    const [existing] = await pool.query("SELECT * FROM assignments WHERE id = ?", [req.params.id]);
    if (!existing.length) return res.status(404).json({ message: "Assignment not found." });

    const [rows] = await pool.query(
      `SELECT qa.id AS id, qa.accuracy, qa.correct_count, qa.total_questions, qa.completed_at AS submitted_at,
              p.name AS player_name, p.email AS player_email
       FROM quiz_attempts qa
       LEFT JOIN players p ON p.id = qa.player_id
       WHERE qa.quiz_id = ? AND qa.status = 'completed'
       ORDER BY qa.completed_at DESC`,
      [existing[0].quiz_id]
    );

    res.json({ submissions: rows });
  } catch (err) {
    next(err);
  }
});

module.exports = router;