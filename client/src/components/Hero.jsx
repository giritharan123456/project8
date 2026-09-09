import { Link } from "react-router-dom";
import { Swords, Zap } from "lucide-react";
import ParticleField from "./ParticleField.jsx";
import HeroIllustration from "./HeroIllustration.jsx";
import { getLandingSubject } from "../lib/landingSubject.js";

export default function Hero() {
  const { name } = getLandingSubject();

  return (
    <section
      id="top"
      className="relative flex min-h-screen items-center overflow-clip bg-void pt-24"
    >
      {/* ambient layers */}
      <div className="absolute inset-0 bg-radial-fade" />
      <ParticleField density={42} />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, transparent 70%, rgb(var(--color-void)) 100%)",
        }}
      />
      {/* faint brand halo behind the copy */}
      <div className="pointer-events-none absolute left-0 top-1/4 h-96 w-96 rounded-full bg-arcane-purple/20 blur-3xl" />

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        {/* ---- Left: copy ---- */}
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-panel-line bg-panel/60 px-3 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-neon-cyan">
            <Zap className="h-3.5 w-3.5" />
            The {name} Adventure RPG
          </div>

          <h1 className="font-wordmark text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            <span className="text-gradient-hero">LEARN</span>
            <span className="text-neon-green">QUEST</span>
          </h1>

          <p className="mt-5 font-display text-2xl font-semibold text-ink-primary sm:text-3xl">
            Battle. Learn. <span className="text-reward-gold">Master {name}.</span>
          </p>

          <p className="mt-5 max-w-lg font-body text-base leading-relaxed text-ink-muted sm:text-lg">
            Turn {name.toLowerCase()} into an exciting adventure. Explore worlds,
            solve subject puzzles, defeat enemies, earn rewards, and become a{" "}
            {name} Master — one mission at a time.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Link
              to="/login"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-arcane-purple px-7 py-3.5 font-display text-base font-bold uppercase tracking-wider text-white shadow-glow-purple transition-transform hover:scale-[1.03]"
            >
              <Swords className="h-5 w-5 transition-transform group-hover:-rotate-12" />
              Start Adventure
            </Link>
            <a
              href="#worlds"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-panel-line bg-panel/50 px-7 py-3.5 font-display text-base font-bold uppercase tracking-wider text-ink-primary backdrop-blur transition-colors hover:border-neon-cyan hover:text-neon-cyan"
            >
              Explore Worlds
            </a>
          </div>
        </div>

        {/* ---- Right: knight vs. monster scene ---- */}
        <div className="relative mx-auto w-full max-w-sm">
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-72 w-72 rounded-full bg-arcane-purple/20 blur-3xl" />
          </div>

          <HeroIllustration />

          {/* HP/XP HUD strip under the scene */}
          <div className="hud-frame relative -mt-6 space-y-2.5 rounded-xl border border-panel-line bg-panel/80 p-4 font-mono text-[11px] backdrop-blur">
            <div>
              <div className="mb-1 flex justify-between text-ink-faint">
                <span>HP</span>
                <span>85 / 100</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-void">
                <div className="h-full w-[85%] rounded-full bg-neon-green" />
              </div>
            </div>
            <div>
              <div className="mb-1 flex justify-between text-ink-faint">
                <span>XP</span>
                <span>850 / 1200</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-void">
                <div className="h-full w-[70%] rounded-full bg-reward-gold" />
              </div>
            </div>
          </div>

          {/* floating badge chips */}
          <div className="absolute -left-6 top-8 hidden rounded-lg border border-panel-line bg-panel/90 px-3 py-2 font-mono text-xs shadow-glow-purple sm:block">
            <span className="text-reward-gold">✦ 850</span>
          </div>
          <div className="absolute -right-4 top-24 hidden rounded-lg border border-panel-line bg-panel/90 px-3 py-2 font-mono text-xs shadow-glow-green sm:block">
            <span className="text-neon-green">⭐ 125</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}