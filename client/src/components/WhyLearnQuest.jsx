import * as Icons from "lucide-react";
import { FEATURES, FEATURE_ACCENTS } from "../data/content.js";

function FeatureCard({ feature }) {
  const Icon = Icons[feature.icon] ?? Icons.Sparkles;
  const accent = FEATURE_ACCENTS[feature.type];

  return (
    <div
      className={`hud-frame group relative rounded-xl border border-panel-line bg-panel/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-transparent ${accent.glow}`}
      style={{ "--hud-color": accent.color }}
    >
      <div
        className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg border"
        style={{
          borderColor: `${accent.color}55`,
          background: `${accent.color}14`,
        }}
      >
        <Icon className="h-6 w-6" style={{ color: accent.color }} strokeWidth={1.8} />
      </div>

      <h3 className="font-display text-xl font-semibold text-ink-primary">
        {feature.title}
      </h3>
      <p className="mt-2 font-body text-sm leading-relaxed text-ink-muted">
        {feature.description}
      </p>

      <div
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 animate-pulse-border"
        style={{ boxShadow: `inset 0 0 0 1px ${accent.color}66` }}
      />
    </div>
  );
}

export default function WhyLearnQuest() {
  return (
    <section id="why" className="relative bg-void px-6 py-28 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-neon-cyan">
            Game Features
          </span>
          <h2 className="mt-3 font-display text-4xl font-bold text-ink-primary sm:text-5xl">
            Why Play <span className="text-neon-green">LearnQuest?</span>
          </h2>
          <p className="mt-4 font-body text-ink-muted">
            Six reasons learning stops feeling like homework and starts
            feeling like the next level you can't put down.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
