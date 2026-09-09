import { useState, useEffect } from "react";
import { ArrowRight, Circle, BookOpen, Target, Zap, Crown } from "lucide-react";
import { getMasteryColor, getMasteryLabel } from "../../lib/masteryEngine.js";

const DISMISS_MS = 3000;

const ICON_MAP = {
  not_started: Circle,
  learning: BookOpen,
  practicing: Target,
  strong: Zap,
  mastered: Crown,
};

export default function MasteryUpdateToast({ concept, oldLevel, newLevel, onDismiss }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDismiss?.(), 400);
    }, DISMISS_MS);
    return () => clearTimeout(timer);
  }, [visible, onDismiss]);

  if (!concept || !newLevel) return null;

  const NewIcon = ICON_MAP[newLevel] ?? Circle;
  const color = getMasteryColor(newLevel);

  return (
    <div
      className={`pointer-events-auto flex w-80 items-start gap-3 rounded-xl border bg-panel/95 p-3 shadow-xl shadow-black/30 backdrop-blur transition-all duration-400 ${
        visible
          ? "translate-y-0 opacity-100"
          : "-translate-y-4 opacity-0"
      }`}
      style={{ borderColor: `${color}66` }}
    >
      <div
        className="flex h-10 w-10 flex-none items-center justify-center rounded-lg"
        style={{ backgroundColor: `${color}20` }}
      >
        <NewIcon className="h-5 w-5" style={{ color }} strokeWidth={1.8} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-display text-sm font-bold text-ink-primary">
          Mastery Update
        </p>
        <p className="mt-0.5 font-body text-[11px] text-ink-muted">
          {concept}
        </p>
        <div className="mt-1 flex items-center gap-1.5">
          {oldLevel && (
            <span
              className="rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold"
              style={{
                color: getMasteryColor(oldLevel),
                backgroundColor: `${getMasteryColor(oldLevel)}15`,
              }}
            >
              {getMasteryLabel(oldLevel)}
            </span>
          )}
          <ArrowRight className="h-3 w-3 text-ink-faint" />
          <span
            className="rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold"
            style={{
              color,
              backgroundColor: `${color}15`,
            }}
          >
            {getMasteryLabel(newLevel)}
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={() => {
          setVisible(false);
          setTimeout(() => onDismiss?.(), 400);
        }}
        className="flex-none font-mono text-[10px] uppercase tracking-widest text-ink-faint hover:text-ink-primary"
      >
        Close
      </button>
    </div>
  );
}
