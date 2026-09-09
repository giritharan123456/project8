# ChemQuest — Landing Page + Onboarding + World Map + Battle + Boss Battle

A gaming-style front end for ChemQuest, built with React + Vite + Tailwind.
Covers the **landing page** (Hero, Statistics, Why ChemQuest, How It Works,
Final CTA), **Sign In / Sign Up**, **Class & Board Selection**, the
**Chemistry World map**, the **Course/Chapter screen**, **Difficulty
Select**, the **Battle / Gameplay screen**, and the **Chapter Boss
Battle**. The dashboard/profile/shop/leaderboard screens are separate
builds that slot into this same project shell via the router.

## Stack

- **React 18** + **Vite** — fast dev server, simple build output
- **React Router 6** — client-side routing between screens
- **Tailwind CSS** — design tokens defined once in `tailwind.config.js`
- **lucide-react** — icon set used throughout

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
npm run build      # production build to /dist
```

## Project structure

```
src/
  App.jsx                Route table (react-router-dom)
  pages/
    LandingPage.jsx       Composes the landing sections below
    SignInPage.jsx         Standalone gaming Sign In screen (no navbar/footer)
    SignUpPage.jsx          Chemist profile creation (name/email/password/class/board)
    ClassSelectionPage.jsx  Onboarding step 1 — Choose Your Class (Section 6)
    BoardSelectionPage.jsx  Onboarding step 2 — Choose Your Board (Section 7)
    WorldMapPage.jsx        Chemistry World map — the main game hub (Section 10)
    CourseDetailPage.jsx    Course/Chapter screen — lesson list + boss card (Section 11)
    DifficultySelectPage.jsx  Difficulty select for one lesson (Sections 12 & 13)
    BattlePage.jsx           Battle / gameplay screen — HP, timer, MCQs, lives (Section 14)
    BossBattlePage.jsx       Chapter Boss Battle — 10 mixed-difficulty questions (Section 21)
  components/
    Navbar.jsx        Sticky nav, mobile menu — landing page only
    Hero.jsx           Wordmark, CTAs, HUD "unit card"
    ParticleField.jsx  Canvas molecule/particle background (hero + sign-in)
    StatsBar.jsx        Animated stat ticker (10K+ Players, etc.)
    WhyChemQuest.jsx    6 feature/"ability" cards
    HowItWorks.jsx      7-step quest trail, scroll-revealed
    FinalCTA.jsx
    Footer.jsx          Landing page only
  data/
    content.js          All copy + stats + feature/step data in one place
  hooks/
    useInView.js         One-shot IntersectionObserver hook
    useCountUp.js        Eased 0→target counter
  index.css              Tailwind layers + hand-written HUD utility classes
```

## Routes

| Path            | Screen                                                    |
|-----------------|-------------------------------------------------------------|
| `/`             | Landing page (Navbar + sections + Footer)                   |
| `/sign-in`      | Sign In — standalone, no site chrome                         |
| `/sign-up`      | Sign Up — Create Your Chemist Profile                        |
| `/select-class` | Onboarding step 1 — Choose Your Class                        |
| `/select-board` | Onboarding step 2 — Choose Your Board (reads `?class=`)      |
| `/world`        | Chemistry World map (reads `?class=&board=`)                 |
| `/course/:worldId` | Course/Chapter screen — lessons + boss card (reads `?class=&board=`) |
| `/play/:worldId/:lessonId` | Difficulty select — Easy/Medium/Hard/Expert for one lesson (reads `?class=&board=`) |
| `/battle/:worldId/:lessonId/:difficultyId` | Battle screen for one lesson + difficulty tier (reads `?class=&board=`) |
| `/boss/:worldId` | Chapter Boss Battle — 10 mixed-difficulty questions (reads `?class=&board=`) |

| `/forgot-password` | Forgot Password — email-only reset request + confirmation screen |

## Design system

Tokens live in `tailwind.config.js` under `theme.extend`:

- **Colors** — `void` (background), `panel` (card surfaces), `arcane`
  (purple), `neon` (cyan/green), `reward` (gold). Card accent colors are
  assigned by *category* in `content.js` (`FEATURE_ACCENTS`), not by
  position — mechanics = cyan, battle = purple, reward = gold, explore =
  green — so color carries meaning rather than decorating identically.
- **Type** — `font-wordmark` (Orbitron, logo/hero title only),
  `font-display` (Rajdhani, headings/UI), `font-body` (Inter, paragraph
  copy), `font-mono` (JetBrains Mono, HUD numbers/labels).
- **`.hud-frame`** — the recurring corner-bracket frame (hero card, stat
  ticker, feature cards). Set `--hud-color` inline to recolor per section.

## Notes for whoever picks this up

- All copy and numbers are centralized in `src/data/content.js` — swap in
  real stats/copy there rather than editing components.
- `StatsBar` numbers are currently mock data per the brief (10K+ Players,
  120+ Lessons, 5000+ Questions, 50+ Achievements) — wire to
  `GET /api/player` aggregates or similar when the real API is live.
- `prefers-reduced-motion` is respected in the particle field and globally
  in `index.css`.
- Nothing here talks to a backend yet — every CTA is an anchor link
  (`#start`, `#sign-in`) as a placeholder for routing once the app shell
  exists.
- **A real backend now exists** at `../chemquest-server` (Sections 39–40)
  implementing every route `src/api/endpoints.js` expects. Copy
  `.env.example` to `.env`, set `VITE_USE_MOCK_API=false`, run the server
  (`cd ../chemquest-server && npm install && npm run dev`), and every page
  switches from mock data to real HTTP calls with no other changes — see
  that project's README for the full route table and what's still a
  placeholder (there's no real auth yet, just an anonymous session cookie).
- If Tailwind classes are ever built dynamically from a variable again
  (see the comment above `FEATURE_ACCENTS` in `content.js`), keep the full
  class string — including any `hover:`/`sm:` prefix — as one literal
  string somewhere Tailwind scans, or the JIT compiler will silently drop
  it from the production build.
- **Sign In** (`pages/SignInPage.jsx`) is presentational only — the form
  has `onSubmit={(e) => e.preventDefault()}` and the social buttons don't
  call any auth provider yet. Wire `POST /api/auth/login` (or whichever
  endpoint) and real OAuth handlers when the backend is ready.
- **Forgot Password** (`pages/ForgotPasswordPage.jsx`) — reached from Sign
  In's "Forgot Password?" link. Mock-validates the email looks like an
  email, then always shows the same "if an account matches..." confirmation
  regardless of whether the address is real, which is deliberate (standard
  practice against account enumeration) rather than an oversight. Wire a
  real `POST /api/auth/forgot-password`-style endpoint when the backend
  exists; keep the generic response either way.
- The Google/Facebook/Apple buttons use lucide's generic `Chrome`,
  `Facebook`, and `Apple` icons as stand-ins, not official brand marks —
  swap in each provider's real logo asset before shipping, since OAuth
  buttons typically have brand guidelines about logo usage.
- **World Map** (`pages/WorldMapPage.jsx`) reads `?class=` and `?board=`
  from the URL and calls `getWorldMap(grade, board)` in `data/content.js`
  to build the six worlds with lock/unlock/completed state, stars, and XP.
  That function currently derives *mock* progress from a deterministic
  string hash purely so different Class+Board combinations show different
  progress in the UI (per Section 28 — progress must never be shared
  across curricula). Replace it with a real `GET /api/player/progress`
  read once that endpoint exists; keep the returned shape
  (`{ worlds, completedCount, totalStars, totalXp, overallProgress }`) the
  same so `WorldMapPage` doesn't need to change.
- `MOCK_PLAYER` in `data/content.js` backs the HUD strip at the top of the
  World Map (level, XP bar, coins, streak) — wire to `GET /api/player`
  alongside the dashboard build.
- World *names/topics* live in `WORLD_TEMPLATE` — swap in real per-board
  curriculum data there (Section 41) without touching `WorldMapPage.jsx`.
- **Course/Chapter** (`pages/CourseDetailPage.jsx`) reads `:worldId` from
  the route plus `?class=&board=`, and calls `getCourseDetail(grade, board,
  worldId)` in `data/content.js`. That function reuses `getWorldMap`'s
  output for the world's own status/progress/stars/XP (so the map and the
  course screen never disagree), then distributes that progress across the
  world's lessons sequentially — same mock-hash approach as the world map,
  same caveat: replace with a real `GET /api/lessons?course=...` +
  `GET /api/player/progress` read once those exist, keeping the returned
  shape (`{ world, lessons, bossStatus }`) the same.
- Lesson copy per world lives in `LESSONS_BY_WORLD` — swap in real
  board/class lesson data there (Section 41) without touching
  `CourseDetailPage.jsx`.
- The chapter boss card's `bossStatus` is `"locked"` until every lesson in
  the world is completed, `"ready"` once they are, and `"defeated"` once
  the world itself is marked completed — matching Section 21's unlock
  rule ("after completing all lessons in a chapter, unlock chapter boss").
- **Difficulty Select** (`pages/DifficultySelectPage.jsx`) reads
  `:worldId`/`:lessonId` from the route plus `?class=&board=`, and calls
  `getDifficultyProgress(grade, board, worldId, lessonId)` in
  `data/content.js`. Tier data (XP/coin rewards, description, and the score
  % needed to unlock the next tier — 60/70/80 per Section 13) lives in
  `DIFFICULTIES`, so those numbers stay configurable rather than hard-coded
  into the unlock logic. If the lesson itself is locked, the page shows a
  locked state instead of four locked cards. Replace the mock-hash scoring
  with a real `GET /api/player/progress` read once it exists, keeping the
  returned shape (`{ world, lesson, difficulties }`) the same.
- **Battle** (`pages/BattlePage.jsx`) reads `:worldId`/`:lessonId`/
  `:difficultyId` plus `?class=&board=`, and calls `getBattleData(grade,
  board, worldId, lessonId, difficultyId)` in `data/content.js`, which
  pulls the matching pool from `QUESTION_BANK` and splits the difficulty
  tier's total XP/coin reward evenly across the questions in it (so a
  perfect clear pays out exactly the tier's listed Section 13 reward).
  Gameplay: 3 lives (Section 17) shared across the whole level, a
  per-question countdown timer (30/25/20/15s by tier), enemy HP that drops
  in even steps per correct answer, and a result screen (Section 22) with
  stars from `starsForProgress` (Section 18). Losing all lives ends the
  run early with a Game Over state and Retry / Practice Weak Topic
  buttons; clearing every question shows Level Completed and, if the
  score clears this tier's `unlockThreshold`, chains straight into the
  next difficulty rather than dropping back to the lesson list.
  - `QUESTION_BANK` currently has 4 hand-authored Multiple Choice
    questions per world × difficulty (96 total) — enough to play through
    every world/tier combination, but shallow compared to a real
    per-lesson bank. Real content should come from
    `GET /api/questions?lesson=&difficulty=` once that endpoint exists
    (Section 40), keeping each question's shape (Section 15) the same.
  - Multiple Choice, True/False, Fill in the Blank, Numerical, and
    Chemical Equation are wired up (Section 16). True/False just renders
    as a two-option MCQ. Fill in the Blank, Numerical, and Chemical
    Equation (a missing-coefficient fill-in, e.g. "___Fe + 3O2 → 2Fe2O3"
    → "4") all share `components/FillBlankInput.jsx` (Numerical switches
    on the mobile number keyboard via its `numeric` prop) and are graded
    by `isFreeTextCorrect()` in `data/content.js`, which does a trimmed
    case-insensitive string match plus, for Numerical, a numeric-
    equivalence check (so "18" and "18.0" both count). The remaining
    types (Match the Following, Drag and Drop, Image-based, Reaction)
    still need their own answer-input components before they can appear
    in the bank.
  - Nothing here writes back to a player/progress API — a completed
    battle doesn't update the mock progress `DifficultySelectPage` or
    `CourseDetailPage` show on return, so replaying the same lesson will
    still show its old mock state. Wire `POST /api/quiz/submit` (Section
    40) once it exists.
  - **Power-ups (Section 20) are implemented.** `PowerUpBar.jsx` renders
    the five power-ups (Hint Potion, Double XP, Shield, Time Freeze,
    Chemistry Hint) with live charge counts. Charges are bought in the
    Shop's Power-Ups tab (`buyPowerup` — stackable, unlike the one-time
    cosmetic items) and spent in Battle/Boss Battle via
    `usePowerupCharge`, both in `store/playerStore.js`. A used charge is
    gone for good, even on Retry. Hint Potion eliminates one wrong MCQ
    option per question; Chemistry Hint shows a short clue generated by
    `getPowerupClue()` in `data/content.js` (first letter / answer length
    — deliberately weaker than Hint Potion, no per-question authoring
    needed); Double XP and Shield are run-wide until consumed (Shield
    absorbs exactly one wrong answer instead of a life); Time Freeze
    pauses the countdown for 8 seconds. None of this talks to a backend
    either — it's the same localStorage store as everything else here.
- **Boss Battle** (`pages/BossBattlePage.jsx`) reads `:worldId` plus
  `?class=&board=`, and calls `getBossBattleData(grade, board, worldId)`
  in `data/content.js`. It reuses `getCourseDetail`'s `bossStatus`
  ("locked" | "ready" | "defeated") so the lock state always agrees with
  the boss card on the Course/Chapter screen — a locked boss shows a
  locked state instead of starting the fight. Ten questions are mixed
  across all four difficulty tiers of the world's own `QUESTION_BANK`
  pool (2 easy → 3 medium → 3 hard → 2 expert, per Section 21's "final
  questions should be harder"), cycling through each tier's pool with its
  own cursor since the current bank is only 4 questions deep per tier.
  Same 3-life/timer/HP-bar gameplay loop as `BattlePage` — including the
  same Fill in the Blank handling via `FillBlankInput`, which the boss
  screen didn't originally share and would have crashed on had a
  fill-in-the-blank question landed in its mix — plus: per-hit
  rewards use the question's own difficulty tier value (rather than being
  split across all ten), and defeating the boss adds a flat completion
  bonus from `BOSS_REWARD` (+500 XP / +250 Coins per Section 19) on top.
  The win screen shows a "Badge Unlocked" card (`"{boss name} Slayer"` —
  cosmetic only, no real achievements system yet) and, if there's a next
  world in `WORLD_TEMPLATE`, a "Next World Unlocked" card; the Final
  Chemistry Kingdom's boss instead shows a "Chemistry Master" card since
  it has no next world. None of these — badge, world unlock, or defeated
  status — persist anywhere; replace with `POST /api/quiz/submit` once
  the backend exists, same caveat as `BattlePage`.
