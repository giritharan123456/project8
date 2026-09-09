// Skeleton loading placeholder with shimmer. `type` chooses the layout:
//   'card'  — three stacked card-shaped blocks
//   'list'  — rows of avatar + text lines (like a feed/leaderboard)
//   'table' — a table-like block with a header row
const TYPES = {
  card: { defaultLines: 3, class: "h-40" },
  list: { defaultLines: 5, class: "h-14" },
  table: { defaultLines: 5, class: "h-12" },
};

function SkeletonCard({ className }) {
  return (
    <div className={`shimmer rounded-card border border-panel-line bg-panel/50 p-4 ${className}`}>
      <div className="h-3 w-1/3 rounded-lg bg-panel-line/60" />
      <div className="mt-3 h-3 w-2/3 rounded-lg bg-panel-line/60" />
      <div className="mt-2 h-3 w-1/2 rounded-lg bg-panel-line/60" />
    </div>
  );
}

function SkeletonListRow() {
  return (
    <div className="flex shimmer items-center gap-3 rounded-card border border-panel-line/60 bg-panel/40 p-3">
      <div className="h-9 w-9 flex-none rounded-full bg-panel-line/60" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-1/3 rounded-lg bg-panel-line/60" />
        <div className="h-3 w-2/3 rounded-lg bg-panel-line/60" />
      </div>
    </div>
  );
}

function SkeletonTableRow() {
  return (
    <div className="flex shimmer items-center gap-4 border-b border-panel-line/40 px-4 py-3">
      <div className="h-3 w-8 rounded-lg bg-panel-line/60" />
      <div className="h-3 w-1/4 rounded-lg bg-panel-line/60" />
      <div className="h-3 w-1/5 rounded-lg bg-panel-line/60" />
    </div>
  );
}

export default function LoadingState({ lines, type = "card" }) {
  const cfg = TYPES[type] ?? TYPES.card;
  const count = lines ?? cfg.defaultLines;

  return (
    <div className="space-y-3" role="status" aria-label="Loading">
      {Array.from({ length: count }).map((_, i) => {
        if (type === "list") return <SkeletonListRow key={i} />;
        if (type === "table") return <SkeletonTableRow key={i} />;
        return <SkeletonCard key={i} className={cfg.class} />;
      })}
      <span className="sr-only">Loading...</span>
    </div>
  );
}