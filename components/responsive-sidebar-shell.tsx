"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export type SidebarMenuItem = {
  href: string;
  label: string;
};

type ResponsiveSidebarShellProps = {
  brandTitle: string;
  brandSubtitle: string;
  menuItems: SidebarMenuItem[];
  children: React.ReactNode;
  header?: React.ReactNode;
};

function SidebarContent({
  brandTitle,
  brandSubtitle,
  menuItems,
  onNavigate,
  onClose,
  showClose,
}: {
  brandTitle: string;
  brandSubtitle: string;
  menuItems: SidebarMenuItem[];
  onNavigate: () => void;
  onClose: () => void;
  showClose: boolean;
}) {
  return (
    <>
      <div className="mb-8 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="sf-btn-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-semibold">
            S
          </div>
          <div>
            <p className="text-lg font-semibold">{brandTitle}</p>
            <p className="sf-muted text-xs">{brandSubtitle}</p>
          </div>
        </div>
        {showClose ? (
          <button
            type="button"
            onClick={onClose}
            className="sf-btn-secondary flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-lg leading-none"
            aria-label="Menüyü kapat"
          >
            ×
          </button>
        ) : null}
      </div>

      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className="sf-btn-secondary px-4 py-3 text-sm font-medium transition hover:opacity-90"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </>
  );
}

export function ResponsiveSidebarShell({
  brandTitle,
  brandSubtitle,
  menuItems,
  children,
  header,
}: ResponsiveSidebarShellProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  return (
    <div className="sf-shell min-h-screen">
      {/* Mobil header */}
      <header className="flex items-center px-4 py-3 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="sf-btn-secondary flex h-10 w-10 items-center justify-center rounded-xl text-xl leading-none"
          aria-label="Menüyü aç"
          aria-expanded={open}
        >
          ☰
        </button>
        <p className="flex-1 text-center text-xl font-semibold">{brandTitle}</p>
        <div className="h-10 w-10" aria-hidden />
      </header>

      {/* Masaüstü sidebar */}
      <aside className="sf-panel fixed inset-y-0 left-0 z-40 hidden h-full w-64 flex-col p-5 lg:flex">
        <SidebarContent
          brandTitle={brandTitle}
          brandSubtitle={brandSubtitle}
          menuItems={menuItems}
          onNavigate={() => {}}
          onClose={() => setOpen(false)}
          showClose={false}
        />
      </aside>

      {/* Mobil overlay sidebar */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          open ? "visible" : "invisible pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        {open ? (
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Menüyü kapat"
            onClick={() => setOpen(false)}
          />
        ) : null}

        <aside
          className={`sf-panel fixed inset-y-0 left-0 flex h-full w-64 flex-col p-5 shadow-xl transition-transform duration-300 ease-out ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <SidebarContent
            brandTitle={brandTitle}
            brandSubtitle={brandSubtitle}
            menuItems={menuItems}
            onNavigate={() => setOpen(false)}
            onClose={() => setOpen(false)}
            showClose
          />
        </aside>
      </div>

      {/* Ana içerik */}
      <main className="min-h-screen p-4 lg:ml-64">
        <div className="sf-panel rounded-2xl p-5 md:p-6">
          {header}
          {children}
        </div>
      </main>
    </div>
  );
}
