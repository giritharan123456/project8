import { useMemo, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import * as Icons from "lucide-react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  FileText,
  Clock,
  Trophy,
  Brain,
  Layers,
  History,
  Sparkles,
} from "lucide-react";
import ParticleField from "../components/ParticleField.jsx";
import { CLASSES } from "../data/content.js";
import { SUBJECTS_BY_BOARD_CLASS, getSubjectByCode } from "../data/subjectCatalog.js";
import { getQuizUnits, getQuizTests } from "../data/quizCatalog.js";
import { getTestStats } from "../store/quizAttemptStore.js";

const BOARDS = Object.keys(SUBJECTS_BY_BOARD_CLASS);

function section(label, value, onChange, options) {
  return (
    <div className="min-w-0">
      <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-ink-faint">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`rounded-lg border px-3 py-1.5 font-display text-xs font-bold transition-all ${
                active
                  ? "border-neon-cyan/60 bg-neon-cyan/15 text-neon-cyan"
                  : "border-panel-line bg-panel/60 text-ink-muted hover:border-arcane-purple/40 hover:text-ink-primary"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function QuizHubPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [board, setBoard] = useState(searchParams.get("board") ?? "CBSE");
  const gradeParam = searchParams.get("class") ?? "9";
  const gradeNumber = Math.min(12, Math.max(4, parseInt(gradeParam, 10) || 9));
  const subjectParam = searchParams.get("subject") ?? "CHEM";

  const [expandedUnit, setExpandedUnit] = useState(null);

  const availableSubjects = useMemo(() => {
    return (SUBJECTS_BY_BOARD_CLASS[board]?.[String(gradeNumber)] ?? [])
      .filter((s) => s.status === "available")
      .filter((s) => s.code !== "L2");
  }, [board, gradeNumber]);

  const defaultSubject = availableSubjects.some((s) => s.code === subjectParam)
    ? subjectParam
    : availableSubjects[0]?.code ?? "CHEM";

  const [subject, setSubject] = useState(() => {
    return availableSubjects.some((s) => s.code === subjectParam) ? subjectParam : availableSubjects[0]?.code ?? "CHEM";
  });

  const subjectInfo = getSubjectByCode(subject);
  const units = useMemo(() => getQuizUnits(subject), [subject]);

  const firstUnitWithTests = units.find((u) => getQuizTests({ subject, unitId: u.id }).length > 0);
  const openUnit = expandedUnit ?? firstUnitWithTests?.id ?? null;

  const queryBase = `?class=${gradeNumber}&board=${board}&subject=${subject}`;

  function selectClass(value) {
    window.location.href = `/tests?class=${value}&board=${board}&subject=${subject}`;
  }

  function changeBoard(value) {
    setBoard(value);
    window.location.href = `/tests?class=${gradeNumber}&board=${value}&subject=${subject}`;
  }

  function changeSubject(value) {
    setSubject(value);
    setExpandedUnit(null);
  }

  const Icon = subjectInfo ? Icons[subjectInfo.icon] ?? Icons.BookOpen : Icons.BookOpen;

  return (
    <div className="relative min-h-screen bg-void">
      <div className="absolute inset-0 bg-radial-fade" />
      <div className="aurora-canvas pointer-events-none absolute inset-0" aria-hidden="true" />
      <ParticleField density={12} />

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-8">
        <Link
          to={`/dashboard${queryBase}`}
          className="mb-6 inline-flex items-center gap-1 font-display text-sm text-ink-muted hover:text-ink-primary"
        >
          <ChevronLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        <div className="flex items-start gap-4">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border"
            style={{ borderColor: `${subjectInfo?.accent ?? "#806BFF"}44`, backgroundColor: `${subjectInfo?.accent ?? "#806BFF"}15` }}
          >
            <Icon className="h-7 w-7" style={{ color: subjectInfo?.accent ?? "#806BFF" }} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-ink-primary">Tests & Exams</h1>
            <p className="mt-1 font-body text-sm text-ink-muted">
              Timed unit tests with negative marking, ranking stats and full answer review.
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 rounded-xl border border-panel-line bg-panel/50 p-4 sm:grid-cols-3">
          {section(
            "Standard",
            board,
            changeBoard,
            BOARDS.map((b) => ({ value: b, label: b }))
          )}
          {section(
            "Class",
            String(gradeNumber),
            selectClass,
            CLASSES.map((c) => ({ value: String(c.grade), label: `Class ${c.grade}` }))
          )}
          {section(
            "Subject",
            subject,
            changeSubject,
            availableSubjects.map((s) => ({ value: s.code, label: s.name }))
          )}
        </div>

        <div className="mt-8 space-y-4">
          {units.map((unit) => {
            const tests = getQuizTests({ subject, unitId: unit.id });
            if (!tests.length) return null;
            const isOpen = openUnit === unit.id;
            const UnitIcon = Icons[unit.icon] ?? Icons.FlaskConical;
            const chapterLabel = unit.chapterCount > 0 ? `${unit.chapterCount} chapter${unit.chapterCount > 1 ? "s" : ""}` : "";

            return (
              <div
                key={unit.id}
                className="overflow-hidden rounded-xl border border-panel-line bg-panel/50"
              >
                <button
                  type="button"
                  onClick={() => setExpandedUnit(isOpen ? null : unit.id)}
                  className="flex w-full items-center gap-3 p-4 text-left hover:bg-panel/70"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-arcane-purple/30 bg-arcane-purple/10">
                    <UnitIcon className="h-5 w-5 text-arcane-purple" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-sm font-bold text-ink-primary">
                      <span className="mr-1.5 font-mono text-xs text-arcane-purple">UNIT {String(unit.unitOrder).padStart(2, "0")}</span>
                      {unit.name}
                    </p>
                    <p className="truncate font-body text-xs text-ink-muted">
                      {unit.chapter}
                      {chapterLabel ? ` · ${chapterLabel}` : ""} · {unit.questionCount} questions
                    </p>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-ink-faint transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isOpen && (
                  <div className="border-t border-panel-line p-4">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      {tests.map((test) => {
                        const stats = getTestStats(test.id);
                        return (
                          <div
                            key={test.id}
                            className="rounded-xl border border-panel-line bg-panel/60 p-4"
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className="rounded-lg px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider"
                                style={{ color: test.difficultyAccent, backgroundColor: `${test.difficultyAccent}18` }}
                              >
                                {test.difficultyLabel}
                              </span>
                              <span className="rounded-lg bg-neon-cyan/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-neon-cyan">
                                {test.questionCount} Qs
                              </span>
                            </div>
                            <p className="mt-2 font-display text-base font-bold text-ink-primary">{test.title}</p>

                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-body text-xs text-ink-muted">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" /> {Math.round(test.timeLimit / 60)} min
                              </span>
                              <span className="flex items-center gap-1">
                                <Brain className="h-3.5 w-3.5" /> {test.totalMarks} marks
                              </span>
                              <span className="flex items-center gap-1">
                                <Layers className="h-3.5 w-3.5" /> -{test.negativeMark} negative
                              </span>
                              <span className="rounded-full bg-neon-green/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-neon-green">
                                Pass {test.passingPercentage}%
                              </span>
                            </div>

                            {stats.attempts > 0 && (
                              <div className="mt-2 flex items-center gap-3 text-xs">
                                <span className="flex items-center gap-1 text-reward-gold">
                                  <Trophy className="h-3.5 w-3.5" /> Best {stats.bestScore}%
                                </span>
                                <span className="flex items-center gap-1 text-ink-muted">
                                  <History className="h-3.5 w-3.5" /> {stats.attempts} attempt{stats.attempts > 1 ? "s" : ""}
                                </span>
                                {stats.bestScore >= (test.passingPercentage ?? 40) && (
                                  <span className="text-neon-green">passed</span>
                                )}
                              </div>
                            )}

                            <button
                              type="button"
                              onClick={() => navigate(`/tests/${test.id}${queryBase}`)}
                              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-arcane-purple py-2.5 font-display text-sm font-bold uppercase tracking-wider text-void transition-transform hover:scale-[1.02]"
                            >
                              <FileText className="h-4 w-4" />
                              {stats.attempts > 0 ? "View / Retake" : "Start Test"}
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {(unit.fact ?? "") && openUnit === unit.id && (
                      <p className="mt-3 flex items-start gap-2 rounded-lg border border-reward-gold/30 bg-reward-gold/5 p-3 text-xs text-ink-muted">
                        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-reward-gold" />
                        {unit.fact}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {!units.some((u) => getQuizTests({ subject, unitId: u.id }).length) && (
            <p className="rounded-xl border border-panel-line bg-panel/40 p-6 text-center font-body text-sm text-ink-muted">
              No tests available yet for {subjectInfo?.name ?? subject}. Try another subject.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}