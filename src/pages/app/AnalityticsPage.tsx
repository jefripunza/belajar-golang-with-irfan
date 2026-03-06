export default function AnalyticsPage() {
  const metrics = [
    {
      label: "Page Views",
      value: "128,450",
      change: "+18.2%",
      up: true,
      icon: "👁️",
    },
    {
      label: "Unique Visitors",
      value: "42,310",
      change: "+9.4%",
      up: true,
      icon: "👤",
    },
    {
      label: "Bounce Rate",
      value: "34.2%",
      change: "-2.1%",
      up: true,
      icon: "↩️",
    },
    {
      label: "Avg. Session",
      value: "4m 32s",
      change: "+0.8%",
      up: true,
      icon: "⏱️",
    },
  ];

  const pages = [
    { page: "/home", views: 42100, unique: 18200, bounce: "28%" },
    { page: "/services", views: 28400, unique: 12500, bounce: "35%" },
    { page: "/portfolio", views: 19800, unique: 9100, bounce: "41%" },
    { page: "/blog", views: 15200, unique: 7400, bounce: "22%" },
    { page: "/contact", views: 9300, unique: 5800, bounce: "18%" },
  ];

  const sources = [
    {
      source: "Organic Search",
      visits: 48200,
      pct: 58,
      color: "bg-violet-500",
    },
    { source: "Direct", visits: 18400, pct: 22, color: "bg-indigo-400" },
    { source: "Social Media", visits: 10200, pct: 12, color: "bg-blue-400" },
    { source: "Referral", visits: 5500, pct: 8, color: "bg-cyan-400" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            Website performance overview
          </p>
        </div>
        <select className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none focus:border-violet-400">
          <option>Last 30 days</option>
          <option>Last 7 days</option>
          <option>Last 90 days</option>
        </select>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="group bg-white/80 backdrop-blur border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              {/* Icon */}
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-50 text-2xl shadow-sm group-hover:scale-110 transition">
                {m.icon}
              </div>

              {/* Change Badge */}
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  m.up
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-red-50 text-red-500"
                }`}
              >
                {m.up ? "▲" : "▼"} {m.change}
              </span>
            </div>

            {/* Value */}
            <p className="text-3xl font-bold text-gray-900 tracking-tight">
              {m.value}
            </p>

            {/* Label */}
            <p className="text-sm text-gray-400 mt-1">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Pages */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Top Pages</h2>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Page
                </th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Views
                </th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden sm:table-cell">
                  Unique
                </th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden sm:table-cell">
                  Bounce
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pages.map((p) => (
                <tr key={p.page} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-violet-600">
                    {p.page}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 text-right font-semibold">
                    {p.views.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400 text-right hidden sm:table-cell">
                    {p.unique.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400 text-right hidden sm:table-cell">
                    {p.bounce}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-5">Traffic Sources</h2>
          <div className="space-y-4">
            {sources.map((s) => (
              <div key={s.source}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-700 font-medium">{s.source}</span>
                  <span className="text-gray-400">{s.pct}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${s.color} rounded-full`}
                    style={{ width: `${s.pct}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {s.visits.toLocaleString()} visits
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
