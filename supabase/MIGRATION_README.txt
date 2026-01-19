-- MIGRATION INSTRUCTIONS --
-- This migration adds email_confirmed tracking to profiles table

-- To apply this migration to your Supabase database:

-- Option 1: Using Supabase Dashboard
-- 1. Go to your Supabase project dashboard
-- 2. Navigate to SQL Editor
-- 3. Copy and paste the contents of migration-add-email-confirmed.sql
-- 4. Click "Run"

-- Option 2: Using Supabase CLI
-- 1. Run: supabase db push migration-add-email-confirmed.sql

-- What this migration does:
-- 1. Adds email_confirmed column to profiles table
-- 2. Creates a trigger to automatically sync email confirmation status from auth.users
-- 3. Syncs existing users' email confirmation status

-- After running this migration:
-- - The "Resend Email" button will only show for users with unconfirmed emails
-- - Email confirmation status will automatically update when users verify their emails
