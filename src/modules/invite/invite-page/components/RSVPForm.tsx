'use client';

import { useRSVP } from '@/modules/invite/hooks/useRSVP';

type RSVPStatus = 'Pendente' | 'Confirmado' | 'Recusado';

const STATUSES: RSVPStatus[] = ['Pendente', 'Confirmado', 'Recusado'];

export function RSVPForm({ phone, initialStatus }: { phone: string; initialStatus: string }) {
  const { rsvp_status, updateRSVP, isSubmitting } = useRSVP(phone, initialStatus);

  const handleStatusChange = (status: RSVPStatus) => {
    updateRSVP(status);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex items-center justify-center gap-3">
        {STATUSES.map((status) => {
          const isActive = rsvp_status === status;
          let baseClasses = 'px-4 py-2 rounded-full font-body text-sm font-medium transition-all duration-200';

          if (isActive) {
            baseClasses += ' bg-wedding-blue text-white shadow-md';
          } else {
            baseClasses += ' border border-gray-300 text-gray-600 hover:border-wedding-gold hover:text-wedding-gold';
          }

          return (
            <button
              key={status}
              onClick={() => handleStatusChange(status)}
              disabled={isSubmitting}
              className={`${baseClasses} ${isSubmitting ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
              aria-pressed={isActive}
              aria-label={`Status: ${status}`}
            >
              {isSubmitting && rsvp_status === status ? (
                <span className="flex items-center gap-1">
                  <span className="animate-spin inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full" />
                  <span className="text-xs">{status}</span>
                </span>
              ) : (
                status
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
