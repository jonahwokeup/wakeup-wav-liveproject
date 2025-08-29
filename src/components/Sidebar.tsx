'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useMemo, useState } from 'react';

type Item = { href: string; label: string; emoji?: string };
type Section = {
  key: string;
  title: string;
  items: Item[];
};

const SECTIONS: Section[] = [
  {
    key: 'release',
    title: 'Release Management',
    items: [
      { href: '/releases/new',  label: 'Create Release', emoji: '➕' },
      { href: '/releases/catalog', label: 'Catalog',     emoji: '📚' },
    ],
  },
  {
    key: 'data',
    title: 'Data Dashboard',
    items: [
      { href: '/dashboard',      label: 'Overview',  emoji: '🏠' },
      { href: '/data/streaming', label: 'Streaming', emoji: '🎧' },
      { href: '/data/ads',       label: 'Ads',       emoji: '📢' },
    ],
  },
];

function NavLink({ href, label, emoji }: Item) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + '/');

  return (
    <Link
      href={href}
      className={[
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition',
        active
          ? 'bg-zinc-900/60 border border-zinc-800 text-white'
          : 'text-zinc-300 hover:text-white hover:bg-zinc-900/40 border border-transparent',
      ].join(' ')}
    >
      <span className="text-base leading-none">{emoji}</span>
      <span>{label}</span>
      {active && (
        <span className="ml-auto h-1 w-1 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400" />
      )}
    </Link>
  );
}

function SectionBlock({ section }: { section: Section }) {
  const pathname = usePathname();

  const initiallyOpen = useMemo(() => {
    return section.items.some(it => pathname === it.href || pathname.startsWith(it.href + '/'));
  }, [pathname, section.items]);

  const [open, setOpen] = useState<boolean>(initiallyOpen);

  return (
    <div>
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between text-left text-xs tracking-wide text-zinc-400 uppercase mb-2"
      >
        <span>{section.title}</span>
        <span className="text-zinc-500">{open ? '▾' : '▸'}</span>
      </button>
      <div className={open ? 'space-y-2' : 'hidden'}>
        {section.items.map((it) => <NavLink key={it.href} {...it} />)}
      </div>
    </div>
  );
}

export default function Sidebar() {
  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden sticky top-0 z-40 border-b border-zinc-800 bg-black/70 backdrop-blur px-4 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent font-semibold"
        >
          wakeup.wav
        </Link>
        <nav className="flex items-center gap-3 text-lg">
          <Link href="/releases/new" title="Create Release">➕</Link>
          <Link href="/releases/catalog" title="Catalog">📚</Link>
          <Link href="/dashboard" title="Overview">🏠</Link>
          <Link href="/data/streaming" title="Streaming">🎧</Link>
          <Link href="/data/ads" title="Ads">📢</Link>
        </nav>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:sticky md:top-0 md:h-screen w-64 flex-col border-r border-zinc-800 bg-black/60 backdrop-blur p-4">
        <Link href="/" className="mb-4 flex items-center gap-3">
          <Image
            src="/roger.png"
            alt="Roger"
            width={32}
            height={32}
            className="rounded-md"
          />
          <span className="text-lg font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
            wakeup.wav
          </span>
        </Link>

        <nav className="space-y-5">
          {SECTIONS.map(sec => <SectionBlock key={sec.key} section={sec} />)}
        </nav>

        <div className="mt-auto pt-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} wakeup.wav</p>
        </div>
      </aside>
    </>
  );
}
