import * as Icons from "lucide-react";
import { Lock } from "lucide-react";
import { MOCK_ACHIEVEMENTS } from "../data/content.js";

function Badge({ achievement }) {
  const Icon = Icons[achievement.icon] ?? Icons.Award;
  const locked = !achievement.unlocked;

  return (
    <div
      className={`hud-frame flex flex-col items-center rounded-xl border border-panel-line bg-panel/60 p-5 text-center transition-all duration-300 ${
        locked ? "opacity-50" : "hover:-translate-y-1"
      }`}
      style={{ "--hud-color": locked ? "rgb(var(--color-ink-faint))" : "#FCD34D" }}
    >
      <div
        className="flex h-14 w-14 items-center justify-center rounded-full border-2"
        style={{
          borderColor: locked ? "rgba(var(--color-ink-faint), 0.33)" : "#FCD34D88",
          background: locked ? "rgba(var(--color-ink-faint), 0.08)" : "#FCD34D14",
        }}
      >
        {locked ? (
          <Lock className="h-5 w-5 text-ink-faint" />
        ) : (
          <Icon className="h-6 w-6 text-reward-gold" strokeWidth={1.8} />
        )}
      </div>
      <p className="mt-3 font-display text-sm font-semibold text-ink-primary">
        {achievement.name}
      </p>
    </div>
  );
}

export default function AchievementsPreview() {
  return (
    <section id="achievements" className="relative bg-void-soft px-6 py-28 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-neon-cyan">
            Collect Them All
          </span>
          <h2 className="mt-3 font-display text-4xl font-bold text-ink-primary sm:text-5xl">
            <span className="text-neon-cyan">Achievements</span>
          </h2>
          <p className="mt-4 font-body text-ink-muted">
            Streaks, boss kills, perfect scores &mdash; every milestone earns
            a badge for your profile.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-5 sm:grid-cols-4 lg:grid-cols-8">
          {MOCK_ACHIEVEMENTS.map((a) => (
            <Badge key={a.id} achievement={a} />
          ))}
        </div>
      </div>
    </section>
  );
}
