import { Link } from "react-router-dom";
import { Swords } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-void px-6 py-24 lg:px-8">
      <div className="absolute inset-0 bg-radial-fade opacity-70" />
      <div className="relative mx-auto max-w-3xl text-center">
        <h2 className="font-display text-4xl font-bold text-ink-primary sm:text-5xl">
          Your first world is{" "}
          <span className="text-neon-green">waiting.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-lg font-body text-ink-muted">
          Pick your class and board, and step into a learning adventure
          built around exactly what you're studying.
        </p>
        <Link
          to="/login"
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-arcane-purple px-8 py-4 font-display text-base font-bold uppercase tracking-wider text-white shadow-glow-purple transition-transform hover:scale-[1.03]"
        >
          <Swords className="h-5 w-5" />
          Start Adventure
        </Link>
      </div>
    </section>
  );
}
