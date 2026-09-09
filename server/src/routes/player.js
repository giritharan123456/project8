const express = require("express");
const pool = require("../config/db");
const { getDashboardDataLive, normGrade, normBoard, normSubject } = require("../lib/gameLogic");

const router = express.Router();

// --- Input validation helpers ---
const MAX_WORLD_ID_LEN = 64;
const MAX_LESSON_ID_LEN = 64;
const MAX_DIFFICULTY_ID_LEN = 64;

function validateNumericField(value, fieldName, res) {
  if (value !== undefined && value !== null && value !== "") {
    const num = Number(value);
    if (isNaN(num) || num < 0 || num > 1000000) {
      res.status(400).json({ message: `Invalid value for ${fieldName}.` });
      return null;
    }
    return num;
  }
  return 0;
}

// GET /api/player - Section 23/24's player HUD + profile basics.
// SECURITY: Only returns the requesting player's own data (keyed by
// req.playerId from the session cookie — the client cannot override this).
router.get("/", async (req, res, next) => {
  try {
    const { class: grade, board, subject } = req.query;
    const [rows] = await pool.query("SELECT * FROM players WHERE id = ?", [req.playerId]);
    const player = rows[0];
    if (!player) return res.status(404).json({ message: "Player not found" });

    res.json({
      name: player.name,
      level: player.level,
      xp: player.xp,
      // xpToNext isn't tracked as its own stat yet (Section 23 placeholder,
      // same as the mock) - a simple level*100 curve until a real leveling
      // design exists.
      xpToNext: player.level * 100,
      coins: player.coins,
      streak: player.streak,
      grade: grade ?? player.current_grade,
      board: board ?? player.current_board,
      subject: subject ?? player.current_subject,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/player/progress?board=&class= - Section 28's per-Class+Board
// progress, plus the Dashboard's full derived data.
// SECURITY: Only returns the requesting player's own data.
router.get("/progress", async (req, res, next) => {
  try {
    const { board, class: grade, subject } = req.query;
    const data = await getDashboardDataLive(req.playerId, grade, board, subject);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// POST /api/player/progress - records a completed lesson/battle result
// (Section 17-19) and, for a boss clear, the boss-defeat flag (Section 21).
//
// SECURITY: Always operates on req.playerId (server-set from session),
// never trusts a client-supplied playerId.
//
// Body: { grade, board, worldId, lessonId, difficultyId, xp, coins, accuracy, stars, isBoss }
router.post("/progress", async (req, res, next) => {
  const conn = await pool.getConnection();
  try {
    const { grade, board, subject, worldId, lessonId, difficultyId, xp, coins, accuracy, stars, isBoss } = req.body || {};

    // --- Input validation ---
    if (!worldId || typeof worldId !== "string" || worldId.length > MAX_WORLD_ID_LEN) {
      return res.status(400).json({ message: "A valid worldId is required." });
    }
    if (lessonId && (typeof lessonId !== "string" || lessonId.length > MAX_LESSON_ID_LEN)) {
      return res.status(400).json({ message: "Invalid lessonId." });
    }
    if (difficultyId && (typeof difficultyId !== "string" || difficultyId.length > MAX_DIFFICULTY_ID_LEN)) {
      return res.status(400).json({ message: "Invalid difficultyId." });
    }

    const xpNum = validateNumericField(xp, "xp", res);
    if (xpNum === null) return;
    const coinsNum = validateNumericField(coins, "coins", res);
    if (coinsNum === null) return;
    const accuracyNum = validateNumericField(accuracy, "accuracy", res);
    if (accuracyNum === null) return;
    const starsNum = validateNumericField(stars, "stars", res);
    if (starsNum === null) return;

    const g = normGrade(grade);
    const b = normBoard(board);
    const s = normSubject(subject);

    await conn.beginTransaction();

    // Verify the player exists and lock the row
    const [[player]] = await conn.query("SELECT streak, last_played_date, coins, xp, total_xp_earned FROM players WHERE id = ? FOR UPDATE", [req.playerId]);
    if (!player) {
      await conn.rollback();
      return res.status(404).json({ message: "Player not found." });
    }

    // Also touch today's daily streak, same trigger point as the frontend's
    // touchDailyStreak() (called on Dashboard mount) - a completed
    // battle/boss is at least as good a signal that the player "showed up".
    const todayKey = new Date().toISOString().slice(0, 10);
    let newStreak = player.streak;
    const lastPlayed = player.last_played_date ? new Date(player.last_played_date).toISOString().slice(0, 10) : null;
    if (lastPlayed !== todayKey) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      newStreak = lastPlayed === yesterday ? player.streak + 1 : 1;
    }

    await conn.query(
      "UPDATE players SET coins = coins + ?, xp = xp + ?, total_xp_earned = total_xp_earned + ?, streak = ?, last_played_date = ?, current_grade = ?, current_board = ?, current_subject = ? WHERE id = ?",
      [coinsNum, xpNum, xpNum, newStreak, todayKey, g, b, s, req.playerId]
    );

    if (isBoss) {
      await conn.query(
        "INSERT IGNORE INTO player_boss_defeats (player_id, grade, board, world_id) VALUES (?,?,?,?)",
        [req.playerId, g, b, worldId]
      );
    } else if (lessonId && difficultyId) {
      // Best-accuracy-wins, same rule as playerStore.recordLessonCompletion.
      await conn.query(
        `INSERT INTO player_completions (player_id, grade, board, world_id, lesson_id, difficulty_id, accuracy, stars, xp, coins)
         VALUES (?,?,?,?,?,?,?,?,?,?)
         ON DUPLICATE KEY UPDATE
           accuracy = IF(VALUES(accuracy) >= accuracy, VALUES(accuracy), accuracy),
           stars = IF(VALUES(accuracy) >= accuracy, VALUES(stars), stars),
           xp = IF(VALUES(accuracy) >= accuracy, VALUES(xp), xp),
           coins = IF(VALUES(accuracy) >= accuracy, VALUES(coins), coins),
           completed_at = IF(VALUES(accuracy) >= accuracy, CURRENT_TIMESTAMP, completed_at)`,
        [req.playerId, g, b, worldId, lessonId, difficultyId, accuracyNum, starsNum, xpNum, coinsNum]
      );
    }

    await conn.commit();
    res.json({ ok: true });
  } catch (err) {
    await conn.rollback();
    next(err);
  } finally {
    conn.release();
  }
});

module.exports = router;
