import * as Icons from "lucide-react";

// Selectable subject card for the dashboard's "Your Subjects" grid and any
// other subject-picker surface. Renders the subject's icon (by code lookup
// into lucide-react), name, current progress, and a click target.
//
// `subject` â€” { code, name, icon, color, progress }. `onClick` fires on
// click; omit it to render the card as a plain (non-interactive) block.
export default function SubjectCard({ subject, onClick }) {
  const Icon = Icons[subject?.icon] ?? Icons.BookOpen;
  const color = subject?.color ?? "#806BFF";
  const progress = subject?.progress ?? 0;

  const content = (
    <>
      <div
        className="flex h-12 w-12 items-center justify-center rounded-xl border"
        style={{ borderColor: `${color}55`, background: `${color}14` }}
      >
        <Icon className="h-6 w-6" style={{ color }} strokeWidth={1.8} />
      </div>
      <div className="mt-3 min-w-0 flex-1">
        <p className="truncate font-display text-sm font-bold text-ink-primary">
          {subject?.name ?? "Subject"}
        </p>
        <p className="truncate font-mono text-[10px] text-ink-faint">{subject?.code ?? ""}</p>
        <div className="mt-2 flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-panel-line">
            <div className="h-full rounded-full" style={{ width: `${progress}%`, background: color }} />
          </div>
          <span className="font-mono text-[10px] text-ink-muted">{progress}%</span>
        </div>
      </div>
    </>
  );

  const boxClass =
    "flex flex-col rounded-card border border-panel-line bg-panel/60 p-4 shadow-soft transition-all duration-200";

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${boxClass} cursor-pointer text-left hover:-translate-y-1 hover:border-neon-cyan/50 hover:shadow-glow-cyan`}
      >
        {content}
      </button>
    );
  }

  return <div className={boxClass}>{content}</div>;
}
