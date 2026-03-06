export default function DashboardPage() {
  const stats = [
    {
      label: "Total Revenue",
      value: "$84,250",
      change: "+12.5%",
      up: true,
      icon: "💰",
      color: "from-violet-500 to-indigo-500",
    },
    {
      label: "Active Projects",
      value: "24",
      change: "+3 this month",
      up: true,
      icon: "🚀",
      color: "from-emerald-500 to-teal-500",
    },
    {
      label: "Team Members",
      value: "18",
      change: "+2 new",
      up: true,
      icon: "👥",
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Pending Invoices",
      value: "7",
      change: "-2 from last week",
      up: false,
      icon: "💳",
      color: "from-amber-500 to-orange-500",
    },
  ];

  const projects = [
    {
      name: "ShopEase Redesign",
      client: "PT Maju Bersama",
      progress: 75,
      status: "On Track",
      statusColor: "bg-emerald-100 text-emerald-700",
      due: "Mar 20",
    },
    {
      name: "MediTrack Mobile",
      client: "RS Harapan Sehat",
      progress: 45,
      status: "In Progress",
      statusColor: "bg-blue-100 text-blue-700",
      due: "Apr 5",
    },
    {
      name: "FinSight Dashboard",
      client: "Bank Nusantara",
      progress: 90,
      status: "Review",
      statusColor: "bg-violet-100 text-violet-700",
      due: "Mar 10",
    },
    {
      name: "LogiFlow API",
      client: "CV Logistik Jaya",
      progress: 20,
      status: "At Risk",
      statusColor: "bg-red-100 text-red-700",
      due: "Mar 30",
    },
    {
      name: "LearnHub Platform",
      client: "Yayasan Pintar",
      progress: 60,
      status: "On Track",
      statusColor: "bg-emerald-100 text-emerald-700",
      due: "Apr 15",
    },
  ];

  const activities = [
    {
      emoji: "✅",
      text: "FinSight Dashboard moved to Review",
      time: "2m ago",
      color: "bg-violet-50",
    },
    {
      emoji: "💬",
      text: "Brian commented on MediTrack Mobile",
      time: "15m ago",
      color: "bg-blue-50",
    },
    {
      emoji: "🧾",
      text: "Invoice #INV-042 sent to Bank Nusantara",
      time: "1h ago",
      color: "bg-amber-50",
    },
    {
      emoji: "👤",
      text: "New team member David Park joined",
      time: "3h ago",
      color: "bg-emerald-50",
    },
    {
      emoji: "🚀",
      text: "LogiFlow API project kicked off",
      time: "5h ago",
      color: "bg-rose-50",
    },
  ];

  const team = [
    { name: "Brian Chen", role: "CTO", emoji: "👨‍💻", tasks: 8, online: true },
    {
      name: "Sara Malik",
      role: "Designer",
      emoji: "👩‍🎨",
      tasks: 5,
      online: true,
    },
    {
      name: "David Park",
      role: "Engineer",
      emoji: "👨‍🔧",
      tasks: 11,
      online: false,
    },
    { name: "Rina Sari", role: "PM", emoji: "👩‍💼", tasks: 6, online: true },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            Welcome back, Alice 👋 Here's what's happening.
          </p>
        </div>
        <button className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:from-violet-700 hover:to-indigo-700 shadow-sm hover:shadow-md transition-all">
          + New Project
        </button>
      </div>

      {/* Stats Grid */}
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="group relative bg-white/80 backdrop-blur rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            {/* Gradient Accent */}
            <div
              className={`absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r ${stat.color}`}
            />

            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium tracking-wide">
                  {stat.label}
                </p>

                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stat.value}
                </p>
              </div>

              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-xl shadow-md group-hover:scale-110 transition-transform`}
              >
                {stat.icon}
              </div>
            </div>

            {/* Trend */}
            <div className="mt-5 flex items-center">
              <span
                className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                  stat.up
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-red-50 text-red-500"
                }`}
              >
                {stat.up ? "▲" : "▼"} {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Active Projects</h2>
            <button className="text-sm text-violet-600 font-medium hover:underline">
              View all →
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {projects.map((p) => (
              <div
                key={p.name}
                className="px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {p.name}
                    </p>
                    <p className="text-xs text-gray-400">{p.client}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${p.statusColor}`}
                    >
                      {p.status}
                    </span>
                    <span className="text-xs text-gray-400 hidden sm:block">
                      Due {p.due}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-500 w-8 text-right">
                    {p.progress}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-2xl border border-gray-100">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Recent Activity</h2>
            <button className="text-sm text-violet-600 font-medium hover:underline">
              All →
            </button>
          </div>
          <div className="p-4 space-y-3">
            {activities.map((a, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 p-3 rounded-xl ${a.color}`}
              >
                <span className="text-xl flex-shrink-0">{a.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-700 leading-relaxed">
                    {a.text}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart Placeholder */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-gray-900">Revenue Overview</h2>
              <p className="text-xs text-gray-400 mt-0.5">Last 7 months</p>
            </div>
            <div className="flex gap-2">
              {["Monthly", "Quarterly", "Yearly"].map((t, i) => (
                <button
                  key={t}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                    i === 0
                      ? "bg-violet-100 text-violet-700"
                      : "text-gray-400 hover:bg-gray-100"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          {/* Bar Chart */}
          <div className="flex items-end gap-3 h-36">
            {[
              { month: "Sep", value: 60 },
              { month: "Oct", value: 75 },
              { month: "Nov", value: 55 },
              { month: "Dec", value: 90 },
              { month: "Jan", value: 70 },
              { month: "Feb", value: 85 },
              { month: "Mar", value: 95 },
            ].map((d) => (
              <div
                key={d.month}
                className="flex-1 flex flex-col items-center gap-2"
              >
                <div
                  className="w-full flex flex-col justify-end"
                  style={{ height: "100px" }}
                >
                  <div
                    className="w-full bg-gradient-to-t from-violet-600 to-indigo-400 rounded-t-lg hover:from-violet-700 hover:to-indigo-500 transition-all duration-300 cursor-pointer"
                    style={{ height: `${d.value}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="bg-white rounded-2xl border border-gray-100">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Team</h2>
            <button className="text-sm text-violet-600 font-medium hover:underline">
              Manage →
            </button>
          </div>
          <div className="p-4 space-y-2">
            {team.map((member) => (
              <div
                key={member.name}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="relative flex-shrink-0">
                  <div className="w-9 h-9 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-xl flex items-center justify-center text-lg">
                    {member.emoji}
                  </div>
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${member.online ? "bg-emerald-400" : "bg-gray-300"}`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {member.name}
                  </p>
                  <p className="text-xs text-gray-400">{member.role}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-gray-900">
                    {member.tasks}
                  </p>
                  <p className="text-xs text-gray-400">tasks</p>
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 pb-4">
            <button className="w-full py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-violet-300 hover:text-violet-600 transition-all duration-200 font-medium">
              + Invite Member
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
