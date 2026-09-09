import { Flame } from "lucide-react";

// Current login streak as a compact pill. `compact` trims the label down to
// just the number + flame (used in tight HUD corners); the default shows
// the full "X Day Streak" copy.
export default function StreakBadge({ streak = 0, compact = false }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-mono uppercase tracking-widest ${
        streak > 0
          ? "border-reward-gold/50 bg-reward-gold/10 text-reward-gold"
          : "border-panel-line bg-panel/40 text-ink-faint"
      } ${compact ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-[11px]"}`}
    >
      <Flame className="h-3.5 w-3.5" strokeWidth={2} />
      <span className="font-bold">{streak}</span>
      {!compact && <span>Day Streak</span>}
    </span>
  );
}
