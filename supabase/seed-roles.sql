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

-- Insert roles with weight for ordering
INSERT INTO roles (code, name, weight) VALUES ('SA', 'System Admin', 1);
INSERT INTO roles (code, name, weight) VALUES ('AH', 'Admin Head', 2);
INSERT INTO roles (code, name, weight) VALUES ('SH', 'Section Head', 3);
INSERT INTO roles (code, name, weight) VALUES ('UH', 'Unit Head', 4);
INSERT INTO roles (code, name, weight) VALUES ('CO', 'Coordinator', 5);
INSERT INTO roles (code, name, weight) VALUES ('TL', 'Team Leader', 6);
INSERT INTO roles (code, name, weight) VALUES ('ST', 'Staff', 7);
INSERT INTO roles (code, name, weight) VALUES ('GU', 'Guest', 8);
