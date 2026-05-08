const stats = [
  { label: "Toplam Santral", value: "28" },
  { label: "Aktif Santral", value: "24" },
  { label: "Bu Ay Bakim", value: "11" },
  { label: "Acik Ariza", value: "3" },
];

const plantRows = [
  {
    name: "Sungun GES-1",
    location: "Konya",
    powerKw: 5400,
    lastMaintenance: "2026-05-01",
    status: "Aktif",
    action: "Detay",
  },
  {
    name: "Akasya GES-2",
    location: "Antalya",
    powerKw: 3200,
    lastMaintenance: "2026-04-18",
    status: "Bakimda",
    action: "Duzenle",
  },
  {
    name: "Cinar GES-3",
    location: "Ankara",
    powerKw: 2700,
    lastMaintenance: "2026-03-29",
    status: "Aktif",
    action: "Detay",
  },
];

const upcomingRows = [
  {
    plant: "Sungun GES-1",
    type: "Panel Termal Kontrol",
    plannedDate: "2026-05-16",
    owner: "E. Kara",
  },
  {
    plant: "Akasya GES-2",
    type: "Inverter Bakimi",
    plannedDate: "2026-05-19",
    owner: "B. Demir",
  },
  {
    plant: "Cinar GES-3",
    type: "String Testi",
    plannedDate: "2026-05-22",
    owner: "S. Yildiz",
  },
];

export default function SolarOmPage() {
  return (
    <section className="space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Gunes Enerjisi Isletme ve Bakim</h1>
          <p className="sf-muted mt-1 text-sm">
            Santral performansi, bakim takibi ve ariza yonetimi.
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
        <h2 className="text-lg font-semibold">Santral Listesi</h2>
        <div className="sf-card overflow-x-auto rounded-2xl">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="sf-panel">
                <th className="p-3 font-medium">Santral Adi</th>
                <th className="p-3 font-medium">Konum</th>
                <th className="p-3 font-medium">Kurulu Guc (kW)</th>
                <th className="p-3 font-medium">Son Bakim Tarihi</th>
                <th className="p-3 font-medium">Durum</th>
                <th className="p-3 font-medium">Islemler</th>
              </tr>
            </thead>
            <tbody>
              {plantRows.map((row) => (
                <tr key={row.name} className="border-t" style={{ borderColor: "var(--color-border)" }}>
                  <td className="p-3 font-medium">{row.name}</td>
                  <td className="p-3">{row.location}</td>
                  <td className="p-3">{row.powerKw}</td>
                  <td className="p-3">{row.lastMaintenance}</td>
                  <td className="p-3">{row.status}</td>
                  <td className="p-3">{row.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      <article className="space-y-3">
        <h2 className="text-lg font-semibold">Yaklasan Bakimlar</h2>
        <div className="sf-card overflow-x-auto rounded-2xl">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead>
              <tr className="sf-panel">
                <th className="p-3 font-medium">Santral</th>
                <th className="p-3 font-medium">Bakim Tipi</th>
                <th className="p-3 font-medium">Planlanan Tarih</th>
                <th className="p-3 font-medium">Sorumlu</th>
              </tr>
            </thead>
            <tbody>
              {upcomingRows.map((row) => (
                <tr key={`${row.plant}-${row.type}`} className="border-t" style={{ borderColor: "var(--color-border)" }}>
                  <td className="p-3 font-medium">{row.plant}</td>
                  <td className="p-3">{row.type}</td>
                  <td className="p-3">{row.plannedDate}</td>
                  <td className="p-3">{row.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
