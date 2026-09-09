import { API_BASE } from "./config.js";

// Section 43 (Performance): a small in-memory GET cache so switching
// between screens that request the same data (e.g. re-opening the World
// Map after a battle) doesn't refire an identical network request every
// time. Cleared entries expire after CACHE_TTL_MS; any POST/PUT/DELETE
// bypasses the cache entirely since it's a mutation.
const CACHE_TTL_MS = 30_000;
const cache = new Map();

// Track in-flight GET requests for deduplication: same path returns
// the same pending promise instead of firing a second network call.
const inflight = new Map();

function cacheKey(path) {
  return path;
}

function readCache(path) {
  const entry = cache.get(cacheKey(path));
  if (!entry) return undefined;
  if (Date.now() - entry.time > CACHE_TTL_MS) {
    cache.delete(cacheKey(path));
    return undefined;
  }
  return entry.value;
}

function writeCache(path, value) {
  cache.set(cacheKey(path), { value, time: Date.now() });
}

// Invalidate everything cached under a path prefix — call this after a
// mutation that would make prior GETs stale (e.g. after POST
// /api/player/progress, clear anything under /player).
export function invalidateCache(prefix = "") {
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) cache.delete(key);
  }
}

// Clear the entire cache (useful on logout or full state reset)
export function clearCache() {
  cache.clear();
}

class ApiError extends Error {
  constructor(message, status, body) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

// Retry helper: retries network errors (status 0) up to maxRetries times
// with exponential backoff. Does NOT retry 4xx/5xx server errors.
async function fetchWithRetry(url, fetchOptions, maxRetries = 2) {
  let lastErr;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, fetchOptions);
      return response;
    } catch (err) {
      lastErr = err;
      // Only retry on network errors (AbortError, TypeError from fetch)
      if (err.name === "AbortError") throw err; // Don't retry cancelled requests
      if (attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, 200 * Math.pow(2, attempt)));
      }
    }
  }
  throw lastErr;
}

// Thin wrapper around fetch for the real backend (Section 40's
// GET/POST /api/... routes). GETs are cached per readCache/writeCache
// above; everything else always hits the network. Throws ApiError on any
// non-2xx response so callers can distinguish "no data yet" from
// "something went wrong" in their error handling (Section 43).
//
// FEATURES:
// - TTL-based cache (default 30s) for GET requests
// - Request deduplication: concurrent identical GETs share one promise
// - Error retry: 2 retries with exponential backoff for network errors
// - Request cancellation: pass an AbortController signal to cancel
export async function apiFetch(path, { method = "GET", body, signal } = {}) {
  const url = `${API_BASE}${path}`;

  if (method === "GET") {
    // Return cached value if available
    const cached = readCache(path);
    if (cached !== undefined) return cached;

    // Request deduplication: if the same GET is already in flight, return
    // the same promise instead of firing a duplicate network request.
    if (inflight.has(path)) {
      return inflight.get(path);
    }
  }

  const fetchOptions = {
    method,
    signal,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  };

  const requestPromise = (async () => {
    let response;
    try {
      response = await fetchWithRetry(url, fetchOptions);
    } catch (networkErr) {
      if (networkErr.name === "AbortError") {
        throw new ApiError(`Request to ${path} was cancelled`, 0, networkErr);
      }
      throw new ApiError(`Network error calling ${path}`, 0, networkErr);
    }

    if (!response.ok) {
      let parsedBody = null;
      try {
        parsedBody = await response.json();
      } catch {
        // response wasn't JSON — leave parsedBody null
      }
      throw new ApiError(
        parsedBody?.message ?? `Request to ${path} failed (${response.status})`,
        response.status,
        parsedBody
      );
    }

    const data = response.status === 204 ? null : await response.json();
    if (method === "GET") writeCache(path, data);
    return data;
  })();

  // Track in-flight GETs for deduplication
  if (method === "GET") {
    inflight.set(path, requestPromise);
    requestPromise.finally(() => inflight.delete(path));
  }

  return requestPromise;
}

export { ApiError };
