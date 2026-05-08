const stats = [
  { label: "Toplam Trafo", value: "31" },
  { label: "Bakim Bekleyen", value: "6" },
  { label: "Bu Ay Yapilan", value: "14" },
  { label: "Ariza", value: "2" },
];

const rows = [
  {
    transformer: "TRF-MRK-01",
    location: "Istanbul",
    capacity: "50 MVA",
    lastMaintenance: "2026-04-25",
    nextMaintenance: "2026-06-25",
    status: "Aktif",
  },
  {
    transformer: "TRF-GDY-02",
    location: "Izmir",
    capacity: "31.5 MVA",
    lastMaintenance: "2026-03-19",
    nextMaintenance: "2026-05-19",
    status: "Bakim Bekliyor",
  },
  {
    transformer: "TRF-ANT-03",
    location: "Antalya",
    capacity: "25 MVA",
    lastMaintenance: "2026-04-03",
    nextMaintenance: "2026-07-03",
    status: "Ariza",
  },
];

export default function TrafoBakimPage() {
  return (
    <section className="space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Trafo Bakim</h1>
          <p className="sf-muted mt-1 text-sm">
            Trafo envanteri, bakim planlari ve ariza takibi.
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
        <h2 className="text-lg font-semibold">Trafo Listesi</h2>
        <div className="sf-card overflow-x-auto rounded-2xl">
          <table className="w-full min-w-[1000px] text-left text-sm">
            <thead>
              <tr className="sf-panel">
                <th className="p-3 font-medium">Trafo Adi</th>
                <th className="p-3 font-medium">Konum</th>
                <th className="p-3 font-medium">Kapasite (MVA)</th>
                <th className="p-3 font-medium">Son Bakim</th>
                <th className="p-3 font-medium">Sonraki Bakim</th>
                <th className="p-3 font-medium">Durum</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.transformer} className="border-t" style={{ borderColor: "var(--color-border)" }}>
                  <td className="p-3 font-medium">{row.transformer}</td>
                  <td className="p-3">{row.location}</td>
                  <td className="p-3">{row.capacity}</td>
                  <td className="p-3">{row.lastMaintenance}</td>
                  <td className="p-3">{row.nextMaintenance}</td>
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
