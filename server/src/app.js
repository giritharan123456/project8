require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");

const sessionMiddleware = require("./middleware/session");
const { attachUser } = require("./middleware/auth");
const errorHandler = require("./middleware/errorHandler");
const rateLimiter = require("./middleware/rateLimiter");

const subjectsRoutes = require("./routes/subjects");
const boardsRoutes = require("./routes/boards");
const classesRoutes = require("./routes/classes");
const coursesRoutes = require("./routes/courses");
const lessonsRoutes = require("./routes/lessons");
const levelsRoutes = require("./routes/levels");
const questionsRoutes = require("./routes/questions");
const playerRoutes = require("./routes/player");
const profileRoutes = require("./routes/profile");
const achievementsRoutes = require("./routes/achievements");
const leaderboardRoutes = require("./routes/leaderboard");
const questsRoutes = require("./routes/quests");
const quizRoutes = require("./routes/quiz");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const teacherRoutes = require("./routes/teacher");
const quizzesRoutes = require("./routes/quizzes");
const masteryRoutes = require("./routes/mastery");
const flashcardsRoutes = require("./routes/flashcards");
const notificationsRoutes = require("./routes/notifications");
const assignmentsRoutes = require("./routes/assignments");
const challengesRoutes = require("./routes/challenges");
const aiRoutes = require("./routes/ai");

const app = express();

// --- Security headers via Helmet ---
app.use(helmet({
  contentSecurityPolicy: false,   // SPA needs inline scripts/styles; CSP set via meta or nginx
  crossOriginEmbedderPolicy: false, // Allow embedding for dev tools / iframes
}));

// --- Rate limiting ---
// Auth endpoints: 30 requests per minute per IP (login/signup abuse prevention)
app.use("/api/auth", rateLimiter({ windowMs: 60_000, max: 30 }));

// AI endpoints: 20 requests per minute per IP (resource-intensive)
app.use("/api/ai", rateLimiter({ windowMs: 60_000, max: 20 }));

// General API: 200 requests per minute per IP
app.use("/api", rateLimiter({ windowMs: 60_000, max: 200 }));

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim());

// credentials: true + an explicit origin list, since the frontend's
// api/client.js sends `credentials: "include"` for the anonymous session
// cookie - "*" can't be combined with credentialed requests.
app.use(cors({ origin: allowedOrigins, credentials: true }));

// Request body size limits: 6mb for JSON (profile photo base64), 50kb for URL-encoded
app.use(express.json({ limit: "6mb" }));
app.use(express.urlencoded({ extended: false, limit: "50kb" }));

app.use(cookieParser());
app.use(sessionMiddleware);
// Identifies the caller's account + role (if any) for every request below.
// Must come after cookieParser (reads the auth cookie) and can run
// alongside the anonymous sessionMiddleware above - they're independent
// cookies (see routes/auth.js).
app.use(attachUser);

app.get("/health", (req, res) => res.json({ ok: true }));

// Every route below matches one line of src/api/endpoints.js's documented
// table (GET /api/boards, GET /api/courses?board=&class=, ...).
app.use("/api/subjects", subjectsRoutes);
app.use("/api/boards", boardsRoutes);
app.use("/api/classes", classesRoutes);
app.use("/api/courses", coursesRoutes);
app.use("/api/lessons", lessonsRoutes);
app.use("/api/levels", levelsRoutes);
app.use("/api/questions", questionsRoutes);
app.use("/api/player", playerRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/achievements", achievementsRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/quests", questsRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/shop", shopRoutes);
app.use("/api/auth", authRoutes);
// Role-guarded: every route in these two files rejects anyone who isn't
// signed in with the right role (see middleware/auth.js requireRole).
app.use("/api/admin", adminRoutes);
app.use("/api/teacher", teacherRoutes);
// Universal platform routes (Section 48+): quiz management, mastery
// tracking, flashcards, notifications, assignments, challenges and AI
// helpers. Each file own its auth/role checks.
app.use("/api/quizzes", quizzesRoutes);
app.use("/api/mastery", masteryRoutes);
app.use("/api/flashcards", flashcardsRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/assignments", assignmentsRoutes);
app.use("/api/challenges", challengesRoutes);
app.use("/api/ai", aiRoutes);

// Report / export downloads (PDF + Excel) for all three roles. Each route
// enforces its own role + school-scope rules.
app.use("/api/exports", require("./routes/exports"));

// --- Serve the built React frontend from the same process/port -----------
// `npm run build` (root package.json) runs `vite build` in client/ and
// drops the static bundle in client/dist. In production (or whenever that
// folder exists) this Express server hosts it directly, so the whole app
// is one process on one port with no CORS hop between frontend and API.
const clientDist = path.join(__dirname, "..", "..", "client", "dist");
app.use(express.static(clientDist));

// Any GET that isn't /api/... and isn't a static file falls through to
// index.html so React Router can handle the route client-side.
app.get(/^(?!\/api).*/, (req, res, next) => {
  res.sendFile(path.join(clientDist, "index.html"), (err) => {
    if (err) next(); // dist/ not built yet - fall through to the 404 below
  });
});

app.use((req, res) => res.status(404).json({ message: `No route for ${req.method} ${req.originalUrl}` }));
app.use(errorHandler);

module.exports = app;
