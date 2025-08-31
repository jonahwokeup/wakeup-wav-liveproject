import { supabase } from '@/lib/supabaseClient';

export default async function SignInPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const errorParam = params?.error;
  const error = Array.isArray(errorParam) ? errorParam[0] : errorParam;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: typeof window !== 'undefined'
          ? `${window.location.origin}/auth/callback`
          : undefined,
      },
    });
    
    if (error) {
      // Redirect with error
      const url = new URL(window.location.href);
      url.searchParams.set('error', error.message);
      window.location.href = url.toString();
    } else {
      // Redirect with success
      const url = new URL(window.location.href);
      url.searchParams.set('message', 'Check your email for the link');
      window.location.href = url.toString();
    }
  }

  return (
    <main className="min-h-screen grid place-items-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-3">
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <input
          className="w-full border p-2 rounded"
          type="email"
          name="email"
          placeholder="you@example.com"
          required
        />
        <button className="w-full border p-2 rounded" type="submit">
          Send magic link
        </button>
        {params?.message && <p className="text-green-700">{params.message}</p>}
        {error && <p className="text-red-600">{error}</p>}
      </form>
    </main>
  );
}
