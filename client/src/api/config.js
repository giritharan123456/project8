// Single on/off switch for the whole API layer (Sections 39–40).
//
// USE_MOCK_API = true  -> every function in endpoints.js resolves from the
//                          existing content.js / playerStore.js mock data,
//                          with a small simulated network delay so loading
//                          states are visible and honest during development.
// USE_MOCK_API = false -> every function instead calls API_BASE over real
//                          HTTP, using the exact paths from Section 40
//                          (GET /api/boards, GET /api/courses?board=&class=,
//                          POST /api/quiz/submit, etc).
//
// Flip this one flag (or set VITE_USE_MOCK_API=false in .env) once a real
// backend exists — nothing in the pages that call endpoints.js needs to
// change, since every function keeps the same async signature and return
// shape either way.
export const USE_MOCK_API =
  (import.meta.env?.VITE_USE_MOCK_API ?? "true") !== "false";

export const API_BASE = import.meta.env?.VITE_API_BASE ?? "/api";

// Simulated latency for mock responses, in milliseconds. Randomized within
// a small range so every load doesn't feel identically fast/instant —
// closer to what a real network call will feel like once USE_MOCK_API
// flips off. Set to 0 to disable (e.g. in tests).
export const MOCK_LATENCY_MS = [180, 420];
