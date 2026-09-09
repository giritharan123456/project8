import * as Icons from "lucide-react";
import { Zap, Coins } from "lucide-react";
import { DIFFICULTIES, DIFFICULTY_ACCENTS, SHOP_ITEMS, BOSS_REWARD } from "../data/content.js";

const POWERUPS = SHOP_ITEMS.filter((item) => item.category === "powerups");

function TierCard({ tier }) {
  const color = DIFFICULTY_ACCENTS[tier.id];
  return (
    <div
      className="hud-frame rounded-xl border border-panel-line bg-panel/60 p-5 text-center"
      style={{ "--hud-color": color }}
    >
      <span
        className="font-display text-sm font-bold uppercase tracking-[0.15em]"
        style={{ color }}
      >
        {tier.label}
      </span>
      <div className="mt-3 flex items-center justify-center gap-1.5 font-mono text-lg font-semibold text-ink-primary">
        <Zap className="h-4 w-4 text-reward-gold" /> +{tier.xp} XP
      </div>
      <div className="mt-1 flex items-center justify-center gap-1.5 font-mono text-sm text-ink-muted">
        <Coins className="h-3.5 w-3.5 text-reward-gold" /> +{tier.coins}
      </div>
    </div>
  );
}

function PowerupPill({ item }) {
  const Icon = Icons[item.icon] ?? Icons.Sparkles;
  return (
    <div className="flex items-center gap-3 rounded-lg border border-panel-line bg-panel/50 px-4 py-3">
      <div className="flex h-9 w-9 flex-none items-center justify-center rounded-lg border border-neon-cyan/40 bg-neon-cyan/10">
        <Icon className="h-4.5 w-4.5 text-neon-cyan" strokeWidth={1.8} />
      </div>
      <div className="min-w-0">
        <p className="truncate font-display text-sm font-semibold text-ink-primary">
          {item.name}
        </p>
        <p className="truncate font-body text-xs text-ink-muted">{item.description}</p>
      </div>
      <span className="ml-auto flex flex-none items-center gap-1 font-mono text-xs text-reward-gold">
        <Coins className="h-3 w-3" /> {item.price}
      </span>
    </div>
  );
}

export default function RewardsPreview() {
  return (
    <section id="rewards" className="relative bg-void px-6 py-28 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-reward-gold">
            Step 5
          </span>
          <h2 className="mt-3 font-display text-4xl font-bold text-ink-primary sm:text-5xl">
            Earn <span className="text-reward-gold">Rewards</span>
          </h2>
          <p className="mt-4 font-body text-ink-muted">
            Every correct answer pays out. Higher difficulty, bigger reward
            &mdash; and boss fights pay out the most of all.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {DIFFICULTIES.map((tier) => (
            <TierCard key={tier.id} tier={tier} />
          ))}
        </div>

        <div
          className="hud-frame mx-auto mt-6 max-w-md rounded-xl border border-reward-gold/40 bg-reward-gold/5 p-5 text-center"
          style={{ "--hud-color": "#FCD34D" }}
        >
          <span className="font-display text-sm font-bold uppercase tracking-[0.15em] text-reward-gold">
            Boss Defeated
          </span>
          <div className="mt-2 flex items-center justify-center gap-6 font-mono text-lg font-semibold text-ink-primary">
            <span className="flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-reward-gold" /> +{BOSS_REWARD.xp} XP
            </span>
            <span className="flex items-center gap-1.5">
              <Coins className="h-4 w-4 text-reward-gold" /> +{BOSS_REWARD.coins}
            </span>
          </div>
        </div>

        <div className="mt-16">
          <h3 className="text-center font-display text-2xl font-semibold text-ink-primary">
            Power-Ups
          </h3>
          <p className="mx-auto mt-2 max-w-md text-center font-body text-sm text-ink-muted">
            Spend coins you've earned in-game &mdash; never real money.
          </p>
          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2">
            {POWERUPS.map((item) => (
              <PowerupPill key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
