const express = require("express");
const { getLeaderboardData } = require("../lib/gameLogic");

const router = express.Router();

// GET /api/leaderboard?scope=&period=&board=&class= - Section 27's ranked
// list. "Others" are deterministic seeded rows (same trick content.js used)
// so switching filters gives stable, visibly different rankings without a
// full multi-player backend; "You" is ranked using this player's real xp/stars.
router.get("/", async (req, res, next) => {
  try {
    const { scope = "global", period = "weekly", board, class: grade, subject } = req.query;
    const data = await getLeaderboardData(req.playerId, scope, period, grade, board, subject);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
