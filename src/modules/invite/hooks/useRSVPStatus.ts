'use client';

import { useEffect, useState } from 'react';

type RsvpStatus = 'Pendente' | 'Confirmado' | 'Recusado' | null;

interface RSVPStatusData {
  rsvp_status: RsvpStatus;
  loading: boolean;
  error: string | null;
}

async function fetchRSVPStatus(phone: string): Promise<RSVPStatusData> {
  try {
    const res = await fetch(`/api/confirmations?phone=${encodeURIComponent(phone)}`);
    const json = await res.json();
    
    if (json.error) {
      return { rsvp_status: null, loading: false, error: json.error };
    }
    
    const records = json.data as Array<{ rsvp_status: RsvpStatus }>;
    const confirmation = records.at(0);
    
    return {
      rsvp_status: confirmation?.rsvp_status ?? null,
      loading: false,
      error: null,
    };
  } catch (error) {
    return {
      rsvp_status: null,
      loading: false,
      error: error instanceof Error ? error.message : 'Failed to load RSVP status',
    };
  }
}

export function useRSVPStatus(phone: string | null): RSVPStatusData {
  const [rsvp_status, setRsvpStatus] = useState<RsvpStatus>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!phone) {
      return;
    }

    setLoading(true);
    setError(null);

    fetchRSVPStatus(phone)
      .then((data) => {
        setRsvpStatus(data.rsvp_status);
        setError(data.error);
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load RSVP status');
        setLoading(false);
      });
  }, [phone]);

  return { rsvp_status, loading, error };
}
