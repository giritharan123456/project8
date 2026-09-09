// School lookups (Section 4 "school-based data separation"). This is the
// ONLY code path allowed to insert into `schools` - keeping it centralized
// means "same school, same row" (matched case/whitespace-insensitively)
// can never drift between callers.
const pool = require("../config/db");

const MAX_SCHOOL_NAME_LENGTH = 150;

function normalize(name) {
  return String(name).trim().toLowerCase();
}

// Resolves a free-text school name (as typed on the registration form) to
// a stable schools.id, creating the row the first time that name is seen.
// Uses MySQL's INSERT ... ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)
// trick so this is a single atomic round trip with no read-then-write
// race between two people from the same new school signing up at once.
async function findOrCreateSchool(rawName) {
  const trimmed = String(rawName || "").trim();
  if (!trimmed) throw new Error("School name is required.");
  if (trimmed.length > MAX_SCHOOL_NAME_LENGTH) throw new Error("School name is too long.");

  const normalized = normalize(trimmed);
  await pool.query(
    `INSERT INTO schools (name, normalized_name) VALUES (?, ?)
     ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)`,
    [trimmed, normalized]
  );
  const [rows] = await pool.query("SELECT LAST_INSERT_ID() AS id");
  return rows[0].id;
}

async function getSchoolById(schoolId) {
  if (!schoolId) return null;
  const [rows] = await pool.query("SELECT id, name, created_at FROM schools WHERE id = ?", [schoolId]);
  return rows[0] || null;
}

module.exports = { findOrCreateSchool, getSchoolById, MAX_SCHOOL_NAME_LENGTH };
