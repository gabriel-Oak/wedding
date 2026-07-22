'use client';

import { useState } from 'react';

type RsvpStatus = 'Pendente' | 'Confirmado' | 'Recusado';

const VALID_STATUSES: RsvpStatus[] = ['Pendente', 'Confirmado', 'Recusado'];

async function patchRsvpStatus(phone: string, newStatus: RsvpStatus) {
  const res = await fetch(
    `/api/confirmations?phone=${encodeURIComponent(phone)}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rsvp_status: newStatus }),
    },
  );
  const json = await res.json();
  if (json.error) {
    throw new Error(json.error);
  }
}

async function createConfirmation(phone: string, newStatus: RsvpStatus) {
  const res = await fetch(
    `/api/confirmations?phone=${encodeURIComponent(phone)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, rsvp_status: newStatus }),
    },
  );
  const json = await res.json();
  if (json.error) {
    throw new Error(json.error);
  }
}

export function useRSVP(phone: string, currentStatus: string) {
  const [rsvp_status, setRsvpStatus] = useState<string>(currentStatus);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateRSVP = async (newStatus: RsvpStatus) => {
    if (!VALID_STATUSES.includes(newStatus)) {
      return;
    }

    const previousStatus = rsvp_status;
    setRsvpStatus(newStatus);
    setIsSubmitting(true);

    try {
      // Try PATCH first; if it fails (e.g., no existing record), try POST
      await patchRsvpStatus(phone, newStatus);
    } catch {
      try {
        await createConfirmation(phone, newStatus);
      } catch {
        setRsvpStatus(previousStatus);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return { rsvp_status, updateRSVP, isSubmitting };
}
