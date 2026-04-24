export function waMeHref(phone: string | null | undefined) {
  if (!phone) return null;
  const d = phone.replace(/\D/g, "");
  if (d.length < 8) return null;
  return `https://wa.me/${d}`;
}
