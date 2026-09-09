import { useCallback, useEffect, useMemo, useState } from "react";
import { Trophy, Flame, Download, Loader2 } from "lucide-react";
import { getPlatformLeaderboard, getSchools, getLeaderboardReport, getBoardsList, getClassesList, getSubjectsList } from "../api.js";
import { ApiError } from "../../api/client.js";
import { downloadLeaderboardPdf } from "../lib/leaderboardPdf.js";

const MEDAL_COLORS = ["text-reward-gold", "text-ink-muted", "text-amber-700"];

// Platform-wide leaderboard, real data from server/src/routes/teacher.js's
// /leaderboard handler - ADMIN with no ?school_id ranks students across
// every school, exactly like the school-scoped view on the Teacher Portal.
//
// The Board/Class/Subject filters and Download PDF button (Section 15)
// pull from a separate, richer endpoint - /leaderboard/report - since a
// PDF report needs score/percentage/time-taken/performance data that the
// plain XP leaderboard below doesn't carry.
export default function LeaderboardPage() {
  const [schools, setSchools] = useState([]);
  const [boards, setBoards] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [schoolId, setSchoolId] = useState("");
  const [board, setBoard] = useState("");
  const [grade, setGrade] = useState("");
  const [subject, setSubject] = useState("");

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState(null);

  useEffect(() => {
    getSchools().then(setSchools).catch(() => {});
    getBoardsList().then(setBoards).catch(() => {});
    getClassesList().then(setClasses).catch(() => {});
    getSubjectsList().then(setSubjects).catch(() => {});
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPlatformLeaderboard(schoolId || undefined);
      setRows(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't load the leaderboard.");
    } finally {
      setLoading(false);
    }
  }, [schoolId]);

  useEffect(() => {
    load();
  }, [load]);

  const schoolName = useMemo(() => schools.find((s) => String(s.id) === String(schoolId))?.name, [schools, schoolId]);
  const boardName = useMemo(() => boards.find((b) => b.code === board)?.name, [boards, board]);
  const subjectName = useMemo(() => subjects.find((s) => s.code === subject)?.name, [subjects, subject]);

  const handleDownloadPdf = useCallback(async () => {
    setPdfLoading(true);
    setPdfError(null);
    try {
      const report = await getLeaderboardReport({
        schoolId: schoolId || undefined,
        grade: grade || undefined,
        board: board || undefined,
        subject: subject || undefined,
      });
      if (!report.rows.length) {
        setPdfError("No recorded quiz attempts match these filters yet.");
        return;
      }
      downloadLeaderboardPdf({
        school: schoolName,
        board: boardName,
        grade,
        subject: subjectName,
        rows: report.rows,
        summary: report.summary,
      });
    } catch (err) {
      setPdfError(err instanceof ApiError ? err.message : "Couldn't generate the PDF report.");
    } finally {
      setPdfLoading(false);
    }
  }, [schoolId, board, grade, subject, schoolName, boardName, subjectName]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink-primary">Leaderboard</h2>
          <p className="mt-1 text-sm text-ink-muted">Students ranked by total XP earned, across every school.</p>
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

      <div className="flex flex-col gap-3 rounded-2xl border border-panel-line bg-panel/60 p-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <label className="mb-1 block font-mono text-[11px] uppercase tracking-widest text-ink-faint">Board</label>
            <select
              value={board}
              onChange={(e) => setBoard(e.target.value)}
              className="w-full rounded-lg border border-panel-line bg-void px-3 py-2 text-sm text-ink-primary outline-none focus:border-neon-cyan"
            >
              <option value="">All Boards</option>
              {boards.map((b) => (
                <option key={b.code} value={b.code}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block font-mono text-[11px] uppercase tracking-widest text-ink-faint">Class</label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full rounded-lg border border-panel-line bg-void px-3 py-2 text-sm text-ink-primary outline-none focus:border-neon-cyan"
            >
              <option value="">All Classes</option>
              {classes.map((c) => (
                <option key={c.grade} value={c.grade}>
                  Grade {c.grade}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block font-mono text-[11px] uppercase tracking-widest text-ink-faint">Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-lg border border-panel-line bg-void px-3 py-2 text-sm text-ink-primary outline-none focus:border-neon-cyan"
            >
              <option value="">All Subjects</option>
              {subjects.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDownloadPdf}
          disabled={pdfLoading}
          className="flex flex-none items-center justify-center gap-2 rounded-lg bg-arcane-purple px-4 py-2.5 font-display text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-arcane-purple/90 disabled:opacity-60"
        >
          {pdfLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          Download PDF
        </button>
      </div>
      {pdfError && <p className="text-sm text-red-400">{pdfError}</p>}

      {loading ? (
        <p className="text-sm text-ink-faint">Loading leaderboard…</p>
      ) : error ? (
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
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-panel-line bg-panel/60 p-8 text-center text-sm text-ink-faint">
          No students yet.
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
