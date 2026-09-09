import { useEffect, useState } from "react";
import { X, Flame, Trophy, CheckCircle2, ClipboardList } from "lucide-react";
import { useAdminData } from "../AdminContext.jsx";
import { getAdminStudentProgress } from "../api.js";
import StatusPill from "./StatusPill.jsx";

export default function StudentProgressModal({ student, onClose }) {
  const { data } = useAdminData();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!student) return;
    setLoading(true);
    getAdminStudentProgress(student.id)
      .then(setProgress)
      .catch(() => setProgress({ completedLessons: [], quizAttempts: [] }))
      .finally(() => setLoading(false));
  }, [student]);

  if (!student) return null;

  const lessonsById = Object.fromEntries(data.lessons.map((l) => [l.id, l]));
  const quizzesById = Object.fromEntries(data.quizzes.map((q) => [q.id, q]));

  const completedLessons = progress?.completedLessons ?? [];
  const quizAttempts = progress?.quizAttempts ?? [];
  const avgAccuracy = completedLessons.length
    ? Math.round(completedLessons.reduce((sum, l) => sum + (l.accuracy || 0), 0) / completedLessons.length)
    : 0;
  const avgQuizScore = quizAttempts.length
    ? Math.round(quizAttempts.reduce((sum, q) => sum + (q.score || 0), 0) / quizAttempts.length)
    : 0;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-void/80 backdrop-blur-sm p-4 py-10">
      <div className="w-full max-w-2xl rounded-2xl border border-panel-line bg-panel shadow-xl">
        <div className="flex items-center justify-between border-b border-panel-line px-5 py-4">
          <div>
            <h3 className="font-display text-lg font-bold text-ink-primary">{student.name}</h3>
            <p className="text-xs text-ink-muted">
              {student.email} &middot; Grade {student.grade} &middot; {student.board}
            </p>
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
          {loading && <p className="text-sm text-ink-faint">{"Loading progress\u2026"}</p>}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <MiniStat icon={Trophy} label="Level" value={student.level} accent="gold" />
            <MiniStat icon={Flame} label="XP" value={student.xp} accent="cyan" />
            <MiniStat icon={CheckCircle2} label="Avg. Lesson Accuracy" value={`${avgAccuracy}%`} accent="green" />
            <MiniStat icon={ClipboardList} label="Avg. Quiz Score" value={`${avgQuizScore}%`} accent="purple" />
          </div>

          <div>
            <h4 className="font-display text-sm font-bold text-ink-primary">Completed Lessons ({completedLessons.length})</h4>
            <div className="mt-2 divide-y divide-panel-line overflow-hidden rounded-xl border border-panel-line">
              {completedLessons.length === 0 && (
                <p className="px-4 py-4 text-sm text-ink-faint">No lessons completed yet.</p>
              )}
              {completedLessons.map((c, i) => (
                <div key={`${c.lessonId}-${i}`} className="flex items-center justify-between gap-3 px-4 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink-primary">
                      {lessonsById[c.lessonId]?.title ?? c.lessonId}
                    </p>
                    <p className="text-xs text-ink-faint">{c.completedAt}</p>
                  </div>
                  <div className="flex flex-none items-center gap-2">
                    <span className="font-mono text-xs text-neon-cyan">{c.accuracy}%</span>
                    <span className="font-mono text-xs text-reward-gold">{"\u2605".repeat(c.stars || 0)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold text-ink-primary">Quiz Scores ({quizAttempts.length})</h4>
            <div className="mt-2 divide-y divide-panel-line overflow-hidden rounded-xl border border-panel-line">
              {quizAttempts.length === 0 && <p className="px-4 py-4 text-sm text-ink-faint">No quizzes attempted yet.</p>}
              {quizAttempts.map((a, i) => (
                <div key={`${a.quizId}-${i}`} className="flex items-center justify-between gap-3 px-4 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink-primary">
                      {quizzesById[a.quizId]?.title ?? a.quizId}
                    </p>
                    <p className="text-xs text-ink-faint">{a.takenAt}</p>
                  </div>
                  <div className="flex flex-none items-center gap-2">
                    <span className="font-mono text-xs text-ink-primary">{a.score}%</span>
                    <StatusPill value={a.score >= 70 ? "published" : "draft"} />
                  </div>
                </div>
              ))}
            </div>
          </div>
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
