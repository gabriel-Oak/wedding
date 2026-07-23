import { redirect } from 'next/navigation';
import { getAdminSession } from './server';

export async function requireAdmin() {
  const user = await getAdminSession();
  if (!user) {
    redirect('/admin/login');
  }
  return user;
}
