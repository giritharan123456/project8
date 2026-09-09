import { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import * as Icons from "lucide-react";
import {
  ChevronLeft,
  TrendingUp,
  Target,
  Flame,
  Clock,
  Award,
  Calendar,
  BarChart3,
  BookOpen,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Star,
  Sparkles,
  Coins,
  Swords,
} from "lucide-react";
import ParticleField from "../components/ParticleField.jsx";
import { usePlayerState } from "../store/playerStore.js";
import { getDetailedProgress } from "../api/endpoints.js";

function ProgressRing({ percentage, size = 80, strokeWidth = 6, color = "#806BFF" }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#3A3E68"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-700"
      />
    </svg>
  );
}

function StreakCalendar({ days }) {
  const today = new Date();
  const cells = [];
  for (let i = 27; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const active = days?.includes(key) ?? i > 20;
    cells.push({ key, active, day: d.getDate() });
  }
  return (
    <div className="grid grid-cols-7 gap-1">
      {cells.map((cell) => (
        <div
          key={cell.key}
          className={`flex h-7 w-7 items-center justify-center rounded text-[10px] font-bold ${
            cell.active
              ? "bg-neon-green/20 text-neon-green"
              : "bg-panel/30 text-ink-faint"
          }`}
        >
          {cell.day}
        </div>
      ))}
    </div>
  );
}

function AccuracyBar({ label, accuracy, color }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-28 shrink-0 truncate font-body text-xs text-ink-muted">{label}</span>
      <div className="flex-1 h-2 overflow-hidden rounded-full bg-panel-line">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${accuracy}%`, backgroundColor: color }}
        />
      </div>
      <span className="w-10 text-right font-mono text-xs text-ink-faint">{accuracy}%</span>
    </div>
  );
}

function StatBox({ icon: Icon, label, value, color = "#806BFF" }) {
  return (
    <div className="rounded-xl border border-panel-line bg-panel/60 p-3">
      <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-ink-faint">
        <Icon className="h-3.5 w-3.5" style={{ color }} /> {label}
      </div>
      <p className="mt-1 font-display text-xl font-bold text-ink-primary">{value}</p>
    </div>
  );
}

function ActivityRow({ activity }) {
  const iconMap = {
    level_complete: CheckCircle2,
    quiz_complete: Target,
    boss_defeated: Swords,
  };
  const Icon = iconMap[activity.type] ?? Zap;
  return (
    <div className="flex items-center gap-3 rounded-lg border border-panel-line bg-panel/40 p-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-arcane-purple/15">
        <Icon className="h-4 w-4 text-arcane-purple" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="truncate font-body text-sm text-ink-primary">{activity.title}</p>
        <p className="font-mono text-[10px] text-ink-faint">
          {Math.round((Date.now() - activity.timestamp) / 3600000)}h ago
        </p>
      </div>
      <div className="text-right">
        <p className="font-mono text-xs text-reward-gold">+{activity.xp} XP</p>
        <p className="font-mono text-[10px] text-ink-faint">+{activity.coins} coins</p>
      </div>
    </div>
  );
}

export default function ProgressPage() {
  const [searchParams] = useSearchParams();
  const grade = searchParams.get("class") ?? "9";
  const board = searchParams.get("board") ?? "CBSE";
  const subject = searchParams.get("subject") ?? "CHEM";
  const queryBase = `?class=${grade}&board=${board}&subject=${subject}`;

  const playerState = usePlayerState();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const result = await getDetailedProgress({ grade, board, subject });
        setData(result);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [grade, board, subject]);

  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-void">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-arcane-purple border-t-transparent" />
          <p className="mt-3 font-body text-sm text-ink-muted">Loading progress...</p>
        </div>
      </div>
    );
  }

  const progress = data ?? {
    overall: { totalXP: playerState.xp, totalStars: 0, levelsCompleted: 0, accuracy: 0, streak: playerState.streak, timeSpent: 0 },
    subjects: [],
    recentActivity: [],
    weakConcepts: [],
  };

  const timeHours = Math.floor((progress.overall.timeSpent ?? 0) / 3600);
  const timeMinutes = Math.floor(((progress.overall.timeSpent ?? 0) % 3600) / 60);

  return (
    <div className="relative min-h-screen bg-void">
      <div className="absolute inset-0 bg-radial-fade" />
      <div className="aurora-canvas pointer-events-none absolute inset-0" aria-hidden="true" />
      <ParticleField density={10} />

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-8">
        <Link
          to={`/dashboard${queryBase}`}
          className="mb-6 inline-flex items-center gap-1 font-display text-sm text-ink-muted hover:text-ink-primary"
        >
          <ChevronLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-ink-primary">
          Your Progress
        </h1>
        <p className="mt-2 font-body text-sm text-ink-muted">
          Track your learning journey across all subjects.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatBox icon={Sparkles} label="Total XP" value={progress.overall.totalXP.toLocaleString()} color="#FCD34D" />
          <StatBox icon={Star} label="Stars" value={progress.overall.totalStars} color="#FCD34D" />
          <StatBox icon={Target} label="Accuracy" value={`${progress.overall.accuracy}%`} color="#38D9F4" />
          <StatBox icon={Flame} label="Streak" value={`${progress.overall.streak} days`} color="#F87171" />
        </div>

        <div className="mt-8">
          <h2 className="mb-4 font-display text-lg font-bold text-ink-primary">Subject Progress</h2>
          {progress.subjects.length > 0 ? (
            <div className="space-y-4">
              {progress.subjects.map((subj) => (
                <div
                  key={subj.code}
                  className="hud-frame flex items-center gap-4 rounded-xl border border-panel-line bg-panel/60 p-4"
                  style={{ "--hud-color": subj.mastery >= 70 ? "#4ADE80" : subj.mastery >= 40 ? "#38D9F4" : "#FCD34D" }}
                >
                  <div className="relative">
                    <ProgressRing percentage={subj.mastery} size={64} strokeWidth={5} />
                    <span className="absolute inset-0 flex items-center justify-center font-display text-sm font-bold text-ink-primary">
                      {subj.mastery}%
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-display text-sm font-bold text-ink-primary">{subj.name}</p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-ink-faint">
                      <span>{subj.levelsCompleted} levels</span>
                      <span>{subj.stars} stars</span>
                      <span>{subj.progress}% complete</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="font-body text-sm text-ink-muted">No subject data yet. Start a lesson to see progress.</p>
          )}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 font-display text-lg font-bold text-ink-primary flex items-center gap-2">
              <Calendar className="h-5 w-5 text-neon-green" /> Streak Calendar
            </h2>
            <div className="rounded-xl border border-panel-line bg-panel/60 p-4">
              <StreakCalendar />
              <div className="mt-3 flex items-center justify-between text-xs text-ink-faint">
                <span>28 days ago</span>
                <span>Today</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="mb-4 font-display text-lg font-bold text-ink-primary flex items-center gap-2">
              <Clock className="h-5 w-5 text-arcane-purple" /> Time Spent
            </h2>
            <div className="rounded-xl border border-panel-line bg-panel/60 p-4">
              <div className="text-center">
                <p className="font-display text-3xl font-bold text-ink-primary">
                  {timeHours}h {timeMinutes}m
                </p>
                <p className="mt-1 font-body text-xs text-ink-muted">Total study time</p>
              </div>
            </div>
          </div>
        </div>

        {progress.weakConcepts.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-4 font-display text-lg font-bold text-ink-primary flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-reward-gold" /> Areas to Improve
            </h2>
            <div className="space-y-3">
              {progress.weakConcepts.map((concept, i) => (
                <div key={i} className="rounded-xl border border-reward-gold/20 bg-reward-gold/5 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-display text-sm font-bold text-ink-primary">{concept.name}</p>
                    <span className="font-mono text-xs text-reward-gold">{concept.accuracy}% accuracy</span>
                  </div>
                  <p className="mt-1 font-body text-xs text-ink-muted">{concept.recommendation}</p>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-panel-line">
                    <div
                      className="h-full rounded-full bg-reward-gold"
                      style={{ width: `${concept.accuracy}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {progress.recentActivity.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-4 font-display text-lg font-bold text-ink-primary">Recent Activity</h2>
            <div className="space-y-2">
              {progress.recentActivity.map((activity) => (
                <ActivityRow key={activity.id} activity={activity} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
