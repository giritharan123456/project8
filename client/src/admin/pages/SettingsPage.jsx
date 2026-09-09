import { useEffect, useState } from "react";
import { Save, RotateCcw, Check } from "lucide-react";
import { useAdminData } from "../AdminContext.jsx";

const SETTINGS_KEY = "chemquest_admin_settings_v1";

const DEFAULTS = {
  platformName: "LearnQuest",
  supportEmail: "support@learnquest.edu",
  maintenanceMode: false,
  allowSignups: true,
  defaultBoard: "CBSE",
  xpPerEasyQuestion: 20,
  xpPerHardQuestion: 60,
  coinsPerLesson: 10,
  dailyStreakBonus: 25,
};

function loadSettings() {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

export default function SettingsPage() {
  const { resetAll } = useAdminData();
  const [settings, setSettings] = useState(loadSettings);
  const [saved, setSaved] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);

  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(() => setSaved(false), 2200);
    return () => clearTimeout(t);
  }, [saved]);

  function setField(key, value) {
    setSettings((s) => ({ ...s, [key]: value }));
  }

  function handleSave(e) {
    e.preventDefault();
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    setSaved(true);
  }

  function handleResetData() {
    resetAll();
    setResetConfirm(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-ink-primary">Settings</h2>
        <p className="mt-1 text-sm text-ink-muted">Platform-wide configuration for the LearnQuest admin console.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <section className="rounded-2xl border border-panel-line bg-panel/60 p-5">
          <h3 className="font-display text-base font-bold text-ink-primary">General</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-ink-faint">Platform Name</span>
              <input
                value={settings.platformName}
                onChange={(e) => setField("platformName", e.target.value)}
                className="w-full rounded-lg border border-panel-line bg-void px-3 py-2 text-sm text-ink-primary outline-none focus:border-neon-cyan"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-ink-faint">Support Email</span>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setField("supportEmail", e.target.value)}
                className="w-full rounded-lg border border-panel-line bg-void px-3 py-2 text-sm text-ink-primary outline-none focus:border-neon-cyan"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-ink-faint">Default Board</span>
              <select
                value={settings.defaultBoard}
                onChange={(e) => setField("defaultBoard", e.target.value)}
                className="w-full rounded-lg border border-panel-line bg-void px-3 py-2 text-sm text-ink-primary outline-none focus:border-neon-cyan"
              >
                {["CBSE", "ICSE", "TN", "MH", "IB", "IGCSE"].map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-4 space-y-3">
            <label className="flex items-center gap-2.5">
              <input
                type="checkbox"
                checked={settings.allowSignups}
                onChange={(e) => setField("allowSignups", e.target.checked)}
                className="h-4 w-4 rounded border-panel-line accent-arcane-purple"
              />
              <span className="text-sm text-ink-muted">Allow new student sign-ups</span>
            </label>
            <label className="flex items-center gap-2.5">
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => setField("maintenanceMode", e.target.checked)}
                className="h-4 w-4 rounded border-panel-line accent-arcane-purple"
              />
              <span className="text-sm text-ink-muted">Maintenance mode (blocks player login)</span>
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-panel-line bg-panel/60 p-5">
          <h3 className="font-display text-base font-bold text-ink-primary">Game Economy</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-ink-faint">XP per Easy Question</span>
              <input
                type="number"
                value={settings.xpPerEasyQuestion}
                onChange={(e) => setField("xpPerEasyQuestion", e.target.valueAsNumber || 0)}
                className="w-full rounded-lg border border-panel-line bg-void px-3 py-2 text-sm text-ink-primary outline-none focus:border-neon-cyan"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-ink-faint">XP per Hard Question</span>
              <input
                type="number"
                value={settings.xpPerHardQuestion}
                onChange={(e) => setField("xpPerHardQuestion", e.target.valueAsNumber || 0)}
                className="w-full rounded-lg border border-panel-line bg-void px-3 py-2 text-sm text-ink-primary outline-none focus:border-neon-cyan"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-ink-faint">Coins per Lesson</span>
              <input
                type="number"
                value={settings.coinsPerLesson}
                onChange={(e) => setField("coinsPerLesson", e.target.valueAsNumber || 0)}
                className="w-full rounded-lg border border-panel-line bg-void px-3 py-2 text-sm text-ink-primary outline-none focus:border-neon-cyan"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-ink-faint">Daily Streak Bonus (coins)</span>
              <input
                type="number"
                value={settings.dailyStreakBonus}
                onChange={(e) => setField("dailyStreakBonus", e.target.valueAsNumber || 0)}
                className="w-full rounded-lg border border-panel-line bg-void px-3 py-2 text-sm text-ink-primary outline-none focus:border-neon-cyan"
              />
            </label>
          </div>
        </section>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-lg bg-arcane-purple px-4 py-2.5 font-display text-sm font-semibold text-white shadow-glow-purple transition-colors hover:bg-arcane-violet"
          >
            <Save className="h-4 w-4" strokeWidth={2} />
            Save Settings
          </button>
          {saved && (
            <span className="flex items-center gap-1.5 font-mono text-xs text-neon-green">
              <Check className="h-4 w-4" /> Saved
            </span>
          )}
        </div>
      </form>

      <section className="rounded-2xl border border-red-500/30 bg-red-500/5 p-5">
        <h3 className="font-display text-base font-bold text-red-400">Danger Zone</h3>
        <p className="mt-1 text-sm text-ink-muted">
          Reset all admin content (students, teachers, boards, courses, questions, quizzes...) back to the seeded demo data.
        </p>
        {!resetConfirm ? (
          <button
            type="button"
            onClick={() => setResetConfirm(true)}
            className="mt-3 flex items-center gap-2 rounded-lg border border-red-500/40 px-4 py-2 font-display text-sm font-semibold text-red-400 transition-colors hover:bg-red-500/10"
          >
            <RotateCcw className="h-4 w-4" strokeWidth={2} />
            Reset All Data
          </button>
        ) : (
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetData}
              className="rounded-lg bg-red-500 px-4 py-2 font-display text-sm font-semibold text-white transition-colors hover:bg-red-600"
            >
              Confirm Reset
            </button>
            <button
              type="button"
              onClick={() => setResetConfirm(false)}
              className="rounded-lg border border-panel-line px-4 py-2 font-display text-sm font-semibold text-ink-muted transition-colors hover:text-ink-primary"
            >
              Cancel
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
