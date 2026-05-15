import { supabaseAdmin } from "@/lib/supabase-admin";

type TenantRow = {
  id: string;
  name: string;
  logo_url: string | null;
  contract_end: string;
};

type AdminUserRow = {
  tenant_id: string;
  full_name: string;
  phone: string | null;
};

function kalanGun(contractEnd: string) {
  const end = new Date(contractEnd);
  const now = new Date();
  const ms = end.getTime() - now.getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export default async function FirmalarPage() {
  const [{ data: tenants }, { data: superAdmins }] = await Promise.all([
    supabaseAdmin
      .from("tenants")
      .select("id, name, logo_url, contract_end")
      .order("created_at", { ascending: false }),
    supabaseAdmin
      .from("users")
      .select("tenant_id, full_name, phone")
      .eq("role", "SUPERADMIN"),
  ]);

  const adminByTenant = new Map<string, AdminUserRow>();
  (superAdmins as AdminUserRow[] | null)?.forEach((user) => {
    if (!adminByTenant.has(user.tenant_id)) {
      adminByTenant.set(user.tenant_id, user);
    }
  });

  return (
    <section className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold">Firma Listesi</h1>
        <p className="sf-muted mt-1 text-sm">
          Tum tenant firmalar ve sozlesme durumlari.
        </p>
      </header>

      <div className="sf-card overflow-x-auto rounded-2xl">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="sf-panel">
              <th className="p-3 font-medium">Logo</th>
              <th className="p-3 font-medium">Firma Adi</th>
              <th className="p-3 font-medium">Yetkili</th>
              <th className="p-3 font-medium">Telefon</th>
              <th className="p-3 font-medium">Kalan Sure (Gun)</th>
              <th className="p-3 font-medium">Durum</th>
            </tr>
          </thead>
          <tbody>
            {(tenants as TenantRow[] | null)?.map((tenant) => {
              const admin = adminByTenant.get(tenant.id);
              const days = kalanGun(tenant.contract_end);
              const isActive = days >= 0;
              return (
                <tr key={tenant.id} className="sf-border-t">
                  <td className="p-3">
                    {tenant.logo_url ? (
                      <img
                        src={tenant.logo_url}
                        alt={`${tenant.name} logo`}
                        className="h-9 w-9 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="sf-btn-secondary h-9 w-9 rounded-lg text-center leading-9">
                        {tenant.name.slice(0, 1).toUpperCase()}
                      </div>
                    )}
                  </td>
                  <td className="p-3 font-medium">{tenant.name}</td>
                  <td className="p-3">{admin?.full_name ?? "-"}</td>
                  <td className="p-3">{admin?.phone ?? "-"}</td>
                  <td className="p-3">{days}</td>
                  <td className="p-3">
                    <select className="sf-input py-2">
                      <option value="AKTIF" selected={isActive}>
                        Aktif
                      </option>
                      <option value="IPTAL" selected={!isActive}>
                        Iptal
                      </option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
