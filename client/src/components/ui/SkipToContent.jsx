export default function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 z-50 bg-arcane-purple text-white px-4 py-2 rounded-lg font-display text-sm font-semibold shadow-glow-purple transition-opacity"
    >
      Skip to content
    </a>
  );
}
