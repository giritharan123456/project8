import { Link } from "react-router-dom";
import { Star, Trophy } from "lucide-react";
import { getLeaderboardData } from "../data/content.js";

const RANK_COLOR = { 1: "#FCD34D", 2: "#C4BAD4", 3: "#CD853F" };

export default function LeaderboardPreview() {
  const { rows } = getLeaderboardData("global", "weekly", "9", "CBSE");
  const top5 = rows.slice(0, 5);

  return (
    <section id="leaderboard" className="relative bg-void px-6 py-28 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-reward-gold">
            Climb The Ranks
          </span>
          <h2 className="mt-3 font-display text-4xl font-bold text-ink-primary sm:text-5xl">
            <span className="text-reward-gold">Leaderboard</span>
          </h2>
          <p className="mt-4 font-body text-ink-muted">
            Compete globally, by class, or by board &mdash; weekly, monthly,
            or all-time.
          </p>
        </div>

        <div
          className="hud-frame mx-auto mt-14 rounded-xl border border-panel-line bg-panel/60 backdrop-blur"
          style={{ "--hud-color": "#FCD34D" }}
        >
          <div className="flex items-center justify-between border-b border-panel-line px-6 py-3 font-mono text-xs uppercase tracking-[0.15em] text-ink-faint">
            <span>This Week &middot; Global</span>
            <Trophy className="h-4 w-4 text-reward-gold" />
          </div>
          <ul className="divide-y divide-panel-line">
            {top5.map((row) => (
              <li
                key={row.rank}
                className="flex items-center gap-4 px-6 py-3.5"
              >
                <span
                  className="w-6 flex-none font-mono text-sm font-bold"
                  style={{ color: RANK_COLOR[row.rank] ?? "rgb(var(--color-ink-faint))" }}
                >
                  #{row.rank}
                </span>
                <span className="flex-1 truncate font-display text-sm font-semibold text-ink-primary">
                  {row.name}
                </span>
                <span className="flex-none font-mono text-xs text-ink-muted">
                  Lvl {row.level}
                </span>
                <span className="flex flex-none items-center gap-1 font-mono text-xs text-reward-gold">
                  <Star className="h-3 w-3 fill-current" /> {row.stars}
                </span>
                <span className="w-16 flex-none text-right font-mono text-sm font-semibold text-neon-cyan">
                  {row.xp.toLocaleString("en-IN")} XP
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/login"
            className="font-display text-sm font-semibold uppercase tracking-wider text-neon-cyan hover:text-ink-primary"
          >
            Sign in to see the full board &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
