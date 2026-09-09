import { Layers } from "lucide-react";
import { useTeacherData } from "../TeacherContext.jsx";
import { RosterError } from "./SchoolPage.jsx";

export default function ClassesPage() {
  const { data, rosterLoading, rosterError, refetchRoster } = useTeacherData();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-ink-primary">My Classes</h2>
        <p className="mt-1 text-sm text-ink-muted">Grade / board groups among your school's students.</p>
      </div>

      {rosterLoading ? (
        <p className="text-sm text-ink-faint">Loading…</p>
      ) : rosterError ? (
        <RosterError message={rosterError} onRetry={refetchRoster} />
      ) : data.classes.length === 0 ? (
        <div className="rounded-2xl border border-panel-line bg-panel/60 p-8 text-center text-sm text-ink-faint">
          No students at your school yet.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.classes.map((c) => (
            <div key={`${c.grade}-${c.board}`} className="rounded-2xl border border-panel-line bg-panel/60 p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-lg border border-arcane-purple/40 bg-arcane-purple/10 text-arcane-purple">
                  <Layers className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <div>
                  <h3 className="font-display text-base font-bold text-ink-primary">Grade {c.grade}</h3>
                  <p className="text-xs text-ink-muted">{c.board}</p>
                </div>
              </div>
              <div className="mt-4 rounded-lg bg-void/60 py-3 text-center">
                <p className="font-display text-lg font-bold text-ink-primary">{c.studentCount}</p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">Students</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
