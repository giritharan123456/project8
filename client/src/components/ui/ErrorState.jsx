import { AlertTriangle, RotateCw } from "lucide-react";

// Reusable error block for sections that fail to load. Shows a warning
// icon, the failure message, and an optional retry button wired to onRetry.
export default function ErrorState({ message = "Something went wrong.", onRetry }) {
  return (
    <div className="animate-fade-up flex flex-col items-center justify-center rounded-card border border-red-500/30 bg-red-500/5 px-6 py-10 text-center">
      <span className="tap-bounce flex h-14 w-14 items-center justify-center rounded-full border border-red-500/40 bg-red-500/10">
        <AlertTriangle className="h-7 w-7 text-red-400" strokeWidth={1.6} />
      </span>
      <p className="mt-4 font-display text-base font-semibold text-ink-primary">Failed to load</p>
      <p className="mt-1 max-w-xs font-body text-xs text-ink-muted">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="tap-bounce mt-5 flex items-center gap-2 rounded-control border border-panel-line bg-panel/60 px-6 py-3 font-display text-xs font-bold uppercase tracking-wider text-ink-primary transition-all hover:border-neon-cyan/50 hover:text-neon-cyan"
        >
          <RotateCw className="h-3.5 w-3.5" /> Retry
        </button>
      )}
    </div>
  );
}