-- Trigger to sync guests.rsvp_status with confirmations.rsvp_status
-- When a confirmation is inserted or updated, sync the status to guests table

CREATE OR REPLACE FUNCTION sync_guests_rsvp_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Update guests table when confirmation is inserted or updated
  UPDATE guests
  SET rsvp_status = NEW.rsvp_status,
      updated_at = now()
  WHERE phone = NEW.phone;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS sync_rsvp_status ON confirmations;

-- Create trigger for INSERT and UPDATE
CREATE TRIGGER sync_rsvp_status
  AFTER INSERT OR UPDATE ON confirmations
  FOR EACH ROW
  EXECUTE FUNCTION sync_guests_rsvp_status();
