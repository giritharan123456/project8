export default function StatCard({ icon: Icon, label, value, sublabel, accent = "purple" }) {
  const accents = {
    purple: "border-arcane-purple/40 text-arcane-purple bg-arcane-purple/10",
    cyan: "border-neon-cyan/40 text-neon-cyan bg-neon-cyan/10",
    green: "border-neon-green/40 text-neon-green bg-neon-green/10",
    gold: "border-reward-gold/40 text-reward-gold bg-reward-gold/10",
  };
  return (
    <div className="hud-frame animate-fade-up rounded-card border border-panel-line bg-panel/60 p-4 shadow-soft transition-shadow hover:shadow-elevated" style={{ "--hud-color": "rgb(255 107 107)" }}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[11px] uppercase tracking-widest text-ink-faint">{label}</p>
          <p className="mt-1.5 font-display text-2xl font-bold text-ink-primary">{value}</p>
          {sublabel && <p className="mt-1 truncate text-xs text-ink-muted">{sublabel}</p>}
        </div>
        {Icon && (
          <span className={`flex h-10 w-10 flex-none items-center justify-center rounded-xl border ${accents[accent]}`}>
            <Icon className="h-5 w-5" strokeWidth={1.8} />
          </span>
        )}
      </div>
    </div>
  );
}
