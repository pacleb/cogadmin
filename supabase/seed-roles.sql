-- Roles Table SQL
-- Run this in Supabase SQL Editor

-- Create the roles table
CREATE TABLE IF NOT EXISTS roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_roles_code ON roles(code);

-- Enable RLS
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

-- RLS policies for roles (allow authenticated users full access)
CREATE POLICY "Allow authenticated users to read roles"
  ON roles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert roles"
  ON roles FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update roles"
  ON roles FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete roles"
  ON roles FOR DELETE
  TO authenticated
  USING (true);

-- Insert roles
INSERT INTO roles (code, name) VALUES ('SA', 'System Admin');
INSERT INTO roles (code, name) VALUES ('AH', 'Admin Head');
INSERT INTO roles (code, name) VALUES ('SH', 'Section Head');
INSERT INTO roles (code, name) VALUES ('UH', 'Unit Head');
INSERT INTO roles (code, name) VALUES ('CO', 'Coordinator');
INSERT INTO roles (code, name) VALUES ('TL', 'Team Leader');
INSERT INTO roles (code, name) VALUES ('ST', 'Staff');
INSERT INTO roles (code, name) VALUES ('GU', 'Guest');
