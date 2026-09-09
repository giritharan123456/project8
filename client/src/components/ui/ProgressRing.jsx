// Circular progress ring drawn with an SVG <circle>. Used for mastery
// rings, achievement progress, and any HUD element that wants a
// "percentage complete" read as a ring rather than a bar.
//
// value 0-100 drives how much of the ring is filled (stroke-dashoffset).
// color defaults to the app's arcane-purple; pass any valid CSS color to
// match a specific subject/world accent.
export default function ProgressRing({
  value = 0,
  size = 56,
  strokeWidth = 5,
  color = "#806BFF",
  label,
}) {
  const clamped = Math.max(0, Math.min(100, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgb(var(--color-panel-line))"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display font-bold" style={{ color, fontSize: size * 0.24 }}>
          {Math.round(clamped)}%
        </span>
      </div>
      {label && (
        <span className="sr-only">
          {label} {Math.round(clamped)}%
        </span>
      )}
    </div>
  );
}
