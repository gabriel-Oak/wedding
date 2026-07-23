-- Migration: Add Admin Auth RLS Policies
-- Purpose: Migrate guests table RLS from hardcoded phone to auth.uid()
-- Admin UUID: 34070d8b-4e3d-4e72-ac8a-92abaad98a20 (gabrielcarvalhocosta@live.com)
-- Impact: Only affects guests table (admin operations). Confirmations table unchanged.

-- Drop old policies (hardcoded phone)
DROP POLICY IF EXISTS "Allow read access for all" ON guests;
DROP POLICY IF EXISTS "Allow update only by admin" ON guests;
DROP POLICY IF EXISTS "Allow insert only by admin" ON guests;
DROP POLICY IF EXISTS "Allow delete only by admin" ON guests;

-- New SELECT policy: Public read (guests can check RSVP status)
CREATE POLICY "Public read" ON guests
  FOR SELECT
  USING (true);

-- New INSERT policy: Admin only
CREATE POLICY "Admin insert" ON guests
  FOR INSERT
  WITH CHECK (auth.uid() = '34070d8b-4e3d-4e72-ac8a-92abaad98a20');

-- New UPDATE policy: Admin only
CREATE POLICY "Admin update" ON guests
  FOR UPDATE
  USING (auth.uid() = '34070d8b-4e3d-4e72-ac8a-92abaad98a20');

-- New DELETE policy: Admin only
CREATE POLICY "Admin delete" ON guests
  FOR DELETE
  USING (auth.uid() = '34070d8b-4e3d-4e72-ac8a-92abaad98a20');
