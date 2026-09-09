import { useMemo, useState } from "react";
import { Search, Download, Filter, ChevronDown, ChevronUp, Eye, FileSpreadsheet } from "lucide-react";
import DataTable from "../../admin/components/DataTable.jsx";
import { useTeacherData } from "../TeacherContext.jsx";
import { RosterError } from "./SchoolPage.jsx";
import StatusPill from "../../admin/components/StatusPill.jsx";
import { exportToExcel } from "../../lib/reportGenerator.js";
import ReportDownloadButton from "../../lib/ReportDownloadButton.jsx";

function formatMs(ms) {
  if (ms == null) return "\u2014";
  const seconds = Math.round(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
}

const MOCK_STUDENT_DETAIL = {
  "STU-1001": {
    name: "Aarav Mehta",
    attempts: [
      { quiz: "Atom Valley — Easy Warm-up", score: 90, date: "2026-09-01", time: 360000 },
      { quiz: "Atomic Structure Deep Dive", score: 74, date: "2026-09-03", time: 540000 },
    ],
    avgScore: 82,
    totalAttempts: 8,
    improvement: "+12%",
  },
  "STU-1002": {
    name: "Diya Iyer",
    attempts: [
      { quiz: "Atom Valley — Easy Warm-up", score: 95, date: "2026-08-28", time: 320000 },
      { quiz: "Molecule Forest Checkpoint", score: 91, date: "2026-09-02", time: 480000 },
    ],
    avgScore: 93,
    totalAttempts: 12,
    improvement: "+8%",
  },
  "STU-1005": {
    name: "Vihaan Shah",
    attempts: [
      { quiz: "Atom Valley — Easy Warm-up", score: 99, date: "2026-08-25", time: 280000 },
      { quiz: "Bonding Cave Boss Prep", score: 87, date: "2026-09-04", time: 620000 },
    ],
    avgScore: 96,
    totalAttempts: 15,
    improvement: "+5%",
  },
};

export default function QuizzesPage() {
  const { data, rosterLoading, rosterError, refetchRoster } = useTeacherData();
  const [filterStudent, setFilterStudent] = useState("all");
  const [filterClass, setFilterClass] = useState("all");
  const [filterDifficulty, setFilterDifficulty] = useState("all");
  const [studentDetail, setStudentDetail] = useState(null);

  const rows = useMemo(
    () =>
      (data.quizResults ?? []).map((r, i) => ({
        ...r,
        id: `${r.studentId}-${r.world_id}-${r.lesson_id}-${r.difficulty_id}-${i}`,
        lessonLabel: `${r.world_id} \u00b7 ${r.lesson_id} (${r.difficulty_id})`,
      })),
    [data.quizResults]
  );

  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      if (filterStudent !== "all" && r.studentId !== filterStudent) return false;
      if (filterClass !== "all" && `${r.grade}-${r.board}` !== filterClass) return false;
      return true;
    });
  }, [rows, filterStudent, filterClass]);

  const uniqueStudents = useMemo(() => {
    const map = new Map();
    rows.forEach((r) => {
      if (!map.has(r.studentId)) map.set(r.studentId, r.studentName);
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [rows]);

  const uniqueClasses = useMemo(() => {
    const set = new Set();
    rows.forEach((r) => set.add(`${r.grade}-${r.board}`));
    return Array.from(set);
  }, [rows]);

  const columns = useMemo(
    () => [
      { key: "studentName", label: "Student" },
      { key: "grade", label: "Grade", render: (row) => <span className="text-ink-primary">Grade {row.grade}</span> },
      { key: "board", label: "Board" },
      { key: "lessonLabel", label: "Lesson / Quiz" },
      {
        key: "score",
        label: "Score",
        render: (row) => <span className="font-mono text-neon-cyan">{row.score}%</span>,
      },
      {
        key: "stars",
        label: "Stars",
        render: (row) => <span className="font-mono text-reward-gold">{"\u2605".repeat(row.stars || 0)}</span>,
      },
      {
        key: "avgTimeTakenMs",
        label: "Avg. Time Taken",
        render: (row) => <span className="text-ink-primary">{formatMs(row.avgTimeTakenMs)}</span>,
      },
      {
        key: "completed_at",
        label: "Completed",
        render: (row) => <span className="text-ink-muted">{new Date(row.completed_at).toLocaleDateString()}</span>,
      },
    ],
    []
  );

  function exportCSV() {
    exportToExcel(
      filteredRows.map((r) => {
        const out = {};
        for (const c of columns) {
          out[c.label] = c.key === "studentName" ? r.studentName : c.key === "grade" ? `Grade ${r.grade}` : r[c.key] ?? "";
        }
        return out;
      }),
      "quiz-results"
    );
  }

  function openStudentDetail(studentId) {
    // Demo rows seeded with STU-100x ids still use the rich mock detail;
    // every real student (UUID ids) gets a detail built from their actual
    // rows below, so the button always shows content.
    const mock = MOCK_STUDENT_DETAIL[studentId];
    if (mock) {
      setStudentDetail(mock);
      return;
    }
    const studentRows = rows.filter((r) => r.studentId === studentId);
    if (!studentRows.length) {
      setStudentDetail(null);
      return;
    }
    const attempts = studentRows.map((r) => ({
      quiz: r.lessonLabel,
      score: Math.min(100, Math.round(r.score ?? 0)),
      date: r.completed_at ? String(r.completed_at).slice(0, 10) : "\u2014",
      time: r.avgTimeTakenMs ?? null,
    }));
    const avgScore = attempts.length
      ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length)
      : 0;
    setStudentDetail({
      name: studentRows[0].studentName ?? studentId,
      attempts,
      avgScore,
      totalAttempts: studentRows.length,
      improvement: attempts.length > 1 ? "+" + Math.max(0, attempts[0].score - attempts[attempts.length - 1].score) + "%" : "\u2014",
    });
  }

  if (rosterLoading) return <p className="text-sm text-ink-faint">Loading quiz results…</p>;
  if (rosterError) return <RosterError message={rosterError} onRetry={refetchRoster} />;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink-primary">Quizzes</h2>
          <p className="mt-1 text-sm text-ink-muted">Every recorded quiz/lesson attempt at your school, most recent first.</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={exportCSV}
            className="flex items-center gap-1.5 rounded-lg border border-panel-line px-3 py-2 font-display text-xs font-semibold text-ink-muted transition-colors hover:text-neon-green"
          >
            <FileSpreadsheet className="h-3.5 w-3.5" />
            Export Excel
          </button>
          <ReportDownloadButton
            path="/api/exports/teacher/roster"
            className="flex items-center gap-1.5 rounded-lg border border-panel-line px-3 py-2 font-display text-xs font-semibold text-ink-muted transition-colors hover:text-neon-cyan"
          >
            <Download className="h-3.5 w-3.5" />
            Roster PDF
          </ReportDownloadButton>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-ink-faint" />
          <span className="text-xs text-ink-muted">Filters:</span>
        </div>
        <select
          value={filterStudent}
          onChange={(e) => setFilterStudent(e.target.value)}
          className="rounded-lg border border-panel-line bg-void px-3 py-1.5 text-sm text-ink-primary outline-none focus:border-neon-cyan"
        >
          <option value="all">All Students</option>
          {uniqueStudents.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        <select
          value={filterClass}
          onChange={(e) => setFilterClass(e.target.value)}
          className="rounded-lg border border-panel-line bg-void px-3 py-1.5 text-sm text-ink-primary outline-none focus:border-neon-cyan"
        >
          <option value="all">All Classes</option>
          {uniqueClasses.map((c) => (
            <option key={c} value={c}>Grade {c}</option>
          ))}
        </select>
      </div>

      <DataTable
        title="Quiz Results"
        description="Time taken is each student's average across all their answers."
        columns={columns}
        rows={filteredRows}
        searchKeys={["studentName", "grade", "board", "lessonLabel"]}
        renderRowActions={(row) => (
          <button
            type="button"
            onClick={() => openStudentDetail(row.studentId)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-faint transition-colors hover:bg-neon-cyan/10 hover:text-neon-cyan"
            title="View student detail"
          >
            <Eye className="h-4 w-4" strokeWidth={1.8} />
          </button>
        )}
      />

      {studentDetail && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-void/80 backdrop-blur-sm p-4 py-10">
          <div className="w-full max-w-lg rounded-2xl border border-panel-line bg-panel shadow-xl">
            <div className="flex items-center justify-between border-b border-panel-line px-5 py-4">
              <div>
                <h3 className="font-display text-lg font-bold text-ink-primary">{studentDetail.name}</h3>
                <p className="text-xs text-ink-muted">{studentDetail.totalAttempts} total attempts · {studentDetail.improvement} improvement</p>
              </div>
              <button
                type="button"
                onClick={() => setStudentDetail(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-faint transition-colors hover:bg-panel-alt hover:text-ink-primary"
              >
                &times;
              </button>
            </div>
            <div className="p-5 space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-panel-line bg-void/40 p-3 text-center">
                  <p className="font-display text-lg font-bold text-neon-cyan">{studentDetail.avgScore}%</p>
                  <p className="text-[10px] text-ink-faint">Avg. Score</p>
                </div>
                <div className="rounded-xl border border-panel-line bg-void/40 p-3 text-center">
                  <p className="font-display text-lg font-bold text-arcane-purple">{studentDetail.totalAttempts}</p>
                  <p className="text-[10px] text-ink-faint">Attempts</p>
                </div>
                <div className="rounded-xl border border-panel-line bg-void/40 p-3 text-center">
                  <p className="font-display text-lg font-bold text-neon-green">{studentDetail.improvement}</p>
                  <p className="text-[10px] text-ink-faint">Improvement</p>
                </div>
              </div>
              <div className="divide-y divide-panel-line">
                {studentDetail.attempts.map((a, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 py-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-sm text-ink-primary">{a.quiz}</p>
                      <p className="text-xs text-ink-muted">{a.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-ink-muted">{formatMs(a.time)}</span>
                      <span className="font-mono text-sm text-neon-cyan">{a.score}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
