import { getAdminSession } from './server';

export async function requireAdmin() {
  const user = await getAdminSession();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}
