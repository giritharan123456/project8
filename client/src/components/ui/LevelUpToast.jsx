import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

const DISMISS_MS = 4000;

export default function LevelUpToast({ level, xpEarned, onDismiss }) {
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

  if (!level) return null;

  return (
    <div
      className={`pointer-events-auto flex w-80 items-start gap-3 rounded-xl border border-arcane-purple/40 bg-panel/95 p-3 shadow-xl shadow-black/30 backdrop-blur transition-all duration-400 ${
        visible
          ? "translate-y-0 opacity-100"
          : "-translate-y-4 opacity-0"
      }`}
    >
      <div className="relative flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-arcane-purple/15">
        <Sparkles className="h-5 w-5 text-arcane-purple" strokeWidth={1.8} />
        <div className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-arcane-purple px-1 font-mono text-[8px] font-bold text-white">
          {level}
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-display text-sm font-bold text-arcane-purple">
          Level {level} Reached!
        </p>
        {xpEarned != null && (
          <p className="mt-0.5 font-body text-[11px] text-ink-muted">
            +{xpEarned} XP earned this session
          </p>
        )}
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
