import { useState } from "react";

// Shared free-text answer box for the two Section 16 question types that
// have no options list: Fill in the Blank and Numerical. Used by both the
// regular Battle screen and the Chapter Boss Battle so either type
// renders identically — and safely — wherever it turns up in a
// difficulty's question pool. `numeric` switches the on-screen keyboard
// (mobile) and placeholder to something number-appropriate; grading
// itself lives in data/content.js's isFreeTextCorrect().
export default function FillBlankInput({ onSubmit, disabled, numeric = false }) {
  const [value, setValue] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (value.trim()) onSubmit(value);
      }}
      className="mt-6 flex flex-col gap-3 sm:flex-row"
    >
      <input
        type="text"
        inputMode={numeric ? "decimal" : "text"}
        value={value}
        disabled={disabled}
        onChange={(e) => setValue(e.target.value)}
        placeholder={numeric ? "Type your answer\u2026 (e.g. 44)" : "Type your answer\u2026"}
        autoComplete="off"
        className="flex-1 rounded-lg border border-panel-line bg-void/40 px-4 py-3 font-body text-sm text-ink-primary placeholder:text-ink-faint focus:border-neon-cyan focus:outline-none"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="rounded-lg bg-arcane-purple px-6 py-3 font-display text-sm font-bold uppercase tracking-wider text-white shadow-glow-purple transition-transform hover:scale-[1.02] disabled:opacity-40 disabled:hover:scale-100"
      >
        Submit
      </button>
    </form>
  );
}
