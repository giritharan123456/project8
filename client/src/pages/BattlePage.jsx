import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams, Link } from "react-router-dom";
import * as Icons from "lucide-react";
import {
  GraduationCap,
  ChevronLeft,
  Heart,
  Timer as TimerIcon,
  Sparkles,
  Coins,
  Swords,
  Star,
  RotateCcw,
  Map as MapIcon,
  ArrowRight,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import ParticleField from "../components/ParticleField.jsx";
import ThemeToggle from "../components/ThemeToggle.jsx";
import PowerUpBar from "../components/PowerUpBar.jsx";
import FillBlankInput from "../components/FillBlankInput.jsx";
import Confetti from "../components/Confetti.jsx";
import RewardChest from "../components/RewardChest.jsx";
import MatchPairsInput from "../components/MatchPairsInput.jsx";
import SequenceInput from "../components/SequenceInput.jsx";
import MultiSelectInput from "../components/MultiSelectInput.jsx";
import QuestionDiagram from "../components/QuestionDiagram.jsx";
import {
  getBattleData,
  starsForProgress,
  DIFFICULTIES,
  DIFFICULTY_ACCENTS,
  getPowerupClue,
  isFreeTextCorrect,
  isFreeTextQuestion,
  isMatchQuestion,
  isSequenceQuestion,
  isMultiSelectQuestion,
  isSpecialCorrect,
  getQuestionTypeLabel,
} from "../data/content.js";
import {
  addRewards,
  recordLessonCompletion,
  completionKey,
  getPowerupCounts,
  usePowerupCharge,
  useEquippedAvatarIcon,
} from "../store/playerStore.js";

const TOTAL_LIVES = 3;
const FEEDBACK_MS = 1600;
const FREEZE_MS = 8000;

function HealthHearts({ lives }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: TOTAL_LIVES }).map((_, i) => (
        <Heart
          key={i}
          className="h-5 w-5 transition-all duration-300"
          strokeWidth={1.8}
          style={
            i < lives
              ? { color: "#F87171", fill: "#F87171" }
              : { color: "#3A3E68", fill: "none" }
          }
        />
      ))}
    </div>
  );
}

function EnemyPortrait({ name, hpPct, hit }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`hud-frame flex h-20 w-20 items-center justify-center rounded-xl border bg-panel/70 transition-transform duration-200 sm:h-24 sm:w-24 ${
          hit ? "translate-x-1 animate-pulse" : ""
        }`}
        style={{ "--hud-color": "#806BFF", borderColor: "#806BFF66" }}
      >
        <Icons.Skull className="h-10 w-10 text-arcane-purple sm:h-12 sm:w-12" strokeWidth={1.5} />
      </div>
      <p className="mt-2 max-w-[9rem] truncate font-display text-sm font-bold uppercase tracking-wide text-ink-primary sm:max-w-[11rem]">
        {name}
      </p>
      <div className="mt-1.5 h-2.5 w-32 overflow-hidden rounded-full bg-panel-line sm:w-40">
        <div
          className="h-full rounded-full bg-gradient-to-r from-arcane-purple to-red-500 transition-all duration-500 ease-out"
          style={{ width: `${hpPct}%` }}
        />
      </div>
      <span className="mt-1 font-mono text-[10px] text-ink-faint">{Math.round(hpPct)}% HP</span>
    </div>
  );
}

function PlayerPortrait({ lives }) {
  // Reads the shared, persisted equipped avatar â€” so whatever the player
  // last equipped in the Shop shows up in battle too, not a fixed icon.
  const avatarIconName = useEquippedAvatarIcon();
  const AvatarIcon = Icons[avatarIconName] ?? Icons.UserRound;
  return (
    <div className="flex flex-col items-center">
      <div
        className="hud-frame flex h-20 w-20 items-center justify-center rounded-xl border bg-panel/70 sm:h-24 sm:w-24"
        style={{ "--hud-color": "#38D9F4", borderColor: "#38D9F466" }}
      >
        <AvatarIcon className="h-10 w-10 text-neon-cyan sm:h-12 sm:w-12" strokeWidth={1.5} />
      </div>
      <p className="mt-2 font-display text-sm font-bold uppercase tracking-wide text-ink-primary">
        You
      </p>
      <div className="mt-1.5">
        <HealthHearts lives={lives} />
      </div>
    </div>
  );
}

function ResultsScreen({ outcome, stats, difficulty, onRetry, onBackToLessons, onBackToWorldMap, onNextLevel, hasNext }) {
  const won = outcome === "won";
  const accent = won ? "#4ADE80" : "#F87171";
  const [starsShown, setStarsShown] = useState(false);
  const [screenShake, setScreenShake] = useState(!won);
  const avatarIconName = useEquippedAvatarIcon();
  const AvatarIcon = Icons[avatarIconName] ?? Icons.UserRound;

  useEffect(() => {
    if (!won) {
      const t = setTimeout(() => setScreenShake(false), 420);
      return () => clearTimeout(t);
    }
  }, [won]);

  const rewardChips = [
    { label: "XP", value: `+${stats.xpEarned}`, icon: Sparkles, color: "#FCD34D" },
    { label: "Coins", value: `+${stats.coinsEarned}`, icon: Coins, color: "#FCD34D" },
  ];

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-void px-6 py-16">
      <div className="absolute inset-0 bg-radial-fade" />
      <div className="aurora-canvas pointer-events-none absolute inset-0" aria-hidden="true" />
      <ParticleField density={won ? 34 : 14} />
      {won && <Confetti />}

      <div
        className={`hud-frame animate-fade-up relative z-10 w-full max-w-md rounded-card-lg border bg-panel/80 p-8 text-center shadow-elevated backdrop-blur-sm ${
          screenShake ? "animate-shake" : ""
        }`}
        style={{ "--hud-color": accent, borderColor: `${accent}55` }}
      >
        <div className="mx-auto -mt-2 mb-3 flex h-16 w-16 items-center justify-center rounded-full border-2 border-arcane-purple/60 bg-arcane-purple/15">
          <AvatarIcon className="h-8 w-8 text-arcane-purple" strokeWidth={1.7} />
        </div>
        {won ? (
          <>
            <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-ink-primary">
              Level Completed!
            </h1>
            <div className="mt-4 flex justify-center">
              <RewardChest accent="#FCD34D" rewards={rewardChips} onRevealed={() => setStarsShown(true)} />
            </div>
            <div className="mt-4 flex justify-center gap-1">
              {[0, 1, 2].map((i) => (
                <Star
                  key={i}
                  className={`h-8 w-8 transition-all duration-300 ${
                    starsShown
                      ? "scale-100 opacity-100"
                      : "scale-50 opacity-0"
                  }`}
                  style={{
                    transitionDelay: `${i * 140}ms`,
                    ...(i < stats.stars
                      ? { color: "#FCD34D", fill: "#FCD34D" }
                      : { color: "#3A3E68", fill: "none" }),
                  }}
                />
              ))}
            </div>
          </>
        ) : (
          <>
            <XCircle className="mx-auto h-10 w-10 text-red-400" strokeWidth={1.6} />
            <h1 className="mt-3 font-display text-3xl font-bold uppercase tracking-wide text-ink-primary">
              Game Over
            </h1>
            <p className="mt-2 font-body text-sm text-ink-muted">
              {enemyLossLine(stats.enemyName)}
            </p>
          </>
        )}

        <div className="mt-6 grid grid-cols-2 gap-3 text-left">
          <StatTile icon={Sparkles} label="XP Earned" value={`+${stats.xpEarned}`} color="#FCD34D" />
          <StatTile icon={Coins} label="Coins Earned" value={`+${stats.coinsEarned}`} color="#FCD34D" />
          <StatTile
            icon={CheckCircle2}
            label="Score"
            value={`${stats.correct}/${stats.total}`}
            color="#38D9F4"
          />
          <StatTile icon={Icons.Percent} label="Accuracy" value={`${stats.accuracy}%`} color="#38D9F4" />
          <StatTile icon={Icons.Timer} label="Time Taken" value={formatDuration(stats.timeTakenSec)} color="#806BFF" />
        </div>

        <div className="mt-8 flex flex-col gap-3">
          {won ? (
            <button
              type="button"
              onClick={onNextLevel}
              className="flex items-center justify-center gap-2 rounded-xl bg-neon-green py-3 font-display text-sm font-bold uppercase tracking-wider text-void shadow-glow-green transition-transform hover:scale-[1.02]"
            >
              {hasNext ? (
                <>
                  Next Level <ArrowRight className="h-4 w-4" />
                </>
              ) : (
                <>
                  Back to Lessons <MapIcon className="h-4 w-4" />
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={onRetry}
              className="flex items-center justify-center gap-2 rounded-xl py-3 font-display text-sm font-bold uppercase tracking-wider text-void transition-transform hover:scale-[1.02]"
              style={{ background: DIFFICULTY_ACCENTS[difficulty?.id] ?? "#F87171" }}
            >
              <RotateCcw className="h-4 w-4" /> Retry
            </button>
          )}
          <button
            type="button"
            onClick={onBackToLessons}
            className="flex items-center justify-center gap-2 rounded-xl border border-panel-line bg-void/40 py-3 font-display text-sm font-bold uppercase tracking-wider text-ink-muted transition-colors hover:border-ink-faint hover:text-ink-primary"
          >
            <MapIcon className="h-4 w-4" /> {won ? "Back to Lessons" : "Practice Weak Topic"}
          </button>
          <button
            type="button"
            onClick={onBackToWorldMap}
            className="flex items-center justify-center gap-2 rounded-xl border border-panel-line bg-void/40 py-3 font-display text-sm font-bold uppercase tracking-wider text-ink-muted transition-colors hover:border-ink-faint hover:text-ink-primary"
          >
            <Icons.Map className="h-4 w-4" /> Back to World Map
          </button>
        </div>
      </div>
    </div>
  );
}

function formatDuration(totalSeconds) {
  const s = Math.max(0, Math.round(totalSeconds ?? 0));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return m > 0 ? `${m}m ${r}s` : `${r}s`;
}

function enemyLossLine(name) {
  return `${name} was too strong this time. Review the explanations and try again.`;
}

function StatTile({ icon: Icon, label, value, color }) {
  return (
    <div className="hud-frame rounded-card border border-panel-line bg-panel/60 p-3 shadow-soft" style={{ "--hud-color": color }}>
      <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-ink-faint">
        <Icon className="h-3.5 w-3.5" style={{ color }} /> {label}
      </div>
      <p className="mt-1 font-display text-lg font-bold text-ink-primary">{value}</p>
    </div>
  );
}

export default function BattlePage() {
  const navigate = useNavigate();
  const { worldId, lessonId, difficultyId } = useParams();
  const [searchParams] = useSearchParams();
  const grade = searchParams.get("class");
  const board = searchParams.get("board");
  const subject = searchParams.get("subject");

  const battle = useMemo(
    () => getBattleData(grade, board, worldId, lessonId, difficultyId, subject),
    [grade, board, worldId, lessonId, difficultyId, subject]
  );

  const [index, setIndex] = useState(0);
  const [lives, setLives] = useState(TOTAL_LIVES);
  const [xpEarned, setXpEarned] = useState(0);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null); // "correct" | "wrong" | null
  const [timeLeft, setTimeLeft] = useState(battle?.questions[0]?.timer ?? 25);
  const [outcome, setOutcome] = useState(null); // "won" | "lost" | null
  const [enemyHitFlash, setEnemyHitFlash] = useState(false);
  const timerRef = useRef(null);
  const advanceRef = useRef(null);
  const freezeRef = useRef(null);
  const rewardsRecordedRef = useRef(false);
  const startedAtRef = useRef(Date.now());
  const [timeTakenSec, setTimeTakenSec] = useState(0);

  // Section 20 â€” Power-Ups. Charges come from the persistent store so
  // buying more in the Shop carries in; run-level effects (Double XP,
  // Shield) stay active until consumed or the level ends, while
  // per-question effects (Hint Potion, Clue Hint) reset every
  // question so they can't be reused on one question.
  const [powerupCounts, setPowerupCounts] = useState(() => getPowerupCounts());
  const [activePowerups, setActivePowerups] = useState([]); // e.g. ["pu-doublexp", "pu-shield"]
  const [usedThisQuestion, setUsedThisQuestion] = useState([]);
  const [eliminatedOption, setEliminatedOption] = useState(null);
  const [clueText, setClueText] = useState(null);
  const [frozen, setFrozen] = useState(false);
  const [shieldPopped, setShieldPopped] = useState(false);
  // Section 16 â€” Drag and Drop. SequenceInput is controlled from here
  // (rather than owning its own submit-worthy state) so a wrong answer's
  // built order is still visible during the feedback pause, matching how
  // the options grid keeps the selected option highlighted.
  const [seqOrder, setSeqOrder] = useState([]);

  const question = battle?.questions[index];
  const total = battle?.questions.length ?? 0;
  const damagePerHit = total > 0 ? 100 / total : 100;
  const enemyHpPct = Math.max(0, 100 - correctCount * damagePerHit);

  // Countdown timer per question â€” pauses once an answer is locked in, or
  // while a Time Freeze charge is active.
  useEffect(() => {
    if (!question || feedback || outcome || frozen) return;
    if (timeLeft <= 0) {
      handleAnswer(null);
      return;
    }
    timerRef.current = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, question, feedback, outcome, frozen]);

  useEffect(() => {
    return () => {
      clearTimeout(advanceRef.current);
      clearTimeout(freezeRef.current);
    };
  }, []);

  function resetPerQuestionPowerups() {
    setUsedThisQuestion([]);
    setEliminatedOption(null);
    setClueText(null);
  }

  function handleUsePowerup(id) {
    if (feedback || outcome) return;
    if ((powerupCounts[id] ?? 0) <= 0) return;
    if (activePowerups.includes(id) || usedThisQuestion.includes(id)) return;

    const spent = usePowerupCharge(id);
    if (!spent) return;
    setPowerupCounts(getPowerupCounts());

    if (id === "pu-doublexp") {
      setActivePowerups((a) => [...a, "pu-doublexp"]);
    } else if (id === "pu-shield") {
      setActivePowerups((a) => [...a, "pu-shield"]);
    } else if (id === "pu-freeze") {
      setFrozen(true);
      clearTimeout(freezeRef.current);
      freezeRef.current = setTimeout(() => setFrozen(false), FREEZE_MS);
      setUsedThisQuestion((u) => [...u, "pu-freeze"]);
    } else if (id === "pu-hint") {
      // Fill in the Blank, Numerical, Match the Following, and Drag and
      // Drop (Section 16) have no flat options list to eliminate from.
      if (!isFreeTextQuestion(question) && !isMatchQuestion(question) && !isSequenceQuestion(question)) {
        const wrongOptions = question.options.filter((o) => o !== question.correctAnswer && o !== eliminatedOption);
        const pick = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
        if (pick) setEliminatedOption(pick);
      }
      setUsedThisQuestion((u) => [...u, "pu-hint"]);
    } else if (id === "pu-chemhint") {
      setClueText(getPowerupClue(question));
      setUsedThisQuestion((u) => [...u, "pu-chemhint"]);
    }
  }

  // Persist the win once, the moment the battle is decided â€” this is what
  // makes coins/XP earned here actually survive a refresh (Section 19) and
  // lets the Shop/Dashboard reflect it. Guarded so retrying a level doesn't
  // double-count a previous run's rewards into this effect's closure.
  useEffect(() => {
    if (outcome !== "won" || rewardsRecordedRef.current) return;
    rewardsRecordedRef.current = true;
    addRewards(xpEarned, coinsEarned);
    const accuracyPct = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    recordLessonCompletion(completionKey(grade, board, worldId, lessonId, difficultyId), {
      accuracy: accuracyPct,
      stars: starsForProgress(accuracyPct),
      xp: xpEarned,
      coins: coinsEarned,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outcome]);

  // Section: Level Complete "Time Taken" â€” captured once, the moment the
  // battle resolves (win or loss), rather than kept ticking after.
  useEffect(() => {
    if (!outcome) return;
    setTimeTakenSec((Date.now() - startedAtRef.current) / 1000);
  }, [outcome]);

  if (!battle) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-void px-6 text-center">
        <div className="hud-frame rounded-xl border border-panel-line bg-panel/60 p-8" style={{ "--hud-color": "#FCD34D" }}>
          <p className="font-display text-xl text-ink-primary">Battle not found</p>
          <p className="mt-2 font-body text-sm text-ink-muted">
            This lesson, difficulty, or curriculum combination isn't available yet.
          </p>
          <Link
            to={`/play/${worldId}/${lessonId}?class=${grade ?? ""}&board=${board ?? ""}${subject ? `&subject=${encodeURIComponent(subject)}` : ""}`}
            className="mt-5 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-neon-cyan underline"
          >
            <ChevronLeft className="h-4 w-4" /> Back to Difficulty Select
          </Link>
        </div>
      </div>
    );
  }

  function handleAnswer(option) {
    if (feedback || outcome) return;
    clearTimeout(timerRef.current);
    clearTimeout(freezeRef.current);
    setFrozen(false);
    const isCorrect =
      option != null &&
      (isMatchQuestion(question) || isSequenceQuestion(question) || isMultiSelectQuestion(question)
        ? isSpecialCorrect(question, option)
        : isFreeTextQuestion(question)
        ? isFreeTextCorrect(question, option)
        : option === question.correctAnswer);
    setSelected(option);

    // Shield (Section 20) absorbs exactly one wrong answer instead of a
    // life â€” it's consumed the moment it's needed, not on activation.
    const shieldActive = activePowerups.includes("pu-shield");
    const shieldSaves = !isCorrect && shieldActive;
    if (shieldSaves) {
      setActivePowerups((a) => a.filter((p) => p !== "pu-shield"));
      setShieldPopped(true);
      setTimeout(() => setShieldPopped(false), FEEDBACK_MS);
    }

    setFeedback(isCorrect ? "correct" : shieldSaves ? "shielded" : "wrong");

    if (isCorrect) {
      const doubleXp = activePowerups.includes("pu-doublexp");
      setCorrectCount((c) => c + 1);
      setXpEarned((x) => x + question.xp * (doubleXp ? 2 : 1));
      setCoinsEarned((c) => c + question.coins);
      setEnemyHitFlash(true);
      setTimeout(() => setEnemyHitFlash(false), 300);
    }

    const nextLives = isCorrect || shieldSaves ? lives : lives - 1;
    if (!isCorrect && !shieldSaves) setLives(nextLives);

    advanceRef.current = setTimeout(() => {
      if (!isCorrect && !shieldSaves && nextLives <= 0) {
        setOutcome("lost");
        return;
      }
      if (index + 1 >= total) {
        setOutcome("won");
        return;
      }
      setIndex((i) => i + 1);
      setSelected(null);
      setFeedback(null);
      setSeqOrder([]);
      setTimeLeft(battle.questions[index + 1].timer);
      resetPerQuestionPowerups();
    }, FEEDBACK_MS);
  }

  function resetRun() {
    clearTimeout(timerRef.current);
    clearTimeout(advanceRef.current);
    clearTimeout(freezeRef.current);
    rewardsRecordedRef.current = false;
    setIndex(0);
    setLives(TOTAL_LIVES);
    setXpEarned(0);
    setCoinsEarned(0);
    setCorrectCount(0);
    setSelected(null);
    setFeedback(null);
    setSeqOrder([]);
    setTimeLeft(battle.questions[0].timer);
    setOutcome(null);
    // Charges already spent stay spent (Section 20 â€” used is used), but a
    // fresh attempt starts with no run-level effects active and a clean
    // slate for the first question's per-question power-ups.
    setActivePowerups([]);
    setFrozen(false);
    resetPerQuestionPowerups();
    startedAtRef.current = Date.now();
    setTimeTakenSec(0);
  }

  const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  const stars = starsForProgress(accuracy);
  const accent = DIFFICULTY_ACCENTS[difficultyId] ?? "#38D9F4";

  if (outcome) {
    const backToLessonsHref = `/course/${worldId}?class=${grade ?? ""}&board=${board ?? ""}${subject ? `&subject=${encodeURIComponent(subject)}` : ""}`;
    const backToWorldMapHref = `/world?class=${grade ?? ""}&board=${board ?? ""}${subject ? `&subject=${encodeURIComponent(subject)}` : ""}`;
    // Section 13's unlock rule applies here too: clearing this tier at or
    // above its threshold (or it being the last tier, expert) opens the
    // next one immediately, so a clean win can chain straight into it
    // instead of dropping back to the lesson list every time.
    const tierIndex = DIFFICULTIES.findIndex((d) => d.id === difficultyId);
    const meetsThreshold =
      battle.difficulty.unlockThreshold == null || accuracy >= battle.difficulty.unlockThreshold;
    const nextDifficulty =
      outcome === "won" && meetsThreshold && tierIndex >= 0 ? DIFFICULTIES[tierIndex + 1] : null;
    const nextHref = nextDifficulty
      ? `/battle/${worldId}/${lessonId}/${nextDifficulty.id}?class=${grade ?? ""}&board=${board ?? ""}${subject ? `&subject=${encodeURIComponent(subject)}` : ""}`
      : backToLessonsHref;

    return (
      <ResultsScreen
        outcome={outcome}
        difficulty={battle.difficulty}
        stats={{
          xpEarned,
          coinsEarned,
          correct: correctCount,
          total,
          accuracy,
          stars,
          enemyName: battle.enemyName,
          timeTakenSec,
        }}
        hasNext={!!nextDifficulty}
        onRetry={resetRun}
        onBackToLessons={() => navigate(backToLessonsHref)}
        onBackToWorldMap={() => navigate(backToWorldMapHref)}
        onNextLevel={() => navigate(nextHref)}
      />
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-void pb-16">
      <div className="absolute inset-0 bg-radial-fade" />
      <div className="aurora-canvas pointer-events-none absolute inset-0" aria-hidden="true" />
      <ParticleField density={16} />

      {/* Top bar */}
      <div className="relative border-b border-panel-line/70 bg-void/70 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-4 lg:px-8">
          <Link
            to={`/play/${worldId}/${lessonId}?class=${grade ?? ""}&board=${board ?? ""}${subject ? `&subject=${encodeURIComponent(subject)}` : ""}`}
            className="flex items-center gap-2 text-ink-muted hover:text-ink-primary"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="font-mono text-xs uppercase tracking-widest">Quit Battle</span>
          </Link>

          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-neon-cyan" strokeWidth={2.2} />
            <span className="font-wordmark text-sm tracking-wide text-ink-primary">
              Learn<span className="text-neon-cyan">Quest</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span
              className="rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-widest"
              style={{ borderColor: `${accent}66`, color: accent }}
            >
              {battle.difficulty.label}
            </span>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* HUD strip: XP / coins / question count */}
      <div className="relative mx-auto mt-6 max-w-3xl px-6 lg:px-8">
        <div className="hud-frame flex items-center justify-between rounded-card border border-panel-line bg-panel/60 px-5 py-3 backdrop-blur-sm" style={{ "--hud-color": accent }}>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-mono text-sm text-reward-gold">
              <Sparkles className="h-4 w-4" /> {xpEarned} XP
              {activePowerups.includes("pu-doublexp") && (
                <span className="rounded-full bg-reward-gold/20 px-1.5 py-0.5 text-[10px] text-reward-gold">2x</span>
              )}
            </span>
            <span className="flex items-center gap-1.5 font-mono text-sm text-reward-gold/80">
              <Coins className="h-4 w-4" /> {coinsEarned}
            </span>
            {activePowerups.includes("pu-shield") && (
              <Icons.Shield className="h-4 w-4 text-neon-cyan" title="Shield active" />
            )}
          </div>
          <span className="font-mono text-xs uppercase tracking-widest text-ink-faint">
            Question {index + 1}/{total}
          </span>
          <span
            className={`flex items-center gap-1.5 font-mono text-sm ${
              frozen ? "text-neon-cyan" : timeLeft <= 5 ? "text-red-400" : "text-ink-muted"
            }`}
          >
            <TimerIcon className="h-4 w-4" /> {timeLeft}s {frozen && "â„ï¸"}
          </span>
        </div>
      </div>

      {/* VS arena */}
      <div className="relative mx-auto mt-8 flex max-w-3xl items-center justify-center gap-6 px-6 sm:gap-16 lg:px-8">
        <div className="flex flex-col items-center">
          <PlayerPortrait lives={lives} />
          {shieldPopped && (
            <span className="mt-1 flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-neon-cyan">
              <Icons.Shield className="h-3 w-3" /> Shield absorbed it!
            </span>
          )}
        </div>
        <div className="flex flex-col items-center gap-1">
          <Swords className="h-6 w-6 text-ink-faint" strokeWidth={1.6} />
          <span className="font-display text-xs font-bold uppercase tracking-widest text-ink-faint">
            VS
          </span>
        </div>
        <EnemyPortrait name={battle.enemyName} hpPct={enemyHpPct} hit={enemyHitFlash} />
      </div>

      {/* Power-up tray (Section 20) */}
      <div className="relative mx-auto mt-4 max-w-3xl px-6 lg:px-8">
        <PowerUpBar
          counts={powerupCounts}
          active={activePowerups}
          usedThisQuestion={usedThisQuestion}
          disabled={!!feedback || !!outcome}
          onUse={handleUsePowerup}
        />
      </div>

      {/* Question card */}
      <div className="relative mx-auto mt-6 max-w-2xl px-6 lg:px-8">
        <div
          className="hud-frame animate-fade-up rounded-card-lg border bg-panel/70 p-6 shadow-elevated backdrop-blur-sm sm:p-8"
          style={{ "--hud-color": accent, borderColor: `${accent}44` }}
        >
          <div className="mb-5 h-1.5 w-full overflow-hidden rounded-full bg-panel-line">
            <div
              className="h-full rounded-full transition-[width] duration-500 ease-out"
              style={{ width: `${Math.round(((index + (feedback ? 1 : 0)) / total) * 100)}%`, background: accent }}
            />
          </div>
          <div className="flex justify-center">
            <span
              className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest"
              style={{ borderColor: `${accent}55`, color: accent, backgroundColor: `${accent}14` }}
            >
              {getQuestionTypeLabel(question)}
            </span>
          </div>

          {question.image && (
            <div className="mt-4">
              <QuestionDiagram image={question.image} />
            </div>
          )}

          <p className="mt-3 text-center font-display text-xl font-semibold leading-snug text-ink-primary sm:text-2xl">
            {question.question}
          </p>

          {clueText && (
            <p className="mt-3 flex items-center justify-center gap-1.5 text-center font-mono text-xs text-reward-gold">
              <Icons.Lightbulb className="h-3.5 w-3.5" /> {clueText}
            </p>
          )}

          {isMatchQuestion(question) ? (
            <MatchPairsInput key={question.id} pairs={question.pairs} onSubmit={handleAnswer} disabled={!!feedback} />
          ) : isMultiSelectQuestion(question) ? (
            <MultiSelectInput key={question.id} options={question.options} onSubmit={handleAnswer} disabled={!!feedback} />
          ) : isSequenceQuestion(question) ? (
            <SequenceInput
              key={question.id}
              pool={question.options}
              order={seqOrder}
              disabled={!!feedback}
              onPick={(item) => {
                const next = [...seqOrder, item];
                setSeqOrder(next);
                if (next.length === question.options.length) handleAnswer(next);
              }}
              onRemove={(item) => setSeqOrder((o) => o.filter((x) => x !== item))}
            />
          ) : isFreeTextQuestion(question) ? (
            <>
              <FillBlankInput
                onSubmit={handleAnswer}
                disabled={!!feedback}
                numeric={question.type === "numerical"}
              />
              {feedback && (
                <div className="mt-4 text-center font-mono text-xs text-ink-muted">
                  Correct answer:{" "}
                  <span className="text-neon-green">{question.correctAnswer}</span>
                </div>
              )}
            </>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {question.options.map((opt, i) => {
              const isSelected = selected === opt;
              const isCorrectOpt = opt === question.correctAnswer;
              const isEliminated = opt === eliminatedOption && !feedback;
              let stateClasses =
                "border-panel-line bg-void/40 shadow-soft hover:-translate-y-0.5 hover:border-neon-cyan/50 hover:shadow-glow-cyan";
              if (feedback) {
                if (isCorrectOpt) {
                  stateClasses = "animate-answer-pop border-neon-green bg-neon-green/10 shadow-glow-green";
                } else if (isSelected && !isCorrectOpt) {
                  stateClasses = "border-red-400 bg-red-400/10";
                } else {
                  stateClasses = "border-panel-line bg-void/20 opacity-50";
                }
              } else if (isEliminated) {
                stateClasses = "border-panel-line/50 bg-void/10 opacity-30";
              }
              return (
                <button
                  key={i}
                  type="button"
                  disabled={!!feedback || isEliminated}
                  onClick={() => handleAnswer(opt)}
                  className={`flex items-center gap-3 rounded-card border px-4 py-3.5 text-left font-body text-sm text-ink-primary transition-all duration-200 ${stateClasses}`}
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border font-mono text-[11px] transition-colors ${
                      feedback && isCorrectOpt
                        ? "border-neon-green bg-neon-green/20 text-void"
                        : feedback && isSelected && !isCorrectOpt
                        ? "border-red-400 bg-red-400/20 text-red-400"
                        : "border-panel-line bg-panel/60 text-ink-muted"
                    }`}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className={isEliminated ? "line-through opacity-60" : ""}>{opt}</span>
                  {feedback && isCorrectOpt && (
                    <CheckCircle2 className="ml-auto h-4 w-4 shrink-0 text-neon-green" />
                  )}
                  {feedback && isSelected && !isCorrectOpt && (
                    <XCircle className="ml-auto h-4 w-4 shrink-0 text-red-400" />
                  )}
                </button>
              );
            })}
            </div>
          )}

          {feedback && (
            <div className="mt-6 rounded-card border border-panel-line bg-void/40 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wide">
                {feedback === "correct" ? (
                  <span className="flex items-center gap-1.5 text-neon-green">
                    <Swords className="h-4 w-4" /> Attack! +
                    {question.xp * (activePowerups.includes("pu-doublexp") ? 2 : 1)} XP
                    {activePowerups.includes("pu-doublexp") && " (2x)"} &middot; +{question.coins} Coins
                  </span>
                ) : feedback === "shielded" ? (
                  <span className="flex items-center gap-1.5 text-neon-cyan">
                    <Icons.Shield className="h-4 w-4" /> Shield Broken â€” Life Protected
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-red-400">
                    <Heart className="h-4 w-4" /> {selected == null ? "Time's up!" : "Wrong!"} -1 Life
                  </span>
                )}
              </div>
              <p className="mt-2 font-body text-xs leading-relaxed text-ink-muted">
                {question.explanation}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
