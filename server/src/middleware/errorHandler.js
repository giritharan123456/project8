// Catches anything thrown/passed to next() in routes and turns it into the
// { message } JSON shape src/api/client.js's ApiError expects on the front
// end. Keep this last in the middleware chain.
//
// SECURITY: Never leak stack traces or internal details to clients.
// PERFORMANCE: Structured logging for server-side debugging.

const ERROR_MESSAGES = {
  VALIDATION: "Invalid request data.",
  DATABASE: "A database error occurred. Please try again.",
  AUTH: "Authentication required. Please sign in.",
  AUTH_FORBIDDEN: "You do not have permission to perform this action.",
  NOT_FOUND: "The requested resource was not found.",
  RATE_LIMIT: "Too many requests. Please slow down.",
};

function errorHandler(err, req, res, next) {
  // Always log full error server-side
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    method: req.method,
    path: req.originalUrl,
    ip: req.ip || req.socket.remoteAddress,
    userId: req.playerId || "anonymous",
    message: err.message,
    stack: err.stack,
  };

  if (process.env.NODE_ENV === "production") {
    console.error(`[ERROR ${timestamp}]`, logEntry);
  } else {
    console.error(`[ERROR ${timestamp}]`, logEntry);
  }

  // Determine status code
  const status = err.status || err.statusCode || 500;

  // Classify error type for appropriate message
  let userMessage;
  if (err.type === "validation" || (status === 400)) {
    userMessage = err.message || ERROR_MESSAGES.VALIDATION;
  } else if (err.type === "database" || err.code?.startsWith("ER_") || err.code === "ECONNREFUSED") {
    userMessage = ERROR_MESSAGES.DATABASE;
  } else if (err.type === "auth" || status === 401) {
    userMessage = err.message || ERROR_MESSAGES.AUTH;
  } else if (status === 403) {
    userMessage = err.message || ERROR_MESSAGES.AUTH_FORBIDDEN;
  } else if (status === 404) {
    userMessage = err.message || ERROR_MESSAGES.NOT_FOUND;
  } else if (status === 429) {
    userMessage = ERROR_MESSAGES.RATE_LIMIT;
  } else if (status === 413) {
    userMessage = "Request entity too large.";
  } else if (err.message && process.env.NODE_ENV !== "production") {
    // In development, allow the original message through for debugging
    userMessage = err.message;
  } else {
    userMessage = "Something went wrong. Please try again.";
  }

  // In production, sanitize: never include SQL errors, file paths, or internal details
  if (process.env.NODE_ENV === "production" && status >= 500) {
    userMessage = "Something went wrong. Please try again.";
  }

  res.status(status).json({ message: userMessage });
}

module.exports = errorHandler;
