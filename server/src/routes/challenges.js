const express = require("express");
const pool = require("../config/db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

const CHALLENGE_SELECT = `SELECT c.id, c.title, c.description, c.subject_code, c.challenge_type AS type,
                                 c.target_count AS target_value, c.xp_reward, c.coins_reward,
                                 c.start_date, c.end_date AS expires_at, c.status`;

// GET /api/challenges/progress - Get player's challenge progress (must be before /:id)
router.get("/progress", requireAuth, async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.id, c.title, c.description, c.challenge_type AS type,
              c.target_count AS target_value, c.xp_reward, c.coins_reward, c.end_date AS expires_at,
              pc.id AS player_challenge_id,
              COALESCE(pc.progress, 0) AS current_value,
              COALESCE(pc.completed, 0) AS completed,
              COALESCE(pc.claimed, 0) AS claimed,
              pc.completed_at
       FROM challenges c
       LEFT JOIN player_challenges pc ON pc.challenge_id = c.id AND pc.player_id = ?
       WHERE c.status = 'active'
       ORDER BY c.created_at`,
      [req.user.id]
    );
    res.json({
      challenges: rows.map((r) => ({
        id: r.id,
        title: r.title,
        description: r.description,
        type: r.type,
        progress: r.current_value,
        target: r.target_value,
        currentValue: r.current_value,
        targetValue: r.target_value,
        xpReward: r.xp_reward,
        coinReward: r.coins_reward,
        expiresAt: r.expires_at,
        completed: Boolean(r.completed),
        claimed: Boolean(r.claimed),
        completedAt: r.completed_at,
      })),
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/challenges - List active challenges
router.get("/", requireAuth, async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, title, description, challenge_type AS type, target_count AS target_value,
              xp_reward, coins_reward, start_date, end_date AS expires_at, status
       FROM challenges
       WHERE status = 'active'
       ORDER BY created_at`
    );
    res.json({
      challenges: rows.map((r) => ({
        id: r.id,
        title: r.title,
        description: r.description,
        type: r.type,
        target: r.target_value,
        targetValue: r.target_value,
        xpReward: r.xp_reward,
        coinReward: r.coins_reward,
        expiresAt: r.expires_at,
        completed: false,
        claimed: false,
        progress: 0,
      })),
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/challenges/:id/claim - Claim challenge reward
router.post("/:id/claim", requireAuth, async (req, res, next) => {
  try {
    const [challenges] = await pool.query(
      "SELECT * FROM challenges WHERE id = ? AND status = 'active'",
      [req.params.id]
    );
    if (!challenges.length) return res.status(404).json({ message: "Challenge not found or inactive." });

    const [progress] = await pool.query(
      "SELECT * FROM player_challenges WHERE challenge_id = ? AND player_id = ?",
      [req.params.id, req.user.id]
    );
    if (!progress.length) return res.status(400).json({ message: "You haven't started this challenge." });

    const p = progress[0];
    if (p.claimed) return res.status(400).json({ message: "Reward already claimed." });
    if (!p.completed || p.progress < challenges[0].target_count) {
      return res.status(400).json({ message: "Challenge not yet completed." });
    }

    // Mark claimed
    await pool.query(
      "UPDATE player_challenges SET claimed = 1 WHERE id = ?",
      [p.id]
    );

    // Award XP and coins
    const xp = challenges[0].xp_reward || 0;
    const coins = challenges[0].coins_reward || 0;
    if (xp > 0 || coins > 0) {
      await pool.query(
        "UPDATE players SET xp = xp + ?, coins = coins + ?, total_xp_earned = total_xp_earned + ? WHERE id = ?",
        [xp, coins, xp, req.user.id]
      );
    }

    res.json({ ok: true, xpEarned: xp, coinsEarned: coins });
  } catch (err) {
    next(err);
  }
});

module.exports = router;