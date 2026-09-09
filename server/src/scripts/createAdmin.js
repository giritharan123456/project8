// Creates (or promotes) an ADMIN account. This is the only supported way
// to get the very first admin into the system - POST /api/auth/signup
// always creates a STUDENT (see routes/auth.js), and PATCH
// /api/admin/users/:id/role requires an existing admin to already be
// signed in. Run this once against your database, then sign in with the
// resulting credentials.
//
//   npm run create-admin -- --name "Ada Admin" --email admin@learnquest.gg --password "changeme123"
//
// If the email already has an account, this promotes it to ADMIN instead
// of creating a duplicate (and updates the password if --password is
// given).

require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const pool = require("../config/db");
const { hashPassword } = require("../lib/password");

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i].startsWith("--")) {
      const key = argv[i].slice(2);
      const value = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : true;
      out[key] = value;
      if (value !== true) i += 1;
    }
  }
  return out;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const { name, email, password } = args;

  if (!email || !password) {
    console.error('Usage: npm run create-admin -- --name "Ada Admin" --email admin@example.com --password "..."');
    process.exit(1);
  }
  if (String(password).length < 8) {
    console.error("Password must be at least 8 characters.");
    process.exit(1);
  }

  const passwordHash = await hashPassword(String(password));
  const [existing] = await pool.query("SELECT id FROM players WHERE email = ?", [email]);

  if (existing.length > 0) {
    await pool.query(
      "UPDATE players SET role = 'ADMIN', password_hash = ?, name = COALESCE(?, name) WHERE id = ?",
      [passwordHash, name || null, existing[0].id]
    );
    console.log(`Promoted existing account ${email} to ADMIN.`);
  } else {
    const id = uuidv4();
    await pool.query(
      `INSERT INTO players (id, name, email, password_hash, role, level, coins, xp, total_xp_earned, streak)
       VALUES (?, ?, ?, ?, 'ADMIN', 12, 850, 850, 0, 0)`,
      [id, name || "Admin", email, passwordHash]
    );
    console.log(`Created new ADMIN account ${email}.`);
  }

  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
