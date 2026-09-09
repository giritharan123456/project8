const LEVELS = {
  "not-started": { label: "Not Started", color: "text-ink-faint", bg: "bg-panel-line/30", border: "border-panel-line" },
  learning: { label: "Learning", color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/40" },
  practicing: { label: "Practicing", color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/40" },
  strong: { label: "Strong", color: "text-neon-green", bg: "bg-neon-green/10", border: "border-neon-green/40" },
  mastered: { label: "Mastered", color: "text-reward-gold", bg: "bg-reward-gold/10", border: "border-reward-gold/40" },
};

export default function MasteryBadge({ level = "not-started", progress, compact = false }) {
  const config = LEVELS[level] ?? LEVELS["not-started"];
  const showProgress = typeof progress === "number";

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest ${config.color} ${config.bg} ${config.border}`}
      >
        {config.label}
        {showProgress && <span className="opacity-70">{Math.round(progress)}%</span>}
      </span>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 ${config.bg} ${config.border}`}>
      <span className={`font-mono text-[11px] font-bold uppercase tracking-widest ${config.color}`}>
        {config.label}
      </span>
      {showProgress && (
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-panel-line">
            <div
              className={`h-full rounded-full transition-all duration-500 ${config.color.replace("text-", "bg-")}`}
              style={{ width: `${Math.min(100, Math.round(progress))}%` }}
            />
          </div>
          <span className={`font-mono text-[10px] ${config.color}`}>{Math.round(progress)}%</span>
        </div>
      )}
    </div>
  );
}
