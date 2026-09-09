import * as Icons from "lucide-react";
import { POWERUP_ITEMS } from "../data/content.js";

// Section 20 â€” Power-Ups. A row of the five power-ups a player can carry
// into a level, each showing how many charges are left and going dim once
// they're out or the power-up doesn't apply to the moment (already used
// this question, or a level-wide effect that's already active).
//
// `active` is a set of power-up ids currently in effect for the whole run
// (Double XP, Shield) so the tray can show them as "on" instead of
// re-buyable. `usedThisQuestion` covers the per-question ones (Hint
// Potion, Clue Hint) so they can't be spammed on a single question.
export default function PowerUpBar({ counts, active = [], usedThisQuestion = [], disabled = false, onUse }) {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
      {POWERUP_ITEMS.map((item) => {
        const Icon = Icons[item.icon] ?? Icons.Sparkles;
        const count = counts[item.id] ?? 0;
        const isActive = active.includes(item.id);
        const spentHere = usedThisQuestion.includes(item.id);
        const isDisabled = disabled || count <= 0 || isActive || spentHere;

        return (
          <button
            key={item.id}
            type="button"
            title={`${item.name} â€” ${item.description}`}
            disabled={isDisabled}
            onClick={() => onUse(item.id)}
            className={`hud-frame flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest transition-transform ${
              isActive
                ? "border-neon-green/70 bg-neon-green/10 text-neon-green"
                : isDisabled
                ? "cursor-not-allowed border-panel-line/60 bg-panel/30 text-ink-faint/60"
                : "border-panel-line bg-panel/60 text-ink-primary hover:scale-105 hover:border-reward-gold/60"
            }`}
            style={{ "--hud-color": isActive ? "#4ADE80" : "#FCD34D" }}
          >
            <Icon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{item.name}</span>
            <span className="rounded-full bg-void/50 px-1.5 py-0.5 text-[10px] text-ink-faint">
              {isActive ? "ON" : spentHere ? "USED" : count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
