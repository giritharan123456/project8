import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  GraduationCap,
  LayoutDashboard,
  UserRound,
  Trophy,
  ListChecks,
  Sparkles,
  Coins,
  CheckCircle2,
  Clock,
  Flame,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import ParticleField from "../components/ParticleField.jsx";
import GameNav from "../components/GameNav.jsx";
import SideNav from "../components/SideNav.jsx";
import CornerControls from "../components/CornerControls.jsx";
import ThemeToggle from "../components/ThemeToggle.jsx";
import { MOCK_DAILY_QUESTS } from "../data/content.js";
import { claimDailyQuest, getClaimedQuestIds, todayKey, usePlayerState } from "../store/playerStore.js";

function getTimeUntilMidnight() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return midnight - now;
}

function formatCountdown(ms) {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function QuestCard({ quest, claimed, onClaim }) {
  const pct = Math.min(100, Math.round((quest.progress / quest.target) * 100));
  const done = quest.progress >= quest.target;
  const claimable = done && !claimed;

  return (
    <div
      className={`hud-frame flex flex-wrap items-center gap-5 rounded-xl border p-5 ${
        done ? "border-neon-green/50 bg-neon-green/5" : "border-panel-line bg-panel/60"
      }`}
      style={{ "--hud-color": done ? "#4ADE80" : "#806BFF" }}
    >
      <div
        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full border ${
          done ? "border-neon-green/60 bg-neon-green/15" : "border-panel-line bg-panel-line/20"
        }`}
      >
        {done ? (
          <CheckCircle2 className="h-7 w-7 text-neon-green" strokeWidth={1.8} />
        ) : (
          <ListChecks className="h-7 w-7 text-arcane-purple" strokeWidth={1.7} />
        )}
      </div>

      <div className="min-w-[180px] flex-1">
        <div className="flex items-center justify-between">
          <h3 className={`font-display text-lg font-bold ${done ? "text-neon-green" : "text-ink-primary"}`}>
            {quest.title}
          </h3>
          <span className="flex items-center gap-1 font-mono text-xs text-ink-faint">
            <span className={`font-bold ${done ? "text-neon-green" : "text-arcane-purple"}`}>
              {quest.progress}
            </span>
            /{quest.target}
          </span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-panel-line">
          <div
            className={`h-full rounded-full transition-all duration-500 ${done ? "bg-neon-green" : "bg-arcane-purple"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        {!done && (
          <p className="mt-1 font-mono text-[10px] text-ink-faint">
            {quest.target - quest.progress} more to go
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1 font-mono text-sm text-reward-gold">
          <Sparkles className="h-4 w-4" /> +{quest.xp}
        </span>
        <span className="flex items-center gap-1 font-mono text-sm text-reward-gold">
          <Coins className="h-4 w-4" /> +{quest.coins}
        </span>
        <button
          type="button"
          disabled={!claimable}
          onClick={claimable ? () => onClaim(quest) : undefined}
          className={`rounded-xl px-4 py-2 font-display text-xs font-bold uppercase tracking-widest transition-transform ${
            claimable
              ? "bg-neon-green text-void hover:scale-[1.03] active:scale-[0.97]"
              : "cursor-not-allowed bg-panel-line/40 text-ink-faint"
          }`}
        >
          {claimed ? "Claimed" : done ? "Claim" : "Locked"}
        </button>
      </div>
    </div>
  );
}

export default function DailyQuestsPage() {
  const [searchParams] = useSearchParams();
  const grade = searchParams.get("class") ?? "9";
  const board = searchParams.get("board") ?? "CBSE";
  const subject = searchParams.get("subject");

  const [claimedIds, setClaimedIds] = useState(() => getClaimedQuestIds());
  const [toast, setToast] = useState(null);
  const [countdown, setCountdown] = useState(getTimeUntilMidnight());
  const [showCompleted, setShowCompleted] = useState(false);

  const playerState = usePlayerState();

  // Activity tracking from localStorage
  const activityCounts = useMemo(() => {
    const completions = playerState.completions ?? {};
    let questionsAnswered = 0;
    let lessonsCompleted = 0;
    const today = todayKey();
    for (const [, val] of Object.entries(completions)) {
      if (val.completedAt) {
        const d = new Date(val.completedAt);
        const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        if (k === today) {
          questionsAnswered += 10;
          lessonsCompleted += 1;
        }
      }
    }
    return { questionsAnswered, lessonsCompleted };
  }, [playerState.completions]);

  // Update quest progress based on activity
  const quests = useMemo(() => {
    return MOCK_DAILY_QUESTS.map((q) => {
      let progress = q.progress;
      if (q.id === "dq1") progress = Math.min(activityCounts.lessonsCompleted, q.target);
      if (q.id === "dq2") progress = Math.min(activityCounts.questionsAnswered, q.target);
      return { ...q, progress };
    });
  }, [activityCounts]);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => setCountdown(getTimeUntilMidnight()), 1000);
    return () => clearInterval(interval);
  }, []);

  const { completedCount, activeCount, totalXp, totalCoins } = useMemo(() => {
    const completed = quests.filter((q) => q.progress >= q.target);
    const active = quests.filter((q) => q.progress < q.target);
    return {
      completedCount: completed.length,
      activeCount: active.length,
      totalXp: quests.reduce((sum, q) => sum + q.xp, 0),
      totalCoins: quests.reduce((sum, q) => sum + q.coins, 0),
    };
  }, [quests]);

  const claimedTodayXP = quests
    .filter((q) => claimedIds.includes(q.id))
    .reduce((sum, q) => sum + q.xp, 0);
  const claimedTodayCoins = quests
    .filter((q) => claimedIds.includes(q.id))
    .reduce((sum, q) => sum + q.coins, 0);

  const streakBonus = playerState.streak >= 7 ? "2x" : playerState.streak >= 3 ? "1.5x" : "1x";

  function handleClaim(quest) {
    const { claimed } = claimDailyQuest(quest.id, quest.xp, quest.coins);
    if (!claimed) return;
    setClaimedIds((prev) => [...prev, quest.id]);
    setToast(`+${quest.xp} XP  \u2022  +${quest.coins} Coins`);
    window.clearTimeout(handleClaim._t);
    handleClaim._t = window.setTimeout(() => setToast(null), 2200);
  }

  const completedQuests = quests.filter((q) => claimedIds.includes(q.id));
  const activeQuests = quests.filter((q) => !claimedIds.includes(q.id));

  return (
    <div className="relative min-h-screen overflow-hidden bg-void pb-24 sm:pl-64">
      <div className="absolute inset-0 bg-radial-fade" />
      <div className="aurora-canvas pointer-events-none absolute inset-0" aria-hidden="true" />
      <ParticleField density={26} />

      <SideNav active="quests" grade={grade} board={board} subject={subject} />
      <CornerControls />

      <div className="relative border-b border-panel-line/70 bg-void/70 backdrop-blur-sm sm:hidden">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-6 py-4 lg:px-8">
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
            <Link to={`/achievements?class=${grade}&board=${board}`} className="flex items-center gap-1.5 rounded-full border border-panel-line px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-ink-muted hover:border-neon-cyan/60 hover:text-neon-cyan">
              <Trophy className="h-3.5 w-3.5" /> Achievements
            </Link>
            <Link to={`/profile?class=${grade}&board=${board}`} className="flex items-center gap-1.5 rounded-full border border-panel-line px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-ink-muted hover:border-neon-cyan/60 hover:text-neon-cyan">
              <UserRound className="h-3.5 w-3.5" /> Profile
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="relative mx-auto mt-8 max-w-4xl px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-arcane-purple">Daily Quests</span>
            <h1 className="mt-2 font-display text-3xl font-bold uppercase tracking-wide text-ink-primary sm:text-4xl">
              Today&rsquo;s Missions
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <p className="flex items-center gap-1.5 font-mono text-xs text-ink-faint">
                <Clock className="h-3.5 w-3.5" /> Resets in {formatCountdown(countdown)}
              </p>
              <span className="flex items-center gap-1 rounded-full border border-amber-400/40 bg-amber-400/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-amber-400">
                <Flame className="h-3 w-3" /> Streak {playerState.streak}d &middot; Bonus {streakBonus}
              </span>
            </div>
          </div>
          <div className="hud-frame flex items-center gap-2 rounded-xl border border-panel-line bg-panel/60 px-5 py-3" style={{ "--hud-color": "#4ADE80" }}>
            <CheckCircle2 className="h-5 w-5 text-neon-green" />
            <span className="font-display text-lg font-bold text-ink-primary">
              {completedCount}/{quests.length}
            </span>
            <span className="font-mono text-[11px] uppercase tracking-widest text-ink-faint">Complete</span>
          </div>
        </div>

        {/* Active quests */}
        {activeCount > 0 && (
          <>
            <h2 className="mt-8 font-display text-lg font-bold uppercase tracking-wide text-ink-primary">
              Active Quests
            </h2>
            <div className="mt-3 space-y-4">
              {activeQuests.map((q) => (
                <QuestCard
                  key={q.id}
                  quest={q}
                  claimed={claimedIds.includes(q.id)}
                  onClaim={handleClaim}
                />
              ))}
            </div>
          </>
        )}

        {/* Completed quests */}
        {completedQuests.length > 0 && (
          <>
            <button
              type="button"
              onClick={() => setShowCompleted(!showCompleted)}
              className="mt-8 flex items-center gap-2 font-display text-lg font-bold uppercase tracking-wide text-ink-primary hover:text-neon-green"
            >
              Completed ({completedQuests.length})
              {showCompleted ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>
            {showCompleted && (
              <div className="mt-3 space-y-4">
                {completedQuests.map((q) => (
                  <QuestCard
                    key={q.id}
                    quest={q}
                    claimed={claimedIds.includes(q.id)}
                    onClaim={handleClaim}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Summary footer */}
        <div className="hud-frame mt-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-panel-line bg-panel/60 px-6 py-5" style={{ "--hud-color": "#FCD34D" }}>
          <div className="space-y-1">
            <span className="block font-mono text-xs uppercase tracking-widest text-ink-faint">
              Total available today
            </span>
            {claimedTodayXP > 0 && (
              <span className="block font-mono text-[10px] text-neon-green">
                Claimed: +{claimedTodayXP} XP &middot; +{claimedTodayCoins} Coins
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-mono text-sm text-reward-gold">
              <Sparkles className="h-4 w-4" /> {totalXp} XP
            </span>
            <span className="flex items-center gap-1.5 font-mono text-sm text-reward-gold">
              <Coins className="h-4 w-4" /> {totalCoins} Coins
            </span>
          </div>
        </div>
      </div>

      <GameNav active="quests" grade={grade} board={board} subject={subject} />

      {toast && (
        <div
          className="hud-frame fixed left-1/2 top-6 z-50 -translate-x-1/2 rounded-xl border border-neon-green/60 bg-void/95 px-6 py-3 font-mono text-sm font-bold text-neon-green shadow-lg"
          style={{ "--hud-color": "#4ADE80" }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}
