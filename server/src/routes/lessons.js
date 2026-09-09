const express = require("express");
const { getCourseDetailLive } = require("../lib/gameLogic");

const router = express.Router();

// GET /api/lessons?course=&board=&class= - Section 11's Course/Chapter
// screen for one world (courseId is the world id, e.g. "atom-valley").
router.get("/", async (req, res, next) => {
  try {
    const { course: worldId, board, class: grade, subject } = req.query;
    if (!worldId) return res.status(400).json({ message: "course (worldId) is required" });

    const data = await getCourseDetailLive(req.playerId, grade, board, worldId, subject);
    if (!data) return res.status(404).json({ message: `Unknown course "${worldId}"` });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
