import * as Icons from "lucide-react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { CLASSES } from "../data/content.js";
import { getLandingSubject } from "../lib/landingSubject.js";

const ACCENTS = ["#806BFF", "#38D9F4", "#4ADE80", "#FCD34D"];

function ClassCard({ cls, index, subjectName }) {
  const Icon = Icons[cls.icon] ?? Icons.GraduationCap;
  const color = ACCENTS[index % ACCENTS.length];

  return (
    <div
      className="hud-frame group relative flex flex-col rounded-xl border border-panel-line bg-panel/60 p-6 transition-all duration-300 hover:-translate-y-1"
      style={{ "--hud-color": color }}
    >
      <div
        className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg border"
        style={{ borderColor: `${color}55`, background: `${color}14` }}
      >
        <Icon className="h-6 w-6" style={{ color }} strokeWidth={1.8} />
      </div>

      <h3 className="font-display text-2xl font-bold text-ink-primary">
        Class {cls.grade}
      </h3>
      <p className="mt-1 font-mono text-xs uppercase tracking-[0.2em] text-ink-faint">
        {subjectName} Adventure
      </p>

      <dl className="mt-4 space-y-1.5 font-body text-sm text-ink-muted">
        <div className="flex justify-between">
          <dt>Courses</dt>
          <dd className="font-semibold text-ink-primary">{cls.courses}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Lessons</dt>
          <dd className="font-semibold text-ink-primary">{cls.lessons}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Questions</dt>
          <dd className="font-semibold text-ink-primary">{cls.questions}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Difficulty</dt>
          <dd className="text-right text-ink-primary">{cls.difficulty}</dd>
        </div>
      </dl>

      <Link
        to="/sign-up"
        className="mt-6 inline-flex items-center justify-center gap-1.5 rounded-xl border px-4 py-2.5 font-display text-sm font-semibold uppercase tracking-wider transition-colors"
        style={{ borderColor: `${color}88`, color }}
      >
        Start Adventure
        <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

export default function ClassesPreview() {
  const { name } = getLandingSubject();

  return (
    <section id="classes" className="relative bg-void-soft px-6 py-28 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-arcane-purple">
            Step 1
          </span>
          <h2 className="mt-3 font-display text-4xl font-bold text-ink-primary sm:text-5xl">
            Choose Your <span className="text-neon-cyan">Class</span>
          </h2>
          <p className="mt-4 font-body text-ink-muted">
            Every world, lesson, and question is scoped to your class â€” no
            mixed-up content, ever.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CLASSES.map((cls, i) => (
            <ClassCard key={cls.grade} cls={cls} index={i} subjectName={name} />
          ))}
        </div>
      </div>
    </section>
  );
}
