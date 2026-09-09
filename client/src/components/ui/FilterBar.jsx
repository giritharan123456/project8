import { useRef } from "react";
import { X } from "lucide-react";

export default function FilterBar({
  groups = [],
  selected = [],
  onChange,
  multi = false,
  className = "",
}) {
  const scrollRef = useRef(null);

  function toggle(id) {
    if (multi) {
      const next = selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id];
      onChange?.(next);
    } else {
      onChange?.(selected.includes(id) ? [] : [id]);
    }
  }

  function clearAll() {
    onChange?.([]);
  }

  const flatFilters = groups.flatMap((g) => g.filters ?? []);
  const hasSelection = selected.length > 0;

  return (
    <div className={className}>
      {hasSelection && (
        <div className="mb-2 flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
            {selected.length} active
          </span>
          <button
            type="button"
            onClick={clearAll}
            className="flex items-center gap-1 rounded-full border border-panel-line px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-ink-muted hover:border-red-400/60 hover:text-red-400"
          >
            <X className="h-2.5 w-2.5" /> Clear
          </button>
        </div>
      )}

      <div
        ref={scrollRef}
        className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-none"
      >
        {groups.map((group) => (
          <div key={group.label} className="flex shrink-0 items-center gap-2">
            {group.label && (
              <span className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-ink-faint">
                {group.label}
              </span>
            )}
            {group.filters?.map((f) => {
              const active = selected.includes(f.id);
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => toggle(f.id)}
                  className={`shrink-0 rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest transition-colors ${
                    active
                      ? "border-arcane-purple bg-arcane-purple text-void"
                      : "border-panel-line text-ink-muted hover:text-ink-primary"
                  }`}
                >
                  {f.icon && <f.icon className="mr-1 inline h-3 w-3" />}
                  {f.label}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
