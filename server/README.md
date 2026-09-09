# ChemQuest Server

Backend for **ChemQuest** (`../chemquest-landing`) — **Node.js + Express +
MySQL**. Implements every route `chemquest-landing/src/api/endpoints.js`
expects (Sections 39–40 of the brief), so flipping the frontend's
`VITE_USE_MOCK_API=false` points it at real HTTP calls with no other
frontend changes.

## Stack

- **Express** — HTTP layer / routing
- **MySQL** (via **mysql2**) — everything is designed to be created and
  inspected in **MySQL Workbench** (`schema.sql` is plain DDL, no ORM/migration
  framework)
- **cookie-parser** — anonymous session cookie (see Auth below)
- **cors** — credentialed cross-origin requests from the Vite dev server

## Getting started

1. **Create the schema.** Open `schema.sql` in MySQL Workbench and run it
   against your connection (or `mysql -u root -p < schema.sql`). It creates
   a `chemquest` database and every table listed below.
2. **Configure env vars.**
   ```bash
   cp .env.example .env
   # edit MYSQL_HOST/PORT/USER/PASSWORD to match your MySQL Workbench connection
   ```
3. **Install & seed.**
   ```bash
   npm install
   npm run seed     # loads curriculum content from src/data/seedData.js
   ```
4. **Run it.**
   ```bash
   npm run dev       # http://localhost:4000, auto-restarts (nodemon)
   npm start         # plain node
   ```
5. **Point the frontend at it** — in `../chemquest-landing`:
   ```bash
   cp .env.example .env
   # VITE_USE_MOCK_API=false
   # VITE_API_BASE=http://localhost:4000/api
   ```

## Project structure

```
schema.sql            Full DDL — open this directly in MySQL Workbench
src/
  server.js            Entry point
  app.js               Express app: middleware + route wiring
  config/db.js          mysql2 connection pool
  middleware/
    session.js           Anonymous session cookie -> players row (see Auth)
    errorHandler.js       Central error -> { message } JSON
  lib/gameLogic.js       Server-side port of content.js's pure generators
                          + playerStore.js's "live" overlays (world map,
                          course detail, difficulty progress, battle/boss
                          question building, dashboard, achievements,
                          leaderboard) — same return shapes as the mock API
  data/seedData.js        Curriculum content ported from content.js
  seed.js                 One-shot script: seedData.js -> MySQL
  routes/                 One file per endpoint family (see table below)
```

## Route table (matches `src/api/endpoints.js` exactly)

| Method | Path | File |
|---|---|---|
| GET | `/api/boards` | `routes/boards.js` |
| GET | `/api/classes` | `routes/classes.js` |
| GET | `/api/courses?board=&class=` | `routes/courses.js` |
| GET | `/api/lessons?course=&board=&class=` | `routes/lessons.js` |
| GET | `/api/levels?lesson=&course=&board=&class=` | `routes/levels.js` |
| GET | `/api/questions?lesson=&difficulty=&course=&board=&class=` | `routes/questions.js` |
| GET | `/api/questions?boss=1&course=&board=&class=` | `routes/questions.js` |
| GET | `/api/player` | `routes/player.js` |
| GET | `/api/player/progress?board=&class=` | `routes/player.js` |
| POST | `/api/player/progress` | `routes/player.js` |
| GET | `/api/achievements` | `routes/achievements.js` |
| GET | `/api/leaderboard?scope=&period=&board=&class=` | `routes/leaderboard.js` |
| GET | `/api/quests` | `routes/quests.js` |
| POST | `/api/quests/:questId/claim` | `routes/quests.js` |
| POST | `/api/quiz/submit` | `routes/quiz.js` |

Bonus routes not yet called by `endpoints.js` (the Shop page and Sign In
page are still local-only per the frontend README), included so that work
is a drop-in later:

| Method | Path | Notes |
|---|---|---|
| GET/POST | `/api/shop`, `/api/shop/buy`, `/api/shop/equip`, `/api/shop/powerup/buy`, `/api/shop/powerup/use` | Server-side version of `playerStore.js`'s shop/power-up functions |
| POST | `/api/auth/signup`, `/api/auth/login`, `/api/auth/forgot-password` | Minimal stubs — see Auth below |

## Auth

There's no real auth system yet — same caveat the frontend README calls
out. Every request is tied to an **anonymous session cookie**
(`SESSION_COOKIE_NAME`, default `cq_session`): the first request from a
browser creates a `players` row and sets a long-lived cookie; every later
request re-attaches `req.playerId` from it (`src/middleware/session.js`).
All progress (coins, XP, completions, boss defeats, shop, quests) is scoped
to that player id.

`POST /api/auth/signup` / `login` are minimal stubs that attach an
email/password to the *current* anonymous player (signup) or hand back a
matching player id to switch sessions to (login) — enough to build real
auth on top of later without changing the schema. `SignInPage.jsx` is still
presentational-only on the frontend, so nothing calls these yet.

## Database schema

See `schema.sql` for full column definitions. Two groups of tables:

- **Content** (seeded, rarely changes): `board_categories`, `boards`,
  `classes`, `worlds`, `difficulties`, `lessons`, `questions`, `shop_items`,
  `achievement_defs`, `daily_quest_defs`. `lessons`/`questions` support
  per-board overrides (`board_code` column; `NULL` = shared template) —
  same override-then-fallback rule as `content.js`'s
  `getLessonsForWorld`/`getQuestionPool`.
- **Player state** (grows with usage): `players`, `player_completions`,
  `player_boss_defeats`, `player_shop_items`, `player_equipped`,
  `player_powerups`, `quest_claims`, `quiz_submissions`.

## Notes / known placeholders

- `GET /api/achievements` doesn't receive `?class=&board=` from the current
  frontend (`endpoints.js`'s `getAchievements()` doesn't send them), so it
  falls back to the player's last-used curriculum (`players.current_grade` /
  `current_board`, updated by `POST /api/player/progress`). Passing explicit
  query params works too, for whenever the frontend is updated to send them.
- `POST /api/player/progress` accepts an optional `isBoss: true` flag to
  record a boss defeat instead of a lesson completion — `BossBattlePage.jsx`
  doesn't send this yet (per the frontend README, boss results don't persist
  today), but the endpoint is ready for it.
- `xpToNext` on `GET /api/player` is a placeholder `level * 100` curve —
  there's no real leveling design yet, same as the mock's hardcoded `1200`.
- Daily quest *progress* (`GET /api/quests`) doesn't track partial progress
  during the day (e.g. "6 / 10 questions answered") — that needs an event
  stream from Battle/Boss Battle that doesn't exist yet. Claiming still
  works and is idempotent per calendar day.
