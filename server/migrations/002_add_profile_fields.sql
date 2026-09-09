-- Migration: add Profile photo + Language preference to an existing
-- `chemquest` DB.
--
-- Only needed if your database was created BEFORE this change (i.e. you
-- already ran the old schema.sql). A brand new database created from the
-- current schema.sql already has these columns and does not need this file.
--
--   mysql -u root -p chemquest < migrations/002_add_profile_fields.sql

USE chemquest;

ALTER TABLE players
  ADD COLUMN profile_photo MEDIUMTEXT NULL AFTER current_board,
  ADD COLUMN language VARCHAR(10) NOT NULL DEFAULT 'en' AFTER profile_photo;
