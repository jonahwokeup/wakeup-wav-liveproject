import React from 'react';

export function Card({ className = '', children }: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={`rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children }: React.PropsWithChildren) {
  return <h3 className="text-lg font-semibold">{children}</h3>;
}

export function CardText({ children }: React.PropsWithChildren) {
  return <p className="text-sm text-zinc-400">{children}</p>;
}
