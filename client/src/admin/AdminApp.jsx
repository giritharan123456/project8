import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { AdminProvider } from "./AdminContext.jsx";
import AdminLayout from "./AdminLayout.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import SchoolsPage from "./pages/SchoolsPage.jsx";
import StudentsPage from "./pages/StudentsPage.jsx";
import TeachersPage from "./pages/TeachersPage.jsx";
import AdminUsersPage from "./pages/AdminUsersPage.jsx";
import BoardsPage from "./pages/BoardsPage.jsx";
import ClassesPage from "./pages/ClassesPage.jsx";
import SubjectsPage from "./pages/SubjectsPage.jsx";
import CoursesPage from "./pages/CoursesPage.jsx";
import ChaptersPage from "./pages/ChaptersPage.jsx";
import LessonsPage from "./pages/LessonsPage.jsx";
import QuestionsPage from "./pages/QuestionsPage.jsx";
import QuizzesPage from "./pages/QuizzesPage.jsx";
import LeaderboardPage from "./pages/LeaderboardPage.jsx";
import ReportsPage from "./pages/ReportsPage.jsx";
import AnalyticsPage from "./pages/AnalyticsPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";

const CurriculumTreePage = lazy(() => import("./pages/CurriculumTreePage.jsx"));
const AuditLogsPage = lazy(() => import("./pages/AuditLogsPage.jsx"));
const AIManagementPage = lazy(() => import("./pages/AIManagementPage.jsx"));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage.jsx"));
const ContentCompletenessPage = lazy(() => import("./pages/ContentCompletenessPage.jsx"));

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

// Mounted at /admin/* in App.jsx. Kept as its own provider + route tree so
// the rest of the app doesn't pay for admin state, and the whole section
// stays a single lazy chunk.
export default function AdminApp() {
  return (
    <AdminProvider>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="schools" element={<SchoolsPage />} />
          <Route path="students" element={<StudentsPage />} />
          <Route path="teachers" element={<TeachersPage />} />
          <Route path="admin-users" element={<AdminUsersPage />} />
          <Route path="boards" element={<BoardsPage />} />
          <Route path="classes" element={<ClassesPage />} />
          <Route path="subjects" element={<SubjectsPage />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="chapters" element={<ChaptersPage />} />
          <Route path="lessons" element={<LessonsPage />} />
          <Route path="questions" element={<QuestionsPage />} />
          <Route path="quizzes" element={<QuizzesPage />} />
          <Route path="leaderboard" element={<LeaderboardPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="curriculum-tree" element={<Suspense fallback={<PageLoader />}><CurriculumTreePage /></Suspense>} />
          <Route path="audit-logs" element={<Suspense fallback={<PageLoader />}><AuditLogsPage /></Suspense>} />
          <Route path="ai-management" element={<Suspense fallback={<PageLoader />}><AIManagementPage /></Suspense>} />
          <Route path="notifications" element={<Suspense fallback={<PageLoader />}><NotificationsPage /></Suspense>} />
          <Route path="content-completeness" element={<Suspense fallback={<PageLoader />}><ContentCompletenessPage /></Suspense>} />
        </Route>
      </Routes>
    </AdminProvider>
  );
}
