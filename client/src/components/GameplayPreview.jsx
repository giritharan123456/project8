import { Heart, Zap, Coins, Timer, Sparkles } from "lucide-react";

function HealthBar({ value, color }) {
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-void-soft">
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${value}%`, background: color }}
      />
    </div>
  );
}

const OPTIONS = [
  { id: "a", label: "A", text: "CO\u2082", state: "idle" },
  { id: "b", label: "B", text: "H\u2082O", state: "correct" },
  { id: "c", label: "C", text: "O\u2082", state: "idle" },
  { id: "d", label: "D", text: "H\u2082", state: "idle" },
];

export default function GameplayPreview() {
  return (
    <section id="gameplay" className="relative overflow-hidden bg-void px-6 py-28 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-neon-green">
            Step 4
          </span>
          <h2 className="mt-3 font-display text-4xl font-bold text-ink-primary sm:text-5xl">
            Play &amp; <span className="text-neon-green">Battle</span>
          </h2>
          <p className="mt-4 font-body text-ink-muted">
            Every lesson is a game level. Answer right, land the hit.
            Answer wrong, take the damage.
          </p>
        </div>

        <div
          className="hud-frame mx-auto mt-16 max-w-3xl rounded-2xl border border-panel-line bg-panel/70 p-6 backdrop-blur scanlines sm:p-8"
          style={{ "--hud-color": "#4ADE80" }}
        >
          {/* HUD row */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <div className="flex items-center justify-between font-mono text-xs text-ink-muted">
                <span>YOU</span>
                <span className="flex items-center gap-1 text-red-400">
                  <Heart className="h-3.5 w-3.5 fill-current" /> 2 / 3
                </span>
              </div>
              <div className="mt-1.5">
                <HealthBar value={72} color="#4ADE80" />
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 font-display text-sm font-bold uppercase tracking-widest text-ink-faint">
              VS
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between font-mono text-xs text-ink-muted">
                <span>ACID SLIME</span>
                <span>55%</span>
              </div>
              <div className="mt-1.5">
                <HealthBar value={55} color="#806BFF" />
              </div>
            </div>
          </div>

          {/* stat strip */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 border-y border-panel-line py-3 font-mono text-xs text-ink-muted sm:gap-6">
            <span className="flex items-center gap-1.5">
              <Timer className="h-3.5 w-3.5 text-neon-cyan" /> 00:14
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-reward-gold" /> +20 XP
            </span>
            <span className="flex items-center gap-1.5">
              <Coins className="h-3.5 w-3.5 text-reward-gold" /> +10
            </span>
            <span>Question 4 / 10</span>
          </div>

          {/* question */}
          <div className="mt-6 text-center">
            <p className="font-display text-xl font-semibold text-ink-primary sm:text-2xl">
              What is the chemical formula of water?
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {OPTIONS.map((opt) => (
              <div
                key={opt.id}
                className={`flex items-center gap-3 rounded-lg border px-4 py-3.5 font-body text-sm transition-colors ${
                  opt.state === "correct"
                    ? "border-neon-green bg-neon-green/10 text-ink-primary shadow-glow-green"
                    : "border-panel-line bg-void-soft/60 text-ink-muted"
                }`}
              >
                <span className="font-mono text-xs text-ink-faint">{opt.label}</span>
                <span>{opt.text}</span>
                {opt.state === "correct" && (
                  <Sparkles className="ml-auto h-4 w-4 text-neon-green" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-neon-green/50 bg-neon-green/10 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.15em] text-neon-green">
              <Zap className="h-3.5 w-3.5" /> Attack landed &mdash; -20 Enemy HP
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
