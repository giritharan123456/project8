-- Migration: real database support for the Admin > Admin Users screen
-- (previously mock/localStorage — see client/src/admin/mockData.js's
-- ADMIN_USERS array and AdminUsersPage.jsx's header comment).
--
-- Only needed if your database was created BEFORE this change. Run:
--   mysql -u root -p chemquest < migrations/008_admin_console_users.sql
--
-- What this does:
--   Creates `admin_users` — console accounts with access to /admin and
--   what each one can manage (role + a `permissions` checklist). This is
--   deliberately separate from `players` (role ADMIN): a `players` row
--   with role ADMIN is a real, logged-in account that already passes
--   `requireRole(ROLES.ADMIN)` on every /api/admin/* route (see
--   src/scripts/createAdmin.js). `admin_users` is a roster/permissions
--   directory of who *should* have that access and what they're scoped
--   to manage — the two aren't reconciled automatically. `password_hash`
--   is included per the existing column set but left nullable and unset
--   by the CRUD routes below, since AdminUsersPage.jsx's form never
--   collects a password; it's reserved for if/when this table is wired
--   into an actual /admin login flow.

USE chemquest;

CREATE TABLE IF NOT EXISTS admin_users (
  id             CHAR(36) PRIMARY KEY,
  name           VARCHAR(120) NOT NULL,
  email          VARCHAR(190) NOT NULL UNIQUE,
  password_hash  VARCHAR(255) NULL,
  role           ENUM('Super Admin', 'Admin', 'Support') NOT NULL DEFAULT 'Admin',
  permissions    JSON NULL,                     -- array of: Content | People | Reports | Settings
  status         ENUM('active', 'inactive', 'suspended') NOT NULL DEFAULT 'active',
  last_login     DATETIME NULL,
  created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;
