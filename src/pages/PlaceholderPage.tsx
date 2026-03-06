// src/pages/PlaceholderPage.tsx
export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-400">This page is under construction.</p>
        <a href="/" className="mt-6 inline-block text-violet-600 hover:underline font-medium">
          ← Back to Home
        </a>
      </div>
    </div>
  );
}