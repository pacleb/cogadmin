-- Migration: Add "to" column to concerns table
-- This column stores the Profiles.Nickname of the person to delegate/download to
-- It is required when Status is "For Delegating" or "For Download"

ALTER TABLE concerns
ADD COLUMN IF NOT EXISTS "to" TEXT DEFAULT '';

-- Create an index for faster queries on the "to" column
CREATE INDEX IF NOT EXISTS concerns_to_idx ON concerns("to");

-- Update the status CHECK constraint to include references (optional, already exists)
-- The validation will be done at the application level

-- Create a function to validate "to" field when status requires it
CREATE OR REPLACE FUNCTION validate_concern_to_field()
RETURNS TRIGGER AS $$
BEGIN
  -- If status is "For Delegating" or "For Download", "to" field must be provided
  IF NEW.status IN ('For Delegating', 'For Download') THEN
    IF NEW."to" IS NULL OR NEW."to" = '' THEN
      RAISE EXCEPTION 'The "to" field is required when status is "For Delegating" or "For Download"';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to validate the "to" field
DROP TRIGGER IF EXISTS validate_concern_to_field_trigger ON concerns;
CREATE TRIGGER validate_concern_to_field_trigger
  BEFORE INSERT OR UPDATE ON concerns
  FOR EACH ROW
  EXECUTE FUNCTION validate_concern_to_field();
