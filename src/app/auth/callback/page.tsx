'use client';
import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

type OtpType = 'magiclink' | 'recovery' | 'invite' | 'email_change';

function parseHashParams(hash: string) {
  const params = new URLSearchParams(hash.replace(/^#/, ''));
  return {
    access_token: params.get('access_token'),
    refresh_token: params.get('refresh_token'),
  };
}

// Prevent prerendering issues for this page
export const dynamic = 'force-dynamic';

function CallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    (async () => {
      try {
        // 0) Already signed in?
        const s0 = await supabase.auth.getSession();
        if (s0.data.session) return router.replace('/org/new');

        // 1) PKCE (?code=...)
        const code = searchParams.get('code');
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (!error) return router.replace('/org/new');
          // fall through if error
        }

        // 2) Magic link (?token_hash=&type=...)
        const token_hash = searchParams.get('token_hash');
        const type = searchParams.get('type') as OtpType | null;
        if (token_hash && type) {
          const { error } = await supabase.auth.verifyOtp({ token_hash, type });
          if (!error) return router.replace('/org/new');
          // fall through if error
        }

        // 3) Hash fragment (#access_token=&refresh_token=)
        const { access_token, refresh_token } = parseHashParams(window.location.hash || '');
        if (access_token && refresh_token) {
          const { error } = await supabase.auth.setSession({ access_token, refresh_token });
          if (!error) return router.replace('/org/new');
          // fall through if error
        }

        // If none worked, go back to signin
        router.replace('/signin?error=auth');
      } catch {
        router.replace('/signin?error=auth');
      }
    })();
  }, [router, searchParams]);

  return <p className="p-6">Signing you in…</p>;
}

export default function AuthCallback() {
  return (
    <Suspense fallback={<p className="p-6">Signing you in…</p>}>
      <CallbackInner />
    </Suspense>
  );
}
