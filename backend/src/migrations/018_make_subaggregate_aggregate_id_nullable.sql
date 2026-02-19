-- Migration: Make aggregate_id nullable in gd_subaggregate table
-- This allows subaggregate to be independent from aggregate

-- Find and drop the foreign key constraint
-- MySQL auto-generates constraint names, so we need to find it first
SET @constraint_name = (
  SELECT CONSTRAINT_NAME 
  FROM information_schema.KEY_COLUMN_USAGE 
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'gd_subaggregate'
    AND COLUMN_NAME = 'aggregate_id'
    AND REFERENCED_TABLE_NAME IS NOT NULL
  LIMIT 1
);

-- Drop the foreign key constraint if it exists
SET @sql = IF(@constraint_name IS NOT NULL,
  CONCAT('ALTER TABLE gd_subaggregate DROP FOREIGN KEY ', @constraint_name),
  'SELECT "No foreign key constraint found" AS message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Make aggregate_id nullable
ALTER TABLE gd_subaggregate 
MODIFY COLUMN aggregate_id INT NULL;

-- Note: We're not recreating the foreign key constraint since subaggregate should be independent
-- If you need to maintain referential integrity for existing records, you can add a check constraint
-- or handle it at the application level

