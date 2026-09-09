import { useCallback, useEffect, useMemo, useState } from "react";
import { useAdminData } from "../AdminContext.jsx";
import StatCard from "../components/StatCard.jsx";
import { Flame, Trophy, Percent, Users, Target, CalendarClock, BarChart3, School } from "lucide-react";
import { getPlatformQuizAttempts, getSchools } from "../api.js";
import { ApiError } from "../../api/client.js";

const DIFFICULTY_COLORS = {
  easy: "bg-neon-green",
  medium: "bg-neon-cyan",
  hard: "bg-reward-gold",
  expert: "bg-arcane-purple",
};

const SCORE_BANDS = [
  { key: "excellent", label: "Excellent (75+)", min: 75, color: "bg-neon-green" },
  { key: "good", label: "Good (50\u201374)", min: 50, color: "bg-neon-cyan" },
  { key: "needsWork", label: "Needs Work (25\u201349)", min: 25, color: "bg-reward-gold" },
  { key: "struggling", label: "Struggling (0\u201324)", min: 0, color: "bg-red-400" },
];

function dayKey(ts) {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function AnalyticsPage() {
  const { data } = useAdminData();
  const [attempts, setAttempts] = useState([]);
  const [schools, setSchools] = useState([]);
  const [schoolId, setSchoolId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getSchools()
      .then(setSchools)
      .catch(() => {});
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await getPlatformQuizAttempts(schoolId || undefined);
      setAttempts(Array.isArray(rows) ? rows : []);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't load attempt analytics.");
    } finally {
      setLoading(false);
    }
  }, [schoolId]);

  useEffect(() => {
    load();
  }, [load]);

  const avgLevel = useMemo(() => {
    if (!data.students.length) return 0;
    return Math.round(data.students.reduce((sum, s) => sum + (s.level || 0), 0) / data.students.length);
  }, [data.students]);

  const avgXp = useMemo(() => {
    if (!data.students.length) return 0;
    return Math.round(data.students.reduce((sum, s) => sum + (s.xp || 0), 0) / data.students.length);
  }, [data.students]);

  const attemptStats = useMemo(() => {
    if (!attempts.length) {
      return {
        total: 0,
        today: 0,
        avgScore: 0,
        passRate: 0,
        studentsAttempted: 0,
        byDate: [],
        byClass: [],
        byBand: [],
        maxDay: 1,
      };
    }

    const today = dayKey(Date.now());
    let todayCount = 0;
    let scoreSum = 0;
    const byDateMap = new Map();
    const byClassMap = new Map();
    const bandCounts = { excellent: 0, good: 0, needsWork: 0, struggling: 0 };
    const studentSet = new Set();

    attempts.forEach((a) => {
      const score = a.score ?? 0;
      const ts = new Date(a.completed_at).getTime();
      studentSet.add(a.studentId);
      scoreSum += score;
      if (dayKey(ts) === today) todayCount += 1;

      const dk = Number.isFinite(ts) ? dayKey(ts) : "unknown";
      byDateMap.set(dk, (byDateMap.get(dk) ?? 0) + 1);

      const cls = a.grade != null ? `Class ${a.grade}` : "Unknown";
      byClassMap.set(cls, { count: (byClassMap.get(cls)?.count ?? 0) + 1, scoreSum: (byClassMap.get(cls)?.scoreSum ?? 0) + score });

      const band = SCORE_BANDS.find((b) => score >= b.min);
      bandCounts[band?.key ?? "struggling"] += 1;
    });

    const byDate = [...byDateMap.entries()]
      .sort((x, y) => x[0].localeCompare(y[0]))
      .slice(-14)
      .map(([date, count]) => ({ date, count }));

    const byClass = [...byClassMap.entries()]
      .map(([label, v]) => ({ label, count: v.count, avg: Math.round(v.scoreSum / v.count) }))
      .sort((a, b) => a.label.localeCompare(b.label, undefined, { numeric: true }));

    const byBand = SCORE_BANDS.map((b) => ({
      ...b,
      count: bandCounts[b.key],
    }));

    const avgScore = Math.round(scoreSum / attempts.length);
    const passRate = Math.round((bandCounts.excellent + bandCounts.good) / attempts.length * 100);

    return {
      total: attempts.length,
      today: todayCount,
      avgScore,
      passRate,
      studentsAttempted: studentSet.size,
      byDate,
      byClass,
      byBand,
      maxDay: Math.max(1, ...byDate.map((d) => d.count)),
    };
  }, [attempts]);

  const questionsByDifficulty = useMemo(() => {
    const counts = { easy: 0, medium: 0, hard: 0, expert: 0 };
    data.questions.forEach((q) => {
      if (counts[q.difficulty] !== undefined) counts[q.difficulty] += 1;
    });
    return counts;
  }, [data.questions]);
  const maxDifficulty = Math.max(1, ...Object.values(questionsByDifficulty));

  const topStudents = useMemo(
    () => [...data.students].sort((a, b) => (b.xp || 0) - (a.xp || 0)).slice(0, 5),
    [data.students]
  );

  const courseCoverage = useMemo(
    () =>
      data.courses.map((c) => {
        const chapters = data.chapters.filter((ch) => ch.courseId === c.id);
        const lessons = data.lessons.filter((l) => chapters.some((ch) => ch.id === l.chapterId));
        return { id: c.id, name: c.name, chapters: chapters.length, lessons: lessons.length };
      }),
    [data.courses, data.chapters, data.lessons]
  );
  const maxLessons = Math.max(1, ...courseCoverage.map((c) => c.lessons));

  const maxClassCount = Math.max(1, ...attemptStats.byClass.map((c) => c.count));
  const maxBand = Math.max(1, ...attemptStats.byBand.map((b) => b.count));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink-primary">Analytics</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Engagement, attempt performance and content-coverage metrics across the platform.
          </p>
        </div>
        <select
          value={schoolId}
          onChange={(e) => setSchoolId(e.target.value)}
          className="rounded-lg border border-panel-line bg-void px-3 py-2 text-sm text-ink-primary outline-none focus:border-neon-cyan"
        >
          <option value="">All Schools</option>
          {schools.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Users} label="Total Students" value={data.students.length} accent="purple" />
        <StatCard icon={Trophy} label="Avg. Level" value={avgLevel} accent="gold" />
        <StatCard icon={Flame} label="Avg. XP" value={avgXp} accent="cyan" />
        <StatCard
          icon={Percent}
          label="Published Content"
          value={`${Math.round(
            (data.questions.filter((q) => q.status === "published").length / Math.max(1, data.questions.length)) * 100
          )}%`}
          sublabel="of questions"
          accent="green"
        />
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-6 text-center">
          <p className="text-sm text-red-400">{error}</p>
          <button
            type="button"
            onClick={load}
            className="mt-3 rounded-lg border border-panel-line px-4 py-2 font-display text-xs font-semibold text-ink-muted hover:text-ink-primary"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard
              icon={Target}
              label="Total Attempts"
              value={loading ? "\u2026" : attemptStats.total}
              accent="cyan"
            />
            <StatCard
              icon={CalendarClock}
              label="Attempts Today"
              value={loading ? "\u2026" : attemptStats.today}
              accent="gold"
            />
            <StatCard
              icon={Percent}
              label="Avg. Score"
              value={loading ? "\u2026" : `${attemptStats.avgScore}%`}
              accent="green"
            />
            <StatCard
              icon={Trophy}
              label="Pass Rate (50%+)"
              value={loading ? "\u2026" : `${attemptStats.passRate}%`}
              sublabel={`${attemptStats.studentsAttempted} students attempted`}
              accent="purple"
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-panel-line bg-panel/60 p-5">
              <h3 className="font-display text-base font-bold text-ink-primary">Attempt Distribution by Score</h3>
              <div className="mt-4 space-y-3">
                {attemptStats.byBand.map((b) => (
                  <div key={b.key} className="flex items-center gap-3">
                    <span className="w-36 flex-none truncate font-mono text-xs text-ink-muted">{b.label}</span>
                    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-panel-line">
                      <div className={`h-full rounded-full ${b.color}`} style={{ width: `${(b.count / maxBand) * 100}%` }} />
                    </div>
                    <span className="w-8 flex-none text-right font-mono text-xs text-ink-primary">{b.count}</span>
                  </div>
                ))}
                {attempts.length === 0 && !loading && <p className="text-sm text-ink-faint">No attempts recorded yet.</p>}
              </div>
            </div>

            <div className="rounded-2xl border border-panel-line bg-panel/60 p-5">
              <h3 className="font-display text-base font-bold text-ink-primary">Attempts by Class</h3>
              <div className="mt-4 space-y-3">
                {attemptStats.byClass.map((c) => (
                  <div key={c.label} className="flex items-center gap-3">
                    <span className="w-24 flex-none font-mono text-xs text-ink-muted">{c.label}</span>
                    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-panel-line">
                      <div className="h-full rounded-full bg-arcane-purple" style={{ width: `${(c.count / maxClassCount) * 100}%` }} />
                    </div>
                    <span className="w-24 flex-none text-right font-mono text-xs text-ink-primary">
                      {c.count} attempts
                    </span>
                  </div>
                ))}
                {attemptStats.byClass.length === 0 && !loading && <p className="text-sm text-ink-faint">No attempts recorded yet.</p>}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-panel-line bg-panel/60 p-5">
            <h3 className="flex items-center gap-2 font-display text-base font-bold text-ink-primary">
              <BarChart3 className="h-4 w-4 text-neon-cyan" /> Attempts by Day (last 14)
            </h3>
            <div className="mt-4 flex items-end gap-1.5">
              {attemptStats.byDate.map((d) => (
                <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
                  <span className="font-mono text-[10px] text-ink-faint">{d.count}</span>
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-arcane-purple/50 to-neon-cyan/70"
                    style={{ height: `${Math.max(3, (d.count / attemptStats.maxDay) * 90)}px` }}
                    title={`${d.date} · ${d.count} attempts`}
                  />
                  <span className="font-mono text-[9px] text-ink-faint">{d.date.slice(5)}</span>
                </div>
              ))}
              {attempts.length === 0 && !loading && <p className="text-sm text-ink-faint">No attempts recorded yet.</p>}
            </div>
          </div>
        </>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-panel-line bg-panel/60 p-5">
          <h3 className="font-display text-base font-bold text-ink-primary">Question Bank by Difficulty</h3>
          <div className="mt-4 space-y-3">
            {Object.entries(questionsByDifficulty).map(([diff, count]) => (
              <div key={diff} className="flex items-center gap-3">
                <span className="w-16 flex-none font-mono text-xs capitalize text-ink-muted">{diff}</span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-panel-line">
                  <div
                    className={`h-full rounded-full ${DIFFICULTY_COLORS[diff]}`}
                    style={{ width: `${(count / maxDifficulty) * 100}%` }}
                  />
                </div>
                <span className="w-6 flex-none text-right font-mono text-xs text-ink-primary">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-panel-line bg-panel/60 p-5">
          <h3 className="flex items-center gap-2 font-display text-base font-bold text-ink-primary">
            <School className="h-4 w-4 text-reward-gold" /> Top Students by XP
          </h3>
          <div className="mt-3 divide-y divide-panel-line">
            {topStudents.map((s, i) => (
              <div key={s.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-arcane-purple/15 font-mono text-[11px] font-bold text-arcane-purple">
                    {i + 1}
                  </span>
                  <p className="truncate font-display text-sm font-semibold text-ink-primary">{s.name}</p>
                </div>
                <span className="flex-none font-mono text-xs text-reward-gold">{s.xp} XP</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-panel-line bg-panel/60 p-5">
        <h3 className="font-display text-base font-bold text-ink-primary">Course Coverage</h3>
        <div className="mt-4 space-y-3">
          {courseCoverage.map((c) => (
            <div key={c.id} className="flex items-center gap-3">
              <span className="w-40 flex-none truncate font-mono text-xs text-ink-muted">{c.name}</span>
              <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-panel-line">
                <div className="h-full rounded-full bg-neon-cyan" style={{ width: `${(c.lessons / maxLessons) * 100}%` }} />
              </div>
              <span className="w-28 flex-none text-right font-mono text-xs text-ink-primary">
                {c.chapters} ch &middot; {c.lessons} lsn
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}