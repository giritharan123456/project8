import { useState, useEffect, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import * as Icons from "lucide-react";
import {
  ChevronLeft,
  Target,
  CheckCircle2,
  Clock,
  Flame,
  Award,
  Sparkles,
  Coins,
  Trophy,
  Zap,
  CalendarClock,
  ArrowRight,
} from "lucide-react";
import ParticleField from "../components/ParticleField.jsx";
import { getChallenges, claimChallengeReward } from "../api/endpoints.js";
import { addRewards } from "../store/playerStore.js";

const CHALLENGE_ICONS = {
  correct_answers: Target,
  complete_quizzes: Award,
  maintain_streak: Flame,
  high_scores: Trophy,
  practice_questions: Zap,
};

const CHALLENGE_COLORS = {
  correct_answers: "#4ADE80",
  complete_quizzes: "#38D9F4",
  maintain_streak: "#F87171",
  high_scores: "#FCD34D",
  practice_questions: "#806BFF",
};

function ChallengeCard({ challenge, onClaim }) {
  const Icon = CHALLENGE_ICONS[challenge.type] ?? Target;
  const color = CHALLENGE_COLORS[challenge.type] ?? "#806BFF";
  const pct = Math.min(100, Math.round((challenge.progress / challenge.target) * 100));
  const completed = challenge.completed;
  const claimable = completed && !challenge.claimed;
  const timeLeft = Math.max(0, challenge.expiresAt - Date.now());
  const hoursLeft = Math.floor(timeLeft / 3600000);
  const minutesLeft = Math.floor((timeLeft % 3600000) / 60000);

  return (
    <div
      className={`hud-frame rounded-xl border p-5 transition-all ${
        completed
          ? "border-neon-green/50 bg-neon-green/5"
          : "border-panel-line bg-panel/60"
      }`}
      style={{ "--hud-color": completed ? "#4ADE80" : color }}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full border ${
            completed
              ? "border-neon-green/60 bg-neon-green/15"
              : "border-panel-line bg-panel-line/20"
          }`}
        >
          {completed ? (
            <CheckCircle2 className="h-7 w-7 text-neon-green" strokeWidth={1.8} />
          ) : (
            <Icon className="h-7 w-7" style={{ color }} strokeWidth={1.7} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className={`font-display text-lg font-bold ${completed ? "text-neon-green" : "text-ink-primary"}`}>
              {challenge.title}
            </h3>
            <span className="font-mono text-xs text-ink-faint">
              {challenge.progress}/{challenge.target}
            </span>
          </div>

          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-panel-line">
            <div
              className={`h-full rounded-full ${completed ? "bg-neon-green" : ""}`}
              style={{ width: `${pct}%`, backgroundColor: completed ? undefined : color }}
            />
          </div>

          <div className="mt-2 flex items-center gap-4 text-xs text-ink-faint">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {hoursLeft > 0 ? `${hoursLeft}h ${minutesLeft}m left` : "Expiring soon"}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-mono text-sm text-reward-gold">
            <Sparkles className="h-4 w-4" /> +{challenge.xpReward}
          </span>
          <span className="flex items-center gap-1 font-mono text-sm text-reward-gold">
            <Coins className="h-4 w-4" /> +{challenge.coinReward}
          </span>
        </div>
        <button
          type="button"
          disabled={!claimable}
          onClick={claimable ? () => onClaim(challenge) : undefined}
          className={`rounded-xl px-4 py-2 font-display text-xs font-bold uppercase tracking-widest transition-transform ${
            claimable
              ? "bg-neon-green text-void hover:scale-[1.03] active:scale-[0.97]"
              : challenge.claimed
              ? "bg-panel-line/40 text-ink-faint"
              : completed
              ? "bg-neon-green/20 text-neon-green"
              : "cursor-not-allowed bg-panel-line/40 text-ink-faint"
          }`}
        >
          {challenge.claimed ? "Claimed" : claimable ? "Claim" : completed ? "Complete" : `${pct}%`}
        </button>
      </div>
    </div>
  );
}

function HistoryRow({ challenge }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-panel-line bg-panel/40 p-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neon-green/15">
        <CheckCircle2 className="h-4 w-4 text-neon-green" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="truncate font-body text-sm text-ink-primary">{challenge.title}</p>
        <p className="font-mono text-[10px] text-ink-faint">
          Completed {Math.round((Date.now() - (challenge.expiresAt - 86400000)) / 86400000)}d ago
        </p>
      </div>
      <div className="text-right">
        <p className="font-mono text-xs text-neon-green">+{challenge.xpReward} XP</p>
        <p className="font-mono text-[10px] text-ink-faint">+{challenge.coinReward} coins</p>
      </div>
    </div>
  );
}

export default function ChallengePage() {
  const [searchParams] = useSearchParams();
  const grade = searchParams.get("class") ?? "9";
  const board = searchParams.get("board") ?? "CBSE";
  const subject = searchParams.get("subject") ?? "CHEM";
  const queryBase = `?class=${grade}&board=${board}&subject=${subject}`;

  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const loadChallenges = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getChallenges();
      setChallenges(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadChallenges();
  }, [loadChallenges]);

  async function handleClaim(challenge) {
    try {
      const result = await claimChallengeReward(challenge.id);
      if (result.ok) {
        addRewards(challenge.xpReward, challenge.coinReward);
        setChallenges((prev) =>
          prev.map((c) => (c.id === challenge.id ? { ...c, claimed: true } : c))
        );
        setToast(`Claimed +${challenge.xpReward} XP and +${challenge.coinReward} coins!`);
        setTimeout(() => setToast(null), 3000);
      }
    } catch {
      // ignore
    }
  }

  const active = challenges.filter((c) => !c.claimed);
  const completed = challenges.filter((c) => c.claimed);
  const totalXp = completed.reduce((sum, c) => sum + c.xpReward, 0);
  const totalCoins = completed.reduce((sum, c) => sum + c.coinReward, 0);

  return (
    <div className="relative min-h-screen bg-void">
      <div className="absolute inset-0 bg-radial-fade" />
      <div className="aurora-canvas pointer-events-none absolute inset-0" aria-hidden="true" />
      <ParticleField density={14} />

      {toast && (
        <div className="fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-lg border border-neon-green/50 bg-panel/95 px-4 py-2 font-display text-sm font-bold text-neon-green backdrop-blur-sm">
          {toast}
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-2xl px-4 py-8">
        <Link
          to={`/dashboard${queryBase}`}
          className="mb-6 inline-flex items-center gap-1 font-display text-sm text-ink-muted hover:text-ink-primary"
        >
          <ChevronLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        <div className="flex items-end justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-ink-primary">
              Challenges
            </h1>
            <p className="mt-2 font-body text-sm text-ink-muted">
              Complete challenges to earn bonus rewards.
            </p>
          </div>
          <div className="text-right">
            <p className="font-mono text-xs text-ink-faint">Rewards Earned</p>
            <p className="font-display text-lg font-bold text-reward-gold">
              +{totalXp} XP / +{totalCoins} coins
            </p>
          </div>
        </div>

        {loading ? (
          <div className="mt-12 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-arcane-purple border-t-transparent" />
          </div>
        ) : (
          <>
            <div className="mt-8">
              <h2 className="mb-4 font-display text-lg font-bold text-ink-primary flex items-center gap-2">
                <CalendarClock className="h-5 w-5 text-arcane-purple" /> Active Challenges
              </h2>
              <div className="space-y-3">
                {active.length > 0 ? (
                  active.map((challenge) => (
                    <ChallengeCard key={challenge.id} challenge={challenge} onClaim={handleClaim} />
                  ))
                ) : (
                  <div className="rounded-xl border border-panel-line bg-panel/40 p-8 text-center">
                    <Target className="mx-auto h-8 w-8 text-ink-faint" />
                    <p className="mt-2 font-body text-sm text-ink-muted">No active challenges. Check back soon!</p>
                  </div>
                )}
              </div>
            </div>

            {completed.length > 0 && (
              <div className="mt-8">
                <h2 className="mb-4 font-display text-lg font-bold text-ink-primary flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-neon-green" /> Completed
                </h2>
                <div className="space-y-2">
                  {completed.map((challenge) => (
                    <HistoryRow key={challenge.id} challenge={challenge} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
