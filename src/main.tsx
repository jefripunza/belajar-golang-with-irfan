import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import "@/index.css";

// Layouts
import AppLayout from "@/layouts/AppLayout";

// Pages
import AppPage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import PlaceholderPage from "@/pages/PlaceholderPage";

// Error
import NotFoundPage from "@/pages/error/NotFoundPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { path: "/", element: <AppPage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/services", element: <PlaceholderPage title="Services" /> },
      { path: "/portfolio", element: <PlaceholderPage title="Portfolio" /> },
      { path: "/blog", element: <PlaceholderPage title="Blog" /> },
      { path: "/contact", element: <PlaceholderPage title="Contact" /> },
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
