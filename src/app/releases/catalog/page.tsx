"use client";

import React, { Fragment, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type ReleaseRow = {
  id: string;
  title: string;
  release_date: string | null;
  release_type: "single" | "ep" | "album" | null;
  primary_artist: string | null;
  catalog_number: string | null;
  created_at: string;
  cover_url: string | null;
};

export const dynamic = 'force-dynamic';

export default function CatalogPage() {
  const [rows, setRows] = useState<ReleaseRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // filters
  const [q, setQ] = useState("");
  const [type, setType] = useState<"" | "single" | "ep" | "album">("");
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        let query = supabase.from("releases").select(
          "id,title,release_date,release_type,primary_artist,catalog_number,created_at,cover_url"
        );

        if (type) query = query.eq("release_type", type);
        if (from) query = query.gte("release_date", from);
        if (to) query = query.lte("release_date", to);
        if (q.trim()) {
          // simple ilike on a few columns
          const term = `%${q.trim()}%`;
          query = query.or(
            `title.ilike.${term},primary_artist.ilike.${term},catalog_number.ilike.${term}`
          );
        }

        const { data, error } = await query.order("created_at", { ascending: false });
        if (error) throw error;
        if (!isMounted) return;
        setRows((data ?? []) as ReleaseRow[]);
      } catch (err) {
        console.error("Catalog fetch error:", err);
        if (isMounted) setRows([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [q, type, from, to]);

  const filteredCount = useMemo(() => rows.length, [rows]);

  return (
    <div className="p-6 space-y-6">
      {/* Title + New Release */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-100">Catalog</h1>
        <Link
          href="/releases/new"
          className="rounded-lg bg-zinc-800/70 px-4 py-2 text-sm text-zinc-100 hover:bg-zinc-700 transition"
        >
          + New Release
        </Link>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-zinc-800/70 bg-zinc-900/40 p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search title, artist, catalog #"
            className="w-full rounded-md bg-zinc-900/70 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none ring-1 ring-zinc-800 focus:ring-zinc-600"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value as typeof type)}
            className="w-full rounded-md bg-zinc-900/70 px-3 py-2 text-sm text-zinc-100 outline-none ring-1 ring-zinc-800 focus:ring-zinc-600"
          >
            <option value="">All types</option>
            <option value="single">Single</option>
            <option value="ep">EP</option>
            <option value="album">Album</option>
          </select>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full rounded-md bg-zinc-900/70 px-3 py-2 text-sm text-zinc-100 outline-none ring-1 ring-zinc-800 focus:ring-zinc-600"
          />
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full rounded-md bg-zinc-900/70 px-3 py-2 text-sm text-zinc-100 outline-none ring-1 ring-zinc-800 focus:ring-zinc-600"
          />
        </div>
      </div>

      {/* Loading hint */}
      {loading && (
        <div className="text-sm text-zinc-400">Loading…</div>
      )}

      {/* Table */}
      <div className="rounded-2xl border border-zinc-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-zinc-900/60 text-zinc-400">
            <tr>
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Artist</th>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Release Date</th>
              <th className="px-4 py-2 text-left">Catalog #</th>
              <th className="px-4 py-2 text-left">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/80 bg-zinc-950/30 text-zinc-100">
            {filteredCount === 0 && !loading && (
              <tr>
                <td className="px-4 py-6 text-zinc-400" colSpan={6}>
                  No releases match your filters.
                </td>
              </tr>
            )}

            {rows.map((r) => {
              const isOpen = expandedId === r.id;
              return (
                <Fragment key={r.id}>
                  <tr
                    onClick={() => setExpandedId(isOpen ? null : r.id)}
                    className={`cursor-pointer transition-colors hover:bg-zinc-900/40 ${
                      isOpen ? "bg-zinc-900/50" : ""
                    }`}
                  >
                    {/* Adjust the cells below to match your existing columns */}
                    <td className="py-3 px-4 text-zinc-100">
                      <Link href={`/releases/${r.id}`} className="hover:underline">
                        {r.title}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-zinc-300">{r.primary_artist ?? "-"}</td>
                    <td className="py-3 px-4 text-zinc-300 capitalize">{r.release_type ?? "-"}</td>
                    <td className="py-3 px-4 text-zinc-500">
                      {r.release_date ? new Date(r.release_date).toLocaleDateString() : "-"}
                    </td>
                    <td className="py-3 px-4 text-zinc-300">{r.catalog_number ?? "-"}</td>
                    <td className="py-3 px-4 text-zinc-500">
                      {new Date(r.created_at).toLocaleDateString()}
                    </td>
                  </tr>

                  {isOpen && (
                    <tr key={`${r.id}-expanded`}>
                      <td colSpan={6} className="py-4 px-4 bg-zinc-950">
                        <div className="flex items-start gap-4">
                          {/* Artwork */}
                          {r.cover_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={r.cover_url}
                              alt={`${r.title} cover`}
                              className="h-40 w-40 rounded-xl object-cover border border-zinc-800"
                            />
                          ) : (
                            <div className="h-40 w-40 rounded-xl border border-dashed border-zinc-800 flex items-center justify-center text-zinc-500">
                              No cover
                            </div>
                          )}

                          {/* Extra metadata (optional; tailor as you like) */}
                          <div className="min-w-0">
                            <div className="text-zinc-100 text-lg font-medium">{r.title}</div>
                            <div className="text-zinc-300 text-sm">
                              {r.primary_artist ?? "Unknown"} • {r.release_type ?? "—"}
                            </div>
                            {r.catalog_number && (
                              <div className="mt-2 text-zinc-400 text-sm">Catalog: {r.catalog_number}</div>
                            )}
                            {r.release_date && (
                              <div className="text-zinc-400 text-sm">
                                Release: {new Date(r.release_date).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
