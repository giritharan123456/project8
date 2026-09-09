const express = require("express");
const pool = require("../config/db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

const MASTERY_COLS = `SELECT m.id, m.subject_code, m.unit_id, m.chapter_id, m.concept_id,
                             c.name AS concept_name, m.correct_count,
                             m.total_attempts AS total_count, m.accuracy, m.mastery_level,
                             m.last_attempted_at AS last_practiced_at
                      FROM mastery m
                      LEFT JOIN concepts c ON c.id = m.concept_id`;

// GET /api/mastery - Get current player's mastery (all subjects)
router.get("/", requireAuth, async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `${MASTERY_COLS} WHERE m.player_id = ? ORDER BY m.subject_code, m.accuracy DESC`,
      [req.user.id]
    );
    const [[summary]] = await pool.query(
      `SELECT COUNT(*) AS totalConcepts,
              SUM(CASE WHEN accuracy >= 80 THEN 1 ELSE 0 END) AS masteredCount,
              SUM(CASE WHEN accuracy < 60 AND total_attempts > 0 THEN 1 ELSE 0 END) AS weakCount,
              ROUND(AVG(CASE WHEN total_attempts > 0 THEN accuracy END), 1) AS avgAccuracy
       FROM mastery WHERE player_id = ?`,
      [req.user.id]
    );
    res.json({ mastery: rows, summary });
  } catch (err) {
    next(err);
  }
});

// GET /api/mastery/weak - Get weak concepts (accuracy < 60%)
router.get("/weak", requireAuth, async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `${MASTERY_COLS} WHERE m.player_id = ? AND m.total_attempts > 0 AND m.accuracy < 60 ORDER BY m.accuracy ASC`,
      [req.user.id]
    );
    res.json({ weakConcepts: rows });
  } catch (err) {
    next(err);
  }
});

// GET /api/mastery/mastered - Get mastered concepts (accuracy >= 80%)
router.get("/mastered", requireAuth, async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `${MASTERY_COLS} WHERE m.player_id = ? AND m.total_attempts > 0 AND m.accuracy >= 80 ORDER BY m.accuracy DESC`,
      [req.user.id]
    );
    res.json({ masteredConcepts: rows });
  } catch (err) {
    next(err);
  }
});

// GET /api/mastery/:subjectCode - Get mastery for a subject
router.get("/:subjectCode", requireAuth, async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `${MASTERY_COLS} WHERE m.player_id = ? AND m.subject_code = ? ORDER BY m.accuracy DESC`,
      [req.user.id, req.params.subjectCode]
    );

    const [[summary]] = await pool.query(
      `SELECT COUNT(*) AS totalConcepts,
              SUM(CASE WHEN accuracy >= 80 THEN 1 ELSE 0 END) AS masteredCount,
              SUM(CASE WHEN accuracy < 60 AND total_attempts > 0 THEN 1 ELSE 0 END) AS weakCount,
              ROUND(AVG(CASE WHEN total_attempts > 0 THEN accuracy END), 1) AS avgAccuracy
       FROM mastery WHERE player_id = ? AND subject_code = ?`,
      [req.user.id, req.params.subjectCode]
    );

    res.json({ subjectCode: req.params.subjectCode, summary, concepts: rows });
  } catch (err) {
    next(err);
  }
});

// POST /api/mastery/update - Update mastery after quiz
router.post("/update", requireAuth, async (req, res, next) => {
  try {
    const { subjectCode, conceptId, conceptName, correct, totalAttempts } = req.body || {};
    if (!subjectCode || !conceptId || correct === undefined || totalAttempts === undefined) {
      return res.status(400).json({ message: "subjectCode, conceptId, correct, and totalAttempts are required." });
    }

    const correctCount = correct ? 1 : 0;

    const [existing] = await pool.query(
      "SELECT * FROM mastery WHERE player_id = ? AND subject_code = ? AND concept_id = ?",
      [req.user.id, subjectCode, conceptId]
    );

    if (existing.length) {
      const prev = existing[0];
      const newTotal = prev.total_attempts + totalAttempts;
      const newCorrect = prev.correct_count + correctCount;
      const newAccuracy = newTotal > 0 ? Math.round((newCorrect / newTotal) * 100) : 0;
      const newLevel = newAccuracy >= 80 ? "mastered" : newAccuracy >= 60 ? "strong" : "practicing";

      await pool.query(
        `UPDATE mastery SET correct_count = ?, total_attempts = ?, accuracy = ?,
         mastery_level = ?, last_attempted_at = NOW()
         WHERE id = ?`,
        [newCorrect, newTotal, newAccuracy, newLevel, prev.id]
      );

      res.json({ id: prev.id, accuracy: newAccuracy, total: newTotal, masteryLevel: newLevel });
    } else {
      const accuracy = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 0;
      const level = accuracy >= 80 ? "mastered" : accuracy >= 60 ? "strong" : "practicing";
      const [result] = await pool.query(
        `INSERT INTO mastery (player_id, subject_code, concept_id, correct_count, total_attempts, accuracy, mastery_level, last_attempted_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
        [req.user.id, subjectCode, conceptId, correctCount, totalAttempts, accuracy, level]
      );
      res.status(201).json({ id: result.insertId, accuracy, total: totalAttempts, masteryLevel: level });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;