import { Link } from "react-router-dom";
import { Home, BookOpen, Puzzle, Gamepad2, UserRound } from "lucide-react";

const TABS = [
  { id: "home", label: "Home", icon: Home, path: "/dashboard" },
  { id: "learn", label: "Learn", icon: BookOpen, path: "/world" },
  { id: "quiz", label: "Quiz", icon: Puzzle, path: "/quests" },
  { id: "games", label: "Games", icon: Gamepad2, path: "/games" },
  { id: "profile", label: "Profile", icon: UserRound, path: "/profile" },
];

// Fixed floating app-style bottom tab bar (mobile only). Glassy pill with
// active indicator chip. 44px+ tap targets, thumb-friendly.
export default function GameNav({ active, grade, board, subject }) {
  const qs = `${grade && board ? `?class=${grade}&board=${board}` : ""}${subject ? `${grade && board ? "&" : "?"}subject=${encodeURIComponent(subject)}` : ""}`;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 sm:hidden" aria-label="Primary">
      <div className="mx-auto max-w-md px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="glass-panel flex items-stretch justify-between rounded-2xl px-2 py-1.5">
          {TABS.map((tab) => {
            const isActive = tab.id === active;
            const Icon = tab.icon;
            return (
              <Link
                key={tab.id}
                to={`${tab.path}${qs}`}
                className="tap-bounce relative flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1.5 n"
                aria-current={isActive ? "page" : undefined}
                aria-label={tab.label}
              >
                {isActive && (
                  <span
                    className="absolute inset-x-1 top-1 bottom-1 rounded-xl"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(128,107,255,0.18), rgba(56,217,244,0.08))",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                    }}
                  />
                )}
                <span
                  className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
                    isActive
                      ? "text-neon-cyan"
                      : "text-ink-faint"
                  }`}
                >
                  <Icon className="h-[22px] w-[22px]" strokeWidth={isActive ? 2.4 : 1.9} />
                </span>
                <span
                  className={`relative w-full truncate text-center text-[10px] font-semibold transition-colors ${
                    isActive ? "text-neon-cyan" : "text-ink-faint"
                  }`}
                >
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}