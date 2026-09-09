const express = require("express");
const { getWorldMapLive } = require("../lib/gameLogic");

const router = express.Router();

// GET /api/courses?board=&class=&subject= - Section 10's World map for a
// given Subject + Class + Board, with the requesting player's real progress
// overlaid. subject defaults to "chemistry" when omitted (see
// gameLogic.DEFAULT_SUBJECT), so existing callers keep working unchanged.
router.get("/", async (req, res, next) => {
  try {
    const { board, class: grade, subject } = req.query;
    const data = await getWorldMapLive(req.playerId, grade, board, subject);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
