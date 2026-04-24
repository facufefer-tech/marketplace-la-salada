const DEFAULT_ADMIN = "facufefer@gmail.com";

export function isAdminUser(email: string | undefined | null) {
  if (!email) return false;
  const e = email.toLowerCase();
  if (e === DEFAULT_ADMIN) return true;
  const raw = process.env.ADMIN_EMAILS ?? "";
  const list = raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return list.includes(e);
}
