// Admin > Content Completeness (Section 53). Reads GET /api/admin/content-
// coverage (real COUNT() per authored layer, per subject) and renders a
// traffic-light completeness board: overall status, per-subject coverage
// bars across the full curriculum hierarchy (worlds, lessons, units,
// concepts, topics, learning contents, question bank, quizzes, quiz links),
// and the explicit list of missing layers so admins know exactly what to
// author next. Backed by the server's `npm run validate`-style checks --
// same layer list, same thresholds, so the page and the CLI can't disagree.
import { useEffect, useMemo, useState } from "react";
import { useAdminData } from "../AdminContext.jsx";
import { getContentCoverage } from "../api.js";
import StatCard from "../components/StatCard.jsx";
import { Activity, AlertTriangle, CheckCircle2, Layers, FileWarning } from "lucide-react";

const LAYER_ORDER = [
  "worlds",
  "lessons",
  "units",
  "concepts",
  "topics",
  "learningContents",
  "questions",
  "quizzes",
  "quizQuestions",
];

const LAYER_LABELS = {
  worlds: "Worlds",
  lessons: "Lessons",
  units: "Units",
  concepts: "Concepts",
  topics: "Topics",
  learningContents: "Learning Content",
  questions: "Questions",
  quizzes: "Quizzes",
  quizQuestions: "Quiz Links",
};

const STATUS_STYLES = {
  healthy: "text-neon-green",
  attention: "text-reward-gold",
  critical: "text-red-400",
};

function statusLabel(summary) {
  if (summary.status === "healthy") return "Healthy";
  if (summary.status === "attention") return "Needs Attention";
  return "Critical";
}

export default function ContentCompletenessPage() {
  const { data } = useAdminData();
  const [coverage, setCoverage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // The local store feeds the offline fallback inside getContentCoverage();
  // with the API live it is simply ignored.
  const ctx = useMemo(
    () => ({
      subjects: data.subjects,
      courses: data.courses,
      courseCatalog: data.courseCatalog,
      lessons: data.lessons,
      questions: data.questions,
      chapters: data.chapters,
      quizzes: data.quizzes,
    }),
    [data]
  );

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    getContentCoverage(ctx)
      .then((r) => {
        if (alive) setCoverage(r);
      })
      .catch((err) => {
        if (alive) setError(err?.message ?? "Failed to load content coverage.");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [ctx]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-arcane-purple border-t-transparent" />
          <p className="text-sm text-ink-faint">Computing coverage...</p>
        </div>
      </div>
    );
  }

  if (error || !coverage) {
    return (
      <div className="rounded-2xl border border-panel-line bg-panel/60 p-8 text-center">
        <FileWarning className="mx-auto h-10 w-10 text-red-400" />
        <p className="mt-3 font-display text-lg font-bold text-ink-primary">Could not load content coverage</p>
        <p className="mt-1 text-sm text-ink-muted">{error ?? "No data returned."}</p>
      </div>
    );
  }

  const { summary, totals, perSubject, gaps } = coverage;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink-primary">Content Completeness</h2>
          <p className="mt-1 text-sm text-ink-muted">
            How far each subject has been authored across the curriculum hierarchy.
          </p>
        </div>
        <span className="flex items-center gap-2 rounded-full border border-panel-line bg-panel/60 px-3 py-1.5">
          <span className="h-2 w-2 rounded-full bg-neon-green" />
          <span className={`font-mono text-xs font-bold uppercase tracking-widest ${STATUS_STYLES[summary.status]}`}>
            {statusLabel(summary)}
          </span>
        </span>
      </div>

      {coverage.isLocalEstimate && (
        <div className="flex items-start gap-2 rounded-xl border border-reward-gold/40 bg-reward-gold/10 px-4 py-3 text-sm text-reward-gold">
          <Layers className="mt-0.5 h-5 w-5 flex-none" />
          <p>
            The API is unreachable, so these numbers are a local estimate from the admin store.
            Start <span className="font-mono text-xs">npm run dev</span> (server) for live database counts.
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Activity} label="Overall Completeness" value={`${summary.overallCompleteness}%`} sublabel="avg across active subjects" accent="cyan" />
        <StatCard icon={CheckCircle2} label="Ready Subjects" value={summary.healthy} sublabel="all layers authored" accent="green" />
        <StatCard icon={AlertTriangle} label="Needs Content" value={summary.attention} sublabel={summary.attention === 1 ? "subject partially authored" : "subjects partially authored"} accent="gold" />
        <StatCard icon={FileWarning} label="Content Gaps" value={gaps.length} sublabel={gaps.length === 1 ? "missing layer found" : "missing layers found"} accent="purple" />
      </div>

      <div className="rounded-2xl border border-panel-line bg-panel/60 p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-base font-bold text-ink-primary">Per-Subject Coverage</h3>
          <span className="font-mono text-xs text-ink-faint">
            {totals.questions} questions &middot; {totals.lessons} lessons &middot; {totals.worlds} worlds &middot; {totals.quizzes} quizzes
          </span>
        </div>

        <div className="mt-4 space-y-4">
          {perSubject.map((s) => (
            <div
              key={s.subjectCode}
              className="rounded-xl border border-panel-line/80 bg-void/40 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-8 w-8 flex-none items-center justify-center rounded-lg border border-arcane-purple/30 bg-arcane-purple/10 font-mono text-xs font-bold text-arcane-purple">
                    {s.subjectCode.slice(0, 2).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-display text-sm font-semibold text-ink-primary">{s.name}</p>
                    <p className="font-mono text-[11px] uppercase tracking-widest text-ink-faint">
                      {s.subjectCode} &middot; {s.status}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-40 overflow-hidden rounded-full bg-panel-line">
                    <div
                      className={`h-2.5 rounded-full transition-all ${
                        s.completeness === 100
                          ? "bg-neon-green"
                          : s.completeness > 0
                            ? "bg-neon-cyan"
                            : "bg-red-400"
                      }`}
                      style={{ width: `${Math.max(2, s.completeness)}%` }}
                    />
                  </div>
                  <span className="w-10 text-right font-mono text-sm font-bold text-ink-primary">
                    {s.completeness}%
                  </span>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
                {LAYER_ORDER.map((layer) => {
                  const count = s[layer] || 0;
                  const present = count > 0;
                  return (
                    <div
                      key={layer}
                      className={`rounded-lg border px-2.5 py-2 ${
                        present
                          ? "border-neon-green/30 bg-neon-green/10"
                          : "border-panel-line bg-void/60"
                      }`}
                    >
                      <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
                        {LAYER_LABELS[layer]}
                      </p>
                      <p className={`mt-0.5 font-mono text-sm font-bold ${present ? "text-neon-green" : "text-ink-faint"}`}>
                        {count}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {gaps.length > 0 && (
        <div className="rounded-2xl border border-panel-line bg-panel/60 p-5">
          <h3 className="font-display text-base font-bold text-ink-primary">Content Gaps</h3>
          <p className="mt-1 text-xs text-ink-muted">
            Layers an active subject has not been authored for yet. Fix these, and the subject turns green.
          </p>
          <ul className="mt-3 divide-y divide-panel-line">
            {gaps.map((g, i) => (
              <li key={`${g.subjectCode}-${g.layer}`} className="flex items-center justify-between gap-3 py-2.5">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex-none font-mono text-xs text-ink-faint">{i + 1}</span>
                  <p className="truncate text-sm text-ink-primary">{g.message}</p>
                </div>
                <span className="flex-none font-mono text-xs capitalize text-reward-gold">
                  {LAYER_LABELS[g.layer]}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}