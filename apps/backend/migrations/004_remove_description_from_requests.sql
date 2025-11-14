-- Remove description field from requests table
-- Migration to drop the description column as it's no longer needed

-- Drop the description column from requests table
ALTER TABLE requests DROP COLUMN IF EXISTS description;
