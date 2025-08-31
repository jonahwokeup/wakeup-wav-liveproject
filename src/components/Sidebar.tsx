'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import * as React from 'react';

type IconProps = React.SVGProps<SVGSVGElement> & { className?: string };
const ChevronRight = ({ className = '', ...props }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    width="12"
    height="12"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <path
      d="M9 18l6-6-6-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

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

// (Optional cleanup) Add a tiny helper component ABOVE the Sidebar component to keep headers identical:
const SectionHeader = ({
  label,
  open,
  onToggle,
}: { label: string; open: boolean; onToggle: () => void }) => (
  <button
    type="button"
    onClick={onToggle}
    className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 hover:text-zinc-200"
  >
    <span>{label}</span>
    <ChevronRight
      className={`h-3 w-3 transition-transform ${
        open ? 'rotate-90 text-zinc-300' : 'text-zinc-500'
      }`}
    />
  </button>
);

export default function Sidebar() {
  const pathname = usePathname() || '';
  // (You likely already have open/close state for other groups)
  // Add settings toggle state with the same default you use for others:
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);

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

          {/* SETTINGS */}
          <div className="mt-6">
            <SectionHeader
              label="Settings"
              open={isSettingsOpen}
              onToggle={() => setIsSettingsOpen((v) => !v)}
            />
            {isSettingsOpen && (
              <div className="mt-2 space-y-1">
                {/* Org Settings link */}
                <Link
                  href="/settings/org"
                  className={`group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition
                    ${
                      pathname.startsWith('/settings/org')
                        ? 'bg-zinc-900/70 text-zinc-100'
                        : 'text-zinc-300 hover:bg-zinc-900/60 hover:text-white'
                    }`}
                >
                  <span className="text-lg">⚙️</span>
                  <span>Org Settings</span>
                </Link>
              </div>
            )}
          </div>
        </nav>

        <div className="mt-auto pt-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} wakeup.wav</p>
        </div>
      </aside>
    </>
  );
}
