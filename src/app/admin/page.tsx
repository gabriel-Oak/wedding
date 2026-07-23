'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/client';

export default function AdminPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/admin/login');
    }
  }, [loading, user, router]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-wedding-cream flex items-center justify-center">
        <p className="text-wedding-wood">Carregando...</p>
      </div>
    );
  }
  
  if (!user) {
    return null; // Redirecting to login
  }
  
  return (
    <div className="min-h-screen bg-wedding-cream flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-heading text-4xl text-wedding-blue mb-4">
          Área Admin
        </h1>
        <p className="font-body text-wedding-wood text-lg">
          Em breve.
        </p>
      </div>
    </div>
  );
}
