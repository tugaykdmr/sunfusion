const stats = [
  { label: "Toplam Denetim", value: "142" },
  { label: "Bu Ay", value: "19" },
  { label: "Tamamlanan", value: "121" },
  { label: "Bekleyen", value: "21" },
];

const rows = [
  {
    project: "Sungun Faz-2",
    plant: "Sungun GES-1",
    date: "2026-05-02",
    auditor: "A. Yildirim",
    status: "Tamamlandi",
    report: "PDF",
  },
  {
    project: "Akasya Revizyon",
    plant: "Akasya GES-2",
    date: "2026-05-08",
    auditor: "M. Arslan",
    status: "Bekliyor",
    report: "-",
  },
  {
    project: "Cinar Genisleme",
    plant: "Cinar GES-3",
    date: "2026-05-11",
    auditor: "T. Eren",
    status: "Planlandi",
    report: "-",
  },
];

export default function SolarDenetimPage() {
  return (
    <section className="space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Gunes Denetimi</h1>
          <p className="sf-muted mt-1 text-sm">
            Denetim planlama, saha kontrolleri ve rapor yonetimi.
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
                <th className="p-3 font-medium">Santral</th>
                <th className="p-3 font-medium">Denetim Tarihi</th>
                <th className="p-3 font-medium">Denetci</th>
                <th className="p-3 font-medium">Durum</th>
                <th className="p-3 font-medium">Rapor</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={`${row.project}-${row.date}`} className="sf-border-t">
                  <td className="p-3 font-medium">{row.project}</td>
                  <td className="p-3">{row.plant}</td>
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
