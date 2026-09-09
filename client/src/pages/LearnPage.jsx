import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import * as Icons from "lucide-react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Lightbulb,
  CheckCircle2,
  Target,
  Brain,
  Sparkles,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import ParticleField from "../components/ParticleField.jsx";
import {
  WORLD_TEMPLATES_BY_SUBJECT,
  LESSONS_BY_WORLD,
  DIFFICULTIES,
} from "../data/content.js";
import { getSubjectName } from "../data/subjectCatalog.js";
import { usePlayerState } from "../store/playerStore.js";

const SUBJECTS = [
  { code: "CHEM", name: "Chemistry", icon: "GraduationCap", color: "#4ADE80" },
  { code: "MATH", name: "Mathematics", icon: "Calculator", color: "#38D9F4" },
  { code: "PHY", name: "Physics", icon: "Atom", color: "#806BFF" },
  { code: "BIO", name: "Biology", icon: "Microscope", color: "#FCD34D" },
  { code: "ENG", name: "English", icon: "BookOpen", color: "#38D9F4" },
  { code: "CS", name: "Computer Science", icon: "Cpu", color: "#806BFF" },
];

const MOCK_LEARNING_CONTENT = {
  "l1": {
    title: "Introduction",
    sections: [
      {
        heading: "Key Concept",
        content: "This lesson introduces the fundamental building blocks of the topic. Understanding these basics is essential for all advanced concepts that follow.",
        type: "text",
      },
      {
        heading: "Important Points",
        points: [
          "Every concept has a core definition you must memorize",
          "Real-world examples help anchor abstract ideas",
          "Practice identifying these concepts in different contexts",
          "Build connections between this lesson and previous topics",
        ],
        type: "keypoints",
      },
      {
        heading: "Worked Example",
        example: {
          question: "If an atom has 6 protons and 8 neutrons, what is its mass number?",
          solution: "Mass number = Protons + Neutrons = 6 + 8 = 14. The element is Carbon-14.",
          steps: ["Identify the number of protons: 6", "Identify the number of neutrons: 8", "Add them together: 6 + 8 = 14"],
        },
        type: "example",
      },
      {
        heading: "Flashcard Terms",
        flashcards: [
          { front: "Mass Number", back: "The total number of protons and neutrons in an atom's nucleus" },
          { front: "Atomic Number", back: "The number of protons in an atom's nucleus" },
          { front: "Isotope", back: "Atoms of the same element with different numbers of neutrons" },
        ],
        type: "flashcards",
      },
    ],
  },
  "l2": {
    title: "Deep Dive",
    sections: [
      {
        heading: "Core Theory",
        content: "Building on the introduction, this lesson explores the deeper mechanisms. We examine how components interact and why certain patterns emerge consistently.",
        type: "text",
      },
      {
        heading: "Essential Points",
        points: [
          "The relationship between structure and function is key",
          "Memorize the main formulas and when to apply them",
          "Common mistakes: confusing similar concepts",
          "Always check units and significant figures",
        ],
        type: "keypoints",
      },
      {
        heading: "Practice Problem",
        example: {
          question: "Calculate the molar mass of water (H2O).",
          solution: "H = 1 g/mol, O = 16 g/mol. Molar mass = 2(1) + 16 = 18 g/mol.",
          steps: ["Look up atomic masses: H = 1, O = 16", "Count atoms: 2 H and 1 O", "Multiply and add: 2(1) + 16 = 18 g/mol"],
        },
        type: "example",
      },
    ],
  },
};

function SubjectCard({ subject, selected, onClick }) {
  const Icon = Icons[subject.icon] ?? Icons.BookOpen;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full min-w-0 flex-col items-center gap-3 overflow-hidden rounded-xl border p-5 text-center transition-all ${
        selected
          ? "border-neon-cyan/60 bg-neon-cyan/10"
          : "border-panel-line bg-panel/60 hover:border-arcane-purple/40"
      }`}
    >
      <div
        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border ${
          selected ? "border-neon-cyan/40 bg-neon-cyan/10" : "border-panel-line bg-panel-line/20"
        }`}
      >
        <Icon
          className={`h-7 w-7 ${selected ? "text-neon-cyan" : ""}`}
          style={{ color: selected ? undefined : subject.color }}
          strokeWidth={1.5}
        />
      </div>
      <span className={`w-full min-w-0 break-words font-display text-sm font-bold leading-snug ${selected ? "text-neon-cyan" : "text-ink-primary"}`}>
        {subject.name}
      </span>
    </button>
  );
}

function WorldCard({ world, status, onClick }) {
  const Icon = Icons[world.icon] ?? Icons.Map;
  return (
    <button
      type="button"
      onClick={status !== "locked" ? onClick : undefined}
      className={`flex items-center gap-4 rounded-xl border p-4 text-left transition-all ${
        status === "locked"
          ? "cursor-not-allowed border-panel-line/40 bg-panel/30 opacity-50"
          : "border-panel-line bg-panel/60 hover:border-arcane-purple/40"
      }`}
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-panel-line bg-panel-line/20">
        <Icon className="h-6 w-6 text-arcane-purple" strokeWidth={1.5} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-display text-sm font-bold text-ink-primary">{world.name}</p>
        <p className="truncate font-body text-xs text-ink-muted">{world.topic}</p>
      </div>
      {status === "locked" ? (
        <Icons.Lock className="h-4 w-4 text-ink-faint" />
      ) : (
        <ChevronRight className="h-4 w-4 text-ink-faint" />
      )}
    </button>
  );
}

function LessonItem({ lesson, index, expanded, onToggle }) {
  const content = MOCK_LEARNING_CONTENT[lesson.id] ?? MOCK_LEARNING_CONTENT["l1"];
  const hasContent = true;

  return (
    <div className="rounded-xl border border-panel-line bg-panel/60 overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-panel/80"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-arcane-purple/20 font-mono text-xs font-bold text-arcane-purple">
          {index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-display text-sm font-bold text-ink-primary">{lesson.title}</p>
          <p className="truncate font-body text-xs text-ink-muted">{lesson.description}</p>
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-ink-faint" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-ink-faint" />
        )}
      </button>

      {expanded && hasContent && (
        <div className="border-t border-panel-line px-4 pb-4 pt-3 space-y-4">
          {content.sections.map((section, i) => (
            <div key={i}>
              {section.type === "text" && (
                <div>
                  <h4 className="mb-1 font-display text-sm font-bold text-arcane-purple">{section.heading}</h4>
                  <p className="font-body text-sm leading-relaxed text-ink-muted">{section.content}</p>
                </div>
              )}
              {section.type === "keypoints" && (
                <div>
                  <h4 className="mb-2 font-display text-sm font-bold text-neon-cyan flex items-center gap-1.5">
                    <Lightbulb className="h-3.5 w-3.5" /> {section.heading}
                  </h4>
                  <ul className="space-y-1.5">
                    {section.points.map((point, j) => (
                      <li key={j} className="flex items-start gap-2 font-body text-sm text-ink-muted">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-neon-green" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {section.type === "example" && (
                <div>
                  <h4 className="mb-2 font-display text-sm font-bold text-reward-gold flex items-center gap-1.5">
                    <Brain className="h-3.5 w-3.5" /> {section.heading}
                  </h4>
                  <div className="rounded-lg border border-reward-gold/20 bg-reward-gold/5 p-3 space-y-2">
                    <p className="font-body text-sm font-medium text-ink-primary">{section.example.question}</p>
                    <div className="space-y-1">
                      {section.example.steps.map((step, j) => (
                        <p key={j} className="font-body text-xs text-ink-muted">
                          <span className="font-bold text-reward-gold">Step {j + 1}:</span> {step}
                        </p>
                      ))}
                    </div>
                    <p className="border-t border-reward-gold/20 pt-2 font-body text-sm text-neon-green">
                      {section.example.solution}
                    </p>
                  </div>
                </div>
              )}
              {section.type === "flashcards" && (
                <div>
                  <h4 className="mb-2 font-display text-sm font-bold text-arcane-purple flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5" /> {section.heading}
                  </h4>
                  <div className="space-y-2">
                    {section.flashcards.map((fc, j) => (
                      <FlashcardMini key={j} front={fc.front} back={fc.back} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          <div className="flex gap-3 pt-2">
            <Link
              to={`/practice?worldId=${lesson.worldId ?? "atom-valley"}&difficulty=easy${window.location.search.includes("class") ? `&${window.location.search.split("?")[1]}` : ""}`}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-panel-line py-2.5 font-display text-xs font-bold uppercase tracking-wider text-ink-muted transition-colors hover:border-neon-green hover:text-neon-green"
            >
              <Target className="h-3.5 w-3.5" /> Practice
            </Link>
            <Link
              to={`/test${window.location.search.includes("class") ? `?${window.location.search.split("?")[1]}` : ""}`}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-arcane-purple py-2.5 font-display text-xs font-bold uppercase tracking-wider text-void transition-transform hover:scale-[1.02]"
            >
              <Sparkles className="h-3.5 w-3.5" /> Quiz
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function FlashcardMini({ front, back }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setFlipped(!flipped)}
      className={`w-full rounded-lg border p-3 text-left transition-all ${
        flipped
          ? "border-arcane-purple/40 bg-arcane-purple/10"
          : "border-panel-line bg-panel/40"
      }`}
    >
      <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
        {flipped ? "Back" : "Front"}
      </p>
      <p className="mt-1 font-body text-sm text-ink-primary">
        {flipped ? back : front}
      </p>
    </button>
  );
}

export default function LearnPage() {
  const [searchParams] = useSearchParams();
  const grade = searchParams.get("class") ?? "9";
  const board = searchParams.get("board") ?? "CBSE";
  const subjectParam = searchParams.get("subject") ?? "CHEM";

  const [selectedSubject, setSelectedSubject] = useState(subjectParam);
  const [selectedWorld, setSelectedWorld] = useState(null);
  const [expandedLesson, setExpandedLesson] = useState(null);

  const worlds = useMemo(() => {
    const template = WORLD_TEMPLATES_BY_SUBJECT[selectedSubject] ?? WORLD_TEMPLATES_BY_SUBJECT.CHEM;
    return template.map((w, i) => ({
      ...w,
      status: i === 0 ? "unlocked" : i <= 2 ? "unlocked" : "locked",
    }));
  }, [selectedSubject]);

  const lessons = useMemo(() => {
    if (!selectedWorld) return [];
    return (LESSONS_BY_WORLD[selectedWorld] ?? []).map((l) => ({
      ...l,
      worldId: selectedWorld,
    }));
  }, [selectedWorld]);

  return (
    <div className="relative min-h-screen bg-void">
      <div className="absolute inset-0 bg-radial-fade" />
      <div className="aurora-canvas pointer-events-none absolute inset-0" aria-hidden="true" />
      <ParticleField density={12} />

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-8">
        <Link
          to={`/dashboard${window.location.search}`}
          className="mb-6 inline-flex items-center gap-1 font-display text-sm text-ink-muted hover:text-ink-primary"
        >
          <ChevronLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-ink-primary">
          Learn
        </h1>
        <p className="mt-2 font-body text-sm text-ink-muted">
          Study material, key concepts, and practice â€” all in one place.
        </p>

        {!selectedWorld ? (
          <div className="mt-8">
            <h2 className="mb-4 font-display text-lg font-bold text-ink-primary">Select a Subject</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {SUBJECTS.map((s) => (
                <SubjectCard
                  key={s.code}
                  subject={s}
                  selected={selectedSubject === s.code}
                  onClick={() => setSelectedSubject(s.code)}
                />
              ))}
            </div>

            <h2 className="mb-4 mt-8 font-display text-lg font-bold text-ink-primary">
              {SUBJECTS.find((s) => s.code === selectedSubject)?.name ?? "Subject"} â€” Worlds
            </h2>
            <div className="space-y-3">
              {worlds.map((world) => (
                <WorldCard
                  key={world.id}
                  world={world}
                  status={world.status}
                  onClick={() => setSelectedWorld(world.id)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-8">
            <button
              type="button"
              onClick={() => {
                setSelectedWorld(null);
                setExpandedLesson(null);
              }}
              className="mb-4 flex items-center gap-1 font-display text-sm text-ink-muted hover:text-ink-primary"
            >
              <ChevronLeft className="h-4 w-4" /> Back to Worlds
            </button>

            <h2 className="mb-1 font-display text-xl font-bold text-ink-primary">
              {worlds.find((w) => w.id === selectedWorld)?.name ?? "World"}
            </h2>
            <p className="mb-6 font-body text-sm text-ink-muted">
              {worlds.find((w) => w.id === selectedWorld)?.topic ?? ""}
            </p>

            <div className="space-y-3">
              {lessons.map((lesson, i) => (
                <LessonItem
                  key={lesson.id}
                  lesson={lesson}
                  index={i}
                  expanded={expandedLesson === lesson.id}
                  onToggle={() =>
                    setExpandedLesson(expandedLesson === lesson.id ? null : lesson.id)
                  }
                />
              ))}
            </div>

            {lessons.length === 0 && (
              <div className="mt-12 text-center">
                <BookOpen className="mx-auto h-10 w-10 text-ink-faint" />
                <p className="mt-3 font-display text-lg font-bold text-ink-primary">No lessons available</p>
                <p className="mt-1 font-body text-sm text-ink-muted">Check back soon for new content.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
