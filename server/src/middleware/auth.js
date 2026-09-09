const { verifyAuthToken, ALL_ROLES } = require("../lib/auth");

const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "cq_auth";

// Runs on every request (mounted globally in app.js, like sessionMiddleware
// already is). Decodes the auth cookie if present and sets req.user to
// { id, role, email, name }, or leaves it undefined for anonymous/logged-out
// requests. This never blocks the request - it only *identifies* the
// caller. Use requireAuth/requireRole below on routes that need to enforce
// something about who that caller is.
function attachUser(req, res, next) {
  const token = req.cookies?.[AUTH_COOKIE_NAME];
  const payload = verifyAuthToken(token);
  if (payload) {
    req.user = {
      id: payload.sub,
      role: payload.role,
      email: payload.email,
      name: payload.name,
      // Section 4: the school this account belongs to (null for ADMIN,
      // and for any pre-Section-4 STUDENT/TEACHER row an admin hasn't
      // assigned a school to yet). requireSchool() below blocks TEACHER
      // routes until this is set, rather than silently showing nothing
      // or - worse - everything.
      schoolId: payload.schoolId ?? null,
    };
  }
  next();
}

// Blocks anonymous requests. Use on any route that needs a signed-in
// account of any role.
function requireAuth(req, res, next) {
  if (!req.user) return res.status(401).json({ message: "Sign in required." });
  next();
}

// Blocks anyone not signed in, AND anyone signed in with a role that isn't
// in `roles`. Order matters for the error the caller sees: 401 means "log
// in", 403 means "you're logged in as the wrong kind of account" - e.g. a
// STUDENT or TEACHER hitting an ADMIN-only route gets 403, not a redirect
// back to the login form they already passed.
//
//   router.get("/", requireRole("ADMIN"), handler);
//   router.get("/", requireRole("ADMIN", "TEACHER"), handler);
function requireRole(...roles) {
  const allowed = roles.flat();
  const invalid = allowed.filter((r) => !ALL_ROLES.includes(r));
  if (invalid.length) {
    // Programmer error (typo'd role name) - fail at startup-adjacent time
    // rather than silently letting nobody (or everybody) through.
    throw new Error(`requireRole() called with unknown role(s): ${invalid.join(", ")}`);
  }

  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Sign in required." });
    if (!allowed.includes(req.user.role)) {
      return res.status(403).json({ message: "You don't have permission to access this." });
    }
    next();
  };
}

// Blocks a TEACHER whose account has no school_id yet (e.g. a pre-Section-4
// row an admin hasn't assigned a school to). ADMIN is exempt - admins
// aren't scoped to a single school. Mount AFTER requireRole so a stray
// STUDENT never gets this far. This is what stands between "no school on
// file" and a query with `WHERE school_id = NULL` quietly matching either
// nothing (safe) or, if a route forgets the check entirely, everything
// (not safe) - so every school-scoped route in routes/teacher.js uses
// this instead of re-deriving the same guard by hand.
function requireSchool(req, res, next) {
  if (req.user.role === "ADMIN") return next();
  if (!req.user.schoolId) {
    return res.status(403).json({ message: "Your account isn't linked to a school yet. Contact an admin." });
  }
  next();
}

module.exports = { attachUser, requireAuth, requireRole, requireSchool, AUTH_COOKIE_NAME };
