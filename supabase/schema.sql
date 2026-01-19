-- Supabase SQL Schema for Admin Concerns
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor)

-- Create the concerns table
CREATE TABLE IF NOT EXISTS concerns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in-progress', 'done')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create an index for faster queries by user_id
CREATE INDEX IF NOT EXISTS concerns_user_id_idx ON concerns(user_id);

-- Create an index for sorting by created_at
CREATE INDEX IF NOT EXISTS concerns_created_at_idx ON concerns(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE concerns ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only see their own concerns
CREATE POLICY "Users can view own concerns"
  ON concerns
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy: Users can insert their own concerns
CREATE POLICY "Users can insert own concerns"
  ON concerns
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can update their own concerns
CREATE POLICY "Users can update own concerns"
  ON concerns
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can delete their own concerns
CREATE POLICY "Users can delete own concerns"
  ON concerns
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to call the function before each update
DROP TRIGGER IF EXISTS update_concerns_updated_at ON concerns;
CREATE TRIGGER update_concerns_updated_at
  BEFORE UPDATE ON concerns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable realtime for the concerns table (optional, for live updates)
ALTER PUBLICATION supabase_realtime ADD TABLE concerns;

-- =====================================================
-- Groups Table
-- =====================================================

-- Create the groups table
CREATE TABLE IF NOT EXISTS groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, code)
);

-- Create an index for faster queries by user_id
CREATE INDEX IF NOT EXISTS groups_user_id_idx ON groups(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only see their own groups
CREATE POLICY "Users can view own groups"
  ON groups
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy: Users can insert their own groups
CREATE POLICY "Users can insert own groups"
  ON groups
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can update their own groups
CREATE POLICY "Users can update own groups"
  ON groups
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can delete their own groups
CREATE POLICY "Users can delete own groups"
  ON groups
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create a trigger to update the updated_at timestamp
DROP TRIGGER IF EXISTS update_groups_updated_at ON groups;
CREATE TRIGGER update_groups_updated_at
  BEFORE UPDATE ON groups
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable realtime for the groups table
ALTER PUBLICATION supabase_realtime ADD TABLE groups;
