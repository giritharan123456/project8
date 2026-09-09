const express = require("express");
const pool = require("../config/db");
const { getAchievementsLive } = require("../lib/gameLogic");

const router = express.Router();

// GET /api/achievements - Section 25's achievement grid.
//
// endpoints.js's getAchievements() doesn't send grade/board today, so this
// defaults to the player's own last-used curriculum (current_grade/
// current_board on the players row), falling back to 9/CBSE for a brand
// new player. Optional ?class=&board= overrides let the frontend pass them
// explicitly once it's updated to do so.
router.get("/", async (req, res, next) => {
  try {
    let { class: grade, board, subject } = req.query;
    if (!grade || !board || !subject) {
      const [rows] = await pool.query("SELECT current_grade, current_board, current_subject FROM players WHERE id = ?", [req.playerId]);
      grade = grade || rows[0]?.current_grade;
      board = board || rows[0]?.current_board;
      subject = subject || rows[0]?.current_subject;
    }
    const data = await getAchievementsLive(req.playerId, grade, board, subject);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
