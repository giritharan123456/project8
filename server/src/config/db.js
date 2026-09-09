const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || "127.0.0.1",
  port: Number(process.env.MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE || "chemquest",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  decimalNumbers: true,
  // Managed MySQL hosts (e.g. Aiven) require SSL. Any truthy MYSQL_SSL value
  // enables encryption without certificate pinning - Aiven uses its own CA
  // bundle, and `rejectUnauthorized: false` is the standard way to accept it.
  ...(process.env.MYSQL_SSL
    ? { ssl: { rejectUnauthorized: false } }
    : {}),
  // Long-running node + managed/cloud MySQL (Aiven) will frequently get
  // `read ECONNRESET` after the cloud side recycles idle TCP connections
  // (see the teacher-signup bug this fixed). Keep the pool's sockets warm
  // with a keepalive heartbeat so handed-out connections are never dead,
  // and bound the connect handshake so a half-open connection can't hang a
  // request forever.
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
  connectTimeout: 30000,
});

module.exports = pool;
