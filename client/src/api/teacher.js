// Teacher-portal API layer. Like auth.js, this always calls the real
// backend - there's no USE_MOCK_API branch, because the whole point of
// these endpoints is server-enforced school-based data separation
// (Section 4, server/src/routes/teacher.js). A mock implementation could
// never stand in for "does the server actually filter by school_id", so
// TeacherContext.jsx just gets a loading/error state instead of a fake
// answer while the real backend isn't reachable.
import { apiFetch, invalidateCache } from "./client.js";

function qs(params = {}) {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "");
  if (entries.length === 0) return "";
  return `?${new URLSearchParams(entries).toString()}`;
}

// GET /api/teacher/school - the signed-in teacher's own school + headcounts.
export function getMySchool() {
  return apiFetch("/teacher/school");
}

// GET /api/teacher/students?grade=&board= - roster, already filtered to
// the signed-in teacher's school by the server.
export function getStudents({ grade, board } = {}) {
  return apiFetch(`/teacher/students${qs({ grade, board })}`);
}

// GET /api/teacher/students/:id/progress - { student, completions }.
export function getStudentProgress(studentId) {
  return apiFetch(`/teacher/students/${studentId}/progress`);
}

// GET /api/teacher/classes - grade/board groups with student counts.
export function getClasses() {
  return apiFetch("/teacher/classes");
}

// GET /api/teacher/subjects - the signed-in teacher's own assigned subjects.
export function getSubjects() {
  return apiFetch("/teacher/subjects");
}

// GET /api/teacher/leaderboard - students ranked within the school.
export function getLeaderboard() {
  return apiFetch("/teacher/leaderboard");
}

// GET /api/teacher/reports - aggregate summary + per-class breakdown.
export function getReports() {
  return apiFetch("/teacher/reports");
}

// GET /api/teacher/quizzes - every recorded quiz/lesson attempt at the
// school, newest first, with the student's name/class folded in.
export function getQuizzes() {
  return apiFetch("/teacher/quizzes");
}

// GET /api/teacher/analytics - per-student performance rollups (highest
// score, average score, avg time taken) plus top performers / students
// who need attention, all scoped to the school.
export function getAnalytics() {
  return apiFetch("/teacher/analytics");
}

// Call after anything that could change roster numbers (an admin
// reassigning a student's school mid-session, etc.) to force the next
// read to hit the network instead of the 30s GET cache in client.js.
export function invalidateTeacherCache() {
  invalidateCache("/teacher");
}
