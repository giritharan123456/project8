import { useState, useEffect, useRef } from "react";
import { Bell, Check } from "lucide-react";

// Notification bell with an unread-count badge and a dropdown of recent
// notifications. Reads from localStorage key "learnquest:notifications:v1",
// an array of { id, title, body, time, read }. Clicking the dropdown marks
// notifications read and removes the count badge.
const STORAGE_KEY = "learnquest:notifications:v1";

function loadNotifications() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveNotifications(list) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // storage unavailable — dropdown still works for this session
  }
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(loadNotifications);
  const ref = useRef(null);

  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function handleToggle() {
    if (!open) {
      setOpen(true);
    } else {
      setOpen(false);
      markAllRead();
    }
  }

  function markAllRead() {
    const next = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(next);
    saveNotifications(next);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={handleToggle}
        aria-label={`Notifications${unread ? ` (${unread} unread)` : ""}`}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-panel-line bg-panel/60 text-ink-muted transition-colors hover:border-neon-cyan/40 hover:text-ink-primary"
      >
        <Bell className="h-[18px] w-[18px]" strokeWidth={1.8} />
        {unread > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-neon-cyan px-1 font-mono text-[9px] font-bold text-void">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 w-72 overflow-hidden rounded-xl border border-panel-line bg-panel shadow-xl shadow-black/30">
          <div className="flex items-center justify-between border-b border-panel-line px-4 py-3">
            <span className="font-display text-xs font-bold uppercase tracking-widest text-ink-primary">
              Notifications
            </span>
            {unread > 0 && (
              <button type="button" onClick={markAllRead} className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-neon-cyan hover:underline">
                <Check className="h-3 w-3" /> Mark read
              </button>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-6 text-center font-body text-xs text-ink-faint">
                No notifications yet
              </p>
            ) : (
              notifications.slice(0, 6).map((n) => (
                <div
                  key={n.id}
                  className={`border-b border-panel-line/60 px-4 py-3 last:border-0 ${
                    n.read ? "opacity-60" : ""
                  }`}
                >
                  <p className="font-display text-xs font-semibold text-ink-primary">{n.title}</p>
                  <p className="mt-0.5 line-clamp-2 font-body text-[11px] text-ink-muted">{n.body}</p>
                  <p className="mt-1 font-mono text-[9px] uppercase tracking-widest text-ink-faint">{n.time}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
