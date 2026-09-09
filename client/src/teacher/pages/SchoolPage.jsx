import { Landmark, GraduationCap, Users, CalendarDays } from "lucide-react";
import { useTeacherData } from "../TeacherContext.jsx";
import StatCard from "../../admin/components/StatCard.jsx";

export default function SchoolPage() {
  const { data, rosterLoading, rosterError, refetchRoster } = useTeacherData();
  const school = data.school;

  if (rosterLoading) {
    return <p className="text-sm text-ink-faint">Loading your school…</p>;
  }
  if (rosterError) {
    return <RosterError message={rosterError} onRetry={refetchRoster} />;
  }
  if (!school) {
    return (
      <div className="rounded-2xl border border-panel-line bg-panel/60 p-8 text-center text-sm text-ink-faint">
        Your account isn't linked to a school yet. Contact an admin to get set up.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-ink-primary">My School</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Every student and teacher you see anywhere in this portal belongs to this school - that filtering happens
          on the server, not just here.
        </p>
      </div>

      <div className="rounded-2xl border border-panel-line bg-panel/60 p-6">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 flex-none items-center justify-center rounded-2xl border border-arcane-purple/40 bg-arcane-purple/10 text-arcane-purple">
            <Landmark className="h-7 w-7" strokeWidth={1.8} />
          </span>
          <div>
            <h3 className="font-display text-xl font-bold text-ink-primary">{school.name}</h3>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-faint">
              <CalendarDays className="h-3.5 w-3.5" />
              {school.created_at
                ? `On file since ${new Date(school.created_at).toLocaleDateString()}`
                : "Platform-wide view"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
        <StatCard icon={GraduationCap} label="Students" value={school.studentCount} accent="purple" />
        <StatCard icon={Users} label="Teachers" value={school.teacherCount} accent="cyan" />
      </div>
    </div>
  );
}

export function RosterError({ message, onRetry }) {
  return (
    <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-6 text-center">
      <p className="text-sm text-red-300">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 rounded-lg border border-panel-line px-3 py-1.5 font-display text-xs font-semibold text-ink-muted transition-colors hover:text-ink-primary"
        >
          Retry
        </button>
      )}
    </div>
  );
}
