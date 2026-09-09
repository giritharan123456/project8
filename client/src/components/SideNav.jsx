import { Link } from "react-router-dom";
import * as Icons from "lucide-react";
import {
  GraduationCap,
  Home,
  BookOpen,
  Dumbbell,
  Puzzle,
  Gamepad2,
  BarChart3,
  Trophy,
  UserRound,
  LogOut,
} from "lucide-react";
import { getSubjectName } from "../data/subjectCatalog.js";
import {
  usePlayerState,
  getEquippedAvatarIcon,
  levelFromXp,
  xpIntoCurrentLevel,
  xpForLevel,
} from "../store/playerStore.js";
import { useAuth } from "../context/AuthContext.jsx";

const TABS = [
  { id: "home", label: "Home", icon: Home, path: "/dashboard" },
  { id: "learn", label: "Learn", icon: BookOpen, path: "/world" },
  { id: "practice", label: "Practice", icon: Dumbbell, path: "/practice" },
  { id: "quiz", label: "Quiz", icon: Puzzle, path: "/quests" },
  { id: "games", label: "Games", icon: Gamepad2, path: "/games" },
  { id: "progress", label: "Progress", icon: BarChart3, path: "/achievements" },
  { id: "leaderboard", label: "Leaderboard", icon: Trophy, path: "/leaderboard" },
  { id: "profile", label: "Profile", icon: UserRound, path: "/profile" },
];

// Persistent, labeled sidebar for desktop/tablet (sm+). Brand header,
// primary nav rail, and a live player card footer driven by the shared
// player store + auth context. Hidden below sm (GameNav takes over).
//
// `active` is one of TABS[].id. `grade`/`board`/`subject` are threaded
// onto every link so curriculum context survives navigation.
export default function SideNav({ active, grade, board, subject }) {
  const qs = `${grade && board ? `?class=${grade}&board=${board}` : ""}${subject ? `${grade && board ? "&" : "?"}subject=${encodeURIComponent(subject)}` : ""}`;

  const { user, logout } = useAuth();
  const playerState = usePlayerState();
  const AvatarIcon = Icons[getEquippedAvatarIcon(playerState)] ?? UserRound;

  // Live level/XP from the store; fall back to the auth user's name.
  const totalXpEarned = playerState.totalXpEarned ?? 0;
  const level = playerState.level ?? levelFromXp(totalXpEarned);
  const xpInto = playerState.xp ?? xpIntoCurrentLevel(totalXpEarned);
  const xpToNext = xpForLevel(level);
  const xpPct = Math.min(100, Math.round((xpInto / xpToNext) * 100));
  const displayName = playerState.name ?? user?.name ?? "Learner";

  async function handleSignOut() {
    await logout();
  }

  return (
    <nav
      className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-panel-line bg-void/90 backdrop-blur-xl sm:flex"
      aria-label="Primary"
    >
      <Link to={`/dashboard${qs}`} className="group flex items-center gap-3 border-b border-panel-line px-5 py-6">
        <span className="relative flex h-11 w-11 flex-none items-center justify-center rounded-xl border border-arcane-purple/50 bg-gradient-to-br from-arcane-purple/25 to-neon-cyan/10 shadow-glow-purple">
          <GraduationCap className="h-5 w-5 text-neon-cyan" strokeWidth={2.2} />
        </span>
        <span className="min-w-0">
          <span className="block font-wordmark text-sm leading-tight text-ink-primary transition-colors group-hover:text-neon-cyan">
            LEARN<span className="text-neon-cyan">QUEST</span>
          </span>
          <span className="mt-0.5 block truncate font-mono text-[10px] uppercase tracking-widest text-ink-faint">
            {getSubjectName(subject)} World
          </span>
        </span>
      </Link>

      <div className="kicker px-6 pb-2 pt-4 text-ink-faint">Menu</div>

      <div className="flex flex-1 flex-col gap-1 overflow-y-auto px-3">
        {TABS.map((tab) => {
          const isActive = tab.id === active;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.id}
              to={`${tab.path}${qs}`}
              aria-current={isActive ? "page" : undefined}
              className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 font-display text-sm font-semibold transition-all ${
                isActive
                  ? "bg-gradient-to-r from-arcane-purple/20 via-arcane-purple/10 to-transparent text-neon-cyan shadow-inner"
                  : "text-ink-muted hover:bg-panel/60 hover:text-ink-primary"
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-gradient-to-b from-arcane-purple to-neon-cyan" />
              )}
              <Icon className="h-[18px] w-[18px] flex-none" strokeWidth={isActive ? 2.3 : 1.8} />
              {tab.label}
            </Link>
          );
        })}

        <div className="mt-3 border-t border-panel-line pt-3">
          <Link
            to="/"
            onClick={handleSignOut}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 font-display text-sm font-semibold text-ink-muted transition-colors hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-[18px] w-[18px] flex-none" strokeWidth={1.8} />
            Sign Out
          </Link>
        </div>
      </div>

      <Link
        to={`/profile${qs}`}
        className="glass-panel mx-3 mb-4 flex items-center gap-3 rounded-card p-3 transition-all hover:border-neon-cyan/40"
      >
        <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full border border-arcane-purple/50 bg-gradient-to-br from-arcane-purple/25 to-neon-cyan/10">
          <AvatarIcon className="h-[20px] w-[20px] text-arcane-purple" strokeWidth={1.9} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-display text-sm font-bold text-ink-primary">
            {displayName}
          </span>
          <span className="flex items-center gap-1.5 font-mono text-[10px] text-ink-faint">
            <span className="text-neon-cyan">Lv.{level}</span>
            <span>&middot;</span>
            <span>
              {xpInto}/{xpToNext} XP
            </span>
          </span>
          <span className="mt-1.5 block h-1 w-full overflow-hidden rounded-full bg-panel-line">
            <span
              className="block h-full rounded-full bg-gradient-to-r from-arcane-purple to-neon-cyan"
              style={{ width: `${xpPct}%` }}
            />
          </span>
        </span>
      </Link>
    </nav>
  );
}
