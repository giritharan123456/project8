import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import {
  Play,
  Users,
  Timer,
  Trophy,
  Gamepad2,
  Copy,
  CheckCheck,
  Crown,
  Medal,
  Zap,
  Clock,
  BarChart3,
  Trash2,
  Plus,
  X,
  Eye,
  Square,
  Flame,
} from "lucide-react";
import { useTeacherData } from "../TeacherContext.jsx";
import StatCard from "../../admin/components/StatCard.jsx";
import StatusPill from "../../admin/components/StatusPill.jsx";

const GAME_MODES = [
  { value: "classic", label: "Classic", desc: "Answer questions at your own pace" },
  { value: "timed", label: "Timed", desc: "Each question has a countdown timer" },
  { value: "team", label: "Team Battle", desc: "Students compete in teams" },
  { value: "survival", label: "Survival", desc: "Wrong answers eliminate players" },
];

const TIMER_OPTIONS = [10, 15, 20, 30, 45, 60];

function initials(name) {
  return String(name ?? "?")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function generatePin() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function AvatarCircle({ initials, size = "md" }) {
  const sizes = { sm: "h-8 w-8 text-[10px]", md: "h-10 w-10 text-xs", lg: "h-12 w-12 text-sm" };
  return (
    <span className={`flex ${sizes[size]} flex-none items-center justify-center rounded-full border border-arcane-purple/40 bg-arcane-purple/15 font-display font-bold text-arcane-purple`}>
      {initials}
    </span>
  );
}

function BarChart({ data, maxVal }) {
  const max = maxVal || Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="space-y-2">
      {data.map((d, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="w-16 flex-none truncate text-right font-mono text-[11px] text-ink-muted">{d.label}</span>
          <div className="h-5 flex-1 overflow-hidden rounded bg-panel-line">
            <div
              className="h-full rounded transition-all duration-500"
              style={{ width: `${(d.value / max) * 100}%`, backgroundColor: d.color || "rgb(255 107 107)" }}
            />
          </div>
          <span className="w-8 flex-none text-left font-mono text-[11px] text-ink-primary">{d.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function LiveGamePage() {
  const { data, rosterLoading } = useTeacherData();

  // Real roster -> { id, name, avatar, level }, used for the lobby's
  // "joined players" simulation.
  const rosterPlayers = useMemo(
    () =>
      (data.students ?? []).map((s) => ({
        id: s.id,
        name: s.name,
        avatar: initials(s.name),
        level: s.level ?? 1,
      })),
    [data.students]
  );

  // Subject-scoped quizzes the teacher can spin a live game from.
  const availableQuizzes = useMemo(() => data.quizzes ?? [], [data.quizzes]);

  // courseId -> real questions (question -> lesson -> chapter -> course).
  const questionsByCourse = useMemo(() => {
    const lessonChapter = new Map((data.lessons ?? []).map((l) => [l.id, l.chapterId]));
    const chapterCourse = new Map((data.chapters ?? []).map((c) => [c.id, c.courseId]));
    const map = new Map();
    for (const q of data.questions ?? []) {
      const chapterId = lessonChapter.get(q.lessonId);
      if (!chapterId) continue;
      const courseId = chapterCourse.get(chapterId);
      if (!courseId) continue;
      if (!map.has(courseId)) map.set(courseId, []);
      map.get(courseId).push(q);
    }
    return map;
  }, [data.lessons, data.chapters, data.questions]);

  // Live standings come from the real school leaderboard + quiz results.
  const liveStandings = useMemo(() => {
    const attempts = new Map();
    for (const r of data.quizResults ?? []) {
      const cur = attempts.get(r.studentId) ?? { correct: 0, total: 0, score: 0 };
      cur.total += 1;
      cur.score += r.score ?? 0;
      if ((r.score ?? 0) >= 50) cur.correct += 1;
      attempts.set(r.studentId, cur);
    }
    return (data.leaderboard ?? [])
      .map((row) => {
        const a = attempts.get(row.id) ?? { correct: 0, total: 0, score: 0 };
        return {
          id: row.id,
          name: row.name,
          avatar: initials(row.name),
          score: row.total_xp_earned ?? 0,
          streak: row.streak ?? 0,
          correct: a.correct,
          total: a.total,
          level: row.level,
        };
      })
      .sort((a, b) => b.score - a.score);
  }, [data.leaderboard, data.quizResults]);

  const avgScorePct = useMemo(() => {
    const rows = data.quizResults ?? [];
    if (!rows.length) return "\u2014";
    return Math.round(rows.reduce((sum, r) => sum + (r.score ?? 0), 0) / rows.length);
  }, [data.quizResults]);

  const maxStreak = useMemo(
    () => Math.max(0, ...(data.leaderboard ?? []).map((r) => r.streak ?? 0)),
    [data.leaderboard]
  );

  const [view, setView] = useState("list");
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [teams, setTeams] = useState(0);
  const [timerPerQuestion, setTimerPerQuestion] = useState(20);
  const [gameMode, setGameMode] = useState("classic");
  const [pin, setPin] = useState("");
  const [copied, setCopied] = useState(false);
  const [joinedStudents, setJoinedStudents] = useState([]);
  const [gameActive, setGameActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answerDist, setAnswerDist] = useState([]);
  const [showPodium, setShowPodium] = useState(false);
  const timerRef = useRef(null);

  const startCreate = useCallback(() => {
    setView("create");
    setSelectedQuiz(null);
    setTeams(0);
    setTimerPerQuestion(20);
    setGameMode("classic");
  }, []);

  const generateGame = useCallback(() => {
    if (!selectedQuiz) return;
    const gamePin = generatePin();
    const shuffled = [...rosterPlayers].sort(() => Math.random() - 0.5);
    setPin(gamePin);
    setJoinedStudents(shuffled.slice(0, Math.floor(Math.random() * 3) + 4));
    setView("lobby");
  }, [selectedQuiz, rosterPlayers]);

  const startGame = useCallback(() => {
    const pool = questionsByCourse.get(selectedQuiz?.courseId) ?? [];
    const question = pool[Math.floor(Math.random() * pool.length)] ?? null;
    const liveQuestion = question
      ? {
          id: question.id,
          text: question.questionText,
          options: [question.correctAnswer, "None of the above", "Can't say", "Skip"],
          correctIndex: 0,
          timeLimit: timerPerQuestion,
        }
      : {
          id: "fallback",
          text: `Which topic does "${selectedQuiz?.title ?? "this quiz"}" explore?`,
          options: ["Physics", "Chemistry", "Biology", "Maths"],
          correctIndex: 0,
          timeLimit: timerPerQuestion,
        };
    setGameActive(true);
    setCurrentQuestion(liveQuestion);
    setTimeLeft(liveQuestion.timeLimit);
    const preferred = question && (question.difficulty === "hard" || question.difficulty === "expert") ? 4 : 6;
    setAnswerDist(
      liveQuestion.options.map((label, i) => ({
        label,
        value: i === liveQuestion.correctIndex ? preferred : Math.max(1, 6 - i),
        color: ["rgb(255 107 107)", "rgb(34 211 238)", "rgb(74 222 128)", "rgb(251 191 36)"][i % 4],
      }))
    );
    setView("live");
  }, [selectedQuiz, timerPerQuestion, questionsByCourse]);

  useEffect(() => {
    if (view === "live" && timeLeft > 0 && gameActive) {
      timerRef.current = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearTimeout(timerRef.current);
    }
    if (timeLeft === 0 && view === "live") {
      setGameActive(false);
    }
  }, [timeLeft, view, gameActive]);

  const endGame = useCallback(() => {
    clearTimeout(timerRef.current);
    setGameActive(false);
    setShowPodium(true);
    setView("podium");
  }, []);

  const finishPodium = useCallback(() => {
    setShowPodium(false);
    setView("list");
  }, []);

  const copyPin = useCallback(() => {
    navigator.clipboard?.writeText(pin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [pin]);

  if (rosterLoading) return <p className="text-sm text-ink-faint">Loading live gamesâ€¦</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink-primary">Live Games</h2>
          <p className="mt-1 text-sm text-ink-muted">Create and manage real-time quiz battles for your students.</p>
        </div>
        {view === "list" && (
          <button
            type="button"
            onClick={startCreate}
            className="flex items-center gap-1.5 rounded-lg bg-arcane-purple px-3.5 py-2 font-display text-sm font-semibold text-white shadow-glow-purple transition-colors hover:bg-arcane-violet"
          >
            <Plus className="h-4 w-4" strokeWidth={2.2} />
            Create Game
          </button>
        )}
        {view !== "list" && view !== "podium" && (
          <button
            type="button"
            onClick={() => setView("list")}
            className="flex items-center gap-1.5 rounded-lg border border-panel-line px-3.5 py-2 font-display text-sm font-semibold text-ink-muted transition-colors hover:text-ink-primary"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>
        )}
      </div>

      {view === "list" && (
        <div className="grid gap-4 lg:grid-cols-4">
          <StatCard icon={Users} label="Roster Size" value={rosterPlayers.length} accent="purple" />
          <StatCard icon={Trophy} label="Top Student" value={liveStandings[0]?.name ?? "\u2014"} sublabel="leaderboard leader" accent="cyan" />
          <StatCard icon={BarChart3} label="Avg. Score" value={`${avgScorePct}%`} sublabel="across quiz attempts" accent="gold" />
          <StatCard icon={Flame} label="Longest Streak" value={maxStreak} sublabel="current streak" accent="green" />
        </div>
      )}

      {view === "create" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-panel-line bg-panel/60 p-5">
            <h3 className="font-display text-base font-bold text-ink-primary">Select Quiz</h3>
            <div className="mt-4 space-y-2">
              {availableQuizzes.map((q) => (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setSelectedQuiz(q)}
                  className={`w-full rounded-xl border p-3 text-left transition-colors ${
                    selectedQuiz?.id === q.id
                      ? "border-neon-cyan bg-neon-cyan/10"
                      : "border-panel-line bg-void/40 hover:border-panel-line/80 hover:bg-panel-alt/30"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-display text-sm font-semibold text-ink-primary">{q.title}</p>
                      <p className="mt-0.5 text-xs text-ink-muted">{q.questionCount} questions Â· {q.difficulty}</p>
                    </div>
                    {selectedQuiz?.id === q.id && <CheckCheck className="h-4 w-4 flex-none text-neon-cyan" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-panel-line bg-panel/60 p-5">
            <h3 className="font-display text-base font-bold text-ink-primary">Configuration</h3>
            <div className="mt-4 space-y-5">
              <div>
                <label className="mb-2 block font-mono text-[11px] uppercase tracking-widest text-ink-faint">Game Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  {GAME_MODES.map((m) => (
                    <button
                      key={m.value}
                      type="button"
                      onClick={() => setGameMode(m.value)}
                      className={`rounded-xl border p-3 text-left transition-colors ${
                        gameMode === m.value
                          ? "border-arcane-purple bg-arcane-purple/10"
                          : "border-panel-line bg-void/40 hover:bg-panel-alt/30"
                      }`}
                    >
                      <p className="font-display text-xs font-semibold text-ink-primary">{m.label}</p>
                      <p className="mt-0.5 text-[10px] text-ink-faint">{m.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block font-mono text-[11px] uppercase tracking-widest text-ink-faint">Timer per Question</label>
                <div className="flex flex-wrap gap-2">
                  {TIMER_OPTIONS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTimerPerQuestion(t)}
                      className={`rounded-lg border px-3 py-1.5 font-mono text-xs transition-colors ${
                        timerPerQuestion === t
                          ? "border-neon-cyan bg-neon-cyan/10 text-neon-cyan"
                          : "border-panel-line text-ink-muted hover:text-ink-primary"
                      }`}
                    >
                      {t}s
                    </button>
                  ))}
                </div>
              </div>

              {gameMode === "team" && (
                <div>
                  <label className="mb-2 block font-mono text-[11px] uppercase tracking-widest text-ink-faint">Number of Teams</label>
                  <div className="flex gap-2">
                    {[2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setTeams(n)}
                        className={`h-10 w-10 rounded-lg border font-display text-sm font-bold transition-colors ${
                          teams === n
                            ? "border-neon-cyan bg-neon-cyan/10 text-neon-cyan"
                            : "border-panel-line text-ink-muted hover:text-ink-primary"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={generateGame}
                disabled={!selectedQuiz}
                className="mt-2 w-full rounded-lg bg-arcane-purple px-4 py-2.5 font-display text-sm font-semibold text-white shadow-glow-purple transition-colors hover:bg-arcane-violet disabled:cursor-not-allowed disabled:opacity-40"
              >
                Generate Game PIN
              </button>
            </div>
          </div>
        </div>
      )}

      {view === "lobby" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-arcane-purple/30 bg-arcane-purple/5 p-6 text-center">
            <p className="font-mono text-[11px] uppercase tracking-widest text-ink-faint">Game PIN</p>
            <p className="mt-2 font-wordmark text-5xl tracking-[0.3em] text-neon-cyan">{pin}</p>
            <p className="mt-2 text-sm text-ink-muted">Students enter this code to join</p>
            <button
              type="button"
              onClick={copyPin}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-panel-line px-3 py-1.5 font-display text-xs font-semibold text-ink-muted transition-colors hover:text-neon-cyan"
            >
              {copied ? <CheckCheck className="h-3.5 w-3.5 text-neon-green" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied!" : "Copy PIN"}
            </button>
          </div>

          <div className="rounded-2xl border border-panel-line bg-panel/60 p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-bold text-ink-primary">
                Joined Students ({joinedStudents.length})
              </h3>
              <StatusPill value={selectedQuiz?.difficulty ?? "medium"} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {joinedStudents.map((s) => (
                <div key={s.id} className="flex items-center gap-3 rounded-xl border border-panel-line bg-void/40 p-3">
                  <AvatarCircle initials={s.avatar} />
                  <div className="min-w-0">
                    <p className="truncate font-display text-sm font-semibold text-ink-primary">{s.name}</p>
                    <p className="font-mono text-[10px] text-ink-faint">Level {s.level}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={startGame}
              disabled={joinedStudents.length === 0}
              className="flex items-center gap-2 rounded-lg bg-neon-green px-6 py-3 font-display text-sm font-bold text-void shadow-glow-green transition-colors hover:bg-neon-green/90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Play className="h-5 w-5" strokeWidth={2.2} />
              Start Game ({joinedStudents.length} players)
            </button>
          </div>
        </div>
      )}

      {view === "live" && (
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 rounded-xl border border-neon-green/30 bg-neon-green/10 px-3 py-1.5">
                <span className="h-2 w-2 rounded-full bg-neon-green animate-pulse" />
                <span className="font-mono text-xs text-neon-green">LIVE</span>
              </div>
              <div className="flex items-center gap-1.5 text-ink-muted">
                <Users className="h-4 w-4" />
                <span className="font-mono text-xs">{joinedStudents.length} players</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-lg border border-panel-line px-3 py-1.5">
                <Timer className="h-4 w-4 text-neon-cyan" />
                <span className={`font-mono text-sm font-bold ${timeLeft <= 5 ? "text-red-400" : "text-neon-cyan"}`}>
                  {timeLeft}s
                </span>
              </div>
              <button
                type="button"
                onClick={endGame}
                className="flex items-center gap-1.5 rounded-lg bg-red-500 px-3 py-1.5 font-display text-xs font-semibold text-white transition-colors hover:bg-red-600"
              >
                <Square className="h-3.5 w-3.5" />
                End Game
              </button>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-2xl border border-panel-line bg-panel/60 p-5">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-arcane-purple/40 bg-arcane-purple/10 font-mono text-xs text-arcane-purple">1</span>
                <h3 className="font-display text-base font-bold text-ink-primary">
                  {currentQuestion?.text}
                </h3>
              </div>

              <div className="mt-4 space-y-2">
                {currentQuestion?.options.map((opt, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 rounded-xl border p-3 transition-colors ${
                      i === currentQuestion.correctIndex
                        ? "border-neon-green/40 bg-neon-green/5"
                        : "border-panel-line bg-void/40"
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 flex-none items-center justify-center rounded-lg font-display text-xs font-bold ${
                        i === currentQuestion.correctIndex
                          ? "bg-neon-green/20 text-neon-green"
                          : "bg-panel-line text-ink-muted"
                      }`}
                    >
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="flex-1 text-sm text-ink-primary">{opt}</span>
                    <span className="font-mono text-xs text-ink-faint">
                      {answerDist[i]?.value ?? 0}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-xl border border-panel-line bg-void/40 p-4">
                <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-ink-faint">Answer Distribution</p>
                <BarChart data={answerDist} />
              </div>
            </div>

            <div className="rounded-2xl border border-panel-line bg-panel/60 p-5">
              <h3 className="flex items-center gap-2 font-display text-base font-bold text-ink-primary">
                <Trophy className="h-4 w-4 text-reward-gold" />
                Leaderboard
              </h3>
              <div className="mt-3 space-y-2">
                {liveStandings.slice(0, 6).map((entry, i) => (
                  <div key={entry.id} className="flex items-center gap-3 rounded-xl border border-panel-line bg-void/40 px-3 py-2.5">
                    <span className={`w-5 text-center font-mono text-xs font-bold ${
                      i === 0 ? "text-reward-gold" : i === 1 ? "text-ink-muted" : i === 2 ? "text-amber-700" : "text-ink-faint"
                    }`}>
                      {i === 0 ? <Crown className="h-4 w-4 mx-auto" /> : i + 1}
                    </span>
                    <AvatarCircle initials={entry.avatar} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-xs font-semibold text-ink-primary">{entry.name}</p>
                      <p className="font-mono text-[10px] text-ink-faint">{entry.correct}/{entry.total} correct</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-xs text-neon-cyan">{entry.score.toLocaleString()}</p>
                      {entry.streak > 2 && (
                        <p className="flex items-center justify-end gap-0.5 font-mono text-[10px] text-reward-gold">
                          <Zap className="h-3 w-3" /> {entry.streak}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {view === "podium" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-reward-gold/30 bg-reward-gold/5 p-8 text-center">
            <Trophy className="mx-auto h-12 w-12 text-reward-gold" />
            <h3 className="mt-3 font-display text-2xl font-bold text-ink-primary">Game Over!</h3>
            <p className="mt-1 text-sm text-ink-muted">Final standings for this session</p>
          </div>

          {liveStandings.length === 0 ? (
            <p className="py-4 text-center text-sm text-ink-muted">No standings yet \u2014 players join when a game is live.</p>
          ) : (
          <div className="flex items-end justify-center gap-4">
            {[1, 0, 2].map((rank) => {
              const entry = liveStandings[rank];
              if (!entry) return null;
              const heights = ["h-32", "h-24", "h-20"];
              const medals = ["text-reward-gold", "text-ink-muted", "text-amber-700"];
              return (
                <div key={entry.id} className="flex flex-col items-center gap-2">
                  <AvatarCircle initials={entry.avatar} size="lg" />
                  <p className="font-display text-sm font-bold text-ink-primary">{entry.name}</p>
                  <p className="font-mono text-xs text-neon-cyan">{entry.score.toLocaleString()}</p>
                  <div className={`w-24 ${heights[rank]} flex items-center justify-center rounded-t-xl border border-panel-line bg-panel/60`}>
                    <Medal className={`h-8 w-8 ${medals[rank]}`} />
                  </div>
                  <p className="font-mono text-sm font-bold text-ink-primary">#{rank + 1}</p>
                </div>
              );
            })}
          </div>
          )}

          <div className="rounded-2xl border border-panel-line bg-panel/60 p-5">
            <h3 className="font-display text-base font-bold text-ink-primary">Full Results</h3>
            <div className="mt-3 divide-y divide-panel-line">
              {liveStandings.length === 0 ? (
                <p className="py-3 text-center text-sm text-ink-muted">No results recorded.</p>
              ) : liveStandings.map((entry, i) => (
                <div key={entry.id} className="flex items-center gap-3 py-2.5">
                  <span className="w-6 text-center font-mono text-xs font-bold text-ink-faint">#{i + 1}</span>
                  <AvatarCircle initials={entry.avatar} size="sm" />
                  <span className="flex-1 font-display text-sm font-semibold text-ink-primary">{entry.name}</span>
                  <span className="font-mono text-xs text-ink-muted">{entry.correct}/{entry.total}</span>
                  <span className="font-mono text-sm text-neon-cyan">{entry.score.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={finishPodium}
              className="rounded-lg bg-arcane-purple px-6 py-2.5 font-display text-sm font-semibold text-white shadow-glow-purple transition-colors hover:bg-arcane-violet"
            >
              Back to Games
            </button>
          </div>
        </div>
      )}

      {view === "list" && (
        <div className="rounded-2xl border border-panel-line bg-panel/60 p-5">
          <h3 className="font-display text-base font-bold text-ink-primary">Game History</h3>
          <div className="mt-4 space-y-2">
            <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-panel-line bg-void/30 px-4 py-10 text-center">
              <Gamepad2 className="h-8 w-8 text-ink-faint" />
              <p className="font-display text-sm font-semibold text-ink-muted">No live games yet</p>
              <p className="max-w-sm text-xs text-ink-faint">
                Live sessions run in real time and aren't stored. Create a game above to start your first session.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
