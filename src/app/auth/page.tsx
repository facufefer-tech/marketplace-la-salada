import { Suspense } from "react";
import { AuthForm } from "./AuthForm";

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto flex min-h-[70vh] max-w-md items-center justify-center px-4">
          <p className="text-sm text-zinc-500">Cargando…</p>
        </main>
      }
    >
      <AuthForm />
    </Suspense>
  );
}
