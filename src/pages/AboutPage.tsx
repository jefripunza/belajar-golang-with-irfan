export default function AboutPage() {
  const team = [
    { name: "Alice Johnson", role: "CEO & Founder", emoji: "👩‍💼" },
    { name: "Brian Chen", role: "CTO", emoji: "👨‍💻" },
    { name: "Sara Malik", role: "Head of Design", emoji: "👩‍🎨" },
    { name: "David Park", role: "Lead Engineer", emoji: "👨‍🔧" },
  ];

  const values = [
    {
      icon: "🎯",
      title: "Mission-Driven",
      desc: "Everything we do is guided by our mission to make technology accessible for everyone.",
    },
    {
      icon: "🤝",
      title: "People First",
      desc: "We believe great products are built by empowered, happy, and diverse teams.",
    },
    {
      icon: "🌱",
      title: "Always Growing",
      desc: "We embrace learning, iteration, and continuous improvement in everything we do.",
    },
    {
      icon: "🌍",
      title: "Global Impact",
      desc: "Our solutions reach 150+ countries, creating real change at a global scale.",
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-violet-50 via-white to-indigo-50 py-24 px-6 text-center">
        <span className="inline-block px-3 py-1 bg-violet-100 text-violet-700 text-xs font-semibold rounded-full mb-6">
          About Us
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 max-w-3xl mx-auto leading-tight">
          We're building the future,{" "}
          <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            together
          </span>
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
          Nexora was founded in 2020 with a simple belief — great software
          should be beautiful, fast, and accessible to everyone. Today we serve
          thousands of teams worldwide.
        </p>
      </section>

      {/* Story */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p className="text-gray-500 leading-relaxed mb-4">
              It started in a small apartment in Jakarta — two developers
              frustrated with clunky, overpriced tools that got in the way of
              creativity. We knew there had to be a better way.
            </p>
            <p className="text-gray-500 leading-relaxed mb-4">
              So we built it. Nexora launched in 2020 as a simple design tool
              and quickly grew into a full platform trusted by startups,
              agencies, and Fortune 500 companies alike.
            </p>
            <p className="text-gray-500 leading-relaxed">
              Today, our team of 50+ spans 12 countries — united by a shared
              passion for craft, quality, and making our customers successful.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: "2020", label: "Founded" },
              { value: "50+", label: "Team Members" },
              { value: "10K+", label: "Customers" },
              { value: "150+", label: "Countries" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl p-6 text-center border border-violet-100"
              >
                <div className="text-3xl font-extrabold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 mt-1 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What we stand for
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Our values aren't just words on a wall — they shape every decision
              we make.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-violet-200 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:bg-violet-100 transition-colors">
                  {v.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Meet the team
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              The people behind Nexora — passionate, talented, and driven to
              make a difference.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div key={member.name} className="text-center group">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-violet-100 to-indigo-100 rounded-2xl flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {member.emoji}
                </div>
                <h3 className="font-semibold text-gray-900">{member.name}</h3>
                <p className="text-sm text-violet-600 font-medium mt-1">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-gradient-to-br from-violet-600 to-indigo-700 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Want to join us?</h2>
        <p className="text-violet-200 mb-8 text-lg max-w-xl mx-auto">
          We're always looking for talented people who share our passion for
          great products.
        </p>

        <a
          href="/contact"
          className="inline-block px-8 py-4 bg-white text-violet-700 font-bold rounded-xl hover:bg-violet-50 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          See Open Roles →
        </a>
      </section>
    </div>
  );
}
