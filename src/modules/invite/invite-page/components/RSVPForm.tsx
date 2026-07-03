'use client';

import { VineDivider } from '@/shared/ui/VineDivider';
import { useRSVP } from '@/modules/invite/hooks/useRSVP';

type RSVPStatus = 'Pendente' | 'Confirmado' | 'Recusado';

const STATUSES: RSVPStatus[] = ['Pendente', 'Confirmado', 'Recusado'];

export function RSVPForm({ guestId, initialStatus }: { guestId: string; initialStatus: string }) {
  const { rsvp_status, updateRSVP, isSubmitting } = useRSVP(guestId, initialStatus);

  const handleStatusChange = (status: RSVPStatus) => {
    updateRSVP(status);
  };

  return (
    <div className="w-full">
      {/* Desktop: inline centered layout */}
      <div className="hidden md:flex items-center justify-center gap-4">
        <VineDivider className="w-24 h-5 text-wedding-gold flex-shrink-0" />

        {STATUSES.map((status) => {
          const isActive = rsvp_status === status;
          let baseClasses = 'px-5 py-2 rounded-full font-body text-sm font-medium transition-all duration-200';

          if (isActive) {
            baseClasses += ' bg-wedding-blue text-white shadow-lg';
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
                  <span>{status}</span>
                </span>
              ) : (
                status
              )}
            </button>
          );
        })}

        <VineDivider className="w-24 h-5 text-wedding-gold flex-shrink-0" />
      </div>

      {/* Mobile: fixed bottom sheet */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden z-50 bg-wedding-cream/95 backdrop-blur-sm border-t border-wedding-gold/30 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
        <div className="px-4 py-3 flex items-center justify-center gap-2">
          <VineDivider className="w-16 h-4 text-wedding-gold flex-shrink-0" />

          {STATUSES.map((status) => {
            const isActive = rsvp_status === status;

            let baseClasses = 'px-3 py-2 rounded-full font-body text-xs font-medium transition-all duration-200 flex-1';

            if (isActive) {
              baseClasses += ' bg-wedding-blue text-white shadow-md';
            } else {
              baseClasses += ' bg-gray-100 text-gray-600 hover:bg-gray-200';
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
                  <span className="flex items-center justify-center gap-1">
                    <span className="animate-spin inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full" />
                  </span>
                ) : (
                  status
                )}
              </button>
            );
          })}

          <VineDivider className="w-16 h-4 text-wedding-gold flex-shrink-0" />
        </div>
      </div>
    </div>
  );
}
