create table if not exists guests (
  id uuid default gen_random_uuid() primary key,
  phone text unique not null,
  name text not null,
  is_hot_guest boolean default false,
  is_natural_guest boolean default false,
  has_read boolean default false,
  rsvp_status text default 'Pendente',
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Test guest for development
INSERT INTO guests (phone, name, is_hot_guest, is_natural_guest, has_read, rsvp_status)
VALUES ('+553891364011', 'Convidado Teste', true, true, false, 'Pendente')
ON CONFLICT (phone) DO UPDATE
  SET is_hot_guest = EXCLUDED.is_hot_guest,
      is_natural_guest = EXCLUDED.is_natural_guest,
      has_read = EXCLUDED.has_read,
      rsvp_status = EXCLUDED.rsvp_status,
      updated_at = timezone('utc'::text, now());
