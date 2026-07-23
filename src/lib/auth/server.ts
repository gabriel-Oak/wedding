import { createSupabaseClient } from '@/lib/supabase/server';

export async function getAdminSession() {
  const supabase = createSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) return null;
  
  const ADMIN_EMAIL = 'gabrielcarvalhocosta@live.com';
  if (user.email !== ADMIN_EMAIL) return null;
  
  return user;
}
