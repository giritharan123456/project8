const express = require("express");
const { getBattleData, getBossBattleData } = require("../lib/gameLogic");

const router = express.Router();

// GET /api/questions?lesson=&difficulty=&course=&board=&class=  (Section 15/16)
// GET /api/questions?boss=1&course=&board=&class=                (Section 21)
router.get("/", async (req, res, next) => {
  try {
    const { lesson: lessonId, difficulty: difficultyId, course: worldId, board, class: grade, boss, subject } = req.query;
    if (!worldId) return res.status(400).json({ message: "course (worldId) is required" });

    if (boss === "1" || boss === "true") {
      const data = await getBossBattleData(req.playerId, grade, board, worldId, subject);
      if (!data) return res.status(404).json({ message: `No boss battle available for "${worldId}"` });
      return res.json(data);
    }

    if (!lessonId || !difficultyId) {
      return res.status(400).json({ message: "lesson and difficulty are required for a non-boss battle" });
    }

    const data = await getBattleData(req.playerId, grade, board, worldId, lessonId, difficultyId, subject);
    if (!data) return res.status(404).json({ message: "No questions available for that lesson/difficulty" });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
