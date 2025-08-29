import { supabase } from '@/lib/supabaseClient';

export type OrgRecord = { id: string; name: string; type: 'artist'|'label' };

export async function getActiveOrg(): Promise<OrgRecord | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('memberships')
    .select('org_id, organizations!inner(id, name, type)')
    .eq('user_id', user.id)
    .limit(1);

  if (error || !data || data.length === 0) return null;
  const org = (data[0] as any).organizations as OrgRecord;
  return org ?? null;
}
