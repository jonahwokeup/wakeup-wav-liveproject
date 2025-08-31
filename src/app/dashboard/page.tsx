"use client";
import React, { useMemo } from "react";
import Sparkline from "@/components/Sparkline";
import Link from "next/link";

// Simple deterministic mock so it looks stable between reloads
function mockSeries(len = 24, seed = 42, base = 1000, volatility = 0.06) {
  let x = base;
  const out: number[] = [];
  let s = seed;
  for (let i = 0; i < len; i++) {
    // tiny LCG
    s = (s * 1664525 + 1013904223) % 2 ** 32;
    const r = ((s >>> 16) / 65535) * 2 - 1; // [-1,1]
    x = Math.max(0, x * (1 + r * volatility));
    out.push(Math.round(x));
  }
  return out;
}

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const streams = useMemo(() => mockSeries(28, 7, 1200, 0.08), []);
  const ads = useMemo(() => mockSeries(28, 11, 300, 0.12), []);
  const growthPct = useMemo(() => {
    if (streams.length < 2) return 0;
    const a = streams[streams.length - 2];
    const b = streams[streams.length - 1];
    return ((b - a) / Math.max(1, a)) * 100;
  }, [streams]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Data Dashboard</h1>
        <div className="text-sm text-zinc-400">
          Mock data for layout only — replace with live metrics later
        </div>
      </div>

      {/* Overview tiles */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs uppercase tracking-wide text-zinc-400">Total Streams</div>
              <div className="mt-1 text-2xl font-semibold">
                {streams[streams.length - 1].toLocaleString()}
              </div>
              <div className={`mt-1 text-xs ${growthPct >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {growthPct >= 0 ? "▲" : "▼"} {growthPct.toFixed(1)}% vs prev day
              </div>
            </div>
            <Sparkline data={streams} width={180} height={48} />
          </div>
          <div className="mt-3 text-xs text-zinc-400">Last 28 days</div>
        </div>

        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs uppercase tracking-wide text-zinc-400">Ad Clicks</div>
              <div className="mt-1 text-2xl font-semibold">
                {ads[ads.length - 1].toLocaleString()}
              </div>
            </div>
            <Sparkline data={ads} width={180} height={48} showArea />
          </div>
          <div className="mt-3 text-xs text-zinc-400">Last 28 days</div>
        </div>

        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs uppercase tracking-wide text-zinc-400">Actions Triggered</div>
              <div className="mt-1 text-2xl font-semibold">42</div>
            </div>
            <Sparkline data={mockSeries(28, 19, 40, 0.2)} width={180} height={48} />
          </div>
          <div className="mt-3 text-xs text-zinc-400">
            Placeholder — we&apos;ll wire to real &quot;AI action layer&quot; later
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/dashboard/streaming" className="card hover:bg-zinc-900/40 transition-colors">
          <div className="text-lg font-semibold">Streaming</div>
          <div className="mt-1 text-sm text-zinc-400">Platform breakdown, territories, velocity</div>
        </Link>
        <Link href="/dashboard/ads" className="card hover:bg-zinc-900/40 transition-colors">
          <div className="text-lg font-semibold">Ads</div>
          <div className="mt-1 text-sm text-zinc-400">Spend, CTR, ROAS, cohorts</div>
        </Link>
      </div>
    </div>
  );
}
