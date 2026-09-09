import { useMemo } from "react";
import { useNavigate, useParams, useSearchParams, Link } from "react-router-dom";
import * as Icons from "lucide-react";
import {
  GraduationCap,
  ChevronLeft,
  Lock,
  CheckCircle2,
  Play,
  Sparkles,
  Coins,
  Zap,
  Target,
  Flame,
  Crown,
} from "lucide-react";
import ParticleField from "../components/ParticleField.jsx";
import ThemeToggle from "../components/ThemeToggle.jsx";
import { DIFFICULTY_ACCENTS } from "../data/content.js";
import { getDifficultyProgressLive } from "../store/playerStore.js";

const TIER_ICONS = { easy: Target, medium: Zap, hard: Flame, expert: Crown };

function DifficultyCard({ difficulty, onEnter }) {
  const locked = difficulty.status === "locked";
  const completed = difficulty.status === "completed";
  const color = locked ? "#3A3E68" : DIFFICULTY_ACCENTS[difficulty.id];
  const Icon = TIER_ICONS[difficulty.id] ?? Icons.Circle;
  const clearedNext =
    difficulty.unlockThreshold == null || difficulty.bestScore >= difficulty.unlockThreshold;

  return (
    <div
      className={`hud-frame relative flex flex-col rounded-xl border bg-panel/60 p-6 transition-all duration-300 ${
        locked ? "border-panel-line opacity-60" : "border-panel-line hover:-translate-y-1"
      }`}
      style={{ "--hud-color": color }}
    >
      <div className="flex items-start justify-between">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-lg border"
          style={{
            borderColor: locked ? "#3A3E6688" : `${color}66`,
            background: locked ? "transparent" : `${color}14`,
          }}
        >
          {locked ? (
            <Lock className="h-6 w-6 text-ink-faint" strokeWidth={1.8} />
          ) : (
            <Icon className="h-7 w-7" style={{ color }} strokeWidth={1.7} />
          )}
        </div>
        {completed && (
          <span
            className="flex items-center gap-1 font-mono text-[11px]"
            style={{ color: clearedNext ? "#4ADE80" : "#FCD34D" }}
          >
            <CheckCircle2 className="h-3.5 w-3.5" /> {difficulty.bestScore}%
          </span>
        )}
      </div>

      <h3
        className={`mt-4 font-display text-xl font-bold uppercase tracking-wide ${
          locked ? "text-ink-faint" : "text-ink-primary"
        }`}
      >
        {difficulty.label}
      </h3>
      <p className="mt-1 font-body text-sm text-ink-muted">{difficulty.description}</p>

      <div className="mt-4 flex items-center gap-4 font-mono text-xs">
        <span className="flex items-center gap-1 text-reward-gold">
          <Sparkles className="h-3.5 w-3.5" /> +{difficulty.xp} XP
        </span>
        <span className="flex items-center gap-1 text-reward-gold/80">
          <Coins className="h-3.5 w-3.5" /> +{difficulty.coins}
        </span>
      </div>

      {locked ? (
        <p className="mt-4 font-mono text-[11px] leading-relaxed text-ink-faint">
          Score the required % on the previous tier to unlock this one.
        </p>
      ) : (
        difficulty.unlockThreshold != null && (
          <p className="mt-4 font-mono text-[11px] text-ink-faint">
            Score {difficulty.unlockThreshold}%+ here to unlock the next tier.
          </p>
        )
      )}

      <button
        type="button"
        disabled={locked}
        onClick={() => onEnter(difficulty)}
        className={`group/btn mt-5 flex items-center justify-center gap-1.5 rounded-xl py-2.5 font-display text-sm font-bold uppercase tracking-wider transition-transform ${
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
            <Play className="h-4 w-4" /> Replay
          </>
        ) : (
          <>
            <Play className="h-4 w-4" /> Start
          </>
        )}
      </button>
    </div>
  );
}

export default function DifficultySelectPage() {
  const navigate = useNavigate();
  const { worldId, lessonId } = useParams();
  const [searchParams] = useSearchParams();
  const grade = searchParams.get("class");
  const board = searchParams.get("board");
  const subject = searchParams.get("subject");

  const detail = useMemo(
    () => getDifficultyProgressLive(grade, board, worldId, lessonId, subject),
    [grade, board, worldId, lessonId, subject]
  );

  if (!detail) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-void px-6 text-center">
        <div
          className="hud-frame rounded-xl border border-panel-line bg-panel/60 p-8"
          style={{ "--hud-color": "#FCD34D" }}
        >
          <p className="font-display text-xl text-ink-primary">Lesson not found</p>
          <p className="mt-2 font-body text-sm text-ink-muted">
            That lesson doesn't exist for this curriculum.
          </p>
          <Link
            to={`/course/${worldId}?class=${grade ?? ""}&board=${board ?? ""}${subject ? `&subject=${encodeURIComponent(subject)}` : ""}`}
            className="mt-5 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-neon-cyan underline"
          >
            <ChevronLeft className="h-4 w-4" /> Back to World
          </Link>
        </div>
      </div>
    );
  }

  const { world, lesson, difficulties } = detail;
  const WorldIcon = Icons[world.icon] ?? Icons.MapPin;

  if (lesson.status === "locked") {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-void px-6 text-center">
        <div
          className="hud-frame rounded-xl border border-panel-line bg-panel/60 p-8"
          style={{ "--hud-color": "#FCD34D" }}
        >
          <Lock className="mx-auto h-8 w-8 text-ink-faint" />
          <p className="mt-3 font-display text-xl text-ink-primary">Lesson Locked</p>
          <p className="mt-2 max-w-xs font-body text-sm text-ink-muted">
            Clear the lessons before this one in {world.name} to unlock it.
          </p>
          <Link
            to={`/course/${worldId}?class=${grade ?? ""}&board=${board ?? ""}${subject ? `&subject=${encodeURIComponent(subject)}` : ""}`}
            className="mt-5 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-neon-cyan underline"
          >
            <ChevronLeft className="h-4 w-4" /> Back to World
          </Link>
        </div>
      </div>
    );
  }

  function handleEnterDifficulty(difficulty) {
    // Battle screen (Section 14) reads class/board/world/lesson/difficulty
    // off the route to load the right question set (Section 15) and apply
    // the right XP/coin rewards (Section 19) and lives (Section 17).
    navigate(
      `/battle/${worldId}/${lessonId}/${difficulty.id}?class=${grade ?? ""}&board=${board ?? ""}${subject ? `&subject=${encodeURIComponent(subject)}` : ""}`
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-void pb-24">
      <div className="absolute inset-0 bg-radial-fade" />
      <div className="aurora-canvas pointer-events-none absolute inset-0" aria-hidden="true" />
      <ParticleField density={22} />

      {/* Top bar */}
      <div className="relative border-b border-panel-line/70 bg-void/70 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-6 py-4 lg:px-8">
          <Link
            to={`/course/${worldId}?class=${grade ?? ""}&board=${board ?? ""}${subject ? `&subject=${encodeURIComponent(subject)}` : ""}`}
            className="flex items-center gap-2 text-ink-muted hover:text-ink-primary"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="font-mono text-xs uppercase tracking-widest">{world.name}</span>
          </Link>

          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-neon-cyan" strokeWidth={2.2} />
            <span className="font-wordmark text-sm tracking-wide text-ink-primary">
              LEARN<span className="text-neon-cyan">QUEST</span>
            </span>
          </div>

          <span className="hidden rounded-full border border-panel-line px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-ink-muted sm:inline-block">
            Class {grade ?? "?"} &middot; {board ?? "?"}
          </span>
          <ThemeToggle />
        </div>
      </div>

      {/* Lesson header */}
      <div className="relative mx-auto mt-10 max-w-4xl px-6 text-center lg:px-8">
        <div className="mx-auto flex items-center justify-center gap-2">
          <WorldIcon className="h-5 w-5 text-arcane-purple" strokeWidth={2} />
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-ink-faint">
            {world.name}
          </span>
        </div>
        <h1 className="mt-3 font-display text-4xl font-bold uppercase tracking-wide text-ink-primary sm:text-5xl">
          {lesson.title}
        </h1>
        <p className="mx-auto mt-3 max-w-lg font-body text-ink-muted">{lesson.description}</p>
        <p className="mt-5 font-mono text-xs uppercase tracking-[0.25em] text-neon-cyan">
          Choose Your Difficulty
        </p>
      </div>

      {/* Difficulty grid */}
      <div className="relative mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-6 px-6 sm:grid-cols-2 lg:px-8">
        {difficulties.map((difficulty) => (
          <DifficultyCard
            key={difficulty.id}
            difficulty={difficulty}
            onEnter={handleEnterDifficulty}
          />
        ))}
      </div>
    </div>
  );
}
