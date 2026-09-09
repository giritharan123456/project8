import * as Icons from "lucide-react";
import { GraduationCap, Lock, Sparkles } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import ParticleField from "../components/ParticleField.jsx";
import { getSubjectsFor } from "../data/subjectCatalog.js";
import { setSelectedSubject, clearSelectedSubject } from "../store/selectedSubject.js";
import { useAuth } from "../context/AuthContext.jsx";

// Defaults the content pages already fall back to when class/board are
// missing â€” kept in sync with server/src/lib/gameLogic.js DEFAULT_GRADE /
// DEFAULT_BOARD so a post-auth redirect lands on a valid world map.
const DEFAULT_GRADE = "9";
const DEFAULT_BOARD = "CBSE";

function SubjectCard({ subject, onSelect }) {
  const Icon = Icons[subject.icon] ?? Icons.GraduationCap;
  const accent = subject.accent;

  return (
    <button
      type="button"
      onClick={() => onSelect(subject)}
      className="hud-frame group flex min-w-0 flex-col items-start overflow-hidden rounded-xl border border-panel-line bg-panel/60 p-6 text-left transition-all duration-300 hover:-translate-y-1"
      style={{ "--hud-color": accent }}
    >
      <div className="mb-5 inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border transition-colors group-hover:scale-105"
        style={{ borderColor: `${accent}55`, background: `${accent}14` }}
      >
        <Icon className="h-7 w-7" style={{ color: accent }} strokeWidth={1.7} />
      </div>

      <div className="flex w-full min-w-0 items-start justify-between gap-2">
        <h3 className="min-w-0 break-words font-display text-xl font-bold leading-tight uppercase tracking-wide text-ink-primary">
          {subject.name}
        </h3>
        {subject.status === "available" ? (
          <span
            className="shrink-0 rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest"
            style={{ color: accent, border: `1px solid ${accent}55`, background: `${accent}12` }}
          >
            Available
          </span>
        ) : (
          <span className="flex shrink-0 items-center gap-1 rounded-full border border-panel-line px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-ink-faint">
            <Lock className="h-3 w-3" /> Soon
          </span>
        )}
      </div>

      <p className="mt-2 min-w-0 break-words font-body text-sm text-ink-muted">{subject.tagline}</p>

      <span className="mt-5 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest transition-colors group-hover:text-neon-cyan"
        style={{ color: accent }}
      >
        Start Learning <Sparkles className="h-3.5 w-3.5" />
      </span>
    </button>
  );
}

export default function SubjectsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  // Optional class/board carried in by the world map's "Switch Subject"
  // link so a signed-in player keeps their current curriculum context; the
  // defaults match the server's DEFAULT_GRADE / DEFAULT_BOARD.
  const grade = searchParams.get("class") || DEFAULT_GRADE;
  const board = searchParams.get("board") || DEFAULT_BOARD;
  // Only meaningful for grade 11/12 (senior secondary streams); ignored by
  // getSubjectsFor otherwise.
  const stream = searchParams.get("stream");

  const subjects = getSubjectsFor(board, grade, stream);

  function handleSelect(subject) {
    // "Latest selection wins" â€” overwrite whatever was stored before.
    setSelectedSubject(subject.code);
    if (user) {
      // Already signed in â€” skip the login detour and go straight to the
      // subject's world map (still behind the same ProtectedRoute gate).
      // The pending selection was consumed here, so it won't be re-applied
      // on a future sign-in.
      clearSelectedSubject();
      navigate(
        `/world?class=${grade}&board=${board}&subject=${encodeURIComponent(subject.code)}`
      );
      return;
    }
    navigate("/login");
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-void px-6 py-16 lg:px-8">
      <div className="absolute inset-0 bg-radial-fade" />
      <div className="aurora-canvas pointer-events-none absolute inset-0" aria-hidden="true" />
      <ParticleField density={30} />

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-center gap-2">
          <GraduationCap className="h-6 w-6 text-neon-cyan" strokeWidth={2.2} />
          <Link to="/" className="font-wordmark text-base tracking-wide text-ink-primary">
            LEARN<span className="text-neon-cyan">QUEST</span>
          </Link>
        </div>

        <div className="mb-12 text-center">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-neon-cyan">
            Pick Your Path
          </span>
          <h1 className="mt-3 font-display text-4xl font-bold uppercase tracking-wide text-ink-primary sm:text-5xl">
            Choose Your <span className="text-arcane-purple">Subject</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl font-body text-ink-muted">
            Select a subject to begin your quest. Sign in or create an account,
            and you&rsquo;ll land right on that subject&rsquo;s world map.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <SubjectCard key={subject.code} subject={subject} onSelect={handleSelect} />
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-4 text-center">
          <span className="font-body text-sm text-ink-muted">
            Already have an account?{" "}
            <Link to="/login" className="font-mono text-xs uppercase tracking-widest text-neon-cyan underline">
              Sign in
            </Link>
          </span>
          <span className="hidden h-4 w-px bg-panel-line sm:block" />
          <span className="font-body text-sm text-ink-muted">
            New here?{" "}
            <Link to="/sign-up" className="font-mono text-xs uppercase tracking-widest text-arcane-purple underline">
              Create an account
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}