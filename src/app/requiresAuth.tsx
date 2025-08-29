'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function useSessionGate() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    supabase.auth.getSession().then(() => setReady(true));
  }, []);
  return ready;
}
