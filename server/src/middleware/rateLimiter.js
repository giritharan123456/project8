// Simple sliding-window rate limiter without external deps
// Usage: app.use('/api/auth', rateLimiter({ windowMs: 60000, max: 100 }))
function rateLimiter({ windowMs = 60000, max = 100 } = {}) {
  const requests = new Map();

  // Periodic cleanup to prevent memory leak from stale entries
  const cleanupInterval = setInterval(() => {
    const cutoff = Date.now() - windowMs;
    for (const [key, timestamps] of requests) {
      const recent = timestamps.filter((t) => t > cutoff);
      if (recent.length === 0) requests.delete(key);
      else requests.set(key, recent);
    }
  }, windowMs);
  if (cleanupInterval.unref) cleanupInterval.unref();

  return (req, res, next) => {
    const key = req.ip || req.socket.remoteAddress || "unknown";
    const now = Date.now();
    const windowStart = now - windowMs;
    const recent = (requests.get(key) || []).filter((t) => t > windowStart);

    if (recent.length >= max) {
      const retryAfter = Math.ceil((recent[0] + windowMs - now) / 1000);
      res.setHeader("Retry-After", retryAfter);
      return res.status(429).json({ message: "Too many requests, please try again later." });
    }

    recent.push(now);
    requests.set(key, recent);
    next();
  };
}

module.exports = rateLimiter;
