const express = require("express");
const crypto = require("crypto");
const pool = require("../config/db");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

function mapCard(c) {
  return { ...c, front: c.front_text, back: c.back_text, known: (c.review_count || 0) > 0 };
}

// GET /api/flashcards/sets - List flashcard sets
router.get("/sets", requireAuth, async (req, res, next) => {
  try {
    const { subject, page = 1, limit = 20 } = req.query;
    const offset = (Math.max(1, Number(page)) - 1) * Number(limit);
    const where = ["fcs.is_public = 1"];
    const params = [];

    if (subject) { where.push("fcs.subject_code = ?"); params.push(subject); }

    const whereClause = `WHERE ${where.join(" AND ")}`;

    const [rows] = await pool.query(
      `SELECT fcs.*, p.name AS creator_name,
              (SELECT COUNT(*) FROM flashcards fc WHERE fc.set_id = fcs.id) AS card_count
       FROM flashcard_sets fcs
       LEFT JOIN players p ON p.id = fcs.player_id
       ${whereClause}
       ORDER BY fcs.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, Number(limit), offset]
    );

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total FROM flashcard_sets fcs ${whereClause}`,
      params
    );

    res.json({ sets: rows, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    next(err);
  }
});

// POST /api/flashcards/sets - Create set
router.post("/sets", requireAuth, requireRole("ADMIN", "TEACHER"), async (req, res, next) => {
  try {
    const { title, description, subjectCode, isPublic } = req.body || {};
    if (!title) return res.status(400).json({ message: "title is required." });

    const setId = `fcs-${Date.now().toString(36)}-${crypto.randomBytes(3).toString("hex")}`;
    await pool.query(
      `INSERT INTO flashcard_sets (id, player_id, subject_code, title, description, is_public)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [setId, req.user.id, subjectCode || null, title, description || "", isPublic === undefined ? 1 : (isPublic ? 1 : 0)]
    );

    res.status(201).json({ id: setId, title, message: "Flashcard set created." });
  } catch (err) {
    next(err);
  }
});

// GET /api/flashcards/sets/:setId - Get set with cards
router.get("/sets/:setId", requireAuth, async (req, res, next) => {
  try {
    const [sets] = await pool.query("SELECT * FROM flashcard_sets WHERE id = ?", [req.params.setId]);
    if (!sets.length) return res.status(404).json({ message: "Flashcard set not found." });

    const [cards] = await pool.query(
      "SELECT * FROM flashcards WHERE set_id = ? ORDER BY sort_order",
      [req.params.setId]
    );

    res.json({ ...sets[0], cards: cards.map(mapCard) });
  } catch (err) {
    next(err);
  }
});

// POST /api/flashcards/sets/:setId/cards - Add card
router.post("/sets/:setId/cards", requireAuth, requireRole("ADMIN", "TEACHER"), async (req, res, next) => {
  try {
    const [sets] = await pool.query("SELECT * FROM flashcard_sets WHERE id = ?", [req.params.setId]);
    if (!sets.length) return res.status(404).json({ message: "Flashcard set not found." });

    const { front, back, imageUrl } = req.body || {};
    if (!front || !back) return res.status(400).json({ message: "front and back are required." });

    const [[{ maxOrder }]] = await pool.query(
      "SELECT COALESCE(MAX(sort_order), 0) AS maxOrder FROM flashcards WHERE set_id = ?",
      [req.params.setId]
    );

    const [result] = await pool.query(
      `INSERT INTO flashcards (set_id, front_text, back_text, front_media, back_media, sort_order, ease_factor, next_review_at)
       VALUES (?, ?, ?, ?, ?, ?, 2.5, DATE_ADD(NOW(), INTERVAL 1 DAY))`,
      [req.params.setId, front, back, imageUrl || null, null, maxOrder + 1]
    );

    res.status(201).json({ id: result.insertId, front, back, message: "Card added." });
  } catch (err) {
    next(err);
  }
});

// PUT /api/flashcards/cards/:cardId - Update card
router.put("/cards/:cardId", requireAuth, requireRole("ADMIN", "TEACHER"), async (req, res, next) => {
  try {
    const [cards] = await pool.query("SELECT * FROM flashcards WHERE id = ?", [req.params.cardId]);
    if (!cards.length) return res.status(404).json({ message: "Card not found." });

    const { front, back, imageUrl } = req.body || {};
    await pool.query(
      `UPDATE flashcards SET front_text = COALESCE(?, front_text), back_text = COALESCE(?, back_text),
       front_media = COALESCE(?, front_media)
       WHERE id = ?`,
      [front, back, imageUrl, req.params.cardId]
    );

    res.json({ ok: true, message: "Card updated." });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/flashcards/cards/:cardId - Delete card
router.delete("/cards/:cardId", requireAuth, requireRole("ADMIN", "TEACHER"), async (req, res, next) => {
  try {
    const [cards] = await pool.query("SELECT * FROM flashcards WHERE id = ?", [req.params.cardId]);
    if (!cards.length) return res.status(404).json({ message: "Card not found." });

    await pool.query("DELETE FROM flashcards WHERE id = ?", [req.params.cardId]);
    res.json({ ok: true, message: "Card deleted." });
  } catch (err) {
    next(err);
  }
});

// POST /api/flashcards/cards/:cardId/review - Record review (update ease_factor, next_review_at)
router.post("/cards/:cardId/review", requireAuth, async (req, res, next) => {
  try {
    const [cards] = await pool.query("SELECT * FROM flashcards WHERE id = ?", [req.params.cardId]);
    if (!cards.length) return res.status(404).json({ message: "Card not found." });

    const { quality } = req.body || {};
    const q = Math.max(0, Math.min(5, Number(quality) || 3));

    const card = cards[0];
    let ef = card.ease_factor || 2.5;

    ef = ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    if (ef < 1.3) ef = 1.3;

    const interval = q < 3 ? 1 : Math.max(1, Math.round(((card.review_count || 0) + 1) * 0.5));
    const reviewCount = (card.review_count || 0) + 1;

    await pool.query(
      `UPDATE flashcards SET ease_factor = ?, review_count = ?,
       next_review_at = DATE_ADD(NOW(), INTERVAL ? DAY)
       WHERE id = ?`,
      [ef, reviewCount, interval, req.params.cardId]
    );

    res.json({ easeFactor: ef, intervalDays: interval, reviewCount, quality: q });
  } catch (err) {
    next(err);
  }
});

// GET /api/flashcards/review/:setId - Get cards due for review (next_review_at <= NOW())
router.get("/review/:setId", requireAuth, async (req, res, next) => {
  try {
    const [sets] = await pool.query("SELECT * FROM flashcard_sets WHERE id = ?", [req.params.setId]);
    if (!sets.length) return res.status(404).json({ message: "Flashcard set not found." });

    const [cards] = await pool.query(
      `SELECT * FROM flashcards
       WHERE set_id = ? AND (next_review_at IS NULL OR next_review_at <= NOW())
       ORDER BY next_review_at ASC, sort_order ASC`,
      [req.params.setId]
    );

    const [[{ totalCards }]] = await pool.query(
      "SELECT COUNT(*) AS totalCards FROM flashcards WHERE set_id = ?",
      [req.params.setId]
    );

    res.json({ set: sets[0], dueCards: cards.map(mapCard), totalCards, dueCount: cards.length });
  } catch (err) {
    next(err);
  }
});

module.exports = router;