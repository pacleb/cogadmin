-- Add email_confirmed column to profiles table
-- This will be synced from auth.users.email_confirmed_at

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS email_confirmed BOOLEAN DEFAULT FALSE;

-- Create a function to sync email confirmation status from auth.users
CREATE OR REPLACE FUNCTION sync_email_confirmed()
RETURNS TRIGGER AS $$
DECLARE
  profile_exists BOOLEAN;
BEGIN
  -- Check if profile exists
  SELECT EXISTS(SELECT 1 FROM profiles WHERE user_id = NEW.id) INTO profile_exists;
  
  -- Only update if profile exists
  IF profile_exists THEN
    UPDATE profiles
    SET email_confirmed = (NEW.email_confirmed_at IS NOT NULL)
    WHERE user_id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT EXECUTE ON FUNCTION sync_email_confirmed() TO postgres, service_role;

-- Create trigger to sync on auth.users INSERT only (not on every login)
DROP TRIGGER IF EXISTS sync_email_confirmed_trigger ON auth.users;
CREATE TRIGGER sync_email_confirmed_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION sync_email_confirmed();

-- Sync existing users
UPDATE profiles
SET email_confirmed = (
  SELECT email_confirmed_at IS NOT NULL
  FROM auth.users
  WHERE auth.users.id = profiles.user_id
);
