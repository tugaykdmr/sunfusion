import { requireDashboardContext } from "@/lib/dashboard-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { Module } from "@/lib/types";

const moduleLabelMap: Record<Module, string> = {
  SOLAR_OM: "Solar O&M",
  SOLAR_DENETIM: "Solar Denetim",
  BESS_OM: "BESS O&M",
  BESS_DENETIM: "BESS Denetim",
  SOLAR_KESIF: "Solar Kesif",
  TRAFO_BAKIM: "Trafo Bakim",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function TenantDashboardPage() {
  const context = await requireDashboardContext();

  const { data: recentLogs } = await supabaseAdmin
    .from("audit_logs")
    .select("id, action, created_at")
    .eq("tenant_id", context.tenant.id)
    .order("created_at", { ascending: false })
    .limit(6);

  return (
    <section className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold">
          Hos geldin, {context.user.full_name}
        </h1>
        <p className="sf-muted mt-1 text-sm">
          {context.tenant.name} icin operasyon ozetini buradan takip edebilirsin.
        </p>
      </header>

      <article className="sf-card rounded-2xl p-5">
        <h2 className="text-lg font-semibold">Aktif Moduller</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {context.tenant.active_modules.length === 0 ? (
            <p className="sf-muted text-sm">Bu tenant icin aktif modul bulunamadi.</p>
          ) : (
            context.tenant.active_modules.map((moduleKey) => (
              <span key={moduleKey} className="sf-chip rounded-lg px-3 py-2 text-sm">
                {moduleLabelMap[moduleKey]}
              </span>
            ))
          )}
        </div>
      </article>

      <article className="sf-card rounded-2xl p-5">
        <h2 className="text-lg font-semibold">Son Islemler</h2>
        <div className="mt-3 space-y-2">
          {(recentLogs ?? []).length === 0 ? (
            <p className="sf-muted text-sm">Henuz islem kaydi bulunmuyor.</p>
          ) : (
            recentLogs?.map((log) => (
              <div
                key={log.id}
                className="sf-header-bar flex items-center justify-between rounded-lg px-3 py-2 text-sm"
              >
                <span>{log.action}</span>
                <span className="sf-muted">{formatDate(log.created_at)}</span>
              </div>
            ))
          )}
        </div>
      </article>
    </section>
  );
}
