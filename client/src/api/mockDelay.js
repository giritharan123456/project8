import { MOCK_LATENCY_MS } from "./config.js";

// Resolves after a small randomized delay so mock-mode loading states
// (skeletons, spinners) are actually visible during development instead of
// popping in instantly — a truer preview of how the screen will behave
// once USE_MOCK_API is false and a real network round-trip is involved.
export function mockDelay() {
  const [min, max] = MOCK_LATENCY_MS;
  if (max <= 0) return Promise.resolve();
  const ms = min + Math.random() * (max - min);
  return new Promise((resolve) => setTimeout(resolve, ms));
}
