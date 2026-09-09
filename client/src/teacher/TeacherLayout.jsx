import { useState } from "react";
import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import {
  GraduationCap,
  LayoutDashboard,
  Landmark,
  Layers,
  BookMarked,
  LibraryBig,
  ListChecks,
  HelpCircle,
  ClipboardCheck,
  ClipboardList,
  Trophy,
  BarChart3,
  LineChart,
  UserCircle,
  Menu,
  X,
  ExternalLink,
  LogOut,
  Gamepad2,
  Target,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const NAV_SECTIONS = [
  {
    label: "Overview",
    items: [{ id: "dashboard", label: "Dashboard", icon: LayoutDashboard, to: "/teacher" }],
  },
  {
    label: "My School",
    items: [
      { id: "school", label: "My School", icon: Landmark, to: "/teacher/school" },
      { id: "students", label: "My Students", icon: GraduationCap, to: "/teacher/students" },
      { id: "classes", label: "My Classes", icon: Layers, to: "/teacher/classes" },
      { id: "subjects", label: "My Subjects", icon: BookMarked, to: "/teacher/subjects" },
    ],
  },
  {
    label: "Curriculum",
    items: [
      { id: "courses", label: "Courses", icon: LibraryBig, to: "/teacher/courses" },
      { id: "lessons", label: "Lessons", icon: ListChecks, to: "/teacher/lessons" },
      { id: "questions", label: "Questions", icon: HelpCircle, to: "/teacher/questions" },
    ],
  },
  {
    label: "Assessment",
    items: [
      { id: "quizzes", label: "Quizzes", icon: HelpCircle, to: "/teacher/quizzes" },
      { id: "assignments", label: "Assignments", icon: ClipboardList, to: "/teacher/assignments" },
      { id: "results", label: "Results", icon: ClipboardCheck, to: "/teacher/results" },
    ],
  },
  {
    label: "Live",
    items: [
      { id: "live-games", label: "Live Games", icon: Gamepad2, to: "/teacher/live-games" },
    ],
  },
  {
    label: "Insights",
    items: [
      { id: "leaderboard", label: "Leaderboard", icon: Trophy, to: "/teacher/leaderboard" },
      { id: "reports", label: "Reports", icon: BarChart3, to: "/teacher/reports" },
      { id: "analytics", label: "Analytics", icon: LineChart, to: "/teacher/analytics" },
      { id: "analytics-detail", label: "Detailed Analytics", icon: Target, to: "/teacher/analytics-detail" },
    ],
  },
  {
    label: "Account",
    items: [{ id: "profile", label: "Profile", icon: UserCircle, to: "/teacher/profile" }],
  },
];

export default function TeacherLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-void font-body text-ink-primary">
      <div className="aurora-canvas pointer-events-none fixed inset-0 lg:left-64" aria-hidden="true" />
      <nav
        className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col overflow-y-auto border-r border-panel-line bg-void/95 backdrop-blur-md lg:flex"
        aria-label="Teacher"
      >
        <SidebarContent onNavigate={() => {}} />
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-void/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <nav className="relative z-10 flex w-72 flex-col overflow-y-auto border-r border-panel-line bg-void" aria-label="Teacher">
            <SidebarContent onNavigate={() => setMobileOpen(false)} showClose onClose={() => setMobileOpen(false)} />
          </nav>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-panel-line bg-void/80 px-4 py-3 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-control border border-panel-line text-ink-muted shadow-soft lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-4.5 w-4.5" />
            </button>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-neon-cyan">LearnQuest</p>
              <h1 className="font-display text-base font-bold text-ink-primary sm:text-lg">Teacher Portal</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {user && (
              <span className="hidden text-right md:block">
                <span className="block font-display text-xs font-semibold text-ink-primary">{user.name}</span>
                <span className="block font-mono text-[10px] uppercase tracking-widest text-arcane-purple">
                  {user.role}
                </span>
              </span>
            )}
            {user?.role === "ADMIN" && (
              <Link
                to="/admin"
                className="hidden items-center gap-1.5 rounded-control border border-panel-line bg-panel/40 px-3 py-2 font-display text-xs font-semibold text-ink-muted shadow-soft transition-colors hover:border-arcane-purple/50 hover:text-arcane-purple sm:flex"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Admin Console</span>
              </Link>
            )}
            <Link
              to="/dashboard"
              className="hidden items-center gap-1.5 rounded-control border border-panel-line bg-panel/40 px-3 py-2 font-display text-xs font-semibold text-ink-muted shadow-soft transition-colors hover:border-neon-cyan/50 hover:text-neon-cyan sm:flex"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Student App</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-control border border-panel-line bg-panel/40 px-3 py-2 font-display text-xs font-semibold text-ink-muted shadow-soft transition-colors hover:border-red-500/50 hover:text-red-400"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </header>

        <main className="relative p-4 sm:p-6 lg:max-w-[1400px]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function SidebarContent({ onNavigate, showClose, onClose }) {
  return (
    <>
      <div className="flex items-center justify-between border-b border-panel-line bg-gradient-to-r from-arcane-purple/10 via-transparent to-neon-cyan/5 px-5 py-5">
        <Link to="/teacher" className="flex items-center gap-3" onClick={onNavigate}>
          <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl border border-arcane-purple/50 bg-gradient-to-br from-arcane-purple/25 to-neon-cyan/10 shadow-glow-purple">
            <GraduationCap className="h-5 w-5 text-neon-cyan" strokeWidth={2.2} />
          </span>
          <span className="min-w-0">
            <span className="block font-wordmark text-sm leading-tight tracking-wide text-ink-primary">
              LEARN<span className="text-neon-cyan">QUEST</span>
            </span>
            <span className="block truncate font-mono text-[10px] uppercase tracking-widest text-arcane-purple">Teacher</span>
          </span>
        </Link>
        {showClose && (
          <button type="button" onClick={onClose} className="text-ink-faint hover:text-ink-primary" aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="flex-1 space-y-5 px-3 py-4">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <p className="px-3 pb-1.5 font-mono text-[10px] uppercase tracking-widest text-ink-faint">{section.label}</p>
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.to}
                  end={item.to === "/teacher"}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 overflow-hidden rounded-control px-3 py-2.5 font-display text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-arcane-purple to-arcane-violet text-white shadow-glow-purple"
                        : "text-ink-muted hover:bg-panel/60 hover:text-ink-primary"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-neon-cyan shadow-glow-cyan" />
                      )}
                      <item.icon className="h-[18px] w-[18px] flex-none" strokeWidth={1.8} />
                      {item.label}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
