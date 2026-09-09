import { useMemo } from "react";
import { useNavigate, useParams, useSearchParams, Link } from "react-router-dom";
import * as Icons from "lucide-react";
import {
  GraduationCap,
  ChevronLeft,
  Lock,
  CheckCircle2,
  Play,
  Star,
  Sparkles,
  Skull,
} from "lucide-react";
import ParticleField from "../components/ParticleField.jsx";
import ThemeToggle from "../components/ThemeToggle.jsx";
import { getCourseDetail } from "../data/content.js";
import { getCourseDetailLive } from "../store/playerStore.js";

const ACCENT = "#806BFF";

function StarRow({ stars, size = "h-3.5 w-3.5" }) {
  return (
    <div className="flex gap-0.5">
      {[0, 1, 2].map((i) => (
        <Star
          key={i}
          className={size}
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

function LessonRow({ lesson, index, onEnter }) {
  const locked = lesson.status === "locked";
  const completed = lesson.status === "completed";

  return (
    <div
      className={`hud-frame flex items-center gap-4 rounded-xl border bg-panel/60 p-4 transition-all duration-300 sm:gap-5 sm:p-5 ${
        locked ? "border-panel-line opacity-60" : "border-panel-line hover:-translate-y-0.5"
      }`}
      style={{ "--hud-color": locked ? "#3A3E68" : ACCENT }}
    >
      <div
        className="flex h-11 w-11 flex-none items-center justify-center rounded-lg border font-display text-sm font-bold sm:h-12 sm:w-12"
        style={{
          borderColor: locked ? "#3A3E6688" : `${ACCENT}66`,
          background: locked ? "transparent" : `${ACCENT}14`,
          color: locked ? "#6B6088" : ACCENT,
        }}
      >
        {locked ? <Lock className="h-4 w-4" /> : String(index + 1).padStart(2, "0")}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3
            className={`truncate font-display text-base font-bold sm:text-lg ${
              locked ? "text-ink-faint" : "text-ink-primary"
            }`}
          >
            {lesson.title}
          </h3>
          {completed && <CheckCircle2 className="h-4 w-4 flex-none text-neon-green" />}
        </div>
        <p className="mt-0.5 truncate font-body text-xs text-ink-muted sm:text-sm">
          {lesson.description}
        </p>

        {!locked && (
          <div className="mt-2 flex items-center gap-3">
            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-panel-line sm:w-32">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${completed ? 100 : lesson.progress}%`,
                  background: ACCENT,
                }}
              />
            </div>
            <span className="font-mono text-[10px] text-ink-faint">
              {completed ? "100%" : `${lesson.progress}%`}
            </span>
            <StarRow stars={lesson.stars} />
          </div>
        )}
      </div>

      <div className="flex flex-none flex-col items-end gap-2">
        {!locked && (
          <span className="flex items-center gap-1 font-mono text-xs text-reward-gold">
            <Sparkles className="h-3.5 w-3.5" /> {lesson.xp || "up to 100"} XP
          </span>
        )}
        <button
          type="button"
          disabled={locked}
          onClick={() => onEnter(lesson)}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2 font-display text-xs font-bold uppercase tracking-wider transition-transform ${
            locked
              ? "cursor-not-allowed bg-panel-line/40 text-ink-faint"
              : "text-void hover:scale-[1.03]"
          }`}
          style={locked ? {} : { background: ACCENT }}
        >
          {locked ? (
            <>
              <Lock className="h-3.5 w-3.5" /> Locked
            </>
          ) : completed ? (
            "Replay"
          ) : (
            <>
              <Play className="h-3.5 w-3.5" /> Play
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function BossCard({ world, status, onEnter }) {
  const locked = status === "locked";
  const defeated = status === "defeated";
  const color = "#FCD34D";

  return (
    <div
      className="hud-frame relative mt-4 overflow-hidden rounded-xl border p-6 sm:p-7"
      style={{
        "--hud-color": color,
        borderColor: locked ? "#2A2E56" : `${color}66`,
        background: locked
          ? "rgba(18,20,42,0.6)"
          : "linear-gradient(135deg, rgba(255,201,77,0.12), rgba(18,20,42,0.7))",
      }}
    >
      <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div
            className="flex h-14 w-14 flex-none items-center justify-center rounded-lg border"
            style={{
              borderColor: locked ? "#3A3E6688" : `${color}66`,
              background: locked ? "transparent" : `${color}14`,
            }}
          >
            {locked ? (
              <Lock className="h-6 w-6 text-ink-faint" />
            ) : (
              <Skull className="h-7 w-7" style={{ color }} strokeWidth={1.7} />
            )}
          </div>
          <div>
            <span
              className="font-mono text-[10px] uppercase tracking-widest"
              style={{ color: locked ? "#6B6088" : color }}
            >
              Chapter Boss
            </span>
            <h3
              className={`font-display text-xl font-bold uppercase tracking-wide sm:text-2xl ${
                locked ? "text-ink-faint" : "text-ink-primary"
              }`}
            >
              {world.boss}
            </h3>
            <p className="mt-1 font-body text-xs text-ink-muted sm:text-sm">
              {defeated
                ? "Defeated â€” replay for a better score."
                : locked
                ? "Clear every lesson above to unlock this battle."
                : "All lessons cleared. The boss is ready for you."}
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={locked}
          onClick={() => onEnter()}
          className={`flex flex-none items-center gap-2 rounded-xl px-6 py-3 font-display text-sm font-bold uppercase tracking-wider transition-transform ${
            locked
              ? "cursor-not-allowed bg-panel-line/40 text-ink-faint"
              : "text-void hover:scale-[1.03]"
          }`}
          style={locked ? {} : { background: color }}
        >
          {locked ? (
            <>
              <Lock className="h-4 w-4" /> Locked
            </>
          ) : defeated ? (
            "Battle Again"
          ) : (
            <>
              <Skull className="h-4 w-4" /> Start Boss Battle
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default function CourseDetailPage() {
  const navigate = useNavigate();
  const { worldId } = useParams();
  const [searchParams] = useSearchParams();
  const grade = searchParams.get("class");
  const board = searchParams.get("board");
  const subject = searchParams.get("subject");

  const detail = useMemo(
    () => getCourseDetailLive(grade, board, worldId, subject),
    [grade, board, worldId, subject]
  );

  if (!detail) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-void px-6 text-center">
        <div className="hud-frame rounded-xl border border-panel-line bg-panel/60 p-8" style={{ "--hud-color": "#FCD34D" }}>
          <p className="font-display text-xl text-ink-primary">World not found</p>
          <p className="mt-2 font-body text-sm text-ink-muted">
            That world doesn't exist for this curriculum.
          </p>
          <Link
            to={`/world?class=${grade ?? ""}&board=${board ?? ""}${subject ? `&subject=${encodeURIComponent(subject)}` : ""}`}
            className="mt-5 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-neon-cyan underline"
          >
            <ChevronLeft className="h-4 w-4" /> Back to World Map
          </Link>
        </div>
      </div>
    );
  }

  const { world, lessons, bossStatus } = detail;
  const WorldIcon = Icons[world.icon] ?? Icons.MapPin;

  function handleEnterLesson(lesson) {
    // Difficulty Select (Section 13) reads worldId/lessonId off this route
    // to know which lesson's four tiers to show.
    navigate(
      `/play/${worldId}/${lesson.id}?class=${grade ?? ""}&board=${board ?? ""}${subject ? `&subject=${encodeURIComponent(subject)}` : ""}`
    );
  }

  function handleEnterBoss() {
    // Boss Battle (Section 21) â€” same routing pattern as lessons, just
    // without a lessonId, since a boss fight isn't tied to one lesson.
    navigate(`/boss/${worldId}?class=${grade ?? ""}&board=${board ?? ""}${subject ? `&subject=${encodeURIComponent(subject)}` : ""}`);
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
            to={`/world?class=${grade ?? ""}&board=${board ?? ""}${subject ? `&subject=${encodeURIComponent(subject)}` : ""}`}
            className="flex items-center gap-2 text-ink-muted hover:text-ink-primary"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="font-mono text-xs uppercase tracking-widest">World Map</span>
          </Link>

          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-neon-cyan" strokeWidth={2.2} />
            <span className="font-wordmark text-sm tracking-wide text-ink-primary">
              Learn<span className="text-neon-cyan">Quest</span>
            </span>
          </div>

          <span className="hidden rounded-full border border-panel-line px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-ink-muted sm:inline-block">
            Class {grade ?? "?"} &middot; {board ?? "?"}
          </span>
          <ThemeToggle />
        </div>
      </div>

      {/* World hero card */}
      <div className="relative mx-auto mt-10 max-w-4xl px-6 lg:px-8">
        <div
          className="hud-frame rounded-xl border border-panel-line bg-panel/60 p-6 sm:p-8"
          style={{ "--hud-color": ACCENT }}
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div
                className="flex h-16 w-16 flex-none items-center justify-center rounded-xl border"
                style={{ borderColor: `${ACCENT}55`, background: `${ACCENT}14` }}
              >
                <WorldIcon className="h-8 w-8" style={{ color: ACCENT }} strokeWidth={1.7} />
              </div>
              <div>
                <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-neon-green">
                  World &middot; {world.topic}
                </span>
                <h1 className="mt-1 font-display text-3xl font-bold uppercase tracking-wide text-ink-primary sm:text-4xl">
                  {world.name}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-6 font-mono text-sm">
              <div className="text-center">
                <StarRow stars={world.stars} size="h-4 w-4" />
                <p className="mt-1 text-[10px] uppercase tracking-widest text-ink-faint">Stars</p>
              </div>
              <div className="text-center">
                <p className="flex items-center gap-1 text-reward-gold">
                  <Sparkles className="h-4 w-4" /> {world.xp}
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-widest text-ink-faint">XP</p>
              </div>
              <div className="text-center">
                <p className="text-ink-primary">
                  {world.status === "completed" ? "100%" : `${world.progress}%`}
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-widest text-ink-faint">
                  Progress
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-panel-line">
            <div
              className="h-full rounded-full"
              style={{
                width: `${world.status === "completed" ? 100 : world.progress}%`,
                background: ACCENT,
              }}
            />
          </div>
        </div>
      </div>

      {/* Lesson list */}
      <div className="relative mx-auto mt-10 max-w-4xl px-6 lg:px-8">
        <h2 className="mb-4 font-display text-lg font-semibold uppercase tracking-wide text-ink-primary">
          Lessons
        </h2>
        <div className="space-y-3">
          {lessons.map((lesson, i) => (
            <LessonRow key={lesson.id} lesson={lesson} index={i} onEnter={handleEnterLesson} />
          ))}
        </div>

        <BossCard world={world} status={bossStatus} onEnter={handleEnterBoss} />
      </div>
    </div>
  );
}
