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

function HamburgerIcon() {
  return (
    <svg
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function BrandBlock({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="sf-btn-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-semibold">
        S
      </div>
      <div>
        <p className="text-lg font-semibold">{title}</p>
        <p className="sf-muted text-xs">{subtitle}</p>
      </div>
    </div>
  );
}

function SidebarNav({
  items,
  onNavigate,
}: {
  items: SidebarMenuItem[];
  onNavigate: () => void;
}) {
  return (
    <nav className="flex flex-col gap-2">
      {items.map((item) => (
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
  );
}

export function ResponsiveSidebarShell({
  brandTitle,
  brandSubtitle,
  menuItems,
  children,
  header,
}: ResponsiveSidebarShellProps) {
  const [isOpen, setIsOpen] = useState(false);

  const closeSidebar = () => setIsOpen(false);
  const openSidebar = () => setIsOpen(true);

  useEffect(() => {
    if (!isOpen) return;

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeSidebar();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onEscape);
    };
  }, [isOpen]);

  return (
    <div className="sf-shell min-h-screen">
      <div className="mx-auto min-h-screen max-w-7xl p-4">
        {/* Mobil üst bar: yalnızca SunFusion + hamburger */}
        <div className="mb-4 flex items-center justify-between lg:hidden">
          <p className="text-xl font-semibold">{brandTitle}</p>
          <button
            type="button"
            onClick={openSidebar}
            className="sf-btn-secondary flex h-10 w-10 items-center justify-center rounded-xl"
            aria-label="Menüyü aç"
            aria-expanded={isOpen}
          >
            <HamburgerIcon />
          </button>
        </div>

        <div className="flex gap-4">
          {/* Masaüstü sidebar — lg ve üzeri */}
          <aside className="sf-panel hidden w-[260px] shrink-0 flex-col rounded-2xl p-5 lg:flex">
            <div className="mb-8">
              <BrandBlock title={brandTitle} subtitle={brandSubtitle} />
            </div>
            <SidebarNav items={menuItems} onNavigate={() => {}} />
          </aside>

          {/* Mobil drawer — lg altı, slide-in */}
          <div
            className={`fixed inset-0 z-50 lg:hidden ${
              isOpen
                ? "visible pointer-events-auto"
                : "invisible pointer-events-none"
            }`}
            aria-hidden={!isOpen}
          >
            <button
              type="button"
              className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${
                isOpen ? "opacity-100" : "opacity-0"
              }`}
              aria-label="Menüyü kapat"
              onClick={closeSidebar}
              tabIndex={isOpen ? 0 : -1}
            />

            <aside
              className={`sf-panel absolute inset-y-0 left-0 flex h-full w-[min(280px,85vw)] flex-col rounded-none rounded-r-2xl p-5 shadow-xl transition-transform duration-300 ease-out ${
                isOpen ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <div className="mb-6 flex items-center justify-between gap-3">
                <BrandBlock title={brandTitle} subtitle={brandSubtitle} />
                <button
                  type="button"
                  onClick={closeSidebar}
                  className="sf-btn-secondary flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                  aria-label="Menüyü kapat"
                >
                  <CloseIcon />
                </button>
              </div>
              <SidebarNav items={menuItems} onNavigate={closeSidebar} />
            </aside>
          </div>

          <main className="sf-panel min-w-0 flex-1 rounded-2xl p-5 md:p-6">
            {header}
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
