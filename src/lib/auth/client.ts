'use client';

import { createSupabaseClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';

const ADMIN_EMAIL = 'gabrielcarvalhocosta@live.com';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const supabase = createSupabaseClient();
    
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email === ADMIN_EMAIL) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    
    return () => subscription.unsubscribe();
  }, []);
  
  return { user, loading };
}
