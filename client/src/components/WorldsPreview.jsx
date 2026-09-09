import * as Icons from "lucide-react";
import { Lock, Star } from "lucide-react";
import { getLandingSubject } from "../lib/landingSubject.js";

const ACCENTS = ["#4ADE80", "#38D9F4", "#806BFF", "#FCD34D", "#38D9F4", "#806BFF"];

// Illustrative-only unlock states for the marketing preview â€” the real
// per-player state comes from getWorldMap() once signed in (Section 10).
const PREVIEW_STATE = ["completed", "completed", "unlocked", "locked", "locked", "locked"];

function WorldCard({ world, index }) {
  const Icon = Icons[world.icon] ?? Icons.Map;
  const color = ACCENTS[index % ACCENTS.length];
  const state = PREVIEW_STATE[index];
  const locked = state === "locked";

  return (
    <div
      className={`hud-frame relative flex flex-col rounded-xl border border-panel-line bg-panel/60 p-6 transition-all duration-300 ${
        locked ? "opacity-60" : "hover:-translate-y-1"
      }`}
      style={{ "--hud-color": locked ? "rgb(var(--color-ink-faint))" : color }}
    >
      <div className="flex items-start justify-between">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-lg border"
          style={{
            borderColor: locked ? "rgba(var(--color-ink-faint), 0.33)" : `${color}55`,
            background: locked ? "rgba(var(--color-ink-faint), 0.08)" : `${color}14`,
          }}
        >
          {locked ? (
            <Lock className="h-5 w-5 text-ink-faint" strokeWidth={1.8} />
          ) : (
            <Icon className="h-6 w-6" style={{ color }} strokeWidth={1.8} />
          )}
        </div>
        {state === "completed" && (
          <div className="flex gap-0.5">
            {[0, 1, 2].map((i) => (
              <Star key={i} className="h-4 w-4 fill-reward-gold text-reward-gold" />
            ))}
          </div>
        )}
      </div>

      <h3 className="mt-4 font-display text-xl font-bold text-ink-primary">
        {world.name}
      </h3>
      <p className="mt-1 font-body text-sm text-ink-muted">{world.topic}</p>

      {world.isFinal && (
        <span className="mt-3 inline-flex w-fit rounded-full border border-reward-gold/50 bg-reward-gold/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-reward-gold">
          Final World
        </span>
      )}

      <p className="mt-3 font-mono text-xs text-ink-faint">
        Boss: <span className="text-ink-muted">{world.boss}</span>
      </p>
    </div>
  );
}

export default function WorldsPreview() {
  const { name, template } = getLandingSubject();

  return (
    <section id="worlds" className="relative bg-void-soft px-6 py-28 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-arcane-purple">
            Step 3
          </span>
          <h2 className="mt-3 font-display text-4xl font-bold text-ink-primary sm:text-5xl">
            The {name} <span className="text-neon-cyan">World</span>
          </h2>
          <p className="mt-4 font-body text-ink-muted">
            Six worlds, six chapter bosses. Clear one to unlock the next â€”
            and earn stars, XP, and badges along the way.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {template.map((world, i) => (
            <WorldCard key={world.id} world={world} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
