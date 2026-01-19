-- Seed data for Groups table
-- Run this in Supabase SQL Editor after creating the groups table
-- Note: This inserts groups for ALL users. 

-- Insert COG groups with weight for ordering
INSERT INTO groups (code, name, weight) VALUES ('AH', 'Admin Head', 10);
INSERT INTO groups (code, name, weight) VALUES ('F', 'Finance', 20);
INSERT INTO groups (code, name, weight) VALUES ('E', 'Engineering', 30);
INSERT INTO groups (code, name, weight) VALUES ('S', 'Security & Shuttle', 40);
INSERT INTO groups (code, name, weight) VALUES ('T', 'Technology', 50);
INSERT INTO groups (code, name, weight) VALUES ('I', 'In-House Services', 60);
INSERT INTO groups (code, name, weight) VALUES ('V', 'Ventures', 70);
INSERT INTO groups (code, name, weight) VALUES ('A', 'Arts', 80);
INSERT INTO groups (code, name, weight) VALUES ('L', 'Linkages', 90);
INSERT INTO groups (code, name, weight) VALUES ('W', 'Worship', 100);
INSERT INTO groups (code, name, weight) VALUES ('O', 'Outreach', 200);
INSERT INTO groups (code, name, weight) VALUES ('R', 'Relationship', 300);
INSERT INTO groups (code, name, weight) VALUES ('D', 'Discipleship', 400);
