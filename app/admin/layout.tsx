import { ResponsiveSidebarShell } from "@/components/responsive-sidebar-shell";
import { requireSuperAdmin } from "@/lib/admin-auth";

const menuItems = [
  { href: "/admin/firmalar", label: "Firmalar" },
  { href: "/admin/yeni-firma", label: "Yeni Firma" },
  { href: "/admin/kullanicilar", label: "Kullanicilar" },
  { href: "/admin/islem-gecmisi", label: "Islem Gecmisi" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireSuperAdmin();

  return (
    <ResponsiveSidebarShell
      brandTitle="SunFusion"
      brandSubtitle="SuperAdmin Panel"
      menuItems={menuItems}
    >
      {children}
    </ResponsiveSidebarShell>
  );
}
