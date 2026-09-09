import { useMemo } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import * as Icons from "lucide-react";
import {
  ChevronLeft,
  Swords,
  Skull,
  Target,
  Layers,
  Users,
  CalendarClock,
  Timer,
  ArrowRight,
  Lock,
  Sparkles,
  Zap,
  Trophy,
} from "lucide-react";
import ParticleField from "../components/ParticleField.jsx";
import { getWorldMapLive } from "../store/playerStore.js";

const GAME_MODES = [
  {
    id: "battle",
    name: "Battle Mode",
    description: "Fight monsters by answering questions. Earn XP and coins.",
    icon: "Swords",
    color: "#806BFF",
    link: "/world-map",
    status: "available",
    category: "battle",
  },
  {
    id: "boss",
    name: "Boss Battle",
    description: "Face the chapter boss in an epic final showdown.",
    icon: "Skull",
    color: "#F87171",
    link: "/world-map",
    status: "available",
    category: "battle",
  },
  {
    id: "practice",
    name: "Practice Mode",
    description: "No timer, no pressure. Practice questions at your own pace.",
    icon: "Target",
    color: "#4ADE80",
    link: "/practice",
    status: "available",
    category: "practice",
  },
  {
    id: "flashcard-match",
    name: "Flashcard Match",
    description: "Match flashcard terms with their definitions.",
    icon: "Layers",
    color: "#38D9F4",
    link: "/flashcards",
    status: "available",
    category: "memory",
  },
  {
    id: "team-battle",
    name: "Team Battle",
    description: "Compete with friends in team-based quiz battles.",
    icon: "Users",
    color: "#FCD34D",
    link: "#",
    status: "coming_soon",
    category: "battle",
  },
  {
    id: "daily-challenge",
    name: "Daily Challenge",
    description: "Complete today's challenge for bonus rewards.",
    icon: "CalendarClock",
    color: "#4ADE80",
    link: "/challenges",
    status: "available",
    category: "challenge",
  },
  {
    id: "time-trial",
    name: "Time Trial",
    description: "Race against the clock for the highest score.",
    icon: "Timer",
    color: "#F87171",
    link: "/test",
    status: "available",
    category: "challenge",
  },
  {
    id: "test",
    name: "Formal Test",
    description: "Timed unit tests with negative marking, attempt history and detailed review.",
    icon: "FileText",
    color: "#806BFF",
    link: "/tests",
    status: "available",
    category: "test",
  },
  {
    id: "learn",
    name: "Study Mode",
    description: "Read study material, review concepts, and take notes.",
    icon: "BookOpen",
    color: "#38D9F4",
    link: "/learn",
    status: "available",
    category: "practice",
  },
];

const MOCK_RECENT_GAMES = [
  { id: "rg1", mode: "Battle Mode", world: "Atom Valley", score: "5/5", xp: 40, time: "2m 30s", timestamp: Date.now() - 3600000 },
  { id: "rg2", mode: "Practice Mode", world: "Molecule Forest", score: "4/5", xp: 20, time: "5m 12s", timestamp: Date.now() - 7200000 },
  { id: "rg3", mode: "Boss Battle", world: "Atom Valley", score: "Won!", xp: 100, time: "8m 45s", timestamp: Date.now() - 86400000 },
];

function GameCard({ game, onClick }) {
  const Icon = Icons[game.icon] ?? Icons.Gamepad2;
  const locked = game.status === "coming_soon";

  return (
    <button
      type="button"
      onClick={locked ? undefined : onClick}
      className={`group relative flex flex-col items-center gap-3 rounded-xl border p-5 text-center transition-all ${
        locked
          ? "cursor-not-allowed border-panel-line/40 bg-panel/30"
          : "border-panel-line bg-panel/60 hover:border-arcane-purple/40 hover:bg-panel/80"
      }`}
    >
      {locked && (
        <div className="absolute right-2 top-2">
          <Lock className="h-3.5 w-3.5 text-ink-faint" />
        </div>
      )}
      <div
        className="flex h-14 w-14 items-center justify-center rounded-xl border"
        style={{
          borderColor: locked ? "#3A3E6844" : `${game.color}44`,
          backgroundColor: locked ? "transparent" : `${game.color}15`,
        }}
      >
        <Icon
          className="h-7 w-7"
          style={{ color: locked ? "#3A3E68" : game.color }}
          strokeWidth={1.5}
        />
      </div>
      <div>
        <p className={`font-display text-sm font-bold ${locked ? "text-ink-faint" : "text-ink-primary"}`}>
          {game.name}
        </p>
        <p className="mt-1 font-body text-xs text-ink-muted line-clamp-2">{game.description}</p>
      </div>
      {!locked && (
        <div
          className="absolute inset-x-0 bottom-0 h-0.5 rounded-b-xl opacity-0 transition-opacity group-hover:opacity-100"
          style={{ backgroundColor: game.color }}
        />
      )}
    </button>
  );
}

function RecentGameRow({ game }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-panel-line bg-panel/40 p-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-arcane-purple/15">
        <Zap className="h-4 w-4 text-arcane-purple" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-display text-sm font-bold text-ink-primary">{game.mode}</p>
        <p className="truncate font-body text-xs text-ink-muted">{game.world}</p>
      </div>
      <div className="text-right">
        <p className="font-display text-sm font-bold text-neon-green">{game.score}</p>
        <p className="font-mono text-[10px] text-ink-faint">+{game.xp} XP</p>
      </div>
    </div>
  );
}

export default function GamesPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const grade = searchParams.get("class") ?? "9";
  const board = searchParams.get("board") ?? "CBSE";
  const subject = searchParams.get("subject") ?? "CHEM";

  const queryBase = `?class=${grade}&board=${board}&subject=${subject}`;

  const worlds = useMemo(() => getWorldMapLive(grade, board, subject), [grade, board, subject]);
  const nextWorld = worlds.worlds.find((w) => w.status === "unlocked");

  function handleGameClick(game) {
    if (game.id === "battle" || game.id === "boss") {
      navigate(`/world-map${queryBase}`);
    } else if (game.link && game.link !== "#") {
      navigate(`${game.link}${queryBase}`);
    }
  }

  const categories = [
    { label: "Battle & Challenge", games: GAME_MODES.filter((g) => g.category === "battle" || g.category === "challenge") },
    { label: "Practice & Learn", games: GAME_MODES.filter((g) => g.category === "practice" || g.category === "memory") },
    { label: "Test", games: GAME_MODES.filter((g) => g.category === "test") },
  ];

  return (
    <div className="relative min-h-screen bg-void">
      <div className="absolute inset-0 bg-radial-fade" />
      <div className="aurora-canvas pointer-events-none absolute inset-0" aria-hidden="true" />
      <ParticleField density={14} />

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-8">
        <Link
          to={`/dashboard${queryBase}`}
          className="mb-6 inline-flex items-center gap-1 font-display text-sm text-ink-muted hover:text-ink-primary"
        >
          <ChevronLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        <div className="flex items-end justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-ink-primary">
              Game Modes
            </h1>
            <p className="mt-2 font-body text-sm text-ink-muted">
              Choose how you want to learn today.
            </p>
          </div>
          {nextWorld && (
            <Link
              to={`/world-map${queryBase}`}
              className="hidden items-center gap-2 rounded-lg bg-arcane-purple px-4 py-2 font-display text-xs font-bold uppercase tracking-wider text-void transition-transform hover:scale-[1.02] sm:flex"
            >
              <Sparkles className="h-3.5 w-3.5" /> Continue
            </Link>
          )}
        </div>

        {nextWorld && (
          <div className="mt-6 hud-frame rounded-xl border border-panel-line bg-panel/60 p-4" style={{ "--hud-color": "#38D9F4" }}>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-neon-cyan/30 bg-neon-cyan/10">
                {(() => {
                  const Icon = Icons[nextWorld.icon] ?? Icons.Map;
                  return <Icon className="h-6 w-6 text-neon-cyan" strokeWidth={1.5} />;
                })()}
              </div>
              <div className="flex-1">
                <p className="font-mono text-[10px] uppercase tracking-widest text-neon-cyan">Continue Adventure</p>
                <p className="font-display text-sm font-bold text-ink-primary">{nextWorld.name}</p>
              </div>
              <Link
                to={`/world-map${queryBase}`}
                className="flex items-center gap-1 rounded-lg bg-neon-green px-3 py-2 font-display text-xs font-bold text-void transition-transform hover:scale-[1.02]"
              >
                Play <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        )}

        {categories.map((cat) => (
          <div key={cat.label} className="mt-8">
            <h2 className="mb-4 font-display text-lg font-bold text-ink-primary">{cat.label}</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {cat.games.map((game) => (
                <GameCard key={game.id} game={game} onClick={() => handleGameClick(game)} />
              ))}
            </div>
          </div>
        ))}

        <div className="mt-10">
          <h2 className="mb-4 font-display text-lg font-bold text-ink-primary">Recent Games</h2>
          <div className="space-y-2">
            {MOCK_RECENT_GAMES.map((game) => (
              <RecentGameRow key={game.id} game={game} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
