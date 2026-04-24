export default function GlobalLoading() {
  return (
    <main className="container-shell py-8">
      <div className="animate-pulse space-y-5">
        <div className="h-10 w-1/3 rounded bg-zinc-200" />
        <div className="h-64 rounded-2xl bg-zinc-200" />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-2 rounded-xl border border-zinc-200 p-3">
              <div className="h-40 rounded bg-zinc-200" />
              <div className="h-4 rounded bg-zinc-200" />
              <div className="h-4 w-2/3 rounded bg-zinc-200" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

