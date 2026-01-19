-- Add group_code column to profiles table
-- This connects profiles to groups via the groups.code field

-- Add the column
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS group_code TEXT;

-- Create an index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_group_code ON profiles(group_code);

-- Add a foreign key constraint to groups table
-- Note: This assumes groups.code is unique per user or globally
-- Adjust as needed based on your groups table structure
-- For now, we'll use a soft relationship without FK constraint
-- since groups.code may not be unique across users

-- Optional: Add a comment
COMMENT ON COLUMN profiles.group_code IS 'References groups.code - soft relationship';
