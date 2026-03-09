import { useState, useEffect } from "react";
import { Outlet } from "react-router";
import Sidebar from "@/layouts/partials/Sidebar";
import { useNavigate, useLocation } from "react-router";
import { useAuthStore } from "@/stores/authStore";
import Loading from "@/components/Loading";

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { isLoading, validateToken} = useAuthStore();
  // const { isDarkMode, toggleTheme } = useThemeStore();

  // const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const valid = await validateToken("app");
      if (!valid) {
        navigate("/login", { replace: true });
      } else {
        if (location.pathname === "/app") {
          navigate("/app/dashboard", { replace: true });
        }
      }
    };
    checkAuth();
  }, [validateToken, navigate, location.pathname]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)"); // lg
    const apply = () => {
      const nextIsDesktop = mq.matches;
      // setIsDesktop(nextIsDesktop);
      if (!nextIsDesktop) {
        setCollapsed(false);
      }
    };

    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [setCollapsed]);

  // useEffect(() => {
  //   const root = document.documentElement;
  //   if (isDarkMode) {
  //     root.removeAttribute("data-theme");
  //   } else {
  //     root.setAttribute("data-theme", "light");
  //   }
  // }, [isDarkMode]);

  // const handleLogout = () => {
  //   logout();
  //   navigate("/", { replace: true });
  // };

  // const handleNavClick = (path: string) => {
  //   navigate(path);
  //   setMobileOpen(false);
  // };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-shrink-0">
        <Sidebar
          collapsed={collapsed}
          onCollapse={() => setCollapsed(!collapsed)}
        />
      </div>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          <div className="relative z-10 w-64">
            <Sidebar
              collapsed={false}
              onCollapse={() => setMobileOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white/70 backdrop-blur-xl border-b border-gray-200 flex items-center justify-between px-4 md:px-6 shadow-sm">
          <div className="flex items-center gap-3">
            {/* Mobile Menu */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Search */}
            <div className="relative hidden sm:block">
              <svg
                className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>

              <input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm
                focus:outline-none focus:ring-2 focus:ring-violet-100 focus:border-violet-400
                w-64 transition shadow-sm"
              />
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <button className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118
                  14.158V11a6.002 6.002 0 00-4-5.659V5
                  a2 2 0 10-4 0v.341C7.67 6.165
                  6 8.388 6 11v3.159c0 .538-.214
                  1.055-.595 1.436L4 17h5m6
                  0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>

              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-violet-500 rounded-full animate-pulse" />
            </button>

            {/* Messages */}
            <button className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 12h.01M12 12h.01M16
                  12h.01M21 12c0 4.418-4.03
                  8-9 8a9.863 9.863 0
                  01-4.255-.949L3
                  20l1.395-3.72C3.512
                  15.042 3 13.574 3
                  12c0-4.418 4.03-8
                  9-8s9 3.582 9 8z"
                />
              </svg>

              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
            </button>

            <div className="w-px h-6 bg-gray-200" />

            {/* Avatar */}
            <button className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-gray-100 transition">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow">
                A
              </div>

              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-gray-800 leading-none">
                  Alice
                </p>
                <p className="text-xs text-gray-400">Admin</p>
              </div>
            </button>
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
