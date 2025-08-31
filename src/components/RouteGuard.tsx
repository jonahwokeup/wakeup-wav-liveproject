"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";



export default function RouteGuard() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isAuthPage = (pathname ?? '').startsWith('/auth');
  const router = useRouter();

  useEffect(() => {
    if (!pathname) return;

    const hasUrlOrg = !!searchParams.get('org');
    const isCreateRelease = (pathname ?? '') === '/releases/new';
    // If we're on /releases/new with a concrete ?org, don't force org gating
    const needsOrg =
      !isAuthPage &&
      (pathname ?? '') !== '/settings/org' &&
      !(isCreateRelease && hasUrlOrg);

    if (!needsOrg) return;

    const currentOrg = typeof window !== "undefined"
      ? window.localStorage.getItem("current_org")
      : null;

    if (!currentOrg) {
      router.replace("/settings/org");
    }
  }, [pathname, router, isAuthPage, searchParams]);

  return null;
}
