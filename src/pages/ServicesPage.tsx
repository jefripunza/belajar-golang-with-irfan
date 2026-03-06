export default function ServicesPage() {
  const services = [
    {
      icon: "🎨",
      title: "UI/UX Design",
      desc: "We craft intuitive, beautiful interfaces that users love. From wireframes to polished prototypes.",
      features: ["User Research", "Wireframing", "Prototyping", "Design System"],
      color: "from-pink-50 to-rose-50",
      border: "hover:border-pink-200",
      badge: "bg-pink-100 text-pink-700",
    },
    {
      icon: "💻",
      title: "Web Development",
      desc: "Modern, fast, and scalable web applications built with the latest technologies.",
      features: ["React / Next.js", "TypeScript", "REST & GraphQL", "Performance Optimization"],
      color: "from-violet-50 to-indigo-50",
      border: "hover:border-violet-200",
      badge: "bg-violet-100 text-violet-700",
    },
    {
      icon: "📱",
      title: "Mobile Apps",
      desc: "Cross-platform mobile experiences that feel native on iOS and Android.",
      features: ["React Native", "iOS & Android", "Push Notifications", "Offline Support"],
      color: "from-blue-50 to-cyan-50",
      border: "hover:border-blue-200",
      badge: "bg-blue-100 text-blue-700",
    },
    {
      icon: "☁️",
      title: "Cloud & DevOps",
      desc: "Reliable infrastructure, CI/CD pipelines, and cloud solutions that scale with you.",
      features: ["AWS / GCP / Azure", "Docker & Kubernetes", "CI/CD Pipelines", "Monitoring"],
      color: "from-emerald-50 to-teal-50",
      border: "hover:border-emerald-200",
      badge: "bg-emerald-100 text-emerald-700",
    },
    {
      icon: "🤖",
      title: "AI Integration",
      desc: "Supercharge your product with AI — from chatbots to intelligent data pipelines.",
      features: ["LLM Integration", "Custom ML Models", "Data Pipelines", "AI Chatbots"],
      color: "from-amber-50 to-orange-50",
      border: "hover:border-amber-200",
      badge: "bg-amber-100 text-amber-700",
    },
    {
      icon: "🔒",
      title: "Security & Compliance",
      desc: "Keep your product and users safe with enterprise-grade security audits and solutions.",
      features: ["Penetration Testing", "GDPR Compliance", "Auth & SSO", "Security Audits"],
      color: "from-slate-50 to-gray-50",
      border: "hover:border-slate-200",
      badge: "bg-slate-100 text-slate-700",
    },
  ];

  const process = [
    { step: "01", title: "Discovery", desc: "We learn about your goals, users, and technical requirements." },
    { step: "02", title: "Strategy", desc: "We define scope, timelines, and the best approach for your project." },
    { step: "03", title: "Build", desc: "Our team designs and develops your product with full transparency." },
    { step: "04", title: "Launch", desc: "We ship, monitor, and iterate — ensuring a smooth go-live." },
  ];

  const plans = [
    {
      name: "Starter",
      price: "$499",
      period: "/project",
      desc: "Perfect for small businesses and MVPs.",
      features: ["1 Service Included", "Up to 3 Revisions", "2 Week Delivery", "Email Support"],
      cta: "Get Started",
      highlight: false,
    },
    {
      name: "Growth",
      price: "$1,499",
      period: "/month",
      desc: "For teams that need ongoing support.",
      features: ["3 Services Included", "Unlimited Revisions", "Priority Delivery", "Slack Support", "Monthly Reports"],
      cta: "Start Free Trial",
      highlight: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      desc: "Tailored solutions for large organizations.",
      features: ["All Services", "Dedicated Team", "SLA Guarantee", "24/7 Support", "On-site Visits"],
      cta: "Contact Sales",
      highlight: false,
    },
  ];

  return (
    <div className="bg-white">

      {/* Hero */}
      <section className="bg-gradient-to-br from-violet-50 via-white to-indigo-50 py-24 px-6 text-center">
        <span className="inline-block px-3 py-1 bg-violet-100 text-violet-700 text-xs font-semibold rounded-full mb-6">
          What We Offer
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 max-w-3xl mx-auto leading-tight">
          Services built for{" "}
          <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            real results
          </span>
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
          From design to deployment, we offer end-to-end digital services to help your business grow faster and smarter.
        </p>
      </section>

      {/* Services Grid */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <div
                key={s.title}
                className={`rounded-2xl p-6 border border-gray-100 ${s.border} hover:shadow-xl transition-all duration-300 bg-gradient-to-br ${s.color} group`}
              >
                <div className="text-4xl mb-4">{s.icon}</div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${s.badge}`}>
                  {s.title}
                </span>
                <p className="text-gray-600 text-sm leading-relaxed mt-3 mb-5">{s.desc}</p>
                <ul className="space-y-2">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-violet-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How we work</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              A proven process that keeps projects on time, on budget, and aligned with your goals.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map((p, i) => (
              <div key={p.step} className="relative bg-white rounded-2xl p-6 border border-gray-100 hover:border-violet-200 hover:shadow-lg transition-all duration-300">
                {i < process.length - 1 && (
                  <div className="hidden lg:block absolute top-10 -right-3 w-6 h-0.5 bg-violet-200 z-10" />
                )}
                <div className="text-3xl font-extrabold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                  {p.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{p.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              No hidden fees. Pick the plan that fits your needs and scale anytime.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-8 border transition-all duration-300 ${
                  plan.highlight
                    ? "bg-gradient-to-br from-violet-600 to-indigo-600 border-transparent shadow-2xl scale-105 text-white"
                    : "bg-white border-gray-100 hover:border-violet-200 hover:shadow-lg"
                }`}
              >
                <h3 className={`font-bold text-lg mb-1 ${plan.highlight ? "text-white" : "text-gray-900"}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-4 ${plan.highlight ? "text-violet-200" : "text-gray-400"}`}>
                  {plan.desc}
                </p>
                <div className="flex items-end gap-1 mb-6">
                  <span className={`text-4xl font-extrabold ${plan.highlight ? "text-white" : "text-gray-900"}`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm mb-1 ${plan.highlight ? "text-violet-200" : "text-gray-400"}`}>
                    {plan.period}
                  </span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <svg
                        className={`w-4 h-4 flex-shrink-0 ${plan.highlight ? "text-violet-200" : "text-violet-500"}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className={plan.highlight ? "text-violet-100" : "text-gray-600"}>{f}</span>
                    </li>
                  ))}
                </ul>
                
                <a  href="/contact"
                  className={`block text-center py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    plan.highlight
                      ? "bg-white text-violet-700 hover:bg-violet-50 shadow-lg"
                      : "bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 shadow-sm hover:shadow-md"
                  }`}
                >
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-gradient-to-br from-violet-600 to-indigo-700 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Not sure where to start?</h2>
        <p className="text-violet-200 mb-8 text-lg max-w-xl mx-auto">
          Book a free 30-minute consultation and we'll help you find the right solution.
        </p>
        
        <a  href="/contact"
          className="inline-block px-8 py-4 bg-white text-violet-700 font-bold rounded-xl hover:bg-violet-50 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          Book Free Consultation →
        </a>
      </section>

    </div>
  );
}