import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (key) => req.cookies.get(key)?.value,
        set: (key, value, options) => {
          res.cookies.set({ name: key, value, ...options });
        },
        remove: (key, options) => {
          res.cookies.set({ name: key, value: '', ...options, expires: new Date(0) });
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();
  const path = req.nextUrl.pathname;

  const isAuthed = !!session;
  const isAuthPage = path === '/signin';
  const isProtected = path.startsWith('/dashboard') || path.startsWith('/org');

  if (!isAuthed && isProtected) {
    const url = req.nextUrl.clone();
    url.pathname = '/signin';
    return NextResponse.redirect(url);
  }

  if (isAuthed && isAuthPage) {
    const url = req.nextUrl.clone();
    url.pathname = '/org/new';
    return NextResponse.redirect(url);
  }

  return res;
}

export const config = {
  matcher: ['/signin', '/dashboard/:path*', '/org/:path*'],
};
