import * as Icons from "lucide-react";
import useInView from "../hooks/useInView.js";
import { HOW_IT_WORKS } from "../data/content.js";

const NODE_COLORS = ["#806BFF", "#38D9F4", "#4ADE80", "#FCD34D"];

function StepNode({ step, index }) {
  const [ref, inView] = useInView(0.35);
  const Icon = Icons[step.icon] ?? Icons.Circle;
  const color = NODE_COLORS[index % NODE_COLORS.length];
  const isLast = index === HOW_IT_WORKS.length - 1;

  return (
    <div ref={ref} className="relative flex gap-5 pb-12 last:pb-0 sm:gap-7">
      {/* connector column */}
      <div className="relative flex w-12 flex-none flex-col items-center sm:w-14">
        <div
          className={`z-10 flex h-12 w-12 flex-none items-center justify-center rounded-xl border-2 bg-panel transition-all duration-500 sm:h-14 sm:w-14 ${
            inView ? "scale-100 opacity-100" : "scale-75 opacity-0"
          }`}
          style={{
            borderColor: color,
            boxShadow: inView ? `0 0 20px ${color}66` : "none",
            transform: "rotate(45deg)",
          }}
        >
          <Icon
            className="h-5 w-5 sm:h-6 sm:w-6"
            style={{ color, transform: "rotate(-45deg)" }}
            strokeWidth={1.8}
          />
        </div>
        {!isLast && (
          <div
            className="mt-1 w-px flex-1"
            style={{
              backgroundImage: `repeating-linear-gradient(to bottom, ${color}99 0, ${color}99 6px, transparent 6px, transparent 12px)`,
            }}
          />
        )}
      </div>

      {/* copy */}
      <div
        className={`flex-1 pt-1 transition-all duration-500 ${
          inView ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
      >
        <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">
          Step {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="mt-1 font-display text-2xl font-semibold text-ink-primary">
          {step.title}
        </h3>
        <p className="mt-1.5 max-w-md font-body text-sm leading-relaxed text-ink-muted">
          {step.description}
        </p>
      </div>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative bg-void-soft px-6 py-28 lg:px-8"
    >
      <div className="mx-auto max-w-3xl">
        <div className="mb-16 text-center">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-neon-green">
            The Quest Trail
          </span>
          <h2 className="mt-3 font-display text-4xl font-bold text-ink-primary sm:text-5xl">
            How It Works
          </h2>
          <p className="mt-4 font-body text-ink-muted">
            Seven steps from sign-in to Chemistry Master â€” the same path
            you'll walk on the world map inside the game.
          </p>
        </div>

        <div>
          {HOW_IT_WORKS.map((step, i) => (
            <StepNode key={step.title} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
