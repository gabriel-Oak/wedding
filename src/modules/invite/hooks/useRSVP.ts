'use client';

import { useState } from 'react';
import { createSupabaseClient } from '@/lib/supabase/client';

type RsvpStatus = 'Pendente' | 'Confirmado' | 'Recusado';

const VALID_STATUSES: RsvpStatus[] = ['Pendente', 'Confirmado', 'Recusado'];

export function useRSVP(guestId: string, currentStatus: string) {
  const [rsvp_status, setRsvpStatus] = useState<string>(currentStatus);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateRSVP = async (newStatus: RsvpStatus) => {
    if (!VALID_STATUSES.includes(newStatus)) {
      return;
    }

    const previousStatus = rsvp_status;
    setRsvpStatus(newStatus);
    setIsSubmitting(true);

    const client = createSupabaseClient();

    try {
      const { error } = await client
        .from('guests')
        .update({ rsvp_status: newStatus })
        .eq('id', guestId);

      if (error) {
        throw error;
      }
    } catch {
      setRsvpStatus(previousStatus);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { rsvp_status, updateRSVP, isSubmitting };
}
