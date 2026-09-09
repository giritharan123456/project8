import { useMemo, useState } from "react";
import {
  Search,
  Pencil,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Download,
  FileSpreadsheet,
  Table,
  CheckSquare,
  Square,
  Columns3,
  Loader,
} from "lucide-react";
import StatusPill from "./StatusPill.jsx";
import { exportToExcel } from "../../lib/reportGenerator.js";

const DEFAULT_PAGE_SIZES = [8, 16, 24, 50, 100];
const VIRTUAL_SCROLL_THRESHOLD = 100;
const VIRTUAL_ROW_HEIGHT = 44;

/**
 * Enhanced DataTable with sorting, row selection, bulk actions, column
 * visibility, export, loading skeleton, empty state, and virtual scrolling
 * for large datasets (>100 rows).
 *
 * columns: [{ key, label, render?(row), sortable?, visible? }]
 * rows: array of objects, each must have a stable `id`.
 */
export default function DataTable({
  title,
  description,
  columns: allColumns,
  rows,
  searchKeys,
  onAdd,
  onEdit,
  onDelete,
  addLabel = "Add New",
  renderRowActions,
  onRowClick,
  loading = false,
  pageSize: initialPageSize = 8,
  bulkActions,
}) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [showColumnToggle, setShowColumnToggle] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState(() =>
    Object.fromEntries(allColumns.map((c) => [c.key, c.visible !== false]))
  );
  const [containerHeight, setContainerHeight] = useState(400);
  const [scrollTop, setScrollTop] = useState(0);

  const visibleColumns = useMemo(
    () => allColumns.filter((c) => columnVisibility[c.key] !== false),
    [allColumns, columnVisibility]
  );

  const filtered = useMemo(() => {
    let result = rows;
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      result = result.filter((row) => (searchKeys ?? Object.keys(row)).some((k) => String(row[k] ?? "").toLowerCase().includes(q)));
    }
    if (sortKey) {
      result = [...result].sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        if (aVal == null && bVal == null) return 0;
        if (aVal == null) return 1;
        if (bVal == null) return -1;
        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortDir === "asc" ? aVal - bVal : bVal - aVal;
        }
        const cmp = String(aVal).localeCompare(String(bVal));
        return sortDir === "asc" ? cmp : -cmp;
      });
    }
    return result;
  }, [rows, query, searchKeys, sortKey, sortDir]);

  const useVirtual = filtered.length > VIRTUAL_SCROLL_THRESHOLD;

  // Virtual scrolling calculations
  const virtualData = useMemo(() => {
    if (!useVirtual) return null;
    const totalHeight = filtered.length * VIRTUAL_ROW_HEIGHT;
    const overscan = 5;
    const startIndex = Math.max(0, Math.floor(scrollTop / VIRTUAL_ROW_HEIGHT) - overscan);
    const visibleCount = Math.ceil(containerHeight / VIRTUAL_ROW_HEIGHT) + overscan * 2;
    const endIndex = Math.min(filtered.length, startIndex + visibleCount);
    const visibleItems = [];
    for (let i = startIndex; i < endIndex; i++) {
      visibleItems.push({ index: i, offset: i * VIRTUAL_ROW_HEIGHT });
    }
    return { totalHeight, visibleItems };
  }, [useVirtual, filtered.length, scrollTop, containerHeight]);

  const totalPages = useVirtual ? 1 : Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = useVirtual ? 1 : Math.min(page, totalPages);
  const pageRows = useVirtual ? filtered : filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const allPageIdsSelected = pageRows.length > 0 && pageRows.every((r) => selectedIds.has(r.id));
  const someSelected = selectedIds.size > 0;

  function handleSearch(e) {
    setQuery(e.target.value);
    setPage(1);
  }

  function handleSort(key) {
    const col = allColumns.find((c) => c.key === key);
    if (col && col.sortable === false) return;
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function toggleSelectAll() {
    if (allPageIdsSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        pageRows.forEach((r) => next.delete(r.id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        pageRows.forEach((r) => next.add(r.id));
        return next;
      });
    }
  }

  function toggleSelect(id) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleColumn(key) {
    setColumnVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function exportCSV() {
    exportToExcel(
      filtered.map((r) => {
        const out = {};
        for (const c of visibleColumns) out[c.label] = r[c.key] ?? "";
        return out;
      }),
      (title || "data").toLowerCase().replace(/\s+/g, "-")
    );
  }

  function exportSelectedCSV() {
    const selected = filtered.filter((r) => selectedIds.has(r.id));
    exportToExcel(
      selected.map((r) => {
        const out = {};
        for (const c of visibleColumns) out[c.label] = r[c.key] ?? "";
        return out;
      }),
      `${(title || "data").toLowerCase().replace(/\s+/g, "-")}-selected`
    );
  }

  function handleVirtualScroll(e) {
    setScrollTop(e.target.scrollTop);
  }

  function SortIcon({ column }) {
    const col = allColumns.find((c) => c.key === column);
    if (col && col.sortable === false) return null;
    if (sortKey !== column) return <ChevronUp className="h-3 w-3 text-ink-faint opacity-40" />;
    return sortDir === "asc" ? <ChevronUp className="h-3 w-3 text-neon-cyan" /> : <ChevronDown className="h-3 w-3 text-neon-cyan" />;
  }

  function SkeletonRows({ count }) {
    return Array.from({ length: count }).map((_, i) => (
      <tr key={`skel-${i}`} className="border-b border-panel-line/60">
        {visibleColumns.map((col) => (
          <td key={col.key} className="px-4 py-4">
            <div className="h-4 w-3/4 skeleton-pulse rounded-lg bg-panel-line" />
          </td>
        ))}
        {(onEdit || onDelete || renderRowActions) && (
          <td className="px-4 py-4"><div className="h-4 w-16 skeleton-pulse rounded-lg bg-panel-line ml-auto" /></td>
        )}
      </tr>
    ));
  }

  function renderRow(row) {
    return (
      <tr
        key={row.id}
        onClick={onRowClick ? () => onRowClick(row) : undefined}
        className={`border-b border-panel-line/60 text-ink-muted transition-colors hover:bg-neon-cyan/5 ${
          onRowClick ? "cursor-pointer" : ""
        } ${selectedIds.has(row.id) ? "bg-arcane-purple/5" : ""}`}
      >
        {(onEdit || onDelete || renderRowActions || bulkActions) && (
          <td className="w-10 px-4 py-3">
            <button type="button" onClick={(e) => { e.stopPropagation(); toggleSelect(row.id); }} className="text-ink-faint hover:text-ink-primary">
              {selectedIds.has(row.id) ? <CheckSquare className="h-4 w-4 text-arcane-purple" /> : <Square className="h-4 w-4" />}
            </button>
          </td>
        )}
        {visibleColumns.map((col) => (
          <td key={col.key} className="whitespace-nowrap px-4 py-3">
            {col.render
              ? col.render(row)
              : col.status
              ? <StatusPill value={row[col.key]} />
              : <span className="text-ink-primary">{row[col.key]}</span>}
          </td>
        ))}
        {(onEdit || onDelete || renderRowActions) && (
          <td className="px-4 py-3">
            <div className="flex justify-end gap-1.5">
              {renderRowActions && renderRowActions(row)}
              {onEdit && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onEdit(row); }}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-faint transition-colors hover:bg-neon-cyan/10 hover:text-neon-cyan"
                  aria-label={`Edit ${row.id}`}
                >
                  <Pencil className="h-4 w-4" strokeWidth={1.8} />
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onDelete(row); }}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-faint transition-colors hover:bg-red-500/10 hover:text-red-400"
                  aria-label={`Delete ${row.id}`}
                >
                  <Trash2 className="h-4 w-4" strokeWidth={1.8} />
                </button>
              )}
            </div>
          </td>
        )}
      </tr>
    );
  }

  const colCount = visibleColumns.length + ((onEdit || onDelete || renderRowActions || bulkActions) ? 2 : 1);

  return (
    <div className="animate-fade-up rounded-card border border-panel-line bg-panel/60 shadow-soft">
      <div className="flex flex-col gap-3 border-b border-panel-line bg-gradient-to-r from-arcane-purple/5 via-transparent to-neon-cyan/5 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-lg font-bold text-ink-primary">{title}</h2>
          {description && <p className="mt-0.5 text-xs text-ink-muted">{description}</p>}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
            <input
              value={query}
              onChange={handleSearch}
              placeholder="Search..."
              className="w-full rounded-control border border-panel-line bg-void py-2 pl-9 pr-3 text-sm text-ink-primary shadow-inner outline-none focus:border-neon-cyan sm:w-56"
            />
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowColumnToggle((v) => !v)}
              className="tap-feedback flex h-10 w-10 items-center justify-center rounded-control border border-panel-line bg-panel/40 text-ink-muted transition-colors hover:text-ink-primary"
              title="Toggle columns"
            >
              <Columns3 className="h-4 w-4" />
            </button>
            {showColumnToggle && (
              <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-xl border border-panel-line bg-panel p-2 shadow-xl">
                {allColumns.map((col) => (
                  <label key={col.key} className="tap-feedback flex items-center gap-2 rounded-lg px-2 py-2 hover:bg-panel-alt/60">
                    <input
                      type="checkbox"
                      checked={columnVisibility[col.key] !== false}
                      onChange={() => toggleColumn(col.key)}
                      className="h-4 w-4 rounded border-panel-line accent-arcane-purple"
                    />
                    <span className="text-xs text-ink-primary">{col.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={exportCSV}
            className="tap-feedback flex h-10 items-center gap-1.5 rounded-control border border-panel-line bg-panel/40 px-3 font-display text-xs font-semibold text-ink-muted transition-colors hover:text-neon-green"
            title="Export Excel"
          >
            <FileSpreadsheet className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Excel</span>
          </button>

          {onAdd && (
            <button
              type="button"
              onClick={onAdd}
              className="tap-bounce flex flex-none items-center gap-1.5 rounded-xl bg-gradient-to-r from-arcane-purple to-arcane-violet px-4 py-2.5 font-display text-sm font-semibold text-white shadow-glow-purple transition-all hover:brightness-110"
            >
              <Plus className="h-4 w-4" strokeWidth={2.2} />
              <span className="hidden sm:inline">{addLabel}</span>
            </button>
          )}
        </div>
      </div>

      {someSelected && (
        <div className="flex items-center gap-3 border-b border-panel-line bg-arcane-purple/5 px-4 py-2">
          <span className="font-mono text-xs text-arcane-purple">{selectedIds.size} selected</span>
          <button
            type="button"
            onClick={exportSelectedCSV}
            className="flex items-center gap-1 rounded-lg border border-panel-line px-2.5 py-1 font-display text-xs font-semibold text-ink-muted transition-colors hover:text-neon-green"
          >
            <FileSpreadsheet className="h-3 w-3" />
            Export Selected
          </button>
          {bulkActions?.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={() => action.onClick(Array.from(selectedIds))}
              className="flex items-center gap-1 rounded-lg border border-panel-line px-2.5 py-1 font-display text-xs font-semibold text-ink-muted transition-colors hover:text-ink-primary"
            >
              {action.icon && <action.icon className="h-3 w-3" />}
              {action.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setSelectedIds(new Set())}
            className="ml-auto flex items-center gap-1 rounded-lg px-2 py-1 font-display text-xs text-ink-faint hover:text-ink-primary"
          >
            Clear
          </button>
        </div>
      )}

      {useVirtual ? (
        /* Virtual scrolling mode for large datasets */
        <div
          className="overflow-auto"
          style={{ height: containerHeight }}
          onScroll={handleVirtualScroll}
        >
          <div style={{ height: virtualData.totalHeight, position: "relative" }}>
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 z-10 bg-panel/95 backdrop-blur-sm">
                <tr className="border-b border-panel-line text-[11px] uppercase tracking-widest text-ink-faint">
                  {(onEdit || onDelete || renderRowActions || bulkActions) && (
                    <th className="w-10 px-4 py-3">
                      <button type="button" onClick={toggleSelectAll} className="text-ink-faint hover:text-ink-primary">
                        {allPageIdsSelected ? <CheckSquare className="h-4 w-4 text-arcane-purple" /> : <Square className="h-4 w-4" />}
                      </button>
                    </th>
                  )}
                  {visibleColumns.map((col) => (
                    <th
                      key={col.key}
                      className={`whitespace-nowrap px-4 py-3 font-mono font-medium ${col.sortable !== false ? "cursor-pointer select-none hover:text-ink-primary" : ""}`}
                      onClick={() => handleSort(col.key)}
                    >
                      <span className="flex items-center gap-1">
                        {col.label}
                        <SortIcon column={col.key} />
                      </span>
                    </th>
                  ))}
                  {(onEdit || onDelete || renderRowActions) && <th className="px-4 py-3 text-right font-mono font-medium">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <SkeletonRows count={20} />
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={colCount} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-panel-line bg-void">
                          <Search className="h-5 w-5 text-ink-faint" />
                        </div>
                        <p className="text-sm text-ink-faint">
                          {query ? "No results found for your search." : "No data available yet."}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  virtualData.visibleItems.map(({ index, offset }) => (
                    <div key={filtered[index].id} style={{ transform: `translateY(${offset}px)`, position: "absolute", width: "100%" }}>
                      {renderRow(filtered[index])}
                    </div>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Standard paginated mode */
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-panel-line text-[11px] uppercase tracking-widest text-ink-faint">
                {(onEdit || onDelete || renderRowActions || bulkActions) && (
                  <th className="w-10 px-4 py-3">
                    <button type="button" onClick={toggleSelectAll} className="text-ink-faint hover:text-ink-primary">
                      {allPageIdsSelected ? <CheckSquare className="h-4 w-4 text-arcane-purple" /> : <Square className="h-4 w-4" />}
                    </button>
                  </th>
                )}
                {visibleColumns.map((col) => (
                  <th
                    key={col.key}
                    className={`whitespace-nowrap px-4 py-3 font-mono font-medium ${col.sortable !== false ? "cursor-pointer select-none hover:text-ink-primary" : ""}`}
                    onClick={() => handleSort(col.key)}
                  >
                    <span className="flex items-center gap-1">
                      {col.label}
                      <SortIcon column={col.key} />
                    </span>
                  </th>
                ))}
                {(onEdit || onDelete || renderRowActions) && <th className="px-4 py-3 text-right font-mono font-medium">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonRows count={pageSize} />
              ) : pageRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={visibleColumns.length + ((onEdit || onDelete || renderRowActions || bulkActions) ? 2 : 1)}
                    className="px-4 py-16 text-center"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-panel-line bg-void">
                        <Search className="h-5 w-5 text-ink-faint" />
                      </div>
                      <p className="text-sm text-ink-faint">
                        {query ? "No results found for your search." : "No data available yet."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                pageRows.map((row) => renderRow(row))
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-3">
          <p className="font-mono text-[11px] text-ink-faint">
            {filtered.length === 0 ? "No results" : useVirtual
              ? `Showing ${filtered.length} rows (virtual scroll)`
              : `Showing ${(safePage - 1) * pageSize + 1}\u2013${(safePage - 1) * pageSize + pageRows.length} of ${filtered.length}`}
          </p>
          {!useVirtual && (
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
              className="rounded-control border border-panel-line bg-void px-2 py-2 font-mono text-[11px] text-ink-muted outline-none"
            >
              {DEFAULT_PAGE_SIZES.map((s) => (
                <option key={s} value={s}>{s} / page</option>
              ))}
            </select>
          )}
        </div>
        {!useVirtual && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="tap-feedback flex h-9 w-9 items-center justify-center rounded-control border border-panel-line text-ink-muted transition-colors hover:text-ink-primary disabled:opacity-30"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="font-mono text-xs text-ink-muted">
              {safePage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="tap-feedback flex h-9 w-9 items-center justify-center rounded-control border border-panel-line text-ink-muted transition-colors hover:text-ink-primary disabled:opacity-30"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
