import { useMemo, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import * as Icons from "lucide-react";
import {
  GraduationCap,
  ChevronLeft,
  Lock,
  CheckCircle2,
  Play,
  Star,
  Sparkles,
  Coins,
  Flame,
  RefreshCw,
  AlertTriangle,
  ChevronDown,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import ParticleField from "../components/ParticleField.jsx";
import GameNav from "../components/GameNav.jsx";
import SideNav from "../components/SideNav.jsx";
import CornerControls from "../components/CornerControls.jsx";
import ThemeToggle from "../components/ThemeToggle.jsx";
import ProgressRing from "../components/ui/ProgressRing.jsx";
import MasteryBadge from "../components/ui/MasteryBadge.jsx";
import { MOCK_PLAYER, LESSONS_BY_WORLD } from "../data/content.js";
import { getSubjectName, getSubjectsFor, getSubjectByCode } from "../data/subjectCatalog.js";
import { usePlayerState, getEquippedAvatarIcon } from "../store/playerStore.js";
import { getCourses } from "../api/endpoints.js";
import { useApiData } from "../api/useApiData.js";

const NODE_ACCENTS = ["#806BFF", "#38D9F4", "#4ADE80", "#FCD34D"];
const FINAL_ACCENT = "#FCD34D";

function StarRow({ stars }) {
  return (
    <div className="flex gap-0.5">
      {[0, 1, 2].map((i) => (
        <Star
          key={i}
          className="h-3.5 w-3.5"
          strokeWidth={1.8}
          style={
            i < stars
              ? { color: "#FCD34D", fill: "#FCD34D" }
              : { color: "#3A3E68", fill: "none" }
          }
        />
      ))}
    </div>
  );
}

function getMasteryLevel(progress) {
  if (progress >= 100) return "mastered";
  if (progress >= 75) return "strong";
  if (progress >= 40) return "practicing";
  if (progress > 0) return "learning";
  return "not-started";
}

function WorldNode({ world, index, accent, align, onEnter, isLast }) {
  const Icon = Icons[world.icon] ?? Icons.MapPin;
  const locked = world.status === "locked";
  const completed = world.status === "completed";
  const color = locked ? "#3A3E68" : accent;
  const mastery = getMasteryLevel(completed ? 100 : world.progress);
  const lessons = LESSONS_BY_WORLD[world.id] ?? [];

  const justify =
    align === "left"
      ? "sm:justify-start"
      : align === "right"
      ? "sm:justify-end"
      : "sm:justify-center";

  return (
    <div className={`relative z-10 flex justify-center ${justify}`}>
      {/* Connector arrow */}
      {!isLast && !locked && (
        <div className="absolute -bottom-10 left-1/2 z-20 hidden -translate-x-1/2 sm:block">
          <ArrowRight className="h-5 w-5 rotate-90 text-ink-faint/40" strokeWidth={1.5} />
        </div>
      )}

      <div
        className={`hud-frame w-full max-w-xs rounded-xl border bg-panel/70 p-5 backdrop-blur-sm transition-all duration-300 sm:w-72 ${
          locked
            ? "border-panel-line opacity-60"
            : "border-panel-line hover:-translate-y-1"
        }`}
        style={{ "--hud-color": color }}
      >
        <div className="flex items-start justify-between">
          <div className="relative">
            {!locked && !completed && (
              <div
                className="absolute -inset-1 rounded-lg animate-pulse-border"
                style={{ boxShadow: `0 0 0 2px ${accent}88` }}
              />
            )}
            <div
              className="relative flex h-14 w-14 items-center justify-center rounded-lg border"
              style={{
                borderColor: `${color}66`,
                background: locked ? "transparent" : `${color}14`,
              }}
            >
              {locked ? (
                <Lock className="h-6 w-6 text-ink-faint" strokeWidth={1.8} />
              ) : (
                <Icon className="h-7 w-7" style={{ color }} strokeWidth={1.7} />
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
              World {String(index + 1).padStart(2, "0")}
            </span>
            {!locked && <ProgressRing value={completed ? 100 : world.progress} size={40} strokeWidth={4} color={color} />}
          </div>
        </div>

        <h3
          className={`mt-3 font-display text-xl font-bold uppercase tracking-wide ${
            locked ? "text-ink-faint" : "text-ink-primary"
          }`}
        >
          {world.name}
        </h3>
        <p className="mt-1 font-body text-xs text-ink-muted">{world.topic}</p>

        {!locked && (
          <div className="mt-2">
            <MasteryBadge level={mastery} progress={completed ? 100 : world.progress} compact />
          </div>
        )}

        {world.isFinal && (
          <span
            className="mt-2 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest"
            style={{ borderColor: `${FINAL_ACCENT}66`, color: FINAL_ACCENT }}
          >
            <Icons.Crown className="h-3 w-3" /> Boss World
          </span>
        )}

        {!locked && (
          <>
            <div className="mt-4 flex items-center justify-between">
              <StarRow stars={world.stars} />
              {completed ? (
                <span className="flex items-center gap-1 font-mono text-[11px] text-neon-green">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Cleared
                </span>
              ) : (
                <span className="font-mono text-[11px] text-ink-faint">
                  {world.progress}%
                </span>
              )}
            </div>

            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-panel-line">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${completed ? 100 : world.progress}%`,
                  background: color,
                }}
              />
            </div>

            {/* Chapter organization */}
            {lessons.length > 0 && (
              <div className="mt-3 flex items-center gap-1.5">
                <BookOpen className="h-3 w-3 text-ink-faint" />
                <span className="font-mono text-[10px] text-ink-faint">
                  {lessons.length} chapters
                </span>
                <span className="font-mono text-[10px] text-ink-faint/50">&middot;</span>
                <span className="font-mono text-[10px] text-ink-faint">
                  {lessons.filter((l) => l.status === "completed").length}/{lessons.length} done
                </span>
              </div>
            )}
          </>
        )}

        <button
          type="button"
          disabled={locked}
          onClick={() => onEnter(world)}
          className={`group/btn mt-5 flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 font-display text-sm font-bold uppercase tracking-wider transition-transform ${
            locked
              ? "cursor-not-allowed bg-panel-line/40 text-ink-faint"
              : "text-void hover:scale-[1.02]"
          }`}
          style={locked ? {} : { background: color }}
        >
          {locked ? (
            <>
              <Lock className="h-4 w-4" /> Locked
            </>
          ) : completed ? (
            <>
              <Icons.RotateCcw className="h-4 w-4" /> Replay World
            </>
          ) : (
            <>
              <Play className="h-4 w-4" /> Enter World
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default function WorldMapPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const grade = searchParams.get("class");
  const board = searchParams.get("board");
  const subject = searchParams.get("subject");

  const [selectedSubject, setSelectedSubject] = useState(subject ?? "CHEM");
  const activeSubject = selectedSubject || subject || "CHEM";

  // Get available subjects for this board/class
  const availableSubjects = useMemo(() => {
    if (!grade || !board) return [];
    return getSubjectsFor(board, grade).filter((s) => s.status === "available");
  }, [grade, board]);

  const {
    data: courseData,
    loading,
    error,
    retry,
  } = useApiData(() => getCourses({ grade, board, subject: activeSubject }), [grade, board, activeSubject]);

  const worlds = courseData?.worlds ?? [];
  const completedCount = courseData?.completedCount ?? 0;
  const totalStars = courseData?.totalStars ?? 0;
  const totalXp = courseData?.totalXp ?? 0;
  const overallProgress = courseData?.overallProgress ?? 0;

  const playerState = usePlayerState();
  const liveCoins = playerState.coins;
  const liveXp = playerState.xp;
  const AvatarIcon = Icons[getEquippedAvatarIcon(playerState)] ?? Icons.UserRound;

  function handleEnterWorld(world) {
    navigate(
      `/course/${world.id}?class=${grade ?? ""}&board=${board ?? ""}${activeSubject ? `&subject=${encodeURIComponent(activeSubject)}` : ""}`
    );
  }

  function handleSubjectSwitch(newSubject) {
    setSelectedSubject(newSubject);
    navigate(
      `/world-map?class=${grade ?? ""}&board=${board ?? ""}&subject=${encodeURIComponent(newSubject)}`,
      { replace: true }
    );
  }

  const xpPct = Math.min(
    100,
    Math.round((liveXp / MOCK_PLAYER.xpToNext) * 100)
  );

  const subjectInfo = getSubjectByCode(activeSubject);
  const subjectName = subjectInfo?.name ?? getSubjectName(activeSubject);

  return (
    <div className="relative min-h-screen overflow-hidden bg-void pb-24 sm:pl-64">
      <div className="absolute inset-0 bg-radial-fade" />
      <div className="aurora-canvas pointer-events-none absolute inset-0" aria-hidden="true" />
      <ParticleField density={26} />

      <SideNav active="world" grade={grade} board={board} subject={activeSubject} />
      <CornerControls />

      <div className="relative border-b border-panel-line/70 bg-void/70 backdrop-blur-sm sm:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4 lg:px-8">
          <Link
            to={`/select-board?class=${grade ?? ""}${activeSubject ? `&subject=${encodeURIComponent(activeSubject)}` : ""}`}
            className="flex items-center gap-2 text-ink-muted hover:text-ink-primary"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="font-mono text-xs uppercase tracking-widest">Switch Board</span>
          </Link>

          <Link
            to={`/dashboard?class=${grade ?? ""}&board=${board ?? ""}${activeSubject ? `&subject=${encodeURIComponent(activeSubject)}` : ""}`}
            className="flex items-center gap-2"
          >
            <GraduationCap className="h-5 w-5 text-neon-cyan" strokeWidth={2.2} />
            <span className="font-wordmark text-sm tracking-wide text-ink-primary">
              Learn<span className="text-neon-cyan">Quest</span>
            </span>
          </Link>

          <span className="hidden rounded-full border border-panel-line px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-ink-muted sm:inline-block">
            Class {grade ?? "?"} &middot; {board ?? "?"} &middot; {subjectName}
          </span>
          <ThemeToggle />
        </div>
      </div>

      {/* Player HUD strip */}
      <div className="relative mx-auto mt-6 max-w-6xl px-6 lg:px-8">
        <div className="hud-frame flex flex-wrap items-center gap-x-8 gap-y-3 rounded-xl border border-panel-line bg-panel/60 px-6 py-4" style={{ "--hud-color": "#806BFF" }}>
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 flex-none items-center justify-center rounded-full border border-arcane-purple/60 bg-arcane-purple/15">
              <AvatarIcon className="h-5 w-5 text-arcane-purple" strokeWidth={1.8} />
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border border-void bg-arcane-purple font-mono text-[9px] font-bold text-void">
                {MOCK_PLAYER.level}
              </span>
            </div>
            <div className="w-36">
              <div className="flex items-center justify-between font-mono text-[10px] text-ink-faint">
                <span>LVL {MOCK_PLAYER.level}</span>
                <span>{liveXp}/{MOCK_PLAYER.xpToNext} XP</span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-panel-line">
                <div className="h-full rounded-full bg-arcane-purple" style={{ width: `${xpPct}%` }} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-sm text-reward-gold">
            <Coins className="h-4 w-4" /> {liveCoins}
          </div>
          <div className="flex items-center gap-1.5 font-mono text-sm text-neon-green">
            <Flame className="h-4 w-4" /> {playerState.streak} Day Streak
          </div>
          <div className="flex items-center gap-1.5 font-mono text-sm text-neon-cyan">
            <Star className="h-4 w-4" /> {totalStars} Stars
          </div>

          <div className="ml-auto flex items-center gap-2 sm:hidden">
            <span className="rounded-full border border-panel-line px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-ink-muted">
              Class {grade ?? "?"} &middot; {board ?? "?"} &middot; {subjectName}
            </span>
          </div>
        </div>
      </div>

      {/* Heading + Subject Switcher */}
      <div className="relative mx-auto mt-12 max-w-2xl px-6 text-center lg:px-8">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-neon-green">
          {worlds.length > 0 ? `${completedCount}/${worlds.length} Worlds Cleared` : subjectName}
        </span>
        <h1 className="mt-3 font-display text-4xl font-bold uppercase tracking-wide text-ink-primary sm:text-5xl">
          {subjectName} <span className="text-arcane-purple">World</span>
        </h1>
        <p className="mt-4 font-body text-ink-muted">
          {grade && board ? (
            <>
              Your map for <span className="text-ink-primary">Class {grade}</span> &middot;{" "}
              <span className="text-ink-primary">{board}</span>. Clear a world to reveal the
              next one.
            </>
          ) : (
            "Pick a class and board to load your world."
          )}
        </p>

        {(!grade || !board) && (
          <p className="mt-2 font-mono text-xs text-reward-gold">
            Missing class or board â€”{" "}
            <Link to="/select-class" className="underline">
              start onboarding again
            </Link>
            .
          </p>
        )}

        {/* Subject switcher */}
        {availableSubjects.length > 0 && (
          <div className="mt-5">
            <div className="inline-flex items-center gap-2 rounded-xl border border-panel-line bg-panel/60 px-2 py-1.5">
              <span className="px-2 font-mono text-[10px] uppercase tracking-widest text-ink-faint">Subject:</span>
              <div className="flex flex-wrap gap-1">
                {availableSubjects.map((s) => (
                  <button
                    key={s.code}
                    type="button"
                    onClick={() => handleSubjectSwitch(s.code)}
                    className={`rounded-lg px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest transition-colors ${
                      activeSubject === s.code
                        ? "bg-arcane-purple text-void"
                        : "text-ink-muted hover:text-ink-primary"
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {worlds.length > 0 && (
          <div className="mx-auto mt-6 max-w-sm">
            <div className="flex items-center justify-between font-mono text-[11px] text-ink-faint">
              <span>Overall Progress</span>
              <span className="text-ink-primary">{overallProgress}%</span>
            </div>
            <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-panel-line">
              <div
                className="h-full rounded-full bg-gradient-to-r from-arcane-purple via-neon-cyan to-neon-green transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Serpentine world trail */}
      <div className="relative mx-auto mt-16 max-w-3xl px-6 lg:px-8">
        {loading && !courseData && (
          <div className="space-y-10 sm:space-y-4">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`flex ${i % 2 === 0 ? "sm:justify-start" : "sm:justify-end"} justify-center`}
              >
                <div className="h-28 w-full max-w-sm animate-pulse rounded-2xl border border-panel-line bg-panel/50 sm:w-80" />
              </div>
            ))}
          </div>
        )}

        {error && !courseData && (
          <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl border border-red-400/40 bg-red-400/5 px-6 py-8 text-center">
            <AlertTriangle className="h-8 w-8 text-red-400" strokeWidth={1.8} />
            <p className="font-display text-sm font-semibold text-ink-primary">
              Couldn't load your {subjectName} World
            </p>
            <p className="font-mono text-xs text-ink-muted">{error.message}</p>
            <button
              onClick={retry}
              className="mt-2 flex items-center gap-2 rounded-full border border-panel-line px-4 py-2 font-mono text-xs uppercase tracking-widest text-ink-primary transition hover:border-neon-cyan hover:text-neon-cyan"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Retry
            </button>
          </div>
        )}

        {courseData && worlds.length === 0 && (
          <div className="hud-frame mx-auto flex max-w-md flex-col items-center gap-3 rounded-xl border border-panel-line bg-panel/60 px-6 py-12 text-center" style={{ "--hud-color": "#FCD34D" }}>
            <Sparkles className="h-8 w-8 text-reward-gold" strokeWidth={1.8} />
            <p className="font-display text-lg font-bold text-ink-primary">
              {subjectName} Worlds Are Coming Soon
            </p>
            <p className="font-body text-sm text-ink-muted">
              This subject&rsquo;s world map hasn&rsquo;t been released yet â€” check back later
              or pick another subject from the catalog.
            </p>
            <Link
              to="/subjects"
              className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-panel-line px-4 py-2 font-mono text-xs uppercase tracking-widest text-neon-cyan transition hover:border-neon-cyan"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Choose a Subject
            </Link>
          </div>
        )}

        {courseData && worlds.length > 0 && (
          <>
            <div
              className="absolute left-1/2 top-0 z-0 hidden h-full w-px -translate-x-1/2 sm:block"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to bottom, #2A2E5699 0, #2A2E5699 6px, transparent 6px, transparent 12px)",
              }}
            />

            <div className="space-y-10 sm:space-y-4">
              {worlds.map((world, i) => (
                <WorldNode
                  key={world.id}
                  world={world}
                  index={i}
                  accent={world.isFinal ? FINAL_ACCENT : NODE_ACCENTS[i % NODE_ACCENTS.length]}
                  align={world.isFinal ? "center" : i % 2 === 0 ? "left" : "right"}
                  onEnter={handleEnterWorld}
                  isLast={i === worlds.length - 1}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Summary footer */}
      <div className="relative mx-auto mt-16 max-w-md px-6 text-center lg:px-8">
        <div className="hud-frame inline-flex items-center gap-6 rounded-xl border border-panel-line bg-panel/60 px-8 py-4" style={{ "--hud-color": "#38D9F4" }}>
          <div className="flex items-center gap-2 font-mono text-sm text-ink-primary">
            <Sparkles className="h-4 w-4 text-neon-cyan" /> {totalXp} XP earned
          </div>
          <div className="h-6 w-px bg-panel-line" />
          <div className="flex items-center gap-2 font-mono text-sm text-ink-primary">
            <Star className="h-4 w-4 text-reward-gold" /> {totalStars} Stars
          </div>
        </div>
      </div>

      <GameNav active="world" grade={grade ?? "9"} board={board ?? "CBSE"} subject={activeSubject} />
    </div>
  );
}
