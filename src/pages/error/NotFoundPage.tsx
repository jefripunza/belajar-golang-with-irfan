export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-extrabold text-gray-200 mb-4">404</h1>
        <p className="text-gray-500 text-lg">Page not found</p>
        <a
          href="/"
          className="mt-6 inline-block text-violet-600 hover:underline font-medium"
        >
          ← Back to Home
        </a>
      </div>
    </div>
  );
}
