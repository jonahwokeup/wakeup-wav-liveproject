'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { getActiveOrg } from '@/lib/org';
import Button from '@/components/ui/Button';
import { Card, CardTitle, CardText } from '@/components/ui/Card';
import useSessionGate from '@/app/requiresAuth';

type ReleaseRow = {
  id: string;
  title: string;
  display_title: string | null;
  release_date: string | null;
  release_type: 'single'|'ep'|'album'|null;
  primary_genre: string | null;
  upc: string | null;
  created_at: string;
};

export default function Catalog() {
  const gateReady = useSessionGate();
  const [orgName, setOrgName] = useState<string | null>(null);
  const [releases, setReleases] = useState<ReleaseRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!gateReady) return;
    (async () => {
      setLoading(true);
      const org = await getActiveOrg();
      if (!org) {
        setOrgName(null);
        setReleases([]);
        setLoading(false);
        return;
      }
      setOrgName(org.name);

      const { data } = await supabase
        .from('releases')
        .select('id,title,display_title,release_date,release_type,primary_genre,upc,created_at')
        .eq('org_id', org.id)
        .order('created_at', { ascending: false });

      setReleases(data ?? []);
      setLoading(false);
    })();
  }, [gateReady]);

  const hasData = useMemo(() => releases.length > 0, [releases]);

  return (
    <main className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
          Catalog{orgName ? ` — ${orgName}` : ''}
        </h1>
        <Link href="/releases/new"><Button>New Release</Button></Link>
      </div>

      {loading && (
        <Card><CardText>Loading catalog…</CardText></Card>
      )}

      {!loading && !hasData && (
        <Card>
          <CardTitle>No releases yet</CardTitle>
          <CardText className="mt-1">Create your first release to get started.</CardText>
          <div className="mt-3"><Link href="/releases/new"><Button>New Release</Button></Link></div>
        </Card>
      )}

      {!loading && hasData && (
        <div className="rounded-2xl border border-zinc-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-900/60 text-zinc-300">
              <tr>
                <th className="text-left px-3 py-2">Title</th>
                <th className="text-left px-3 py-2">Display</th>
                <th className="text-left px-3 py-2">Type</th>
                <th className="text-left px-3 py-2">Date</th>
                <th className="text-left px-3 py-2">Genre</th>
                <th className="text-left px-3 py-2">UPC</th>
              </tr>
            </thead>
            <tbody>
              {releases.map(r => (
                <tr key={r.id} className="border-t border-zinc-800 hover:bg-zinc-900/30">
                  <td className="px-3 py-2">{r.title}</td>
                  <td className="px-3 py-2">{r.display_title ?? '—'}</td>
                  <td className="px-3 py-2">{r.release_type ?? '—'}</td>
                  <td className="px-3 py-2">{r.release_date ?? '—'}</td>
                  <td className="px-3 py-2">{r.primary_genre ?? '—'}</td>
                  <td className="px-3 py-2">{r.upc ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
