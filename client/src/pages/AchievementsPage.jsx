import { useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import * as Icons from "lucide-react";
import {
  GraduationCap,
  LayoutDashboard,
  UserRound,
  Trophy,
  Lock,
  CheckCircle2,
  X,
  Sparkles,
  Target,
  Zap,
  Clock,
  Flame,
  Compass,
  Swords,
  Award,
  Filter,
} from "lucide-react";
import ParticleField from "../components/ParticleField.jsx";
import GameNav from "../components/GameNav.jsx";
import SideNav from "../components/SideNav.jsx";
import CornerControls from "../components/CornerControls.jsx";
import ThemeToggle from "../components/ThemeToggle.jsx";
import { MOCK_ACHIEVEMENTS } from "../data/content.js";
import { getAchievementsLive } from "../store/playerStore.js";
import FilterBar from "../components/ui/FilterBar.jsx";

const ACHIEVEMENT_CATEGORIES = [
  { id: "learning", label: "Learning", icon: GraduationCap },
  { id: "accuracy", label: "Accuracy", icon: Target },
  { id: "speed", label: "Speed", icon: Zap },
  { id: "consistency", label: "Consistency", icon: Clock },
  { id: "mastery", label: "Mastery", icon: Award },
  { id: "exploration", label: "Exploration", icon: Compass },
  { id: "challenge", label: "Challenge", icon: Swords },
  { id: "streak", label: "Streak", icon: Flame },
];

const ACHIEVEMENT_CATEGORY_MAP = {
  "first-quest": "learning",
  "streak-7": "streak",
  "streak-30": "streak",
  "atomic-expert": "mastery",
  "world-expert": "mastery",
  "world-explorer": "exploration",
  "boss-slayer": "challenge",
  "50-stars": "learning",
  "perfect-score": "accuracy",
  "subject-legend": "challenge",
  "quiz-champion": "learning",
  "speed-solver": "speed",
  "100-questions": "learning",
  "practice-master": "accuracy",
  "level-up": "learning",
  "coin-collector": "learning",
  "daily-devotee": "consistency",
  "chemistry-legend": "challenge",
  "lab-explorer": "exploration",
};

function AchievementCard({ achievement, onClick }) {
  const Icon = Icons[achievement.icon] ?? Icons.Award;
  const { unlocked, progressCurrent, progressTarget } = achievement;
  const showProgress =
    !unlocked && typeof progressCurrent === "number" && typeof progressTarget === "number";
  const pct = showProgress ? Math.min(100, Math.round((progressCurrent / progressTarget) * 100)) : 0;

  return (
    <button
      type="button"
      onClick={() => onClick?.(achievement)}
      className={`hud-frame w-full rounded-xl border p-5 text-left transition-all hover:-translate-y-0.5 ${
        unlocked ? "border-reward-gold/50 bg-reward-gold/5" : "border-panel-line bg-panel/50 hover:border-panel-line/80"
      }`}
      style={{ "--hud-color": unlocked ? "#FCD34D" : "#6B6088" }}
    >
      <div className="flex items-start justify-between">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-full border ${
            unlocked ? "border-reward-gold/60 bg-reward-gold/15" : "border-panel-line bg-panel-line/20"
          }`}
        >
          <Icon
            className="h-7 w-7"
            strokeWidth={1.7}
            style={{ color: unlocked ? "#FCD34D" : "#6B6088" }}
          />
        </div>
        {unlocked ? (
          <CheckCircle2 className="h-5 w-5 text-neon-green" />
        ) : (
          <Lock className="h-5 w-5 text-ink-faint" />
        )}
      </div>

      <h3
        className={`mt-4 font-display text-lg font-bold uppercase tracking-wide ${
          unlocked ? "text-ink-primary" : "text-ink-faint"
        }`}
      >
        {achievement.name}
      </h3>
      <p className="mt-1 font-body text-sm text-ink-muted line-clamp-2">{achievement.description}</p>

      {unlocked ? (
        <p className="mt-3 font-mono text-[11px] uppercase tracking-widest text-neon-green">
          {achievement.unlockedMeta}
        </p>
      ) : showProgress ? (
        <div className="mt-3">
          <div className="flex items-center justify-between font-mono text-[11px] text-ink-faint">
            <span>Progress</span>
            <span>
              {progressCurrent}/{progressTarget}
            </span>
          </div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-panel-line">
            <div className="h-full rounded-full bg-arcane-purple transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
        </div>
      ) : (
        <p className="mt-3 font-mono text-[11px] uppercase tracking-widest text-ink-faint">Locked</p>
      )}
    </button>
  );
}

function AchievementDetailModal({ achievement, onClose }) {
  if (!achievement) return null;
  const Icon = Icons[achievement.icon] ?? Icons.Award;
  const { unlocked, progressCurrent, progressTarget } = achievement;
  const showProgress = !unlocked && typeof progressCurrent === "number" && typeof progressTarget === "number";
  const pct = showProgress ? Math.min(100, Math.round((progressCurrent / progressTarget) * 100)) : 0;
  const category = ACHIEVEMENT_CATEGORY_MAP[achievement.id] ?? "learning";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-void/80 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative mx-4 w-full max-w-md rounded-2xl border border-panel-line bg-panel p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" onClick={onClose} className="absolute right-4 top-4 rounded-lg border border-panel-line p-1.5 text-ink-faint hover:text-ink-primary">
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col items-center">
          <div
            className={`flex h-20 w-20 items-center justify-center rounded-full border-2 ${
              unlocked ? "border-reward-gold/60 bg-reward-gold/15" : "border-panel-line bg-panel-line/20"
            }`}
          >
            <Icon className="h-10 w-10" strokeWidth={1.6} style={{ color: unlocked ? "#FCD34D" : "#6B6088" }} />
          </div>
          <h2 className={`mt-4 font-display text-xl font-bold ${unlocked ? "text-ink-primary" : "text-ink-faint"}`}>
            {achievement.name}
          </h2>
          <p className="mt-2 max-w-xs text-center font-body text-sm text-ink-muted">{achievement.description}</p>
          <span className="mt-2 font-mono text-[10px] uppercase tracking-widest text-arcane-purple">{category}</span>
        </div>

        {unlocked ? (
          <div className="mt-6 flex items-center justify-center gap-2 rounded-lg border border-neon-green/40 bg-neon-green/5 py-3">
            <CheckCircle2 className="h-4 w-4 text-neon-green" />
            <span className="font-mono text-xs uppercase tracking-widest text-neon-green">
              {achievement.unlockedMeta ?? "Unlocked"}
            </span>
          </div>
        ) : showProgress ? (
          <div className="mt-6">
            <div className="flex items-center justify-between font-mono text-xs text-ink-faint">
              <span>Progress</span>
              <span>{progressCurrent}/{progressTarget}</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-panel-line">
              <div className="h-full rounded-full bg-arcane-purple transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
          </div>
        ) : (
          <div className="mt-6 flex items-center justify-center gap-2 rounded-lg border border-panel-line bg-panel/40 py-3">
            <Lock className="h-4 w-4 text-ink-faint" />
            <span className="font-mono text-xs uppercase tracking-widest text-ink-faint">Locked</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AchievementsPage() {
  const [searchParams] = useSearchParams();
  const grade = searchParams.get("class") ?? "9";
  const board = searchParams.get("board") ?? "CBSE";
  const subject = searchParams.get("subject");

  const [categoryFilter, setCategoryFilter] = useState([]);
  const [detailAchievement, setDetailAchievement] = useState(null);

  const { all, unlocked, locked, unlockedCount, totalXpFromAchievements } = useMemo(() => {
    const live = getAchievementsLive(grade, board);
    const unlockedList = live.filter((a) => a.unlocked);
    const lockedList = live.filter((a) => !a.unlocked);

    const xpEarned = unlockedList.reduce((sum, a) => {
      if (a.id === "first-quest") return sum + 10;
      if (a.id === "streak-7") return sum + 50;
      if (a.id === "atomic-expert") return sum + 30;
      if (a.id === "lab-explorer") return sum + 20;
      if (a.id === "boss-slayer") return sum + 40;
      if (a.id === "50-stars") return sum + 25;
      if (a.id === "perfect-score") return sum + 15;
      if (a.id === "chemistry-legend") return sum + 100;
      return sum + 10;
    }, 0);

    return {
      all: live,
      unlocked: unlockedList,
      locked: lockedList,
      unlockedCount: unlockedList.length,
      totalXpFromAchievements: xpEarned,
    };
  }, [grade, board]);

  const filtered = useMemo(() => {
    if (categoryFilter.length === 0) return all;
    return all.filter((a) => categoryFilter.includes(ACHIEVEMENT_CATEGORY_MAP[a.id] ?? "learning"));
  }, [all, categoryFilter]);

  const filteredUnlocked = filtered.filter((a) => a.unlocked);
  const filteredLocked = filtered.filter((a) => !a.unlocked);

  const filterGroups = [
    {
      label: "",
      filters: ACHIEVEMENT_CATEGORIES.map((c) => ({ id: c.id, label: c.label })),
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-void pb-24 sm:pl-64">
      <div className="absolute inset-0 bg-radial-fade" />
      <div className="aurora-canvas pointer-events-none absolute inset-0" aria-hidden="true" />
      <ParticleField density={26} />

      <SideNav active="profile" grade={grade} board={board} subject={subject} />
      <CornerControls />

      <div className="relative border-b border-panel-line/70 bg-void/70 backdrop-blur-sm sm:hidden">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4 lg:px-8">
          <Link to={`/dashboard?class=${grade}&board=${board}`} className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-neon-cyan" strokeWidth={2.2} />
            <span className="font-wordmark text-sm tracking-wide text-ink-primary">
              Learn<span className="text-neon-cyan">Quest</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to={`/dashboard?class=${grade}&board=${board}`} className="flex items-center gap-1.5 rounded-full border border-panel-line px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-ink-muted hover:border-neon-cyan/60 hover:text-neon-cyan">
              <LayoutDashboard className="h-3.5 w-3.5" /> Dashboard
            </Link>
            <Link to={`/profile?class=${grade}&board=${board}`} className="flex items-center gap-1.5 rounded-full border border-panel-line px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-ink-muted hover:border-neon-cyan/60 hover:text-neon-cyan">
              <UserRound className="h-3.5 w-3.5" /> Profile
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="relative mx-auto mt-8 max-w-5xl px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-reward-gold">Achievements</span>
            <h1 className="mt-2 font-display text-3xl font-bold uppercase tracking-wide text-ink-primary sm:text-4xl">
              Trophy Case
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="hud-frame flex items-center gap-2 rounded-xl border border-panel-line bg-panel/60 px-5 py-3"
              style={{ "--hud-color": "#FCD34D" }}
            >
              <Trophy className="h-5 w-5 text-reward-gold" />
              <span className="font-display text-lg font-bold text-ink-primary">
                {unlockedCount}/{MOCK_ACHIEVEMENTS.length}
              </span>
              <span className="font-mono text-[11px] uppercase tracking-widest text-ink-faint">Unlocked</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-xl border border-reward-gold/40 bg-reward-gold/10 px-4 py-2.5">
              <Sparkles className="h-4 w-4 text-reward-gold" />
              <span className="font-display text-sm font-bold text-reward-gold">{totalXpFromAchievements} XP</span>
              <span className="font-mono text-[10px] uppercase text-reward-gold/70">earned</span>
            </div>
          </div>
        </div>

        {/* Category filters */}
        <div className="mt-5">
          <FilterBar groups={filterGroups} selected={categoryFilter} onChange={setCategoryFilter} multi />
        </div>

        {filteredUnlocked.length > 0 && (
          <>
            <h2 className="mt-8 font-display text-lg font-bold uppercase tracking-wide text-ink-primary">
              Unlocked
            </h2>
            <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredUnlocked.map((a) => (
                <AchievementCard key={a.id} achievement={a} onClick={setDetailAchievement} />
              ))}
            </div>
          </>
        )}

        {filteredLocked.length > 0 && (
          <>
            <h2 className="mt-10 font-display text-lg font-bold uppercase tracking-wide text-ink-primary">
              Locked
            </h2>
            <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredLocked.map((a) => (
                <AchievementCard key={a.id} achievement={a} onClick={setDetailAchievement} />
              ))}
            </div>
          </>
        )}

        {filtered.length === 0 && (
          <div className="mt-8 rounded-xl border border-dashed border-panel-line bg-panel/40 py-10 text-center">
            <p className="font-mono text-xs text-ink-faint">No achievements in this category.</p>
          </div>
        )}
      </div>

      <GameNav active="profile" grade={grade} board={board} subject={subject} />

      <AchievementDetailModal achievement={detailAchievement} onClose={() => setDetailAchievement(null)} />
    </div>
  );
}
