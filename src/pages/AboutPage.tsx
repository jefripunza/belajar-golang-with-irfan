// src/pages/AboutPage.tsx

import { useEffect, useState } from "react";
import { getAboutPageData } from "@/services/about.service";
import type { TeamMember, CompanyValue, CompanyStat, PageContent } from "@/types/about";

export default function AboutPage() {
  const [team,    setTeam]    = useState<TeamMember[]>([]);
  const [values,  setValues]  = useState<CompanyValue[]>([]);
  const [stats,   setStats]   = useState<CompanyStat[]>([]);
  const [content, setContent] = useState<PageContent>({
    hero_badge:              "About Us",
    hero_headline:           "We're building the future,",
    hero_headline_highlight: "together",
    hero_subtext:            "",
    story_paragraph1:        "",
    story_paragraph2:        "",
    story_paragraph3:        "",
  });

  useEffect(() => {
    getAboutPageData().then((data) => {
      setTeam(data.team);
      setValues(data.values);
      setStats(data.stats);
      setContent(data.content);
    });
  }, []);

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-violet-50 via-white to-indigo-50 py-24 px-6 text-center">
        <span className="inline-block px-3 py-1 bg-violet-100 text-violet-700 text-xs font-semibold rounded-full mb-6">
          {content.hero_badge}
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 max-w-3xl mx-auto leading-tight">
          {content.hero_headline}{" "}
          <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            {content.hero_headline_highlight}
          </span>
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
          {content.hero_subtext}
        </p>
      </section>

      {/* Story */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p className="text-gray-500 leading-relaxed mb-4">{content.story_paragraph1}</p>
            <p className="text-gray-500 leading-relaxed mb-4">{content.story_paragraph2}</p>
            <p className="text-gray-500 leading-relaxed">{content.story_paragraph3}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl p-6 text-center border border-violet-100"
              >
                <div className="text-3xl font-extrabold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 mt-1 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What we stand for</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Our values aren't just words on a wall — they shape every decision we make.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div
                key={v.id}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-violet-200 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:bg-violet-100 transition-colors">
                  {v.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet the team</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              The people behind Nexora — passionate, talented, and driven to make a difference.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div key={member.id} className="text-center group">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-violet-100 to-indigo-100 rounded-2xl flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {member.emoji}
                </div>
                <h3 className="font-semibold text-gray-900">{member.name}</h3>
                <p className="text-sm text-violet-600 font-medium mt-1">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-gradient-to-br from-violet-600 to-indigo-700 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Want to join us?</h2>
        <p className="text-violet-200 mb-8 text-lg max-w-xl mx-auto">
          We're always looking for talented people who share our passion for great products.
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