export default function Dashboard() {
  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <p className="text-gray-600 mt-2">
        No releases yet. Create an organization to begin.{' '}
        <a href="/org/new" className="underline">Create organization</a>
      </p>
    </main>
  );
}
