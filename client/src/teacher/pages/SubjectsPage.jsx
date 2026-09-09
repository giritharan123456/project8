import { BookMarked } from "lucide-react";
import { useTeacherData } from "../TeacherContext.jsx";
import { RosterError } from "./SchoolPage.jsx";

export default function SubjectsPage() {
  const { data, rosterLoading, rosterError, refetchRoster } = useTeacherData();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-ink-primary">My Subjects</h2>
        <p className="mt-1 text-sm text-ink-muted">Subjects you told us you teach when you registered.</p>
      </div>

      {rosterLoading ? (
        <p className="text-sm text-ink-faint">Loading…</p>
      ) : rosterError ? (
        <RosterError message={rosterError} onRetry={refetchRoster} />
      ) : data.subjects.length === 0 ? (
        <div className="rounded-2xl border border-panel-line bg-panel/60 p-8 text-center text-sm text-ink-faint">
          No subjects on file. Update this from your Profile page.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.subjects.map((name) => (
            <div key={name} className="flex items-center gap-3 rounded-2xl border border-panel-line bg-panel/60 p-5">
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-lg border border-neon-cyan/40 bg-neon-cyan/10 text-neon-cyan">
                <BookMarked className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <h3 className="font-display text-base font-bold text-ink-primary">{name}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
