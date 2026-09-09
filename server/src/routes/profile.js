const express = require("express");
const pool = require("../config/db");
const { normGrade, normBoard } = require("../lib/gameLogic");

const router = express.Router();

// Centralized here so the client's language list and the server's
// validation never drift apart. Add new codes to both this array and
// client/src/locales/ + LanguageContext.jsx's LANGUAGES list.
const SUPPORTED_LANGUAGES = ["en", "ta", "hi"];

// data:image/<type>;base64,<payload>
const DATA_URL_RE = /^data:image\/(jpeg|jpg|png|webp);base64,([a-zA-Z0-9+/=]+)$/;
const MAX_PHOTO_BYTES = 5 * 1024 * 1024; // 5MB decoded

function toProfilePublic(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    // Public/no-account players never have an email — the frontend treats
    // this as "sign in to set an email" rather than an editable field.
    grade: row.current_grade,
    board: row.current_board,
    level: row.level,
    xp: row.xp,
    xpToNext: row.level * 100,
    coins: row.coins,
    streak: row.streak,
    profilePhoto: row.profile_photo || null,
    language: row.language || "en",
    // Section 4: schoolName is the free-text label typed at signup
    // (display only); schoolId is the real FK the teacher/admin APIs
    // filter by. Both are read-only here - changing them isn't exposed
    // through this form, same reasoning as email above.
    schoolName: row.school_name || null,
    schoolId: row.school_id ?? null,
    subjects: row.subjects ? row.subjects.split(",").map((s) => s.trim()).filter(Boolean) : [],
  };
}

// GET /api/profile — everything the Profile page needs in one call.
router.get("/", async (req, res, next) => {
  try {
    const [rows] = await pool.query("SELECT * FROM players WHERE id = ?", [req.playerId]);
    const player = rows[0];
    if (!player) return res.status(404).json({ message: "Player not found" });
    res.json(toProfilePublic(player));
  } catch (err) {
    next(err);
  }
});

// PUT /api/profile — { name, grade, board }. Email is intentionally not
// accepted here: it's the credential tied to sign-in (see routes/auth.js),
// so changing it isn't exposed through the profile-edit form. A player
// without an account (no req.user) has no email to protect either way.
router.put("/", async (req, res, next) => {
  try {
    const { name, grade, board } = req.body || {};

    const updates = [];
    const values = [];

    if (typeof name === "string") {
      const trimmed = name.trim();
      if (!trimmed) return res.status(400).json({ message: "Name cannot be empty." });
      if (trimmed.length > 80) return res.status(400).json({ message: "Name is too long." });
      updates.push("name = ?");
      values.push(trimmed);
    }
    if (grade !== undefined) {
      updates.push("current_grade = ?");
      values.push(normGrade(grade));
    }
    if (board !== undefined) {
      updates.push("current_board = ?");
      values.push(normBoard(board));
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: "Nothing to update." });
    }

    values.push(req.playerId);
    await pool.query(`UPDATE players SET ${updates.join(", ")} WHERE id = ?`, values);

    const [rows] = await pool.query("SELECT * FROM players WHERE id = ?", [req.playerId]);
    res.json(toProfilePublic(rows[0]));
  } catch (err) {
    next(err);
  }
});

// POST /api/profile/photo — { imageBase64: "data:image/png;base64,..." }.
// Stored inline as a data URL (MEDIUMTEXT column) rather than on disk,
// since there's no object-storage bucket wired into this project yet —
// keeps the whole feature working out of the box, at the cost of a
// slightly heavier `players` row for players who set a photo.
router.post("/photo", async (req, res, next) => {
  try {
    const { imageBase64 } = req.body || {};
    if (!imageBase64 || typeof imageBase64 !== "string") {
      return res.status(400).json({ message: "imageBase64 is required." });
    }

    const match = imageBase64.match(DATA_URL_RE);
    if (!match) {
      return res.status(400).json({ message: "Only JPG, JPEG, PNG, or WEBP images are allowed." });
    }

    const payload = match[2];
    // Base64 -> decoded byte size, without allocating the buffer just to
    // check length.
    const decodedBytes = Math.floor((payload.length * 3) / 4);
    if (decodedBytes > MAX_PHOTO_BYTES) {
      return res.status(400).json({ message: "Image must be smaller than 5MB." });
    }

    await pool.query("UPDATE players SET profile_photo = ? WHERE id = ?", [imageBase64, req.playerId]);
    res.json({ ok: true, profilePhoto: imageBase64 });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/profile/photo — removes the current profile photo.
router.delete("/photo", async (req, res, next) => {
  try {
    await pool.query("UPDATE players SET profile_photo = NULL WHERE id = ?", [req.playerId]);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// PUT /api/profile/language — { language: "en" | "ta" | "hi" }. Persisted
// on the player row so it survives logout/login on the same account, per
// the brief; anonymous (no-account) players still get it saved against
// their session cookie's player row.
router.put("/language", async (req, res, next) => {
  try {
    const { language } = req.body || {};
    if (!SUPPORTED_LANGUAGES.includes(language)) {
      return res.status(400).json({ message: `language must be one of: ${SUPPORTED_LANGUAGES.join(", ")}` });
    }
    await pool.query("UPDATE players SET language = ? WHERE id = ?", [language, req.playerId]);
    res.json({ ok: true, language });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
