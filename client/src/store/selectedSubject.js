// Pending-subject handoff a logged-out user picks on the Subject Selection
// screen (/subjects) before being asked to sign in. Persisted to
// localStorage (same pattern as playerStore's "chemquest:player:v1") so the
// selection survives the login/signup navigation and a page refresh. The
// value is consumed (cleared) once the post-auth redirect to that subject's
// content happens — see PortalLoginPage.jsx / SignUpPage.jsx.
const KEY = "chemquest:selectedSubject:v1";

export function getSelectedSubject() {
  try {
    const value = localStorage.getItem(KEY);
    return value && value !== "null" ? value : null;
  } catch {
    return null;
  }
}

export function setSelectedSubject(code) {
  try {
    if (code) localStorage.setItem(KEY, code);
    else localStorage.removeItem(KEY);
  } catch {
    // ignoring storage failures — the flow degrades to the default redirect
  }
}

export function clearSelectedSubject() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignoring storage failures — the flow degrades to the default redirect
  }
}