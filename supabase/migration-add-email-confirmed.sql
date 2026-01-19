-- Add email_confirmed column to profiles table
-- This will be synced from auth.users.email_confirmed_at

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS email_confirmed BOOLEAN DEFAULT FALSE;

-- Create a function to sync email confirmation status from auth.users
CREATE OR REPLACE FUNCTION sync_email_confirmed()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the profile with email confirmation status from auth.users
  UPDATE profiles
  SET email_confirmed = (
    SELECT email_confirmed_at IS NOT NULL
    FROM auth.users
    WHERE id = NEW.id
  )
  WHERE user_id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to sync on auth.users updates
DROP TRIGGER IF EXISTS sync_email_confirmed_trigger ON auth.users;
CREATE TRIGGER sync_email_confirmed_trigger
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION sync_email_confirmed();

-- Sync existing users
UPDATE profiles
SET email_confirmed = (
  SELECT email_confirmed_at IS NOT NULL
  FROM auth.users
  WHERE auth.users.id = profiles.user_id
);
