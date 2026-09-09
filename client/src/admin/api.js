// Admin-console API layer for the pieces of /admin that are backed by a
// real database table today: schools, subjects, boards, classes, students,
// teachers, admin-users (all in server/src/routes/admin.js) and the
// platform-wide leaderboard/reports views, which reuse
// server/src/routes/teacher.js's /leaderboard and /reports handlers - an
// ADMIN hitting those with no ?school_id sees every school (resolveScope()
// there treats a missing school_id as "all schools" only for ADMIN).
// Everything else under /admin (Courses/Chapters/Lessons/Questions/
// Quizzes/Dashboard) still runs on AdminContext's localStorage store -
// see mockData.js for why those don't have real tables yet.
import { apiFetch, invalidateCache } from "../api/client.js";

function qs(params = {}) {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "");
  if (entries.length === 0) return "";
  return `?${new URLSearchParams(entries).toString()}`;
}

// GET /api/admin/stats - platform-wide headline counts for the dashboard.
export function getAdminStats() {
  return apiFetch("/admin/stats");
}

// GET /api/admin/schools - every school, with student/teacher headcounts.
export function getSchools() {
  return apiFetch("/admin/schools");
}

// POST /api/admin/schools - { name }
export function createSchool(name) {
  invalidateCache("/admin/schools");
  return apiFetch("/admin/schools", { method: "POST", body: { name } });
}

// PATCH /api/admin/schools/:id - { name }
export function updateSchool(id, name) {
  invalidateCache("/admin/schools");
  return apiFetch(`/admin/schools/${id}`, { method: "PATCH", body: { name } });
}

// DELETE /api/admin/schools/:id - fails with 409 if accounts still
// reference it; the caller surfaces err.body.message from ApiError.
export function deleteSchool(id) {
  invalidateCache("/admin/schools");
  return apiFetch(`/admin/schools/${id}`, { method: "DELETE" });
}

// GET /api/admin/users?role=&school_id= - real signed-up accounts.
export function getUsers({ role, schoolId } = {}) {
  return apiFetch(`/admin/users${qs({ role, school_id: schoolId })}`);
}

// Admin console accounts (super admins, admins, support staff) - a
// roster/permissions directory of who can manage /admin and what they're
// scoped to, backed by the real `admin_users` table (migrations/
// 008_admin_console_users.sql). Distinct from getUsers() above, which
// lists real STUDENT/TEACHER/ADMIN platform accounts on `players`.
// AdminUsersPage.jsx still has a one-time fallback to localStorage if this
// ever 404s/network-fails on first load, but with the route live that path
// is never taken in normal operation.

// GET /api/admin/admin-users - every console account.
export function getAdminUsers() {
  return apiFetch("/admin/admin-users");
}

// POST /api/admin/admin-users - { name, email, role, permissions, status }
export function createAdminUser(values) {
  invalidateCache("/admin/admin-users");
  return apiFetch("/admin/admin-users", { method: "POST", body: values });
}

// PATCH /api/admin/admin-users/:id - partial update
export function updateAdminUser(id, values) {
  invalidateCache("/admin/admin-users");
  return apiFetch(`/admin/admin-users/${id}`, { method: "PATCH", body: values });
}

// DELETE /api/admin/admin-users/:id
export function deleteAdminUser(id) {
  invalidateCache("/admin/admin-users");
  return apiFetch(`/admin/admin-users/${id}`, { method: "DELETE" });
}

// ---------------------------------------------------------------------
// Admin > Students/Teachers - real accounts on the `players` table (role
// STUDENT/TEACHER, email set). Unlike getUsers() above (read-only, used
// by Section-4 school tooling), these give the Students/Teachers pages
// full CRUD, matching the { data, addItem, updateItem, deleteItem } shape
// AdminContext.jsx wires every ResourcePage-based screen to.
// ---------------------------------------------------------------------

export function getAdminStudents() {
  return apiFetch("/admin/students");
}
export function createAdminStudent(values) {
  invalidateCache("/admin/students");
  return apiFetch("/admin/students", { method: "POST", body: values });
}
export function updateAdminStudent(id, values) {
  invalidateCache("/admin/students");
  return apiFetch(`/admin/students/${id}`, { method: "PATCH", body: values });
}
export function deleteAdminStudent(id) {
  invalidateCache("/admin/students");
  return apiFetch(`/admin/students/${id}`, { method: "DELETE" });
}
// GET /api/admin/students/:id/progress - completed-lesson list for the
// Students > View Progress modal (fetched on demand, not part of the list).
export function getAdminStudentProgress(id) {
  return apiFetch(`/admin/students/${id}/progress`);
}

export function getAdminTeachers() {
  return apiFetch("/admin/teachers");
}
export function createAdminTeacher(values) {
  invalidateCache("/admin/teachers");
  return apiFetch("/admin/teachers", { method: "POST", body: values });
}
export function updateAdminTeacher(id, values) {
  invalidateCache("/admin/teachers");
  return apiFetch(`/admin/teachers/${id}`, { method: "PATCH", body: values });
}
export function deleteAdminTeacher(id) {
  invalidateCache("/admin/teachers");
  return apiFetch(`/admin/teachers/${id}`, { method: "DELETE" });
}

// ---------------------------------------------------------------------
// Admin > Subjects/Boards/Classes - real tables (subjects, boards +
// board_categories, classes), unlike the resources still on AdminContext's
// localStorage store. See AdminContext.jsx for how these get plugged into
// the same { data, addItem, updateItem, deleteItem } shape every
// ResourcePage-based screen already expects.
// ---------------------------------------------------------------------

export function getAdminSubjects() {
  return apiFetch("/admin/subjects");
}
export function createAdminSubject(values) {
  invalidateCache("/admin/subjects");
  return apiFetch("/admin/subjects", { method: "POST", body: values });
}
export function updateAdminSubject(code, values) {
  invalidateCache("/admin/subjects");
  return apiFetch(`/admin/subjects/${code}`, { method: "PATCH", body: values });
}
export function deleteAdminSubject(code) {
  invalidateCache("/admin/subjects");
  return apiFetch(`/admin/subjects/${code}`, { method: "DELETE" });
}

export function getAdminBoards() {
  return apiFetch("/admin/boards");
}
export function createAdminBoard(values) {
  invalidateCache("/admin/boards");
  return apiFetch("/admin/boards", { method: "POST", body: values });
}
export function updateAdminBoard(code, values) {
  invalidateCache("/admin/boards");
  return apiFetch(`/admin/boards/${code}`, { method: "PATCH", body: values });
}
export function deleteAdminBoard(code) {
  invalidateCache("/admin/boards");
  return apiFetch(`/admin/boards/${code}`, { method: "DELETE" });
}

export function getAdminClasses() {
  return apiFetch("/admin/classes");
}
export function createAdminClass(values) {
  invalidateCache("/admin/classes");
  return apiFetch("/admin/classes", { method: "POST", body: values });
}
export function updateAdminClass(grade, values) {
  invalidateCache("/admin/classes");
  return apiFetch(`/admin/classes/${grade}`, { method: "PATCH", body: values });
}
export function deleteAdminClass(grade) {
  invalidateCache("/admin/classes");
  return apiFetch(`/admin/classes/${grade}`, { method: "DELETE" });
}

// GET /api/admin/courses - real `worlds`, read-only. Admin > Courses
// itself is still mock/localStorage; this just gives the Lessons/
// Questions Course dropdowns (and the backend's own FK checks) something
// real to point at in the meantime.
export function getAdminCoursesList() {
  return apiFetch("/admin/courses");
}

// ---------------------------------------------------------------------
// Admin > Lessons/Questions - real tables (`lessons`, `questions`).
// Both are scoped to a real Course (world_id) + optional Board override,
// matching how the tables (and the battle engine that reads them) already
// work - see server/src/routes/admin.js's comments on these routes for
// why the mock UI's chapterId/lessonId fields were dropped rather than
// faked.
// ---------------------------------------------------------------------

export function getAdminLessons() {
  return apiFetch("/admin/lessons");
}
export function createAdminLesson(values) {
  invalidateCache("/admin/lessons");
  return apiFetch("/admin/lessons", { method: "POST", body: values });
}
export function updateAdminLesson(id, values) {
  invalidateCache("/admin/lessons");
  return apiFetch(`/admin/lessons/${id}`, { method: "PATCH", body: values });
}
export function deleteAdminLesson(id) {
  invalidateCache("/admin/lessons");
  return apiFetch(`/admin/lessons/${id}`, { method: "DELETE" });
}

export function getAdminQuestions() {
  return apiFetch("/admin/questions");
}
export function createAdminQuestion(values) {
  invalidateCache("/admin/questions");
  return apiFetch("/admin/questions", { method: "POST", body: values });
}
export function updateAdminQuestion(id, values) {
  invalidateCache("/admin/questions");
  return apiFetch(`/admin/questions/${id}`, { method: "PATCH", body: values });
}
export function deleteAdminQuestion(id) {
  invalidateCache("/admin/questions");
  return apiFetch(`/admin/questions/${id}`, { method: "DELETE" });
}

// GET /api/teacher/leaderboard?school_id= - omit schoolId for the
// platform-wide (every school) view; pass one to scope to a single school.
export function getPlatformLeaderboard(schoolId) {
  return apiFetch(`/teacher/leaderboard${qs({ school_id: schoolId })}`);
}

// GET /api/teacher/reports?school_id= - same all-schools-by-default rule.
export function getPlatformReports(schoolId) {
  return apiFetch(`/teacher/reports${qs({ school_id: schoolId })}`);
}

// GET /api/teacher/quizzes?school_id= - every completion row across every
// school (omit schoolId for the platform-wide view). This is the same
// handler/school scoping as getPlatformReports above (resolveScope in
// teacher.js treats a missing school_id as "all schools" for ADMIN), so the
// Reports page can render the same per-attempt breakdown table the teacher
// console shows.
export function getPlatformQuizAttempts(schoolId) {
  return apiFetch(`/teacher/quizzes${qs({ school_id: schoolId })}`);
}

// GET /api/teacher/leaderboard/report?school_id=&grade=&board=&subject= -
// the filterable, PDF-report-ready leaderboard behind the Leaderboard
// page's Download PDF button. Same all-schools-by-default rule as above.
export function getLeaderboardReport({ schoolId, grade, board, subject } = {}) {
  return apiFetch(`/teacher/leaderboard/report${qs({ school_id: schoolId, grade, board, subject })}`);
}

// GET /api/boards / /api/classes / /api/subjects - real, public catalog
// data (not the mock CMS store) reused here purely to populate the
// Board/Class/Subject filter dropdowns on the Leaderboard report.
export async function getBoardsList() {
  const categories = await apiFetch("/boards");
  return categories.flatMap((c) => c.boards);
}

export function getClassesList() {
  return apiFetch("/classes");
}

export function getSubjectsList() {
  return apiFetch("/subjects");
}

// GET /api/admin/content-coverage - Section 53. The real endpoint reports
// per-subject authored-layer counts straight from MySQL (worlds, lessons,
// units, concepts, topics, learning contents, questions, quizzes and
// quiz<->question links), so Admin > Content Completeness never drifts from
// what players can actually reach. If the server isn't reachable (e.g. the
// local dev shell), the page still renders by computing the same shape from
// AdminContext's store instead - pass that store in as `ctx`.
export async function getContentCoverage(ctx) {
  try {
    return await apiFetch("/admin/content-coverage");
  } catch (err) {
    const local = computeCoverageLocally(ctx);
    if (local) return { generatedAt: new Date().toISOString(), ...local, isLocalEstimate: true };
    throw err;
  }
}

const COVERAGE_LAYERS = [
  "worlds", "lessons", "units", "concepts", "topics",
  "learningContents", "questions", "quizzes", "quizQuestions",
];

function computeCoverageLocally(ctx = {}) {
  const subjects = ctx.subjects || [];
  if (subjects.length === 0) return null;

  const courses =
    ctx.courseCatalog && ctx.courseCatalog.length ? ctx.courseCatalog : ctx.courses || [];
  const lessons = ctx.lessons || [];
  const questions = ctx.questions || [];
  const quizzes = ctx.quizzes || [];

  const codeByName = new Map();
  for (const s of subjects) codeByName.set(String(s.name || "").toLowerCase(), s.code ?? s.id);

  const per = new Map();
  for (const s of subjects) {
    const code = s.code ?? s.id;
    per.set(code, {
      subjectCode: code,
      name: s.name,
      icon: s.icon,
      status: s.status ?? "active",
      worlds: 0, lessons: 0, units: 0, concepts: 0, topics: 0, learningContents: 0,
      questions: 0, quizzes: 0, quizQuestions: 0,
    });
  }

  const courseCode = new Map();
  for (const w of courses) {
    const subj = w.subjectCode || codeByName.get(String(w.subject || "").toLowerCase());
    if (subj && per.has(subj)) {
      per.get(subj).worlds += 1;
      courseCode.set(w.id, subj);
    }
  }
  for (const l of lessons) {
    const subj = courseCode.get(l.worldId ?? l.courseId);
    if (subj) per.get(subj).lessons += 1;
  }
  for (const q of questions) {
    const subj = courseCode.get(q.worldId ?? q.courseId);
    if (subj) per.get(subj).questions += 1;
  }
  for (const z of quizzes) {
    const subj = courseCode.get(z.courseId);
    if (subj) {
      per.get(subj).quizzes += 1;
      per.get(subj).quizQuestions += z.questionCount || 0;
    }
  }

  const gaps = [];
  const perSubject = [...per.values()].map((r) => {
    let filled = 0;
    for (const layer of COVERAGE_LAYERS) {
      if (r[layer] > 0) filled += 1;
      else if (r.status === "active") {
        gaps.push({
          subjectCode: r.subjectCode,
          layer,
          actual: r[layer],
          message: `${r.name} has no ${layer.replace(/([A-Z])/g, " $1").toLowerCase()}`,
        });
      }
    }
    return { ...r, completeness: Math.round((filled / COVERAGE_LAYERS.length) * 100) };
  });

  const active = perSubject.filter((x) => x.status === "active");
  const healthy = active.filter((x) => x.completeness === 100).length;
  const attention = active.filter((x) => x.completeness > 0 && x.completeness < 100).length;
  const emptyActive = active.filter((x) => x.completeness === 0).length;

  return {
    totals: {
      subjects: active.length,
      worlds: perSubject.reduce((a, r) => a + r.worlds, 0),
      lessons: perSubject.reduce((a, r) => a + r.lessons, 0),
      questions: perSubject.reduce((a, r) => a + r.questions, 0),
      quizzes: perSubject.reduce((a, r) => a + r.quizzes, 0),
      units: 0, concepts: 0, topics: 0, learningContents: 0, quizQuestions: 0,
    },
    summary: {
      healthy,
      attention,
      emptyActive,
      overallCompleteness: active.length ? Math.round(active.reduce((a, r) => a + r.completeness, 0) / active.length) : 0,
      status: emptyActive > 0 ? "critical" : attention > 0 ? "attention" : "healthy",
    },
    perSubject,
    gaps,
  };
}
