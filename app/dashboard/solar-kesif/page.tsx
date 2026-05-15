const stats = [
  { label: "Toplam Kesif", value: "38" },
  { label: "Bu Ay", value: "7" },
  { label: "Onaylanan", value: "24" },
  { label: "Bekleyen", value: "14" },
];

const rows = [
  {
    project: "Aydin Tarla GES",
    location: "Aydin",
    area: 56000,
    estimatedCapacity: "7.2 MW",
    date: "2026-05-05",
    status: "Bekliyor",
  },
  {
    project: "Karaman Cati GES",
    location: "Karaman",
    area: 8300,
    estimatedCapacity: "1.1 MW",
    date: "2026-05-03",
    status: "Onaylandi",
  },
  {
    project: "Mersin Endustri GES",
    location: "Mersin",
    area: 12400,
    estimatedCapacity: "1.8 MW",
    date: "2026-05-09",
    status: "Analizde",
  },
];

export default function SolarKesifPage() {
  return (
    <section className="space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Solar Kesif</h1>
          <p className="sf-muted mt-1 text-sm">
            Kesif talepleri, saha verileri ve fizibilite surecleri.
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
        <h2 className="text-lg font-semibold">Kesif Listesi</h2>
        <div className="sf-card overflow-x-auto rounded-2xl">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="sf-panel">
                <th className="p-3 font-medium">Proje Adi</th>
                <th className="p-3 font-medium">Konum</th>
                <th className="p-3 font-medium">Alan (m²)</th>
                <th className="p-3 font-medium">Tahmini Kapasite</th>
                <th className="p-3 font-medium">Kesif Tarihi</th>
                <th className="p-3 font-medium">Durum</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={`${row.project}-${row.date}`} className="sf-border-t">
                  <td className="p-3 font-medium">{row.project}</td>
                  <td className="p-3">{row.location}</td>
                  <td className="p-3">{row.area}</td>
                  <td className="p-3">{row.estimatedCapacity}</td>
                  <td className="p-3">{row.date}</td>
                  <td className="p-3">{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
