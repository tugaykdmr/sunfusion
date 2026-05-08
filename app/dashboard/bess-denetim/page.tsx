const stats = [
  { label: "Toplam Denetim", value: "67" },
  { label: "Bu Ay", value: "9" },
  { label: "Tamamlanan", value: "52" },
  { label: "Bekleyen", value: "15" },
];

const rows = [
  {
    project: "Marmara BESS Guvenlik",
    system: "BESS Marmara-02",
    date: "2026-05-04",
    auditor: "F. Sarikaya",
    status: "Tamamlandi",
    report: "PDF",
  },
  {
    project: "Kuzey BESS Thermal",
    system: "BESS Kuzey-01",
    date: "2026-05-09",
    auditor: "C. Uysal",
    status: "Bekliyor",
    report: "-",
  },
  {
    project: "IcAnadolu BESS EMS",
    system: "BESS IcAnadolu-03",
    date: "2026-05-12",
    auditor: "N. Taskin",
    status: "Planlandi",
    report: "-",
  },
];

export default function BessDenetimPage() {
  return (
    <section className="space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">BESS Denetim</h1>
          <p className="sf-muted mt-1 text-sm">
            BESS sistemleri icin denetim planlari, kontrol sonuclari ve raporlar.
          </p>
        </div>
        <button className="sf-btn-primary px-4 py-2 text-sm font-semibold">Yeni Ekle</button>
      </header>

      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((item) => (
          <article key={item.label} className="sf-card rounded-2xl p-5">
            <p className="sf-muted text-sm">{item.label}</p>
            <p className="mt-2 text-3xl font-semibold">{item.value}</p>
          </article>
        ))}
      </div>

      <article className="space-y-3">
        <h2 className="text-lg font-semibold">Denetim Listesi</h2>
        <div className="sf-card overflow-x-auto rounded-2xl">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="sf-panel">
                <th className="p-3 font-medium">Proje Adi</th>
                <th className="p-3 font-medium">BESS Sistem</th>
                <th className="p-3 font-medium">Denetim Tarihi</th>
                <th className="p-3 font-medium">Denetci</th>
                <th className="p-3 font-medium">Durum</th>
                <th className="p-3 font-medium">Rapor</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={`${row.project}-${row.date}`} className="border-t" style={{ borderColor: "var(--color-border)" }}>
                  <td className="p-3 font-medium">{row.project}</td>
                  <td className="p-3">{row.system}</td>
                  <td className="p-3">{row.date}</td>
                  <td className="p-3">{row.auditor}</td>
                  <td className="p-3">{row.status}</td>
                  <td className="p-3">{row.report}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
