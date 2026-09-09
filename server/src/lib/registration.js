// Shared constants + helpers for the registration form (Section 3), used
// by both POST /api/auth/signup (server/src/routes/auth.js) and anything
// else that needs to validate/display the same field set. Centralized
// here so the client's subject checkboxes and the server's validation
// can't drift apart, the same reasoning as profile.js's
// SUPPORTED_LANGUAGES list.

// LearnQuest itself only teaches Chemistry, but School/Board/Class profile
// data (and this field in particular) is deliberately generic so a
// TEACHER account can record every subject they teach, not just the one
// this app currently covers.
const SUBJECT_OPTIONS = Object.freeze([
  "Chemistry",
  "Physics",
  "Biology",
  "Mathematics",
  "English",
  "Tamil",
]);

const MAX_SUBJECTS = 6;

// Parses the `subjects` field from a signup/profile request body into a
// deduped array of known subjects, or throws a plain Error with a
// user-facing message on anything invalid. Accepts an array of strings or
// a single comma-separated string (the client sends an array; a string is
// accepted too so this stays friendly to non-JS callers / curl testing).
function parseSubjects(input, { required } = {}) {
  if (input === undefined || input === null || input === "") {
    if (required) throw new Error("Select at least one subject.");
    return [];
  }
  const list = Array.isArray(input) ? input : String(input).split(",");
  const cleaned = [...new Set(list.map((s) => String(s).trim()).filter(Boolean))];

  if (required && cleaned.length === 0) throw new Error("Select at least one subject.");
  if (cleaned.length > MAX_SUBJECTS) throw new Error(`Select at most ${MAX_SUBJECTS} subjects.`);

  const unknown = cleaned.filter((s) => !SUBJECT_OPTIONS.includes(s));
  if (unknown.length > 0) {
    throw new Error(`Unknown subject(s): ${unknown.join(", ")}.`);
  }
  return cleaned;
}

module.exports = { SUBJECT_OPTIONS, MAX_SUBJECTS, parseSubjects };
