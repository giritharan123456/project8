import { useState } from "react";
import { Check } from "lucide-react";

// Shared answer grid for Multiple Select questions: tap one or more
// options (each shows a check when chosen), then submit. The selection is
// confirmed explicitly so partial answers are never accidentally graded.
// Grading lives in data/content.js's isSpecialCorrect().
export default function MultiSelectInput({ options, onSubmit, disabled }) {
  const [selected, setSelected] = useState([]);

  function toggle(opt) {
    setSelected((prev) =>
      prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]
    );
  }

  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {options.map((opt, i) => {
          const isSelected = selected.includes(opt);
          return (
            <button
              key={i}
              type="button"
              disabled={disabled}
              onClick={() => toggle(opt)}
              aria-pressed={isSelected}
              className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-left font-body text-sm transition-colors ${
                isSelected
                  ? "border-neon-cyan bg-neon-cyan/10 text-ink-primary"
                  : "border-panel-line bg-void/40 text-ink-primary hover:border-ink-faint"
              } disabled:opacity-60`}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-xl border font-mono text-[11px] transition-colors ${
                  isSelected
                    ? "border-neon-cyan bg-neon-cyan/20 text-neon-cyan"
                    : "border-panel-line text-ink-faint"
                }`}
              >
                {isSelected ? <Check className="h-4 w-4" /> : String.fromCharCode(65 + i)}
              </span>
              <span>{opt}</span>
            </button>
          );
        })}
      </div>
      <button
        type="button"
        disabled={disabled || selected.length === 0}
        onClick={() => onSubmit([...selected])}
        className="mt-4 rounded-lg bg-arcane-purple px-6 py-3 font-display text-sm font-bold uppercase tracking-wider text-white shadow-glow-purple transition-transform hover:scale-[1.02] disabled:opacity-40 disabled:hover:scale-100"
      >
        Submit Answer{selected.length > 0 ? ` (${selected.length} selected)` : ""}
      </button>
    </div>
  );
}