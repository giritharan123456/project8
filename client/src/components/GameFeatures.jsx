import * as Icons from "lucide-react";
import { GAME_MECHANICS } from "../data/content.js";

function MechanicCard({ mechanic }) {
  const Icon = Icons[mechanic.icon] ?? Icons.Sparkles;

  return (
    <div
      className="hud-frame relative rounded-xl border border-panel-line bg-panel/50 p-5 transition-colors duration-300 hover:border-transparent"
      style={{ "--hud-color": mechanic.color }}
    >
      <div
        className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg border"
        style={{ borderColor: `${mechanic.color}55`, background: `${mechanic.color}14` }}
      >
        <Icon className="h-5 w-5" style={{ color: mechanic.color }} strokeWidth={1.8} />
      </div>
      <h3 className="font-display text-base font-semibold text-ink-primary">
        {mechanic.title}
      </h3>
      <p className="mt-1.5 font-body text-sm leading-relaxed text-ink-muted">
        {mechanic.description}
      </p>
    </div>
  );
}

export default function GameFeatures() {
  return (
    <section id="mechanics" className="relative bg-void px-6 py-28 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-neon-cyan">
            Under The Hood
          </span>
          <h2 className="mt-3 font-display text-4xl font-bold text-ink-primary sm:text-5xl">
            Real Game <span className="text-neon-green">Mechanics</span>
          </h2>
          <p className="mt-4 font-body text-ink-muted">
            Not a quiz with a coat of paint — actual game systems running
            underneath every Chemistry lesson.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GAME_MECHANICS.map((mechanic) => (
            <MechanicCard key={mechanic.title} mechanic={mechanic} />
          ))}
        </div>
      </div>
    </section>
  );
}
