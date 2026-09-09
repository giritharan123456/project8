import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Gamepad2,
  Trophy,
  Medal,
  Crown,
  Coins,
  Sparkles,
  Flame,
  ArrowLeft,
  Users,
  Timer,
  CheckCircle2,
  XCircle,
  ChevronRight,
  RotateCcw,
  Home,
  Zap,
  Star,
} from "lucide-react";
import Confetti from "../components/Confetti.jsx";
import ParticleField from "../components/ParticleField.jsx";
import { MOCK_PLAYER } from "../data/content.js";

// â”€â”€ Mock data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const MOCK_QUIZ_QUESTIONS = [
  {
    id: 1,
    q: "What is the atomic number of Oxygen?",
    options: ["6", "7", "8", "9"],
    answer: "8",
    timeLimit: 20,
  },
  {
    id: 2,
    q: "Which compound is known as table salt?",
    options: ["KCl", "NaCl", "CaCO3", "NaOH"],
    answer: "NaCl",
    timeLimit: 20,
  },
  {
    id: 3,
    q: "What is the chemical symbol for Gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    answer: "Au",
    timeLimit: 15,
  },
  {
    id: 4,
    q: "How many elements are in H2SO4?",
    options: ["2", "3", "4", "7"],
    answer: "3",
    timeLimit: 20,
  },
  {
    id: 5,
    q: "What is the pH of a neutral solution?",
    options: ["0", "5", "7", "14"],
    answer: "7",
    timeLimit: 15,
  },
  {
    id: 6,
    q: "Which gas do plants absorb during photosynthesis?",
    options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
    answer: "Carbon Dioxide",
    timeLimit: 20,
  },
  {
    id: 7,
    q: "What type of element is Iron (Fe)?",
    options: ["Non-metal", "Metal", "Noble gas", "Metalloid"],
    answer: "Metal",
    timeLimit: 15,
  },
  {
    id: 8,
    q: "What is the formula for water?",
    options: ["HO2", "H2O", "H2O2", "OH"],
    answer: "H2O",
    timeLimit: 15,
  },
];

const MOCK_PLAYERS = [
  { id: 1, name: "Chemist", avatar: "GraduationCap", score: 0, streak: 0, rank: 1 },
  { id: 2, name: "Alex K.", avatar: "Beaker", score: 0, streak: 0, rank: 2 },
  { id: 3, name: "Priya S.", avatar: "TestTubes", score: 0, streak: 0, rank: 3 },
  { id: 4, name: "Jordan M.", avatar: "Atom", score: 0, streak: 0, rank: 4 },
  { id: 5, name: "Sam T.", avatar: "Microscope", score: 0, streak: 0, rank: 5 },
  { id: 6, name: "Maya R.", avatar: "Dna", score: 0, streak: 0, rank: 6 },
  { id: 7, name: "Ravi P.", avatar: "Brain", score: 0, streak: 0, rank: 7 },
  { id: 8, name: "Zoe L.", avatar: "Heart", score: 0, streak: 0, rank: 8 },
];

const SCREENS = {
  JOIN: "join",
  WAITING: "waiting",
  QUESTION: "question",
  FEEDBACK: "feedback",
  PODIUM: "podium",
};

const TEAM_COLORS = ["#806BFF", "#38D9F4", "#4ADE80", "#FCD34D"];

// â”€â”€ Helper components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function TimerBar({ timeLeft, totalTime }) {
  const pct = totalTime > 0 ? (timeLeft / totalTime) * 100 : 0;
  const color =
    pct > 50 ? "#4ADE80" : pct > 25 ? "#FCD34D" : "#F87171";

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        <Timer className="h-4 w-4 text-ink-muted" />
        <span
          className="font-mono text-sm font-bold"
          style={{ color }}
        >
          {timeLeft}s
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-panel-line">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-linear"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function StreakBadge({ streak }) {
  if (streak < 2) return null;
  return (
    <div className="flex items-center gap-1 rounded-lg bg-reward-gold/15 px-2 py-1">
      <Flame className="h-3.5 w-3.5 text-reward-gold" />
      <span className="font-mono text-xs font-bold text-reward-gold">
        {streak}x
      </span>
    </div>
  );
}

function ScoreDisplay({ score }) {
  return (
    <div className="flex items-center gap-1.5 rounded-lg bg-panel/60 px-3 py-1.5">
      <Sparkles className="h-4 w-4 text-reward-gold" />
      <span className="font-display text-sm font-bold text-reward-gold">
        {score}
      </span>
    </div>
  );
}

function RankBadge({ rank }) {
  const colors = { 1: "#FFD700", 2: "#C0C0C0", 3: "#CD7F32" };
  const color = colors[rank] ?? "#3A3E68";
  return (
    <div
      className="flex items-center gap-1 rounded-lg px-2 py-1"
      style={{ backgroundColor: `${color}20` }}
    >
      <Medal className="h-3.5 w-3.5" style={{ color }} />
      <span
        className="font-mono text-xs font-bold"
        style={{ color }}
      >
        #{rank}
      </span>
    </div>
  );
}

// â”€â”€ Main component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function LiveGamePage() {
  const navigate = useNavigate();
  const [screen, setScreen] = useState(SCREENS.JOIN);
  const [pin, setPin] = useState("");
  const [displayName, setDisplayName] = useState(MOCK_PLAYER.name);
  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [players, setPlayers] = useState([]);
  const [teamMode, setTeamMode] = useState(false);
  const [teamScores, setTeamScores] = useState({});
  const timerRef = useRef(null);

  const question = MOCK_QUIZ_QUESTIONS[currentQ];
  const totalQuestions = MOCK_QUIZ_QUESTIONS.length;

  // Simulate joining a game with a random PIN
  const handleJoin = useCallback(() => {
    if (pin.length !== 6 || !displayName.trim()) return;
    // Simulate adding self to player list
    setPlayers([
      ...MOCK_PLAYERS.filter((p) => p.id !== 1),
      { id: 1, name: displayName.trim(), avatar: "GraduationCap", score: 0, streak: 0, rank: 1 },
    ]);
    setScreen(SCREENS.WAITING);
    // Auto-start after a short delay
    setTimeout(() => {
      setScreen(SCREENS.QUESTION);
      setTimeLeft(MOCK_QUIZ_QUESTIONS[0].timeLimit);
    }, 2500);
  }, [pin, displayName]);

  // Timer countdown
  useEffect(() => {
    if (screen !== SCREENS.QUESTION) {
      clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAnswer(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [screen, currentQ]);

  const handleAnswer = useCallback(
    (answer) => {
      clearInterval(timerRef.current);
      setSelectedAnswer(answer);
      const correct = answer === question?.answer;
      setIsCorrect(correct);

      if (correct) {
        const timeBonus = Math.max(0, timeLeft * 5);
        const streakBonus = streak * 25;
        const earned = 100 + timeBonus + streakBonus;
        setScore((s) => s + earned);
        setTotalXp((x) => x + earned);
        setStreak((s) => s + 1);
      } else {
        setStreak(0);
      }

      setScreen(SCREENS.FEEDBACK);

      // Update mock players' scores to simulate competition
      setPlayers((prev) =>
        prev
          .map((p) => ({
            ...p,
            score: p.score + (p.id === 1 ? 0 : Math.floor(Math.random() * 120)),
            streak: correct && p.id === 1 ? streak + 1 : p.streak,
          }))
          .sort((a, b) => b.score - a.score)
          .map((p, i) => ({ ...p, rank: i + 1 }))
      );
    },
    [question, timeLeft, streak]
  );

  const handleNextQuestion = useCallback(() => {
    if (currentQ + 1 >= totalQuestions) {
      setScreen(SCREENS.PODIUM);
    } else {
      setCurrentQ((c) => c + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setScreen(SCREENS.QUESTION);
      setTimeLeft(MOCK_QUIZ_QUESTIONS[currentQ + 1].timeLimit);
    }
  }, [currentQ, totalQuestions]);

  const myRank = players.find((p) => p.id === 1)?.rank ?? 1;

  // â”€â”€ Join screen â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (screen === SCREENS.JOIN) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-void px-4 py-16">
        <div className="absolute inset-0 bg-radial-fade" />
      <div className="aurora-canvas pointer-events-none absolute inset-0" aria-hidden="true" />
        <ParticleField density={20} />

        <div className="hud-frame relative z-10 w-full max-w-sm rounded-2xl border border-panel-line bg-panel/80 p-8 backdrop-blur-sm">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center gap-1 text-ink-muted hover:text-ink-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-body text-xs">Back</span>
          </button>

          <div className="flex flex-col items-center text-center mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-arcane-purple/15 mb-3">
              <Gamepad2 className="h-7 w-7 text-arcane-purple" />
            </div>
            <h1 className="font-display text-2xl font-bold text-ink-primary">
              Join Live Game
            </h1>
            <p className="mt-1 font-body text-sm text-ink-muted">
              Enter the Game PIN from your host
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-ink-faint">
                Game PIN
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={pin}
                onChange={(e) =>
                  setPin(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="000000"
                className="w-full rounded-xl border border-panel-line bg-void/50 px-4 py-3 text-center font-mono text-2xl font-bold tracking-[0.3em] text-ink-primary placeholder:text-ink-faint/40 focus:border-arcane-purple/60 focus:outline-none focus:ring-1 focus:ring-arcane-purple/40 transition-colors"
              />
            </div>

            <div>
              <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-ink-faint">
                Display Name
              </label>
              <input
                type="text"
                maxLength={20}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-xl border border-panel-line bg-void/50 px-4 py-2.5 font-display text-sm font-semibold text-ink-primary placeholder:text-ink-faint/40 focus:border-neon-cyan/60 focus:outline-none focus:ring-1 focus:ring-neon-cyan/40 transition-colors"
              />
            </div>

            <button
              onClick={handleJoin}
              disabled={pin.length !== 6 || !displayName.trim()}
              className="w-full rounded-xl bg-arcane-purple py-3 font-display text-sm font-bold uppercase tracking-widest text-white shadow-glow-purple transition-all hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Join Game
            </button>
          </div>
        </div>
      </div>
    );
  }

  // â”€â”€ Waiting room â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (screen === SCREENS.WAITING) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-void px-4 py-16">
        <div className="absolute inset-0 bg-radial-fade" />
      <div className="aurora-canvas pointer-events-none absolute inset-0" aria-hidden="true" />
        <ParticleField density={15} />

        <div className="hud-frame relative z-10 w-full max-w-sm rounded-2xl border border-panel-line bg-panel/80 p-8 backdrop-blur-sm text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-neon-cyan/15 mx-auto mb-4">
            <Users className="h-7 w-7 text-neon-cyan" />
          </div>
          <h2 className="font-display text-xl font-bold text-ink-primary">
            Waiting for host to start...
          </h2>
          <p className="mt-2 font-body text-sm text-ink-muted">
            {players.length} player{players.length !== 1 ? "s" : ""} connected
          </p>
          <div className="mt-4 flex justify-center gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-2 w-2 rounded-full bg-arcane-purple animate-pulse"
                style={{ animationDelay: `${i * 300}ms` }}
              />
            ))}
          </div>
          <div className="mt-6 grid grid-cols-2 gap-2">
            {players.slice(0, 6).map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-2 rounded-lg bg-panel-line/50 px-2 py-1.5"
              >
                <div className="h-5 w-5 rounded-full bg-arcane-purple/20 flex items-center justify-center">
                  <span className="font-mono text-[8px] font-bold text-arcane-purple">
                    {p.name[0]}
                  </span>
                </div>
                <span className="truncate font-body text-xs text-ink-primary">
                  {p.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // â”€â”€ Question screen â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (screen === SCREENS.QUESTION && question) {
    return (
      <div className="relative flex min-h-screen flex-col overflow-hidden bg-void px-4 py-6 sm:px-6">
        <div className="absolute inset-0 bg-radial-fade" />
      <div className="aurora-canvas pointer-events-none absolute inset-0" aria-hidden="true" />

        {/* Top bar */}
        <div className="relative z-10 mx-auto w-full max-w-lg">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
              Q{currentQ + 1}/{totalQuestions}
            </span>
            <StreakBadge streak={streak} />
            <ScoreDisplay score={score} />
          </div>

          <TimerBar timeLeft={timeLeft} totalTime={question.timeLimit} />

          <div className="mt-1 flex items-center justify-between">
            <RankBadge rank={myRank} />
            <span className="font-body text-xs text-ink-faint">
              +{totalXp} XP earned
            </span>
          </div>
        </div>

        {/* Question */}
        <div className="relative z-10 mx-auto mt-6 w-full max-w-lg flex-1 flex flex-col">
          <div className="hud-frame rounded-2xl border border-panel-line bg-panel/70 p-6 text-center backdrop-blur-sm">
            <p className="font-display text-lg font-bold text-ink-primary sm:text-xl leading-relaxed">
              {question.q}
            </p>
          </div>

          {/* Answer options */}
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {question.options.map((opt, i) => {
              const colors = ["#806BFF", "#38D9F4", "#4ADE80", "#FCD34D"];
              const color = colors[i % colors.length];
              return (
                <button
                  key={opt}
                  onClick={() => handleAnswer(opt)}
                  className="group relative overflow-hidden rounded-xl border bg-panel/60 px-4 py-4 text-left transition-all hover:brightness-110 active:scale-[0.98]"
                  style={{ borderColor: `${color}40` }}
                >
                  <div
                    className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
                    style={{ backgroundColor: `${color}10` }}
                  />
                  <span
                    className="relative font-mono text-[10px] font-bold uppercase tracking-widest"
                    style={{ color }}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="relative ml-2 font-display text-sm font-semibold text-ink-primary">
                    {opt}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // â”€â”€ Feedback screen â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (screen === SCREENS.FEEDBACK) {
    const earned = isCorrect ? 100 + Math.max(0, timeLeft * 5) + (isCorrect ? streak * 25 : 0) : 0;
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-void px-4 py-16">
        <div className="absolute inset-0 bg-radial-fade" />
      <div className="aurora-canvas pointer-events-none absolute inset-0" aria-hidden="true" />

        <div
          className={`hud-frame relative z-10 w-full max-w-sm rounded-2xl border bg-panel/80 p-8 text-center backdrop-blur-sm ${
            isCorrect
              ? "border-neon-green/40"
              : "border-red-500/40"
          }`}
        >
          {isCorrect ? (
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-neon-green/15 mx-auto mb-4 animate-pop-in">
              <CheckCircle2 className="h-7 w-7 text-neon-green" />
            </div>
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-red-500/15 mx-auto mb-4 animate-pop-in">
              <XCircle className="h-7 w-7 text-red-400" />
            </div>
          )}

          <h2
            className={`font-display text-xl font-bold ${
              isCorrect ? "text-neon-green" : "text-red-400"
            }`}
          >
            {isCorrect ? "Correct!" : "Incorrect"}
          </h2>

          {isCorrect ? (
            <p className="mt-2 font-body text-sm text-ink-muted">
              +{earned} XP
              {streak > 1 && (
                <span className="ml-2 text-reward-gold">
                  {streak}x Streak!
                </span>
              )}
            </p>
          ) : (
            <div className="mt-3 rounded-lg bg-panel-line/50 p-3">
              <p className="font-body text-xs text-ink-faint">Correct answer:</p>
              <p className="mt-1 font-display text-sm font-bold text-neon-green">
                {question.answer}
              </p>
            </div>
          )}

          {!isCorrect && streak > 0 && (
            <p className="mt-3 font-body text-xs text-red-400">Streak lost</p>
          )}

          {players.length > 0 && (
            <div className="mt-4 rounded-lg bg-panel-line/30 p-3">
              <div className="flex items-center justify-between">
                <span className="font-body text-xs text-ink-faint">Your Rank</span>
                <RankBadge rank={myRank} />
              </div>
              {myRank !== players[0]?.rank && (
                <p className="mt-1 font-body text-[11px] text-ink-muted">
                  {myRank < (players.find((p) => p.id === 1)?.rank ?? 1)
                    ? "You moved up!"
                    : "Keep pushing!"}
                </p>
              )}
            </div>
          )}

          <button
            onClick={handleNextQuestion}
            className="mt-6 w-full rounded-xl bg-arcane-purple py-3 font-display text-sm font-bold uppercase tracking-widest text-white shadow-glow-purple transition-all hover:brightness-110"
          >
            {currentQ + 1 >= totalQuestions ? "See Results" : "Next Question"}
            <ChevronRight className="ml-1 inline h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  // â”€â”€ Podium screen â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (screen === SCREENS.PODIUM) {
    const sorted = [...players].sort((a, b) => b.score - a.score);
    const top3 = sorted.slice(0, 3);
    const podiumOrder = [top3[1], top3[0], top3[2]]; // 2nd, 1st, 3rd
    const podiumHeights = [120, 160, 96];
    const podiumColors = ["#C0C0C0", "#FFD700", "#CD7F32"];
    const medals = ["ðŸ¥ˆ", "ðŸ¥‡", "ðŸ¥‰"];
    const myResult = sorted.find((p) => p.id === 1);

    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-void px-4 py-16">
        <div className="absolute inset-0 bg-radial-fade" />
      <div className="aurora-canvas pointer-events-none absolute inset-0" aria-hidden="true" />
        <ParticleField density={30} />
        <Confetti />

        <div className="relative z-10 w-full max-w-lg text-center">
          <h1 className="font-display text-3xl font-bold text-reward-gold mb-2">
            Game Over!
          </h1>
          <p className="font-body text-sm text-ink-muted mb-8">
            Final Standings
          </p>

          {/* Podium */}
          <div className="flex items-end justify-center gap-3 mb-8">
            {podiumOrder.map((player, i) => {
              if (!player) return <div key={i} className="w-24" />;
              const height = podiumHeights[i];
              const color = podiumColors[i];
              const isFirst = i === 1;
              return (
                <div key={player.id} className="flex flex-col items-center">
                  {isFirst && (
                    <span className="text-2xl mb-1">{medals[i]}</span>
                  )}
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 mb-2 ${
                      isFirst ? "bg-reward-gold/15" : "bg-panel/60"
                    }`}
                    style={{ borderColor: color }}
                  >
                    <span
                      className="font-display text-xs font-bold"
                      style={{ color }}
                    >
                      {player.name[0]}
                    </span>
                  </div>
                  <span className="font-display text-xs font-bold text-ink-primary max-w-[5rem] truncate">
                    {player.name}
                  </span>
                  <span className="font-mono text-[10px] text-reward-gold">
                    {player.score} pts
                  </span>
                  {!isFirst && (
                    <span className="mt-1 text-lg">{medals[i]}</span>
                  )}
                  <div
                    className="mt-2 w-24 rounded-t-xl border border-b-0"
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

          {/* Your results */}
          {myResult && (
            <div className="hud-frame rounded-xl border border-panel-line bg-panel/70 p-5 backdrop-blur-sm">
              <p className="font-display text-sm font-bold text-ink-primary">
                Your Final Position
              </p>
              <div className="mt-3 flex items-center justify-around">
                <div className="text-center">
                  <p className="font-mono text-lg font-bold text-reward-gold">
                    #{myResult.rank}
                  </p>
                  <p className="font-body text-[10px] text-ink-faint">Rank</p>
                </div>
                <div className="text-center">
                  <p className="font-mono text-lg font-bold text-arcane-purple">
                    {score}
                  </p>
                  <p className="font-body text-[10px] text-ink-faint">Score</p>
                </div>
                <div className="text-center">
                  <p className="font-mono text-lg font-bold text-neon-cyan">
                    +{totalXp}
                  </p>
                  <p className="font-body text-[10px] text-ink-faint">XP</p>
                </div>
                <div className="text-center">
                  <p className="font-mono text-lg font-bold text-neon-green">
                    +{Math.floor(totalXp * 0.1)}
                  </p>
                  <p className="font-body text-[10px] text-ink-faint">Coins</p>
                </div>
              </div>
            </div>
          )}

          {/* Full leaderboard */}
          <div className="mt-6 rounded-xl border border-panel-line bg-panel/60 overflow-hidden">
            <div className="grid grid-cols-3 gap-0 border-b border-panel-line px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-ink-faint">
              <span>Rank</span>
              <span>Player</span>
              <span className="text-right">Score</span>
            </div>
            {sorted.slice(0, 8).map((p, i) => (
              <div
                key={p.id}
                className={`grid grid-cols-3 items-center gap-0 px-4 py-2 border-b border-panel-line/50 last:border-0 ${
                  p.id === 1 ? "bg-arcane-purple/10" : ""
                }`}
              >
                <span
                  className="font-mono text-xs font-bold"
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
                  #{i + 1}
                </span>
                <span className="font-display text-xs font-semibold text-ink-primary truncate">
                  {p.name}
                  {p.id === 1 && (
                    <span className="ml-1 text-[9px] text-arcane-purple">(You)</span>
                  )}
                </span>
                <span className="font-mono text-xs font-bold text-ink-primary text-right">
                  {p.score}
                </span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => {
                setScreen(SCREENS.JOIN);
                setPin("");
                setCurrentQ(0);
                setScore(0);
                setStreak(0);
                setTotalXp(0);
                setSelectedAnswer(null);
                setIsCorrect(null);
              }}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-panel-line bg-panel/60 py-3 font-display text-sm font-bold uppercase tracking-widest text-ink-primary transition-all hover:border-neon-cyan/40"
            >
              <RotateCcw className="h-4 w-4" />
              Play Again
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-arcane-purple py-3 font-display text-sm font-bold uppercase tracking-widest text-white shadow-glow-purple transition-all hover:brightness-110"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
