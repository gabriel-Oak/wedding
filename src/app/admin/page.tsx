import { User } from '@supabase/supabase-js';
import { createSupabaseClient } from '@/lib/supabase/server';
import AdminDashboardClient from './AdminDashboardClient';

async function getServerUser(): Promise<User | null> {
  const supabase = createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export default async function AdminPage() {
  const user = await getServerUser();

  return <AdminDashboardClient user={user} />;
}
