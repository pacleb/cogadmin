-- Update script: Assign random PIC to all concerns
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor)

-- Update ALL concerns with random PICs from profiles that have nicknames
UPDATE concerns
SET pic = (
  SELECT nickname 
  FROM profiles 
  WHERE nickname IS NOT NULL 
    AND nickname != ''
  ORDER BY RANDOM() 
  LIMIT 1
);

-- Verify the update
SELECT 
  COUNT(*) as total_concerns,
  COUNT(CASE WHEN pic IS NOT NULL AND pic != '' THEN 1 END) as concerns_with_pic,
  COUNT(CASE WHEN pic IS NULL OR pic = '' THEN 1 END) as concerns_without_pic
FROM concerns;

-- Show distribution of PICs
SELECT 
  pic,
  COUNT(*) as concern_count
FROM concerns
WHERE pic IS NOT NULL AND pic != ''
GROUP BY pic
ORDER BY concern_count DESC;
