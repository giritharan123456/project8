import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  Layers,
  BookMarked,
  LibraryBig,
  HelpCircle,
  ClipboardList,
  ClipboardCheck,
  Gamepad2,
  FilePlus,
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  Calendar,
  Zap,
  Trophy,
  Target,
  Flame,
} from "lucide-react";
import { useTeacherData } from "../TeacherContext.jsx";
import StatCard from "../../admin/components/StatCard.jsx";
import StatusPill from "../../admin/components/StatusPill.jsx";
import { RosterError } from "./SchoolPage.jsx";

function resolveName(id, list, key = "id", display = "name") {
  const found = list.find((item) => item[key] === id);
  return found ? found[display] : id;
}

export default function DashboardPage() {
  const { currentTeacher, data, rosterLoading, rosterError, refetchRoster } = useTeacherData();

  const publishedAssignments = data.assignments.filter((a) => a.status === "published").length;
  const gradedResults = data.results.filter((r) => r.status === "graded").length;
  const pendingResults = data.results.filter((r) => r.status !== "graded").length;

  const maxByClass = Math.max(1, ...data.classes.map((c) => c.studentCount));

  const upcomingAssignments = [...data.assignments]
    .filter((a) => a.status === "published")
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  const studentsById = Object.fromEntries(data.students.map((s) => [s.id, s]));
  const lessonTitleById = useMemo(() => Object.fromEntries(data.lessons.map((l) => [l.id, l.title])), [data.lessons]);

  // Weekly activity and engagement figures come from real, subject-scoped
  // completions/submissions -- never hard-coded Chemistry demo numbers.
  const weeklyActivity = useMemo(() => {
    const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();
    const rows = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      rows.push({ key: d.toDateString(), day: names[d.getDay()], quizzes: 0, lessons: 0 });
    }
    const byKey = new Map(rows.map((r) => [r.key, r]));
    (data.quizResults ?? []).forEach((r) => {
      const row = byKey.get(r.completed_at ? new Date(r.completed_at).toDateString() : null);
      if (row !== undefined) row.quizzes += 1;
    });
    (data.results ?? []).forEach((r) => {
      const row = byKey.get(r.submittedAt ? new Date(r.submittedAt).toDateString() : null);
      if (row !== undefined) row.lessons += 1;
    });
    return rows;
  }, [data.quizResults, data.results]);

  const engagement = useMemo(() => {
    const qr = data.quizResults ?? [];
    const activeToday = new Set(qr.map((r) => r.studentId)).size;
    const withTime = qr.filter((r) => r.avgTimeTakenMs != null);
    const avgSessionMinutes = withTime.length
      ? Math.round((withTime.reduce((s, r) => s + r.avgTimeTakenMs, 0) / withTime.length / 60000) * 10) / 10
      : 0;
    const graded = data.results.filter((r) => r.status === "graded").length;
    const completionRate = data.results.length ? Math.round((graded / data.results.length) * 100) : 0;
    const streakLeaders = [...(data.leaderboard ?? [])]
      .filter((s) => (s.streak ?? 0) > 0)
      .sort((a, b) => (b.streak ?? 0) - (a.streak ?? 0))
      .slice(0, 3);
    return { activeToday, avgSessionMinutes, completionRate, streakLeaders };
  }, [data.quizResults, data.results, data.leaderboard]);

  const recentQuizRows = useMemo(
    () =>
      (data.quizResults ?? []).slice(0, 6).map((r) => ({
        id: `${r.studentId}-${r.completed_at}`,
        student: r.studentName ?? r.studentId,
        quiz: lessonTitleById[r.lesson_id] ?? `World ${r.world_id ?? "play"}`,
        score: Math.round(r.score ?? 0),
        date: (r.completed_at ?? "").slice(0, 10),
        stars: r.stars ?? 0,
      })),
    [data.quizResults, lessonTitleById]
  );

  const maxActivity = Math.max(1, ...weeklyActivity.map((d) => Math.max(d.quizzes, d.lessons)));

  if (rosterLoading) return <p className="text-sm text-ink-faint">Loading your dashboard…</p>;
  if (rosterError) return <RosterError message={rosterError} onRetry={refetchRoster} />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-ink-primary">
          Welcome back{currentTeacher?.name ? `, ${currentTeacher.name.split(" ")[0]}` : ""}
        </h2>
        <p className="mt-1 text-sm text-ink-muted">
          A snapshot of {data.school?.name ?? "your school"}, filtered server-side to your account.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={GraduationCap} label="My Students" value={data.students.length} accent="purple" />
        <StatCard icon={Layers} label="My Classes" value={data.classes.length} accent="cyan" />
        <StatCard icon={BookMarked} label="My Subjects" value={data.subjects.length} accent="green" />
        <StatCard icon={LibraryBig} label="Lessons" value={data.lessons.length} sublabel={`${data.questions.length} questions`} accent="gold" />
        <StatCard icon={HelpCircle} label="Questions" value={data.questions.length} accent="purple" />
        <StatCard icon={ClipboardList} label="Assignments" value={data.assignments.length} sublabel={`${publishedAssignments} published`} accent="cyan" />
        <StatCard icon={ClipboardCheck} label="Graded Results" value={gradedResults} sublabel={`${pendingResults} pending`} accent="green" />
        <StatCard icon={Flame} label="Active Students" value={engagement.activeToday} sublabel="active this week" accent="gold" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          to="/teacher/live-games"
          className="group flex items-center gap-3 rounded-2xl border border-panel-line bg-panel/60 p-4 transition-colors hover:border-neon-green/40 hover:bg-neon-green/5"
        >
          <span className="flex h-12 w-12 flex-none items-center justify-center rounded-xl border border-neon-green/40 bg-neon-green/10 text-neon-green transition-colors group-hover:bg-neon-green/20">
            <Gamepad2 className="h-6 w-6" strokeWidth={1.8} />
          </span>
          <div>
            <p className="font-display text-sm font-bold text-ink-primary">Start Live Game</p>
            <p className="text-xs text-ink-muted">Real-time quiz battles</p>
          </div>
        </Link>
        <Link
          to="/teacher/assignments"
          className="group flex items-center gap-3 rounded-2xl border border-panel-line bg-panel/60 p-4 transition-colors hover:border-arcane-purple/40 hover:bg-arcane-purple/5"
        >
          <span className="flex h-12 w-12 flex-none items-center justify-center rounded-xl border border-arcane-purple/40 bg-arcane-purple/10 text-arcane-purple transition-colors group-hover:bg-arcane-purple/20">
            <FilePlus className="h-6 w-6" strokeWidth={1.8} />
          </span>
          <div>
            <p className="font-display text-sm font-bold text-ink-primary">Create Assignment</p>
            <p className="text-xs text-ink-muted">Assign work to classes</p>
          </div>
        </Link>
        <Link
          to="/teacher/analytics-detail"
          className="group flex items-center gap-3 rounded-2xl border border-panel-line bg-panel/60 p-4 transition-colors hover:border-neon-cyan/40 hover:bg-neon-cyan/5"
        >
          <span className="flex h-12 w-12 flex-none items-center justify-center rounded-xl border border-neon-cyan/40 bg-neon-cyan/10 text-neon-cyan transition-colors group-hover:bg-neon-cyan/20">
            <BarChart3 className="h-6 w-6" strokeWidth={1.8} />
          </span>
          <div>
            <p className="font-display text-sm font-bold text-ink-primary">View Reports</p>
            <p className="text-xs text-ink-muted">Detailed analytics</p>
          </div>
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-panel-line bg-panel/60 p-5">
          <h3 className="font-display text-base font-bold text-ink-primary">Weekly Activity</h3>
          <div className="mt-4">
            <div className="flex items-end gap-2">
              {weeklyActivity.map((d, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <div className="flex w-full flex-col items-center gap-0.5">
                    <div
                      className="w-full rounded-t bg-neon-cyan/80"
                      style={{ height: `${(d.quizzes / maxActivity) * 80}px` }}
                      title={`${d.quizzes} quizzes`}
                    />
                    <div
                      className="w-full rounded-b bg-arcane-purple/60"
                      style={{ height: `${(d.lessons / maxActivity) * 40}px` }}
                      title={`${d.lessons} lessons`}
                    />
                  </div>
                  <span className="font-mono text-[10px] text-ink-faint">{d.day}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded bg-neon-cyan/80" />
                <span className="text-[10px] text-ink-muted">Quizzes</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded bg-arcane-purple/60" />
                <span className="text-[10px] text-ink-muted">Lessons</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-panel-line bg-panel/60 p-5">
          <h3 className="font-display text-base font-bold text-ink-primary">Student Engagement</h3>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-panel-line bg-void/40 p-3">
              <Users className="h-4 w-4 text-neon-cyan" />
              <p className="mt-1.5 font-display text-lg font-bold text-ink-primary">{engagement.activeToday || "\u2014"}</p>
              <p className="text-[10px] text-ink-faint">Active This Week</p>
            </div>
            <div className="rounded-xl border border-panel-line bg-void/40 p-3">
              <Clock className="h-4 w-4 text-arcane-purple" />
              <p className="mt-1.5 font-display text-lg font-bold text-ink-primary">{engagement.avgSessionMinutes || "\u2014"}m</p>
              <p className="text-[10px] text-ink-faint">Avg. Session</p>
            </div>
            <div className="rounded-xl border border-panel-line bg-void/40 p-3">
              <Target className="h-4 w-4 text-neon-green" />
              <p className="mt-1.5 font-display text-lg font-bold text-ink-primary">{engagement.completionRate}%</p>
              <p className="text-[10px] text-ink-faint">Completion Rate</p>
            </div>
            <div className="rounded-xl border border-panel-line bg-void/40 p-3">
              <Zap className="h-4 w-4 text-reward-gold" />
              <p className="mt-1.5 font-display text-lg font-bold text-ink-primary">{engagement.streakLeaders[0]?.streak ?? "\u2014"}</p>
              <p className="text-[10px] text-ink-faint">Top Streak (days)</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-ink-faint">Streak Leaders</p>
            {engagement.streakLeaders.map((s, i) => (
              <div key={i} className="flex items-center gap-2 py-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-reward-gold/15 font-mono text-[10px] font-bold text-reward-gold">
                  {i + 1}
                </span>
                <span className="flex-1 text-xs text-ink-primary">{s.name}</span>
                <span className="flex items-center gap-0.5 font-mono text-[10px] text-reward-gold">
                  <Flame className="h-3 w-3" /> {s.streak}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-panel-line bg-panel/60 p-5">
          <h3 className="font-display text-base font-bold text-ink-primary">My Students by Class</h3>
          <div className="mt-4 space-y-3">
            {data.classes.length === 0 && <p className="text-sm text-ink-faint">No students yet.</p>}
            {data.classes.map((c) => (
              <div key={`${c.grade}-${c.board}`} className="flex items-center gap-3">
                <span className="w-24 flex-none truncate font-mono text-xs text-ink-muted">
                  Gr {c.grade} &middot; {c.board}
                </span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-panel-line">
                  <div className="h-full rounded-full bg-arcane-purple" style={{ width: `${(c.studentCount / maxByClass) * 100}%` }} />
                </div>
                <span className="w-6 flex-none text-right font-mono text-xs text-ink-primary">{c.studentCount}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-panel-line bg-panel/60 p-5">
          <h3 className="font-display text-base font-bold text-ink-primary">Upcoming Assignments</h3>
          <div className="mt-3 divide-y divide-panel-line">
            {upcomingAssignments.length === 0 && <p className="py-4 text-sm text-ink-faint">Nothing scheduled.</p>}
            {upcomingAssignments.map((a) => (
              <div key={a.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate font-display text-sm font-semibold text-ink-primary">{a.title}</p>
                  <p className="truncate text-xs text-ink-muted">
                    Grade {resolveName(a.classId, data.classes, "id", "grade")} &middot; {a.boardId}
                  </p>
                </div>
                <span className="flex-none font-mono text-xs text-ink-faint">{a.dueDate}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-panel-line bg-panel/60 p-5">
        <h3 className="font-display text-base font-bold text-ink-primary">Recent Quiz Results</h3>
        <div className="mt-3 divide-y divide-panel-line">
          {recentQuizRows.length === 0 && <p className="py-4 text-sm text-ink-faint">No submissions yet.</p>}
          {recentQuizRows.map((r) => (
            <div key={r.id} className="flex items-center justify-between gap-3 py-2.5">
              <div className="min-w-0">
                <p className="truncate font-display text-sm font-semibold text-ink-primary">{r.student}</p>
                <p className="truncate text-xs text-ink-muted">{r.quiz}</p>
              </div>
              <div className="flex flex-none items-center gap-3">
                <span className="font-mono text-xs text-ink-faint">{r.date}</span>
                <span className="font-mono text-xs text-reward-gold">{"\u2605".repeat(r.stars)}</span>
                <span className="font-mono text-xs text-neon-cyan">{r.score}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-panel-line bg-panel/60 p-5">
        <h3 className="font-display text-base font-bold text-ink-primary">Recent Results</h3>
        <div className="mt-3 divide-y divide-panel-line">
          {data.results.length === 0 && <p className="py-4 text-sm text-ink-faint">No submissions yet.</p>}
          {data.results.slice(0, 6).map((r) => (
            <div key={r.id} className="flex items-center justify-between gap-3 py-2.5">
              <div className="min-w-0">
                <p className="truncate font-display text-sm font-semibold text-ink-primary">
                  {studentsById[r.studentId]?.name ?? r.studentId}
                </p>
                <p className="truncate text-xs text-ink-muted">{resolveName(r.assignmentId, data.assignments)}</p>
              </div>
              <div className="flex flex-none items-center gap-2">
                {r.score != null && <span className="font-mono text-xs text-reward-gold">{r.score}%</span>}
                <StatusPill value={r.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
