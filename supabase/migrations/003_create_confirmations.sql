-- Create confirmations table for guest RSVP confirmations
-- PRIMARY access control is in the API proxy layer
-- RLS policies here serve as defense-in-depth only

create table if not exists confirmations (
  id uuid default gen_random_uuid() primary key,
  phone text not null,
  rsvp_status text not null check (rsvp_status in ('Confirmado', 'Recusado', 'Pendente')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint confirmations_phone_unique unique (phone)
);

-- Enable RLS (Defense-in-Depth Only)
alter table confirmations enable row level security;

-- Policy: Allow SELECT for all (defense-in-depth, PRIMARY control is in API proxy)
create policy "Allow read access for all" on confirmations
  for select
  using (true);

-- Policy: Allow INSERT for all (first confirmation)
create policy "Allow insert for all" on confirmations
  for insert
  with check (true);

-- NOTE: No UPDATE/DELETE policies
-- The API proxy enforces UPDATE/DELETE restrictions
-- The API proxy will add WHERE phone = '<validated_phone>' to all queries
-- This ensures users can only update/delete their own confirmation
