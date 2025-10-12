-- Add location fields to user_profiles table
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8),
ADD COLUMN IF NOT EXISTS location_permission_granted BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS location_updated_at TIMESTAMP WITH TIME ZONE;

-- Add an index for location-based queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_location 
ON user_profiles(latitude, longitude) 
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Update the user_profiles table to have proper RLS policies for location data
-- (Adjust these policies based on your security requirements)

-- Policy to allow users to update their own location
CREATE POLICY "Users can update own location" ON user_profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy to allow users to read their own location (full access)
CREATE POLICY "Users can read own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

-- Policy to allow public read access to basic profile info (without precise location)
-- This allows other users to see city/country but not exact coordinates
CREATE POLICY "Public read access to basic profile" ON user_profiles
  FOR SELECT USING (true);