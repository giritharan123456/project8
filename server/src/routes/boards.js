const express = require("express");
const pool = require("../config/db");

const router = express.Router();

// GET /api/boards - Section 7's board categories, grouped.
router.get("/", async (req, res, next) => {
  try {
    const [categories] = await pool.query("SELECT * FROM board_categories ORDER BY sort_order ASC");
    const [boards] = await pool.query("SELECT * FROM boards ORDER BY sort_order ASC");

    const result = categories.map((cat) => ({
      category: cat.category,
      boards: boards
        .filter((b) => b.category_id === cat.id)
        .map((b) => ({
          code: b.code,
          name: b.name,
          type: b.type,
          description: b.description,
          courses: b.courses,
          lessons: b.lessons,
          icon: b.icon,
        })),
    }));

    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
