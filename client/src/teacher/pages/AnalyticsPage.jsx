import { useMemo } from "react";
import { TrendingUp, Award, AlertTriangle, Users } from "lucide-react";
import StatCard from "../../admin/components/StatCard.jsx";
import DataTable from "../../admin/components/DataTable.jsx";
import { useTeacherData } from "../TeacherContext.jsx";
import { RosterError } from "./SchoolPage.jsx";

// "Analytics" - deeper, per-student performance rollups than the
// school-wide summary on the Reports page: highest/average score, time
// taken, and who's excelling vs. who needs attention. Backed by GET
// /api/teacher/analytics (school-scoped, same as every other route here).
function formatMs(ms) {
  if (!ms) return "\u2014";
  const seconds = Math.round(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
}

function PerformanceBadge({ score, completedLessons }) {
  if (!completedLessons) {
    return <span className="rounded-full bg-panel-line px-2.5 py-1 font-mono text-[10px] uppercase text-ink-faint">No activity</span>;
  }
  if (score >= 85) {
    return <span className="rounded-full bg-neon-green/15 px-2.5 py-1 font-mono text-[10px] uppercase text-neon-green">Excellent</span>;
  }
  if (score >= 60) {
    return <span className="rounded-full bg-neon-cyan/15 px-2.5 py-1 font-mono text-[10px] uppercase text-neon-cyan">Good</span>;
  }
  return <span className="rounded-full bg-red-500/15 px-2.5 py-1 font-mono text-[10px] uppercase text-red-300">Needs Improvement</span>;
}

function BandBarChart({ bands }) {
  const total = Math.max(1, bands.excellent + bands.good + bands.needsImprovement + bands.noActivity);
  const segments = [
    { label: "Excellent (85%+)", value: bands.excellent, color: "#4ADE80" },
    { label: "Good (60\u201384%)", value: bands.good, color: "#38D9F4" },
    { label: "Needs Improvement", value: bands.needsImprovement, color: "#FCD34D" },
    { label: "No Activity", value: bands.noActivity, color: "#3A3E68" },
  ].filter((s) => s.value > 0);

  return (
    <div>
      <div className="flex h-10 w-full overflow-hidden rounded-xl border border-panel-line">
        {segments.map((s) => (
          <div
            key={s.label}
            className="flex items-center justify-center transition-all"
            style={{ width: `${(s.value / total) * 100}%`, backgroundColor: `${s.color}66` }}
            title={`${s.label}: ${s.value}`}
          >
            {s.value / total >= 0.09 && (
              <span className="font-mono text-[10px] font-bold text-void">{s.value}</span>
            )}
          </div>
        ))}
        {segments.length === 0 && <div className="w-full bg-panel-line" />}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 sm:grid-cols-4">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-2 text-xs">
            <span className="h-2.5 w-2.5 flex-none rounded-sm" style={{ backgroundColor: s.color }} />
            <span className="truncate text-ink-muted">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const { data, rosterLoading, rosterError, refetchRoster } = useTeacherData();
  const analytics = data.analytics;

  const columns = useMemo(
    () => [
      { key: "name", label: "Student" },
      { key: "grade", label: "Class", render: (row) => <span className="text-ink-primary">Grade {row.grade} &middot; {row.board}</span> },
      { key: "completedLessons", label: "Completed" },
      { key: "highestScore", label: "Highest Score", render: (row) => <span className="font-mono text-reward-gold">{row.highestScore}%</span> },
      { key: "averageScore", label: "Average Score", render: (row) => <span className="font-mono text-neon-cyan">{row.averageScore}%</span> },
      { key: "avgTimeTakenMs", label: "Avg. Time Taken", render: (row) => <span className="text-ink-primary">{formatMs(row.avgTimeTakenMs)}</span> },
      {
        key: "performance",
        label: "Performance",
        render: (row) => <PerformanceBadge score={row.averageScore} completedLessons={row.completedLessons} />,
      },
    ],
    []
  );

  if (rosterLoading) return <p className="text-sm text-ink-faint">Loading analytics…</p>;
  if (rosterError) return <RosterError message={rosterError} onRetry={refetchRoster} />;
  if (!analytics) return null;

  const { performanceBands, topPerformers, needsAttention, students } = analytics;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-ink-primary">Analytics</h2>
        <p className="mt-1 text-sm text-ink-muted">Per-student performance, aggregated from real quiz and lesson attempts.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Award} label="Excellent (85%+)" value={performanceBands.excellent} accent="green" />
        <StatCard icon={TrendingUp} label="Good (60-84%)" value={performanceBands.good} accent="cyan" />
        <StatCard icon={AlertTriangle} label="Needs Improvement" value={performanceBands.needsImprovement} accent="gold" />
        <StatCard icon={Users} label="No Activity Yet" value={performanceBands.noActivity} accent="purple" />
      </div>

      <div className="rounded-2xl border border-panel-line bg-panel/60 p-5">
        <h3 className="font-display text-base font-bold text-ink-primary">Performance Distribution</h3>
        <p className="mt-1 text-xs text-ink-muted">Share of students in each band, by average score.</p>
        <div className="mt-4">
          <BandBarChart bands={performanceBands} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-panel-line bg-panel/60 p-5">
          <h3 className="font-display text-base font-bold text-ink-primary">Top Performers</h3>
          <div className="mt-3 divide-y divide-panel-line">
            {topPerformers.length === 0 && <p className="py-4 text-sm text-ink-faint">Not enough activity yet.</p>}
            {topPerformers.map((s) => (
              <div key={s.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate font-display text-sm font-semibold text-ink-primary">{s.name}</p>
                  <p className="truncate text-xs text-ink-muted">Grade {s.grade} &middot; {s.board}</p>
                </div>
                <span className="flex-none font-mono text-xs text-neon-green">{s.averageScore}% avg</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-panel-line bg-panel/60 p-5">
          <h3 className="font-display text-base font-bold text-ink-primary">Needs Attention</h3>
          <div className="mt-3 divide-y divide-panel-line">
            {needsAttention.length === 0 && <p className="py-4 text-sm text-ink-faint">No students flagged.</p>}
            {needsAttention.map((s) => (
              <div key={s.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate font-display text-sm font-semibold text-ink-primary">{s.name}</p>
                  <p className="truncate text-xs text-ink-muted">Grade {s.grade} &middot; {s.board}</p>
                </div>
                <span className="flex-none font-mono text-xs text-red-300">{s.averageScore}% avg</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <DataTable
        title="All Students"
        description="Highest score, average score, and time taken across every recorded attempt."
        columns={columns}
        rows={students}
        searchKeys={["name", "grade", "board"]}
      />
    </div>
  );
}
