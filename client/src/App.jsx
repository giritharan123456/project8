import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import RouteLoader from "./components/RouteLoader.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import UnauthorizedPage from "./pages/UnauthorizedPage.jsx";
import SkipToContent from "./components/ui/SkipToContent.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

// Lazy load all pages
const PortalLoginPage = lazy(() => import("./pages/PortalLoginPage.jsx"));
const SignUpPage = lazy(() => import("./pages/SignUpPage.jsx"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage.jsx"));
const SubjectsPage = lazy(() => import("./pages/SubjectsPage.jsx"));
const ClassSelectionPage = lazy(() => import("./pages/ClassSelectionPage.jsx"));
const BoardSelectionPage = lazy(() => import("./pages/BoardSelectionPage.jsx"));
const DashboardPage = lazy(() => import("./pages/DashboardPage.jsx"));
const ProfilePage = lazy(() => import("./pages/ProfilePage.jsx"));
const WorldMapPage = lazy(() => import("./pages/WorldMapPage.jsx"));
const CourseDetailPage = lazy(() => import("./pages/CourseDetailPage.jsx"));
const DifficultySelectPage = lazy(() => import("./pages/DifficultySelectPage.jsx"));
const BattlePage = lazy(() => import("./pages/BattlePage.jsx"));
const BossBattlePage = lazy(() => import("./pages/BossBattlePage.jsx"));
// NEW student pages
const LearnPage = lazy(() => import("./pages/LearnPage.jsx"));
const PracticePage = lazy(() => import("./pages/PracticePage.jsx"));
const TestPage = lazy(() => import("./pages/TestPage.jsx"));
const GamesPage = lazy(() => import("./pages/GamesPage.jsx"));
const FlashcardsPage = lazy(() => import("./pages/FlashcardsPage.jsx"));
const ProgressPage = lazy(() => import("./pages/ProgressPage.jsx"));
const ResultPage = lazy(() => import("./pages/ResultPage.jsx"));
const LiveGamePage = lazy(() => import("./pages/LiveGamePage.jsx"));
const ChallengePage = lazy(() => import("./pages/ChallengePage.jsx"));
const AchievementsPage = lazy(() => import("./pages/AchievementsPage.jsx"));
const DailyQuestsPage = lazy(() => import("./pages/DailyQuestsPage.jsx"));
const LeaderboardPage = lazy(() => import("./pages/LeaderboardPage.jsx"));
const ShopPage = lazy(() => import("./pages/ShopPage.jsx"));
const QuizHubPage = lazy(() => import("./pages/QuizHubPage.jsx"));
const QuizInstructionsPage = lazy(() => import("./pages/QuizInstructionsPage.jsx"));
// Portals
const AdminApp = lazy(() => import("./admin/AdminApp.jsx"));
const TeacherApp = lazy(() => import("./teacher/TeacherApp.jsx"));

function LandingLayout() {
  return (
    <div className="min-h-screen bg-void font-body text-ink-primary">
      <Navbar />
      <main><LandingPage /></main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SkipToContent />
      <Suspense fallback={<RouteLoader />}>
        <div id="main-content" tabIndex={-1}>
          <Routes>
            <Route path="/" element={<LandingLayout />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="/sign-in" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<PortalLoginPage />} />
            <Route path="/sign-up" element={<SignUpPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/subjects" element={<SubjectsPage />} />
            <Route path="/select-class" element={<ClassSelectionPage />} />
            <Route path="/select-board" element={<BoardSelectionPage />} />
            
            {/* All protected student routes */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/world" element={<ProtectedRoute><WorldMapPage /></ProtectedRoute>} />
            <Route path="/course/:worldId" element={<ProtectedRoute><CourseDetailPage /></ProtectedRoute>} />
            <Route path="/play/:worldId/:lessonId" element={<ProtectedRoute><DifficultySelectPage /></ProtectedRoute>} />
            <Route path="/battle/:worldId/:lessonId/:difficultyId" element={<ProtectedRoute><BattlePage /></ProtectedRoute>} />
            <Route path="/boss/:worldId" element={<ProtectedRoute><BossBattlePage /></ProtectedRoute>} />
            <Route path="/learn" element={<ProtectedRoute><LearnPage /></ProtectedRoute>} />
            <Route path="/learn/:subjectCode" element={<ProtectedRoute><LearnPage /></ProtectedRoute>} />
            <Route path="/practice" element={<ProtectedRoute><PracticePage /></ProtectedRoute>} />
            <Route path="/test" element={<ProtectedRoute><TestPage /></ProtectedRoute>} />
            <Route path="/test/:quizId" element={<ProtectedRoute><TestPage /></ProtectedRoute>} />
            <Route path="/tests" element={<ProtectedRoute><QuizHubPage /></ProtectedRoute>} />
            <Route path="/tests/:testId" element={<ProtectedRoute><QuizInstructionsPage /></ProtectedRoute>} />
            <Route path="/games" element={<ProtectedRoute><GamesPage /></ProtectedRoute>} />
            <Route path="/flashcards" element={<ProtectedRoute><FlashcardsPage /></ProtectedRoute>} />
            <Route path="/progress" element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
            <Route path="/result/:attemptId" element={<ProtectedRoute><ResultPage /></ProtectedRoute>} />
            <Route path="/live-game" element={<ProtectedRoute><LiveGamePage /></ProtectedRoute>} />
            <Route path="/challenges" element={<ProtectedRoute><ChallengePage /></ProtectedRoute>} />
            <Route path="/achievements" element={<ProtectedRoute><AchievementsPage /></ProtectedRoute>} />
            <Route path="/quests" element={<ProtectedRoute><DailyQuestsPage /></ProtectedRoute>} />
            <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
            <Route path="/shop" element={<ProtectedRoute><ShopPage /></ProtectedRoute>} />
            
            {/* Admin portal */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allow={["ADMIN"]}>
                  <ErrorBoundary>
                    <AdminApp />
                  </ErrorBoundary>
                </ProtectedRoute>
              }
            />
            {/* Teacher portal */}
            <Route
              path="/teacher/*"
              element={
                <ProtectedRoute allow={["ADMIN", "TEACHER"]}>
                  <ErrorBoundary>
                    <TeacherApp />
                  </ErrorBoundary>
                </ProtectedRoute>
              }
            />
            
            {/* 404 catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Suspense>
    </AuthProvider>
  );
}
