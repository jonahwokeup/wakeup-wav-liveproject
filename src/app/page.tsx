"use client";
import React, { useMemo } from "react";
import Headlines, { type Headline } from "@/components/Headlines";
import Link from "next/link";

export default function HomePage() {
  // Get weekday in the user's local time
  const weekday = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, { weekday: "long" }).format(new Date()),
    []
  );

  // Mock headlines — replace with AI-powered feed later
  const headlines: Headline[] = [
    { id: "1", text: "Track 'Glass Neon' passed 50k streams in the last 7 days" },
    { id: "2", text: "TikTok clip drove a 23% save-rate lift on Spotify" },
    { id: "3", text: "YouTube Shorts ad ROAS improved 18% week-over-week" },
  ];

  return (
    <main className="min-h-screen p-6 md:p-10 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-semibold">
          What&apos;s up! Happy <span className="holo-text">{weekday}</span>
        </h1>
        <p className="text-zinc-400">
          Here are your headlines for today:
        </p>
      </header>

      <Headlines items={headlines} />

      {/* Optional quick links */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/releases/catalog" className="card p-5 hover:bg-zinc-900/40 transition-colors">
          <div className="text-lg font-medium">View Catalog</div>
          <div className="text-sm text-zinc-400">Browse all releases</div>
        </Link>
        <Link href="/releases/new" className="card p-5 hover:bg-zinc-900/40 transition-colors">
          <div className="text-lg font-medium">Create Release</div>
          <div className="text-sm text-zinc-400">Start a new release</div>
        </Link>
        <Link href="/dashboard" className="card p-5 hover:bg-zinc-900/40 transition-colors">
          <div className="text-lg font-medium">Data Dashboard</div>
          <div className="text-sm text-zinc-400">See performance</div>
        </Link>
      </section>
    </main>
  );
}
