import { supabase } from '@/lib/supabaseClient';

export type OrgRecord = { id: string; name: string; type: 'artist'|'label' };
type MembershipRow = { organizations: OrgRecord | OrgRecord[] | null };

export async function getActiveOrg(): Promise<OrgRecord | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('memberships')
    // Ask for the related organization fields via foreign-table select
    .select('organizations(id, name, type)')
    .eq('user_id', user.id)
    .limit(1);

  if (error || !data || data.length === 0) return null;

  // Supabase can return organizations as an object or an array depending on relationship config.
  const rows = data as unknown as MembershipRow[];
  const orgField = rows[0]?.organizations;

  const org: OrgRecord | null = Array.isArray(orgField)
    ? (orgField[0] ?? null)
    : (orgField ?? null);

  return org ? { id: String(org.id), name: String(org.name), type: org.type } : null;
}
