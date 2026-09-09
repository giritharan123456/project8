import { useEffect, useState } from "react";
import { Package, PackageOpen, Sparkles } from "lucide-react";

// Chest-opening reveal used on win screens. Sequence:
//   1. Closed chest sits still, glow pulsing.
//   2. On `open`, it "pops" (scale/rotate burst) and swaps to the open icon.
//   3. Reward chips (passed as children-like `rewards` array) pop in one by
//      one after the chest opens, each with its own stagger delay.
// Respects prefers-reduced-motion by skipping straight to the end state.
export default function RewardChest({ accent = "#FCD34D", rewards = [], onRevealed }) {
  const [stage, setStage] = useState("closed"); // closed -> bursting -> open
  const [revealedCount, setRevealedCount] = useState(0);
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (reduceMotion) {
      setStage("open");
      setRevealedCount(rewards.length);
      onRevealed?.();
      return;
    }
    const openTimer = setTimeout(() => setStage("bursting"), 200);
    const settleTimer = setTimeout(() => setStage("open"), 560);
    return () => {
      clearTimeout(openTimer);
      clearTimeout(settleTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (stage !== "open" || reduceMotion) return;
    if (revealedCount >= rewards.length) {
      if (revealedCount === rewards.length && rewards.length > 0) onRevealed?.();
      return;
    }
    const t = setTimeout(() => setRevealedCount((c) => c + 1), 260);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, revealedCount]);

  const isOpen = stage !== "closed";

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex h-20 w-20 items-center justify-center">
        {/* Glow burst ring on open */}
        <div
          className={`absolute inset-0 rounded-full transition-all duration-500 ${
            stage === "bursting" ? "scale-150 opacity-0" : "scale-100 opacity-40"
          }`}
          style={{ background: `radial-gradient(circle, ${accent}55, transparent 70%)` }}
        />
        <div
          className={`relative flex h-16 w-16 items-center justify-center rounded-2xl border transition-transform duration-300 ${
            stage === "bursting" ? "scale-125 -rotate-6" : "scale-100 rotate-0"
          } ${stage === "closed" ? "animate-pulse-border" : ""}`}
          style={{ borderColor: `${accent}66`, background: `${accent}14`, "--hud-color": accent }}
        >
          {isOpen ? (
            <PackageOpen className="h-8 w-8" style={{ color: accent }} strokeWidth={1.6} />
          ) : (
            <Package className="h-8 w-8" style={{ color: accent }} strokeWidth={1.6} />
          )}
        </div>
        {stage === "bursting" && (
          <Sparkles
            className="absolute -right-1 -top-1 h-5 w-5 animate-ping"
            style={{ color: accent }}
            strokeWidth={1.8}
          />
        )}
      </div>

      {rewards.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {rewards.map((r, i) => (
            <div
              key={r.label}
              className={`flex items-center gap-1.5 rounded-full border bg-panel/70 px-3 py-1.5 transition-all duration-300 ${
                i < revealedCount || reduceMotion
                  ? "translate-y-0 scale-100 opacity-100"
                  : "translate-y-2 scale-75 opacity-0"
              }`}
              style={{ borderColor: `${r.color ?? accent}55` }}
            >
              {r.icon && <r.icon className="h-4 w-4" style={{ color: r.color ?? accent }} strokeWidth={1.8} />}
              <span className="font-display text-sm font-bold text-ink-primary">{r.value}</span>
              <span className="font-mono text-[10px] uppercase tracking-wide text-ink-faint">{r.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
