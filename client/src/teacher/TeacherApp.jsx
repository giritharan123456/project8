import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { TeacherProvider } from "./TeacherContext.jsx";
import TeacherLayout from "./TeacherLayout.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import SchoolPage from "./pages/SchoolPage.jsx";
import StudentsPage from "./pages/StudentsPage.jsx";
import ClassesPage from "./pages/ClassesPage.jsx";
import SubjectsPage from "./pages/SubjectsPage.jsx";
import CoursesPage from "./pages/CoursesPage.jsx";
import LessonsPage from "./pages/LessonsPage.jsx";
import QuestionsPage from "./pages/QuestionsPage.jsx";
import QuizzesPage from "./pages/QuizzesPage.jsx";
import AssignmentsPage from "./pages/AssignmentsPage.jsx";
import ResultsPage from "./pages/ResultsPage.jsx";
import LeaderboardPage from "./pages/LeaderboardPage.jsx";
import ReportsPage from "./pages/ReportsPage.jsx";
import AnalyticsPage from "./pages/AnalyticsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

const LiveGamePage = lazy(() => import("./pages/LiveGamePage.jsx"));
const AnalyticsDetailPage = lazy(() => import("./pages/AnalyticsDetailPage.jsx"));

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-arcane-purple border-t-transparent" />
        <p className="text-sm text-ink-faint">Loading...</p>
      </div>
    </div>
  );
}

// Mounted at /teacher/* in App.jsx. Own provider + route tree (mirrors
// src/admin/AdminApp.jsx) so it stays a single lazy chunk that regular
// players and admins never pay for. TeacherProvider fetches the signed-in
// teacher's own school-scoped roster from the real API (Section 4) and
// scopes every screen here to it.
export default function TeacherApp() {
  return (
    <TeacherProvider>
      <Routes>
        <Route element={<TeacherLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="school" element={<SchoolPage />} />
          <Route path="students" element={<StudentsPage />} />
          <Route path="classes" element={<ClassesPage />} />
          <Route path="subjects" element={<SubjectsPage />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="lessons" element={<LessonsPage />} />
          <Route path="questions" element={<QuestionsPage />} />
          <Route path="quizzes" element={<QuizzesPage />} />
          <Route path="assignments" element={<AssignmentsPage />} />
          <Route path="results" element={<ResultsPage />} />
          <Route path="leaderboard" element={<LeaderboardPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="live-games" element={<Suspense fallback={<PageLoader />}><LiveGamePage /></Suspense>} />
          <Route path="analytics-detail" element={<Suspense fallback={<PageLoader />}><AnalyticsDetailPage /></Suspense>} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </TeacherProvider>
  );
}
