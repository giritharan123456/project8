import { useNavigate, useSearchParams, Link } from "react-router-dom";

import * as Icons from "lucide-react";
import { GraduationCap, ChevronRight } from "lucide-react";
import ParticleField from "../components/ParticleField.jsx";
import { BOARD_CATEGORIES } from "../data/content.js";
import { getSelectedSubject } from "../store/selectedSubject.js";
const CATEGORY_ACCENTS = {
  "Central Boards": "#806BFF",
  "State Boards": "#4ADE80",
  "International Boards": "#38D9F4",
};

function BoardCard({ board, accent, onSelect }) {
  const Icon = Icons[board.icon] ?? Icons.Landmark;

  return (
    <div
      className="hud-frame group relative flex flex-col rounded-xl border border-panel-line bg-panel/60 p-6 transition-all duration-300 hover:-translate-y-1"
      style={{ "--hud-color": accent }}
    >
      <div className="flex items-start justify-between">
        <div
          className="inline-flex h-12 w-12 items-center justify-center rounded-lg border"
          style={{ borderColor: `${accent}55`, background: `${accent}14` }}
        >
          <Icon className="h-6 w-6" style={{ color: accent }} strokeWidth={1.7} />
        </div>
        <span
          className="rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest"
          style={{ borderColor: `${accent}55`, color: accent }}
        >
          {board.type}
        </span>
      </div>

      <h3 className="mt-4 font-display text-xl font-bold text-ink-primary">
        {board.name}
      </h3>
      <p className="mt-1.5 font-body text-sm leading-relaxed text-ink-muted">
        {board.description}
      </p>

      <div className="mt-4 flex gap-5 font-mono text-xs text-ink-faint">
        <span>
          <span className="text-ink-primary">{board.courses}</span> Courses
        </span>
        <span>
          <span className="text-ink-primary">{board.lessons}</span> Lessons
        </span>
      </div>

      <button
        type="button"
        onClick={() => onSelect(board.code)}
        className="group/btn mt-5 flex items-center justify-center gap-1.5 rounded-xl border py-2.5 font-display text-sm font-bold uppercase tracking-wider transition-colors"
        style={{ borderColor: accent, color: accent }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = accent;
          e.currentTarget.style.color = "#0A0B14";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = accent;
        }}
      >
        Select Board
        <ChevronRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
      </button>
    </div>
  );
}

export default function BoardSelectionPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const grade = searchParams.get("class");

  function handleSelect(boardCode) {
    // Class + Board together key the entire curriculum (Section 8) â€” the
    // world map (Section 10) reads both off the route. A subject picked on
    // /subjects (or passed in from the world map's "Switch Board" link)
    // carries through so the world map stays scoped to it.
    const subjectParam = searchParams.get("subject") || getSelectedSubject();
    navigate(
      `/world?class=${grade}&board=${boardCode}${subjectParam ? `&subject=${encodeURIComponent(subjectParam)}` : ""}`
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-void px-6 py-16 lg:px-8">
      <div className="absolute inset-0 bg-radial-fade" />
      <div className="aurora-canvas pointer-events-none absolute inset-0" aria-hidden="true" />
      <ParticleField density={30} />

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-4 flex items-center justify-center gap-2">
          <GraduationCap className="h-6 w-6 text-neon-cyan" strokeWidth={2.2} />
          <span className="font-wordmark text-base tracking-wide text-ink-primary">
            LEARN<span className="text-neon-cyan">QUEST</span>
          </span>
        </div>

        <div className="mx-auto max-w-xl text-center">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-neon-cyan">
            Step 2 of 2 &middot; Onboarding
          </span>
          <h1 className="mt-3 font-display text-4xl font-bold uppercase tracking-wide text-ink-primary sm:text-5xl">
            Choose Your <span className="text-neon-green">Board</span>
          </h1>
          <p className="mt-4 font-body text-ink-muted">
            {grade ? (
              <>
                For <span className="text-ink-primary">Class {grade}</span> â€”
                pick the board your syllabus follows.
              </>
            ) : (
              "Pick the board your syllabus follows."
            )}
          </p>
          {!grade && (
            <p className="mt-2 font-mono text-xs text-reward-gold">
              No class selected â€”{" "}
              <Link to="/select-class" className="underline">
                choose your class first
              </Link>
              .
            </p>
          )}
        </div>

        <div className="mt-14 space-y-12">
          {BOARD_CATEGORIES.map((cat) => (
            <div key={cat.category}>
              <div className="mb-5 flex items-center gap-3">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: CATEGORY_ACCENTS[cat.category] }}
                />
                <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-ink-primary">
                  {cat.category}
                </h2>
                <div className="h-px flex-1 bg-panel-line" />
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {cat.boards.map((board) => (
                  <BoardCard
                    key={board.code}
                    board={board}
                    accent={CATEGORY_ACCENTS[cat.category]}
                    onSelect={handleSelect}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
