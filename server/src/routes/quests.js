const express = require("express");
const pool = require("../config/db");

const router = express.Router();

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

// GET /api/quests - Section 26's daily quest list with today's claimed state.
router.get("/", async (req, res, next) => {
  try {
    const [defs] = await pool.query("SELECT * FROM daily_quest_defs ORDER BY sort_order ASC");
    const [claims] = await pool.query(
      "SELECT quest_id FROM quest_claims WHERE player_id = ? AND date_key = ?",
      [req.playerId, todayKey()]
    );
    const claimedIds = new Set(claims.map((c) => c.quest_id));

    // Section 26 quests track live progress (lessons completed today,
    // questions answered today, etc) which isn't wired up as its own event
    // stream yet - same placeholder the mock used (progress mirrors target
    // once claimed, 0 otherwise) until per-action progress tracking exists.
    res.json(
      defs.map((q) => ({
        id: q.id,
        title: q.title,
        progress: claimedIds.has(q.id) ? q.target : 0,
        target: q.target,
        xp: q.xp,
        coins: q.coins,
        claimed: claimedIds.has(q.id),
      }))
    );
  } catch (err) {
    next(err);
  }
});

// POST /api/quests/:questId/claim - claims one quest for today, adding its
// XP/coins exactly once per calendar day (mirrors playerStore.claimDailyQuest).
router.post("/:questId/claim", async (req, res, next) => {
  const conn = await pool.getConnection();
  try {
    const { questId } = req.params;
    const [[quest]] = await conn.query("SELECT * FROM daily_quest_defs WHERE id = ?", [questId]);
    if (!quest) return res.status(404).json({ message: `Unknown quest "${questId}"` });

    const dateKey = todayKey();
    await conn.beginTransaction();

    const [existing] = await conn.query(
      "SELECT 1 FROM quest_claims WHERE player_id = ? AND quest_id = ? AND date_key = ? FOR UPDATE",
      [req.playerId, questId, dateKey]
    );
    if (existing.length > 0) {
      await conn.commit();
      return res.json({ ok: false });
    }

    await conn.query(
      "INSERT INTO quest_claims (player_id, quest_id, date_key) VALUES (?,?,?)",
      [req.playerId, questId, dateKey]
    );
    await conn.query(
      "UPDATE players SET coins = coins + ?, xp = xp + ?, total_xp_earned = total_xp_earned + ? WHERE id = ?",
      [quest.coins, quest.xp, quest.xp, req.playerId]
    );

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
