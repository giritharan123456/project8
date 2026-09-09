const TONES = {
  active: { cls: "bg-neon-green/15 text-neon-green border-neon-green/30", dot: "bg-neon-green" },
  published: { cls: "bg-neon-green/15 text-neon-green border-neon-green/30", dot: "bg-neon-green" },
  inactive: { cls: "bg-ink-faint/15 text-ink-muted border-panel-line", dot: "bg-ink-faint" },
  draft: { cls: "bg-reward-gold/15 text-reward-gold border-reward-gold/30", dot: "bg-reward-gold" },
  suspended: { cls: "bg-red-500/15 text-red-400 border-red-500/30", dot: "bg-red-400" },
  submitted: { cls: "bg-neon-cyan/15 text-neon-cyan border-neon-cyan/30", dot: "bg-neon-cyan" },
  graded: { cls: "bg-neon-green/15 text-neon-green border-neon-green/30", dot: "bg-neon-green" },
  missing: { cls: "bg-red-500/15 text-red-400 border-red-500/30", dot: "bg-red-400" },
  late: { cls: "bg-reward-gold/15 text-reward-gold border-reward-gold/30", dot: "bg-reward-gold" },
  closed: { cls: "bg-ink-faint/15 text-ink-muted border-panel-line", dot: "bg-ink-faint" },
  default: { cls: "bg-arcane-purple/15 text-arcane-purple border-arcane-purple/30", dot: "bg-arcane-purple" },
};

export default function StatusPill({ value }) {
  const tone = TONES[value] ?? TONES.default;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${tone.cls}`}
    >
      <span className={`h-1.5 w-1.5 flex-none rounded-full ${tone.dot}`} />
      {value}
    </span>
  );
}
