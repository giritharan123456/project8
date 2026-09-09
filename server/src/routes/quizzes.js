const express = require("express");
const crypto = require("crypto");
const pool = require("../config/db");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

function parseJson(v, fallback) {
  if (v == null) return fallback;
  try { return JSON.parse(v); } catch { return v || fallback; }
}

function mapQuestion(q) {
  return {
    id: q.id,
    text: q.question_text,
    type: q.type,
    options: parseJson(q.options_json, []),
    pairs: parseJson(q.pairs_json, null),
    image: q.image || null,
    correctAnswer: q.correct_answer,
    explanation: q.explanation,
    sortOrder: q.sort_order,
    marks: q.marks,
  };
}

// GET /api/quizzes - List quizzes (with filters: subject, difficulty, status)
router.get("/", requireAuth, async (req, res, next) => {
  try {
    const { subject, difficulty, status, page = 1, limit = 20 } = req.query;
    const offset = (Math.max(1, Number(page)) - 1) * Number(limit);
    const where = [];
    const params = [];

    if (subject) { where.push("q.subject_code = ?"); params.push(subject); }
    if (difficulty) { where.push("q.difficulty = ?"); params.push(difficulty); }
    if (status) { where.push("q.visibility = ?"); params.push(status); } else { where.push("q.visibility IN ('published', 'public')"); }

    const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const [rows] = await pool.query(
      `SELECT q.id, q.title, q.description, q.subject_code, q.difficulty, q.visibility AS status,
              q.created_by, q.time_limit_minutes, q.question_count AS total_questions, q.created_at,
              p.name AS creator_name
       FROM quizzes q
       LEFT JOIN players p ON p.id = q.created_by
       ${whereClause}
       ORDER BY q.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, Number(limit), offset]
    );

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total FROM quizzes q ${whereClause}`,
      params
    );

    res.json({ quizzes: rows, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    next(err);
  }
});

// GET /api/quizzes/:id - Get quiz with questions
router.get("/:id", requireAuth, async (req, res, next) => {
  try {
    const [quizzes] = await pool.query("SELECT * FROM quizzes WHERE id = ?", [req.params.id]);
    if (!quizzes.length) return res.status(404).json({ message: "Quiz not found." });

    const [questions] = await pool.query(
      `SELECT qq.id, qq.marks, qq.sort_order,
              qs.id AS question_id, qs.question_text, qs.type, qs.options_json, qs.pairs_json,
              qs.image, qs.correct_answer, qs.explanation, qs.sort_order AS q_sort_order
       FROM quiz_questions qq
       JOIN questions qs ON qs.id = qq.question_id
       WHERE qq.quiz_id = ?
       ORDER BY qq.sort_order`,
      [req.params.id]
    );

    res.json({ ...quizzes[0], questions: questions.map(mapQuestion) });
  } catch (err) {
    next(err);
  }
});

// POST /api/quizzes - Create quiz (requireRole ADMIN/TEACHER)
router.post("/", requireAuth, requireRole("ADMIN", "TEACHER"), async (req, res, next) => {
  try {
    const { title, description, subjectCode, difficultyId, timeLimitMinutes, questions: rawQuestions, status, questionIds } = req.body || {};
    if (!title || !subjectCode) return res.status(400).json({ message: "title and subjectCode are required." });

    const quizId = `qz-${Date.now().toString(36)}-${crypto.randomBytes(3).toString("hex")}`;
    await pool.query(
      `INSERT INTO quizzes (id, title, description, subject_code, difficulty, time_limit_minutes, question_count, created_by, visibility)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        quizId,
        title,
        description || "",
        subjectCode,
        difficultyId || "medium",
        timeLimitMinutes || null,
        Array.isArray(rawQuestions) ? rawQuestions.length : Array.isArray(questionIds) ? questionIds.length : 0,
        req.user.id,
        status || "published",
      ]
    );

    if (Array.isArray(questionIds) && questionIds.length) {
      const values = questionIds.map((qid, i) => [quizId, qid, i, 1]);
      await pool.query(
        "INSERT INTO quiz_questions (quiz_id, question_id, sort_order, marks) VALUES ?",
        [values]
      );
    }

    res.status(201).json({ id: quizId, title, subjectCode, message: "Quiz created." });
  } catch (err) {
    next(err);
  }
});

// PUT /api/quizzes/:id - Update quiz
router.put("/:id", requireAuth, requireRole("ADMIN", "TEACHER"), async (req, res, next) => {
  try {
    const [existing] = await pool.query("SELECT * FROM quizzes WHERE id = ?", [req.params.id]);
    if (!existing.length) return res.status(404).json({ message: "Quiz not found." });
    if (existing[0].created_by !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "You can only edit your own quizzes." });
    }

    const { title, description, subjectCode, difficultyId, timeLimitMinutes, status } = req.body || {};
    await pool.query(
      `UPDATE quizzes SET title = COALESCE(?, title), description = COALESCE(?, description),
       subject_code = COALESCE(?, subject_code), difficulty = COALESCE(?, difficulty),
       time_limit_minutes = COALESCE(?, time_limit_minutes), visibility = COALESCE(?, visibility)
       WHERE id = ?`,
      [title, description, subjectCode, difficultyId, timeLimitMinutes, status, req.params.id]
    );

    res.json({ ok: true, message: "Quiz updated." });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/quizzes/:id - Delete quiz
router.delete("/:id", requireAuth, requireRole("ADMIN", "TEACHER"), async (req, res, next) => {
  try {
    const [existing] = await pool.query("SELECT * FROM quizzes WHERE id = ?", [req.params.id]);
    if (!existing.length) return res.status(404).json({ message: "Quiz not found." });
    if (existing[0].created_by !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "You can only delete your own quizzes." });
    }

    await pool.query("DELETE FROM quizzes WHERE id = ?", [req.params.id]);
    res.json({ ok: true, message: "Quiz deleted." });
  } catch (err) {
    next(err);
  }
});

// POST /api/quizzes/:id/start - Start attempt (creates quiz_attempts row)
router.post("/:id/start", requireAuth, async (req, res, next) => {
  try {
    const [quizzes] = await pool.query("SELECT * FROM quizzes WHERE id = ? AND visibility IN ('published','public')", [req.params.id]);
    if (!quizzes.length) return res.status(404).json({ message: "Quiz not found or not published." });

    const [questions] = await pool.query(
      `SELECT qs.id AS question_id, qs.question_text, qs.type, qs.options_json, qq.sort_order
       FROM quiz_questions qq JOIN questions qs ON qs.id = qq.question_id
       WHERE qq.quiz_id = ? ORDER BY qq.sort_order`,
      [req.params.id]
    );
    if (!questions.length) return res.status(400).json({ message: "Quiz has no questions." });

    const attemptId = `qa-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`;
    await pool.query(
      `INSERT INTO quiz_attempts (id, quiz_id, player_id, total_questions, started_at, status)
       VALUES (?, ?, ?, ?, NOW(), 'in_progress')`,
      [attemptId, req.params.id, req.user.id, questions.length]
    );

    res.status(201).json({
      attemptId,
      quizId: req.params.id,
      totalQuestions: questions.length,
      questions: questions.map((q) => ({
        id: q.question_id,
        questionText: q.question_text,
        type: q.type,
        optionsJson: q.options_json,
        sortOrder: q.sort_order,
      })),
      status: "in_progress",
      startedAt: new Date(),
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/quizzes/attempts/:attemptId/submit - Submit answer to a question
router.post("/attempts/:attemptId/submit", requireAuth, async (req, res, next) => {
  try {
    const { questionId, selectedAnswer, timeTakenMs } = req.body || {};
    if (!questionId || selectedAnswer === undefined) {
      return res.status(400).json({ message: "questionId and selectedAnswer are required." });
    }

    const [attempts] = await pool.query(
      "SELECT * FROM quiz_attempts WHERE id = ? AND player_id = ? AND status = 'in_progress'",
      [req.params.attemptId, req.user.id]
    );
    if (!attempts.length) return res.status(404).json({ message: "Active attempt not found." });

    const quiz = attempts[0];
    const [questions] = await pool.query(
      `SELECT qs.* FROM quiz_questions qq JOIN questions qs ON qs.id = qq.question_id
       WHERE qq.quiz_id = ? AND qs.id = ?`,
      [quiz.quiz_id, questionId]
    );
    if (!questions.length) return res.status(404).json({ message: "Question not found in this quiz." });

    const correct = String(selectedAnswer).trim().toLowerCase() === String(questions[0].correct_answer).trim().toLowerCase();

    await pool.query(
      `INSERT INTO quiz_submissions (player_id, question_id, selected_answer, correct, time_taken_ms, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [req.user.id, questionId, selectedAnswer, correct ? 1 : 0, timeTakenMs || null]
    );

    const [[{ correctCount }]] = await pool.query(
      `SELECT COUNT(*) AS correctCount
       FROM quiz_submissions qs JOIN quiz_questions qq ON qq.question_id = qs.question_id
       WHERE qs.player_id = ? AND qq.quiz_id = ? AND qs.correct = 1`,
      [req.user.id, quiz.quiz_id]
    );
    const [[{ answeredCount }]] = await pool.query(
      `SELECT COUNT(*) AS answeredCount
       FROM quiz_submissions qs JOIN quiz_questions qq ON qq.question_id = qs.question_id
       WHERE qs.player_id = ? AND qq.quiz_id = ?`,
      [req.user.id, quiz.quiz_id]
    );

    res.json({
      correct,
      correctAnswer: questions[0].correct_answer,
      explanation: questions[0].explanation,
      correctCount,
      answeredCount,
      totalQuestions: quiz.total_questions,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/quizzes/attempts/:attemptId/complete - Complete the attempt, calculate score
router.post("/attempts/:attemptId/complete", requireAuth, async (req, res, next) => {
  try {
    const [attempts] = await pool.query(
      "SELECT * FROM quiz_attempts WHERE id = ? AND player_id = ? AND status = 'in_progress'",
      [req.params.attemptId, req.user.id]
    );
    if (!attempts.length) return res.status(404).json({ message: "Active attempt not found." });

    const attempt = attempts[0];
    const quizId = attempt.quiz_id;

    const [[{ correctCount }]] = await pool.query(
      `SELECT COUNT(*) AS correctCount
       FROM quiz_submissions qs JOIN quiz_questions qq ON qq.question_id = qs.question_id
       WHERE qs.player_id = ? AND qq.quiz_id = ? AND qs.correct = 1`,
      [req.user.id, quizId]
    );
    const [[{ answeredCount }]] = await pool.query(
      `SELECT COUNT(*) AS answeredCount
       FROM quiz_submissions qs JOIN quiz_questions qq ON qq.question_id = qs.question_id
       WHERE qs.player_id = ? AND qq.quiz_id = ?`,
      [req.user.id, quizId]
    );

    const total = attempt.total_questions;
    const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;

    // Look up difficulty XP/coins from the quiz's difficulty
    const [quizzes] = await pool.query("SELECT difficulty FROM quizzes WHERE id = ?", [quizId]);
    let xpEarned = 20;
    let coinsEarned = 10;
    if (quizzes.length) {
      const [diffs] = await pool.query("SELECT xp, coins FROM difficulties WHERE id = ?", [quizzes[0].difficulty]);
      if (diffs.length) { xpEarned = diffs[0].xp || 20; coinsEarned = diffs[0].coins || 10; }
    }

    if (accuracy >= 80) { xpEarned = Math.round(xpEarned * 1.5); coinsEarned = Math.round(coinsEarned * 1.5); }
    else if (accuracy >= 60) { xpEarned = Math.round(xpEarned * 1.2); coinsEarned = Math.round(coinsEarned * 1.2); }

    await pool.query(
      `UPDATE quiz_attempts SET status = 'completed', correct_count = ?, incorrect_count = ?,
       skipped_count = GREATEST(0, ? - ?), accuracy = ?, score = ?, xp_earned = ?,
       coins_earned = ?, completed_at = NOW() WHERE id = ?`,
      [correctCount, answeredCount - correctCount, total, answeredCount, accuracy, accuracy, xpEarned, coinsEarned, req.params.attemptId]
    );

    await pool.query(
      "UPDATE players SET xp = xp + ?, coins = coins + ?, total_xp_earned = total_xp_earned + ? WHERE id = ?",
      [xpEarned, coinsEarned, xpEarned, req.user.id]
    );

    res.json({
      attemptId: req.params.attemptId,
      status: "completed",
      correctCount,
      answeredCount,
      totalQuestions: total,
      accuracy,
      xpEarned,
      coinsEarned,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/quizzes/:id/attempts - List attempts for a quiz
router.get("/:id/attempts", requireAuth, async (req, res, next) => {
  try {
    const [quizzes] = await pool.query("SELECT * FROM quizzes WHERE id = ?", [req.params.id]);
    if (!quizzes.length) return res.status(404).json({ message: "Quiz not found." });

    // Teachers/admins see all; students see only their own
    const isPrivileged = req.user.role === "ADMIN" || req.user.role === "TEACHER";
    const whereClause = isPrivileged
      ? "WHERE qa.quiz_id = ?"
      : "WHERE qa.quiz_id = ? AND qa.player_id = ?";
    const params = isPrivileged
      ? [req.params.id]
      : [req.params.id, req.user.id];

    const [rows] = await pool.query(
      `SELECT qa.*, p.name AS player_name
       FROM quiz_attempts qa
       LEFT JOIN players p ON p.id = qa.player_id
       ${whereClause}
       ORDER BY qa.started_at DESC`,
      params
    );

    res.json({ attempts: rows });
  } catch (err) {
    next(err);
  }
});

// GET /api/quizzes/attempts/:attemptId - Get attempt details with answers
router.get("/attempts/:attemptId", requireAuth, async (req, res, next) => {
  try {
    const [attempts] = await pool.query(
      "SELECT * FROM quiz_attempts WHERE id = ? AND player_id = ?",
      [req.params.attemptId, req.user.id]
    );
    if (!attempts.length) return res.status(404).json({ message: "Attempt not found." });

    const [answers] = await pool.query(
      `SELECT qs.*, qq.question_id AS qid
       FROM quiz_submissions qs
       JOIN quiz_questions qq ON qq.question_id = qs.question_id
       WHERE qs.player_id = ? AND qq.quiz_id = ?
       ORDER BY qq.sort_order`,
      [req.user.id, attempts[0].quiz_id]
    );

    res.json({ attempt: attempts[0], answers });
  } catch (err) {
    next(err);
  }
});

module.exports = router;