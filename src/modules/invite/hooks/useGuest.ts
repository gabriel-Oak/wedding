'use client';

import { useEffect, useState } from 'react';
import { Guest } from '@/shared/types';
import { createClient } from '@/lib/supabase/client';

const HAS_READ_SESSION_KEY = 'invite_has_read_done';

async function fetchGuest(client: ReturnType<typeof createClient>, phone: string) {
  const { data, error } = await client
    .from('guests')
    .select('*')
    .eq('phone', phone)
    .single();
  return { data, error };
}

export function useGuest(guestPhone: string | null) {
  const [guest, setGuest] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!guestPhone) {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);

    const client = createClient();

    fetchGuest(client, guestPhone)
      .then(({ data, error }) => {
        if (error || !data) {
          setGuest(null);
          setLoading(false);
          return;
        }

        setGuest(data as Guest);
        setLoading(false);
      })
      .catch(() => {
        setGuest(null);
        setLoading(false);
      });
  }, [guestPhone]);

  useEffect(() => {
    if (!guest || guest.has_read) return;

    const alreadyDone = sessionStorage.getItem(HAS_READ_SESSION_KEY);
    if (alreadyDone) return;

    const client = createClient();

    client
      .from('guests')
      .update({ has_read: true })
      .eq('id', guest.id)
      .then(({ error }) => {
        if (!error) {
          sessionStorage.setItem(HAS_READ_SESSION_KEY, 'true');
        }
      })
      .catch(() => {
        // silently ignore
      });
  }, [guest]);

  return { guest, loading };
}
