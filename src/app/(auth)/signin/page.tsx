'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string|null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: typeof window !== 'undefined'
          ? `${window.location.origin}/auth/callback`
          : undefined,
      },
    });
    if (error) setErr(error.message); else setSent(true);
  }

  return (
    <main className="min-h-screen grid place-items-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-3">
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <input
          className="w-full border p-2 rounded"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          required
        />
        <button className="w-full border p-2 rounded" type="submit">
          Send magic link
        </button>
        {sent && <p className="text-green-700">Check your email for the link.</p>}
        {err && <p className="text-red-600">{err}</p>}
      </form>
    </main>
  );
}
