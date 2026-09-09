import { useNavigate } from "react-router-dom";
import * as Icons from "lucide-react";
import { GraduationCap, Swords } from "lucide-react";
import ParticleField from "../components/ParticleField.jsx";
import { CLASSES } from "../data/content.js";
import { getSelectedSubject } from "../store/selectedSubject.js";

// One accent per class, roughly ordered cool â†’ warm as classes progress
// (Class 4 = green ... Class 12 = purple). Cycles via index % length if
// CLASSES ever has more entries than this.
const CARD_ACCENTS = [
  "#39D67A", // 4
  "#38D9F4", // 5
  "#3B9EFF", // 6
  "#6C7BFF", // 7
  "#806BFF", // 8
  "#B75CF6", // 9
  "#FF6FB0", // 10
  "#FF8A3D", // 11
  "#FCD34D", // 12
];

function ClassCard({ cls, accent, onSelect }) {
  const Icon = Icons[cls.icon] ?? Icons.GraduationCap;

  return (
    <div
      className="hud-frame group relative flex flex-col rounded-xl border border-panel-line bg-panel/60 p-6 transition-all duration-300 hover:-translate-y-1"
      style={{ "--hud-color": accent }}
    >
      <div
        className="mb-5 inline-flex h-14 w-14 items-center justify-center self-start rounded-lg border"
        style={{ borderColor: `${accent}55`, background: `${accent}14` }}
      >
        <Icon className="h-7 w-7" style={{ color: accent }} strokeWidth={1.7} />
      </div>

      <h3 className="font-display text-2xl font-bold uppercase tracking-wide text-ink-primary">
        Class {cls.grade}
      </h3>
      <p className="mt-1 font-body text-sm text-ink-muted">Learning Adventure</p>

      <dl className="mt-5 space-y-2 font-mono text-xs">
        <div className="flex justify-between border-b border-panel-line/60 py-1.5">
          <dt className="text-ink-faint">Courses</dt>
          <dd className="text-ink-primary">{cls.courses}</dd>
        </div>
        <div className="flex justify-between border-b border-panel-line/60 py-1.5">
          <dt className="text-ink-faint">Lessons</dt>
          <dd className="text-ink-primary">{cls.lessons}</dd>
        </div>
        <div className="flex justify-between border-b border-panel-line/60 py-1.5">
          <dt className="text-ink-faint">Questions</dt>
          <dd className="text-ink-primary">{cls.questions}</dd>
        </div>
        <div className="flex justify-between py-1.5">
          <dt className="text-ink-faint">Difficulty</dt>
          <dd style={{ color: accent }}>{cls.difficulty}</dd>
        </div>
      </dl>

      <button
        type="button"
        onClick={() => onSelect(cls.grade)}
        className="group/btn mt-6 flex items-center justify-center gap-2 rounded-xl py-3 font-display text-sm font-bold uppercase tracking-wider text-void transition-transform hover:scale-[1.02]"
        style={{ background: accent }}
      >
        <Swords className="h-4 w-4 transition-transform group-hover/btn:-rotate-12" />
        Start Adventure
      </button>
    </div>
  );
}

export default function ClassSelectionPage() {
  const navigate = useNavigate();

  function handleSelect(grade) {
    // Board Selection (Section 7) reads the chosen class from the route â€”
    // curriculum content is keyed on Class + Board together per Section 8,
    // so nothing loads until both are picked. A subject picked on /subjects
    // earlier carries through so the eventual /world stays on that subject.
    const pendingSubject = getSelectedSubject();
    navigate(
      `/select-board?class=${grade}${pendingSubject ? `&subject=${encodeURIComponent(pendingSubject)}` : ""}`
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
            Step 1 of 2 &middot; Onboarding
          </span>
          <h1 className="mt-3 font-display text-4xl font-bold uppercase tracking-wide text-ink-primary sm:text-5xl">
            Choose Your <span className="text-neon-green">Class</span>
          </h1>
          <p className="mt-4 font-body text-ink-muted">
            Every world, lesson, and question ahead is built for your class.
            Pick where your adventure begins.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CLASSES.map((cls, i) => (
            <ClassCard
              key={cls.grade}
              cls={cls}
              accent={CARD_ACCENTS[i % CARD_ACCENTS.length]}
              onSelect={handleSelect}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
