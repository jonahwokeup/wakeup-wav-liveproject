import Link from 'next/link';

export default function Home() {
  return (
    <main className="p-6 space-y-2">
      <h1 className="text-2xl font-semibold">wakeup.wav</h1>
      <p className="text-zinc-400">Jump in:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li><Link className="underline" href="/dashboard">Dashboard</Link></li>
        <li><Link className="underline" href="/releases/new">Create Release</Link></li>
      </ul>
    </main>
  );
}
