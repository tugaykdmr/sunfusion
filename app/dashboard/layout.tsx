import { ResponsiveSidebarShell } from "@/components/responsive-sidebar-shell";
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

  const menuItems = [
    { href: "/dashboard", label: "Genel Bakis" },
    ...dynamicModules,
    { href: "/dashboard/kullanici-yonetimi", label: "Kullanici Yonetimi" },
  ];

  return (
    <ResponsiveSidebarShell
      brandTitle="SunFusion"
      brandSubtitle="Alt Firma Paneli"
      menuItems={menuItems}
      header={
        <header className="sf-header-bar mb-5 flex flex-col justify-between gap-3 rounded-xl p-4 md:flex-row md:items-center">
          <div>
            <p className="sf-muted text-xs">Firma</p>
            <p className="font-semibold">{context.tenant.name}</p>
          </div>
          <div className="text-left md:text-right">
            <p className="sf-muted text-xs">Kullanici</p>
            <p className="font-semibold">{context.user.full_name}</p>
          </div>
        </header>
      }
    >
      {children}
    </ResponsiveSidebarShell>
  );
}
