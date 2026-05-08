const stats = [
  { label: "Toplam Sistem", value: "12" },
  { label: "Aktif", value: "10" },
  { label: "Kapasite (MWh)", value: "186" },
  { label: "Verimlilik %", value: "92.4" },
];

const rows = [
  {
    system: "BESS Kuzey-01",
    location: "Izmir",
    capacity: "32 MWh",
    soc: "%78",
    lastMaintenance: "2026-05-03",
    status: "Aktif",
  },
  {
    system: "BESS Marmara-02",
    location: "Bursa",
    capacity: "24 MWh",
    soc: "%65",
    lastMaintenance: "2026-04-26",
    status: "Bakimda",
  },
  {
    system: "BESS IcAnadolu-03",
    location: "Eskisehir",
    capacity: "16 MWh",
    soc: "%81",
    lastMaintenance: "2026-04-30",
    status: "Aktif",
  },
];

export default function BessOmPage() {
  return (
    <section className="space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">BESS Isletme ve Bakim</h1>
          <p className="sf-muted mt-1 text-sm">
            Batarya enerji depolama sistemlerinde operasyon ve bakim takibi.
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
        <h2 className="text-lg font-semibold">Sistem Listesi</h2>
        <div className="sf-card overflow-x-auto rounded-2xl">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="sf-panel">
                <th className="p-3 font-medium">Sistem Adi</th>
                <th className="p-3 font-medium">Konum</th>
                <th className="p-3 font-medium">Kapasite</th>
                <th className="p-3 font-medium">Anlik SoC</th>
                <th className="p-3 font-medium">Son Bakim</th>
                <th className="p-3 font-medium">Durum</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.system} className="border-t" style={{ borderColor: "var(--color-border)" }}>
                  <td className="p-3 font-medium">{row.system}</td>
                  <td className="p-3">{row.location}</td>
                  <td className="p-3">{row.capacity}</td>
                  <td className="p-3">{row.soc}</td>
                  <td className="p-3">{row.lastMaintenance}</td>
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
