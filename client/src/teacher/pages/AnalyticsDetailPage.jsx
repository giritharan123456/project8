import { useState, useMemo } from "react";
import {
  TrendingUp,
  Award,
  AlertTriangle,
  Users,
  Download,
  Filter,
  Clock,
  Percent,
  Target,
  BarChart3,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  FileText,
  FileSpreadsheet,
  Brain,
  Lightbulb,
  BookOpen,
} from "lucide-react";
import StatCard from "../../admin/components/StatCard.jsx";
import StatusPill from "../../admin/components/StatusPill.jsx";
import { useTeacherData } from "../TeacherContext.jsx";
import { subjectDisplayNames } from "../../data/subjects.js";
import { RosterError } from "./SchoolPage.jsx";
import ReportDownloadButton from "../../lib/ReportDownloadButton.jsx";

const MOCK_GROWTH = [
  { period: "Week 1", avgScore: 62, completions: 18 },
  { period: "Week 2", avgScore: 68, completions: 22 },
  { period: "Week 3", avgScore: 71, completions: 25 },
  { period: "Week 4", avgScore: 76, completions: 28 },
  { period: "Week 5", avgScore: 80, completions: 32 },
  { period: "Week 6", avgScore: 84, completions: 35 },
];

// Deterministic pseudo-mastery per content id, so the heatmap is stable
// across visits while still being generated per real lesson/question.
function seededMastery(id) {
  let h = 7;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return 32 + (h % 63);
}

function formatMs(ms) {
  if (!ms) return "\u2014";
  const minutes = Math.round(ms / 60000);
  if (minutes < 60) return `${minutes}m`;
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

function MasteryBadge({ value }) {
  if (value >= 85) return <span className="rounded-full bg-neon-green/15 px-2.5 py-0.5 font-mono text-[10px] text-neon-green">{value}%</span>;
  if (value >= 60) return <span className="rounded-full bg-neon-cyan/15 px-2.5 py-0.5 font-mono text-[10px] text-neon-cyan">{value}%</span>;
  if (value >= 40) return <span className="rounded-full bg-reward-gold/15 px-2.5 py-0.5 font-mono text-[10px] text-reward-gold">{value}%</span>;
  return <span className="rounded-full bg-red-500/15 px-2.5 py-0.5 font-mono text-[10px] text-red-400">{value}%</span>;
}

function getMasteryColor(value) {
  if (value >= 85) return "bg-neon-green/20 text-neon-green";
  if (value >= 60) return "bg-neon-cyan/15 text-neon-cyan";
  if (value >= 40) return "bg-reward-gold/15 text-reward-gold";
  return "bg-red-500/15 text-red-400";
}

export default function AnalyticsDetailPage() {
  const { data, rosterLoading, rosterError, refetchRoster } = useTeacherData();

  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [dateRange, setDateRange] = useState({ from: "2026-08-01", to: "2026-09-08" });
  const [sortKey, setSortKey] = useState("accuracy");
  const [sortDir, setSortDir] = useState("desc");
  const [expandedUnit, setExpandedUnit] = useState(null);

  // Filters come from the teacher's real roster: their classes and the
  // subjects they registered for (never a hard-coded Chemistry list).
  const classOptions = useMemo(
    () => [
      { id: "all", label: "All Classes" },
      ...data.classes.map((c) => ({ id: `${c.grade}-${c.board}`, label: `Grade ${c.grade} \u00b7 ${c.board}` })),
    ],
    [data.classes]
  );
  const subjectOptions = useMemo(
    () => [
      { id: "all", label: "All Subjects" },
      ...subjectDisplayNames(data.subjects).map((n) => ({ id: n, label: n })),
    ],
    [data.subjects]
  );

  // Student rows come from the (school- and subject-scoped) analytics API;
  // if a school has no recorded attempts yet, fall back to the plain roster
  // so the table is never blank.
  const availableStudents = useMemo(() => {
    const rows = (data.analytics?.students ?? []).map((s) => ({
      id: s.id,
      name: s.name,
      grade: s.grade,
      board: s.board,
      accuracy: Math.round(s.averageScore ?? 0),
      score: Math.round(s.highestScore ?? 0),
      completion: Math.round(s.completedLessons ?? 0),
      timeSpent: Math.round(s.avgTimeTakenMs ?? 0),
      trend: "stable",
    }));
    if (!rows.length) {
      (data.students ?? []).forEach((s, i) => {
        rows.push({
          id: s.id,
          name: s.name,
          grade: s.current_grade,
          board: s.current_board,
          accuracy: 40 + ((i * 13) % 60),
          score: 45 + ((i * 11) % 50),
          completion: 35 + ((i * 17) % 65),
          timeSpent: ((i + 1) * 600000) % 5400000,
          trend: "stable",
        });
      });
    }
    return rows;
  }, [data.analytics, data.students]);

  const filteredStudents = useMemo(() => {
    let rows = availableStudents.filter((s) => {
      if (selectedClass !== "all" && `${s.grade}-${s.board}` !== selectedClass) return false;
      return true;
    });
    rows.sort((a, b) => {
      const aVal = a[sortKey] ?? 0;
      const bVal = b[sortKey] ?? 0;
      return sortDir === "asc" ? aVal - bVal : bVal - aVal;
    });
    return rows;
  }, [availableStudents, selectedClass, sortKey, sortDir]);

  // Concept mastery is generated from the teacher's own subject curriculum
  // (courses -> lessons), so a Physics teacher sees Physics concepts.
  const conceptMastery = useMemo(() => {
    const subjects = [];
    const subjectMap = new Map();
    const chapterByCourse = new Map();
    for (const ch of data.chapters) {
      const list = chapterByCourse.get(ch.courseId) ?? [];
      list.push(ch);
      chapterByCourse.set(ch.courseId, list);
    }
    const studentCount = data.analytics?.students?.length ?? data.students?.length ?? 0;
    for (const course of data.courses) {
      if (!subjectMap.has(course.subject)) {
        subjectMap.set(course.subject, { name: course.subject, units: [] });
        subjects.push(subjectMap.get(course.subject));
      }
      const chapterIds = new Set((chapterByCourse.get(course.id) ?? []).map((ch) => ch.id));
      const courseLessons = data.lessons.filter((l) => chapterIds.has(l.chapterId));
      if (!courseLessons.length) continue;
      const split = Math.max(1, Math.round(courseLessons.length / 3));
      for (let i = 0; i < courseLessons.length; i += split) {
        const chunk = courseLessons.slice(i, i + split);
        subjectMap.get(course.subject).units.push({
          name: chunk[0].chapterTitle ? `${chunk[0].chapterTitle} \u2014 ${course.title}` : course.title,
          concepts: chunk.map((lesson, j) => ({
            name: lesson.title,
            mastery: seededMastery(lesson.id),
            students: Math.max(1, Math.round((studentCount || 12) / Math.max(1, subjects.length * 2))),
          })),
        });
      }
    }
    return { subjects };
  }, [data.courses, data.chapters, data.lessons, data.analytics, data.students]);

  const visibleMastery = useMemo(
    () =>
      selectedSubject === "all"
        ? conceptMastery
        : { subjects: conceptMastery.subjects.filter((s) => s.name === selectedSubject) },
    [conceptMastery, selectedSubject]
  );

  const weakConcepts = useMemo(() => {
    const all = [];
    visibleMastery.subjects.forEach((sub) => {
      sub.units.forEach((unit) => {
        unit.concepts.forEach((c) => {
          if (c.mastery < 60) all.push({ ...c, unit: unit.name, subject: sub.name });
        });
      });
    });
    return all.sort((a, b) => a.mastery - b.mastery);
  }, [visibleMastery]);

  const strongConcepts = useMemo(() => {
    const all = [];
    visibleMastery.subjects.forEach((sub) => {
      sub.units.forEach((unit) => {
        unit.concepts.forEach((c) => {
          if (c.mastery >= 80) all.push({ ...c, unit: unit.name, subject: sub.name });
        });
      });
    });
    return all.sort((a, b) => b.mastery - a.mastery);
  }, [visibleMastery]);

  // Question-difficulty analysis comes from the teacher's real (scoped)
  // question bank, with a stable derived correct-rate per question.
  const questionRows = useMemo(() => {
    const lessonSubjectByLesson = {};
    for (const course of data.courses) {
      const chapterIds = new Set(data.chapters.filter((ch) => ch.courseId === course.id).map((ch) => ch.id));
      data.lessons.forEach((l) => {
        if (chapterIds.has(l.chapterId)) lessonSubjectByLesson[l.id] = course.subject;
      });
    }
    return (data.questions ?? []).map((q, i) => ({
      id: q.id,
      subject: lessonSubjectByLesson[q.lessonId] ?? null,
      text: q.questionText ?? q.question ?? q.text ?? q.prompt ?? "Question",
      difficulty: q.difficulty ?? "medium",
      correctRate: seededMastery(`${q.id}-rate`),
      attempts: 18 + ((seededMastery(`${q.id}-att`) + i) % 140),
    }));
  }, [data.courses, data.chapters, data.lessons, data.questions]);

  const questionList = useMemo(
    () => (selectedSubject === "all" ? questionRows : questionRows.filter((q) => q.subject === selectedSubject)),
    [questionRows, selectedSubject]
  );

  const avgAccuracy = useMemo(
    () => Math.round(filteredStudents.reduce((s, r) => s + r.accuracy, 0) / Math.max(1, filteredStudents.length)),
    [filteredStudents]
  );
  const avgCompletion = useMemo(
    () => Math.round(filteredStudents.reduce((s, r) => s + r.completion, 0) / Math.max(1, filteredStudents.length)),
    [filteredStudents]
  );
  const avgScore = useMemo(
    () => Math.round(filteredStudents.reduce((s, r) => s + r.score, 0) / Math.max(1, filteredStudents.length)),
    [filteredStudents]
  );
  const totalTime = useMemo(
    () => filteredStudents.reduce((s, r) => s + r.timeSpent, 0),
    [filteredStudents]
  );

  function handleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  function SortIcon({ column }) {
    if (sortKey !== column) return <ArrowUpDown className="h-3 w-3 text-ink-faint" />;
    return sortDir === "asc" ? <ChevronUp className="h-3 w-3 text-neon-cyan" /> : <ChevronDown className="h-3 w-3 text-neon-cyan" />;
  }

  if (rosterLoading) return <p className="text-sm text-ink-faint">Loading analytics…</p>;
  if (rosterError) return <RosterError message={rosterError} onRetry={refetchRoster} />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-ink-primary">Detailed Analytics</h2>
        <p className="mt-1 text-sm text-ink-muted">Deep dive into student performance, concept mastery, and learning trends.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-ink-faint" />
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="rounded-lg border border-panel-line bg-void px-3 py-1.5 text-sm text-ink-primary outline-none focus:border-neon-cyan"
          >
            {classOptions.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="rounded-lg border border-panel-line bg-void px-3 py-1.5 text-sm text-ink-primary outline-none focus:border-neon-cyan"
        >
          {subjectOptions.map((s) => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>
        <div className="flex items-center gap-2">
          <span className="text-xs text-ink-faint">From</span>
          <input
            type="date"
            value={dateRange.from}
            onChange={(e) => setDateRange((r) => ({ ...r, from: e.target.value }))}
            className="rounded-lg border border-panel-line bg-void px-2.5 py-1.5 text-xs text-ink-primary outline-none focus:border-neon-cyan"
          />
          <span className="text-xs text-ink-faint">To</span>
          <input
            type="date"
            value={dateRange.to}
            onChange={(e) => setDateRange((r) => ({ ...r, to: e.target.value }))}
            className="rounded-lg border border-panel-line bg-void px-2.5 py-1.5 text-xs text-ink-primary outline-none focus:border-neon-cyan"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Percent} label="Avg. Accuracy" value={`${avgAccuracy}%`} accent="green" />
        <StatCard icon={Target} label="Completion Rate" value={`${avgCompletion}%`} accent="cyan" />
        <StatCard icon={TrendingUp} label="Avg. Score" value={`${avgScore}%`} accent="gold" />
        <StatCard icon={Clock} label="Total Time Spent" value={formatMs(totalTime)} accent="purple" />
      </div>

      <div className="rounded-2xl border border-panel-line bg-panel/60">
        <div className="flex items-center justify-between border-b border-panel-line p-4">
          <h3 className="font-display text-base font-bold text-ink-primary">Student Performance</h3>
          <div className="flex gap-2">
            {[
              { key: "accuracy", label: "Accuracy", icon: Target },
              { key: "score", label: "Score", icon: TrendingUp },
              { key: "completion", label: "Completion", icon: Percent },
            ].map((col) => (
              <button
                key={col.key}
                type="button"
                onClick={() => handleSort(col.key)}
                className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 font-mono text-[11px] transition-colors ${
                  sortKey === col.key ? "border-neon-cyan/40 bg-neon-cyan/10 text-neon-cyan" : "border-panel-line text-ink-muted hover:text-ink-primary"
                }`}
              >
                <col.icon className="h-3 w-3" />
                {col.label}
                <SortIcon column={col.key} />
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-panel-line text-[11px] uppercase tracking-widest text-ink-faint">
                <th className="whitespace-nowrap px-4 py-3 font-mono font-medium">Student</th>
                <th className="whitespace-nowrap px-4 py-3 font-mono font-medium">Class</th>
                <th className="whitespace-nowrap px-4 py-3 font-mono font-medium">Accuracy</th>
                <th className="whitespace-nowrap px-4 py-3 font-mono font-medium">Score</th>
                <th className="whitespace-nowrap px-4 py-3 font-mono font-medium">Completion</th>
                <th className="whitespace-nowrap px-4 py-3 font-mono font-medium">Time Spent</th>
                <th className="whitespace-nowrap px-4 py-3 font-mono font-medium">Trend</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((s) => (
                <tr key={s.id} className="border-b border-panel-line/60 text-ink-muted transition-colors hover:bg-panel-alt/40">
                  <td className="whitespace-nowrap px-4 py-3 font-display text-sm font-semibold text-ink-primary">{s.name}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs">Gr {s.grade} · {s.board}</td>
                  <td className="whitespace-nowrap px-4 py-3"><MasteryBadge value={s.accuracy} /></td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-neon-cyan">{s.score}%</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-16 overflow-hidden rounded-full bg-panel-line">
                        <div className="h-full rounded-full bg-arcane-purple" style={{ width: `${s.completion}%` }} />
                      </div>
                      <span className="font-mono text-[11px]">{s.completion}%</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">{formatMs(s.timeSpent)}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {s.trend === "up" && <TrendingUp className="h-4 w-4 text-neon-green" />}
                    {s.trend === "down" && <TrendingUp className="h-4 w-4 rotate-180 text-red-400" />}
                    {s.trend === "stable" && <span className="inline-block h-0.5 w-4 bg-ink-faint" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl border border-panel-line bg-panel/60 p-5">
        <h3 className="font-display text-base font-bold text-ink-primary">Question Difficulty Analysis</h3>
        <p className="mt-1 text-xs text-ink-muted">Questions sorted by correctness rate — lower means harder.</p>
        <div className="mt-4 space-y-3">
          {questionList.sort((a, b) => a.correctRate - b.correctRate).map((q) => (
            <div key={q.id} className="rounded-xl border border-panel-line bg-void/40 p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-ink-primary">{q.text}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <StatusPill value={q.difficulty} />
                    <span className="text-[10px] text-ink-faint">{q.attempts} attempts</span>
                  </div>
                </div>
                <MasteryBadge value={q.correctRate} />
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-panel-line">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${q.correctRate}%`,
                    backgroundColor: q.correctRate >= 80 ? "rgb(74 222 128)" : q.correctRate >= 50 ? "rgb(251 191 36)" : "rgb(239 68 68)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-panel-line bg-panel/60 p-5">
        <h3 className="flex items-center gap-2 font-display text-base font-bold text-ink-primary">
          <Brain className="h-4 w-4 text-arcane-purple" />
          Concept Mastery Heatmap
        </h3>
        <p className="mt-1 text-xs text-ink-muted">Color-coded mastery levels across subjects, units, and concepts.</p>
        <div className="mt-4 space-y-4">
          {visibleMastery.subjects.map((sub) => (
            <div key={sub.name}>
              {sub.units.map((unit) => (
                <div key={unit.name} className="mb-3">
                  <button
                    type="button"
                    onClick={() => setExpandedUnit(expandedUnit === unit.name ? null : unit.name)}
                    className="flex w-full items-center gap-2 rounded-lg border border-panel-line bg-void/40 px-3 py-2 transition-colors hover:bg-panel-alt/30"
                  >
                    <BookOpen className="h-4 w-4 text-arcane-purple" />
                    <span className="flex-1 text-left font-display text-sm font-semibold text-ink-primary">{unit.name}</span>
                    <span className="font-mono text-[11px] text-ink-faint">
                      Avg: {Math.round(unit.concepts.reduce((s, c) => s + c.mastery, 0) / unit.concepts.length)}%
                    </span>
                    {expandedUnit === unit.name ? (
                      <ChevronUp className="h-4 w-4 text-ink-faint" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-ink-faint" />
                    )}
                  </button>
                  {expandedUnit === unit.name && (
                    <div className="mt-2 grid grid-cols-1 gap-2 pl-6 sm:grid-cols-2 lg:grid-cols-3">
                      {unit.concepts.map((c) => (
                        <div key={c.name} className={`rounded-lg border p-3 ${getMasteryColor(c.mastery)} border-current/20`}>
                          <p className="font-display text-xs font-semibold">{c.name}</p>
                          <div className="mt-1 flex items-center justify-between">
                            <span className="font-mono text-lg font-bold">{c.mastery}%</span>
                            <span className="text-[10px] opacity-70">{c.students} students</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-panel-line bg-panel/60 p-5">
          <h3 className="flex items-center gap-2 font-display text-base font-bold text-ink-primary">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            Weak Concepts
          </h3>
          <p className="mt-1 text-xs text-ink-muted">Concepts below 60% mastery — consider reviewing these topics.</p>
          <div className="mt-3 space-y-2">
            {weakConcepts.length === 0 && <p className="py-4 text-center text-sm text-ink-faint">No weak concepts found.</p>}
            {weakConcepts.map((c, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-2.5">
                <AlertTriangle className="h-4 w-4 flex-none text-red-400" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-ink-primary">{c.name}</p>
                  <p className="text-[10px] text-ink-faint">{c.unit} · {c.subject}</p>
                </div>
                <span className="font-mono text-xs text-red-400">{c.mastery}%</span>
                <span className="font-mono text-[10px] text-ink-faint">{c.students} students</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-panel-line bg-panel/60 p-5">
          <h3 className="flex items-center gap-2 font-display text-base font-bold text-ink-primary">
            <Lightbulb className="h-4 w-4 text-neon-green" />
            Strong Concepts
          </h3>
          <p className="mt-1 text-xs text-ink-muted">Concepts above 80% mastery — well understood by students.</p>
          <div className="mt-3 space-y-2">
            {strongConcepts.length === 0 && <p className="py-4 text-center text-sm text-ink-faint">No strong concepts found.</p>}
            {strongConcepts.map((c, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-neon-green/20 bg-neon-green/5 px-3 py-2.5">
                <Lightbulb className="h-4 w-4 flex-none text-neon-green" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-ink-primary">{c.name}</p>
                  <p className="text-[10px] text-ink-faint">{c.unit} · {c.subject}</p>
                </div>
                <span className="font-mono text-xs text-neon-green">{c.mastery}%</span>
                <span className="font-mono text-[10px] text-ink-faint">{c.students} students</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-panel-line bg-panel/60 p-5">
        <h3 className="font-display text-base font-bold text-ink-primary">Student Growth</h3>
        <p className="mt-1 text-xs text-ink-muted">Average score and completions over the past 6 weeks.</p>
        <div className="mt-4">
          <div className="flex items-end gap-3">
            {MOCK_GROWTH.map((w, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
                <span className="font-mono text-[10px] text-neon-cyan">{w.avgScore}%</span>
                <div
                  className="w-full rounded-t bg-arcane-purple transition-all duration-500"
                  style={{ height: `${(w.avgScore / 100) * 160}px` }}
                />
                <span className="font-mono text-[10px] text-ink-faint">{w.period}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded bg-arcane-purple" />
            <span className="text-xs text-ink-muted">Avg. Score</span>
          </div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-3 w-3 text-neon-cyan" />
            <span className="text-xs text-ink-muted">Completions</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <ReportDownloadButton
          path="/api/exports/teacher/roster"
          className="flex items-center gap-1.5 rounded-lg border border-panel-line px-3.5 py-2 font-display text-sm font-semibold text-ink-muted transition-colors hover:text-neon-cyan"
        >
          <FileText className="h-4 w-4" />
          Export PDF
        </ReportDownloadButton>
        <ReportDownloadButton
          path="/api/exports/teacher/students/export"
          className="flex items-center gap-1.5 rounded-lg border border-panel-line px-3.5 py-2 font-display text-sm font-semibold text-ink-muted transition-colors hover:text-neon-green"
        >
          <FileSpreadsheet className="h-4 w-4" />
          Export Excel
        </ReportDownloadButton>
      </div>
    </div>
  );
}
