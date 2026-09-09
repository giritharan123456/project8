import { useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import * as Icons from "lucide-react";
import {
  GraduationCap,
  LayoutDashboard,
  UserRound,
  Trophy,
  Star,
  Sparkles,
  Crown,
  Download,
  FileSpreadsheet,
  Flame,
  BookOpenCheck,
  TrendingUp,
  Search,
  Target,
  Zap,
  X,
} from "lucide-react";
import ParticleField from "../components/ParticleField.jsx";
import GameNav from "../components/GameNav.jsx";
import SideNav from "../components/SideNav.jsx";
import CornerControls from "../components/CornerControls.jsx";
import ThemeToggle from "../components/ThemeToggle.jsx";
import SearchBar from "../components/ui/SearchBar.jsx";
import {
  LEADERBOARD_SCOPES,
  LEADERBOARD_PERIODS,
  getLeaderboardData,
} from "../data/content.js";
import { usePlayerState, getEquippedAvatarIcon, getWorldMapLive } from "../store/playerStore.js";
import { downloadLeaderboardPdf, downloadLeaderboardExcel } from "./leaderboardExport.js";

const RANK_COLORS = { 1: "#FCD34D", 2: "#C4C9E0", 3: "#C97A3D" };

const LEADERBOARD_TABS = [
  { id: "xp", label: "Top Learners", icon: Sparkles },
  { id: "mastery", label: "Mastery", icon: Target },
  { id: "accuracy", label: "Accuracy", icon: Target },
  { id: "improvement", label: "Most Improved", icon: TrendingUp },
];

const SUBJECT_FILTERS = [
  { id: "", label: "All Subjects" },
  { id: "CHEM", label: "Chemistry" },
  { id: "MATH", label: "Mathematics" },
  { id: "PHY", label: "Physics" },
  { id: "BIO", label: "Biology" },
  { id: "ENG", label: "English" },
];

function RankBadge({ rank }) {
  const color = RANK_COLORS[rank];
  if (color) {
    return (
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 font-display text-sm font-bold"
        style={{ borderColor: `${color}99`, background: `${color}22`, color }}
      >
        {rank === 1 ? <Crown className="h-4 w-4" /> : rank}
      </div>
    );
  }
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-panel-line font-mono text-xs text-ink-faint">
      {rank}
    </div>
  );
}

function LeaderboardRow({ row, youAvatarIconName }) {
  const RowIcon = row.isYou ? Icons[youAvatarIconName] ?? GraduationCap : GraduationCap;
  return (
    <div
      className={`flex items-center gap-2 rounded-lg border px-3 py-3 sm:gap-4 sm:px-4 ${
        row.isYou
          ? "hud-frame border-neon-cyan/60 bg-neon-cyan/10"
          : "border-panel-line bg-panel/50"
      }`}
      style={row.isYou ? { "--hud-color": "#38D9F4" } : undefined}
    >
      <RankBadge rank={row.rank} />
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-arcane-purple/50 bg-arcane-purple/15">
        <RowIcon className="h-4 w-4 text-arcane-purple" strokeWidth={1.8} />
      </div>
      <div className="min-w-0 flex-1">
        <p className={`truncate font-display text-sm font-semibold ${row.isYou ? "text-neon-cyan" : "text-ink-primary"}`}>
          {row.name} {row.isYou && <span className="font-mono text-[10px] text-ink-faint">(You)</span>}
        </p>
        <p className="font-mono text-[11px] text-ink-faint">Level {row.level}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        <span className="flex items-center gap-1 font-mono text-xs text-reward-gold sm:text-sm">
          <Sparkles className="h-3.5 w-3.5" /> {row.xp.toLocaleString()}
        </span>
        <span className="flex items-center gap-1 font-mono text-xs text-neon-cyan sm:text-sm">
          <Star className="h-3.5 w-3.5" /> {row.stars}
        </span>
      </div>
    </div>
  );
}

function MyProgressPanel({ progress }) {
  const items = [
    { icon: Trophy, label: "Rank", value: `#${progress.rank}`, accent: "text-neon-cyan" },
    { icon: Sparkles, label: "Level", value: progress.level, accent: "text-reward-gold" },
    { icon: Star, label: "Total XP", value: progress.xp.toLocaleString(), accent: "text-reward-gold" },
    { icon: Star, label: "Stars", value: progress.stars, accent: "text-neon-cyan" },
    { icon: BookOpenCheck, label: "Lessons Completed", value: progress.completedCount, accent: "text-neon-green" },
    { icon: TrendingUp, label: "Overall Progress", value: `${progress.overallProgress}%`, accent: "text-neon-green" },
    { icon: Flame, label: "Streak", value: `${progress.streak}d`, accent: "text-amber-400" },
  ];

  return (
    <div
      className="hud-frame shrink-0 rounded-xl border border-panel-line bg-panel/60 p-5 sm:w-64"
      style={{ "--hud-color": "#38D9F4" }}
    >
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-neon-cyan">My Progress</p>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-ink-faint">
              <item.icon className={`h-3.5 w-3.5 ${item.accent}`} /> {item.label}
            </span>
            <span className="font-display text-sm font-bold text-ink-primary">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LeaderboardPage() {
  const [searchParams] = useSearchParams();
  const grade = searchParams.get("class") ?? "9";
  const board = searchParams.get("board") ?? "CBSE";
  const subject = searchParams.get("subject");

  const [scope, setScope] = useState("global");
  const [period, setPeriod] = useState("all-time");
  const [leaderboardTab, setLeaderboardTab] = useState("xp");
  const [subjectFilter, setSubjectFilter] = useState(subject ?? "");
  const [searchQuery, setSearchQuery] = useState("");

  const playerState = usePlayerState();
  const youAvatarIconName = getEquippedAvatarIcon(playerState);

  const worldMap = useMemo(() => getWorldMapLive(grade, board, subject), [grade, board, subject]);
  const liveTotals = useMemo(
    () => ({ xp: playerState.xp, stars: worldMap.totalStars }),
    [playerState.xp, worldMap.totalStars]
  );

  const { rows: baseRows, yourRow: baseYourRow } = useMemo(
    () => getLeaderboardData(scope, period, grade, board, liveTotals),
    [scope, period, grade, board, liveTotals]
  );

  const rows = useMemo(() => {
    let filtered = [...baseRows];
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      filtered = filtered.filter((r) => r.name.toLowerCase().includes(q));
    }
    return filtered;
  }, [baseRows, searchQuery]);

  const topRows = rows.slice(0, 20);
  const yourRowVisible = topRows.some((r) => r.isYou);

  const myProgress = useMemo(
    () =>
      baseYourRow && {
        rank: baseYourRow.rank,
        level: baseYourRow.level,
        xp: baseYourRow.xp,
        stars: baseYourRow.stars,
        completedCount: worldMap.completedCount,
        overallProgress: worldMap.overallProgress,
        streak: playerState.streak ?? 0,
      },
    [baseYourRow, worldMap, playerState.streak]
  );

  const scopeLabel = LEADERBOARD_SCOPES.find((s) => s.id === scope)?.label ?? scope;
  const periodLabel = LEADERBOARD_PERIODS.find((p) => p.id === period)?.label ?? period;

  function handleDownloadPdf() {
    if (!myProgress) return;
    downloadLeaderboardPdf({ scopeLabel, periodLabel, grade, board, rows, progress: myProgress });
  }

  function handleDownloadExcel() {
    if (!myProgress) return;
    downloadLeaderboardExcel({ scopeLabel, periodLabel, grade, board, rows, progress: myProgress });
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-void pb-24 sm:pl-64">
      <div className="absolute inset-0 bg-radial-fade" />
      <div className="aurora-canvas pointer-events-none absolute inset-0" aria-hidden="true" />
      <ParticleField density={26} />

      <SideNav active="leaderboard" grade={grade} board={board} subject={subject} />
      <CornerControls />

      <div className="relative border-b border-panel-line/70 bg-void/70 backdrop-blur-sm sm:hidden">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-6 py-4 lg:px-8">
          <Link to={`/dashboard?class=${grade}&board=${board}`} className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-neon-cyan" strokeWidth={2.2} />
            <span className="font-wordmark text-sm tracking-wide text-ink-primary">
              Learn<span className="text-neon-cyan">Quest</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to={`/dashboard?class=${grade}&board=${board}`} className="flex items-center gap-1.5 rounded-full border border-panel-line px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-ink-muted hover:border-neon-cyan/60 hover:text-neon-cyan">
              <LayoutDashboard className="h-3.5 w-3.5" /> Dashboard
            </Link>
            <Link to={`/profile?class=${grade}&board=${board}`} className="flex items-center gap-1.5 rounded-full border border-panel-line px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-ink-muted hover:border-neon-cyan/60 hover:text-neon-cyan">
              <UserRound className="h-3.5 w-3.5" /> Profile
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="relative mx-auto mt-8 max-w-4xl px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-reward-gold">Leaderboard</span>
            <h1 className="mt-2 font-display text-3xl font-bold uppercase tracking-wide text-ink-primary sm:text-4xl">
              Top Learners
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {myProgress && (
              <div className="hud-frame flex items-center gap-2 rounded-xl border border-panel-line bg-panel/60 px-5 py-3" style={{ "--hud-color": "#38D9F4" }}>
                <Trophy className="h-5 w-5 text-neon-cyan" />
                <span className="font-display text-lg font-bold text-ink-primary">#{myProgress.rank}</span>
                <span className="font-mono text-[11px] uppercase tracking-widest text-ink-faint">Your Rank</span>
              </div>
            )}
            <button type="button" onClick={handleDownloadPdf} disabled={!myProgress} className="flex items-center gap-1.5 rounded-full border border-panel-line bg-panel/50 px-4 py-2.5 font-mono text-[11px] uppercase tracking-widest text-ink-muted transition-colors hover:border-neon-cyan/60 hover:text-neon-cyan disabled:cursor-not-allowed disabled:opacity-50">
              <Download className="h-3.5 w-3.5" /> PDF
            </button>
            <button type="button" onClick={handleDownloadExcel} disabled={!myProgress} className="flex items-center gap-1.5 rounded-full border border-panel-line bg-panel/50 px-4 py-2.5 font-mono text-[11px] uppercase tracking-widest text-ink-muted transition-colors hover:border-neon-green/60 hover:text-neon-green disabled:cursor-not-allowed disabled:opacity-50">
              <FileSpreadsheet className="h-3.5 w-3.5" /> Excel
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search player name..."
            className="max-w-xs"
          />
        </div>

        {/* Leaderboard type tabs */}
        <div className="mt-5 flex flex-wrap gap-2">
          {LEADERBOARD_TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setLeaderboardTab(tab.id)}
                className={`flex items-center gap-1.5 rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-widest transition-colors ${
                  leaderboardTab === tab.id
                    ? "border-arcane-purple bg-arcane-purple text-void"
                    : "border-panel-line text-ink-muted hover:text-ink-primary"
                }`}
              >
                <Icon className="h-3.5 w-3.5" /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Scope + Period + Subject filters */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="flex gap-1 rounded-full border border-panel-line bg-panel/50 p-1">
            {LEADERBOARD_SCOPES.map((s) => (
              <button key={s.id} type="button" onClick={() => setScope(s.id)} className={`rounded-full px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-widest transition-colors ${scope === s.id ? "bg-arcane-purple text-void" : "text-ink-muted hover:text-ink-primary"}`}>
                {s.label}
              </button>
            ))}
          </div>
          <div className="flex gap-1 rounded-full border border-panel-line bg-panel/50 p-1">
            {LEADERBOARD_PERIODS.map((p) => (
              <button key={p.id} type="button" onClick={() => setPeriod(p.id)} className={`rounded-full px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-widest transition-colors ${period === p.id ? "bg-neon-cyan text-void" : "text-ink-muted hover:text-ink-primary"}`}>
                {p.label}
              </button>
            ))}
          </div>
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="rounded-full border border-panel-line bg-panel/50 px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-ink-muted focus:border-neon-cyan/60 focus:outline-none"
          >
            {SUBJECT_FILTERS.map((sf) => (
              <option key={sf.id} value={sf.id}>{sf.label}</option>
            ))}
          </select>
        </div>

        {/* Rows + My Progress */}
        <div className="mt-6 flex flex-col-reverse gap-6 sm:flex-row sm:items-start">
          <div className="min-w-0 flex-1">
            {topRows.length === 0 && (
              <div className="rounded-xl border border-dashed border-panel-line bg-panel/40 py-10 text-center">
                <p className="font-mono text-xs text-ink-faint">No results found{searchQuery ? ` for "${searchQuery}"` : ""}.</p>
              </div>
            )}
            <div className="space-y-2">
              {topRows.map((row) => (
                <LeaderboardRow key={row.name} row={row} youAvatarIconName={youAvatarIconName} />
              ))}
            </div>
            {!yourRowVisible && baseYourRow && !searchQuery && (
              <div className="mt-4 border-t border-panel-line pt-4">
                <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-ink-faint">Your Position</p>
                <LeaderboardRow row={baseYourRow} youAvatarIconName={youAvatarIconName} />
              </div>
            )}
          </div>
          {myProgress && <MyProgressPanel progress={myProgress} />}
        </div>
      </div>

      <GameNav active="leaderboard" grade={grade} board={board} subject={subject} />
    </div>
  );
}
