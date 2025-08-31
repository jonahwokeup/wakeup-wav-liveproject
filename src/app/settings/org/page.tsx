'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { getActiveOrg } from '@/lib/org';
import Button from '@/components/ui/Button';
import { Card, CardTitle, CardText } from '@/components/ui/Card';

type OrgRecord = { id: string; name: string; type: 'artist'|'label' };

export const dynamic = 'force-dynamic';

export default function OrgSettingsPage() {
  const router = useRouter();
  const [currentOrg, setCurrentOrg] = useState<OrgRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [orgName, setOrgName] = useState('');
  const [orgType, setOrgType] = useState<'artist'|'label'>('artist');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadCurrentOrg();
  }, []);

  const loadCurrentOrg = async () => {
    setLoading(true);
    const org = await getActiveOrg();
    if (org) {
      setCurrentOrg(org);
      setOrgName(org.name);
      setOrgType(org.type);
      // Set current_org in localStorage
      window.localStorage.setItem("current_org", org.id);
    }
    setLoading(false);
  };

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // sanity: ensure we have a user
      const { data: userRes, error: userErr } = await supabase.auth.getUser();
      if (userErr || !userRes?.user) {
        throw new Error(userErr?.message || "No authenticated user");
      }

      // call the RPC to create org + membership atomically
      const { data: org, error: rpcError } = await supabase.rpc("create_org_with_owner", {
        p_name: orgName.trim(),
        p_type: orgType, // 'artist' | 'label'
      });

      if (rpcError) {
        // surface real details in the UI and console
        console.error("RPC create_org_with_owner error:", rpcError);
        setError(rpcError.message || "Failed to create organization");
        setSubmitting(false);
        return;
      }

      if (!org?.id) {
        console.error("RPC returned no org:", org);
        setError("Unexpected error creating organization");
        setSubmitting(false);
        return;
      }

      // go straight to the Create Release page with the new org id
      router.push(`/releases/new?org=${org.id}`);
    } catch (e: unknown) {
      const err = e instanceof Error ? e : new Error(String(e));
      console.error("Error creating organization:", err);
      setError(err.message || "Something went wrong creating the organization");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectOrg = async (org: OrgRecord) => {
    // Set current_org in localStorage and redirect
    window.localStorage.setItem("current_org", org.id);
    router.push("/releases/new");
  };

  const handleLeaveOrg = async () => {
    if (!currentOrg) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Remove membership
      const { error } = await supabase
        .from('memberships')
        .delete()
        .eq('org_id', currentOrg.id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Clear current_org from localStorage
      window.localStorage.removeItem("current_org");
      setCurrentOrg(null);
      setOrgName('');
      setOrgType('artist');
    } catch (error) {
      console.error('Error leaving organization:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <Card><CardText>Loading organization settings...</CardText></Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold tracking-tight">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-sky-400">
          Org Settings
        </span>
      </h1>

      <p className="mt-3 text-sm text-zinc-300">
        Manage organization name, invite team members, and defaults for new releases.
      </p>

      {!currentOrg ? (
        <div className="mt-8 space-y-6">
          <Card>
            <CardTitle>Create New Organization</CardTitle>
            <CardText className="mt-2">Set up a new organization to get started.</CardText>
            
            <form onSubmit={handleCreateOrg} className="mt-4 space-y-3">
              <input
                type="text"
                placeholder="Organization Name"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-800/60 border border-zinc-700 rounded-md text-zinc-100 placeholder-zinc-400"
                required
              />
              
              <select
                value={orgType}
                onChange={(e) => setOrgType(e.target.value as 'artist'|'label')}
                className="w-full px-3 py-2 bg-zinc-800/60 border border-zinc-700 rounded-md text-zinc-100"
                required
              >
                <option value="artist">Artist</option>
                <option value="label">Label</option>
              </select>
              
              {error && (
                <div className="text-red-400 text-sm bg-red-900/20 border border-red-800/40 rounded-md px-3 py-2">
                  {error}
                </div>
              )}
              
              <Button type="submit" disabled={!orgName.trim() || submitting}>
                {submitting ? 'Creating...' : 'Create Organization'}
              </Button>
            </form>
          </Card>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          <Card>
            <CardTitle>Current Organization: {currentOrg.name}</CardTitle>
            <CardText className="mt-2">Type: {currentOrg.type}</CardText>
            
            <div className="mt-4 space-x-3">
              <Button onClick={() => handleSelectOrg(currentOrg)}>
                Continue with {currentOrg.name}
              </Button>
              <Button onClick={handleLeaveOrg} variant="ghost">
                Leave Organization
              </Button>
            </div>
          </Card>
        </div>
      )}

      <div className="mt-10">
        <Link
          href="/releases/new"
          className="inline-flex items-center rounded-md border border-zinc-700/70 bg-zinc-900/40 px-3 py-1.5 text-sm text-zinc-200 hover:bg-zinc-800/60"
        >
          ← Back to Create Release
        </Link>
      </div>
    </div>
  );
}
