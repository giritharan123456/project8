const { v4: uuidv4 } = require("uuid");
const pool = require("../config/db");

const COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "cq_session";
const TTL_DAYS = Number(process.env.SESSION_TTL_DAYS || 365);

// No real auth yet (per the frontend README) - every request is tied to an
// anonymous player identified by a long-lived cookie. First request creates
// a `players` row and sets the cookie; every later request just re-attaches
// req.playerId. This is the same "shape" a real auth layer would slot into
// later (swap this middleware for one that reads a verified session/JWT and
// nothing downstream - routes/gameLogic - needs to change).
async function sessionMiddleware(req, res, next) {
  try {
    let playerId = req.cookies?.[COOKIE_NAME];

    if (playerId) {
      const [rows] = await pool.query("SELECT id FROM players WHERE id = ?", [playerId]);
      if (rows.length === 0) playerId = null; // stale/unknown cookie
    }

    if (!playerId) {
      playerId = uuidv4();
      await pool.query(
        "INSERT INTO players (id, name, level, coins, xp, total_xp_earned, streak) VALUES (?, 'Chemist', 12, 850, 850, 0, 0)",
        [playerId]
      );
      res.cookie(COOKIE_NAME, playerId, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: TTL_DAYS * 24 * 60 * 60 * 1000,
      });
    }

    req.playerId = playerId;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = sessionMiddleware;
