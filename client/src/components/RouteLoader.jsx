// Suspense fallback shown for the brief moment a lazy-loaded route chunk
// is fetched (Section 43: lazy loading + skeleton screens). Kept as a
// game HUD-style pulse rather than a bare spinner so it never reads as a
// "normal website loading" moment.
export default function RouteLoader() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-void">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-14 w-14">
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-panel-line border-t-neon-cyan" />
          <div
            className="absolute inset-2 animate-spin rounded-full border-2 border-transparent border-t-arcane-purple"
            style={{ animationDirection: "reverse", animationDuration: "0.9s" }}
          />
        </div>
        <span className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-ink-faint">
          Loading world&hellip;
        </span>
      </div>
    </div>
  );
}
