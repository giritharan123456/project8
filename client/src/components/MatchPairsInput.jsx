import { useState } from "react";
import { Check } from "lucide-react";

// Match the Following (Section 16). Deliberately tap-to-pair rather than
// native HTML5 drag-and-drop: per Section 30 ("avoid desktop-only
// interactions... do not depend heavily on hover interactions") this has
// to work with a thumb on a phone, and native DnD is unreliable on touch
// without extra libraries. Flow: tap a left item to select it (glows),
// then tap a right item to pair them â€” both lock in with a shared accent
// color. Submits automatically once every pair is made.
const PAIR_COLORS = ["#806BFF", "#38D9F4", "#4ADE80", "#FCD34D", "#A78BFA", "#FB923C"];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MatchPairsInput({ pairs, onSubmit, disabled }) {
  const [rightOrder] = useState(() => shuffle(pairs.map((p) => p.right)));
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [matches, setMatches] = useState({}); // left -> right
  const colorFor = (left) => PAIR_COLORS[pairs.findIndex((p) => p.left === left) % PAIR_COLORS.length];
  const matchedRights = new Set(Object.values(matches));

  function pickLeft(left) {
    if (disabled || matches[left]) return;
    setSelectedLeft((cur) => (cur === left ? null : left));
  }

  function pickRight(right) {
    if (disabled || matchedRights.has(right) || !selectedLeft) return;
    const next = { ...matches, [selectedLeft]: right };
    setMatches(next);
    setSelectedLeft(null);
    if (Object.keys(next).length === pairs.length) {
      onSubmit(next);
    }
  }

  return (
    <div className="mt-6">
      <p className="mb-3 text-center font-mono text-[11px] uppercase tracking-widest text-ink-faint">
        Tap an item, then tap its match
      </p>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          {pairs.map((p) => {
            const matched = !!matches[p.left];
            const active = selectedLeft === p.left;
            const accent = matched ? colorFor(p.left) : active ? "#38D9F4" : null;
            return (
              <button
                key={p.left}
                type="button"
                disabled={disabled || matched}
                onClick={() => pickLeft(p.left)}
                className="rounded-lg border px-3 py-2.5 text-left font-body text-sm text-ink-primary transition-colors disabled:cursor-default"
                style={{
                  borderColor: accent ? `${accent}88` : "var(--color-panel-line, #3A3E68)",
                  background: accent ? `${accent}18` : "rgba(10,10,20,0.3)",
                }}
              >
                <span className="flex items-center gap-1.5">
                  {matched && <Check className="h-3.5 w-3.5 shrink-0" style={{ color: accent }} />}
                  {p.left}
                </span>
              </button>
            );
          })}
        </div>
        <div className="flex flex-col gap-2">
          {rightOrder.map((right) => {
            const pairedLeft = Object.entries(matches).find(([, r]) => r === right)?.[0];
            const matched = !!pairedLeft;
            const accent = matched ? colorFor(pairedLeft) : null;
            return (
              <button
                key={right}
                type="button"
                disabled={disabled || matched || !selectedLeft}
                onClick={() => pickRight(right)}
                className="rounded-lg border px-3 py-2.5 text-left font-body text-sm text-ink-primary transition-colors disabled:cursor-default disabled:opacity-60"
                style={{
                  borderColor: accent ? `${accent}88` : "var(--color-panel-line, #3A3E68)",
                  background: accent ? `${accent}18` : "rgba(10,10,20,0.3)",
                }}
              >
                <span className="flex items-center gap-1.5">
                  {matched && <Check className="h-3.5 w-3.5 shrink-0" style={{ color: accent }} />}
                  {right}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
