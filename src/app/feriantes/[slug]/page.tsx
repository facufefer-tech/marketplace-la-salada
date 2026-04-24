import { notFound, redirect } from "next/navigation";
import { demoStores } from "@/lib/demo-data";

type Props = { params: { slug: string } };

export default function FerianteProfilePage({ params }: Props) {
  const feriante = demoStores.find((s) => s.slug === params.slug);
  if (!feriante) notFound();
  redirect(`/${feriante.slug}`);
}
