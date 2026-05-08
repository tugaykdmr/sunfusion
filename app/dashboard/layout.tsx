import Link from "next/link";
import { requireDashboardContext } from "@/lib/dashboard-auth";
import type { Module } from "@/lib/types";

const moduleMenuMap: Record<Module, { label: string; href: string }> = {
  SOLAR_OM: { label: "Solar O&M", href: "/dashboard/solar-om" },
  SOLAR_DENETIM: { label: "Solar Denetim", href: "/dashboard/solar-denetim" },
  BESS_OM: { label: "BESS O&M", href: "/dashboard/bess-om" },
  BESS_DENETIM: { label: "BESS Denetim", href: "/dashboard/bess-denetim" },
  SOLAR_KESIF: { label: "Solar Kesif", href: "/dashboard/solar-kesif" },
  TRAFO_BAKIM: { label: "Trafo Bakim", href: "/dashboard/trafo-bakim" },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const context = await requireDashboardContext();
  const dynamicModules = context.tenant.active_modules
    .map((moduleKey) => moduleMenuMap[moduleKey])
    .filter(Boolean);

  return (
    <div className="sf-shell min-h-screen">
      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 gap-4 p-4 md:grid-cols-[260px_1fr]">
        <aside className="sf-panel rounded-2xl p-5">
          <div className="mb-8 flex items-center gap-3">
            <div className="sf-btn-primary h-10 w-10 rounded-xl text-center leading-10">
              S
            </div>
            <div>
              <p className="text-lg font-semibold">SunFusion</p>
              <p className="sf-muted text-xs">Alt Firma Paneli</p>
            </div>
          </div>

          <nav className="flex flex-col gap-2">
            <Link
              href="/dashboard"
              className="sf-btn-secondary px-4 py-3 text-sm font-medium transition hover:opacity-90"
            >
              Genel Bakis
            </Link>
            {dynamicModules.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="sf-btn-secondary px-4 py-3 text-sm font-medium transition hover:opacity-90"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/dashboard/kullanici-yonetimi"
              className="sf-btn-secondary px-4 py-3 text-sm font-medium transition hover:opacity-90"
            >
              Kullanici Yonetimi
            </Link>
          </nav>
        </aside>

        <main className="sf-panel rounded-2xl p-5 md:p-6">
          <header
            className="mb-5 flex flex-col justify-between gap-3 rounded-xl border p-4 md:flex-row md:items-center"
            style={{ borderColor: "var(--color-border)" }}
          >
            <div>
              <p className="sf-muted text-xs">Firma</p>
              <p className="font-semibold">{context.tenant.name}</p>
            </div>
            <div className="text-left md:text-right">
              <p className="sf-muted text-xs">Kullanici</p>
              <p className="font-semibold">{context.user.full_name}</p>
            </div>
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}
