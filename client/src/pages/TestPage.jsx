import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { useNavigate, useParams, useSearchParams, Link } from "react-router-dom";
import * as Icons from "lucide-react";
import {
  ChevronLeft,
  Clock,
  CheckCircle2,
  XCircle,
  SkipForward,
  Flag,
  AlertTriangle,
  RotateCcw,
  Eye,
  EyeOff,
  ArrowRight,
  Bookmark,
  Lightbulb,
  Sigma,
  ClipboardList,
  FileText,
  Eraser,
  BadgeCheck,
  Flame,
} from "lucide-react";
import ParticleField from "../components/ParticleField.jsx";
import FillBlankInput from "../components/FillBlankInput.jsx";
import MatchPairsInput from "../components/MatchPairsInput.jsx";
import SequenceInput from "../components/SequenceInput.jsx";
import MultiSelectInput from "../components/MultiSelectInput.jsx";
import QuestionDiagram from "../components/QuestionDiagram.jsx";
import {
  isFreeTextQuestion,
  isMatchQuestion,
  isSequenceQuestion,
  isMultiSelectQuestion,
  getQuestionTypeLabel,
} from "../data/content.js";
import { loadTestById, gradeTestQuestion } from "../data/quizCatalog.js";
import { getQuizById } from "../api/endpoints.js";
import { addRewards, touchDailyStreak, getPlayerState } from "../store/playerStore.js";
import {
  recordCompletedAttempt,
  clearPendingAttempt,
  savePendingAttempt,
  getAnyPendingAttempt,
} from "../store/quizAttemptStore.js";

const DEFAULT_TIME_LIMIT = 1800;

function makeAttemptId() {
  return `att-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function Timer({ timeLeft, total }) {
  const pct = total > 0 ? (timeLeft / total) * 100 : 0;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const urgent = timeLeft < 300;

  return (
    <div className="flex items-center gap-3">
      <Clock className={`h-4 w-4 ${urgent ? "text-red-400" : "text-arcane-purple"}`} />
      <div className="flex-1">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-panel-line">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              urgent ? "bg-red-400" : "bg-arcane-purple"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <span className={`font-mono text-sm font-bold ${urgent ? "text-red-400" : "text-ink-primary"}`}>
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </span>
    </div>
  );
}

function QuestionNavigator({ questions, answers, visited, currentIndex, markedForReview, onSelect }) {
  return (
    <div>
      <div className="grid grid-cols-5 gap-2 sm:grid-cols-6 md:grid-cols-8">
        {questions.map((q, i) => {
          const answered = answers[q.id] != null;
          const marked = markedForReview.includes(q.id);
          const hasVisited = visited.includes(q.id);
          const isCurrent = i === currentIndex;
          const state = isCurrent
            ? "current"
            : answered && marked
            ? "answeredMarked"
            : marked
            ? "marked"
            : answered
            ? "answered"
            : hasVisited
            ? "visited"
            : "unseen";
          const tone = {
            current: "border-neon-cyan/60 bg-neon-cyan/15 text-neon-cyan",
            answeredMarked: "border-reward-gold/60 bg-arcane-purple/15 text-reward-gold",
            marked: "border-reward-gold/60 bg-reward-gold/10 text-reward-gold",
            answered: "border-neon-green/40 bg-neon-green/10 text-neon-green",
            visited: "border-panel-line bg-panel/60 text-ink-muted",
            unseen: "border-panel-line bg-panel/40 text-ink-faint hover:border-arcane-purple/40",
          }[state];
          return (
            <button
              key={q.id}
              type="button"
              onClick={() => onSelect(i)}
              className={`relative flex h-9 w-9 items-center justify-center rounded-lg border font-mono text-xs font-bold transition-all ${tone}`}
              title={`Question ${i + 1}`}
            >
              {i + 1}
              {marked && (
                <Bookmark className="absolute -right-1 -top-1 h-3 w-3 text-reward-gold" fill="currentColor" />
              )}
              {answered && marked && (
                <span className="absolute -bottom-1 -right-1 h-2 w-2 rounded-full border border-panel-line bg-neon-green" />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
        {[
          { key: "current", dot: "bg-neon-cyan", label: "Current" },
          { key: "answered", dot: "bg-neon-green", label: "Answered" },
          { key: "marked", dot: "bg-reward-gold", label: "Marked" },
          { key: "unseen", dot: "bg-panel/80", label: "Unvisited" },
        ].map((l) => (
          <span key={l.key} className="flex items-center gap-1 font-mono text-[10px] text-ink-faint">
            <span className={`h-2 w-2 rounded-full ${l.dot}`} />
            {l.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function QuestionCard({ question, index, answer, disabled, onSelect, onSpecialSubmit, onClear }) {
  const letter = (i) => String.fromCharCode(65 + i);
  const canClear = !disabled && answer != null && !isMatchQuestion(question) && !isMultiSelectQuestion(question) && !isSequenceQuestion(question);

  return (
    <div className="space-y-4">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="font-mono text-xs text-ink-faint">Q{index + 1}</span>
        <span className="rounded-xl bg-arcane-purple/20 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-arcane-purple">
          {getQuestionTypeLabel(question)}
        </span>
        <span className="rounded-xl bg-neon-cyan/20 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-neon-cyan">
          {question.marks} mark{question.marks !== 1 ? "s" : ""}
          {question.negativeMark > 0 && ` · -${question.negativeMark} negative`}
        </span>
        {question.image && (
          <span className="rounded-xl bg-neon-cyan/20 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-neon-cyan">
            Image
          </span>
        )}
      </div>

      <div
        className="hud-frame rounded-xl border border-panel-line bg-panel/60 p-6"
        style={{ "--hud-color": "#806BFF" }}
      >
        {question.image && <QuestionDiagram diagram={question.image} className="mb-4" />}
        <p className="font-display text-lg font-bold text-ink-primary">{question.text}</p>
        {question.formula && (
          <p className="mt-3 flex items-start gap-2 rounded-lg border border-neon-cyan/30 bg-neon-cyan/5 p-2.5 font-mono text-xs text-neon-cyan">
            <Sigma className="mt-0.5 h-3.5 w-3.5 flex-none" />
            <span>
              <span className="mr-1.5 font-sans uppercase tracking-widest">Key formula</span>
              {question.formula}
            </span>
          </p>
        )}
        {question.fact && (
          <p className="mt-2 flex items-start gap-2 rounded-lg border border-reward-gold/30 bg-reward-gold/5 p-2.5 font-body text-xs text-reward-gold">
            <Lightbulb className="mt-0.5 h-3.5 w-3.5 flex-none" />
            <span>
              <span className="mr-1.5 font-mono uppercase tracking-widest">Did you know?</span>
              {question.fact}
            </span>
          </p>
        )}
      </div>

      {isMatchQuestion(question) ? (
        <MatchPairsInput
          pairs={question.pairs ?? []}
          onSubmit={(payload) => onSpecialSubmit(question.id, payload)}
          disabled={disabled}
        />
      ) : isMultiSelectQuestion(question) ? (
        <MultiSelectInput
          options={question.options ?? []}
          onSubmit={(sel) => onSpecialSubmit(question.id, sel)}
          disabled={disabled}
        />
      ) : isSequenceQuestion(question) ? (
        <SequenceInput
          items={question.options ?? []}
          correctOrder={question.correctAnswer?.split("|") ?? []}
          onSubmit={(order) => onSpecialSubmit(question.id, order)}
          disabled={disabled}
        />
      ) : isFreeTextQuestion(question) ? (
        <FillBlankInput
          defaultValue={answer ?? ""}
          onSubmit={(val) => onSelect(question.id, val)}
          disabled={disabled}
        />
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {(question.options ?? []).map((opt, i) => {
            const isSelected = answer === opt;
            return (
              <button
                key={i}
                type="button"
                disabled={disabled}
                onClick={() => onSelect(question.id, opt)}
                className={`flex items-center gap-3 rounded-xl border p-4 text-left font-body text-sm transition-all ${
                  isSelected
                    ? "border-arcane-purple/60 bg-arcane-purple/10 text-arcane-purple"
                    : "border-panel-line bg-panel/60 text-ink-primary hover:border-arcane-purple/40 hover:bg-arcane-purple/5"
                }`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-display text-xs font-bold ${
                    isSelected ? "border-arcane-purple/60 text-arcane-purple" : "border-panel-line text-ink-faint"
                  }`}
                >
                  {letter(i)}
                </span>
                <span className="flex-1">{opt}</span>
              </button>
            );
          })}
        </div>
      )}

      {canClear && (
        <button
          type="button"
          onClick={() => onClear(question.id)}
          className="flex items-center gap-1.5 rounded-lg border border-panel-line px-3 py-2 font-mono text-xs text-ink-muted transition-colors hover:border-red-400/50 hover:text-red-400"
        >
          <Eraser className="h-3.5 w-3.5" /> Clear Answer
        </button>
      )}
    </div>
  );
}

function ConceptCards({ fact, formula }) {
  if (!fact && !formula) return null;
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {fact && (
        <div className="rounded-lg border border-reward-gold/30 bg-reward-gold/5 p-3">
          <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-reward-gold">
            <Lightbulb className="h-3.5 w-3.5" /> Did You Know?
          </p>
          <p className="mt-1 font-body text-xs text-ink-primary">{fact}</p>
        </div>
      )}
      {formula && (
        <div className="rounded-lg border border-neon-cyan/30 bg-neon-cyan/5 p-3">
          <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-neon-cyan">
            <Sigma className="h-3.5 w-3.5" /> Key Formula
          </p>
          <p className="mt-1 font-mono text-xs text-ink-primary">{formula}</p>
        </div>
      )}
    </div>
  );
}

function ReviewItem({ item, index }) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        item.isSkipped
          ? "border-ink-faint/30 bg-panel/30"
          : item.isCorrect
          ? "border-neon-green/30 bg-neon-green/5"
          : "border-red-400/30 bg-red-400/5"
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="font-mono text-xs text-ink-faint">Q{index + 1}</span>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-body text-sm font-medium text-ink-primary">{item.text}</p>
            <span
              className={`rounded-lg px-1.5 py-0.5 font-mono text-[10px] font-bold ${
                item.isSkipped
                  ? "bg-ink-faint/10 text-ink-faint"
                  : item.isCorrect
                  ? "bg-neon-green/15 text-neon-green"
                  : "bg-red-400/15 text-red-400"
              }`}
            >
              {item.isSkipped ? "+0.0" : `${item.marksEarned >= 0 ? "+" : ""}${item.marksEarned}`}
            </span>
          </div>
          <div className="mt-2 space-y-1 text-xs">
            {!item.isSkipped && (
              <p>
                <span className="text-ink-faint">Your answer: </span>
                <span className={item.isCorrect ? "text-neon-green" : "text-red-400"}>
                  {typeof item.userAnswer === "object" ? JSON.stringify(item.userAnswer) : String(item.userAnswer)}
                </span>
              </p>
            )}
            {item.isSkipped && <p className="text-ink-faint">Skipped</p>}
            <p>
              <span className="text-ink-faint">Correct answer: </span>
              <span className="text-neon-green">{item.correctAnswer}</span>
            </p>
            {item.explanation && <p className="mt-1 text-ink-muted">{item.explanation}</p>}
          </div>
          {(item.fact || item.formula) && (
            <div className="mt-2">
              <ConceptCards fact={item.fact} formula={item.formula} />
            </div>
          )}
        </div>
        {item.isSkipped ? (
          <SkipForward className="h-4 w-4 text-ink-faint" />
        ) : item.isCorrect ? (
          <CheckCircle2 className="h-4 w-4 text-neon-green" />
        ) : (
          <XCircle className="h-4 w-4 text-red-400" />
        )}
      </div>
    </div>
  );
}

function ResultsPage({ results, quiz, questions, answers, onRetry, onBack, onMoreTests }) {
  const {
    score,
    accuracy,
    correctCount,
    incorrectCount,
    skippedCount,
    timeTaken,
    xpEarned,
    coinsEarned,
    marks,
    attempted,
    passed,
    passingPercentage,
    studentName,
    streakEarned,
    submittedAt,
  } = results;
  const [showReview, setShowReview] = useState(false);
  const [reviewFilter, setReviewFilter] = useState("all");

  const passThreshold = passingPercentage ?? quiz?.passingPercentage ?? 40;
  const isPass = passed != null ? passed : score >= passThreshold;
  const attemptedCount = attempted != null ? attempted : questions.length - skippedCount;
  const reviewItems = useMemo(() => questions.map((q, i) => ({ ...q, index: i })), [questions]);

  const filtered = reviewItems.filter((item) => {
    const answered = answers[item.id] != null;
    const graded = answers[item.id] == null
      ? { skipped: true, correct: false }
      : gradeTestQuestion(item, answers[item.id]);
    if (reviewFilter === "correct") return graded.correct;
    if (reviewFilter === "incorrect") return !graded.correct && !graded.skipped;
    if (reviewFilter === "skipped") return graded.skipped;
    return true;
  });

  const minutes = Math.floor(timeTaken / 60);
  const seconds = timeTaken % 60;
  const dateLabel = submittedAt
    ? new Date(submittedAt).toLocaleString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-void px-4 py-16">
      <div className="absolute inset-0 bg-radial-fade" />
      <div className="aurora-canvas pointer-events-none absolute inset-0" aria-hidden="true" />
      <ParticleField density={score >= 70 ? 30 : 12} />

      <div className="relative z-10 w-full max-w-2xl space-y-6">
        <div
          className="hud-frame rounded-2xl border border-panel-line bg-panel/80 p-8 text-center backdrop-blur-sm"
          style={{ "--hud-color": "#4ADE80", borderColor: isPass ? "#4ADE8055" : "#FCD34D55" }}
        >
          <div className="flex justify-center">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest ${
                isPass ? "bg-neon-green/15 text-neon-green" : "bg-red-400/15 text-red-400"
              }`}
            >
              <BadgeCheck className="h-3.5 w-3.5" />
              {isPass ? "Passed" : "Failed"} · Pass at {passThreshold}%
            </span>
          </div>
          <h1 className="mt-2 font-display text-3xl font-bold uppercase tracking-wide text-ink-primary">
            Test Complete!
          </h1>
          <p className="mt-1 font-body text-sm text-ink-muted">
            {quiz.subjectName} · {quiz.unitTopic} · {quiz.difficultyLabel}
          </p>
          <p className="mt-1 font-body text-xs text-ink-faint">
            {studentName ? `${studentName} · ` : ""}
            {dateLabel ?? ""}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg border border-panel-line bg-panel/60 p-3">
              <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">Score</p>
              <p className="mt-1 font-display text-2xl font-bold text-neon-green">{score}%</p>
            </div>
            <div className="rounded-lg border border-panel-line bg-panel/60 p-3">
              <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">Marks</p>
              <p className="mt-1 font-display text-2xl font-bold text-ink-primary">
                {marks} / {quiz.totalMarks}
              </p>
            </div>
            <div className="rounded-lg border border-panel-line bg-panel/60 p-3">
              <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">Accuracy</p>
              <p className="mt-1 font-display text-2xl font-bold text-arcane-purple">{accuracy}%</p>
            </div>
            <div className="rounded-lg border border-panel-line bg-panel/60 p-3">
              <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">Time</p>
              <p className="mt-1 font-display text-lg font-bold text-ink-primary">
                {minutes}m {seconds}s
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 font-mono text-xs">
            <span className="text-neon-green">
              <CheckCircle2 className="mr-1 inline h-3.5 w-3.5" />
              {correctCount} correct
            </span>
            <span className="text-red-400">
              <XCircle className="mr-1 inline h-3.5 w-3.5" />
              {incorrectCount} incorrect
            </span>
            <span className="text-ink-faint">
              <SkipForward className="mr-1 inline h-3.5 w-3.5" />
              {skippedCount} skipped
            </span>
            <span className="text-ink-muted">
              <ClipboardList className="mr-1 inline h-3.5 w-3.5" />
              {attemptedCount}/{questions.length} attempted
            </span>
            {streakEarned > 0 && (
              <span className="text-reward-gold">
                <Flame className="mr-1 inline h-3.5 w-3.5" />
                {streakEarned}-day streak
              </span>
            )}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-reward-gold/30 bg-reward-gold/5 p-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">XP Earned</p>
              <p className="mt-1 font-display text-3xl font-bold text-reward-gold">+{xpEarned}</p>
            </div>
            <div className="rounded-lg border border-neon-cyan/30 bg-neon-cyan/5 p-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">Coins Earned</p>
              <p className="mt-1 font-display text-3xl font-bold text-neon-cyan">+{coinsEarned}</p>
            </div>
          </div>

          {quiz.negativeMark > 0 && (
            <p className="mt-2 font-body text-[10px] text-ink-faint">
              Negative marking: -{quiz.negativeMark} on incorrect option-based answers
            </p>
          )}

          <div className="mt-6 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => setShowReview(!showReview)}
              className="flex items-center justify-center gap-2 rounded-xl border border-panel-line py-3 font-display text-sm font-bold uppercase tracking-wider text-ink-muted transition-colors hover:border-arcane-purple hover:text-arcane-purple"
            >
              {showReview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showReview ? "Hide Review" : "Review Answers"}
            </button>
            <button
              type="button"
              onClick={onRetry}
              className="flex items-center justify-center gap-2 rounded-xl bg-neon-green py-3 font-display text-sm font-bold uppercase tracking-wider text-void transition-transform hover:scale-[1.02]"
            >
              <RotateCcw className="h-4 w-4" /> Retake Test
            </button>
            <button
              type="button"
              onClick={onMoreTests}
              className="flex items-center justify-center gap-2 rounded-xl bg-arcane-purple py-3 font-display text-sm font-bold uppercase tracking-wider text-void transition-transform hover:scale-[1.02]"
            >
              <FileText className="h-4 w-4" /> More Tests
            </button>
            <button
              type="button"
              onClick={onBack}
              className="flex items-center justify-center gap-2 rounded-xl border border-panel-line py-3 font-display text-sm font-bold uppercase tracking-wider text-ink-muted transition-colors hover:border-ink-faint hover:text-ink-primary"
            >
              <ChevronLeft className="h-4 w-4" /> Back to Games
            </button>
          </div>
        </div>

        {quiz.fact || quiz.formula ? (
          <div className="space-y-2">
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">Chapter Concepts</p>
            <ConceptCards fact={quiz.fact} formula={quiz.formula} />
          </div>
        ) : null}

        {showReview && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {["all", "correct", "incorrect", "skipped"].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setReviewFilter(f)}
                  className={`rounded-lg px-3 py-1.5 font-display text-xs font-bold uppercase tracking-wider transition-all ${
                    reviewFilter === f
                      ? "bg-arcane-purple/20 text-arcane-purple"
                      : "bg-panel/40 text-ink-faint hover:text-ink-muted"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {filtered.map((item) => {
              const userAnswer = answers[item.id];
              const graded = userAnswer == null
                ? { skipped: true, correct: false, marksEarned: 0 }
                : gradeTestQuestion(item, userAnswer);
              return (
                <ReviewItem
                  key={item.id}
                  index={item.index}
                  item={{ ...item, userAnswer, isSkipped: graded.skipped, isCorrect: graded.correct, marksEarned: graded.marksEarned }}
                />
              );
            })}
            {filtered.length === 0 && (
              <p className="text-center font-body text-sm text-ink-muted">No questions match this filter.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function SubmitConfirm({ questions, answers, markedForReview, onConfirm, onCancel, timeLeft }) {
  const answered = Object.keys(answers).length;
  const total = questions.length;
  const unmarked = total - answered;
  const mins = Math.floor(Math.max(0, timeLeft) / 60);
  const secs = Math.max(0, timeLeft) % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-void/80 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-panel-line bg-panel p-6">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-arcane-purple" />
          <h2 className="font-display text-lg font-bold uppercase tracking-wide text-ink-primary">Submit Test?</h2>
        </div>
        <p className="mt-2 font-body text-sm text-ink-muted">
          Make sure you're done — once submitted you cannot change answers.
        </p>

        <div className="mt-4 space-y-2 rounded-xl border border-panel-line bg-panel/60 p-4 text-sm">
          <div className="flex justify-between">
            <span className="text-ink-faint">Answered</span>
            <span className="font-bold text-neon-green">{answered}/{total}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-faint">Time remaining</span>
            <span className={`font-bold font-mono ${timeLeft < 60 ? "text-red-400" : "text-ink-primary"}`}>
              {mins}m {String(secs).padStart(2, "0")}s
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-faint">Marked for review</span>
            <span className="font-bold text-reward-gold">{markedForReview.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-faint">Unanswered</span>
            <span className={`font-bold ${unmarked ? "text-red-400" : "text-ink-faint"}`}>{unmarked}</span>
          </div>
        </div>

        {unmarked > 0 && (
          <p className="mt-3 flex items-center gap-1.5 text-xs text-red-400">
            <AlertTriangle className="h-3.5 w-3.5" />
            {unmarked} question{unmarked > 1 ? "s are" : " is"} unanswered and will be scored as skipped.
          </p>
        )}

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-xl border border-panel-line py-2.5 font-display text-sm font-bold text-ink-muted transition-colors hover:text-ink-primary"
          >
            Continue Test
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-neon-green py-2.5 font-display text-sm font-bold uppercase tracking-wider text-void transition-transform hover:scale-[1.02]"
          >
            Submit Test
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TestPage() {
  const navigate = useNavigate();
  const { quizId: routeQuizId } = useParams();
  const [searchParams] = useSearchParams();
  const grade = searchParams.get("class") ?? "9";
  const board = searchParams.get("board") ?? "CBSE";
  const subject = searchParams.get("subject") ?? "CHEM";

  const quizId = routeQuizId ?? "quiz-1";

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [visited, setVisited] = useState([]);
  const [markedForReview, setMarkedForReview] = useState([]);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIME_LIMIT);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const timerRef = useRef(null);
  const attemptId = useRef(null);
  const startedAt = useRef(null);
  // Always-fresh handleSubmit for the countdown's auto-submit (an interval
  // closure cannot see updated state otherwise).
  const handleSubmitRef = useRef(null);
  useEffect(() => {
    handleSubmitRef.current = handleSubmit;
  });

  const persistPending = useCallback(() => {
    if (!attemptId.current || submitted) return;
    savePendingAttempt({
      attemptId: attemptId.current,
      quizId,
      startedAt: startedAt.current,
      timeLeft,
      answers,
      marked: markedForReview,
      visited,
    });
  }, [quizId, submitted, timeLeft, answers, markedForReview, visited]);

  useEffect(() => {
    persistPending();
  }, [persistPending]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        let q = loadTestById(quizId);
        if (!q) q = await getQuizById(quizId);

        setQuiz(q);
        const limit = q.timeLimit ?? DEFAULT_TIME_LIMIT;
        const pending = getAnyPendingAttempt(quizId);

        if (pending) {
          attemptId.current = pending.attemptId;
          startedAt.current = pending.startedAt;
          setAnswers(pending.answers ?? {});
          setVisited(pending.visited ?? []);
          setMarkedForReview(pending.marked ?? []);
          const elapsed = pending.startedAt
            ? Math.floor((Date.now() - pending.startedAt) / 1000)
            : 0;
          setTimeLeft(Math.max(0, limit - elapsed));
        } else {
          attemptId.current = makeAttemptId();
          startedAt.current = Date.now();
          setTimeLeft(limit);
        }
      } catch (err) {
        setError(err.message ?? "Failed to load quiz");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [quizId]);

  useEffect(() => {
    if (submitted || loading || error) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleSubmitRef.current(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [submitted, loading, error]);

  // Record a question as "visited" the moment the student opens it.
  useEffect(() => {
    const q = quiz?.questions?.[currentIndex];
    if (!q || submitted) return;
    setVisited((prev) => (prev.includes(q.id) ? prev : [...prev, q.id]));
  }, [currentIndex, quiz, submitted]);

  const questions = quiz?.questions ?? [];
  const question = questions[currentIndex];

  function handleSelect(qId, value) {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
    setVisited((prev) => (prev.includes(qId) ? prev : [...prev, qId]));
  }

  function handleSpecialSubmit(qId, payload) {
    setAnswers((prev) => ({ ...prev, [qId]: payload }));
    setVisited((prev) => (prev.includes(qId) ? prev : [...prev, qId]));
  }

  function clearAnswer(qId) {
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[qId];
      return next;
    });
  }

  function toggleMark(qId) {
    setMarkedForReview((prev) =>
      prev.includes(qId) ? prev.filter((id) => id !== qId) : [...prev, qId]
    );
  }

  async function handleSubmit(isAuto = false) {
    clearInterval(timerRef.current);
    if (submitted || submitting) return;
    setSubmitted(true);
    setSubmitting(true);

    let correctCount = 0;
    let incorrectCount = 0;
    let skippedCount = 0;
    let marks = 0;
    let totalMarks = 0;

    const questionWise = questions.map((q) => {
      const grade = gradeTestQuestion(q, answers[q.id]);
      totalMarks += q.marks ?? 1;
      marks += grade.marksEarned;
      if (grade.skipped) skippedCount++;
      else if (grade.correct) correctCount++;
      else incorrectCount++;
      return {
        id: q.id,
        text: q.text,
        type: q.type,
        userAnswer: answers[q.id] ?? null,
        correctAnswer: q.correctAnswer ?? null,
        options: q.options ?? null,
        pairs: q.pairs ?? null,
        isCorrect: grade.correct,
        isSkipped: grade.skipped,
        marksEarned: grade.marksEarned,
        explanation: q.explanation ?? "",
        fact: q.fact ?? "",
        formula: q.formula ?? "",
      };
    });

    marks = Math.max(0, marks);
    const attempted = correctCount + incorrectCount;
    const accuracy = Math.round((correctCount / (questions.length || 1)) * 100);
    const timeTaken = Math.max(0, (quiz?.timeLimit ?? DEFAULT_TIME_LIMIT) - timeLeft);
    const score = totalMarks
      ? Math.max(0, Math.min(100, Math.round((marks / totalMarks) * 100)))
      : 0;
    const passingPercentage = quiz?.passingPercentage ?? 40;
    const passed = score >= passingPercentage;
    const xpEarned = correctCount * 10;
    const coinsEarned = correctCount * 5;
    const submittedAt = Date.now();
    const playerState = getPlayerState();
    const streakEarned = xpEarned > 0 ? touchDailyStreak().streak : 0;

    const results = {
      score,
      accuracy,
      marks,
      totalMarks,
      correctCount,
      incorrectCount,
      skippedCount,
      attempted,
      timeTaken,
      xpEarned,
      coinsEarned,
      passed,
      passingPercentage,
      studentName: playerState?.name ?? "",
      streakEarned,
      submittedAt,
      autoSubmitted: isAuto,
    };

    if (attemptId.current) {
      recordCompletedAttempt({
        attemptId: attemptId.current,
        quizId,
        testId: quiz?.id ?? quizId,
        title: quiz?.title ?? quiz?.unitTopic ?? quizId,
        subject,
        subjectName: quiz?.subjectName ?? "",
        unitId: quiz?.unitId ?? "",
        unitName: quiz?.unitName ?? "",
        chapter: quiz?.unitTopic ?? quiz?.chapter ?? "",
        difficulty: quiz?.difficulty ?? "",
        difficultyLabel: quiz?.difficultyLabel ?? "",
        attempted,
        passed,
        passingPercentage,
        autoSubmitted: isAuto,
        startedAt: startedAt.current,
        submittedAt,
        timeTaken,
        answers,
        marked: markedForReview,
        visited,
        results,
        questionWise,
        maxScore: quiz?.totalMarks,
      });
      clearPendingAttempt(attemptId.current);
    }

    if (xpEarned > 0 || coinsEarned > 0) {
      addRewards(xpEarned, coinsEarned);
    }

    setResults(results);
    setSubmitting(false);
  }

  const retry = () => {
    clearPendingAttempt(attemptId.current);
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-void">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-arcane-purple border-t-transparent" />
          <p className="mt-3 font-body text-sm text-ink-muted">Loading test...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-void px-4">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-10 w-10 text-red-400" />
          <p className="mt-3 font-display text-lg font-bold text-ink-primary">Failed to load test</p>
          <p className="mt-1 font-body text-sm text-ink-muted">{error}</p>
          <button
            type="button"
            onClick={() => navigate(`/tests${window.location.search}`)}
            className="mt-4 rounded-xl bg-arcane-purple px-4 py-2 font-display text-sm font-bold text-void"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (submitted && results) {
    return (
      <ResultsPage
        results={results}
        quiz={quiz}
        questions={questions}
        answers={answers}
        onRetry={retry}
        onMoreTests={() => navigate(`/tests${window.location.search}`)}
        onBack={() => navigate(`/games${window.location.search}`)}
      />
    );
  }

  if (!question) return null;

  return (
    <div className="relative min-h-screen bg-void">
      <div className="absolute inset-0 bg-radial-fade" />
      <div className="aurora-canvas pointer-events-none absolute inset-0" aria-hidden="true" />
      <ParticleField density={8} />

      <div className="relative z-10 flex min-h-screen">
        <div className="flex-1 px-4 py-4 pb-28 md:pb-6">
          <div className="mx-auto max-w-2xl">
            <div className="sticky top-0 z-30 -mx-4 bg-void/90 px-4 pb-2 pt-1 backdrop-blur-sm md:static md:mx-0 md:bg-transparent md:p-0">
              <div className="mb-3 flex items-center gap-3 md:mb-4">
                <Link
                  to={`/tests${window.location.search}`}
                  className="inline-flex items-center gap-1 font-display text-sm text-ink-muted hover:text-ink-primary"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Link>
                <div className="min-w-0">
                  <h1 className="truncate font-display text-lg font-bold uppercase tracking-wide text-ink-primary">
                    {quiz?.unitTopic ?? quiz?.title ?? "Test"}
                  </h1>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
                    {quiz?.subjectName} · {quiz?.difficultyLabel}
                  </p>
                </div>
                <div className="flex-1" />
                <button
                  type="button"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="rounded-lg border border-panel-line bg-panel/60 p-2 text-ink-muted hover:text-ink-primary md:hidden"
                >
                  <Icons.List className="h-4 w-4" />
                </button>
              </div>

              <div className="mb-3 md:mb-4">
                <Timer timeLeft={timeLeft} total={quiz?.timeLimit ?? DEFAULT_TIME_LIMIT} />
              </div>
            </div>

            <QuestionCard
              question={question}
              index={currentIndex}
              answer={answers[question.id]}
              disabled={submitted}
              onSelect={handleSelect}
              onSpecialSubmit={handleSpecialSubmit}
              onClear={clearAnswer}
            />

            <div className="mt-6 hidden items-center gap-3 md:flex">
              <button
                type="button"
                onClick={() => toggleMark(question.id)}
                className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 font-display text-sm font-bold transition-all ${
                  markedForReview.includes(question.id)
                    ? "border-reward-gold/60 bg-reward-gold/10 text-reward-gold"
                    : "border-panel-line bg-panel/60 text-ink-faint hover:text-ink-muted"
                }`}
              >
                <Flag className="h-4 w-4" />
                {markedForReview.includes(question.id) ? "Marked" : "Mark"}
              </button>

              <div className="flex-1" />

              {currentIndex > 0 && (
                <button
                  type="button"
                  onClick={() => setCurrentIndex((i) => i - 1)}
                  className="flex items-center gap-1 rounded-lg border border-panel-line bg-panel/60 px-4 py-2.5 font-display text-sm font-bold text-ink-muted transition-colors hover:border-ink-faint hover:text-ink-primary"
                >
                  <ChevronLeft className="h-4 w-4" /> Prev
                </button>
              )}

              {currentIndex < questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentIndex((i) => i + 1)}
                  className="flex items-center gap-1 rounded-lg bg-arcane-purple px-4 py-2.5 font-display text-sm font-bold text-void transition-transform hover:scale-[1.02]"
                >
                  Next <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowConfirm(true)}
                  className="flex items-center gap-1 rounded-lg bg-neon-green px-4 py-2.5 font-display text-sm font-bold uppercase tracking-wider text-void transition-transform hover:scale-[1.02]"
                >
                  Submit Test
                </button>
              )}
            </div>
          </div>
        </div>

        <div
          className={`fixed right-0 top-0 z-40 h-full w-64 border-l border-panel-line bg-panel/95 p-4 backdrop-blur-sm transition-transform ${
            sidebarOpen ? "translate-x-0" : "translate-x-full"
          } md:static md:translate-x-0`}
        >
          <div className="mb-4 flex items-center justify-between md:hidden">
            <span className="font-display text-sm font-bold text-ink-primary">Questions</span>
            <button type="button" onClick={() => setSidebarOpen(false)} className="text-ink-muted">
              <XCircle className="h-4 w-4" />
            </button>
          </div>

          <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-ink-faint">
            Question Navigator
          </p>
          <QuestionNavigator
            questions={questions}
            answers={answers}
            visited={visited}
            currentIndex={currentIndex}
            markedForReview={markedForReview}
            onSelect={(i) => {
              setCurrentIndex(i);
              setSidebarOpen(false);
            }}
          />

          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-ink-faint">Answered</span>
              <span className="font-bold text-neon-green">
                {Object.keys(answers).length}/{questions.length}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-ink-faint">Marked for Review</span>
              <span className="font-bold text-reward-gold">{markedForReview.length}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-ink-faint">Unanswered</span>
              <span className="font-bold text-ink-faint">
                {questions.length - Object.keys(answers).length}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowConfirm(true)}
            className="mt-6 w-full rounded-xl bg-neon-green py-2.5 font-display text-sm font-bold uppercase tracking-wider text-void transition-transform hover:scale-[1.02]"
          >
            Submit Test
          </button>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-panel-line bg-panel/95 p-3 backdrop-blur-sm md:hidden">
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            className="flex h-11 flex-1 items-center justify-center gap-1 rounded-lg border border-panel-line bg-panel/60 font-display text-xs font-bold text-ink-muted disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" /> Prev
          </button>
          <button
            type="button"
            onClick={() => toggleMark(question.id)}
            className={`flex h-11 flex-1 items-center justify-center gap-1 rounded-lg border font-display text-xs font-bold ${
              markedForReview.includes(question.id)
                ? "border-reward-gold/60 bg-reward-gold/10 text-reward-gold"
                : "border-panel-line bg-panel/60 text-ink-faint"
            }`}
          >
            <Flag className="h-4 w-4" /> Mark
          </button>
          {currentIndex < questions.length - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentIndex((i) => i + 1)}
              className="flex h-11 flex-1 items-center justify-center gap-1 rounded-lg bg-arcane-purple font-display text-xs font-bold text-void"
            >
              Next <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowConfirm(true)}
              className="flex h-11 flex-1 items-center justify-center rounded-lg bg-neon-green font-display text-xs font-bold uppercase tracking-wider text-void"
            >
              Submit
            </button>
          )}
        </div>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-void/60 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {showConfirm && (
        <SubmitConfirm
          questions={questions}
          answers={answers}
          markedForReview={markedForReview}
          timeLeft={timeLeft}
          onConfirm={() => {
            setShowConfirm(false);
            handleSubmit(false);
          }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}