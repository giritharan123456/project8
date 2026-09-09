import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import * as Icons from "lucide-react";
import {
  TrendingUp,
  Coins,
  Flame,
  Star,
  Sparkles,
  Play,
  Award,
  CheckCircle2,
  Circle,
  Trophy,
  Target,
  AlertTriangle,
  Clock4,
  GraduationCap,
  Medal,
  BookOpen,
} from "lucide-react";
import ParticleField from "../components/ParticleField.jsx";
import GameNav from "../components/GameNav.jsx";
import SideNav from "../components/SideNav.jsx";
import CornerControls from "../components/CornerControls.jsx";
import XPBar from "../components/ui/XPBar.jsx";
import StreakBadge from "../components/ui/StreakBadge.jsx";
import SubjectCard from "../components/ui/SubjectCard.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import ErrorState from "../components/ui/ErrorState.jsx";
import LoadingState from "../components/ui/LoadingState.jsx";
import { MOCK_PLAYER, MOCK_DAILY_QUESTS } from "../data/content.js";
import { getSubjectName, getSubjectsFor } from "../data/subjectCatalog.js";
import {
  usePlayerState,
  getEquippedAvatarIcon,
  getDashboardDataLive,
  getAchievementsLive,
  touchDailyStreak,
  levelFromXp,
  xpIntoCurrentLevel,
  xpForLevel,
} from "../store/playerStore.js";
import { useToast } from "../components/ui/Toast.jsx";

function getPlayerTitle(level, subjectPrefix) {
  const prefix = subjectPrefix ?? "Learn";
  if (level >= 20) return `${prefix} Master`;
  if (level >= 10) return `${prefix} Apprentice`;
  if (level >= 5) return `${prefix} Novice`;
  return `${prefix} Rookie`;
}

const TITLE_PREFIX_BY_SUBJECT = {
  CHEM: "Chem",
  MATH: "Math",
  PHY: "Physics",
  ENG: "English",
  BIO: "Bio",
  HIN: "Hindi",
  SST: "Social Science",
  CS: "Code",
};

function StatCard({ icon: Icon, label, value, sub, colorClass = "text-ink-primary", children }) {
  return (
    <div className="rounded-card border border-panel-line bg-panel/60 p-3 shadow-soft">
      <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-ink-faint">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <p className={`mt-1 font-display text-xl font-bold leading-none ${colorClass}`}>{value}</p>
      {sub && <p className="mt-1 font-mono text-[10px] text-ink-faint">{sub}</p>}
      {children}
    </div>
  );
}

function SectionCard({ title, accent = "#806BFF", linkTo, linkLabel, children, loading, error, onRetry }) {
  return (
    <div
      className="hud-frame flex flex-col rounded-card border border-panel-line bg-panel/60 p-5 shadow-soft"
      style={{ "--hud-color": accent }}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-widest" style={{ color: accent }}>
          {title}
        </span>
        {linkTo && (
          <Link
            to={linkTo}
            className="font-mono text-[10px] uppercase tracking-widest text-neon-cyan hover:underline"
          >
            {linkLabel ?? "View All"}
          </Link>
        )}
      </div>
      <div className="mt-4">
        {loading ? (
          <LoadingState type="list" lines={3} />
        ) : error ? (
          <ErrorState message={error.message ?? "Failed to load."} onRetry={onRetry} />
        ) : (
          children
        )}
      </div>
    </div>
  );
}

function EmptyCard({ title, description, action, actionLabel }) {
  return (
    <EmptyState
      icon={Sparkles}
      title={title}
      description={description}
      action={action}
      actionLabel={actionLabel}
    />
  );
}

function MiniQuestRow({ quest }) {
  const done = quest.progress >= quest.target;
  return (
    <div className="flex items-center gap-2.5">
      <span
        className={`flex h-7 w-7 flex-none items-center justify-center rounded-full border ${
          done ? "border-neon-green/50 bg-neon-green/10" : "border-panel-line bg-panel/40"
        }`}
      >
        {done ? (
          <CheckCircle2 className="h-3.5 w-3.5 text-neon-green" />
        ) : (
          <Circle className="h-3.5 w-3.5 text-ink-faint" />
        )}
      </span>
      <span className={`flex-1 font-body text-xs ${done ? "text-ink-primary" : "text-ink-muted"}`}>
        {quest.title}
      </span>
      <span className="flex-none font-mono text-[10px] text-ink-faint">
        {quest.progress}/{quest.target}
      </span>
    </div>
  );
}

function DailyQuestCard({ quests, grade, board, subject, loading, error }) {
  const reward = quests[0] ?? { xp: 0, coins: 0 };
  return (
    <div
      className="hud-frame flex flex-col rounded-card border border-panel-line bg-panel/60 p-5 shadow-soft"
      style={{ "--hud-color": "#806BFF" }}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-widest text-arcane-purple">
          Daily Challenge
        </span>
        <Link
          to={`/quests?class=${grade}&board=${board}${subject ? `&subject=${encodeURIComponent(subject)}` : ""}`}
          className="font-mono text-[10px] uppercase tracking-widest text-neon-cyan hover:underline"
        >
          View All
        </Link>
      </div>

      {loading ? (
        <div className="mt-4"><LoadingState type="list" lines={3} /></div>
      ) : error ? (
        <div className="mt-4">
          <ErrorState message={error.message ?? "Failed to load."} />
        </div>
      ) : (
        <>
          <div className="mt-4 space-y-3">
            {quests.slice(0, 3).map((q) => (
              <MiniQuestRow key={q.id} quest={q} />
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between rounded-lg border border-reward-gold/30 bg-reward-gold/5 px-3 py-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">Reward</span>
            <span className="flex items-center gap-3 font-mono text-xs text-reward-gold">
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3" /> {reward.xp} XP
              </span>
              <span className="flex items-center gap-1">
                <Coins className="h-3 w-3" /> {reward.coins}
              </span>
            </span>
          </div>
        </>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const grade = searchParams.get("class");
  const board = searchParams.get("board");
  const subject = searchParams.get("subject");

  const { toast } = useToast();

  // Simulated async-loading to exercise loading states. In a real build
  // this would be a fetch; here it resolves quickly with local data.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const t = setTimeout(() => {
      setLoading(false);
    }, 450);
    return () => clearTimeout(t);
  }, [grade, board, subject]);

  const currentGrade = grade ?? "9";
  const currentBoard = board ?? "CBSE";

  const { continueWorld, worlds, totalStars, badgesUnlocked } = useMemo(
    () => getDashboardDataLive(currentGrade, currentBoard, subject),
    [currentGrade, currentBoard, subject]
  );

  const playerState = usePlayerState();
  const liveCoins = playerState.coins;
  const liveStreak = playerState.streak;
  const AvatarIcon = Icons[getEquippedAvatarIcon(playerState)] ?? Icons.UserRound;

  // Level / XP computed from the store's totals for a live progression read.
  const totalXpEarned = playerState.totalXpEarned ?? 0;
  const level = playerState.level ?? levelFromXp(totalXpEarned) ?? MOCK_PLAYER.level;
  const xpInto = playerState.xp ?? xpIntoCurrentLevel(totalXpEarned) ?? MOCK_PLAYER.xp;
  const xpToNext = xpForLevel(level) ?? MOCK_PLAYER.xpToNext;
  const playerTitle = getPlayerTitle(level, TITLE_PREFIX_BY_SUBJECT[subject]);
  const displayName = playerState.name ?? MOCK_PLAYER.name;

  // Register "showed up today" for the streak.
  useEffect(() => {
    touchDailyStreak();
  }, []);

  // Live achievements for the preview row.
  const achievements = useMemo(() => getAchievementsLive(currentGrade, currentBoard, subject), [
    currentGrade,
    currentBoard,
    subject,
  ]);
  const unlockedAchievements = achievements.filter((a) => a.unlocked);

  // Subjects for the current board/grade (available ones only) for the
  // "Your Subjects" grid, each with a seeded progress read.
  const subjects = useMemo(() => {
    const list = getSubjectsFor(currentBoard, currentGrade).filter((s) => s.status === "available");
    return list.slice(0, 6).map((s, i) => {
      const pct = 30 + ((i * 17 + (i % 3) * 11) % 60);
      return {
        code: s.code,
        name: s.name,
        icon: s.icon,
        color: s.accent ?? "#806BFF",
        progress: Math.min(96, pct),
        isCurrent: subject ? s.code === subject : i === 0,
      };
    });
  }, [currentBoard, currentGrade, subject]);

  // Recent results derived from the store's real completions (best effort),
  // sorted by most recent, capped at 5.
  const recentResults = useMemo(() => {
    const entries = Object.entries(playerState.completions ?? {})
      .map(([key, completion]) => ({ key, ...completion }))
      .sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0));
    return entries.slice(0, 5).map((e) => ({
      id: e.key,
      worldId: e.key.split("-")[2],
      lessonId: e.key.split("-")[3],
      accuracy: e.accuracy ?? 0,
      stars: e.stars ?? 0,
      xp: e.xp ?? 0,
      completedAt: e.completedAt,
    }));
  }, [playerState.completions]);

  // Weak concepts = completions under 60% accuracy; mastered = >= 90%.
  const weakConcepts = useMemo(
    () => recentResults.filter((r) => r.accuracy > 0 && r.accuracy < 60),
    [recentResults]
  );
  const masteredConcepts = useMemo(
    () => recentResults.filter((r) => r.accuracy >= 90),
    [recentResults]
  );

  // Recommended suggestions keyed off weak areas first, then fresh worlds.
  const recommended = useMemo(() => {
    const weakTopics = weakConcepts.slice(0, 2).map((r) => ({
      title: "Strengthen a weak area",
      detail: `Review lesson to beat the ${r.accuracy}% score`,
      icon: Target,
      accent: "#F87171",
      worldId: r.worldId,
    }));
    const freshWorld = continueWorld
      ? {
          title: continueWorld.name,
          detail: continueWorld.topic,
          icon: Icons[continueWorld.icon] ?? BookOpen,
          accent: "#38D9F4",
          worldId: continueWorld.id,
        }
      : null;
    return [...weakTopics, ...(freshWorld ? [freshWorld] : [])].slice(0, 3);
  }, [weakConcepts, continueWorld]);

  // Assignment-like placeholders (mock for now).
  const assignments = useMemo(
    () => [
      { id: 1, title: "Chapter 3 Â· Chemical Bonding", type: "Quiz", due: "Tomorrow", icon: "Puzzle" },
      { id: 2, title: "Stoichiometry Practice Set", type: "Practice", due: "In 3 days", icon: "Dumbbell" },
      { id: 3, title: "Acids & Bases Worksheet", type: "Homework", due: "Next week", icon: "BookOpen" },
    ],
    []
  );

  const leaderboardRows = useMemo(() => {
    const names = ["Aarav", "Meera", "Riya", "Ishaan", "Kavya"];
    return names.map((n, i) => ({
      rank: i + 1,
      name: n,
      xp: 8200 - i * 850,
      isYou: false,
    }));
  }, []);

  function handleContinue() {
    if (!continueWorld) {
      navigate(`/world?class=${currentGrade}&board=${currentBoard}${subject ? `&subject=${encodeURIComponent(subject)}` : ""}`);
      return;
    }
    navigate(`/course/${continueWorld.id}?class=${currentGrade}&board=${currentBoard}${subject ? `&subject=${encodeURIComponent(subject)}` : ""}`);
  }

  function handleSubjectClick(code) {
    navigate(`/world?class=${currentGrade}&board=${currentBoard}&subject=${encodeURIComponent(code)}`);
  }

  function handleRetry() {
    setError(null);
    setLoading(true);
    setTimeout(() => setLoading(false), 450);
  }

  function handleRecommended(worldId) {
    if (!worldId) return;
    toast({
      title: "Starting recommended lesson",
      message: `Loading ${getSubjectName(subject)} content...`,
      variant: "info",
    });
    navigate(`/course/${worldId}?class=${currentGrade}&board=${currentBoard}${subject ? `&subject=${encodeURIComponent(subject)}` : ""}`);
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-void pb-28 sm:pl-64">
      <div className="absolute inset-0 bg-radial-fade" />
      <div className="aurora-canvas pointer-events-none absolute inset-0" aria-hidden="true" />
      <ParticleField density={22} />

      <SideNav active="home" grade={currentGrade} board={currentBoard} subject={subject} />
      <CornerControls />

      {/* Mobile top brand bar */}
      <div className="relative border-b border-panel-line/70 bg-void/70 backdrop-blur-sm sm:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-neon-cyan" strokeWidth={2.2} />
            <span className="font-wordmark text-sm tracking-wide text-ink-primary">
              LEARN<span className="text-neon-cyan">QUEST</span>
            </span>
          </div>
        </div>
      </div>

      <div className="relative mx-auto mt-8 max-w-6xl px-6 lg:px-8">
        {/* Welcome header */}
        <div className="flex flex-wrap items-start gap-6">
          <div className="flex min-w-[220px] items-start gap-4 animate-fade-up">
            <div className="flex h-14 w-14 flex-none items-center justify-center rounded-full border-2 border-arcane-purple/60 bg-gradient-to-br from-arcane-purple/25 to-neon-cyan/10 shadow-glow-purple">
              <AvatarIcon className="h-7 w-7 text-arcane-purple" strokeWidth={1.7} />
            </div>
            <div>
              <p className="font-body text-sm text-ink-muted">Welcome back,</p>
              <h1 className="text-gradient-hero mt-0.5 font-display text-3xl font-bold">{displayName}!</h1>
              <p className="mt-2 max-w-xs font-body text-sm text-ink-muted">
                Keep exploring {getSubjectName(subject)} and level up today.
              </p>
            </div>
          </div>
        </div>

        {/* XP + streak hero row */}
        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_auto]">
          <div className="hud-frame animate-fade-up rounded-card border border-panel-line bg-panel/60 p-5 shadow-elevated transition-shadow hover:shadow-elevated-glow" style={{ "--hud-color": "#806BFF", animationDelay: "60ms" }}>
            <XPBar level={level} xp={xpInto} xpToNext={xpToNext} />
          </div>
          <div className="flex items-center justify-center rounded-card border border-panel-line bg-panel/60 px-6 py-5">
            <StreakBadge streak={liveStreak} />
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <StatCard icon={TrendingUp} label="Level" value={level} sub={playerTitle} colorClass="text-arcane-purple" />
          <StatCard icon={Coins} label="Coins" value={liveCoins} colorClass="text-reward-gold" />
          <StatCard icon={Star} label="XP" value={totalXpEarned} colorClass="text-neon-cyan" />
          <StatCard icon={Sparkles} label="Stars" value={totalStars} colorClass="text-neon-cyan" />
          <StatCard icon={Award} label="Badges" value={badgesUnlocked} sub="Unlocked" colorClass="text-ink-primary" />
          <StatCard icon={Flame} label="Streak" value={liveStreak} sub="Days" colorClass="text-reward-gold" />
        </div>

        {/* Continue Learning */}
        <div className="mt-8">
          <h2 className="font-display text-lg font-bold uppercase tracking-wide text-ink-primary">
            Continue Learning
          </h2>
          {loading ? (
            <div className="mt-3">
              <LoadingState type="card" lines={1} />
            </div>
          ) : error ? (
            <div className="mt-3">
              <ErrorState message="Couldn't load your progress." onRetry={handleRetry} />
            </div>
          ) : (
            <div className="mt-3 grid gap-4 lg:grid-cols-3">
              <ContinueAdventure world={continueWorld} grade={currentGrade} board={currentBoard} subject={subject} onContinue={handleContinue} />
              <DailyQuestCard quests={MOCK_DAILY_QUESTS} grade={currentGrade} board={currentBoard} subject={subject} loading={false} error={null} />
              <RecentAchievements badges={achievements} grade={currentGrade} board={currentBoard} subject={subject} />
            </div>
          )}
        </div>

        {/* Recommended For You */}
        <div className="mt-8">
          <h2 className="font-display text-lg font-bold uppercase tracking-wide text-ink-primary">
            Recommended For You
          </h2>
          {loading ? (
            <div className="mt-3"><LoadingState type="list" lines={2} /></div>
          ) : error ? (
            <div className="mt-3"><ErrorState message="Couldn't load recommendations." onRetry={handleRetry} /></div>
          ) : recommended.length === 0 ? (
            <div className="mt-3">
              <EmptyCard title="No recommendations yet" description="Play a lesson and we'll suggest what to do next." action={handleContinue} actionLabel="Start Learning" />
            </div>
          ) : (
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {recommended.map((rec, i) => {
                const Icon = rec.icon;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleRecommended(rec.worldId)}
                    className="flex items-center gap-3 rounded-xl border border-panel-line bg-panel/60 p-4 text-left transition-colors hover:border-neon-cyan/50 hover:shadow-glow-cyan"
                  >
                    <span className="flex h-10 w-10 flex-none items-center justify-center rounded-lg" style={{ background: `${rec.accent}14`, border: `1px solid ${rec.accent}55` }}>
                      <Icon className="h-5 w-5" style={{ color: rec.accent }} strokeWidth={1.8} />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-display text-sm font-bold text-ink-primary">{rec.title}</span>
                      <span className="block truncate font-body text-xs text-ink-muted">{rec.detail}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Your Subjects */}
        <div className="mt-8">
          <h2 className="font-display text-lg font-bold uppercase tracking-wide text-ink-primary">
            Your Subjects
          </h2>
          {loading ? (
            <div className="mt-3"><LoadingState type="card" lines={3} /></div>
          ) : error ? (
            <div className="mt-3"><ErrorState message="Couldn't load subjects." onRetry={handleRetry} /></div>
          ) : subjects.length === 0 ? (
            <div className="mt-3">
              <EmptyCard title="No subjects yet" description="Pick a class and board to get started." action={() => navigate("/select-class")} actionLabel="Choose Class" />
            </div>
          ) : (
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3">
              {subjects.map((s) => (
                <SubjectCard key={s.code} subject={s} onClick={() => handleSubjectClick(s.code)} />
              ))}
            </div>
          )}
        </div>

        {/* Recent Results */}
        <div className="mt-8">
          <SectionCard title="Recent Results" accent="#38D9F4" linkTo={`/achievements?class=${currentGrade}&board=${currentBoard}${subject ? `&subject=${encodeURIComponent(subject)}` : ""}`} linkLabel="View All" loading={loading} error={error} onRetry={handleRetry}>
            {recentResults.length === 0 ? (
              <EmptyCard title="No results yet" description="Complete a lesson to see your scores here." action={handleContinue} actionLabel="Start Playing" />
            ) : (
              <div className="space-y-3">
                {recentResults.map((r) => {
                  const statusColor = r.accuracy >= 90 ? "#4ADE80" : r.accuracy >= 60 ? "#FCD34D" : "#F87171";
                  const StatusIcon = r.accuracy >= 90 ? CheckCircle2 : r.accuracy >= 60 ? Circle : AlertTriangle;
                  return (
                    <div key={r.id} className="flex items-center gap-3">
                      <StatusIcon className="h-4 w-4 flex-none" style={{ color: statusColor }} strokeWidth={2} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-display text-xs font-semibold text-ink-primary">
                          {getSubjectName(subject)} Â· {r.lessonId ?? "lesson"}
                        </p>
                        <p className="font-mono text-[10px] text-ink-faint">
                          {new Date(r.completedAt ?? Date.now()).toLocaleDateString()} Â· {r.stars}â˜…
                        </p>
                      </div>
                      <span className="flex-none font-mono text-xs font-bold" style={{ color: statusColor }}>
                        {r.accuracy}%
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </SectionCard>
        </div>

        {/* Weak Concepts */}
        <div className="mt-8">
          <SectionCard title="Weak Concepts" accent="#F87171" loading={loading} error={error} onRetry={handleRetry}>
            {weakConcepts.length === 0 ? (
              <EmptyCard title="Nothing weak here" description="Keep it up â€” no concepts below 60% mastery." />
            ) : (
              <div className="space-y-3">
                {weakConcepts.slice(0, 3).map((w, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="h-7 w-7 flex-none rounded-full border border-red-500/40 bg-red-500/10 text-center font-mono text-[10px] leading-7 text-red-400">
                      !
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-xs font-semibold text-ink-primary">
                        {getSubjectName(subject)} Â· {w.lessonId ?? "lesson"}
                      </p>
                      <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-panel-line">
                        <div className="h-full rounded-full bg-red-400" style={{ width: `${w.accuracy}%` }} />
                      </div>
                    </div>
                    <span className="flex-none font-mono text-[10px] text-red-400">{w.accuracy}%</span>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>

        {/* Mastered Concepts */}
        <div className="mt-8">
          <SectionCard title="Mastered Concepts" accent="#4ADE80" loading={loading} error={error} onRetry={handleRetry}>
            {masteredConcepts.length === 0 ? (
              <EmptyCard title="No mastered concepts yet" description="Score 90%+ on a lesson to master it." />
            ) : (
              <div className="flex flex-wrap gap-2">
                {masteredConcepts.slice(0, 6).map((m, i) => (
                  <span key={i} className="flex items-center gap-1.5 rounded-full border border-neon-green/40 bg-neon-green/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-neon-green">
                    <Trophy className="h-3 w-3" /> {getSubjectName(subject)} Â· {m.lessonId ?? "lesson"}
                  </span>
                ))}
              </div>
            )}
          </SectionCard>
        </div>

        {/* Achievements preview */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold uppercase tracking-wide text-ink-primary">
              Achievements
            </h2>
            <Link to={`/achievements?class=${currentGrade}&board=${currentBoard}${subject ? `&subject=${encodeURIComponent(subject)}` : ""}`} className="font-mono text-[10px] uppercase tracking-widest text-neon-cyan hover:underline">
              View All
            </Link>
          </div>
          {loading ? (
            <div className="mt-3"><LoadingState type="card" lines={2} /></div>
          ) : error ? (
            <div className="mt-3"><ErrorState message="Couldn't load achievements." onRetry={handleRetry} /></div>
          ) : (
            <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-8">
              {achievements.slice(0, 8).map((a) => {
                const Icon = Icons[a.icon] ?? Icons.Award;
                const locked = !a.unlocked;
                return (
                  <div
                    key={a.id}
                    className={`flex flex-col items-center rounded-xl border p-3 text-center transition-all ${locked ? "border-panel-line bg-panel/30 opacity-45" : "border-reward-gold/40 bg-reward-gold/5"}`}
                  >
                    <Icon className={`h-6 w-6 ${locked ? "text-ink-faint" : "text-reward-gold"}`} strokeWidth={1.8} />
                    <p className="mt-1.5 truncate font-mono text-[9px] uppercase tracking-wide text-ink-faint">
                      {a.name}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Leaderboard mini wins + Upcoming assignments */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <SectionCard title="Leaderboard" accent="#FCD34D" linkTo={`/leaderboard?class=${currentGrade}&board=${currentBoard}`} linkLabel="Full Board" loading={loading} error={error} onRetry={handleRetry}>
            <div className="space-y-2">
              {leaderboardRows.slice(0, 5).map((row) => (
                <div key={row.rank} className="flex items-center gap-3 rounded-lg border border-panel-line/50 bg-panel/40 px-3 py-2">
                  <span className="w-5 flex-none font-display text-sm font-bold text-reward-gold">#{row.rank}</span>
                  <Medal className={`h-4 w-4 flex-none ${row.rank === 1 ? "text-reward-gold" : "text-ink-faint"}`} strokeWidth={1.8} />
                  <span className="min-w-0 flex-1 truncate font-display text-xs font-semibold text-ink-primary">{row.name}</span>
                  <span className="flex-none font-mono text-[10px] text-ink-faint">{row.xp.toLocaleString()} XP</span>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Upcoming Assignments" accent="#806BFF" loading={loading} error={error} onRetry={handleRetry}>
            {assignments.length === 0 ? (
              <EmptyCard title="No assignments" description="You're all caught up. Enjoy the free time!" />
            ) : (
              <div className="space-y-3">
                {assignments.map((a) => {
                  const Icon = Icons[a.icon] ?? Icons.ClipboardList;
                  return (
                    <div key={a.id} className="flex items-center gap-3 rounded-lg border border-panel-line/50 bg-panel/40 px-3 py-2.5">
                      <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg border border-arcane-purple/40 bg-arcane-purple/10">
                        <Icon className="h-4 w-4 text-arcane-purple" strokeWidth={1.8} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-display text-xs font-semibold text-ink-primary">{a.title}</p>
                        <p className="font-mono text-[10px] text-ink-faint">{a.type}</p>
                      </div>
                      <span className="flex flex-none items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-neon-cyan">
                        <Clock4 className="h-3 w-3" /> {a.due}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </SectionCard>
        </div>
      </div>

      <GameNav active="home" grade={currentGrade} board={currentBoard} subject={subject} />
    </div>
  );
}

// --- Sub-component: Continue Adventure card ------------------------------

function ContinueAdventure({ world, grade, board, subject, onContinue }) {
  const IconRef = world ? Icons[world.icon] ?? Icons.Map : Icons.CheckCircle2;
  return (
    <div
      className="hud-frame flex flex-col rounded-card border border-panel-line bg-panel/60 p-5 shadow-soft"
      style={{ "--hud-color": "#38D9F4" }}
    >
      <span className="font-mono text-xs uppercase tracking-widest text-neon-cyan">Continue Learning</span>

      <div className="relative mt-3 flex h-32 items-center justify-center overflow-hidden rounded-lg border border-panel-line bg-gradient-to-br from-arcane-purple/20 to-neon-cyan/10">
        <IconRef className="h-14 w-14 text-neon-cyan" strokeWidth={1.4} />
        {world && (
          <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full border border-reward-gold/50 bg-void/80 px-2 py-1 font-mono text-[10px] text-reward-gold">
            <Sparkles className="h-3 w-3" /> In progress
          </span>
        )}
      </div>

      <p className="mt-3 font-display text-lg font-bold text-ink-primary">
        {world ? world.name : `${getSubjectName(subject)} All Cleared!`}
      </p>
      <p className="font-body text-xs text-ink-muted">
        {world ? world.topic : `Class ${grade} Â· ${board} Â· Play again or explore another subject`}
      </p>

      {world && (
        <div className="mt-3">
          <div className="flex items-center justify-between font-mono text-[10px]">
            <span className="flex items-center gap-1 text-neon-green">
              <Sparkles className="h-3 w-3" /> Keep it up!
            </span>
            <span className="text-ink-faint">{world.progress}%</span>
          </div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-panel-line">
            <div className="h-full rounded-full bg-neon-cyan" style={{ width: `${world.progress}%` }} />
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={onContinue}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-neon-cyan px-6 py-3 font-display text-sm font-bold uppercase tracking-wider text-void transition-transform hover:scale-[1.02]"
      >
        <Play className="h-4 w-4" /> {world ? "Continue" : "Play Again"}
      </button>
    </div>
  );
}

// --- Sub-component: Recent achievements card -----------------------------

function RecentAchievements({ badges, grade, board, subject }) {
  const unlocked = badges.filter((b) => b.unlocked).slice(0, 3);
  return (
    <div
      className="hud-frame flex flex-col rounded-card border border-panel-line bg-panel/60 p-5 shadow-soft"
      style={{ "--hud-color": "#FCD34D" }}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-widest text-reward-gold">Recent Achievements</span>
        <Link
          to={`/achievements?class=${grade}&board=${board}${subject ? `&subject=${encodeURIComponent(subject)}` : ""}`}
          className="font-mono text-[10px] uppercase tracking-widest text-neon-cyan hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="mt-4 space-y-3">
        {unlocked.length === 0 ? (
          <EmptyCard title="No achievements yet" description="Complete lessons to earn your first badge." />
        ) : (
          unlocked.map((b) => {
            const Icon = Icons[b.icon] ?? Icons.Star;
            return (
              <div key={b.id} className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full border border-reward-gold/50 bg-reward-gold/10">
                  <Icon className="h-3.5 w-3.5 text-reward-gold" strokeWidth={1.8} />
                </span>
                <span className="min-w-0 flex-1">
                  <p className="truncate font-display text-xs font-semibold text-ink-primary">{b.name}</p>
                  <p className="truncate font-mono text-[10px] text-ink-faint">{b.meta}</p>
                </span>
                <span className="flex-none font-mono text-[10px] font-bold text-neon-green">+{b.xp} XP</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
