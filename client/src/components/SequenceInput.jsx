import { X } from "lucide-react";

// Drag and Drop (Section 16), implemented as tap-to-build-a-sequence
// rather than native HTML5 drag-and-drop — same touch-first reasoning as
// MatchPairsInput. The player taps items from the pool, in order, into
// the answer tray; tapping a tray chip removes it so a misorder can be
// undone before submitting. Auto-submits once every item is placed.
export default function SequenceInput({ pool, order, onPick, onRemove, disabled }) {
  const remaining = pool.filter((item) => !order.includes(item));

  return (
    <div className="mt-6">
      <p className="mb-2 text-center font-mono text-[11px] uppercase tracking-widest text-ink-faint">
        Tap items in the correct order
      </p>

      {/* Answer tray */}
      <div className="mb-4 flex min-h-[3rem] flex-wrap items-center justify-center gap-2 rounded-lg border border-dashed border-panel-line bg-void/20 p-3">
        {order.length === 0 && (
          <span className="font-mono text-xs text-ink-faint">Your sequence appears here</span>
        )}
        {order.map((item, i) => (
          <button
            key={item}
            type="button"
            disabled={disabled}
            onClick={() => onRemove(item)}
            className="flex items-center gap-1.5 rounded-full border border-neon-cyan/50 bg-neon-cyan/10 px-3 py-1.5 font-body text-sm text-ink-primary transition-opacity disabled:opacity-70"
          >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neon-cyan/20 font-mono text-[10px] text-neon-cyan">
              {i + 1}
            </span>
            {item}
            {!disabled && <X className="h-3.5 w-3.5 text-ink-faint" />}
          </button>
        ))}
      </div>

      {/* Pool */}
      <div className="flex flex-wrap justify-center gap-2">
        {remaining.map((item) => (
          <button
            key={item}
            type="button"
            disabled={disabled}
            onClick={() => onPick(item)}
            className="rounded-full border border-panel-line bg-panel/60 px-3 py-1.5 font-body text-sm text-ink-primary transition-colors hover:border-ink-faint disabled:opacity-40"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
