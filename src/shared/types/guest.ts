export interface Guest {
  id: string;
  phone: string;
  name: string;
  is_hot_guest: boolean;
  is_natural_guest: boolean;
  has_read: boolean;
  rsvp_status: 'Pendente' | 'Confirmado' | 'Recusado' | null;
  updated_at: string;
}
