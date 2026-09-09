const express = require("express");
const pool = require("../config/db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// GET /api/notifications/unread-count - Get unread count (must be before /:id routes)
router.get("/unread-count", requireAuth, async (req, res, next) => {
  try {
    const [[{ count }]] = await pool.query(
      "SELECT COUNT(*) AS count FROM notifications WHERE player_id = ? AND `read` = 0",
      [req.user.id]
    );
    res.json({ unreadCount: count });
  } catch (err) {
    next(err);
  }
});

// GET /api/notifications - Get player's notifications (ordered by created_at DESC)
router.get("/", requireAuth, async (req, res, next) => {
  try {
    const { page = 1, limit = 20, unreadOnly } = req.query;
    const offset = (Math.max(1, Number(page)) - 1) * Number(limit);
    const where = ["player_id = ?"];
    const params = [req.user.id];

    if (unreadOnly === "1" || unreadOnly === "true") {
      where.push("`read` = 0");
    }

    const whereClause = `WHERE ${where.join(" AND ")}`;

    const [rows] = await pool.query(
      `SELECT id, type, title, message, link, \`read\`, created_at
       FROM notifications
       ${whereClause}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, Number(limit), offset]
    );

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total FROM notifications ${whereClause}`,
      params
    );

    const [[{ unreadCount }]] = await pool.query(
      "SELECT COUNT(*) AS unreadCount FROM notifications WHERE player_id = ? AND `read` = 0",
      [req.user.id]
    );

    res.json({ notifications: rows, total, unreadCount, page: Number(page), limit: Number(limit) });
  } catch (err) {
    next(err);
  }
});

// POST /api/notifications/read-all - Mark all as read (must be before /:id routes)
router.post("/read-all", requireAuth, async (req, res, next) => {
  try {
    const [result] = await pool.query(
      "UPDATE notifications SET `read` = 1 WHERE player_id = ? AND `read` = 0",
      [req.user.id]
    );
    res.json({ ok: true, updated: result.affectedRows });
  } catch (err) {
    next(err);
  }
});

// POST /api/notifications/:id/read - Mark as read
router.post("/:id/read", requireAuth, async (req, res, next) => {
  try {
    const [result] = await pool.query(
      "UPDATE notifications SET `read` = 1 WHERE id = ? AND player_id = ?",
      [req.params.id, req.user.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: "Notification not found." });
    res.json({ ok: true, message: "Notification marked as read." });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/notifications/:id - Delete notification
router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM notifications WHERE id = ? AND player_id = ?",
      [req.params.id, req.user.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: "Notification not found." });
    res.json({ ok: true, message: "Notification deleted." });
  } catch (err) {
    next(err);
  }
});

module.exports = router;