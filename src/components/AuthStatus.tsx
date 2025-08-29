'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function AuthStatus() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = '/signin';
  }

  if (!email) return null;

  return (
    <div className="fixed top-3 right-3 text-xs md:text-sm flex items-center gap-3 bg-zinc-900/70 border border-zinc-800 px-3 py-2 rounded">
      <span className="text-zinc-300">Signed in as {email}</span>
      <button onClick={signOut} className="underline">Sign out</button>
    </div>
  );
}
