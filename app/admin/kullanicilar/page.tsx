import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-admin";

type UserRow = {
  id: string;
  full_name: string;
  unit: string | null;
  title: string | null;
  role: string;
  phone: string | null;
  email: string;
  tenant: { name: string }[] | null;
};

function firstOrNull<T>(value: T[] | null | undefined) {
  return value && value.length > 0 ? value[0] : null;
}

async function deleteUser(formData: FormData) {
  "use server";
  const userId = String(formData.get("user_id") ?? "");
  if (!userId) return;

  await supabaseAdmin.from("users").delete().eq("id", userId);
  revalidatePath("/admin/kullanicilar");
  revalidatePath("/admin");
}

export default async function KullanicilarPage() {
  const { data } = await supabaseAdmin
    .from("users")
    .select(
      "id, full_name, unit, title, role, phone, email, tenant:tenants(name)"
    )
    .order("created_at", { ascending: false });

  const users = (data ?? []) as UserRow[];

  return (
    <section className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold">Kullanicilar</h1>
        <p className="sf-muted mt-1 text-sm">
          Tum firmalardaki kullanicilarin merkezi yonetimi.
        </p>
      </header>

      <div className="sf-card overflow-x-auto rounded-2xl">
        <table className="w-full min-w-[1200px] text-left text-sm">
          <thead>
            <tr className="sf-panel">
              <th className="p-3 font-medium">Ad Soyad</th>
              <th className="p-3 font-medium">Firma</th>
              <th className="p-3 font-medium">Birim</th>
              <th className="p-3 font-medium">Unvan</th>
              <th className="p-3 font-medium">Rol</th>
              <th className="p-3 font-medium">Telefon</th>
              <th className="p-3 font-medium">E-posta</th>
              <th className="p-3 font-medium">Islem</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-t"
                style={{ borderColor: "var(--color-border)" }}
              >
                <td className="p-3 font-medium">{user.full_name}</td>
                <td className="p-3">{firstOrNull(user.tenant)?.name ?? "-"}</td>
                <td className="p-3">{user.unit ?? "-"}</td>
                <td className="p-3">{user.title ?? "-"}</td>
                <td className="p-3">{user.role}</td>
                <td className="p-3">{user.phone ?? "-"}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">
                  <form action={deleteUser}>
                    <input type="hidden" name="user_id" value={user.id} />
                    <button
                      type="submit"
                      className="rounded-lg px-3 py-2 text-xs font-semibold"
                      style={{
                        border: "1px solid var(--color-danger)",
                        color: "var(--color-danger)",
                        background: "var(--color-bg-primary)",
                      }}
                    >
                      Sil
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
