const bcrypt = require("bcryptjs");

const SALT_ROUNDS = 10;

// Replaces the old sha256 placeholder in routes/auth.js - bcrypt is salted
// and slow-by-design, which sha256 is not (sha256 of a password list can be
// brute-forced far too cheaply).
function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

function verifyPassword(password, hash) {
  if (!hash) return Promise.resolve(false);
  return bcrypt.compare(password, hash);
}

module.exports = { hashPassword, verifyPassword };
