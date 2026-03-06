export default function PortfolioPage() {
  const projects = [
    {
      emoji: "🛒",
      title: "ShopEase",
      category: "E-Commerce",
      desc: "A full-featured online store with real-time inventory, payment gateway, and analytics dashboard.",
      tags: ["React", "Node.js", "Stripe", "PostgreSQL"],
      color: "from-pink-50 to-rose-50",
      border: "hover:border-pink-200",
      badge: "bg-pink-100 text-pink-700",
      result: "3x conversion rate increase",
    },
    {
      emoji: "🏥",
      title: "MediTrack",
      category: "Healthcare",
      desc: "Patient management system with appointment scheduling, medical records, and telemedicine support.",
      tags: ["Next.js", "TypeScript", "Prisma", "AWS"],
      color: "from-emerald-50 to-teal-50",
      border: "hover:border-emerald-200",
      badge: "bg-emerald-100 text-emerald-700",
      result: "50% reduction in admin time",
    },
    {
      emoji: "📊",
      title: "FinSight",
      category: "Fintech",
      desc: "Real-time financial analytics dashboard with AI-powered insights and automated reporting.",
      tags: ["React", "Python", "OpenAI", "Recharts"],
      color: "from-violet-50 to-indigo-50",
      border: "hover:border-violet-200",
      badge: "bg-violet-100 text-violet-700",
      result: "$2M in decisions automated",
    },
    {
      emoji: "🎓",
      title: "LearnHub",
      category: "EdTech",
      desc: "Interactive learning platform with live classes, quizzes, progress tracking, and certificates.",
      tags: ["React Native", "Firebase", "WebRTC", "Redux"],
      color: "from-amber-50 to-orange-50",
      border: "hover:border-amber-200",
      badge: "bg-amber-100 text-amber-700",
      result: "20K+ active students",
    },
    {
      emoji: "🚚",
      title: "LogiFlow",
      category: "Logistics",
      desc: "End-to-end supply chain management with real-time GPS tracking and automated dispatch.",
      tags: ["Vue.js", "Go", "Google Maps", "Redis"],
      color: "from-blue-50 to-cyan-50",
      border: "hover:border-blue-200",
      badge: "bg-blue-100 text-blue-700",
      result: "40% faster delivery times",
    },
    {
      emoji: "🏨",
      title: "StayNest",
      category: "Travel",
      desc: "Airbnb-style rental platform with smart search, dynamic pricing, and host dashboard.",
      tags: ["Next.js", "Supabase", "Mapbox", "Tailwind"],
      color: "from-slate-50 to-gray-50",
      border: "hover:border-slate-200",
      badge: "bg-slate-100 text-slate-700",
      result: "10K+ listings in 6 months",
    },
  ];

  const categories = ["All", "E-Commerce", "Healthcare", "Fintech", "EdTech", "Logistics", "Travel"];

  const testimonials = [
    {
      name: "Sarah Kim",
      role: "CEO, ShopEase",
      emoji: "👩‍💼",
      text: "Nexora completely transformed our online store. The new platform tripled our conversions in the first month.",
    },
    {
      name: "Dr. Reza Pratama",
      role: "Director, MediTrack",
      emoji: "👨‍⚕️",
      text: "The team delivered ahead of schedule and the quality was outstanding. Our staff loves the new system.",
    },
    {
      name: "Amelia Torres",
      role: "CTO, FinSight",
      emoji: "👩‍💻",
      text: "Incredibly talented team. They understood our complex requirements and built exactly what we envisioned.",
    },
  ];

  return (
    <div className="bg-white">

      {/* Hero */}
      <section className="bg-gradient-to-br from-violet-50 via-white to-indigo-50 py-24 px-6 text-center">
        <span className="inline-block px-3 py-1 bg-violet-100 text-violet-700 text-xs font-semibold rounded-full mb-6">
          Our Work
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 max-w-3xl mx-auto leading-tight">
          Projects we're{" "}
          <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            proud of
          </span>
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
          From startups to enterprises — here's a selection of products we've designed,
          built, and launched across industries.
        </p>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 mt-12">
          {[
            { value: "80+", label: "Projects Delivered" },
            { value: "95%", label: "Client Satisfaction" },
            { value: "12", label: "Industries Served" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-extrabold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-10 px-6 border-b border-gray-100 sticky top-16 bg-white/90 backdrop-blur-md z-40">
        <div className="max-w-6xl mx-auto flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
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

      {/* Projects Grid */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <div
              key={p.title}
              className={`rounded-2xl border border-gray-100 ${p.border} hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer`}
            >
              {/* Card Header */}
              <div className={`bg-gradient-to-br ${p.color} p-8 flex items-center justify-between`}>
                <span className="text-5xl">{p.emoji}</span>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${p.badge}`}>
                  {p.category}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{p.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{p.desc}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {p.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Result */}
                <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                  <svg className="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span className="text-sm font-semibold text-violet-600">{p.result}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What our clients say</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Don't just take our word for it — hear from the teams we've worked with.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-violet-200 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-xl flex items-center justify-center text-xl">
                    {t.emoji}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                    <div className="text-violet-600 text-xs font-medium">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-gradient-to-br from-violet-600 to-indigo-700 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Have a project in mind?</h2>
        <p className="text-violet-200 mb-8 text-lg max-w-xl mx-auto">
          Let's build something great together. Tell us about your idea and we'll get back to you within 24 hours.
        </p>
        
        <a  href="/contact"
          className="inline-block px-8 py-4 bg-white text-violet-700 font-bold rounded-xl hover:bg-violet-50 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          Start a Project →
        </a>
      </section>

    </div>
  );
}