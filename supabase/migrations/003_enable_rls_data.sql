-- Seed data for RLS policy testing (Defense-in-Depth Only)
--
-- Defense-in-Depth Strategy:
--   PRIMARY: API proxy enforces access control before any DB write.
--   SECONDARY: RLS policies act as a safety net — even if the proxy is bypassed,
--              the database enforces read/write restrictions at the row level.
--   NOTE: Since there is no Supabase Auth system, admin identity is enforced via
--          a hardcoded phone number. The API proxy remains the PRIMARY control.
--   The 'id' column referenced in policies is the primary key from 001_create_guests.sql.

-- Seed an admin phone number for testing RLS policies
-- This phone is used by the admin UPDATE/INSERT/DELETE policies
INSERT INTO guests (phone, name, is_hot_guest, is_natural_guest, has_read, rsvp_status)
VALUES ('+5538999999999', 'Admin', true, false, true, 'Confirmado')
ON CONFLICT (phone) DO UPDATE
  SET is_hot_guest = EXCLUDED.is_hot_guest,
      is_natural_guest = EXCLUDED.is_natural_guest,
      has_read = EXCLUDED.has_read,
      rsvp_status = EXCLUDED.rsvp_status,
      updated_at = timezone('utc'::text, now());
