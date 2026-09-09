const express = require("express");
const pool = require("../config/db");

const router = express.Router();

// POST /api/quiz/submit - generic per-question submission (finer-grained
// than POST /api/player/progress's whole-level batch) for future
// analytics/adaptive-difficulty use. Body: { questionId, selectedAnswer,
// correct, timeTakenMs }.
router.post("/submit", async (req, res, next) => {
  try {
    const { questionId, selectedAnswer, correct, timeTakenMs } = req.body || {};
    if (!questionId) return res.status(400).json({ message: "questionId is required" });

    await pool.query(
      "INSERT INTO quiz_submissions (player_id, question_id, selected_answer, correct, time_taken_ms) VALUES (?,?,?,?,?)",
      [req.playerId, questionId, selectedAnswer ?? null, correct ? 1 : 0, timeTakenMs ?? null]
    );

    res.json({ ok: true, questionId, correct: !!correct });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
