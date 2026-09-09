import { useState, useMemo } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import * as Icons from "lucide-react";
import {
  ChevronLeft,
  CheckCircle2,
  XCircle,
  SkipForward,
  Sparkles,
  Coins,
  Target,
  Clock,
  RotateCcw,
  Share2,
  ArrowRight,
  Eye,
  Star,
  Award,
  Flame,
} from "lucide-react";
import ParticleField from "../components/ParticleField.jsx";
import {
  isFreeTextQuestion,
  isFreeTextCorrect,
  isMatchQuestion,
  isSequenceQuestion,
  isMultiSelectQuestion,
  isSpecialCorrect,
} from "../data/content.js";

function AccuracyRing({ percentage, size = 120, strokeWidth = 8 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const color = percentage >= 80 ? "#4ADE80" : percentage >= 50 ? "#38D9F4" : "#FCD34D";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#3A3E68" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute text-center">
        <p className="font-display text-2xl font-bold text-ink-primary">{percentage}%</p>
        <p className="font-mono text-[10px] text-ink-faint">ACCURACY</p>
      </div>
    </div>
  );
}

function QuestionReviewItem({ item, index }) {
  const isSkipped = item.userAnswer == null;
  return (
    <div
      className={`rounded-xl border p-4 ${
        isSkipped
          ? "border-ink-faint/30 bg-panel/30"
          : item.isCorrect
          ? "border-neon-green/30 bg-neon-green/5"
          : "border-red-400/30 bg-red-400/5"
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="font-mono text-xs text-ink-faint">Q{index + 1}</span>
        <div className="flex-1">
          <p className="font-body text-sm font-medium text-ink-primary">{item.text}</p>
          <div className="mt-2 space-y-1 text-xs">
            {!isSkipped && (
              <p>
                <span className="text-ink-faint">Your answer: </span>
                <span className={item.isCorrect ? "text-neon-green" : "text-red-400"}>
                  {typeof item.userAnswer === "object" ? JSON.stringify(item.userAnswer) : String(item.userAnswer)}
                </span>
              </p>
            )}
            {isSkipped && <p className="text-ink-faint">Skipped</p>}
            <p>
              <span className="text-ink-faint">Correct answer: </span>
              <span className="text-neon-green">{item.correctAnswer}</span>
            </p>
            {item.explanation && (
              <p className="mt-1 text-ink-muted">{item.explanation}</p>
            )}
          </div>
        </div>
        {isSkipped ? (
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

export default function ResultPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const grade = searchParams.get("class") ?? "9";
  const board = searchParams.get("board") ?? "CBSE";
  const subject = searchParams.get("subject") ?? "CHEM";
  const queryBase = `?class=${grade}&board=${board}&subject=${subject}`;

  const results = useMemo(() => {
    const raw = searchParams.get("results");
    if (raw) {
      try {
        return JSON.parse(decodeURIComponent(raw));
      } catch {
        // ignore
      }
    }
    return {
      score: 80,
      accuracy: 80,
      correctCount: 8,
      incorrectCount: 1,
      skippedCount: 1,
      timeTaken: 920,
      xpEarned: 80,
      coinsEarned: 40,
      streak: 3,
      masteryUpdate: "Atomic Structure: 85% mastery",
      questions: [
        { id: "q1", text: "What is the atomic number of Carbon?", correctAnswer: "6", userAnswer: "6", isCorrect: true, explanation: "Carbon has 6 protons." },
        { id: "q2", text: "Which particle has a negative charge?", correctAnswer: "Electron", userAnswer: "Electron", isCorrect: true, explanation: "Electrons carry a negative charge." },
        { id: "q3", text: "Mass number equals which sum?", correctAnswer: "Protons + Neutrons", userAnswer: "Protons + Electrons", isCorrect: false, explanation: "Mass number = protons + neutrons, not electrons." },
        { id: "q4", text: "What is found in the nucleus?", correctAnswer: "Protons and Neutrons", userAnswer: null, isCorrect: false, explanation: "The nucleus contains protons and neutrons." },
        { id: "q5", text: "An atom is electrically neutral when it has:", correctAnswer: "Equal protons and electrons", userAnswer: "Equal protons and electrons", isCorrect: true, explanation: "Equal charges cancel out." },
      ],
    };
  }, [searchParams]);

  const [reviewFilter, setReviewFilter] = useState("all");

  const questions = results.questions ?? [];
  const filtered = questions.filter((q) => {
    if (reviewFilter === "correct") return q.isCorrect && q.userAnswer != null;
    if (reviewFilter === "incorrect") return !q.isCorrect && q.userAnswer != null;
    if (reviewFilter === "skipped") return q.userAnswer == null;
    return true;
  });

  const minutes = Math.floor((results.timeTaken ?? 0) / 60);
  const seconds = (results.timeTaken ?? 0) % 60;

  function handleShare() {
    const text = `I scored ${results.accuracy}% on my ${subject} quiz! ${results.correctCount}/${results.correctCount + results.incorrectCount + results.skippedCount} correct. #LearnQuest`;
    if (navigator.share) {
      navigator.share({ text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text).catch(() => {});
    }
  }

  return (
    <div className="relative min-h-screen bg-void">
      <div className="absolute inset-0 bg-radial-fade" />
      <div className="aurora-canvas pointer-events-none absolute inset-0" aria-hidden="true" />
      <ParticleField density={results.accuracy >= 70 ? 30 : 12} />

      <div className="relative z-10 mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Link
            to={`/dashboard${queryBase}`}
            className="inline-flex items-center gap-1 font-display text-sm text-ink-muted hover:text-ink-primary"
          >
            <ChevronLeft className="h-4 w-4" /> Dashboard
          </Link>
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1 rounded-lg border border-panel-line bg-panel/60 px-3 py-1.5 font-display text-xs font-bold text-ink-muted hover:text-ink-primary"
          >
            <Share2 className="h-3.5 w-3.5" /> Share
          </button>
        </div>

        <div
          className="hud-frame rounded-2xl border bg-panel/80 p-8 text-center backdrop-blur-sm"
          style={{
            "--hud-color": results.accuracy >= 70 ? "#4ADE80" : "#FCD34D",
            borderColor: results.accuracy >= 70 ? "#4ADE8055" : "#FCD34D55",
          }}
        >
          <div className="flex justify-center">
            <AccuracyRing percentage={results.accuracy} />
          </div>

          <h1 className="mt-4 font-display text-2xl font-bold uppercase tracking-wide text-ink-primary">
            {results.accuracy >= 90
              ? "Outstanding!"
              : results.accuracy >= 70
              ? "Great Work!"
              : results.accuracy >= 50
              ? "Good Effort!"
              : "Keep Practicing!"}
          </h1>
          <p className="mt-1 font-body text-sm text-ink-muted">
            You answered {results.correctCount} out of {questions.length} questions correctly.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg border border-panel-line bg-panel/60 p-3">
              <div className="flex items-center justify-center gap-1 font-mono text-[10px] uppercase tracking-widest text-ink-faint">
                <Target className="h-3 w-3" /> Score
              </div>
              <p className="mt-1 font-display text-xl font-bold text-neon-green">{results.score}%</p>
            </div>
            <div className="rounded-lg border border-panel-line bg-panel/60 p-3">
              <div className="flex items-center justify-center gap-1 font-mono text-[10px] uppercase tracking-widest text-ink-faint">
                <Clock className="h-3 w-3" /> Time
              </div>
              <p className="mt-1 font-display text-lg font-bold text-ink-primary">
                {minutes}m {seconds}s
              </p>
            </div>
            <div className="rounded-lg border border-panel-line bg-panel/60 p-3">
              <div className="flex items-center justify-center gap-1 font-mono text-[10px] uppercase tracking-widest text-ink-faint">
                <Sparkles className="h-3 w-3" /> XP
              </div>
              <p className="mt-1 font-display text-lg font-bold text-reward-gold">+{results.xpEarned}</p>
            </div>
            <div className="rounded-lg border border-panel-line bg-panel/60 p-3">
              <div className="flex items-center justify-center gap-1 font-mono text-[10px] uppercase tracking-widest text-ink-faint">
                <Coins className="h-3 w-3" /> Coins
              </div>
              <p className="mt-1 font-display text-lg font-bold text-reward-gold">+{results.coinsEarned}</p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-6 text-sm">
            <span className="flex items-center gap-1 text-neon-green">
              <CheckCircle2 className="h-4 w-4" /> {results.correctCount} correct
            </span>
            <span className="flex items-center gap-1 text-red-400">
              <XCircle className="h-4 w-4" /> {results.incorrectCount} incorrect
            </span>
            <span className="flex items-center gap-1 text-ink-faint">
              <SkipForward className="h-4 w-4" /> {results.skippedCount} skipped
            </span>
          </div>

          {results.streak > 0 && (
            <div className="mt-4 flex items-center justify-center gap-2 text-reward-gold">
              <Flame className="h-4 w-4" />
              <span className="font-display text-sm font-bold">{results.streak} question streak!</span>
            </div>
          )}

          {results.masteryUpdate && (
            <div className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-neon-green/30 bg-neon-green/5 py-2 px-3">
              <Award className="h-4 w-4 text-neon-green" />
              <span className="font-body text-xs text-neon-green">{results.masteryUpdate}</span>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <Link
            to={`/practice${queryBase}`}
            className="flex items-center justify-center gap-2 rounded-xl bg-neon-green py-3 font-display text-sm font-bold uppercase tracking-wider text-void transition-transform hover:scale-[1.02]"
          >
            <RotateCcw className="h-4 w-4" /> Practice Again
          </Link>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 rounded-xl border border-panel-line py-3 font-display text-sm font-bold uppercase tracking-wider text-ink-muted transition-colors hover:border-ink-faint hover:text-ink-primary"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </button>
        </div>

        {questions.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-4 font-display text-lg font-bold text-ink-primary flex items-center gap-2">
              <Eye className="h-5 w-5 text-arcane-purple" /> Question Review
            </h2>

            <div className="mb-3 flex gap-2">
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

            <div className="space-y-3">
              {filtered.map((q, i) => (
                <QuestionReviewItem key={q.id} item={q} index={questions.indexOf(q)} />
              ))}
              {filtered.length === 0 && (
                <p className="text-center font-body text-sm text-ink-muted">No questions match this filter.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
