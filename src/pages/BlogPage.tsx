export default function BlogPage() {
  const featured = {
    emoji: "🤖",
    category: "AI & Tech",
    badge: "bg-violet-100 text-violet-700",
    title: "How AI is Reshaping the Future of Web Development in 2026",
    desc: "From AI-powered code generation to intelligent design systems — explore how artificial intelligence is fundamentally changing how we build for the web.",
    author: "Brian Chen",
    authorEmoji: "👨‍💻",
    role: "CTO, Nexora",
    date: "March 1, 2026",
    readTime: "8 min read",
    color: "from-violet-50 to-indigo-50",
  };

  const posts = [
    {
      emoji: "⚡",
      category: "Performance",
      badge: "bg-amber-100 text-amber-700",
      title: "10 Ways to Dramatically Speed Up Your React App",
      desc: "Practical techniques to optimize rendering, reduce bundle size, and improve Core Web Vitals.",
      author: "David Park",
      authorEmoji: "👨‍🔧",
      date: "Feb 24, 2026",
      readTime: "6 min read",
      color: "from-amber-50 to-orange-50",
    },
    {
      emoji: "🎨",
      category: "Design",
      badge: "bg-pink-100 text-pink-700",
      title: "Design Systems: Why Every Team Needs One",
      desc: "How a well-crafted design system saves time, reduces inconsistency, and scales your product.",
      author: "Sara Malik",
      authorEmoji: "👩‍🎨",
      date: "Feb 18, 2026",
      readTime: "5 min read",
      color: "from-pink-50 to-rose-50",
    },
    {
      emoji: "🔒",
      category: "Security",
      badge: "bg-slate-100 text-slate-700",
      title: "The OWASP Top 10: What Every Developer Must Know",
      desc: "A practical guide to the most critical web application security risks and how to prevent them.",
      author: "Alice Johnson",
      authorEmoji: "👩‍💼",
      date: "Feb 12, 2026",
      readTime: "7 min read",
      color: "from-slate-50 to-gray-50",
    },
    {
      emoji: "☁️",
      category: "DevOps",
      badge: "bg-blue-100 text-blue-700",
      title: "Docker + Kubernetes: A Beginner's Survival Guide",
      desc: "Cut through the complexity — learn how to containerize and orchestrate your apps step by step.",
      author: "Brian Chen",
      authorEmoji: "👨‍💻",
      date: "Feb 5, 2026",
      readTime: "9 min read",
      color: "from-blue-50 to-cyan-50",
    },
    {
      emoji: "📱",
      category: "Mobile",
      badge: "bg-emerald-100 text-emerald-700",
      title: "React Native vs Flutter: Which Should You Pick in 2026?",
      desc: "An honest, up-to-date comparison to help you make the right choice for your next mobile app.",
      author: "David Park",
      authorEmoji: "👨‍🔧",
      date: "Jan 28, 2026",
      readTime: "6 min read",
      color: "from-emerald-50 to-teal-50",
    },
    {
      emoji: "🚀",
      category: "Startup",
      badge: "bg-rose-100 text-rose-700",
      title: "MVP to Product-Market Fit: Lessons from 3 Years of Building",
      desc: "What we learned shipping dozens of MVPs — the mistakes, the wins, and what actually matters.",
      author: "Alice Johnson",
      authorEmoji: "👩‍💼",
      date: "Jan 20, 2026",
      readTime: "10 min read",
      color: "from-rose-50 to-pink-50",
    },
  ];

  const categories = [
    "All",
    "AI & Tech",
    "Performance",
    "Design",
    "Security",
    "DevOps",
    "Mobile",
    "Startup",
  ];

  const topics = [
    "React",
    "TypeScript",
    "UI/UX",
    "Node.js",
    "Cloud",
    "AI",
    "Mobile",
    "Security",
    "Startup",
    "DevOps",
  ];

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-violet-50 via-white to-indigo-50 py-24 px-6 text-center">
        <span className="inline-block px-3 py-1 bg-violet-100 text-violet-700 text-xs font-semibold rounded-full mb-6">
          Nexora Blog
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 max-w-3xl mx-auto leading-tight">
          Insights for{" "}
          <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            modern builders
          </span>
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed mb-10">
          Tutorials, best practices, and industry insights from the Nexora team
          — written by developers, designers, and founders.
        </p>

        {/* Search Bar */}
        <div className="max-w-lg mx-auto relative">
          <svg
            className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search articles..."
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 shadow-sm"
          />
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-6 px-6 border-b border-gray-100 sticky top-16 bg-white/90 backdrop-blur-md z-40">
        <div className="max-w-6xl mx-auto flex gap-2 overflow-x-auto pb-1">
          {categories.map((cat, i) => (
            <button
              key={cat}
              className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                i === 0
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Featured Post */}
            <div className="mb-10">
              <p className="text-xs font-bold text-violet-600 uppercase tracking-widest mb-4">
                Featured Post
              </p>
              <div
                className={`rounded-2xl border border-gray-100 hover:border-violet-200 hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer bg-gradient-to-br ${featured.color}`}
              >
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">{featured.emoji}</span>
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${featured.badge}`}
                    >
                      {featured.category}
                    </span>
                    <span className="ml-auto text-xs text-gray-400 bg-white px-2 py-1 rounded-full border border-gray-100">
                      ⭐ Featured
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-violet-700 transition-colors leading-snug">
                    {featured.title}
                  </h2>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">
                    {featured.desc}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-lg border border-gray-100">
                        {featured.authorEmoji}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {featured.author}
                        </div>
                        <div className="text-xs text-gray-400">
                          {featured.role}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 text-right">
                      <div>{featured.date}</div>
                      <div>{featured.readTime}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Posts Grid */}
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
              Latest Articles
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map((post) => (
                <div
                  key={post.title}
                  className="rounded-2xl border border-gray-100 hover:border-violet-200 hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer"
                >
                  <div
                    className={`bg-gradient-to-br ${post.color} px-6 pt-6 pb-4 flex items-center justify-between`}
                  >
                    <span className="text-3xl">{post.emoji}</span>
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${post.badge}`}
                    >
                      {post.category}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-violet-700 transition-colors leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-5">
                      {post.desc}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{post.authorEmoji}</span>
                        <span className="text-xs font-medium text-gray-700">
                          {post.author}
                        </span>
                      </div>
                      <div className="text-right text-xs text-gray-400">
                        <div>{post.date}</div>
                        <div>{post.readTime}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-10">
              <button className="px-8 py-3 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:border-violet-300 hover:text-violet-600 hover:bg-violet-50 transition-all duration-200">
                Load More Articles
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-72 flex-shrink-0 space-y-6">
            {/* Newsletter */}
            <div className="bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl p-6 text-white">
              <div className="text-2xl mb-3">📬</div>
              <h3 className="font-bold text-lg mb-2">Stay in the loop</h3>
              <p className="text-violet-200 text-sm leading-relaxed mb-4">
                Get the latest articles and resources delivered to your inbox
                weekly.
              </p>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full px-4 py-2.5 rounded-lg bg-white/20 placeholder-violet-300 text-white text-sm border border-white/20 focus:outline-none focus:border-white mb-3"
              />
              <button className="w-full py-2.5 bg-white text-violet-700 font-semibold text-sm rounded-lg hover:bg-violet-50 transition-colors">
                Subscribe →
              </button>
            </div>

            {/* Popular Topics */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 mb-4">Popular Topics</h3>
              <div className="flex flex-wrap gap-2">
                {topics.map((topic) => (
                  <button
                    key={topic}
                    className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 text-xs font-medium rounded-lg hover:border-violet-300 hover:text-violet-600 transition-all duration-200"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Top Authors */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 mb-4">Top Authors</h3>
              <div className="space-y-4">
                {[
                  {
                    name: "Alice Johnson",
                    role: "CEO & Founder",
                    emoji: "👩‍💼",
                    posts: 12,
                  },
                  { name: "Brian Chen", role: "CTO", emoji: "👨‍💻", posts: 9 },
                  {
                    name: "Sara Malik",
                    role: "Head of Design",
                    emoji: "👩‍🎨",
                    posts: 7,
                  },
                  {
                    name: "David Park",
                    role: "Lead Engineer",
                    emoji: "👨‍🔧",
                    posts: 6,
                  },
                ].map((author) => (
                  <div
                    key={author.name}
                    className="flex items-center gap-3 group cursor-pointer"
                  >
                    <div className="w-9 h-9 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                      {author.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-900 group-hover:text-violet-600 transition-colors truncate">
                        {author.name}
                      </div>
                      <div className="text-xs text-gray-400 truncate">
                        {author.role}
                      </div>
                    </div>
                    <div className="text-xs text-violet-600 font-semibold flex-shrink-0">
                      {author.posts} posts
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-gradient-to-br from-violet-600 to-indigo-700 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Want to write for us?
        </h2>
        <p className="text-violet-200 mb-8 text-lg max-w-xl mx-auto">
          Share your expertise with our community. We're always looking for
          great contributors.
        </p>

        <a
          href="/contact"
          className="inline-block px-8 py-4 bg-white text-violet-700 font-bold rounded-xl hover:bg-violet-50 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          Submit an Article →
        </a>
      </section>
    </div>
  );
}
