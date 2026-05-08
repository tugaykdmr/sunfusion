import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";

const modules = [
  { key: "SOLAR_OM", label: "Solar O&M" },
  { key: "SOLAR_DENETIM", label: "Solar Denetim" },
  { key: "BESS_OM", label: "BESS O&M" },
  { key: "BESS_DENETIM", label: "BESS Denetim" },
  { key: "SOLAR_KESIF", label: "Solar Kesif" },
  { key: "TRAFO_BAKIM", label: "Trafo Bakim" },
] as const;

const languages = [
  { key: "tr", label: "TR" },
  { key: "en", label: "EN" },
  { key: "fr", label: "FR" },
] as const;

async function createCompany(formData: FormData) {
  "use server";

  const firmaAdi = String(formData.get("firma_adi") ?? "").trim();
  const vergiNo = String(formData.get("vergi_no") ?? "").trim();
  const firmaTelefon = String(formData.get("firma_telefon") ?? "").trim();
  const firmaEmail = String(formData.get("firma_email") ?? "").trim();
  const baslangic = String(formData.get("contract_start") ?? "").trim();
  const bitis = String(formData.get("contract_end") ?? "").trim();
  const personelSayisi = String(formData.get("personel_sayisi") ?? "").trim();
  const sozlesmeFiyati = String(formData.get("sozlesme_fiyati") ?? "").trim();
  const superAdminAdSoyad = String(formData.get("superadmin_full_name") ?? "").trim();
  const superAdminUsername = String(formData.get("superadmin_username") ?? "").trim();
  const superAdminSifre = String(formData.get("superadmin_password") ?? "").trim();

  if (
    !firmaAdi ||
    !baslangic ||
    !bitis ||
    !superAdminAdSoyad ||
    !superAdminUsername ||
    !superAdminSifre
  ) {
    redirect("/admin/yeni-firma?error=Zorunlu alanlari doldurun.");
  }

  const selectedModules = formData
    .getAll("active_modules")
    .map((value) => String(value));
  const selectedLanguages = formData
    .getAll("supported_languages")
    .map((value) => String(value));

  let logoUrl: string | null = null;
  const logoFile = formData.get("logo_file");
  if (logoFile && logoFile instanceof File && logoFile.size > 0) {
    const fileExt = logoFile.name.split(".").pop() ?? "png";
    const fileName = `tenant-${Date.now()}.${fileExt}`;
    const fileBuffer = await logoFile.arrayBuffer();

    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from("tenant-logos")
      .upload(fileName, fileBuffer, {
        contentType: logoFile.type || "image/png",
        upsert: false,
      });

    if (!uploadError && uploadData?.path) {
      const {
        data: { publicUrl },
      } = supabaseAdmin.storage.from("tenant-logos").getPublicUrl(uploadData.path);
      logoUrl = publicUrl;
    }
  }

  const themePayload = JSON.stringify({
    vergi_no: vergiNo,
    firma_telefon: firmaTelefon,
    firma_email: firmaEmail,
    personel_sayisi: personelSayisi,
    sozlesme_fiyati: sozlesmeFiyati,
  });

  const { data: tenant, error: tenantError } = await supabaseAdmin
    .from("tenants")
    .insert({
      name: firmaAdi,
      logo_url: logoUrl,
      contract_start: baslangic,
      contract_end: bitis,
      active_modules: selectedModules,
      supported_languages: selectedLanguages.length > 0 ? selectedLanguages : ["tr"],
      theme: themePayload,
    })
    .select("id")
    .single();

  if (tenantError || !tenant) {
    redirect("/admin/yeni-firma?error=Firma olusturulamadi.");
  }

  const passwordHash = await hash(superAdminSifre, 10);
  const { error: userError } = await supabaseAdmin.from("users").insert({
    tenant_id: tenant.id,
    full_name: superAdminAdSoyad,
    username: superAdminUsername,
    password_hash: passwordHash,
    email: firmaEmail || `${superAdminUsername}@sunfusion.local`,
    phone: firmaTelefon || null,
    role: "SUPERADMIN",
    unit: "Yonetim",
    title: "Firma SuperAdmin",
  });

  if (userError) {
    redirect("/admin/yeni-firma?error=SuperAdmin kullanicisi olusturulamadi.");
  }

  await supabaseAdmin.from("audit_logs").insert({
    tenant_id: tenant.id,
    action: "TENANT_CREATED",
    details: {
      firma_adi: firmaAdi,
      created_from: "superadmin_panel",
    },
    ip_address: null,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/firmalar");
  redirect("/admin/firmalar?success=Firma basariyla eklendi.");
}

export default async function YeniFirmaPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <section className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold">Yeni Firma Ekle</h1>
        <p className="sf-muted mt-1 text-sm">
          Firma, moduller ve super admin hesabi tek adimda olusturulur.
        </p>
      </header>

      {error ? (
        <p
          className="rounded-xl px-4 py-3 text-sm"
          style={{
            border: "1px solid var(--color-danger)",
            color: "var(--color-danger)",
            background: "var(--color-bg-primary)",
          }}
        >
          {error}
        </p>
      ) : null}

      <form action={createCompany} className="space-y-6">
        <div className="sf-card grid gap-4 rounded-2xl p-5 md:grid-cols-2">
          <label className="space-y-2 text-sm">
            <span>Firma Adi *</span>
            <input className="sf-input" name="firma_adi" required />
          </label>
          <label className="space-y-2 text-sm">
            <span>Vergi No</span>
            <input className="sf-input" name="vergi_no" />
          </label>
          <label className="space-y-2 text-sm">
            <span>Telefon</span>
            <input className="sf-input" name="firma_telefon" />
          </label>
          <label className="space-y-2 text-sm">
            <span>Email</span>
            <input className="sf-input" name="firma_email" type="email" />
          </label>
          <label className="space-y-2 text-sm">
            <span>Baslangic Tarihi *</span>
            <input className="sf-input" name="contract_start" type="date" required />
          </label>
          <label className="space-y-2 text-sm">
            <span>Bitis Tarihi *</span>
            <input className="sf-input" name="contract_end" type="date" required />
          </label>
          <label className="space-y-2 text-sm">
            <span>Personel Sayisi</span>
            <input className="sf-input" name="personel_sayisi" type="number" min="1" />
          </label>
          <label className="space-y-2 text-sm">
            <span>Sozlesme Fiyati</span>
            <input className="sf-input" name="sozlesme_fiyati" />
          </label>
          <label className="space-y-2 text-sm md:col-span-2">
            <span>Logo Yukleme</span>
            <input className="sf-input" name="logo_file" type="file" accept="image/*" />
          </label>
        </div>

        <div className="sf-card rounded-2xl p-5">
          <p className="mb-3 text-sm font-medium">Aktif Moduller</p>
          <div className="grid gap-2 md:grid-cols-3">
            {modules.map((module) => (
              <label key={module.key} className="sf-btn-secondary flex items-center gap-2 px-3 py-2 text-sm">
                <input type="checkbox" name="active_modules" value={module.key} />
                <span>{module.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="sf-card rounded-2xl p-5">
          <p className="mb-3 text-sm font-medium">Desteklenen Diller</p>
          <div className="flex flex-wrap gap-2">
            {languages.map((language) => (
              <label key={language.key} className="sf-btn-secondary flex items-center gap-2 px-3 py-2 text-sm">
                <input type="checkbox" name="supported_languages" value={language.key} />
                <span>{language.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="sf-card grid gap-4 rounded-2xl p-5 md:grid-cols-3">
          <h2 className="md:col-span-3 text-lg font-semibold">Firma SuperAdmin Bilgileri</h2>
          <label className="space-y-2 text-sm">
            <span>Ad Soyad *</span>
            <input className="sf-input" name="superadmin_full_name" required />
          </label>
          <label className="space-y-2 text-sm">
            <span>Kullanici Adi *</span>
            <input className="sf-input" name="superadmin_username" required />
          </label>
          <label className="space-y-2 text-sm">
            <span>Sifre *</span>
            <input className="sf-input" name="superadmin_password" type="password" required />
          </label>
        </div>

        <button type="submit" className="sf-btn-primary px-5 py-3 text-sm font-semibold">
          Firmayi Kaydet
        </button>
      </form>
    </section>
  );
}
