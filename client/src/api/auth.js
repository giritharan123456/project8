// Auth API layer. Unlike endpoints.js, these always call the real backend
// (there's no USE_MOCK_API branch here) - role-based access control has to
// be enforced by the actual server, so there's nothing meaningful a mock
// implementation could stand in for.
import { apiFetch, invalidateCache } from "./client.js";

// GET /api/auth/me - returns { user } where user is
// { id, name, email, role } or null if not signed in.
export function getMe() {
  return apiFetch("/auth/me");
}

// POST /api/auth/login - { email, password } -> { ok, user }
export function login(email, password) {
  return apiFetch("/auth/login", { method: "POST", body: { email, password } });
}

// POST /api/auth/signup - { name, email, password, confirmPassword, role,
// schoolName, board, grade, subjects } -> { ok, user }
// `role` is STUDENT or TEACHER only - the server rejects anything else,
// including ADMIN (see server/src/routes/auth.js). `fields` carries the
// rest of the registration form (Section 3).
export function signup(name, email, password, fields = {}) {
  return apiFetch("/auth/signup", { method: "POST", body: { name, email, password, ...fields } });
}

// POST /api/auth/logout -> { ok }
export async function logout() {
  const result = await apiFetch("/auth/logout", { method: "POST" });
  // GET /auth/me is cached for 30s by apiFetch (see client.js) - without
  // this, a logout immediately followed by a re-check could read the
  // stale "signed in" response for up to 30s.
  invalidateCache("/auth/me");
  return result;
}
