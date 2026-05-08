import Link from "next/link";
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
    <div className="sf-shell min-h-screen">
      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 gap-4 p-4 md:grid-cols-[260px_1fr]">
        <aside className="sf-panel rounded-2xl p-5">
          <div className="mb-8 flex items-center gap-3">
            <div className="sf-btn-primary h-10 w-10 rounded-xl text-center leading-10">
              S
            </div>
            <div>
              <p className="text-lg font-semibold">SunFusion</p>
              <p className="sf-muted text-xs">SuperAdmin Panel</p>
            </div>
          </div>

          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="sf-btn-secondary px-4 py-3 text-sm font-medium transition hover:opacity-90"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="sf-panel rounded-2xl p-5 md:p-6">{children}</main>
      </div>
    </div>
  );
}
