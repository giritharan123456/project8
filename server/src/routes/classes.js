const express = require("express");
const pool = require("../config/db");

const router = express.Router();

// GET /api/classes - Section 6's class cards.
router.get("/", async (req, res, next) => {
  try {
    const [rows] = await pool.query("SELECT * FROM classes ORDER BY grade ASC");
    res.json(
      rows.map((c) => ({
        grade: c.grade,
        icon: c.icon,
        courses: c.courses,
        lessons: c.lessons,
        questions: c.questions,
        difficulty: c.difficulty_label,
      }))
    );
  } catch (err) {
    next(err);
  }
});

module.exports = router;
