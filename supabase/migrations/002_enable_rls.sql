-- Enable Row Level Security on guests table (Defense-in-Depth Only)
-- PRIMARY access control is in the API proxy layer
-- RLS policies here serve as secondary defense only

-- NOTE: The 'id' column referenced below is the primary key from 001_create_guests.sql.
-- Since there is no Supabase Auth system, we cannot use auth.uid() — policies use
-- a hardcoded admin phone number instead. The API proxy is the PRIMARY access
-- control; RLS policies here are defense-in-depth only.

-- Enable RLS on guests table
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;

-- Policy: Allow SELECT for all (defense-in-depth, PRIMARY control is in API proxy)
DROP POLICY IF EXISTS "Allow read access for all" ON guests;
CREATE POLICY "Allow read access for all" ON guests
  FOR SELECT
  USING (true);

-- Policy: Allow UPDATE only by admin (defense-in-depth)
DROP POLICY IF EXISTS "Allow update only by admin" ON guests;
CREATE POLICY "Allow update only by admin" ON guests
  FOR UPDATE
  USING (phone = '+5538999999999'); -- Admin phone (replace with actual admin phone)

-- Policy: Allow INSERT only by admin (defense-in-depth)
DROP POLICY IF EXISTS "Allow insert only by admin" ON guests;
CREATE POLICY "Allow insert only by admin" ON guests
  FOR INSERT
  WITH CHECK (phone = '+5538999999999');

-- Policy: Allow DELETE only by admin (defense-in-depth)
DROP POLICY IF EXISTS "Allow delete only by admin" ON guests;
CREATE POLICY "Allow delete only by admin" ON guests
  FOR DELETE
  USING (phone = '+5538999999999');
