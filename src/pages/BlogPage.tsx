// src/pages/BlogPage.tsx

import { useEffect, useState } from "react";
import { getBlogPageData } from "@/services/blog.service";
import type { BlogPost, BlogAuthor, BlogTopic } from "@/types/blog";

export default function BlogPage() {
  const [posts,          setPosts]          = useState<BlogPost[]>([]);
  const [authors,        setAuthors]        = useState<BlogAuthor[]>([]);
  const [topics,         setTopics]         = useState<BlogTopic[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search,         setSearch]         = useState("");

  useEffect(() => {
    getBlogPageData().then((data) => {
      setPosts(data.posts);
      setAuthors(data.authors);
      setTopics(data.topics);
    });
  }, []);

  // Derived
  const categories = ["All", ...Array.from(new Set(posts.map(p => p.category)))];

  const featured = posts.find(p => p.featured) ?? null;
  const regular  = posts.filter(p => !p.featured);

  const filtered = regular.filter(p => {
    const matchCat    = activeCategory === "All" || p.category === activeCategory;
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  // Post count per author (from published posts)
  const authorPostCount = (name: string) => posts.filter(p => p.author === name).length;

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
          <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search articles..."
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 shadow-sm"
          />
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-6 px-6 border-b border-gray-100 sticky top-16 bg-white/90 backdrop-blur-md z-40">
        <div className="max-w-6xl mx-auto flex gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
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
            {featured && (
              <div className="mb-10">
                <p className="text-xs font-bold text-violet-600 uppercase tracking-widest mb-4">Featured Post</p>
                <div className={`rounded-2xl border border-gray-100 hover:border-violet-200 hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer bg-gradient-to-br ${featured.color}`}>
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-4xl">{featured.emoji}</span>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${featured.badge}`}>{featured.category}</span>
                      <span className="ml-auto text-xs text-gray-400 bg-white px-2 py-1 rounded-full border border-gray-100">⭐ Featured</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-violet-700 transition-colors leading-snug">
                      {featured.title}
                    </h2>
                    <p className="text-gray-500 text-sm leading-relaxed mb-6">{featured.desc}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-lg border border-gray-100">
                          {featured.author_emoji}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{featured.author}</div>
                          {featured.role && <div className="text-xs text-gray-400">{featured.role}</div>}
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 text-right">
                        <div>{featured.date}</div>
                        <div>{featured.read_time}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Posts Grid */}
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Latest Articles</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.map((post) => (
                <div key={post.id} className="rounded-2xl border border-gray-100 hover:border-violet-200 hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer">
                  <div className={`bg-gradient-to-br ${post.color} px-6 pt-6 pb-4 flex items-center justify-between`}>
                    <span className="text-3xl">{post.emoji}</span>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${post.badge}`}>{post.category}</span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-violet-700 transition-colors leading-snug">{post.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-5">{post.desc}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{post.author_emoji}</span>
                        <span className="text-xs font-medium text-gray-700">{post.author}</span>
                      </div>
                      <div className="text-right text-xs text-gray-400">
                        <div>{post.date}</div>
                        <div>{post.read_time}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="col-span-2 py-16 text-center text-gray-400">
                  <div className="text-5xl mb-4">🔍</div>
                  <p className="font-medium">No articles found.</p>
                </div>
              )}
            </div>

            {/* Load More (static placeholder — implement pagination if needed) */}
            {filtered.length > 0 && (
              <div className="text-center mt-10">
                <button className="px-8 py-3 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:border-violet-300 hover:text-violet-600 hover:bg-violet-50 transition-all duration-200">
                  Load More Articles
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-72 flex-shrink-0 space-y-6">
            {/* Newsletter */}
            <div className="bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl p-6 text-white">
              <div className="text-2xl mb-3">📬</div>
              <h3 className="font-bold text-lg mb-2">Stay in the loop</h3>
              <p className="text-violet-200 text-sm leading-relaxed mb-4">
                Get the latest articles and resources delivered to your inbox weekly.
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
            {topics.length > 0 && (
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-bold text-gray-900 mb-4">Popular Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {topics.map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() => setSearch(topic.label)}
                      className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 text-xs font-medium rounded-lg hover:border-violet-300 hover:text-violet-600 transition-all duration-200"
                    >
                      {topic.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Top Authors */}
            {authors.length > 0 && (
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-bold text-gray-900 mb-4">Top Authors</h3>
                <div className="space-y-4">
                  {authors.map((author) => (
                    <div key={author.id} className="flex items-center gap-3 group cursor-pointer">
                      <div className="w-9 h-9 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                        {author.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-gray-900 group-hover:text-violet-600 transition-colors truncate">{author.name}</div>
                        <div className="text-xs text-gray-400 truncate">{author.role}</div>
                      </div>
                      <div className="text-xs text-violet-600 font-semibold flex-shrink-0">
                        {authorPostCount(author.name)} posts
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-gradient-to-br from-violet-600 to-indigo-700 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Want to write for us?</h2>
        <p className="text-violet-200 mb-8 text-lg max-w-xl mx-auto">
          Share your expertise with our community. We're always looking for great contributors.
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