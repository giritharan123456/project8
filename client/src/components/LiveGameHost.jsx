import { useState, useEffect, useCallback, useRef } from "react";
import {
  Gamepad2,
  Users,
  Clock,
  Play,
  Square,
  ChevronRight,
  Copy,
  Check,
  BarChart3,
  Trophy,
  Download,
  Save,
  Settings,
  Zap,
  Target,
  Swords,
  Skull,
  ArrowLeft,
  Sparkles,
  Medal,
  Crown,
  Timer,
} from "lucide-react";
import Confetti from "./Confetti.jsx";
import ParticleField from "./ParticleField.jsx";
import {
  exportToExcel,
  exportLeaderboardPDF,
} from "../lib/reportGenerator.js";

// â”€â”€ Mock data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const MOCK_QUIZZES = [
  { id: "chem-101", title: "Atomic Structure Basics", questionCount: 8, subject: "Chemistry" },
  { id: "chem-102", title: "Chemical Bonding", questionCount: 10, subject: "Chemistry" },
  { id: "math-201", title: "Algebra Fundamentals", questionCount: 8, subject: "Mathematics" },
  { id: "bio-101", title: "Cell Biology", questionCount: 6, subject: "Biology" },
];

const MOCK_HOST_QUESTIONS = [
  { id: 1, q: "What is the atomic number of Oxygen?", options: ["6", "7", "8", "9"], answer: "8" },
  { id: 2, q: "Which compound is table salt?", options: ["KCl", "NaCl", "CaCO3", "NaOH"], answer: "NaCl" },
  { id: 3, q: "What is the symbol for Gold?", options: ["Go", "Gd", "Au", "Ag"], answer: "Au" },
  { id: 4, q: "How many elements are in H2SO4?", options: ["2", "3", "4", "7"], answer: "3" },
  { id: 5, q: "What is the pH of a neutral solution?", options: ["0", "5", "7", "14"], answer: "7" },
  { id: 6, q: "Which gas do plants absorb?", options: ["Oxygen", "Nitrogen", "CO2", "Hydrogen"], answer: "CO2" },
];

const MOCK_LOBBY_PLAYERS = [
  { id: 1, name: "Alex K.", avatar: "Beaker", joined: true },
  { id: 2, name: "Priya S.", avatar: "TestTubes", joined: true },
  { id: 3, name: "Jordan M.", avatar: "Atom", joined: true },
  { id: 4, name: "Sam T.", avatar: "Microscope", joined: true },
  { id: 5, name: "Maya R.", avatar: "Dna", joined: true },
  { id: 6, name: "Ravi P.", avatar: "Brain", joined: true },
];

const GAME_MODES = [
  { id: "classic", label: "Classic", icon: Gamepad2, description: "Individual competition" },
  { id: "team", label: "Team", icon: Users, description: "Team-based play" },
  { id: "survival", label: "Survival", icon: Skull, description: "Last player standing" },
];

const HOST_SCREENS = {
  SETUP: "setup",
  PIN: "pin",
  LOBBY: "lobby",
  LIVE: "live",
  RESULTS: "results",
};

function generatePIN() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// â”€â”€ Helper components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function AnswerBar({ label, count, total, color }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2">
      <span
        className="flex h-7 w-7 items-center justify-center rounded font-mono text-[10px] font-bold"
        style={{ backgroundColor: `${color}25`, color }}
      >
        {label}
      </span>
      <div className="flex-1 h-6 overflow-hidden rounded bg-panel-line/50">
        <div
          className="h-full rounded transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="w-8 text-right font-mono text-xs font-bold text-ink-primary">
        {count}
      </span>
    </div>
  );
}

function PlayerAvatar({ name }) {
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-arcane-purple/15">
      <span className="font-display text-xs font-bold text-arcane-purple">
        {name?.[0] ?? "?"}
      </span>
    </div>
  );
}

// â”€â”€ Main component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function LiveGameHost({ onClose }) {
  const [screen, setScreen] = useState(HOST_SCREENS.SETUP);
  const [pin] = useState(generatePIN);
  const [copied, setCopied] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [gameMode, setGameMode] = useState("classic");
  const [timePerQuestion, setTimePerQuestion] = useState(20);
  const [players, setPlayers] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answerCounts, setAnswerCounts] = useState({});
  const [livePlayers, setLivePlayers] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameResults, setGameResults] = useState(null);
  const timerRef = useRef(null);

  const questions = MOCK_HOST_QUESTIONS;
  const question = questions[currentQ];
  const COLORS = ["#806BFF", "#38D9F4", "#4ADE80", "#FCD34D"];

  // Simulate players joining
  useEffect(() => {
    if (screen === HOST_SCREENS.LOBBY) {
      let idx = 0;
      const interval = setInterval(() => {
        if (idx < MOCK_LOBBY_PLAYERS.length) {
          setPlayers((prev) => [...prev, MOCK_LOBBY_PLAYERS[idx]]);
          idx++;
        } else {
          clearInterval(interval);
        }
      }, 600);
      return () => clearInterval(interval);
    }
  }, [screen]);

  // Timer for live game
  useEffect(() => {
    if (!gameStarted || screen !== HOST_SCREENS.LIVE) {
      clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [gameStarted, screen, currentQ]);

  // Simulate answer distribution updates during live game
  useEffect(() => {
    if (!gameStarted || screen !== HOST_SCREENS.LIVE || !question) return;
    setAnswerCounts({});
    const totalPlayers = Math.max(players.length, 4);
    let tick = 0;
    const interval = setInterval(() => {
      tick++;
      if (tick > 12) {
        clearInterval(interval);
        return;
      }
      const correctIdx = question.options.indexOf(question.answer);
      setAnswerCounts((prev) => {
        const next = { ...prev };
        const optIdx = Math.random() < 0.6 ? correctIdx : Math.floor(Math.random() * 4);
        const key = question.options[optIdx];
        next[key] = (next[key] || 0) + 1;
        return next;
      });
    }, 300);
    return () => clearInterval(interval);
  }, [currentQ, gameStarted, screen]);

  const handleCopyPIN = useCallback(() => {
    navigator.clipboard?.writeText(pin).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [pin]);

  const handleStartGame = useCallback(() => {
    setGameStarted(true);
    setScreen(HOST_SCREENS.LIVE);
    setCurrentQ(0);
    setTimeLeft(timePerQuestion);
    setLivePlayers(
      players.map((p) => ({ ...p, score: 0, correct: 0, streak: 0 }))
    );
  }, [players, timePerQuestion]);

  const handleNextQuestion = useCallback(() => {
    // Update live players with simulated scores
    setLivePlayers((prev) =>
      prev.map((p) => ({
        ...p,
        score: p.score + Math.floor(Math.random() * 150),
        correct: p.correct + (Math.random() < 0.6 ? 1 : 0),
      }))
    );

    if (currentQ + 1 >= questions.length) {
      clearInterval(timerRef.current);
      // Build final results
      setLivePlayers((prev) => {
        const sorted = [...prev].sort((a, b) => b.score - a.score);
        setGameResults({
          totalPlayers: sorted.length,
          avgAccuracy: Math.round(
            (sorted.reduce((s, p) => s + p.correct, 0) /
              (sorted.length * questions.length)) *
              100
          ),
          avgTime: Math.round(timePerQuestion * 0.6),
          leaderboard: sorted,
        });
        return prev;
      });
      setScreen(HOST_SCREENS.RESULTS);
    } else {
      setCurrentQ((c) => c + 1);
      setTimeLeft(timePerQuestion);
      setAnswerCounts({});
    }
  }, [currentQ, questions.length, timePerQuestion]);

  const handleEndGame = useCallback(() => {
    clearInterval(timerRef.current);
    const sorted = [...livePlayers].sort((a, b) => b.score - a.score);
    setGameResults({
      totalPlayers: sorted.length,
      avgAccuracy: Math.round(
        (sorted.reduce((s, p) => s + p.correct, 0) /
          (sorted.length * questions.length)) *
          100
      ),
      avgTime: Math.round(timePerQuestion * 0.6),
      leaderboard: sorted,
    });
    setScreen(HOST_SCREENS.RESULTS);
  }, [livePlayers, timePerQuestion, questions.length]);

  const handleExportExcel = useCallback(() => {
    if (!gameResults) return;
    exportToExcel(
      gameResults.leaderboard.map((p, i) => ({
        Rank: i + 1,
        Name: p.name,
        Score: p.score,
        Correct: p.correct,
      })),
      `game-results-${pin}`
    );
  }, [gameResults, pin]);

  const handleExportPDF = useCallback(() => {
    if (!gameResults) return;
    exportLeaderboardPDF(
      gameResults.leaderboard.map((p, i) => ({
        name: p.name,
        xp: p.score,
        level: 0,
        accuracy: Math.round((p.correct / questions.length) * 100),
      })),
      `Game Results â€” PIN ${pin}`
    );
  }, [gameResults, pin, questions.length]);

  // â”€â”€ Setup screen â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (screen === HOST_SCREENS.SETUP) {
    return (
      <div className="relative min-h-screen bg-void px-4 py-8 sm:px-6">
        <div className="absolute inset-0 bg-radial-fade" />
        <div className="relative z-10 mx-auto max-w-lg">
          <button
            onClick={onClose}
            className="mb-4 flex items-center gap-1 text-ink-muted hover:text-ink-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-body text-xs">Close</span>
          </button>

          <h1 className="font-display text-2xl font-bold text-ink-primary">
            Host Live Game
          </h1>
          <p className="mt-1 font-body text-sm text-ink-muted">
            Set up your game and share the PIN with students
          </p>

          <div className="mt-6 space-y-6">
            {/* Quiz selection */}
            <div>
              <label className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-ink-faint">
                Select Quiz
              </label>
              <div className="space-y-2">
                {MOCK_QUIZZES.map((quiz) => (
                  <button
                    key={quiz.id}
                    onClick={() => setSelectedQuiz(quiz)}
                    className={`w-full rounded-xl border px-4 py-3 text-left transition-all ${
                      selectedQuiz?.id === quiz.id
                        ? "border-arcane-purple/60 bg-arcane-purple/10"
                        : "border-panel-line bg-panel/40 hover:border-panel-line/80"
                    }`}
                  >
                    <p className="font-display text-sm font-bold text-ink-primary">
                      {quiz.title}
                    </p>
                    <p className="mt-0.5 font-body text-[11px] text-ink-muted">
                      {quiz.questionCount} questions Â· {quiz.subject}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Game mode */}
            <div>
              <label className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-ink-faint">
                Game Mode
              </label>
              <div className="grid grid-cols-3 gap-2">
                {GAME_MODES.map((mode) => {
                  const Icon = mode.icon;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => setGameMode(mode.id)}
                      className={`flex flex-col items-center gap-1.5 rounded-xl border px-3 py-3 transition-all ${
                        gameMode === mode.id
                          ? "border-neon-cyan/60 bg-neon-cyan/10"
                          : "border-panel-line bg-panel/40 hover:border-panel-line/80"
                      }`}
                    >
                      <Icon className="h-5 w-5 text-ink-muted" />
                      <span className="font-display text-xs font-bold text-ink-primary">
                        {mode.label}
                      </span>
                      <span className="font-body text-[9px] text-ink-faint">
                        {mode.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time per question */}
            <div>
              <label className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-ink-faint">
                Time per Question: {timePerQuestion}s
              </label>
              <input
                type="range"
                min={10}
                max={60}
                step={5}
                value={timePerQuestion}
                onChange={(e) => setTimePerQuestion(Number(e.target.value))}
                className="w-full accent-arcane-purple"
              />
              <div className="flex justify-between font-mono text-[10px] text-ink-faint">
                <span>10s</span>
                <span>60s</span>
              </div>
            </div>

            <button
              onClick={() => setScreen(HOST_SCREENS.PIN)}
              disabled={!selectedQuiz}
              className="w-full rounded-xl bg-arcane-purple py-3 font-display text-sm font-bold uppercase tracking-widest text-white shadow-glow-purple transition-all hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Generate Game PIN
            </button>
          </div>
        </div>
      </div>
    );
  }

  // â”€â”€ PIN display screen â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (screen === HOST_SCREENS.PIN) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-void px-4 py-16">
        <div className="absolute inset-0 bg-radial-fade" />
        <ParticleField density={20} />

        <div className="relative z-10 w-full max-w-md text-center">
          <h2 className="font-display text-lg font-bold text-ink-primary mb-2">
            Share this PIN with your students
          </h2>
          <p className="font-body text-sm text-ink-muted mb-6">
            {selectedQuiz?.title}
          </p>

          <div className="hud-frame rounded-2xl border border-arcane-purple/40 bg-panel/80 p-10 backdrop-blur-sm">
            <p className="font-mono text-6xl font-bold tracking-[0.2em] text-arcane-purple">
              {pin}
            </p>
          </div>

          <button
            onClick={handleCopyPIN}
            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-panel-line bg-panel/60 px-6 py-2.5 font-display text-sm font-bold text-ink-primary transition-all hover:border-neon-cyan/40"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-neon-green" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy PIN
              </>
            )}
          </button>

          <button
            onClick={() => setScreen(HOST_SCREENS.LOBBY)}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-arcane-purple py-3 font-display text-sm font-bold uppercase tracking-widest text-white shadow-glow-purple transition-all hover:brightness-110"
          >
            Continue to Lobby
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  // â”€â”€ Lobby screen â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (screen === HOST_SCREENS.LOBBY) {
    return (
      <div className="relative min-h-screen bg-void px-4 py-8 sm:px-6">
        <div className="absolute inset-0 bg-radial-fade" />
        <div className="relative z-10 mx-auto max-w-lg">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold text-ink-primary">
                Lobby
              </h2>
              <p className="font-body text-xs text-ink-muted">
                {selectedQuiz?.title} Â· PIN: {pin}
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-panel/60 px-3 py-1.5">
              <Users className="h-4 w-4 text-neon-cyan" />
              <span className="font-mono text-sm font-bold text-neon-cyan">
                {players.length}
              </span>
            </div>
          </div>

          {/* PIN display */}
          <div className="mb-4 rounded-xl border border-arcane-purple/40 bg-panel/60 p-4 text-center">
            <p className="font-mono text-3xl font-bold tracking-[0.2em] text-arcane-purple">
              {pin}
            </p>
          </div>

          {/* Player list */}
          <div className="rounded-xl border border-panel-line bg-panel/60 p-4">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-ink-faint">
              Connected Players
            </p>
            {players.length === 0 ? (
              <p className="py-6 text-center font-body text-sm text-ink-faint">
                Waiting for players to join...
              </p>
            ) : (
              <div className="space-y-2">
                {players.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 rounded-lg bg-panel-line/30 px-3 py-2 animate-pop-in"
                  >
                    <PlayerAvatar name={p.name} />
                    <span className="font-display text-sm font-semibold text-ink-primary">
                      {p.name}
                    </span>
                    <Check className="ml-auto h-4 w-4 text-neon-green" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleStartGame}
            disabled={players.length === 0}
            className="mt-6 w-full flex items-center justify-center gap-2 rounded-xl bg-neon-green py-3 font-display text-sm font-bold uppercase tracking-widest text-void shadow-glow-green transition-all hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Play className="h-4 w-4" />
            Start Game ({players.length} players)
          </button>
        </div>
      </div>
    );
  }

  // â”€â”€ Live game screen â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (screen === HOST_SCREENS.LIVE && question) {
    const sortedPlayers = [...livePlayers].sort((a, b) => b.score - a.score);
    const totalAnswered = Object.values(answerCounts).reduce((s, c) => s + c, 0);

    return (
      <div className="relative min-h-screen bg-void px-4 py-6 sm:px-6">
        <div className="absolute inset-0 bg-radial-fade" />

        <div className="relative z-10 mx-auto max-w-6xl">
          {/* Top bar */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
                Q{currentQ + 1}/{questions.length}
              </span>
              <span className="rounded-lg bg-arcane-purple/15 px-2 py-0.5 font-mono text-xs font-bold text-arcane-purple">
                PIN: {pin}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-lg bg-panel/60 px-2 py-1">
                <Timer className="h-3.5 w-3.5 text-ink-muted" />
                <span
                  className={`font-mono text-sm font-bold ${
                    timeLeft <= 5
                      ? "text-red-400"
                      : timeLeft <= 10
                      ? "text-reward-gold"
                      : "text-neon-green"
                  }`}
                >
                  {timeLeft}s
                </span>
              </div>
              <div className="flex items-center gap-1 rounded-lg bg-panel/60 px-2 py-1">
                <Users className="h-3.5 w-3.5 text-ink-muted" />
                <span className="font-mono text-sm font-bold text-neon-cyan">
                  {players.length}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_280px]">
            {/* Main content */}
            <div>
              {/* Timer bar */}
              <div className="mb-4 h-2.5 w-full overflow-hidden rounded-full bg-panel-line">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-linear"
                  style={{
                    width: `${(timeLeft / timePerQuestion) * 100}%`,
                    backgroundColor:
                      timeLeft > timePerQuestion * 0.5
                        ? "#4ADE80"
                        : timeLeft > timePerQuestion * 0.25
                        ? "#FCD34D"
                        : "#F87171",
                  }}
                />
              </div>

              {/* Question */}
              <div className="hud-frame rounded-2xl border border-panel-line bg-panel/70 p-6 backdrop-blur-sm">
                <p className="font-display text-lg font-bold text-ink-primary sm:text-xl leading-relaxed">
                  {question.q}
                </p>
              </div>

              {/* Answer distribution */}
              <div className="mt-4 rounded-xl border border-panel-line bg-panel/60 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-ink-muted" />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
                    Live Answer Distribution ({totalAnswered} responses)
                  </span>
                </div>
                <div className="space-y-2">
                  {question.options.map((opt, i) => (
                    <AnswerBar
                      key={opt}
                      label={String.fromCharCode(65 + i)}
                      count={answerCounts[opt] || 0}
                      total={Math.max(totalAnswered, 1)}
                      color={COLORS[i % COLORS.length]}
                    />
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-4 flex gap-3">
                <button
                  onClick={handleNextQuestion}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-neon-green py-3 font-display text-sm font-bold uppercase tracking-widest text-void shadow-glow-green transition-all hover:brightness-110"
                >
                  {currentQ + 1 >= questions.length ? (
                    "End Game"
                  ) : (
                    <>
                      Next Question
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </button>
                <button
                  onClick={handleEndGame}
                  className="flex items-center justify-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-6 py-3 font-display text-sm font-bold text-red-400 transition-all hover:bg-red-500/20"
                >
                  <Square className="h-4 w-4" />
                  End
                </button>
              </div>
            </div>

            {/* Leaderboard sidebar */}
            <div className="rounded-xl border border-panel-line bg-panel/60 p-4">
              <div className="mb-3 flex items-center gap-2">
                <Trophy className="h-4 w-4 text-reward-gold" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
                  Leaderboard
                </span>
              </div>
              <div className="space-y-1.5 max-h-[60vh] overflow-y-auto">
                {sortedPlayers.map((p, i) => (
                  <div
                    key={p.id}
                    className={`flex items-center gap-2 rounded-lg px-2 py-1.5 ${
                      i < 3 ? "bg-reward-gold/5" : ""
                    }`}
                  >
                    <span
                      className="w-5 text-center font-mono text-[10px] font-bold"
                      style={{
                        color:
                          i === 0
                            ? "#FFD700"
                            : i === 1
                            ? "#C0C0C0"
                            : i === 2
                            ? "#CD7F32"
                            : "#6B7280",
                      }}
                    >
                      {i + 1}
                    </span>
                    <PlayerAvatar name={p.name} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-xs font-semibold text-ink-primary">
                        {p.name}
                      </p>
                    </div>
                    <span className="font-mono text-xs font-bold text-ink-primary">
                      {p.score}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // â”€â”€ Results screen â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (screen === HOST_SCREENS.RESULTS && gameResults) {
    const top3 = gameResults.leaderboard.slice(0, 3);
    const podiumOrder = [top3[1], top3[0], top3[2]];
    const podiumHeights = [100, 140, 80];
    const podiumColors = ["#C0C0C0", "#FFD700", "#CD7F32"];
    const medals = ["ðŸ¥ˆ", "ðŸ¥‡", "ðŸ¥‰"];

    return (
      <div className="relative min-h-screen bg-void px-4 py-8 sm:px-6">
        <div className="absolute inset-0 bg-radial-fade" />
        <ParticleField density={25} />
        <Confetti />

        <div className="relative z-10 mx-auto max-w-2xl">
          <h1 className="mb-2 text-center font-display text-3xl font-bold text-reward-gold">
            Game Complete!
          </h1>
          <p className="mb-8 text-center font-body text-sm text-ink-muted">
            {selectedQuiz?.title} Â· PIN: {pin}
          </p>

          {/* Podium */}
          <div className="mb-8 flex items-end justify-center gap-3">
            {podiumOrder.map((player, i) => {
              if (!player) return <div key={i} className="w-20" />;
              const height = podiumHeights[i];
              const color = podiumColors[i];
              const isFirst = i === 1;
              return (
                <div key={player.id} className="flex flex-col items-center">
                  {isFirst && <span className="text-xl mb-1">{medals[i]}</span>}
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full border-2 mb-2 ${
                      isFirst ? "bg-reward-gold/15" : "bg-panel/60"
                    }`}
                    style={{ borderColor: color }}
                  >
                    <span className="font-display text-xs font-bold" style={{ color }}>
                      {player.name[0]}
                    </span>
                  </div>
                  <span className="font-display text-xs font-bold text-ink-primary max-w-[4.5rem] truncate">
                    {player.name}
                  </span>
                  <span className="font-mono text-[10px] text-reward-gold">
                    {player.score} pts
                  </span>
                  {!isFirst && <span className="mt-1 text-lg">{medals[i]}</span>}
                  <div
                    className="mt-2 w-20 rounded-t-lg border border-b-0"
                    style={{
                      height,
                      backgroundColor: `${color}25`,
                      borderColor: `${color}40`,
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Game stats */}
          <div className="mb-6 grid grid-cols-3 gap-3">
            {[
              { label: "Players", value: gameResults.totalPlayers, icon: Users, color: "#38D9F4" },
              { label: "Avg Accuracy", value: `${gameResults.avgAccuracy}%`, icon: Target, color: "#4ADE80" },
              { label: "Avg Time", value: `${gameResults.avgTime}s`, icon: Clock, color: "#FCD34D" },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="rounded-xl border bg-panel/60 p-3 text-center"
                  style={{ borderColor: `${stat.color}40` }}
                >
                  <Icon className="mx-auto h-4 w-4" style={{ color: stat.color }} />
                  <p className="mt-1 font-mono text-sm font-bold text-ink-primary">
                    {stat.value}
                  </p>
                  <p className="font-body text-[10px] text-ink-faint">{stat.label}</p>
                </div>
              );
            })}
          </div>

          {/* Full leaderboard */}
          <div className="mb-6 rounded-xl border border-panel-line bg-panel/60 overflow-hidden">
            <div className="grid grid-cols-4 gap-0 border-b border-panel-line px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-ink-faint">
              <span>#</span>
              <span>Player</span>
              <span className="text-center">Correct</span>
              <span className="text-right">Score</span>
            </div>
            {gameResults.leaderboard.map((p, i) => (
              <div
                key={p.id}
                className="grid grid-cols-4 items-center gap-0 px-4 py-2 border-b border-panel-line/50 last:border-0"
              >
                <span
                  className="font-mono text-xs font-bold"
                  style={{
                    color:
                      i === 0 ? "#FFD700" : i === 1 ? "#C0C0C0" : i === 2 ? "#CD7F32" : "#6B7280",
                  }}
                >
                  {i + 1}
                </span>
                <span className="font-display text-xs font-semibold text-ink-primary truncate">
                  {p.name}
                </span>
                <span className="text-center font-mono text-xs text-ink-primary">
                  {p.correct}/{questions.length}
                </span>
                <span className="text-right font-mono text-xs font-bold text-ink-primary">
                  {p.score}
                </span>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleExportExcel}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-panel-line bg-panel/60 py-3 font-display text-sm font-bold uppercase tracking-widest text-ink-primary transition-all hover:border-neon-cyan/40"
            >
              <Download className="h-4 w-4" />
              Export Excel
            </button>
            <button
              onClick={handleExportPDF}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-panel-line bg-panel/60 py-3 font-display text-sm font-bold uppercase tracking-widest text-ink-primary transition-all hover:border-neon-cyan/40"
            >
              <Download className="h-4 w-4" />
              Export PDF
            </button>
            <button
              onClick={onClose}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-arcane-purple py-3 font-display text-sm font-bold uppercase tracking-widest text-white shadow-glow-purple transition-all hover:brightness-110"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
