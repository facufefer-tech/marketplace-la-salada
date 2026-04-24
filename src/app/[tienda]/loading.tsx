export default function TiendaLoading() {
  return (
    <main className="container-shell py-8">
      <div className="animate-pulse space-y-4">
        <div className="h-48 rounded-2xl bg-zinc-200" />
        <div className="h-8 w-1/3 rounded bg-zinc-200" />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-64 rounded-xl bg-zinc-200" />
          ))}
        </div>
      </div>
    </main>
  );
}

