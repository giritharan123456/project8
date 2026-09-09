import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import * as Icons from "lucide-react";
import {
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Coins,
  Target,
  Flame,
  ArrowRight,
  BookOpen,
  Shuffle,
} from "lucide-react";
import ParticleField from "../components/ParticleField.jsx";
import FillBlankInput from "../components/FillBlankInput.jsx";
import MatchPairsInput from "../components/MatchPairsInput.jsx";
import SequenceInput from "../components/SequenceInput.jsx";
import MultiSelectInput from "../components/MultiSelectInput.jsx";
import QuestionDiagram from "../components/QuestionDiagram.jsx";
import {
  isFreeTextQuestion,
  isFreeTextCorrect,
  isMatchQuestion,
  isSequenceQuestion,
  isMultiSelectQuestion,
  isSpecialCorrect,
  getQuestionTypeLabel,
  DIFFICULTIES,
  LESSONS_BY_WORLD,
} from "../data/content.js";
import { getPracticeQuestions, submitPracticeAnswer } from "../api/endpoints.js";
import { addRewards, usePlayerState, getWorldMapLive } from "../store/playerStore.js";

function HintButton({ question, onHint, hintUsed, coins }) {
  const hintCost = hintUsed ? 0 : 5;
  const canAffirm = coins >= hintCost || hintUsed;

  return (
    <button
      type="button"
      disabled={!canAffirm}
      onClick={onHint}
      className={`flex items-center gap-2 rounded-lg px-4 py-2 font-display text-sm font-bold uppercase tracking-wide transition-all ${
        hintUsed
          ? "border border-reward-gold/40 bg-reward-gold/10 text-reward-gold"
          : canAffirm
          ? "border border-panel-line bg-panel/60 text-reward-gold hover:bg-reward-gold/10"
          : "cursor-not-allowed border border-panel-line/40 bg-panel/30 text-ink-faint"
      }`}
    >
      <Lightbulb className="h-4 w-4" />
      {hintUsed ? "Hint Used" : `Hint (${hintCost} coins)`}
    </button>
  );
}

function FeedbackBanner({ correct, explanation, streak }) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        correct
          ? "border-neon-green/50 bg-neon-green/5"
          : "border-red-400/50 bg-red-400/5"
      }`}
    >
      <div className="flex items-start gap-3">
        {correct ? (
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-neon-green" />
        ) : (
          <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
        )}
        <div className="flex-1">
          <p className={`font-display text-sm font-bold ${correct ? "text-neon-green" : "text-red-400"}`}>
            {correct ? "Correct!" : "Incorrect"}
            {correct && streak > 1 && (
              <span className="ml-2 text-xs text-neon-green/70">({streak} streak!)</span>
            )}
          </p>
          {explanation && (
            <p className="mt-1 font-body text-sm text-ink-muted">{explanation}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function ProgressHeader({ index, total, correctCount, streak }) {
  const pct = total > 0 ? Math.round(((index) / total) * 100) : 0;
  return (
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <div className="flex items-center justify-between font-mono text-xs text-ink-faint">
          <span>
            {index + 1} / {total}
          </span>
          <span className="text-neon-green">
            <Target className="mr-1 inline h-3 w-3" />
            {correctCount} correct
          </span>
          {streak > 1 && (
            <span className="text-reward-gold">
              <Flame className="mr-1 inline h-3 w-3" />
              {streak} streak
            </span>
          )}
        </div>
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-panel-line">
          <div
            className="h-full rounded-full bg-gradient-to-r from-arcane-purple to-neon-cyan transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function ResultsSummary({ correctCount, total, streak, xpEarned, coinsEarned, onRetry, onRetryWrong, onBack }) {
  const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  const won = accuracy >= 60;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-void px-4 py-16">
      <div className="absolute inset-0 bg-radial-fade" />
      <div className="aurora-canvas pointer-events-none absolute inset-0" aria-hidden="true" />
      <ParticleField density={won ? 34 : 14} />

      <div
        className="hud-frame relative z-10 w-full max-w-md rounded-2xl border bg-panel/80 p-8 text-center backdrop-blur-sm"
        style={{ "--hud-color": won ? "#4ADE80" : "#806BFF", borderColor: won ? "#4ADE8055" : "#806BFF55" }}
      >
        <div className="mx-auto -mt-2 mb-3 flex h-16 w-16 items-center justify-center rounded-full border-2 border-arcane-purple/60 bg-arcane-purple/15">
          <Icons.Sparkles className="h-8 w-8 text-arcane-purple" strokeWidth={1.7} />
        </div>

        <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-ink-primary">
          Practice Complete!
        </h1>
        <p className="mt-2 font-body text-sm text-ink-muted">
          {won ? "Great job! Keep up the momentum." : "Keep practicing â€” you'll get there!"}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-panel-line bg-panel/60 p-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">Accuracy</p>
            <p className="mt-1 font-display text-2xl font-bold text-ink-primary">{accuracy}%</p>
          </div>
          <div className="rounded-lg border border-panel-line bg-panel/60 p-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">Score</p>
            <p className="mt-1 font-display text-2xl font-bold text-ink-primary">
              {correctCount}/{total}
            </p>
          </div>
          <div className="rounded-lg border border-panel-line bg-panel/60 p-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> XP Earned
            </p>
            <p className="mt-1 font-display text-lg font-bold text-reward-gold">+{xpEarned}</p>
          </div>
          <div className="rounded-lg border border-panel-line bg-panel/60 p-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint flex items-center gap-1">
              <Coins className="h-3 w-3" /> Coins Earned
            </p>
            <p className="mt-1 font-display text-lg font-bold text-reward-gold">+{coinsEarned}</p>
          </div>
        </div>

        {streak > 2 && (
          <div className="mt-4 flex items-center justify-center gap-2 text-reward-gold">
            <Flame className="h-4 w-4" />
            <span className="font-display text-sm font-bold">Best Streak: {streak}</span>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3">
          <button
            type="button"
            onClick={onRetry}
            className="flex items-center justify-center gap-2 rounded-xl bg-neon-green py-3 font-display text-sm font-bold uppercase tracking-wider text-void transition-transform hover:scale-[1.02]"
          >
            <RotateCcw className="h-4 w-4" /> Practice Again
          </button>
          <button
            type="button"
            onClick={onRetryWrong}
            className="flex items-center justify-center gap-2 rounded-xl border border-panel-line py-3 font-display text-sm font-bold uppercase tracking-wider text-ink-muted transition-colors hover:border-arcane-purple hover:text-arcane-purple"
          >
            <Target className="h-4 w-4" /> Retry Wrong Questions
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
    </div>
  );
}

export default function PracticePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const grade = searchParams.get("class") ?? "9";
  const board = searchParams.get("board") ?? "CBSE";
  const subject = searchParams.get("subject") ?? "CHEM";
  const worldIdParam = searchParams.get("worldId");
  const difficultyParam = searchParams.get("difficulty");

  const playerState = usePlayerState();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);
  const [hintText, setHintText] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [wrongQuestions, setWrongQuestions] = useState([]);

  const worlds = useMemo(() => getWorldMapLive(grade, board, subject), [grade, board, subject]);
  const availableWorlds = worlds.worlds.filter((w) => w.status !== "locked");

  const [selectedWorld, setSelectedWorld] = useState(worldIdParam ?? availableWorlds[0]?.id ?? "atom-valley");
  const [selectedDifficulty, setSelectedDifficulty] = useState(difficultyParam ?? "easy");
  const [sessionStarted, setSessionStarted] = useState(!!worldIdParam && !!difficultyParam);

  const loadQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPracticeQuestions({
        worldId: selectedWorld,
        difficulty: selectedDifficulty,
        count: 8,
      });
      setQuestions(data);
      setIndex(0);
      setSelected(null);
      setFeedback(null);
      setCorrectCount(0);
      setStreak(0);
      setMaxStreak(0);
      setXpEarned(0);
      setCoinsEarned(0);
      setHintUsed(false);
      setHintText("");
      setShowResults(false);
      setWrongQuestions([]);
    } catch (err) {
      setError(err.message ?? "Failed to load questions");
    } finally {
      setLoading(false);
    }
  }, [selectedWorld, selectedDifficulty]);

  useEffect(() => {
    if (sessionStarted) {
      loadQuestions();
    }
  }, [sessionStarted, loadQuestions]);

  const question = questions[index];
  const currentStreak = streak;
  const isLast = index === questions.length - 1;

  function handleAnswer(answer) {
    if (feedback !== null) return;

    let isCorrect = false;

    if (isFreeTextQuestion(question)) {
      isCorrect = isFreeTextCorrect({ ...question, type: question.type }, answer);
    } else if (isMatchQuestion(question)) {
      isCorrect = isSpecialCorrect(question, answer);
    } else if (isSequenceQuestion(question)) {
      isCorrect = isSpecialCorrect(question, answer);
    } else if (isMultiSelectQuestion(question)) {
      isCorrect = isSpecialCorrect(question, answer);
    } else {
      isCorrect = answer === question.correctAnswer;
    }

    const newStreak = isCorrect ? currentStreak + 1 : 0;
    const newMax = Math.max(maxStreak, newStreak);
    const xp = isCorrect ? (selectedDifficulty === "easy" ? 5 : selectedDifficulty === "medium" ? 10 : selectedDifficulty === "hard" ? 15 : 25) : 0;
    const coins = isCorrect ? Math.round(xp / 2) : 0;

    setCorrectCount((c) => c + (isCorrect ? 1 : 0));
    setStreak(newStreak);
    setMaxStreak(newMax);
    setXpEarned((x) => x + xp);
    setCoinsEarned((c) => c + coins);
    setFeedback(isCorrect ? "correct" : "incorrect");

    if (!isCorrect) {
      setWrongQuestions((prev) => [...prev, { ...question, yourAnswer: answer }]);
    }

    submitPracticeAnswer({
      questionId: question.id,
      correct: isCorrect,
      explanation: question.explanation,
    });
  }

  function handleNext() {
    if (isLast) {
      addRewards(xpEarned, coinsEarned);
      setShowResults(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    setFeedback(null);
    setHintUsed(false);
    setHintText("");
  }

  function handleHint() {
    if (!hintUsed && question?.hint) {
      setHintText(question.hint);
      setHintUsed(true);
    }
  }

  function handleStartSession() {
    setSessionStarted(true);
  }

  function handleRetryWrong() {
    if (wrongQuestions.length > 0) {
      setQuestions(wrongQuestions);
      setIndex(0);
      setSelected(null);
      setFeedback(null);
      setCorrectCount(0);
      setStreak(0);
      setMaxStreak(0);
      setXpEarned(0);
      setCoinsEarned(0);
      setHintUsed(false);
      setHintText("");
      setShowResults(false);
      setWrongQuestions([]);
    }
  }

  if (!sessionStarted) {
    return (
      <div className="relative min-h-screen bg-void">
        <div className="absolute inset-0 bg-radial-fade" />
      <div className="aurora-canvas pointer-events-none absolute inset-0" aria-hidden="true" />
        <ParticleField density={16} />
        <div className="relative z-10 mx-auto max-w-2xl px-4 py-12">
          <Link
            to={`/games${window.location.search}`}
            className="mb-6 inline-flex items-center gap-1 font-display text-sm text-ink-muted hover:text-ink-primary"
          >
            <ChevronLeft className="h-4 w-4" /> Back to Games
          </Link>

          <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-ink-primary">
            Practice Mode
          </h1>
          <p className="mt-2 font-body text-sm text-ink-muted">
            No timer, no lives, no pressure. Just practice at your own pace.
          </p>

          <div className="mt-8 space-y-6">
            <div>
              <label className="mb-2 block font-mono text-xs uppercase tracking-widest text-ink-faint">
                Select World
              </label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {availableWorlds.map((world) => {
                  const Icon = Icons[world.icon] ?? Icons.Map;
                  return (
                    <button
                      key={world.id}
                      type="button"
                      onClick={() => setSelectedWorld(world.id)}
                      className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
                        selectedWorld === world.id
                          ? "border-neon-cyan/60 bg-neon-cyan/10"
                          : "border-panel-line bg-panel/60 hover:border-arcane-purple/40"
                      }`}
                    >
                      <Icon
                        className={`h-6 w-6 ${selectedWorld === world.id ? "text-neon-cyan" : "text-arcane-purple"}`}
                        strokeWidth={1.5}
                      />
                      <span className={`font-display text-xs font-bold ${selectedWorld === world.id ? "text-neon-cyan" : "text-ink-primary"}`}>
                        {world.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="mb-2 block font-mono text-xs uppercase tracking-widest text-ink-faint">
                Difficulty
              </label>
              <div className="flex gap-3">
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setSelectedDifficulty(d.id)}
                    className={`flex-1 rounded-lg border p-3 text-center transition-all ${
                      selectedDifficulty === d.id
                        ? "bg-arcane-purple/15 border-arcane-purple/60"
                        : "border-panel-line bg-panel/60 hover:border-ink-faint"
                    }`}
                  >
                    <span className={`font-display text-sm font-bold ${selectedDifficulty === d.id ? "text-arcane-purple" : "text-ink-primary"}`}>
                      {d.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleStartSession}
              className="w-full rounded-xl bg-neon-green py-3 font-display text-sm font-bold uppercase tracking-wider text-void transition-transform hover:scale-[1.02]"
            >
              Start Practice
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-void">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-arcane-purple border-t-transparent" />
          <p className="mt-3 font-body text-sm text-ink-muted">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-void px-4">
        <div className="text-center">
          <XCircle className="mx-auto h-10 w-10 text-red-400" />
          <p className="mt-3 font-display text-lg font-bold text-ink-primary">Failed to load</p>
          <p className="mt-1 font-body text-sm text-ink-muted">{error}</p>
          <button
            type="button"
            onClick={loadQuestions}
            className="mt-4 rounded-xl bg-arcane-purple px-4 py-2 font-display text-sm font-bold text-void"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <ResultsSummary
        correctCount={correctCount}
        total={questions.length}
        streak={maxStreak}
        xpEarned={xpEarned}
        coinsEarned={coinsEarned}
        onRetry={loadQuestions}
        onRetryWrong={handleRetryWrong}
        onBack={() => navigate(`/games${window.location.search}`)}
      />
    );
  }

  if (!question) return null;

  return (
    <div className="relative min-h-screen bg-void">
      <div className="absolute inset-0 bg-radial-fade" />
      <div className="aurora-canvas pointer-events-none absolute inset-0" aria-hidden="true" />
      <ParticleField density={10} />

      <div className="relative z-10 mx-auto max-w-2xl px-4 py-6">
        <Link
          to={`/games${window.location.search}`}
          className="mb-4 inline-flex items-center gap-1 font-display text-sm text-ink-muted hover:text-ink-primary"
        >
          <ChevronLeft className="h-4 w-4" /> Exit Practice
        </Link>

        <ProgressHeader
          index={index}
          total={questions.length}
          correctCount={correctCount}
          streak={currentStreak}
        />

        <div className="mt-6">
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-xl bg-arcane-purple/20 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-arcane-purple">
              {getQuestionTypeLabel(question)}
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
          </div>
        </div>

        {hintText && (
          <div className="mt-3 rounded-lg border border-reward-gold/30 bg-reward-gold/5 p-3">
            <p className="font-body text-sm text-reward-gold">{hintText}</p>
          </div>
        )}

        <div className="mt-4">
          {isMatchQuestion(question) ? (
            <MatchPairsInput
              pairs={question.pairs ?? []}
              onSubmit={(payload) => {
                setSelected(payload);
                handleAnswer(payload);
              }}
              disabled={feedback !== null}
            />
          ) : isMultiSelectQuestion(question) ? (
            <MultiSelectInput
              key={question.id}
              options={question.options ?? []}
              onSubmit={(sel) => {
                setSelected(sel);
                handleAnswer(sel);
              }}
              disabled={feedback !== null}
            />
          ) : isSequenceQuestion(question) ? (
            <SequenceInput
              items={question.options ?? []}
              correctOrder={question.correctAnswer?.split("|") ?? []}
              onSubmit={(order) => {
                setSelected(order);
                handleAnswer(order);
              }}
              disabled={feedback !== null}
            />
          ) : isFreeTextQuestion(question) ? (
            <FillBlankInput
              onSubmit={(val) => {
                setSelected(val);
                handleAnswer(val);
              }}
              disabled={feedback !== null}
            />
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {(question.options ?? []).map((opt, i) => {
                const letter = String.fromCharCode(65 + i);
                const isSelected = selected === opt;
                const isCorrectAnswer = feedback === "correct" && opt === question.correctAnswer;
                const isWrongAnswer = feedback === "incorrect" && isSelected && opt !== question.correctAnswer;
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={feedback !== null}
                    onClick={() => {
                      setSelected(opt);
                      handleAnswer(opt);
                    }}
                    className={`flex items-center gap-3 rounded-xl border p-4 text-left font-body text-sm transition-all ${
                      isCorrectAnswer
                        ? "border-neon-green/60 bg-neon-green/10 text-neon-green"
                        : isWrongAnswer
                        ? "border-red-400/60 bg-red-400/10 text-red-400"
                        : isSelected
                        ? "border-arcane-purple/60 bg-arcane-purple/10 text-arcane-purple"
                        : "border-panel-line bg-panel/60 text-ink-primary hover:border-arcane-purple/40 hover:bg-arcane-purple/5"
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-display text-xs font-bold ${
                        isCorrectAnswer
                          ? "border-neon-green/60 text-neon-green"
                          : isWrongAnswer
                          ? "border-red-400/60 text-red-400"
                          : "border-panel-line text-ink-faint"
                      }`}
                    >
                      {letter}
                    </span>
                    <span className="flex-1">{opt}</span>
                    {isCorrectAnswer && <CheckCircle2 className="h-4 w-4 text-neon-green" />}
                    {isWrongAnswer && <XCircle className="h-4 w-4 text-red-400" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {feedback !== null && (
          <div className="mt-4">
            <FeedbackBanner
              correct={feedback === "correct"}
              explanation={question.explanation}
              streak={currentStreak}
            />
          </div>
        )}

        <div className="mt-6 flex items-center gap-3">
          {feedback === null && (
            <HintButton question={question} onHint={handleHint} hintUsed={hintUsed} coins={playerState.coins} />
          )}
          {feedback !== null && (
            <button
              type="button"
              onClick={handleNext}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-neon-green py-3 font-display text-sm font-bold uppercase tracking-wider text-void transition-transform hover:scale-[1.02]"
            >
              {isLast ? "View Results" : "Next Question"}
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
