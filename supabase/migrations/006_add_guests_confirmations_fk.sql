-- Add FOREIGN KEY between guests and confirmations on phone
-- This allows Supabase to resolve JOINs between the tables

-- Add FK constraint to confirmations.phone referencing guests.phone
-- Using ON DELETE CASCADE so when a guest is deleted, their confirmation is also deleted
ALTER TABLE confirmations
  ADD CONSTRAINT confirmations_phone_fkey
  FOREIGN KEY (phone)
  REFERENCES guests(phone)
  ON DELETE CASCADE;
