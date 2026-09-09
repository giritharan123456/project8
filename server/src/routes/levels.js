const express = require("express");
const { getDifficultyProgressLive } = require("../lib/gameLogic");

const router = express.Router();

// GET /api/levels?lesson=&course=&board=&class= - Section 13's difficulty
// tiers + unlock state for one lesson.
router.get("/", async (req, res, next) => {
  try {
    const { lesson: lessonId, course: worldId, board, class: grade, subject } = req.query;
    if (!worldId || !lessonId) {
      return res.status(400).json({ message: "course (worldId) and lesson (lessonId) are required" });
    }

    const data = await getDifficultyProgressLive(req.playerId, grade, board, worldId, lessonId, subject);
    if (!data) return res.status(404).json({ message: `Unknown lesson "${lessonId}" in course "${worldId}"` });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
