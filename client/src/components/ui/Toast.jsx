import { createContext, useContext, useCallback, useMemo, useRef, useState } from "react";
import { CheckCircle2, AlertTriangle, Info, XCircle } from "lucide-react";

const ToastContext = createContext(null);

const VARIANT_STYLES = {
  success: {
    icon: CheckCircle2,
    iconClass: "text-neon-green",
    border: "border-neon-green/40",
  },
  error: {
    icon: XCircle,
    iconClass: "text-red-400",
    border: "border-red-500/40",
  },
  warning: {
    icon: AlertTriangle,
    iconClass: "text-reward-gold",
    border: "border-reward-gold/40",
  },
  info: {
    icon: Info,
    iconClass: "text-neon-cyan",
    border: "border-neon-cyan/40",
  },
};

const DEFAULT_DURATION = 4000;

// Bottom-right toast stack. `useToast` returns { toast } where
// toast({ title, message?, variant?, duration? }) pushes a transient
// message that auto-dismisses. Variants: success | error | warning | info.
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ title, message, variant = "success", duration = DEFAULT_DURATION }) => {
      const id = ++idRef.current;
      setToasts((current) => [...current, { id, title, message, variant }]);
      if (duration > 0) {
        setTimeout(() => dismiss(id), duration);
      }
    },
    [dismiss]
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-20 right-4 z-[60] flex flex-col items-end gap-2 sm:bottom-6">
        {toasts.map((t) => {
          const cfg = VARIANT_STYLES[t.variant] ?? VARIANT_STYLES.info;
          const Icon = cfg.icon;
          return (
            <div
              key={t.id}
              className={`pointer-events-auto flex w-72 animate-pop-in items-start gap-3 rounded-xl border border-panel-line bg-panel/95 p-3 shadow-xl shadow-black/30 backdrop-blur ${cfg.border}`}
            >
              <Icon className={`mt-0.5 h-5 w-5 flex-none ${cfg.iconClass}`} strokeWidth={1.8} />
              <div className="min-w-0 flex-1">
                <p className="font-display text-sm font-bold text-ink-primary">{t.title}</p>
                {t.message && <p className="mt-0.5 font-body text-xs text-ink-muted">{t.message}</p>}
              </div>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                className="flex-none font-mono text-[10px] uppercase tracking-widest text-ink-faint hover:text-ink-primary"
              >
                Close
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
