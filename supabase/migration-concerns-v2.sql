-- Migration: Update concerns table with new columns
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor)

-- Step 1: Drop existing constraints and triggers
DROP TRIGGER IF EXISTS update_concerns_updated_at ON concerns;
DROP POLICY IF EXISTS "Users can view own concerns" ON concerns;
DROP POLICY IF EXISTS "Users can insert own concerns" ON concerns;
DROP POLICY IF EXISTS "Users can update own concerns" ON concerns;
DROP POLICY IF EXISTS "Users can delete own concerns" ON concerns;

-- Step 2: Drop the old concerns table (WARNING: This will delete existing data!)
-- If you want to preserve data, use ALTER TABLE instead
DROP TABLE IF EXISTS concerns;

-- Step 3: Create the new concerns table with updated schema
CREATE TABLE concerns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  group_code TEXT NOT NULL,                    -- Connected to groups.code
  urgency TEXT NOT NULL DEFAULT 'Normal' CHECK (
    urgency IN ('EMERGENCY', 'Major Urgent', 'Urgent', 'Major', 'Normal')
  ),
  task TEXT NOT NULL CHECK (char_length(task) <= 100),
  start_date TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  remarks TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'New' CHECK (
    status IN (
      'New', 
      'For Delegating', 
      'Preparing', 
      'For Update', 
      'For Report', 
      'For Approval', 
      'For Download', 
      'Ongoing', 
      'Accomplished'
    )
  ),
  detailed_status TEXT DEFAULT '',
  pic TEXT DEFAULT '',                         -- Person in Charge (Profiles.Nickname)
  end_date TIMESTAMPTZ DEFAULT NULL,           -- Auto-filled when status = 'Accomplished'
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Step 4: Create indexes for faster queries
CREATE INDEX IF NOT EXISTS concerns_user_id_idx ON concerns(user_id);
CREATE INDEX IF NOT EXISTS concerns_group_code_idx ON concerns(group_code);
CREATE INDEX IF NOT EXISTS concerns_status_idx ON concerns(status);
CREATE INDEX IF NOT EXISTS concerns_created_at_idx ON concerns(created_at DESC);
CREATE INDEX IF NOT EXISTS concerns_pic_idx ON concerns(pic);

-- Step 5: Enable Row Level Security (RLS)
ALTER TABLE concerns ENABLE ROW LEVEL SECURITY;

-- Step 6: Create RLS policies - allow all authenticated users to see all concerns
CREATE POLICY "Authenticated users can view all concerns"
  ON concerns
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert concerns"
  ON concerns
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update concerns"
  ON concerns
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete concerns"
  ON concerns
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Step 7: Create trigger for updated_at
CREATE TRIGGER update_concerns_updated_at
  BEFORE UPDATE ON concerns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Step 8: Create trigger to auto-set end_date when status changes to 'Accomplished'
CREATE OR REPLACE FUNCTION handle_concern_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- If status changed to 'Accomplished', set end_date
  IF NEW.status = 'Accomplished' AND (OLD.status IS DISTINCT FROM 'Accomplished') THEN
    NEW.end_date = NOW();
  -- If status changed from 'Accomplished' to something else, clear end_date
  ELSIF OLD.status = 'Accomplished' AND NEW.status != 'Accomplished' THEN
    NEW.end_date = NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER concern_status_change_trigger
  BEFORE UPDATE ON concerns
  FOR EACH ROW
  EXECUTE FUNCTION handle_concern_status_change();

-- Step 9: Enable realtime for the concerns table
ALTER PUBLICATION supabase_realtime ADD TABLE concerns;
