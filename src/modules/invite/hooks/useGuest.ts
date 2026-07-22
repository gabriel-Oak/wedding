'use client';

import { useEffect, useState } from 'react';
import { Guest } from '@/shared/types';

const HAS_READ_SESSION_KEY = 'invite_has_read_done';

async function fetchGuestByPhone(phone: string) {
  const res = await fetch(`/api/guests?phone=${encodeURIComponent(phone)}`);
  const json = await res.json();
  if (json.error) {
    return { data: null, error: json.error };
  }
  const records = (json.data as Guest[]) || [];
  const guest = records.at(0) ?? null;
  return { data: guest, error: null };
}

async function markHasRead(phone: string) {
  const res = await fetch(`/api/guests?phone=${encodeURIComponent(phone)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ has_read: true }),
  });
  const json = await res.json();
  if (json.error) {
    return { success: false, error: json.error };
  }
  return { success: true };
}

export function useGuest(guestPhone: string | null) {
  const [guest, setGuest] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!guestPhone) {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError(null);

    fetchGuestByPhone(guestPhone)
      .then(({ data, error }) => {
        if (error || !data) {
          setGuest(null);
          setLoading(false);
          return;
        }

        setGuest(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load guest data');
        setGuest(null);
        setLoading(false);
      });
  }, [guestPhone]);

  useEffect(() => {
    if (!guest || guest.has_read) return;

    const alreadyDone = sessionStorage.getItem(HAS_READ_SESSION_KEY);
    if (alreadyDone) return;

    markHasRead(guestPhone!)
      .then(({ success }) => {
        if (success) {
          sessionStorage.setItem(HAS_READ_SESSION_KEY, 'true');
        }
      })
      .catch(() => {
        // Silently ignore — marking has_read is best-effort
      });
  }, [guest, guestPhone]);

  return { guest, loading, error };
}
