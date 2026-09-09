import { useState } from "react";
import { useNavigate, useParams, useSearchParams, Link } from "react-router-dom";
import * as Icons from "lucide-react";
import {
  ChevronLeft,
  FileText,
  Clock,
  Brain,
  Layers,
  CheckCircle2,
  XCircle,
  Flag,
  AlertTriangle,
  Lightbulb,
  Sigma,
  History,
  Play,
  Trophy,
} from "lucide-react";
import ParticleField from "../components/ParticleField.jsx";
import { getTestMeta } from "../data/quizCatalog.js";
import { getSubjectByCode } from "../data/subjectCatalog.js";
import {
  getCompletedAttempts,
  getAnyPendingAttempt,
  clearPendingAttempt,
} from "../store/quizAttemptStore.js";

export default function QuizInstructionsPage() {
  const navigate = useNavigate();
  const { testId } = useParams();
  const [searchParams] = useSearchParams();
  const [clearing, setClearing] = useState(false);
  const [showPast, setShowPast] = useState(false);

  const test = getTestMeta(testId);
  const queryBase = `?class=${searchParams.get("class") ?? "9"}&board=${searchParams.get("board") ?? "CBSE"}&subject=${searchParams.get("subject") ?? test?.subject ?? "CHEM"}`;

  if (!test) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-void px-4">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-10 w-10 text-red-400" />
          <p className="mt-3 font-display text-lg font-bold text-ink-primary">Test not found</p>
          <button
            type="button"
            onClick={() => navigate(`/tests${queryBase}`)}
            className="mt-4 rounded-xl bg-arcane-purple px-4 py-2 font-display text-sm font-bold text-void"
          >
            Browse Tests
          </button>
        </div>
      </div>
    );
  }

  const subjectInfo = getSubjectByCode(test.subject);
  const Icon = subjectInfo ? Icons[subjectInfo.icon] ?? Icons.BookOpen : Icons.BookOpen;
  const pending = getAnyPendingAttempt(testId);
  const past = getCompletedAttempts(testId);
  const minutes = Math.round(test.timeLimit / 60);

  function startFresh() {
    if (pending) clearPendingAttempt(pending.attemptId);
    navigate(`/test/${testId}${queryBase}`);
  }

  function resume() {
    navigate(`/test/${testId}${queryBase}`);
  }

  return (
    <div className="relative min-h-screen bg-void">
      <div className="absolute inset-0 bg-radial-fade" />
      <div className="aurora-canvas pointer-events-none absolute inset-0" aria-hidden="true" />
      <ParticleField density={12} />

      <div className="relative z-10 mx-auto max-w-2xl px-4 py-8">
        <Link
          to={`/tests${queryBase}`}
          className="mb-6 inline-flex items-center gap-1 font-display text-sm text-ink-muted hover:text-ink-primary"
        >
          <ChevronLeft className="h-4 w-4" /> Back to Tests
        </Link>

        <div
          className="hud-frame rounded-2xl border border-panel-line bg-panel/70 p-6"
          style={{ "--hud-color": test.difficultyAccent, borderColor: `${test.difficultyAccent}44` }}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border" style={{ borderColor: `${subjectInfo?.accent ?? "#806BFF"}44`, backgroundColor: `${subjectInfo?.accent ?? "#806BFF"}14` }}>
              <Icon className="h-6 w-6" style={{ color: subjectInfo?.accent ?? "#806BFF" }} strokeWidth={1.5} />
            </div>
            <div className="min-w-0">
              <span
                className="rounded-lg px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider"
                style={{ color: test.difficultyAccent, backgroundColor: `${test.difficultyAccent}18` }}
              >
                {test.difficultyLabel} Test
              </span>
              <h1 className="mt-1 font-display text-xl font-bold uppercase tracking-wide text-ink-primary">
                {test.title}
              </h1>
              <p className="font-body text-xs text-ink-muted">
                {test.subjectName} · Class {searchParams.get("class") ?? "9"} · {test.unitName}
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg border border-panel-line bg-panel/60 p-3 text-center">
              <Clock className="mx-auto h-4 w-4 text-neon-cyan" />
              <p className="mt-1 font-display text-lg font-bold text-ink-primary">{minutes} min</p>
              <p className="font-mono text-[10px] text-ink-faint">TIME LIMIT</p>
            </div>
            <div className="rounded-lg border border-panel-line bg-panel/60 p-3 text-center">
              <Brain className="mx-auto h-4 w-4 text-arcane-purple" />
              <p className="mt-1 font-display text-lg font-bold text-ink-primary">{test.questionCount}</p>
              <p className="font-mono text-[10px] text-ink-faint">QUESTIONS</p>
            </div>
            <div className="rounded-lg border border-panel-line bg-panel/60 p-3 text-center">
              <Layers className="mx-auto h-4 w-4 text-neon-green" />
              <p className="mt-1 font-display text-lg font-bold text-neon-green">{test.totalMarks}</p>
              <p className="font-mono text-[10px] text-ink-faint">TOTAL MARKS</p>
            </div>
            <div className="rounded-lg border border-panel-line bg-panel/60 p-3 text-center">
              <XCircle className="mx-auto h-4 w-4 text-red-400" />
              <p className="mt-1 font-display text-lg font-bold text-red-400">-{test.negativeMark}</p>
              <p className="font-mono text-[10px] text-ink-faint">NEGATIVE / WRONG</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-start gap-3">
            <div className="min-w-[240px] flex-1 rounded-xl border border-reward-gold/30 bg-reward-gold/5 p-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-reward-gold">Marking Scheme</p>
              <ul className="mt-2 space-y-1.5 font-body text-sm text-ink-primary">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-neon-green" /> Correct: +{test.marksPerCorrect} mark each
                </li>
                <li className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-400" /> Wrong option-based answer: -{test.negativeMark} mark
                </li>
                <li className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-ink-faint" /> Skipped / free-text wrong: 0 marks
                </li>
              </ul>
            </div>
            <div className="rounded-xl border border-neon-green/30 bg-neon-green/5 p-4 text-center">
              <p className="font-mono text-[10px] uppercase tracking-widest text-neon-green">Passing Score</p>
              <p className="mt-1 font-display text-3xl font-bold text-neon-green">{test.passingPercentage}%</p>
              <p className="mt-1 font-body text-[10px] text-ink-faint">Failures are marked below this</p>
            </div>
          </div>

          {(test.fact || test.formula) && (
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {test.fact && (
                <div className="rounded-lg border border-reward-gold/30 bg-reward-gold/5 p-3">
                  <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-reward-gold">
                    <Lightbulb className="h-3.5 w-3.5" /> Did You Know?
                  </p>
                  <p className="mt-1 font-body text-xs text-ink-primary">{test.fact}</p>
                </div>
              )}
              {test.formula && (
                <div className="rounded-lg border border-neon-cyan/30 bg-neon-cyan/5 p-3">
                  <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-neon-cyan">
                    <Sigma className="h-3.5 w-3.5" /> Key Formula
                  </p>
                  <p className="mt-1 font-mono text-xs text-ink-primary">{test.formula}</p>
                </div>
              )}
            </div>
          )}

          <div className="mt-5 rounded-xl border border-panel-line bg-panel/40 p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">Test Rules</p>
            <ul className="mt-2 space-y-2 font-body text-xs text-ink-muted">
              <li className="flex gap-2">
                <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-neon-cyan" />
                The timer starts the moment you begin and the test auto-submits at 00:00.
              </li>
              <li className="flex gap-2">
                <Flag className="mt-0.5 h-3.5 w-3.5 shrink-0 text-reward-gold" />
                Use the question palette to jump around and Mark questions for review.
              </li>
              <li className="flex gap-2">
                <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-arcane-purple" />
                After submitting you'll see your score, marks and a full answer review with facts and formulas.
              </li>
              <li className="flex gap-2">
                <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-reward-gold" />
                Each question card shows its own key formula and a quick "did you know" fact while you solve.
              </li>
              <li className="flex gap-2">
                <History className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-faint" />
                Every attempt is saved separately — retaking never overwrites an earlier result.
              </li>
            </ul>
          </div>

          <div className="mt-5 flex flex-col gap-3">
            {pending && (
              <button
                type="button"
                onClick={resume}
                className="flex items-center justify-center gap-2 rounded-xl border border-neon-cyan/50 bg-neon-cyan/10 py-3 font-display text-sm font-bold uppercase tracking-wider text-neon-cyan transition-transform hover:scale-[1.02]"
              >
                <Play className="h-4 w-4" /> Resume In-Progress Attempt
              </button>
            )}
            <button
              type="button"
              onClick={startFresh}
              className="flex items-center justify-center gap-2 rounded-xl bg-neon-green py-3 font-display text-sm font-bold uppercase tracking-wider text-void transition-transform hover:scale-[1.02]"
            >
              <Play className="h-4 w-4" /> {pending ? "Start a New Attempt" : "Start Test"}
            </button>
          </div>
        </div>

        {past.length > 0 && (
          <div className="mt-6">
            <button
              type="button"
              onClick={() => setShowPast(!showPast)}
              className="flex w-full items-center justify-between rounded-xl border border-panel-line bg-panel/50 p-4 font-display text-sm font-bold uppercase tracking-wider text-ink-muted hover:text-ink-primary"
            >
              <span className="flex items-center gap-2">
                <History className="h-4 w-4" /> Your Attempts ({past.length})
              </span>
              <span>{showPast ? "▲" : "▼"}</span>
            </button>

            {showPast && (
              <div className="mt-2 space-y-2">
                {past.map((a) => (
                  <div
                    key={a.attemptId}
                    className="flex items-center gap-3 rounded-xl border border-panel-line bg-panel/40 p-3"
                  >
                    <Trophy className="h-5 w-5 text-reward-gold" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-display text-sm font-bold text-ink-primary">{a.results?.score ?? 0}%</p>
                        <span
                          className={`rounded-full px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider ${
                            a.results?.passed ?? a.results?.score >= (test.passingPercentage ?? 40)
                              ? "bg-neon-green/15 text-neon-green"
                              : "bg-red-400/15 text-red-400"
                          }`}
                        >
                          {a.results?.passed ?? a.results?.score >= (test.passingPercentage ?? 40) ? "Pass" : "Fail"}
                        </span>
                      </div>
                      <p className="font-body text-xs text-ink-muted">
                        {new Date(a.submittedAt).toLocaleString()} · {Math.floor((a.results?.timeTaken ?? 0) / 60)}m {(a.results?.timeTaken ?? 0) % 60}s · {a.results?.marks ?? 0}/{a.results?.totalMarks ?? test.totalMarks} marks · {a.results?.accuracy ?? 0}% accuracy
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigator.clipboard?.writeText(a.attemptId)}
                      className="rounded-lg border border-panel-line px-2 py-1 font-mono text-[10px] text-ink-faint"
                    >
                      {a.attemptId.slice(0, 12)}…
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}