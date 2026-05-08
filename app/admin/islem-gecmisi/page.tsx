import { supabaseAdmin } from "@/lib/supabase-admin";

type AuditLogRow = {
  id: string;
  action: string;
  details: Record<string, unknown> | null;
  ip_address: string | null;
  created_at: string;
  user: { full_name: string }[] | null;
  tenant: { name: string }[] | null;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatDetails(details: Record<string, unknown> | null) {
  if (!details) return "-";
  try {
    return JSON.stringify(details);
  } catch {
    return "-";
  }
}

function firstOrNull<T>(value: T[] | null | undefined) {
  return value && value.length > 0 ? value[0] : null;
}

export default async function IslemGecmisiPage() {
  const { data } = await supabaseAdmin
    .from("audit_logs")
    .select(
      "id, action, details, ip_address, created_at, user:users(full_name), tenant:tenants(name)"
    )
    .order("created_at", { ascending: false });

  const logs = (data ?? []) as AuditLogRow[];

  return (
    <section className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold">Islem Gecmisi</h1>
        <p className="sf-muted mt-1 text-sm">
          Platform genelindeki tum denetim kayitlari.
        </p>
      </header>

      <div className="sf-card overflow-x-auto rounded-2xl">
        <table className="w-full min-w-[1200px] text-left text-sm">
          <thead>
            <tr className="sf-panel">
              <th className="p-3 font-medium">Kullanici</th>
              <th className="p-3 font-medium">Firma</th>
              <th className="p-3 font-medium">Islem</th>
              <th className="p-3 font-medium">Detay</th>
              <th className="p-3 font-medium">IP</th>
              <th className="p-3 font-medium">Tarih</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr
                key={log.id}
                className="border-t"
                style={{ borderColor: "var(--color-border)" }}
              >
                <td className="p-3">{firstOrNull(log.user)?.full_name ?? "-"}</td>
                <td className="p-3">{firstOrNull(log.tenant)?.name ?? "-"}</td>
                <td className="p-3 font-medium">{log.action}</td>
                <td className="p-3">
                  <code className="sf-muted text-xs">{formatDetails(log.details)}</code>
                </td>
                <td className="p-3">{log.ip_address ?? "-"}</td>
                <td className="p-3">{formatDate(log.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
