import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import "@/index.css";

import AppLayout from "@/layouts/AppLayout";
import AppPage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";

// Placeholder pages
import PlaceholderPage from "@/pages/PlaceholderPage";

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
    element: (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-extrabold text-gray-200 mb-4">404</h1>
          <p className="text-gray-500 text-lg">Page not found</p>
          <a href="/" className="mt-6 inline-block text-violet-600 hover:underline font-medium">← Back to Home</a>
        </div>
      </div>
    ),
  },
]);

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);