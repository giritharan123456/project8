const express = require("express");
const pool = require("../config/db");

const router = express.Router();

// GET /api/shop - Section 33's shop grid plus this player's owned/equipped
// cosmetics and power-up charge counts. Not called by src/api/endpoints.js
// yet (the frontend's Shop page still only talks to the local playerStore),
// but included so shop state can move server-side without a schema change
// later - see chemquest-server/README.md.
router.get("/", async (req, res, next) => {
  try {
    const [items] = await pool.query("SELECT * FROM shop_items ORDER BY sort_order ASC");
    const [owned] = await pool.query("SELECT item_id FROM player_shop_items WHERE player_id = ?", [req.playerId]);
    const [equipped] = await pool.query("SELECT category, item_id FROM player_equipped WHERE player_id = ?", [req.playerId]);
    const [powerups] = await pool.query("SELECT item_id, count FROM player_powerups WHERE player_id = ?", [req.playerId]);

    const ownedIds = new Set(owned.map((o) => o.item_id));
    const equippedByCategory = Object.fromEntries(equipped.map((e) => [e.category, e.item_id]));
    const powerupCounts = Object.fromEntries(powerups.map((p) => [p.item_id, p.count]));

    res.json({
      items: items.map((i) => ({
        id: i.id,
        category: i.category,
        name: i.name,
        icon: i.icon,
        price: i.price,
        description: i.description,
        owned: i.category === "powerups" ? undefined : ownedIds.has(i.id),
      })),
      equipped: equippedByCategory,
      powerups: powerupCounts,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/shop/buy { itemId } - one-time cosmetic purchase; equips it
// immediately, same as playerStore.buyItem.
router.post("/buy", async (req, res, next) => {
  const conn = await pool.getConnection();
  try {
    const { itemId } = req.body || {};
    const [[item]] = await conn.query("SELECT * FROM shop_items WHERE id = ?", [itemId]);
    if (!item) return res.status(404).json({ message: `Unknown item "${itemId}"` });
    if (item.category === "powerups") {
      return res.status(400).json({ message: "Use /api/shop/powerup/buy for stackable power-ups" });
    }

    await conn.beginTransaction();
    const [[player]] = await conn.query("SELECT coins FROM players WHERE id = ? FOR UPDATE", [req.playerId]);
    const [alreadyOwned] = await conn.query(
      "SELECT 1 FROM player_shop_items WHERE player_id = ? AND item_id = ?",
      [req.playerId, itemId]
    );

    if (alreadyOwned.length === 0) {
      if (player.coins < item.price) {
        await conn.rollback();
        return res.json({ ok: false, reason: "insufficient_coins" });
      }
      await conn.query("UPDATE players SET coins = coins - ? WHERE id = ?", [item.price, req.playerId]);
      await conn.query("INSERT INTO player_shop_items (player_id, item_id) VALUES (?,?)", [req.playerId, itemId]);
    }
    await conn.query(
      "INSERT INTO player_equipped (player_id, category, item_id) VALUES (?,?,?) ON DUPLICATE KEY UPDATE item_id = VALUES(item_id)",
      [req.playerId, item.category, itemId]
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

// POST /api/shop/equip { itemId } - equip an already-owned cosmetic.
router.post("/equip", async (req, res, next) => {
  try {
    const { itemId } = req.body || {};
    const [[item]] = await pool.query("SELECT * FROM shop_items WHERE id = ?", [itemId]);
    if (!item) return res.status(404).json({ message: `Unknown item "${itemId}"` });

    const [owned] = await pool.query(
      "SELECT 1 FROM player_shop_items WHERE player_id = ? AND item_id = ?",
      [req.playerId, itemId]
    );
    if (owned.length === 0) return res.json({ ok: false, reason: "not_owned" });

    await pool.query(
      "INSERT INTO player_equipped (player_id, category, item_id) VALUES (?,?,?) ON DUPLICATE KEY UPDATE item_id = VALUES(item_id)",
      [req.playerId, item.category, itemId]
    );
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// POST /api/shop/powerup/buy { itemId } - unlimited, stackable (Section 20).
router.post("/powerup/buy", async (req, res, next) => {
  const conn = await pool.getConnection();
  try {
    const { itemId } = req.body || {};
    const [[item]] = await conn.query("SELECT * FROM shop_items WHERE id = ? AND category = 'powerups'", [itemId]);
    if (!item) return res.status(404).json({ message: `Unknown power-up "${itemId}"` });

    await conn.beginTransaction();
    const [[player]] = await conn.query("SELECT coins FROM players WHERE id = ? FOR UPDATE", [req.playerId]);
    if (player.coins < item.price) {
      await conn.rollback();
      return res.json({ ok: false, reason: "insufficient_coins" });
    }
    await conn.query("UPDATE players SET coins = coins - ? WHERE id = ?", [item.price, req.playerId]);
    await conn.query(
      "INSERT INTO player_powerups (player_id, item_id, count) VALUES (?,?,1) ON DUPLICATE KEY UPDATE count = count + 1",
      [req.playerId, itemId]
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

// POST /api/shop/powerup/use { itemId } - spends one charge (Battle/Boss
// Battle activation). A used charge never comes back, even on Retry.
router.post("/powerup/use", async (req, res, next) => {
  const conn = await pool.getConnection();
  try {
    const { itemId } = req.body || {};
    await conn.beginTransaction();
    const [[row]] = await conn.query(
      "SELECT count FROM player_powerups WHERE player_id = ? AND item_id = ? FOR UPDATE",
      [req.playerId, itemId]
    );
    if (!row || row.count <= 0) {
      await conn.rollback();
      return res.json({ ok: false });
    }
    await conn.query(
      "UPDATE player_powerups SET count = count - 1 WHERE player_id = ? AND item_id = ?",
      [req.playerId, itemId]
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
