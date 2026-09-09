import { useState } from "react";
import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import {
  GraduationCap,
  LayoutDashboard,
  School,
  Users,
  Landmark,
  Layers,
  BookMarked,
  LibraryBig,
  BookOpen,
  ListChecks,
  HelpCircle,
  ClipboardList,
  Trophy,
  ClipboardCheck,
  BarChart3,
  ShieldCheck,
  Settings,
  Menu,
  X,
  ExternalLink,
  LogOut,
  GitBranch,
  FileText,
  Bot,
  Bell,
  PieChart,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const NAV_SECTIONS = [
  {
    label: "Overview",
    items: [{ id: "dashboard", label: "Dashboard", icon: LayoutDashboard, to: "/admin" }],
  },
  {
    label: "Institutions",
    items: [{ id: "schools", label: "Schools", icon: School, to: "/admin/schools" }],
  },
  {
    label: "People",
    items: [
      { id: "teachers", label: "Teachers", icon: Users, to: "/admin/teachers" },
      { id: "students", label: "Students", icon: GraduationCap, to: "/admin/students" },
    ],
  },
  {
    label: "Curriculum",
    items: [
      { id: "boards", label: "Boards", icon: Landmark, to: "/admin/boards" },
      { id: "classes", label: "Classes", icon: Layers, to: "/admin/classes" },
      { id: "subjects", label: "Subjects", icon: BookMarked, to: "/admin/subjects" },
      { id: "courses", label: "Courses", icon: LibraryBig, to: "/admin/courses" },
      { id: "chapters", label: "Chapters", icon: BookOpen, to: "/admin/chapters" },
      { id: "lessons", label: "Lessons", icon: ListChecks, to: "/admin/lessons" },
      { id: "curriculum-tree", label: "Curriculum Tree", icon: GitBranch, to: "/admin/curriculum-tree" },
      { id: "content-completeness", label: "Content Completeness", icon: PieChart, to: "/admin/content-completeness" },
    ],
  },
  {
    label: "Assessment",
    items: [
      { id: "questions", label: "Questions", icon: HelpCircle, to: "/admin/questions" },
      { id: "quizzes", label: "Quizzes", icon: ClipboardList, to: "/admin/quizzes" },
    ],
  },
  {
    label: "Insights",
    items: [
      { id: "leaderboard", label: "Leaderboard", icon: Trophy, to: "/admin/leaderboard" },
      { id: "reports", label: "Reports", icon: ClipboardCheck, to: "/admin/reports" },
      { id: "analytics", label: "Analytics", icon: BarChart3, to: "/admin/analytics" },
    ],
  },
  {
    label: "AI & Content",
    items: [
      { id: "ai-management", label: "AI Management", icon: Bot, to: "/admin/ai-management" },
      { id: "notifications", label: "Notifications", icon: Bell, to: "/admin/notifications" },
    ],
  },
  {
    label: "Access Control",
    items: [{ id: "admin-users", label: "Admin Users", icon: ShieldCheck, to: "/admin/admin-users" }],
  },
  {
    label: "System",
    items: [
      { id: "audit-logs", label: "Audit Logs", icon: FileText, to: "/admin/audit-logs" },
      { id: "settings", label: "Settings", icon: Settings, to: "/admin/settings" },
    ],
  },
];

const CROSS_PANEL_LINKS = [
  { id: "teacher-portal", label: "Teacher Portal", icon: ClipboardCheck, to: "/teacher" },
  { id: "student-app", label: "Student App", icon: GraduationCap, to: "/dashboard" },
];

export default function AdminLayout() {
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
        aria-label="Admin"
      >
        <SidebarContent onNavigate={() => {}} />
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-void/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <nav className="relative z-10 flex w-72 flex-col overflow-y-auto border-r border-panel-line bg-void" aria-label="Admin">
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
              <h1 className="font-display text-base font-bold text-ink-primary sm:text-lg">Admin Console</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {user && (
              <span className="hidden text-right sm:block">
                <span className="block font-display text-xs font-semibold text-ink-primary">{user.name}</span>
                <span className="block font-mono text-[10px] uppercase tracking-widest text-arcane-purple">
                  {user.role}
                </span>
              </span>
            )}
            <Link
              to="/dashboard"
              className="flex items-center gap-1.5 rounded-control border border-panel-line bg-panel/40 px-3 py-2 font-display text-xs font-semibold text-ink-muted shadow-soft transition-colors hover:border-neon-cyan/50 hover:text-neon-cyan"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Back to App</span>
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
        <Link to="/admin" className="flex items-center gap-3" onClick={onNavigate}>
          <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl border border-arcane-purple/50 bg-gradient-to-br from-arcane-purple/25 to-neon-cyan/10 shadow-glow-purple">
            <GraduationCap className="h-5 w-5 text-neon-cyan" strokeWidth={2.2} />
          </span>
          <span className="min-w-0">
            <span className="block font-wordmark text-sm leading-tight tracking-wide text-ink-primary">
              LEARN<span className="text-neon-cyan">QUEST</span>
            </span>
            <span className="block truncate font-mono text-[10px] uppercase tracking-widest text-arcane-purple">Admin</span>
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
                  end={item.to === "/admin"}
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

        <div>
          <p className="px-3 pb-1.5 font-mono text-[10px] uppercase tracking-widest text-ink-faint">Full Access</p>
          <div className="space-y-1">
            {CROSS_PANEL_LINKS.map((item) => (
              <Link
                key={item.id}
                to={item.to}
                onClick={onNavigate}
                className="flex items-center gap-3 rounded-control border border-dashed border-panel-line bg-panel/30 px-3 py-2.5 font-display text-sm font-semibold text-ink-muted transition-all hover:border-neon-cyan/50 hover:bg-neon-cyan/5 hover:text-neon-cyan"
              >
                <item.icon className="h-[18px] w-[18px] flex-none" strokeWidth={1.8} />
                <span className="flex-1">{item.label}</span>
                <ExternalLink className="h-3.5 w-3.5 flex-none opacity-60" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
