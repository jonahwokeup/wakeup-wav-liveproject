"use client";
import React from "react";

export type Headline = {
  id: string;
  text: string;
  href?: string;
};

export default function Headlines({ items }: { items: Headline[] }) {
  if (!items?.length) {
    return (
      <div className="card p-6">
        <div className="text-sm text-zinc-400">No headlines yet. Come back later!</div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <ul className="list-disc pl-6 space-y-2">
        {items.map((h) => (
          <li key={h.id} className="text-zinc-100">
            {h.href ? (
              <a href={h.href} className="underline decoration-zinc-600 hover:decoration-zinc-300">
                {h.text}
              </a>
            ) : (
              <span>{h.text}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
