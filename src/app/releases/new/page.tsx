'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { supabase } from '@/lib/supabaseClient';
import { getActiveOrg } from '@/lib/org';
import { Card, CardTitle, CardText } from '@/components/ui/Card';

type ReleaseType = 'single' | 'ep' | 'album';

export default function NewRelease() {
  const router = useRouter();
  const [orgId, setOrgId] = useState<string | null>(null);

  // Release fields
  const [title, setTitle] = useState('');
  const [displayTitle, setDisplayTitle] = useState('');
  const [releaseType, setReleaseType] = useState<ReleaseType>('single');
  const [releaseDate, setReleaseDate] = useState<string>('');

  // Codes
  const [upc, setUpc] = useState('');
  const [catalogNumber, setCatalogNumber] = useState('');
  const [grid, setGrid] = useState('');

  // Genre & Language
  const [primaryGenre, setPrimaryGenre] = useState('');
  const [subGenre, setSubGenre] = useState('');
  const [metadataLanguage, setMetadataLanguage] = useState('');
  const [audioLanguage, setAudioLanguage] = useState('');
  const [audioPresentation, setAudioPresentation] = useState('');

  // Artists & contributors
  const [releaseArtists, setReleaseArtists] = useState('');
  const [contributors, setContributors] = useState('');

  // Legal
  const [cLineYear, setCLineYear] = useState('');
  const [cLineOwner, setCLineOwner] = useState('');
  const [pLineYear, setPLineYear] = useState('');
  const [pLineOwner, setPLineOwner] = useState('');

  // Misc
  const [marketingNotes, setMarketingNotes] = useState('');

  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const org = await getActiveOrg();
      setOrgId(org?.id ?? null);
    })();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    if (!orgId) return setErr('No organization found. Create an org first.');
    if (!title.trim()) return setErr('Title is required.');

    setSaving(true);

    const { error } = await supabase.from('releases').insert({
      org_id: orgId,
      title,
      display_title: displayTitle || null,
      release_type: releaseType,
      release_date: releaseDate || null,
      upc: upc || null,
      catalog_number: catalogNumber || null,
      grid: grid || null,
      primary_genre: primaryGenre || null,
      sub_genre: subGenre || null,
      metadata_language: metadataLanguage || null,
      audio_language: audioLanguage || null,
      audio_presentation: audioPresentation || null,
      release_artists: releaseArtists || null,
      contributors: contributors || null,
      c_line_year: cLineYear ? parseInt(cLineYear, 10) : null,
      c_line_owner: cLineOwner || null,
      p_line_year: pLineYear ? parseInt(pLineYear, 10) : null,
      p_line_owner: pLineOwner || null,
      marketing_notes: marketingNotes || null,
    });

    if (error) {
      setSaving(false);
      return setErr(error.message);
    }

    router.push('/dashboard');
  }

  return (
    <main className="min-h-screen p-6 space-y-6">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
        Create Release
      </h1>

      <form onSubmit={onSubmit} className="space-y-6 max-w-3xl">

        {/* Release Core Info */}
        <Card>
          <CardTitle>Release Info</CardTitle>
          <div className="mt-4 grid gap-4">
            <div>
              <label className="block text-sm mb-1">Title *</label>
              <input className="w-full p-2 rounded bg-zinc-900/40 border border-zinc-800"
                value={title} onChange={(e)=>setTitle(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm mb-1">Display Title</label>
              <input className="w-full p-2 rounded bg-zinc-900/40 border border-zinc-800"
                value={displayTitle} onChange={(e)=>setDisplayTitle(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm mb-1">Release Type</label>
              <select className="w-full p-2 rounded bg-zinc-900/40 border border-zinc-800"
                value={releaseType} onChange={(e)=>setReleaseType(e.target.value as ReleaseType)}>
                <option value="single">Single</option>
                <option value="ep">EP</option>
                <option value="album">Album</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Release Date</label>
              <input type="date"
                className="w-full p-2 rounded bg-zinc-900/40 border border-zinc-800"
                value={releaseDate} onChange={(e)=>setReleaseDate(e.target.value)} />
            </div>
          </div>
        </Card>

        {/* Codes */}
        <Card>
          <CardTitle>Codes</CardTitle>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <input placeholder="UPC / EAN" className="p-2 rounded bg-zinc-900/40 border border-zinc-800"
              value={upc} onChange={(e)=>setUpc(e.target.value)} />
            <input placeholder="Catalog Number" className="p-2 rounded bg-zinc-900/40 border border-zinc-800"
              value={catalogNumber} onChange={(e)=>setCatalogNumber(e.target.value)} />
            <input placeholder="GRID" className="p-2 rounded bg-zinc-900/40 border border-zinc-800"
              value={grid} onChange={(e)=>setGrid(e.target.value)} />
          </div>
        </Card>

        {/* Genre & Language */}
        <Card>
          <CardTitle>Genre & Language</CardTitle>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <input placeholder="Primary Genre" className="p-2 rounded bg-zinc-900/40 border border-zinc-800"
              value={primaryGenre} onChange={(e)=>setPrimaryGenre(e.target.value)} />
            <input placeholder="Sub Genre" className="p-2 rounded bg-zinc-900/40 border border-zinc-800"
              value={subGenre} onChange={(e)=>setSubGenre(e.target.value)} />
            <input placeholder="Metadata Language" className="p-2 rounded bg-zinc-900/40 border border-zinc-800"
              value={metadataLanguage} onChange={(e)=>setMetadataLanguage(e.target.value)} />
            <input placeholder="Audio Language" className="p-2 rounded bg-zinc-900/40 border border-zinc-800"
              value={audioLanguage} onChange={(e)=>setAudioLanguage(e.target.value)} />
            <input placeholder="Audio Presentation" className="p-2 rounded bg-zinc-900/40 border border-zinc-800"
              value={audioPresentation} onChange={(e)=>setAudioPresentation(e.target.value)} />
          </div>
        </Card>

        {/* Artists */}
        <Card>
          <CardTitle>Artists</CardTitle>
          <textarea placeholder="Release Artists"
            className="w-full p-2 rounded bg-zinc-900/40 border border-zinc-800 min-h-[80px]"
            value={releaseArtists} onChange={(e)=>setReleaseArtists(e.target.value)} />
        </Card>

        {/* Contributors */}
        <Card>
          <CardTitle>Contributors</CardTitle>
          <textarea placeholder="Contributors (comma separated or freeform)"
            className="w-full p-2 rounded bg-zinc-900/40 border border-zinc-800 min-h-[80px]"
            value={contributors} onChange={(e)=>setContributors(e.target.value)} />
        </Card>

        {/* Legal Notices */}
        <Card>
          <CardTitle>Legal Notices</CardTitle>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <input placeholder="C-Line Year" className="p-2 rounded bg-zinc-900/40 border border-zinc-800"
              value={cLineYear} onChange={(e)=>setCLineYear(e.target.value)} />
            <input placeholder="C-Line Owner" className="p-2 rounded bg-zinc-900/40 border border-zinc-800"
              value={cLineOwner} onChange={(e)=>setCLineOwner(e.target.value)} />
            <input placeholder="P-Line Year" className="p-2 rounded bg-zinc-900/40 border border-zinc-800"
              value={pLineYear} onChange={(e)=>setPLineYear(e.target.value)} />
            <input placeholder="P-Line Owner" className="p-2 rounded bg-zinc-900/40 border border-zinc-800"
              value={pLineOwner} onChange={(e)=>setPLineOwner(e.target.value)} />
          </div>
        </Card>

        {/* Misc */}
        <Card>
          <CardTitle>Miscellaneous</CardTitle>
          <textarea placeholder="Marketing Notes"
            className="w-full p-2 rounded bg-zinc-900/40 border border-zinc-800 min-h-[80px]"
            value={marketingNotes} onChange={(e)=>setMarketingNotes(e.target.value)} />
        </Card>

        {err && <p className="text-red-500 text-sm">{err}</p>}

        <div className="flex gap-2">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Save Release'}
          </Button>
          <Button type="button" variant="ghost" onClick={()=>router.back()}>Cancel</Button>
        </div>
      </form>
    </main>
  );
}
