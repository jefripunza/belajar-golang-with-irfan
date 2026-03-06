import { NavLink, Outlet, useLocation, useNavigate } from "react-router";
import { useAuthStore } from "@/stores/authStore";
import { useEffect } from "react";
import { useThemeStore } from "@/stores/themeStore";
import Loading from "@/components/Loading";

export default function AuthLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const { isLoading, validateToken } = useAuthStore();
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    const checkAuth = async () => {
      const valid = await validateToken("auth");
      if (valid) {
        if (!location.pathname.startsWith("/app")) {
          navigate("/app/dashboard", { replace: true });
        }
      }
    };
    checkAuth();
  }, [validateToken, navigate, location.pathname]);

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", "light");
    }
  }, [isDarkMode]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 flex flex-col">
      {/* Header */}
      <header className="px-6 py-5">
        <NavLink to="/" className="inline-flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">N</span>
          </div>
          <span className="text-xl font-bold text-gray-900">Nexora</span>
        </NavLink>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="px-6 py-5 text-center text-xs text-gray-400">
        © 2026 Nexora. All rights reserved. ·{" "}
        <a href="#" className="hover:text-violet-500 transition-colors">
          Privacy Policy
        </a>{" "}
        ·{" "}
        <a href="#" className="hover:text-violet-500 transition-colors">
          Terms of Service
        </a>
      </footer>
    </div>
  );
}
