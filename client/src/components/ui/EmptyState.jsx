import { Inbox } from "lucide-react";

// Reusable empty-state block. `icon` can be a lucide-react component.
// `action` (a click handler) + `actionLabel` render an optional CTA.
export default function EmptyState({ icon: Icon, title, description, action, actionLabel }) {
  const ResolvedIcon = typeof Icon === "string" ? null : Icon;

  return (
    <div className="animate-fade-up flex flex-col items-center justify-center rounded-card border border-dashed border-panel-line bg-panel/40 px-6 py-10 text-center">
      <span className="tap-bounce flex h-14 w-14 items-center justify-center rounded-full border border-panel-line bg-panel/60 text-ink-faint">
        {ResolvedIcon ? (
          <ResolvedIcon className="h-7 w-7" strokeWidth={1.5} />
        ) : (
          <Inbox className="h-7 w-7" strokeWidth={1.5} />
        )}
      </span>
      <p className="mt-4 font-display text-base font-semibold text-ink-primary">{title}</p>
      {description && (
        <p className="mt-1 max-w-xs font-body text-xs text-ink-muted">{description}</p>
      )}
      {action && actionLabel && (
        <button
          type="button"
          onClick={action}
          className="tap-bounce mt-5 rounded-control bg-gradient-to-r from-arcane-purple to-arcane-violet px-6 py-3 font-display text-xs font-bold uppercase tracking-wider text-white shadow-glow-purple transition-all hover:brightness-110"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}