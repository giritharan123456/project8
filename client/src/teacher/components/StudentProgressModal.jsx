import { useEffect, useState } from "react";
import { X, Flame, Trophy, CheckCircle2, Star, Clock } from "lucide-react";
import * as teacherApi from "../../api/teacher.js";
import { useTeacherData } from "../TeacherContext.jsx";

function formatMs(ms) {
  if (!ms) return "\u2014";
  const seconds = Math.round(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
}

// Fetches on open rather than taking pre-loaded data as a prop: the
// student list (StudentsPage) only carries summary fields, and this modal
// hits GET /api/teacher/students/:id/progress itself - which re-checks
// school_id server-side on every call (see server/src/routes/teacher.js),
// so it can't be used to reach a student outside the signed-in teacher's
// school even if a stale/tampered id ever made it this far.
export default function StudentProgressModal({ studentId, onClose }) {
  const { data } = useTeacherData();
  const [state, setState] = useState({ loading: true, error: null, student: null, completions: [] });

  useEffect(() => {
    let cancelled = false;
    setState({ loading: true, error: null, student: null, completions: [] });
    teacherApi
      .getStudentProgress(studentId)
      .then((res) => {
        if (!cancelled) setState({ loading: false, error: null, student: res.student, completions: res.completions });
      })
      .catch((err) => {
        if (!cancelled) setState({ loading: false, error: err.message ?? "Couldn't load progress.", student: null, completions: [] });
      });
    return () => {
      cancelled = true;
    };
  }, [studentId]);

  const { loading, error, student, completions } = state;
  const avgAccuracy = completions.length
    ? Math.round(completions.reduce((sum, c) => sum + (c.accuracy || 0), 0) / completions.length)
    : 0;
  const highestScore = completions.length ? Math.max(...completions.map((c) => c.accuracy || 0)) : 0;
  const totalXp = completions.reduce((sum, c) => sum + (c.xp || 0), 0);
  const analyticsRow = data.analytics?.students?.find((s) => s.id === studentId);

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-void/80 backdrop-blur-sm p-4 py-10">
      <div className="w-full max-w-2xl rounded-2xl border border-panel-line bg-panel shadow-xl">
        <div className="flex items-center justify-between border-b border-panel-line px-5 py-4">
          <div>
            <h3 className="font-display text-lg font-bold text-ink-primary">{student?.name ?? "Student Progress"}</h3>
            {student && (
              <p className="text-xs text-ink-muted">
                {student.email} &middot; Grade {student.current_grade} &middot; {student.current_board}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-faint transition-colors hover:bg-panel-alt hover:text-ink-primary"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[75vh] space-y-6 overflow-y-auto px-5 py-5">
          {loading && <p className="py-8 text-center text-sm text-ink-faint">Loading…</p>}
          {error && <p className="py-8 text-center text-sm text-red-300">{error}</p>}

          {!loading && !error && (
            <>
              <div className="grid grid-cols-3 gap-3">
                <MiniStat icon={CheckCircle2} label="Lessons Completed" value={completions.length} accent="green" />
                <MiniStat icon={Flame} label="XP Earned" value={totalXp} accent="cyan" />
                <MiniStat icon={Trophy} label="Avg. Score" value={`${avgAccuracy}%`} accent="purple" />
                <MiniStat icon={Star} label="Highest Score" value={`${highestScore}%`} accent="gold" />
                <MiniStat
                  icon={Clock}
                  label="Avg. Time Taken"
                  value={formatMs(analyticsRow?.avgTimeTakenMs)}
                  accent="cyan"
                />
              </div>

              <div>
                <h4 className="font-display text-sm font-bold text-ink-primary">Completed Lessons ({completions.length})</h4>
                <div className="mt-2 divide-y divide-panel-line overflow-hidden rounded-xl border border-panel-line">
                  {completions.length === 0 && (
                    <p className="px-4 py-4 text-sm text-ink-faint">No lessons completed yet.</p>
                  )}
                  {completions.map((c, i) => (
                    <div key={`${c.world_id}-${c.lesson_id}-${c.difficulty_id}-${i}`} className="flex items-center justify-between gap-3 px-4 py-2.5">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-ink-primary">
                          {c.world_id} &middot; {c.lesson_id} ({c.difficulty_id})
                        </p>
                        <p className="text-xs text-ink-faint">
                          Grade {c.grade} &middot; {c.board} &middot; {new Date(c.completed_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex flex-none items-center gap-2">
                        <span className="font-mono text-xs text-neon-cyan">{c.accuracy}%</span>
                        <span className="font-mono text-xs text-reward-gold">{"\u2605".repeat(c.stars || 0)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function MiniStat({ icon: Icon, label, value, accent }) {
  const accents = {
    purple: "border-arcane-purple/40 text-arcane-purple bg-arcane-purple/10",
    cyan: "border-neon-cyan/40 text-neon-cyan bg-neon-cyan/10",
    green: "border-neon-green/40 text-neon-green bg-neon-green/10",
    gold: "border-reward-gold/40 text-reward-gold bg-reward-gold/10",
  };
  return (
    <div className="rounded-xl border border-panel-line bg-void/60 p-3">
      <span className={`flex h-8 w-8 items-center justify-center rounded-lg border ${accents[accent]}`}>
        <Icon className="h-4 w-4" strokeWidth={1.8} />
      </span>
      <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-ink-faint">{label}</p>
      <p className="font-display text-base font-bold text-ink-primary">{value}</p>
    </div>
  );
}
