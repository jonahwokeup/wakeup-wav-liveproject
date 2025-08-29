'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function NewOrg() {
  const [name, setName] = useState('');
  const [type, setType] = useState<'artist'|'label'>('artist');
  const [err, setErr] = useState<string|null>(null);
  const router = useRouter();

  async function createOrg(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return setErr('Please sign in first.');

    const { data, error } = await supabase
      .from('organizations')
      .insert({ name, type })
      .select('id')
      .single();

    if (error) return setErr(error.message);

    const { error: mErr } = await supabase
      .from('memberships')
      .insert({ org_id: data.id, user_id: user.id, role: 'admin' });

    if (mErr) return setErr(mErr.message);

    router.push('/dashboard');
  }

  return (
    <main className="min-h-screen grid place-items-center p-6">
      <form onSubmit={createOrg} className="w-full max-w-sm space-y-3">
        <h1 className="text-2xl font-semibold">Create Organization</h1>
        <input
          className="w-full border p-2 rounded"
          placeholder="Org name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
          required
        />
        <select
          className="w-full border p-2 rounded"
          value={type}
          onChange={(e)=>setType(e.target.value as any)}
        >
          <option value="artist">Artist</option>
          <option value="label">Label</option>
        </select>
        <button className="w-full border p-2 rounded" type="submit">
          Create
        </button>
        {err && <p className="text-red-600">{err}</p>}
      </form>
    </main>
  );
}
