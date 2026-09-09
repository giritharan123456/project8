import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import {
  Search,
  Download,
  RefreshCw,
  Filter,
  Clock,
  User,
  FileText,
  Globe2,
  ChevronDown,
} from "lucide-react";
import StatusPill from "../components/StatusPill.jsx";
import { exportToExcel } from "../../lib/reportGenerator.js";

const ACTION_TYPES = ["all", "create", "update", "delete", "login", "export", "approve"];
const RESOURCE_TYPES = ["all", "student", "teacher", "course", "quiz", "assignment", "settings", "user"];

const MOCK_AUDIT_LOGS = [
  { id: "LOG-001", timestamp: "2026-09-08T14:32:00Z", user: "Ananya Rao", action: "update", resource: "quiz", details: "Updated quiz 'Atom Valley Easy Warm-up' difficulty from easy to medium", ip: "192.168.1.45" },
  { id: "LOG-002", timestamp: "2026-09-08T13:15:00Z", user: "Vikram Nair", action: "create", resource: "course", details: "Created new course 'Reaction Volcano' under Chemistry subject", ip: "192.168.1.22" },
  { id: "LOG-003", timestamp: "2026-09-08T12:45:00Z", user: "Ananya Rao", action: "approve", resource: "quiz", details: "Approved AI-generated quiz 'Bonding Basics Review' for grade 10", ip: "192.168.1.45" },
  { id: "LOG-004", timestamp: "2026-09-08T11:30:00Z", user: "Sara Thomas", action: "login", resource: "user", details: "Admin user logged in from new device", ip: "10.0.0.88" },
  { id: "LOG-005", timestamp: "2026-09-08T10:00:00Z", user: "Ananya Rao", action: "delete", resource: "assignment", details: "Deleted draft assignment 'Old Worksheet' for grade 11", ip: "192.168.1.45" },
  { id: "LOG-006", timestamp: "2026-09-07T16:20:00Z", user: "Vikram Nair", action: "export", resource: "student", details: "Exported student roster for CBSE grade 10 (32 records)", ip: "192.168.1.22" },
  { id: "LOG-007", timestamp: "2026-09-07T15:10:00Z", user: "Ananya Rao", action: "update", resource: "settings", details: "Updated AI model configuration: changed default difficulty to medium", ip: "192.168.1.45" },
  { id: "LOG-008", timestamp: "2026-09-07T14:00:00Z", user: "Sara Thomas", action: "create", resource: "teacher", details: "Added new teacher account: Meera Chandran (meera.c@learnquest.edu)", ip: "10.0.0.88" },
  { id: "LOG-009", timestamp: "2026-09-07T11:45:00Z", user: "Ananya Rao", action: "approve", resource: "course", details: "Approved curriculum update: 'Acid Base Island' course content review", ip: "192.168.1.45" },
  { id: "LOG-010", timestamp: "2026-09-06T17:30:00Z", user: "Vikram Nair", action: "update", resource: "student", details: "Suspended student account STU-1006 (Ananya Pillai) for policy violation", ip: "192.168.1.22" },
  { id: "LOG-011", timestamp: "2026-09-06T14:15:00Z", user: "Ananya Rao", action: "create", resource: "quiz", details: "Created new quiz 'Reaction Volcano Speed Round' with 10 questions", ip: "192.168.1.45" },
  { id: "LOG-012", timestamp: "2026-09-06T09:00:00Z", user: "Sara Thomas", action: "login", resource: "user", details: "Admin user logged in successfully", ip: "10.0.0.88" },
];

function formatTimestamp(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + " " + d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

function ActionBadge({ action }) {
  const colors = {
    create: "bg-neon-green/15 text-neon-green border-neon-green/30",
    update: "bg-neon-cyan/15 text-neon-cyan border-neon-cyan/30",
    delete: "bg-red-500/15 text-red-400 border-red-500/30",
    login: "bg-arcane-purple/15 text-arcane-purple border-arcane-purple/30",
    export: "bg-reward-gold/15 text-reward-gold border-reward-gold/30",
    approve: "bg-neon-green/15 text-neon-green border-neon-green/30",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase ${colors[action] || "border-panel-line bg-panel-line/15 text-ink-muted"}`}>
      {action}
    </span>
  );
}

export default function AuditLogsPage() {
  const [actionFilter, setActionFilter] = useState("all");
  const [resourceFilter, setResourceFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("2026-09-01");
  const [dateTo, setDateTo] = useState("2026-09-08");
  const [search, setSearch] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;
  const timerRef = useRef(null);

  const filteredLogs = useMemo(() => {
    return MOCK_AUDIT_LOGS.filter((log) => {
      if (actionFilter !== "all" && log.action !== actionFilter) return false;
      if (resourceFilter !== "all" && log.resource !== resourceFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!log.details.toLowerCase().includes(q) && !log.user.toLowerCase().includes(q) && !log.resource.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [actionFilter, resourceFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / PAGE_SIZE));
  const pageLogs = filteredLogs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [actionFilter, resourceFilter, search]);

  useEffect(() => {
    if (autoRefresh) {
      timerRef.current = setInterval(() => {}, 30000);
    }
    return () => clearInterval(timerRef.current);
  }, [autoRefresh]);

  function exportCSV() {
    exportToExcel(
      filteredLogs.map((l) => ({
        Timestamp: l.timestamp,
        User: l.user,
        Action: l.action,
        Resource: l.resource,
        Details: l.details,
        IP: l.ip,
      })),
      "audit-logs",
      [
        { key: "Timestamp", header: "Timestamp" },
        { key: "User", header: "User" },
        { key: "Action", header: "Action" },
        { key: "Resource", header: "Resource" },
        { key: "Details", header: "Details" },
        { key: "IP", header: "IP" },
      ]
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-ink-primary">Audit Logs</h2>
        <p className="mt-1 text-sm text-ink-muted">Track all actions performed across the platform.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search details..."
            className="w-full rounded-lg border border-panel-line bg-void py-2 pl-9 pr-3 text-sm text-ink-primary outline-none focus:border-neon-cyan"
          />
        </div>

        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="rounded-lg border border-panel-line bg-void px-3 py-2 text-sm text-ink-primary outline-none focus:border-neon-cyan"
        >
          {ACTION_TYPES.map((t) => (
            <option key={t} value={t}>{t === "all" ? "All Actions" : t.charAt(0).toUpperCase() + t.slice(1)}</option>
          ))}
        </select>

        <select
          value={resourceFilter}
          onChange={(e) => setResourceFilter(e.target.value)}
          className="rounded-lg border border-panel-line bg-void px-3 py-2 text-sm text-ink-primary outline-none focus:border-neon-cyan"
        >
          {RESOURCE_TYPES.map((t) => (
            <option key={t} value={t}>{t === "all" ? "All Resources" : t.charAt(0).toUpperCase() + t.slice(1)}</option>
          ))}
        </select>

        <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="rounded-lg border border-panel-line bg-void px-3 py-2 text-sm text-ink-primary outline-none focus:border-neon-cyan" />
        <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="rounded-lg border border-panel-line bg-void px-3 py-2 text-sm text-ink-primary outline-none focus:border-neon-cyan" />

        <button
          type="button"
          onClick={exportCSV}
          className="flex items-center gap-1.5 rounded-lg border border-panel-line px-3 py-2 font-display text-xs font-semibold text-ink-muted transition-colors hover:text-neon-green"
        >
          <Download className="h-3.5 w-3.5" />
          Export
        </button>

        <button
          type="button"
          onClick={() => setAutoRefresh((v) => !v)}
          className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 font-display text-xs font-semibold transition-colors ${
            autoRefresh ? "border-neon-green/40 bg-neon-green/10 text-neon-green" : "border-panel-line text-ink-muted hover:text-ink-primary"
          }`}
        >
          <RefreshCw className={`h-3.5 w-3.5 ${autoRefresh ? "animate-spin" : ""}`} />
          Auto-refresh
        </button>
      </div>

      <div className="rounded-2xl border border-panel-line bg-panel/60">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-panel-line text-[11px] uppercase tracking-widest text-ink-faint">
                <th className="whitespace-nowrap px-4 py-3 font-mono font-medium">Timestamp</th>
                <th className="whitespace-nowrap px-4 py-3 font-mono font-medium">User</th>
                <th className="whitespace-nowrap px-4 py-3 font-mono font-medium">Action</th>
                <th className="whitespace-nowrap px-4 py-3 font-mono font-medium">Resource</th>
                <th className="whitespace-nowrap px-4 py-3 font-mono font-medium">Details</th>
                <th className="whitespace-nowrap px-4 py-3 font-mono font-medium">IP</th>
              </tr>
            </thead>
            <tbody>
              {pageLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-ink-faint">No logs found matching your filters.</td>
                </tr>
              )}
              {pageLogs.map((log) => (
                <tr key={log.id} className="border-b border-panel-line/60 text-ink-muted transition-colors hover:bg-panel-alt/40">
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-ink-faint" />
                      <span className="font-mono text-xs">{formatTimestamp(log.timestamp)}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-ink-faint" />
                      <span className="text-xs text-ink-primary">{log.user}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <ActionBadge action={log.action} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className="text-xs text-ink-primary capitalize">{log.resource}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-ink-muted line-clamp-1">{log.details}</span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Globe2 className="h-3.5 w-3.5 text-ink-faint" />
                      <span className="font-mono text-xs text-ink-faint">{log.ip}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-3">
          <p className="font-mono text-[11px] text-ink-faint">
            Showing {pageLogs.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}\u2013{(page - 1) * PAGE_SIZE + pageLogs.length} of {filteredLogs.length}
          </p>
          <div className="flex items-center gap-1.5">
            <button type="button" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="flex h-8 w-8 items-center justify-center rounded-lg border border-panel-line text-ink-muted transition-colors hover:text-ink-primary disabled:opacity-30">
              <ChevronDown className="h-4 w-4 rotate-90" />
            </button>
            <span className="font-mono text-xs text-ink-muted">{page} / {totalPages}</span>
            <button type="button" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="flex h-8 w-8 items-center justify-center rounded-lg border border-panel-line text-ink-muted transition-colors hover:text-ink-primary disabled:opacity-30">
              <ChevronDown className="h-4 w-4 -rotate-90" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
