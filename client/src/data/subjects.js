// Subject options shown on the registration form (Section 3). Keep this
// in sync with SUBJECT_OPTIONS in server/src/lib/registration.js — the
// server re-validates against its own copy of this list on every signup,
// so drifting the two just means confusing 400s, not a security issue.
export const SUBJECT_OPTIONS = ["Chemistry", "Physics", "Biology", "Mathematics", "English", "Tamil"];

// Client-side tolerance layer for subject identity.
//
// `players.subjects` stores the SIGNUP display names on fresh signups
// ("Chemistry,Physics") but legacy/demo teacher rows and all student rows
// store lowercase DB codes ("chemistry,physics,mathematics"). The teacher
// portal has to compare those against mock-curriculum rows that use the
// display names, so this maps a value of either form to its canonical
// display name. Anything unknown passes through unchanged.
const DISPLAY_BY_INPUT = {
  CHEM: "Chemistry",
  chemistry: "Chemistry",
  PHY: "Physics",
  physics: "Physics",
  BIO: "Biology",
  biology: "Biology",
  MATH: "Mathematics",
  mathematics: "Mathematics",
  ENG: "English",
  english: "English",
  TAM: "Tamil",
  tamil: "Tamil",
};

export function subjectDisplayName(value) {
  if (value == null) return "";
  return DISPLAY_BY_INPUT[String(value).trim()] ?? String(value).trim();
}

// The display-name set for a teacher's `subjects` value, which may be an
// array of display names / codes or a comma-separated string of either.
export function subjectDisplayNames(subjects) {
  const list = Array.isArray(subjects)
    ? subjects
    : String(subjects ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
  const seen = new Set();
  const out = [];
  for (const s of list) {
    const name = subjectDisplayName(s);
    if (name && !seen.has(name)) {
      seen.add(name);
      out.push(name);
    }
  }
  return out;
}