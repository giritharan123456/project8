import useInView from "../hooks/useInView.js";
import useCountUp from "../hooks/useCountUp.js";
import { STATS } from "../data/content.js";

function StatTicker({ stat, inView, index }) {
  const value = useCountUp(stat.value, inView, 1200 + index * 150);
  const formatted = value.toLocaleString("en-IN");

  return (
    <div className="flex-1 px-6 py-6 text-center sm:py-8">
      <div className="font-mono text-3xl font-semibold text-reward-gold sm:text-4xl">
        {formatted}
        <span className="text-neon-cyan">{stat.suffix}</span>
      </div>
      <div className="mt-2 font-display text-xs uppercase tracking-[0.2em] text-ink-muted">
        {stat.label}
      </div>
    </div>
  );
}

export default function StatsBar() {
  const [ref, inView] = useInView(0.4);

  return (
    <section className="relative bg-void-soft px-6" ref={ref}>
      <div
        className="hud-frame mx-auto -mt-10 max-w-5xl rounded-xl border border-panel-line bg-panel/80 backdrop-blur"
        style={{ "--hud-color": "#FCD34D" }}
      >
        <div className="flex flex-col divide-y divide-panel-line sm:flex-row sm:divide-x sm:divide-y-0">
          {STATS.map((stat, i) => (
            <StatTicker key={stat.label} stat={stat} inView={inView} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
