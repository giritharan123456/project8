import { useState, useEffect } from "react";
import { Trophy } from "lucide-react";

const DISMISS_MS = 5000;

export default function AchievementToast({ achievement, onDismiss, onClick }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation on next frame
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

  if (!achievement) return null;

  return (
    <div
      className={`pointer-events-auto flex w-80 cursor-pointer items-start gap-3 rounded-xl border border-reward-gold/40 bg-panel/95 p-3 shadow-xl shadow-black/30 backdrop-blur transition-all duration-400 ${
        visible
          ? "translate-y-0 opacity-100"
          : "-translate-y-4 opacity-0"
      }`}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-reward-gold/15">
        <Trophy className="h-5 w-5 text-reward-gold" strokeWidth={1.8} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-display text-sm font-bold text-reward-gold">
          Achievement Unlocked!
        </p>
        <p className="mt-0.5 font-display text-xs font-semibold text-ink-primary">
          {achievement.name}
        </p>
        {achievement.description && (
          <p className="mt-0.5 line-clamp-2 font-body text-[11px] text-ink-muted">
            {achievement.description}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
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
