'use client';

import { useState } from 'react';

type RsvpStatus = 'Pendente' | 'Confirmado' | 'Recusado' | null;

interface RSVPStatusData {
  rsvp_status: RsvpStatus;
  loading: boolean;
  error: string | null;
}

export function useRSVPStatus(phone: string | null): RSVPStatusData {
  const [status, setStatus] = useState<RsvpStatus>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (phone && !loading && !status && !error) {
    setLoading(true);
    fetch(`/api/confirmations?phone=${encodeURIComponent(phone)}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.error) {
          setError(json.error);
          setStatus(null);
        } else {
          const records = json.data as Array<{ rsvp_status: RsvpStatus }>;
          const confirmation = records.at(0);
          setStatus(confirmation?.rsvp_status ?? null);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load RSVP status');
        setStatus(null);
        setLoading(false);
      });
  }

  return { rsvp_status: status, loading, error };
}
