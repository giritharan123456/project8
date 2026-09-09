import { useMemo, useState } from "react";
import { Eye } from "lucide-react";
import { useTeacherData } from "../TeacherContext.jsx";
import DataTable from "../../admin/components/DataTable.jsx";
import StudentProgressModal from "../components/StudentProgressModal.jsx";
import { RosterError } from "./SchoolPage.jsx";

const columns = [
  { key: "id", label: "ID", render: (row) => <span className="font-mono text-xs text-ink-faint">{row.id.slice(0, 8)}</span> },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "current_grade", label: "Grade" },
  { key: "current_board", label: "Board" },
  { key: "level", label: "Level" },
  { key: "total_xp_earned", label: "Total XP" },
  { key: "streak", label: "Streak", render: (row) => <span className="text-ink-primary">{row.streak}d</span> },
  {
    key: "highestScore",
    label: "Highest Score",
    render: (row) => (row.highestScore != null ? <span className="font-mono text-reward-gold">{row.highestScore}%</span> : <span className="text-ink-faint">{"\u2014"}</span>),
  },
  {
    key: "averageScore",
    label: "Average Score",
    render: (row) => (row.averageScore != null ? <span className="font-mono text-neon-cyan">{row.averageScore}%</span> : <span className="text-ink-faint">{"\u2014"}</span>),
  },
];

export default function StudentsPage() {
  const { data, rosterLoading, rosterError, refetchRoster } = useTeacherData();
  const [viewingId, setViewingId] = useState(null);

  const rows = useMemo(() => {
    const analyticsById = Object.fromEntries((data.analytics?.students ?? []).map((s) => [s.id, s]));
    return data.students.map((s) => ({
      ...s,
      highestScore: analyticsById[s.id]?.highestScore,
      averageScore: analyticsById[s.id]?.averageScore,
    }));
  }, [data.students, data.analytics]);

  if (rosterLoading) return <p className="text-sm text-ink-faint">Loading your students…</p>;
  if (rosterError) return <RosterError message={rosterError} onRetry={refetchRoster} />;

  return (
    <>
      <DataTable
        title="My Students"
        description="Every student at your school - filtered server-side by school_id, not just here."
        columns={columns}
        rows={rows}
        searchKeys={["id", "name", "email", "current_board"]}
        renderRowActions={(row) => (
          <button
            type="button"
            onClick={() => setViewingId(row.id)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-faint transition-colors hover:bg-arcane-purple/10 hover:text-arcane-purple"
            aria-label={`View progress for ${row.name}`}
            title="View progress"
          >
            <Eye className="h-4 w-4" strokeWidth={1.8} />
          </button>
        )}
      />
      {viewingId && <StudentProgressModal studentId={viewingId} onClose={() => setViewingId(null)} />}
    </>
  );
}
