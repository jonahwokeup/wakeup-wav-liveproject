'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardTitle, CardText } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { supabase } from '@/lib/supabaseClient';
import { getActiveOrg } from '@/lib/org';

type Release = { id: string; title: string; release_date: string | null; created_at: string };

export default function Dashboard() {
  const [orgName, setOrgName] = useState<string | null>(null);
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        .select('*')
        .eq('org_id', org.id)
        .order('created_at', { ascending: false });

      setReleases(data ?? []);
      
      // fetch track counts for each release and inject into DOM placeholders
      if (data && data.length) {
        const ids = data.map(d => d.id);
        const { data: counts } = await supabase
          .from('tracks')
          .select('release_id, id')
          .in('release_id', ids);

        const byRelease = new Map<string, number>();
        counts?.forEach(t => {
          byRelease.set(t.release_id, (byRelease.get(t.release_id) ?? 0) + 1);
        });

        // naive client-side write into placeholders (we'll render properly later)
        requestAnimationFrame(() => {
          ids.forEach(id => {
            const el = document.querySelector(`[data-rel="${id}"]`);
            if (el) el.textContent = String(byRelease.get(id) ?? 0);
          });
        });
      }
      
      setLoading(false);
    })();
  }, []);

  return (
    <main className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
          Dashboard{orgName ? ` — ${orgName}` : ''}
        </h1>
        <Link href="/releases/new"><Button>Create Release</Button></Link>
      </div>

      {loading && <Card><CardText>Loading releases…</CardText></Card>}

      {!loading && releases.length === 0 && (
        <Card>
          <CardTitle>No releases yet</CardTitle>
          <CardText>Create your first release to get started.</CardText>
          <div className="mt-3"><Link href="/releases/new"><Button>New release</Button></Link></div>
        </Card>
      )}

      <div className="grid gap-3">
        {releases.map(r => (
          <Card key={r.id}>
            <CardTitle>{r.title}</CardTitle>
            <CardText>
              {r.release_date ? `Release date: ${r.release_date}` : 'No date set'}
            </CardText>
          </Card>
        ))}
      </div>
    </main>
  );
}
