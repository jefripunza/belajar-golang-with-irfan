import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import "@/index.css";

// Layouts
import PublicLayout from "@/layouts/PublicLayout";

// Pages
import AppPage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import ServicesPage from "@/pages/ServicesPage";
import PortfolioPage from "@/pages/PortfolioPage";
import BlogPage from "@/pages/BlogPage";
import ContactPage from "@/pages/ContactPage";

// Error
import NotFoundPage from "@/pages/error/NotFoundPage";
import AuthLayout from "@/layouts/AuthLayout";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import AppLayout from "@/layouts/AppLayout";
import DashboardPage from "@/pages/app/DashboardPage";
import AnalyticsPage from "@/pages/app/AnalityticsPage";
import PlaceholderPage from "@/pages/PlaceholderPage";
import SettingsPage from "@/pages/app/SettingsPage";
import PortfolioSettingsPage from "@/pages/app/PortfolioSettingPage";
import ServicesSettingsPage from "./pages/app/SevicesSettingPage";
import BlogSettingsPage from "./pages/app/BlogSettingPage";
import AboutSettingsPage from "./pages/app/AboutSettingPage";
import ContactSettingsPage from "./pages/app/ContactSettingPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <AppPage /> },
      { path: "about", element: <AboutPage /> },
      { path: "services", element: <ServicesPage /> },
      { path: "portfolio", element: <PortfolioPage /> },
      { path: "blog", element: <BlogPage /> },
      { path: "contact", element: <ContactPage /> },
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "forgot-password", element: <ForgotPasswordPage /> },
    ],
  },
  {
    path: "/app",
    element: <AppLayout />,
    children: [
      { path: "dashboard", element: <DashboardPage /> },
      { path: "analytics", element: <AnalyticsPage /> },
      { path: "portfolio", element: <PortfolioSettingsPage /> },
      { path: "services", element: <ServicesSettingsPage /> },
      { path: "blog", element: <BlogSettingsPage /> },
      { path: "about", element: <AboutSettingsPage /> },
      { path: "contact", element: <ContactSettingsPage /> },
      { path: "reports", element: <PlaceholderPage title="Reports" /> },
      { path: "projects", element: <PlaceholderPage title="Projects" /> },
      { path: "team", element: <PlaceholderPage title="Team" /> },
      { path: "clients", element: <PlaceholderPage title="Clients" /> },
      { path: "invoices", element: <PlaceholderPage title="Invoices" /> },
      { path: "messages", element: <PlaceholderPage title="Messages" /> },
      {
        path: "notifications",
        element: <PlaceholderPage title="Notifications" />,
      },
      { path: "settings", element: <SettingsPage /> },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />,
);
