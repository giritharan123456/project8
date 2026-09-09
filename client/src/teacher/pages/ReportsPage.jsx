import { useState, useMemo } from "react";
import { Users, Trophy, Flame, Percent, FileText, FileSpreadsheet, Filter, Download, Gauge, X } from "lucide-react";
import { useTeacherData } from "../TeacherContext.jsx";
import StatCard from "../../admin/components/StatCard.jsx";
import { RosterError } from "./SchoolPage.jsx";
import ReportDownloadButton from "../../lib/ReportDownloadButton.jsx";
import * as XLSX from "xlsx";

function formatTime(msPerQuestion) {
  if (msPerQuestion == null) return "\u2014";
  const total = Math.round(msPerQuestion) / 1000;
  if (total >= 60) return `${Math.floor(total / 60)}m ${Math.round(total % 60)}s`;
  return `${total.toFixed(1)}s`;
}

function formatDate(value) {
  if (!value) return "\u2014";
  const d = new Date(value);
  return isNaN(d.getTime()) ? String(value) : d.toLocaleString();
}

const DIFFICULTY_ACCENTS = {
  easy: "#4ADE80",
  medium: "#38D9F4",
  hard: "#806BFF",
  expert: "#FCD34D",
};

export default function ReportsPage() {
  const { data, rosterLoading, rosterError, refetchRoster } = useTeacherData();
  const reports = data.reports;
  const attempts = data.quizResults ?? [];

  const [classFilter, setClassFilter] = useState("all");
  const [boardFilter, setBoardFilter] = useState("all");
  const [studentFilter, setStudentFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [search, setSearch] = useState("");
  const [exported, setExported] = useState(false);
  const [detail, setDetail] = useState(null);

  const classOptions = useMemo(
    () => Array.from(new Set(attempts.map((a) => a.grade).filter(Boolean))).sort((a, b) => a - b),
    [attempts]
  );
  const boardOptions = useMemo(
    () => Array.from(new Set(attempts.map((a) => a.board).filter(Boolean))).sort(),
    [attempts]
  );
  const difficultyOptions = useMemo(
    () => Array.from(new Set(attempts.map((a) => a.difficulty_id).filter(Boolean))).sort(),
    [attempts]
  );
  const studentOptions = useMemo(
    () => Array.from(new Map(attempts.map((a) => [a.studentId, { id: a.studentId, name: a.studentName }])).values()).sort((x, y) => x.name.localeCompare(y.name)),
    [attempts]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const from = dateFrom ? new Date(`${dateFrom}T00:00:00`).getTime() : null;
    const to = dateTo ? new Date(`${dateTo}T23:59:59.999`).getTime() : null;
    return attempts
      .filter((a) => classFilter === "all" || String(a.grade) === classFilter)
      .filter((a) => boardFilter === "all" || a.board === boardFilter)
      .filter((a) => studentFilter === "all" || a.studentId === studentFilter)
      .filter((a) => difficultyFilter === "all" || a.difficulty_id === difficultyFilter)
      .filter((a) => {
        if (!from && !to) return true;
        const ts = new Date(a.completed_at).getTime();
        if (!Number.isFinite(ts)) return true;
        if (from && ts < from) return false;
        if (to && ts > to) return false;
        return true;
      })
      .filter((a) => !q || [a.studentName, a.world_id, a.lesson_id, `${a.grade}`, a.board, a.section].some((v) => String(v ?? "").toLowerCase().includes(q)));
  }, [attempts, classFilter, boardFilter, studentFilter, difficultyFilter, dateFrom, dateTo, search]);

  const hasFilters =
    classFilter !== "all" || boardFilter !== "all" || studentFilter !== "all" || difficultyFilter !== "all" || dateFrom || dateTo || search;

  function resetFilters() {
    setClassFilter("all");
    setBoardFilter("all");
    setStudentFilter("all");
    setDifficultyFilter("all");
    setDateFrom("");
    setDateTo("");
    setSearch("");
  }

  function handleExcelExport() {
    if (!filtered.length) return;
    const rows = filtered.map((a) => ({
      Student: a.studentName,
      "Student ID": a.studentId,
      Class: `${a.grade}${a.board ? ` (${a.board})` : ""}`,
      Section: a.section ?? "",
      World: a.world_id,
      Lesson: a.lesson_id,
      Difficulty: a.difficulty_id,
      Score: `${a.score}%`,
      Stars: a.stars ?? "",
      Accuracy: a.accuracy != null ? `${a.accuracy}%` : "",
      TimePerQuestion: formatTime(a.avgTimeTakenMs),
      XP: a.xp ?? "",
      Coins: a.coins ?? "",
      Submitted: formatDate(a.completed_at),
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Quiz Attempts");
    XLSX.writeFile(wb, `quiz-attempts-${new Date().toISOString().slice(0, 10)}.xlsx`);
    setExported(true);
    setTimeout(() => setExported(false), 2500);
  }

  if (rosterLoading) return <p className="text-sm text-ink-faint">Loading reports…</p>;
  if (rosterError) return <RosterError message={rosterError} onRetry={refetchRoster} />;
  if (!reports) return null;

  const { summary, byClass } = reports;
  const maxStudents = Math.max(1, ...byClass.map((c) => c.studentCount));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink-primary">Reports</h2>
          <p className="mt-1 text-sm text-ink-muted">
            School-wide performance plus a filterable per-attempt breakdown, aggregated from real gameplay data.
          </p>
        </div>
        <div className="flex gap-2">
          <ReportDownloadButton
            path="/api/exports/teacher/reports"
            className="flex items-center gap-1.5 rounded-lg border border-panel-line px-3.5 py-2 font-display text-sm font-semibold text-ink-muted transition-colors hover:text-neon-cyan"
          >
            <FileText className="h-4 w-4" />
            Export PDF
          </ReportDownloadButton>
          <ReportDownloadButton
            path="/api/exports/teacher/reports/export"
            className="flex items-center gap-1.5 rounded-lg border border-panel-line px-3.5 py-2 font-display text-sm font-semibold text-ink-muted transition-colors hover:text-neon-green"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Export Excel
          </ReportDownloadButton>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Users} label="Students" value={summary.studentCount} accent="purple" />
        <StatCard icon={Trophy} label="Avg. Level" value={Math.round(summary.avgLevel * 10) / 10} accent="gold" />
        <StatCard icon={Flame} label="Total XP Earned" value={summary.totalXpEarned} accent="cyan" />
        <StatCard
          icon={Percent}
          label="Avg. Lesson Accuracy"
          value={`${Math.round(summary.avgAccuracy)}%`}
          sublabel={`${summary.completionCount} completions`}
          accent="green"
        />
      </div>

      <div className="rounded-2xl border border-panel-line bg-panel/60 p-5">
        <h3 className="font-display text-base font-bold text-ink-primary">Students by Grade / Board</h3>
        <div className="mt-4 space-y-3">
          {byClass.length === 0 && <p className="text-sm text-ink-faint">No students yet.</p>}
          {byClass.map((c) => (
            <div key={`${c.grade}-${c.board}`} className="flex items-center gap-3">
              <span className="w-28 flex-none truncate font-mono text-xs text-ink-muted">
                Grade {c.grade} &middot; {c.board}
              </span>
              <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-panel-line">
                <div className={`h-full rounded-full ${c.studentCount > 0 ? "bg-arcane-purple" : "bg-panel-line"}`} style={{ width: `${(c.studentCount / maxStudents) * 100}%` }} />
              </div>
              <span className="w-32 flex-none text-right font-mono text-xs text-ink-primary">
                {c.studentCount} students &middot; L{Math.round(c.avgLevel * 10) / 10} avg
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-panel-line bg-panel/60 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="flex items-center gap-2 font-display text-base font-bold text-ink-primary">
              <Gauge className="h-4 w-4 text-arcane-purple" /> Quiz Attempt Details
            </h3>
            <p className="mt-1 text-xs text-ink-muted">
              {filtered.length} of {attempts.length} attempts, newest first.
            </p>
          </div>
          <button
            type="button"
            onClick={handleExcelExport}
            disabled={!filtered.length}
            className={`flex items-center justify-center gap-1.5 rounded-lg border px-3.5 py-2 font-display text-sm font-semibold transition-colors ${
              exported
                ? "border-neon-green/50 text-neon-green"
                : "border-panel-line text-ink-muted hover:border-neon-green/50 hover:text-neon-green"
            } ${!filtered.length ? "cursor-not-allowed opacity-50" : ""}`}
          >
            <Download className="h-4 w-4" />
            {exported ? "Exported!" : "Export Filtered Excel"}
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-end gap-2">
          <label className="flex min-w-36 flex-1 flex-col gap-1.5">
            <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">Class</span>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="rounded-lg border border-panel-line bg-panel px-3 py-2 font-body text-sm text-ink-primary outline-none focus:border-neon-cyan/60"
            >
              <option value="all">All classes</option>
              {classOptions.map((g) => (
                <option key={g} value={String(g)}>Class {g}</option>
              ))}
            </select>
          </label>
          <label className="flex min-w-32 flex-1 flex-col gap-1.5">
            <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">Board</span>
            <select
              value={boardFilter}
              onChange={(e) => setBoardFilter(e.target.value)}
              className="rounded-lg border border-panel-line bg-panel px-3 py-2 font-body text-sm text-ink-primary outline-none focus:border-neon-cyan/60"
            >
              <option value="all">All boards</option>
              {boardOptions.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </label>
          <label className="flex min-w-32 flex-1 flex-col gap-1.5">
            <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">Difficulty</span>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="rounded-lg border border-panel-line bg-panel px-3 py-2 font-body text-sm text-ink-primary outline-none focus:border-neon-cyan/60"
            >
              <option value="all">All difficulties</option>
              {difficultyOptions.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </label>
          <label className="flex min-w-36 flex-col gap-1.5">
            <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">From</span>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="rounded-lg border border-panel-line bg-panel px-3 py-2 font-body text-sm text-ink-primary outline-none focus:border-neon-cyan/60"
            />
          </label>
          <label className="flex min-w-36 flex-col gap-1.5">
            <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">To</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="rounded-lg border border-panel-line bg-panel px-3 py-2 font-body text-sm text-ink-primary outline-none focus:border-neon-cyan/60"
            />
          </label>
          <label className="flex min-w-40 flex-1 flex-col gap-1.5">
            <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">Student</span>
            <select
              value={studentFilter}
              onChange={(e) => setStudentFilter(e.target.value)}
              className="rounded-lg border border-panel-line bg-panel px-3 py-2 font-body text-sm text-ink-primary outline-none focus:border-neon-cyan/60"
            >
              <option value="all">All students</option>
              {studentOptions.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </label>
          <label className="flex min-w-48 flex-[2] flex-col gap-1.5">
            <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">Search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Student, world, lesson, board…"
              className="rounded-lg border border-panel-line bg-panel px-3 py-2 font-body text-sm text-ink-primary outline-none placeholder:text-ink-faint focus:border-neon-cyan/60"
            />
          </label>
        </div>

        {(hasFilters) && (
          <button
            type="button"
            onClick={resetFilters}
            className="mt-3 flex items-center gap-1.5 rounded-lg border border-panel-line px-3 py-1.5 font-display text-xs font-semibold text-ink-muted hover:text-ink-primary"
          >
            <Filter className="h-3.5 w-3.5" /> Clear Filters
          </button>
        )}

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-panel-line font-mono text-[10px] uppercase tracking-widest text-ink-faint">
                <th className="py-2 pr-3">Student</th>
                <th className="py-2 pr-3">Class</th>
                <th className="py-2 pr-3">World</th>
                <th className="py-2 pr-3">Lesson</th>
                <th className="py-2 pr-3">Difficulty</th>
                <th className="py-2 pr-3">Score</th>
                <th className="py-2 pr-3">Time</th>
                <th className="py-2">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, i) => (
                <tr
                  key={`${a.studentId}-${i}`}
                  onClick={() => setDetail(a)}
                  className="cursor-pointer border-b border-panel-line/60 transition-colors hover:bg-panel/40"
                  title="View attempt details"
                >
                  <td className="py-2.5 pr-3 font-medium text-ink-primary">{a.studentName}</td>
                  <td className="py-2.5 pr-3 font-mono text-xs text-ink-muted">
                    {a.grade}{a.board ? ` · ${a.board}` : ""}
                  </td>
                  <td className="py-2.5 pr-3 text-xs text-ink-muted">{a.world_id}</td>
                  <td className="py-2.5 pr-3 text-xs text-ink-muted">{a.lesson_id}</td>
                  <td className="py-2.5 pr-3">
                    <span
                      className="rounded-lg px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider"
                      style={{ color: DIFFICULTY_ACCENTS[a.difficulty_id] ?? "#38D9F4", backgroundColor: `${DIFFICULTY_ACCENTS[a.difficulty_id] ?? "#38D9F4"}18` }}
                    >
                      {a.difficulty_id ?? "\u2014"}
                    </span>
                  </td>
                  <td className="py-2.5 pr-3">
                    <span className={`font-display text-xs font-bold ${a.score >= 70 ? "text-neon-green" : a.score >= 50 ? "text-reward-gold" : "text-red-400"}`}>
                      {a.score != null ? `${a.score}%` : "\u2014"}
                    </span>
                  </td>
                  <td className="py-2.5 pr-3 font-mono text-xs text-ink-muted">{formatTime(a.avgTimeTakenMs)}</td>
                  <td className="py-2.5 font-mono text-xs text-ink-faint">{formatDate(a.completed_at)}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center font-body text-sm text-ink-faint">
                    No attempts match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-void/80 px-4 backdrop-blur-sm" onClick={() => setDetail(null)}>
          <div
            className="w-full max-w-lg rounded-2xl border border-panel-line bg-panel p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-lg font-bold text-ink-primary">{detail.studentName}</h3>
                <p className="mt-0.5 font-body text-xs text-ink-muted">
                  Class {detail.grade}{detail.board ? ` · ${detail.board}` : ""}
                  {detail.section ? ` · ${detail.section}` : ""} · {detail.studentId}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDetail(null)}
                className="rounded-lg border border-panel-line p-1.5 text-ink-muted hover:text-ink-primary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 overflow-hidden rounded-xl border border-panel-line">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-panel-line/60">
                  <tr>
                    <td className="py-2 pl-3 pr-2 font-mono text-[10px] uppercase tracking-widest text-ink-faint">Subject / Unit</td>
                    <td className="py-2 pl-2 pr-3 font-body text-ink-primary">{detail.world_id}</td>
                  </tr>
                  <tr>
                    <td className="py-2 pl-3 pr-2 font-mono text-[10px] uppercase tracking-widest text-ink-faint">Lesson</td>
                    <td className="py-2 pl-2 pr-3 font-body text-ink-primary">{detail.lesson_id}</td>
                  </tr>
                  <tr>
                    <td className="py-2 pl-3 pr-2 font-mono text-[10px] uppercase tracking-widest text-ink-faint">Difficulty</td>
                    <td className="py-2 pl-2 pr-3">
                      <span
                        className="rounded-lg px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider"
                        style={{ color: DIFFICULTY_ACCENTS[detail.difficulty_id] ?? "#38D9F4", backgroundColor: `${DIFFICULTY_ACCENTS[detail.difficulty_id] ?? "#38D9F4"}18` }}
                      >
                        {detail.difficulty_id ?? "\u2014"}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 pl-3 pr-2 font-mono text-[10px] uppercase tracking-widest text-ink-faint">Score</td>
                    <td className="py-2 pl-2 pr-3">
                      <span className={`font-display text-sm font-bold ${detail.score >= 70 ? "text-neon-green" : detail.score >= 50 ? "text-reward-gold" : "text-red-400"}`}>
                        {detail.score != null ? `${detail.score}%` : "\u2014"}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 pl-3 pr-2 font-mono text-[10px] uppercase tracking-widest text-ink-faint">Stars</td>
                    <td className="py-2 pl-2 pr-3 font-body text-ink-primary">{detail.stars ?? "\u2014"} / 3</td>
                  </tr>
                  <tr>
                    <td className="py-2 pl-3 pr-2 font-mono text-[10px] uppercase tracking-widest text-ink-faint">Time per question</td>
                    <td className="py-2 pl-2 pr-3 font-mono text-ink-primary">{formatTime(detail.avgTimeTakenMs)}</td>
                  </tr>
                  <tr>
                    <td className="py-2 pl-3 pr-2 font-mono text-[10px] uppercase tracking-widest text-ink-faint">Rewards</td>
                    <td className="py-2 pl-2 pr-3 font-body text-ink-primary">
                      {detail.xp ?? 0} XP · {detail.coins ?? 0} coins
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 pl-3 pr-2 font-mono text-[10px] uppercase tracking-widest text-ink-faint">Submitted</td>
                    <td className="py-2 pl-2 pr-3 font-mono text-ink-muted">{formatDate(detail.completed_at)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}