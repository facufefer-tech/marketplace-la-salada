export default function ProductoLoading() {
  return (
    <main className="container-shell py-8">
      <div className="animate-pulse grid gap-6 md:grid-cols-2">
        <div className="aspect-square rounded-2xl bg-zinc-200" />
        <div className="space-y-3">
          <div className="h-8 w-3/4 rounded bg-zinc-200" />
          <div className="h-6 w-1/3 rounded bg-zinc-200" />
          <div className="h-20 rounded bg-zinc-200" />
          <div className="h-11 rounded-xl bg-zinc-200" />
        </div>
      </div>
    </main>
  );
}

