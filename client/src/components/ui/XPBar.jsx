import { Zap } from "lucide-react";

// Level + XP progress display used in the player card, dashboard hero, and
// anywhere else the "how close to the next level" readout belongs.
//
// Animates the fill width from 0 to the real percentage on mount so level
// progress never just snaps into place.
export default function XPBar({ level = 1, xp = 0, xpToNext = 100 }) {
  const pct = Math.max(0, Math.min(100, Math.round((xp / (xpToNext || 1)) * 100)));

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 font-display text-xs font-semibold uppercase tracking-widest text-neon-cyan">
          <Zap className="h-3.5 w-3.5" strokeWidth={2} />
          Level {level}
        </span>
        <span className="font-mono text-[10px] text-ink-faint">
          {xp} / {xpToNext} XP
        </span>
      </div>
      <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full border border-panel-line bg-panel/60">
        <div
          className="h-full rounded-full bg-gradient-to-r from-arcane-purple to-neon-cyan shadow-glow-purple transition-[width] duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-1 font-mono text-[10px] text-ink-muted">
        {Math.max(0, xpToNext - xp)} XP until Level {level + 1}
      </p>
    </div>
  );
}
