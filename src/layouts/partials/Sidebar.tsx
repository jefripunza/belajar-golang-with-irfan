import { NavLink } from "react-router";

interface SidebarProps {
  collapsed: boolean;
  onCollapse: () => void;
}

const navGroups = [
  {
    label: "Main",
    items: [
      { to: "/app", icon: "🏠", label: "Dashboard" },
      { to: "/app/analytics", icon: "📊", label: "Analytics" },
      { to: "/app/reports", icon: "📋", label: "Reports" },
    ],
  },
  {
    label: "Management",
    items: [
      { to: "/app/projects", icon: "🚀", label: "Projects" },
      { to: "/app/team", icon: "👥", label: "Team" },
      { to: "/app/clients", icon: "🤝", label: "Clients" },
      { to: "/app/invoices", icon: "💳", label: "Invoices" },
    ],
  },
  {
    label: "System",
    items: [
      { to: "/app/messages", icon: "💬", label: "Messages", badge: 4 },
      { to: "/app/notifications", icon: "🔔", label: "Notifications", badge: 12 },
      { to: "/app/settings", icon: "⚙️", label: "Settings" },
    ],
  },
];

export default function Sidebar({ collapsed, onCollapse }: SidebarProps) {
  return (
    <aside
      className={`flex flex-col bg-gray-950 text-white transition-all duration-300 h-full ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Logo */}
      <div
        className={`flex items-center h-16 px-4 border-b border-gray-800 flex-shrink-0 ${
          collapsed ? "justify-center" : "justify-between"
        }`}
      >
        {!collapsed && (
          <NavLink to="/app" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xs">N</span>
            </div>
            <span className="font-bold text-white text-lg">Nexora</span>
          </NavLink>
        )}
        {collapsed && (
          <div className="w-7 h-7 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">N</span>
          </div>
        )}
        {!collapsed && (
          <button
            onClick={onCollapse}
            className="p-1 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
        {navGroups.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest px-3 mb-2">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/app"}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative ${
                      isActive
                        ? "bg-violet-600 text-white shadow-lg shadow-violet-900/30"
                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                    } ${collapsed ? "justify-center" : ""}`
                  }
                >
                  <span className="text-base flex-shrink-0">{item.icon}</span>
                  {!collapsed && <span className="flex-1">{item.label}</span>}
                  {!collapsed && item.badge && (
                    <span className="bg-violet-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                      {item.badge}
                    </span>
                  )}
                  {collapsed && item.badge && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-violet-500 rounded-full" />
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Expand button when collapsed */}
      {collapsed && (
        <div className="px-2 pb-3">
          <button
            onClick={onCollapse}
            className="w-full p-2.5 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white transition-all flex items-center justify-center"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      {/* User */}
      <div className={`border-t border-gray-800 p-3 flex-shrink-0 ${collapsed ? "flex justify-center" : ""}`}>
        {collapsed ? (
          <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-xl flex items-center justify-center text-sm font-bold text-white">
            A
          </div>
        ) : (
          <div className="flex items-center gap-3 px-1">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">Alice Johnson</p>
              <p className="text-xs text-gray-400 truncate">alice@nexora.com</p>
            </div>
            <NavLink
              to="/logout"
              className="text-gray-500 hover:text-gray-300 transition-colors"
              title="Logout"
            >
              Logout
            </NavLink>
          </div>
        )}
      </div>
    </aside>
  );
}