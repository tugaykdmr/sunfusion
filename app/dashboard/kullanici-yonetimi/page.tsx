import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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

const roleOptions = [
  { value: "MUDUR", label: "Mudur" },
  { value: "YONETICI", label: "Yonetici" },
  { value: "KULLANICI", label: "Kullanici" },
  { value: "GOZLEMCI", label: "Gozlemci" },
] as const;

const permissions = [
  "Proje Olusturma",
  "Proje Analiz",
  "Rapor Olusturma",
  "Rapor Goruntuleme",
  "Proje Silme",
  "Rapor Silme",
] as const;

async function createTenantUser(formData: FormData) {
  "use server";
  const context = await requireDashboardContext();

  const fullName = String(formData.get("full_name") ?? "").trim();
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();
  const unit = String(formData.get("unit") ?? "").trim();

  const selectedPermissions = formData
    .getAll("permissions")
    .map((value) => String(value));

  const allowedRoles = roleOptions.map((item) => item.value);
  const allowedUnits = context.tenant.active_modules.map(
    (moduleKey) => moduleLabelMap[moduleKey]
  );

  if (!fullName || !username || !password || !email) {
    redirect("/dashboard/kullanici-yonetimi?error=Zorunlu alanlari doldurun.");
  }

  if (!allowedRoles.includes(role as (typeof roleOptions)[number]["value"])) {
    redirect("/dashboard/kullanici-yonetimi?error=Gecersiz rol secimi.");
  }

  if (unit && !allowedUnits.includes(unit)) {
    redirect("/dashboard/kullanici-yonetimi?error=Gecersiz birim secimi.");
  }

  const passwordHash = await hash(password, 10);
  const { data: createdUser, error: userError } = await supabaseAdmin
    .from("users")
    .insert({
      tenant_id: context.tenant.id,
      full_name: fullName,
      username,
      password_hash: passwordHash,
      email,
      phone: phone || null,
      role,
      unit: unit || null,
      title: unit || null,
    })
    .select("id")
    .single();

  if (userError || !createdUser) {
    redirect("/dashboard/kullanici-yonetimi?error=Kullanici olusturulamadi.");
  }

  if (selectedPermissions.length > 0) {
    const permissionRows = selectedPermissions.map((permissionName) => ({
      user_id: createdUser.id,
      permission_name: permissionName,
    }));

    await supabaseAdmin.from("user_permissions").insert(permissionRows);
  }

  await supabaseAdmin.from("audit_logs").insert({
    user_id: context.user.id,
    tenant_id: context.tenant.id,
    action: "TENANT_USER_CREATED",
    details: { username, role },
    ip_address: null,
  });

  revalidatePath("/dashboard/kullanici-yonetimi");
  revalidatePath("/dashboard");
  redirect("/dashboard/kullanici-yonetimi?success=Kullanici eklendi.");
}

type UserRow = {
  id: string;
  full_name: string;
  username: string;
  phone: string | null;
  email: string;
  role: string;
  unit: string | null;
  title: string | null;
  user_permissions: { permission_name: string }[];
};

export default async function KullaniciYonetimiPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const context = await requireDashboardContext();
  const { error, success } = await searchParams;

  const { data: users } = await supabaseAdmin
    .from("users")
    .select(
      "id, full_name, username, phone, email, role, unit, title, user_permissions(permission_name)"
    )
    .eq("tenant_id", context.tenant.id)
    .order("created_at", { ascending: false });

  const tenantUsers = (users ?? []) as UserRow[];
  const unitOptions = context.tenant.active_modules.map(
    (moduleKey) => moduleLabelMap[moduleKey]
  );

  return (
    <section className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold">Kullanici Yonetimi</h1>
        <p className="sf-muted mt-1 text-sm">
          Sadece {context.tenant.name} kullanicilarini goruntuler ve yonetir.
        </p>
      </header>

      {error ? (
        <p className="sf-alert-danger rounded-xl px-4 py-3 text-sm">
          {error}
        </p>
      ) : null}

      {success ? (
        <p className="sf-alert-success rounded-xl px-4 py-3 text-sm">
          {success}
        </p>
      ) : null}

      <form action={createTenantUser} className="sf-card grid gap-4 rounded-2xl p-5 md:grid-cols-2">
        <label className="space-y-2 text-sm">
          <span>Ad Soyad *</span>
          <input className="sf-input" name="full_name" required />
        </label>
        <label className="space-y-2 text-sm">
          <span>Kullanici Adi *</span>
          <input className="sf-input" name="username" required />
        </label>
        <label className="space-y-2 text-sm">
          <span>Sifre *</span>
          <input className="sf-input" name="password" type="password" required />
        </label>
        <label className="space-y-2 text-sm">
          <span>Telefon</span>
          <input className="sf-input" name="phone" />
        </label>
        <label className="space-y-2 text-sm">
          <span>E-posta *</span>
          <input className="sf-input" name="email" type="email" required />
        </label>
        <label className="space-y-2 text-sm">
          <span>Rol</span>
          <select className="sf-input" name="role" defaultValue="KULLANICI">
            {roleOptions.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-sm md:col-span-2">
          <span>Birim</span>
          <select className="sf-input" name="unit" defaultValue="">
            <option value="">Birim Secin</option>
            {unitOptions.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </label>

        <div className="md:col-span-2">
          <p className="mb-2 text-sm font-medium">Granuler Yetkiler</p>
          <div className="grid gap-2 md:grid-cols-3">
            {permissions.map((permission) => (
              <label
                key={permission}
                className="sf-btn-secondary flex items-center gap-2 px-3 py-2 text-sm"
              >
                <input type="checkbox" name="permissions" value={permission} />
                <span>{permission}</span>
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className="sf-btn-primary px-5 py-3 text-sm font-semibold md:col-span-2">
          Kullaniciyi Kaydet
        </button>
      </form>

      <div className="sf-card overflow-x-auto rounded-2xl">
        <table className="w-full min-w-[1200px] text-left text-sm">
          <thead>
            <tr className="sf-panel">
              <th className="p-3 font-medium">Ad Soyad</th>
              <th className="p-3 font-medium">Kullanici Adi</th>
              <th className="p-3 font-medium">Birim</th>
              <th className="p-3 font-medium">Unvan</th>
              <th className="p-3 font-medium">Rol</th>
              <th className="p-3 font-medium">Telefon</th>
              <th className="p-3 font-medium">E-posta</th>
              <th className="p-3 font-medium">Yetkiler</th>
            </tr>
          </thead>
          <tbody>
            {tenantUsers.map((user) => (
              <tr key={user.id} className="sf-border-t">
                <td className="p-3 font-medium">{user.full_name}</td>
                <td className="p-3">{user.username}</td>
                <td className="p-3">{user.unit ?? "-"}</td>
                <td className="p-3">{user.title ?? "-"}</td>
                <td className="p-3">{user.role}</td>
                <td className="p-3">{user.phone ?? "-"}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">
                  {(user.user_permissions ?? []).map((item) => item.permission_name).join(", ") || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
