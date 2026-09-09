import { AlertTriangle } from "lucide-react";

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <>
      <div className="bottom-sheet-overlay" onClick={onCancel} aria-hidden="true" />
      <div className="bottom-sheet-container !max-w-sm" role="dialog" aria-modal="true" aria-label={title}>
        <div className="bottom-sheet-handle" />
        <div className="px-5 pb-5 pt-2">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full border border-red-500/40 bg-red-500/10 text-red-400">
              <AlertTriangle className="h-5 w-5" strokeWidth={1.8} />
            </span>
            <h3 className="font-display text-lg font-bold text-ink-primary">{title}</h3>
          </div>
          <p className="mt-3 font-body text-sm leading-relaxed text-ink-muted">{message}</p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="tap-feedback rounded-xl border border-panel-line bg-panel-alt px-4 py-3 font-display text-sm font-semibold text-ink-muted transition-colors hover:text-ink-primary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="tap-bounce rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-4 py-3 font-display text-sm font-semibold text-white shadow-glow-cyan transition-all hover:brightness-110"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
}