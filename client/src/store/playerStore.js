// Lightweight localStorage-backed persistence for the parts of LearnQuest
// that previously reset on every reload: coin balance, XP earned in
// battle, shop purchases/equipped items, and which lesson+difficulty
// combos and chapter bosses a player has actually cleared.
//
// This is intentionally a thin client-side store, not a backend — there's
// still no real API (Section 40). It exists so playing a level or buying
// a shop item has a lasting effect instead of vanishing on refresh, per
// Section 43's "efficient state management" and to make Section 33's
// shop and Section 19's XP/coins actually mean something across a
// session. Swap this out for real GET/POST /api/player calls once that
// backend exists — every function here has a shape that should translate
// directly (addRewards -> POST /api/player/progress, etc).

const STORAGE_KEY = "chemquest:player:v1";

import { useEffect, useState } from "react";
import {
  MOCK_PLAYER,
  MOCK_BADGES,
  MOCK_ACHIEVEMENTS,
  SHOP_ITEMS,
  WORLD_TEMPLATE,
  WORLD_TEMPLATES_BY_SUBJECT,
  LESSONS_BY_WORLD,
  DIFFICULTIES,
  starsForProgress,
  getWorldMap,
  getCourseDetail,
  getDifficultyProgress,
  worldTemplateFor,
} from "../data/content.js";

// Icon shown when a player has no avatar equipped yet (shouldn't normally
// happen since defaultState() always equips the one starter-owned avatar,
// but this keeps every avatar-reading component safe either way).
export const DEFAULT_AVATAR_ICON = "UserRound";

function defaultState() {
  const ownedItems = SHOP_ITEMS.filter((i) => i.owned).map((i) => i.id);
  const equipped = {};
  for (const item of SHOP_ITEMS) {
    if (item.owned) equipped[item.category] = item.id;
  }
  return {
    coins: MOCK_PLAYER.coins,
    xp: MOCK_PLAYER.xp,
    totalXpEarned: 0,
    ownedItems,
    equipped,
    // Power-ups (Section 20) are stackable consumables, not single
    // owned/equipped cosmetics — this is a separate itemId -> quantity
    // map so a player can buy several Hint Potions, use one in battle,
    // and still have the rest tomorrow.
    powerups: {},
    // completions keyed "grade-board-worldId-lessonId-difficultyId" ->
    // { accuracy, stars, xp, coins, completedAt }
    completions: {},
    // bosses defeated, keyed "grade-board-worldId"
    bossesDefeated: [],
    // Daily quest claims, keyed "YYYY-MM-DD" -> array of claimed quest ids.
    // Keying by day means claims naturally "reset daily at midnight" the
    // next time this key changes, without needing a cron job or backend.
    dailyQuestClaims: {},
    // Real day-streak tracking (was previously just MOCK_PLAYER.streak's
    // hardcoded "7" everywhere, which never moved no matter how the
    // player actually played). lastPlayedDate is a todayKey()-format
    // string; streak increments once per new calendar day the player
    // shows up, and resets if a day is skipped.
    lastPlayedDate: null,
    streak: 0,
    // Mock-mode profile overrides (Section 5/6/8) — name/photo/language a
    // player has edited from the Profile page. In real-API mode
    // (USE_MOCK_API=false) these are never read; the backend's players
    // row is the source of truth instead (see api/profile.js).
    name: MOCK_PLAYER.name,
    profilePhoto: null,
    language: "en",
  };
}

// Local (not UTC) calendar-day key so "resets at midnight" matches the
// player's own clock rather than jumping over at UTC midnight.
export function todayKey() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function yesterdayKey() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// Call once per app visit (Dashboard mount) to register "the player showed
// up today". Idempotent within a day — calling it twice on the same day
// (e.g. remounting Dashboard) does not double-increment. Consecutive
// calendar days increment the streak; a skipped day resets it to 1.
export function touchDailyStreak() {
  const state = getPlayerState();
  const today = todayKey();
  if (state.lastPlayedDate === today) return state; // already counted today
  state.streak = state.lastPlayedDate === yesterdayKey() ? state.streak + 1 : 1;
  state.lastPlayedDate = today;
  return persist(state);
}

// --- Cross-component reactivity -----------------------------------------
//
// getPlayerState()/persist() are plain localStorage reads/writes with no
// built-in reactivity, so a component that just calls getPlayerState() once
// (e.g. in useState's initializer) never finds out when another *already
// mounted* component — most commonly the Shop page equipping a new avatar
// while the Sidebar player card is sitting right next to it — changes the
// store. This tiny pub/sub lets any component subscribe and re-read the
// store the instant something else on screen calls persist().
const listeners = new Set();

function notify() {
  listeners.forEach((listener) => listener());
}

// Register a callback to run after every persist() (buy/equip/rewards/etc).
// Returns an unsubscribe function. See usePlayerState() below for the
// typical way components use this.
export function subscribePlayerState(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function safeParse(raw) {
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function getPlayerState() {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = safeParse(raw);
    if (!parsed) return defaultState();
    // Merge with defaults so new fields added later don't crash on old saves.
    return { ...defaultState(), ...parsed };
  } catch {
    return defaultState();
  }
}

function persist(state) {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage unavailable (private browsing, quota, etc) — fail silently,
      // the session still works, it just won't persist across reloads.
    }
  }
  // Always notify, even if localStorage failed — every mounted component
  // reading live store data (avatar, coins, equipped items, ...) should
  // still update within this session.
  notify();
  return state;
}

export function completionKey(grade, board, worldId, lessonId, difficultyId) {
  return `${grade ?? "9"}-${board ?? "CBSE"}-${worldId}-${lessonId}-${difficultyId}`;
}

export function bossKey(grade, board, worldId) {
  return `${grade ?? "9"}-${board ?? "CBSE"}-${worldId}`;
}

// XP needed per level: level 1->2 needs 100 XP, each subsequent level
// requires 50 more XP than the previous. Level 100 requires 5050 total.
const XP_PER_LEVEL_BASE = 100;
const XP_PER_LEVEL_INCREMENT = 50;

export function xpForLevel(level) {
  return XP_PER_LEVEL_BASE + (level - 1) * XP_PER_LEVEL_INCREMENT;
}

export function levelFromXp(totalXp) {
  let level = 1;
  let remaining = totalXp;
  while (remaining >= xpForLevel(level) && level < 100) {
    remaining -= xpForLevel(level);
    level++;
  }
  return level;
}

export function xpIntoCurrentLevel(totalXp) {
  let level = 1;
  let remaining = totalXp;
  while (remaining >= xpForLevel(level) && level < 100) {
    remaining -= xpForLevel(level);
    level++;
  }
  return remaining;
}

// Adds XP/coins earned from a completed battle to the running total.
export function addRewards(xp, coins) {
  const state = getPlayerState();
  state.coins += coins;
  state.xp += xp;
  state.totalXpEarned += xp;
  state.level = levelFromXp(state.totalXpEarned);
  return persist(state);
}

// Records (or updates, if replayed with a better score) a lesson+difficulty
// clear so it can outlast a page refresh.
export function recordLessonCompletion(key, result) {
  const state = getPlayerState();
  const existing = state.completions[key];
  if (!existing || result.accuracy >= existing.accuracy) {
    state.completions[key] = { ...result, completedAt: Date.now() };
  }
  return persist(state);
}

export function getLessonCompletion(key) {
  return getPlayerState().completions[key] ?? null;
}

export function recordBossDefeat(key) {
  const state = getPlayerState();
  if (!state.bossesDefeated.includes(key)) {
    state.bossesDefeated.push(key);
  }
  return persist(state);
}

export function isBossDefeated(key) {
  return getPlayerState().bossesDefeated.includes(key);
}

// Attempts to spend coins (shop purchases). Returns true on success, false
// if the player can't afford it — caller should not apply the purchase if
// this returns false.
export function buyItem(itemId, price, category) {
  const state = getPlayerState();
  if (state.ownedItems.includes(itemId)) return true;
  if (state.coins < price) return false;
  state.coins -= price;
  state.ownedItems.push(itemId);
  state.equipped[category] = itemId;
  persist(state);
  return true;
}

export function equipItem(itemId, category) {
  const state = getPlayerState();
  if (!state.ownedItems.includes(itemId)) return state;
  state.equipped[category] = itemId;
  return persist(state);
}

// --- Mock-mode profile edits (Sections 5/6/8) -----------------------------
//
// Only used when USE_MOCK_API is true (see api/profile.js) — a stand-in
// for the real PUT /api/profile / POST /api/profile/photo / PUT
// /api/profile/language backend calls, following the same "swap for a
// real API later" pattern as the rest of this store.

export function updateProfileFields({ name } = {}) {
  const state = getPlayerState();
  if (typeof name === "string" && name.trim()) {
    state.name = name.trim();
  }
  return persist(state);
}

export function setProfilePhoto(dataUrl) {
  const state = getPlayerState();
  state.profilePhoto = dataUrl;
  return persist(state);
}

export function removeProfilePhoto() {
  const state = getPlayerState();
  state.profilePhoto = null;
  return persist(state);
}

export function setLanguagePreference(language) {
  const state = getPlayerState();
  state.language = language;
  return persist(state);
}

// --- Shared avatar state --------------------------------------------------
//
// One source of truth for "what avatar is currently equipped" — every
// screen that shows the player's avatar (Dashboard, Profile, Sidebar,
// World Map, Battle/Boss Battle, Level Complete, Leaderboard's "You" row)
// should derive its icon from here instead of hardcoding one, so equipping
// a new avatar in the Shop instantly replaces it everywhere, and it stays
// correct after refresh, logout/login, and navigation (all backed by the
// same STORAGE_KEY persisted state).

// Pure helper: given a player state object, resolve the lucide-react icon
// name for the currently equipped avatar. Falls back to DEFAULT_AVATAR_ICON
// if nothing is equipped/owned (shouldn't happen from defaultState(), but
// keeps this safe against corrupted/edited localStorage too).
export function getEquippedAvatarIcon(state) {
  const equippedId = state?.equipped?.avatars;
  const item = SHOP_ITEMS.find((i) => i.category === "avatars" && i.id === equippedId);
  return item?.icon ?? DEFAULT_AVATAR_ICON;
}

// React hook: live player state that re-renders its component whenever
// ANY component calls a store mutator (buyItem/equipItem/addRewards/...),
// not just after this component's own actions or a full page nav/remount.
// This is what makes "click Equip in the Shop" instantly update the
// Sidebar player card sitting on the same page, with no prop drilling and
// no manual refetching required from callers.
export function usePlayerState() {
  const [state, setState] = useState(() => getPlayerState());
  useEffect(() => subscribePlayerState(() => setState(getPlayerState())), []);
  return state;
}

// Convenience hook for the common case of "just give me the equipped
// avatar icon name to render". Combine with lucide-react's `Icons[name]`.
export function useEquippedAvatarIcon() {
  const state = usePlayerState();
  return getEquippedAvatarIcon(state);
}

// --- Power-ups (Section 20) ---------------------------------------------
//
// Unlike cosmetics, power-ups are consumable and stackable: buying one
// never marks it "owned" (which would block re-buying), it just adds a
// charge. Battle/Boss Battle spend charges as they're used and never
// refund them — a used Hint Potion is gone even if you retry the level.

export function getPowerupCounts() {
  return { ...getPlayerState().powerups };
}

// Buying a power-up is unlimited (no "owned" gate) — every purchase adds
// one more charge as long as the player can afford it.
export function buyPowerup(itemId, price) {
  const state = getPlayerState();
  if (state.coins < price) return false;
  state.coins -= price;
  state.powerups[itemId] = (state.powerups[itemId] ?? 0) + 1;
  persist(state);
  return true;
}

// Spends one charge of a power-up (called the moment it's activated in
// battle). Returns false if the player has none left, in which case the
// caller should not apply the power-up's effect.
export function usePowerupCharge(itemId) {
  const state = getPlayerState();
  const count = state.powerups[itemId] ?? 0;
  if (count <= 0) return false;
  state.powerups[itemId] = count - 1;
  persist(state);
  return true;
}

// --- Daily quests (Section 41-ish) --------------------------------------
//
// A quest is "claimed" once per calendar day, keyed by todayKey() so it
// naturally becomes claimable again after the UI's own "resets daily at
// midnight" boundary. Claiming both records the claim and adds the
// XP/coins to the running totals in one go, so the Daily Quests screen's
// Claim button has a real, persistent effect instead of doing nothing.

export function getClaimedQuestIds(dateKey = todayKey()) {
  const state = getPlayerState();
  return state.dailyQuestClaims[dateKey] ?? [];
}

// Returns { state, claimed }. claimed is false if this quest was already
// claimed today (or coins/xp are otherwise not applied twice) — caller
// should treat that as a no-op, not an error.
export function claimDailyQuest(questId, xp, coins, dateKey = todayKey()) {
  const state = getPlayerState();
  const claimedToday = state.dailyQuestClaims[dateKey] ?? [];
  if (claimedToday.includes(questId)) {
    return { state, claimed: false };
  }
  state.coins += coins;
  state.xp += xp;
  state.totalXpEarned += xp;
  state.dailyQuestClaims[dateKey] = [...claimedToday, questId];
  return { state: persist(state), claimed: true };
}

// Escape hatch for Settings -> "Reset Progress", if ever wired up.
export function resetPlayerState() {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }
  return defaultState();
}

// --- Live progress overlays -------------------------------------------
//
// World Map / Course / Difficulty screens (Sections 10–13) originally
// always showed seeded mock progress, even after a player actually
// cleared a lesson. These wrap the base content.js generators and patch
// in real completions from the store wherever they exist, so playing a
// level has a lasting, visible effect on the map instead of only
// affecting the Battle screen's own local XP/coin counters.
//
// A world/lesson/difficulty the player hasn't actually touched yet still
// falls back to the original seeded mock so the map doesn't look empty
// on a first visit — only real play overrides it.

export function getWorldMapLive(grade, board, subject) {
  const base = getWorldMap(grade, board, subject);
  const state = getPlayerState();

  let previousCleared = true;

  const worlds = base.worlds.map((world) => {
    const bKey = bossKey(grade, board, world.id);
    const bossDone = state.bossesDefeated.includes(bKey);
    const lessonDefs = LESSONS_BY_WORLD[world.id] ?? [];
    const total = lessonDefs.length || 1;

    let lessonsCleared = 0;
    let worldXpFromPlay = 0;
    let anyRealCompletion = false;

    for (const lesson of lessonDefs) {
      const easyKey = completionKey(grade, board, world.id, lesson.id, "easy");
      if (state.completions[easyKey]) {
        lessonsCleared += 1;
        anyRealCompletion = true;
      }
      for (const difficulty of DIFFICULTIES) {
        const key = completionKey(grade, board, world.id, lesson.id, difficulty.id);
        const completion = state.completions[key];
        if (completion) worldXpFromPlay += completion.xp;
      }
    }

    const hasRealData = anyRealCompletion || bossDone;

    if (!hasRealData) {
      // No real play in this world — respect the seeded mock, but if an
      // earlier world was really cleared, don't leave this one stuck
      // "locked" behind stale mock data.
      const result = previousCleared ? world : { ...world, status: "locked", progress: 0, stars: 0, xp: 0 };
      previousCleared = result.status === "completed";
      return result;
    }

    const progress = bossDone ? 100 : Math.min(96, Math.round((lessonsCleared / total) * 100));
    const status = bossDone ? "completed" : "unlocked";
    const stars = bossDone ? 3 : starsForProgress(progress);

    previousCleared = status === "completed";

    return { ...world, status, progress, stars, xp: worldXpFromPlay };
  });

  const completedCount = worlds.filter((w) => w.status === "completed").length;
  const totalStars = worlds.reduce((sum, w) => sum + w.stars, 0);
  const totalXp = worlds.reduce((sum, w) => sum + w.xp, 0);
  const overallProgress = Math.round(
    worlds.reduce((sum, w) => sum + (w.status === "completed" ? 100 : w.progress), 0) / worlds.length
  );

  return { worlds, completedCount, totalStars, totalXp, overallProgress };
}

// Live version of content.js's MOCK_ACHIEVEMENTS: same shape/ids/icons/
// names/descriptions (so AchievementsPage doesn't need to change how it
// renders them), but unlocked/progress are computed from real play in the
// store instead of being permanently hardcoded true/false — so, e.g.,
// "Boss Slayer" only shows unlocked once the player has actually beaten 3
// bosses in this grade/board, not on page load regardless of history.
export function getAchievementsLive(grade, board, subject) {
  const state = getPlayerState();
  const prefix = `${grade ?? "9"}-${board ?? "CBSE"}-`;

  const bossesThisCurriculum = state.bossesDefeated.filter((k) => k.startsWith(prefix));
  const completionsThisCurriculum = Object.entries(state.completions).filter(([k]) =>
    k.startsWith(prefix)
  );

  const hasAnyCompletion = completionsThisCurriculum.length > 0;
  const hasPerfectScore = completionsThisCurriculum.some(([, c]) => c.accuracy >= 100);

  const worldsTouched = new Set(
    completionsThisCurriculum.map(([k]) => k.slice(prefix.length).split("-")[0])
  );
  const currentTemplate = worldTemplateFor(subject);
  const allWorldsVisited = currentTemplate.every((w) => worldsTouched.has(w.id));

  const firstWorld = currentTemplate[0];
  const firstWorldLessons = firstWorld ? (LESSONS_BY_WORLD[firstWorld.id] ?? []) : [];
  const firstWorldExpertDone =
    firstWorldLessons.length > 0 &&
    firstWorldLessons.every((lesson) =>
      DIFFICULTIES.some((d) => {
        const key = completionKey(grade, board, firstWorld.id, lesson.id, d.id);
        return (state.completions[key]?.accuracy ?? 0) >= 90;
      })
    );

  const { totalStars } = getWorldMapLive(grade, board, subject);
  const totalQuestionsAnswered = completionsThisCurriculum.length;
  const totalQuizzesCompleted = completionsThisCurriculum.filter(([, c]) => c.stars >= 1).length;

  const progressById = {
    "first-quest": { unlocked: hasAnyCompletion },
    "streak-7": {
      unlocked: state.streak >= 7,
      progressCurrent: Math.min(state.streak, 7),
      progressTarget: 7,
    },
    "streak-30": {
      unlocked: state.streak >= 30,
      progressCurrent: Math.min(state.streak, 30),
      progressTarget: 30,
    },
    "world-expert": { unlocked: firstWorldExpertDone },
    "world-explorer": { unlocked: allWorldsVisited },
    "boss-slayer": {
      unlocked: bossesThisCurriculum.length >= 3,
      progressCurrent: Math.min(bossesThisCurriculum.length, 3),
      progressTarget: 3,
    },
    "50-stars": {
      unlocked: totalStars >= 50,
      progressCurrent: Math.min(totalStars, 50),
      progressTarget: 50,
    },
    "perfect-score": {
      unlocked: hasPerfectScore,
      progressCurrent: hasPerfectScore ? 1 : 0,
      progressTarget: 1,
    },
    "subject-legend": {
      unlocked: bossesThisCurriculum.length >= currentTemplate.length,
      progressCurrent: bossesThisCurriculum.length,
      progressTarget: currentTemplate.length,
    },
    "quiz-champion": {
      unlocked: totalQuizzesCompleted >= 10,
      progressCurrent: Math.min(totalQuizzesCompleted, 10),
      progressTarget: 10,
    },
    "speed-solver": {
      unlocked: completionsThisCurriculum.some(([, c]) => c.timeTakenMs && c.timeTakenMs < 5000),
    },
    "100-questions": {
      unlocked: totalQuestionsAnswered >= 100,
      progressCurrent: Math.min(totalQuestionsAnswered, 100),
      progressTarget: 100,
    },
    "practice-master": {
      unlocked: completionsThisCurriculum.filter(([, c]) => c.accuracy >= 90).length >= 20,
      progressCurrent: Math.min(completionsThisCurriculum.filter(([, c]) => c.accuracy >= 90).length, 20),
      progressTarget: 20,
    },
    "level-up": {
      unlocked: state.level >= 5,
      progressCurrent: Math.min(state.level, 5),
      progressTarget: 5,
    },
    "coin-collector": {
      unlocked: state.coins >= 1000,
      progressCurrent: Math.min(state.coins, 1000),
      progressTarget: 1000,
    },
    "daily-devotee": {
      unlocked: state.streak >= 3,
      progressCurrent: Math.min(state.streak, 3),
      progressTarget: 3,
    },
  };

  return MOCK_ACHIEVEMENTS.map((a) => {
    const live = progressById[a.id] ?? progressById[a.id?.replace(/_/g, "-")];
    if (!live) return a;
    return {
      ...a,
      unlocked: live.unlocked,
      progressCurrent: live.progressCurrent,
      progressTarget: live.progressTarget,
      unlockedMeta: live.unlocked ? "Unlocked" : undefined,
    };
  });
}

// Live version of content.js's getDashboardData — same shape (so
// DashboardPage doesn't need to change how it reads the result), but
// "worlds"/"continueWorld"/totals come from getWorldMapLive instead of
// the static seeded mock, so a real lesson or boss clear immediately
// shows up as unlocked/cleared on the Dashboard's world cards and
// "Continue Adventure" card, not just on the World Map page.
export function getDashboardDataLive(grade, board, subject) {
  const currentGrade = grade ?? "9";
  const currentBoard = board ?? "CBSE";
  const { worlds, completedCount, totalStars, totalXp, overallProgress } = getWorldMapLive(
    currentGrade,
    currentBoard,
    subject
  );

  const continueWorld =
    worlds.find((w) => w.status === "unlocked") ??
    worlds.find((w) => w.status !== "completed") ??
    null;

  const otherCombos = [
    { grade: "9", board: "TN" },
    { grade: "10", board: "CBSE" },
    { grade: "8", board: "ICSE" },
    { grade: "11", board: "CBSE" },
  ].filter((c) => !(c.grade === currentGrade && c.board === currentBoard));

  const curricula = [
    { grade: currentGrade, board: currentBoard, current: true, overallProgress, totalStars },
    ...otherCombos.map((c) => {
      const map = getWorldMapLive(c.grade, c.board, subject);
      return {
        grade: c.grade,
        board: c.board,
        current: false,
        overallProgress: map.overallProgress,
        totalStars: map.totalStars,
      };
    }),
  ];

  return {
    worlds,
    completedCount,
    totalStars,
    totalXp,
    overallProgress,
    continueWorld,
    curricula,
    badgesUnlocked: MOCK_BADGES.filter((b) => b.unlocked).length,
  };
}

export function getCourseDetailLive(grade, board, worldId, subject) {
  const detail = getCourseDetail(grade, board, worldId, subject);
  if (!detail) return null;

  const state = getPlayerState();
  const bKey = bossKey(grade, board, worldId);
  const bossDone = state.bossesDefeated.includes(bKey);

  let anyReal = false;
  const lessons = detail.lessons.map((lesson) => {
    const easyKey = completionKey(grade, board, worldId, lesson.id, "easy");
    const completion = state.completions[easyKey];
    if (!completion) return lesson;
    anyReal = true;
    return { ...lesson, status: "completed", progress: 100, stars: completion.stars, xp: completion.xp };
  });

  if (!anyReal && !bossDone) return detail;

  // Unlock exactly the next lesson after the last real-completed one.
  let unlockedNext = false;
  const finalLessons = lessons.map((lesson) => {
    if (lesson.status === "completed") return lesson;
    if (!unlockedNext) {
      unlockedNext = true;
      return { ...lesson, status: "unlocked" };
    }
    return { ...lesson, status: "locked" };
  });

  const allLessonsCleared =
    finalLessons.length > 0 && finalLessons.every((l) => l.status === "completed");
  const bossStatus = bossDone ? "defeated" : allLessonsCleared ? "ready" : detail.bossStatus;

  const worldProgress = Math.round(
    (finalLessons.filter((l) => l.status === "completed").length / (finalLessons.length || 1)) * 100
  );

  // Recompute the hero card's XP/Stars from real play instead of leaving
  // them pinned to the seeded mock — this is the same math used by
  // getWorldMapLive so the World Map and this header always agree.
  let worldXpFromPlay = 0;
  for (const lesson of finalLessons) {
    for (const difficulty of DIFFICULTIES) {
      const key = completionKey(grade, board, worldId, lesson.id, difficulty.id);
      const completion = state.completions[key];
      if (completion) worldXpFromPlay += completion.xp;
    }
  }
  const worldStars = bossDone ? 3 : starsForProgress(worldProgress);

  return {
    world: {
      ...detail.world,
      status: bossDone ? "completed" : "unlocked",
      progress: bossDone ? 100 : worldProgress,
      xp: worldXpFromPlay,
      stars: worldStars,
    },
    lessons: finalLessons,
    bossStatus,
  };
}

export function getDifficultyProgressLive(grade, board, worldId, lessonId, subject) {
  const detail = getDifficultyProgress(grade, board, worldId, lessonId, subject);
  if (!detail) return null;

  const state = getPlayerState();

  let anyReal = false;
  let previousCleared = true;
  const difficulties = detail.difficulties.map((difficulty) => {
    const key = completionKey(grade, board, worldId, lessonId, difficulty.id);
    const completion = state.completions[key];
    if (completion) {
      anyReal = true;
      previousCleared = difficulty.unlockThreshold == null || completion.accuracy >= difficulty.unlockThreshold;
      return { ...difficulty, status: "completed", bestScore: completion.accuracy };
    }
    if (previousCleared) {
      previousCleared = false; // only the immediate next tier unlocks
      return { ...difficulty, status: "unlocked", bestScore: 0 };
    }
    return { ...difficulty, status: "locked", bestScore: 0 };
  });

  if (!anyReal) return detail;

  return { ...detail, difficulties };
}
