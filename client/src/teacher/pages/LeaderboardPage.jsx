import { Trophy, Flame } from "lucide-react";
import { useTeacherData } from "../TeacherContext.jsx";
import { RosterError } from "./SchoolPage.jsx";

const MEDAL_COLORS = ["text-reward-gold", "text-ink-muted", "text-amber-700"];

export default function LeaderboardPage() {
  const { data, rosterLoading, rosterError, refetchRoster } = useTeacherData();
  const rows = data.leaderboard ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-ink-primary">Leaderboard</h2>
        <p className="mt-1 text-sm text-ink-muted">Students at your school, ranked by total XP earned.</p>
      </div>

      {rosterLoading ? (
        <p className="text-sm text-ink-faint">Loading leaderboard…</p>
      ) : rosterError ? (
        <RosterError message={rosterError} onRetry={refetchRoster} />
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-panel-line bg-panel/60 p-8 text-center text-sm text-ink-faint">
          No students at your school yet.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-panel-line bg-panel/60">
          <div className="divide-y divide-panel-line">
            {rows.map((row) => (
              <div key={row.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                <div className="flex min-w-0 items-center gap-4">
                  <span
                    className={`flex h-8 w-8 flex-none items-center justify-center rounded-full border border-panel-line font-mono text-xs font-bold ${
                      MEDAL_COLORS[row.rank - 1] ?? "text-ink-faint"
                    }`}
                  >
                    {row.rank <= 3 ? <Trophy className="h-4 w-4" strokeWidth={1.8} /> : row.rank}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-display text-sm font-semibold text-ink-primary">{row.name}</p>
                    <p className="truncate text-xs text-ink-faint">
                      Grade {row.current_grade} &middot; {row.current_board}
                    </p>
                  </div>
                </div>
                <div className="flex flex-none items-center gap-4">
                  <span className="font-mono text-xs text-ink-muted">Level {row.level}</span>
                  <span className="flex items-center gap-1 font-mono text-xs text-reward-gold">
                    <Flame className="h-3.5 w-3.5" /> {row.total_xp_earned} XP
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
