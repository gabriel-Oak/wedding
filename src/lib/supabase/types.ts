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

export interface Confirmation {
  id: string;
  phone: string;
  rsvp_status: 'Confirmado' | 'Recusado' | 'Pendente';
  created_at: string;
  updated_at: string;
}

export interface ApiRequest {
  table: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  data?: Record<string, unknown>;
  filters?: Record<string, unknown>;
  phone: string;
}

export interface ApiResponse {
  data?: unknown;
  error?: unknown;
  status: number;
}
