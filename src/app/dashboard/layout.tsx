import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { demoStores } from "@/lib/demo-data";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth?next=/dashboard");

  const { data: tienda } = await supabase.from("tiendas").select("nombre,slug").eq("owner_id", user.id).maybeSingle();
  const previewSlug = tienda?.slug ?? demoStores[0]?.slug ?? "";

  return (
    <div className="min-h-[calc(100dvh-3.5rem)] bg-zinc-100">
      <div className="mx-auto flex max-w-[1600px]">
        <aside className="sticky top-0 flex h-[calc(100dvh-3.5rem)] w-64 shrink-0 flex-col border-r border-zinc-800 bg-zinc-900 p-6 text-zinc-100">
          <DashboardSidebar
            tiendaNombre={tienda?.nombre ?? "Tu tienda"}
            userEmail={user.email ?? ""}
            publicSlug={previewSlug}
          />
        </aside>
        <main className="min-w-0 flex-1 p-4 md:p-8 lg:p-10">
          <div className="min-h-full rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm md:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
