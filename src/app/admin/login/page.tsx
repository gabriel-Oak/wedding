'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseClient } from '@/lib/supabase/client';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checking, setChecking] = useState(true);
  
  // Check if already authenticated (magic link redirect)
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        router.replace('/admin');
      } else {
        setChecking(false);
      }
    };
    
    checkAuth();
  }, [router]);
  
  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    const supabase = createSupabaseClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/admin`,
      },
    });
    
    if (error) {
      setError('Não foi possível enviar o link. Tente novamente.');
    } else {
      setSent(true);
    }
    setIsSubmitting(false);
  };
  
  if (checking) {
    return (
      <div className="min-h-screen bg-wedding-cream flex items-center justify-center">
        <p className="text-wedding-wood">Verificando autenticação...</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-wedding-cream flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="font-heading text-3xl text-wedding-blue mb-2">Admin</h1>
        <p className="font-body text-wedding-wood mb-6">Acesso exclusivo</p>
        
        {sent ? (
          <div className="text-center">
            <p className="text-wedding-blue font-body">
              Magic link enviado.
            </p>
            <p className="text-wedding-wood text-sm mt-2">
              Verifique sua caixa de entrada.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSendLink}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-3 border rounded mb-4 font-body ${
                error ? 'border-red-500' : 'border-wedding-gold'
              }`}
              placeholder="admin@email.com"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-wedding-blue text-white p-3 rounded font-body hover:opacity-90 disabled:opacity-50"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Magic Link'}
            </button>
          </form>
        )}
        
        {error && (
          <p className="text-red-600 text-sm mt-4">{error}</p>
        )}
      </div>
    </div>
  );
}
