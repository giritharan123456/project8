-- Migration: add role-based access control to an existing `chemquest` DB.
--
-- Only needed if your database was created BEFORE this change (i.e. you
-- already ran the old schema.sql). A brand new database created from the
-- current schema.sql already has this column and does not need this file.
--
--   mysql -u root -p chemquest < migrations/001_add_role.sql

USE chemquest;

ALTER TABLE players
  ADD COLUMN role ENUM('ADMIN', 'TEACHER', 'STUDENT') NOT NULL DEFAULT 'STUDENT'
  AFTER password_hash;

-- After running this, create your first admin account with:
--   npm run create-admin -- --name "Ada Admin" --email admin@chemquest.gg --password "changeme123"
