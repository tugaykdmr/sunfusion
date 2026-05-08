import { supabaseAdmin } from "@/lib/supabase-admin";

function getActiveFirmCount(contractEndDates: string[]) {
  const now = new Date();
  return contractEndDates.filter((date) => new Date(date) >= now).length;
}

export default async function AdminDashboardPage() {
  const [{ count: totalFirmalar }, { data: tenantDates }, { count: totalUsers }] =
    await Promise.all([
      supabaseAdmin
        .from("tenants")
        .select("id", { count: "exact", head: true }),
      supabaseAdmin.from("tenants").select("contract_end"),
      supabaseAdmin.from("users").select("id", { count: "exact", head: true }),
    ]);

  const activeFirmalar = getActiveFirmCount(
    (tenantDates ?? []).map((item) => item.contract_end)
  );

  const stats = [
    { label: "Toplam Firma", value: totalFirmalar ?? 0 },
    { label: "Aktif Firma", value: activeFirmalar },
    { label: "Toplam Kullanici", value: totalUsers ?? 0 },
  ];

  return (
    <section className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold">Yonetim Ozeti</h1>
        <p className="sf-muted mt-1 text-sm">
          SunFusion platformunun anlik genel durumu.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <article key={stat.label} className="sf-card rounded-2xl p-5">
            <p className="sf-muted text-sm">{stat.label}</p>
            <p className="mt-2 text-3xl font-semibold">{stat.value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
