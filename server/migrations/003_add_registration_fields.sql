-- Migration: add School Name + Subjects to an existing `chemquest` DB, and
-- allow TEACHER as a public self-registration role (Section 3).
--
-- Only needed if your database was created BEFORE this change. A brand
-- new database created from the current schema.sql already has these
-- columns and does not need this file.
--
--   mysql -u root -p chemquest < migrations/003_add_registration_fields.sql

USE chemquest;

ALTER TABLE players
  ADD COLUMN school_name VARCHAR(150) NULL AFTER current_board,
  ADD COLUMN subjects     VARCHAR(255) NULL AFTER school_name;

-- Nothing to change on the `role` ENUM itself - ADMIN/TEACHER/STUDENT
-- already exist from 001_add_role.sql. What changes is application-level:
-- POST /api/auth/signup now accepts role = STUDENT | TEACHER (never
-- ADMIN) instead of always forcing STUDENT. See routes/auth.js.
