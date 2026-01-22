-- Migration: Add user fields (ssoId, mobile, address, region)
-- Note: This migration adds new columns to the users table.
-- If columns already exist, this migration will fail. Run with caution on existing databases.

ALTER TABLE users 
ADD COLUMN ssoId VARCHAR(255) NULL COMMENT 'SSO ID or Business ID',
ADD COLUMN mobile VARCHAR(20) NULL COMMENT 'Phone number',
ADD COLUMN address TEXT NULL COMMENT 'User address',
ADD COLUMN region VARCHAR(100) NULL COMMENT 'Region (required for RC & GD users)';

-- Add index on ssoId for faster lookups
CREATE INDEX idx_ssoId ON users(ssoId);

-- Add index on region for filtering
CREATE INDEX idx_region ON users(region);

