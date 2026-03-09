// src/pages/ServicesPage.tsx

import { useEffect, useState } from "react";
import { getServicesPageData } from "@/services/services.service";
import type { Service, ProcessStep, PricingPlan } from "@/types/services";
import { parseFeatures } from "@/types/services";

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [process,  setProcess]  = useState<ProcessStep[]>([]);
  const [plans,    setPlans]    = useState<PricingPlan[]>([]);

  useEffect(() => {
    getServicesPageData().then((data) => {
      setServices(data.services);
      setProcess(data.process);
      setPlans(data.plans);
    });
  }, []);

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
                key={s.id}
                className={`rounded-2xl p-6 border border-gray-100 ${s.border} hover:shadow-xl transition-all duration-300 bg-gradient-to-br ${s.color} group`}
              >
                <div className="text-4xl mb-4">{s.icon}</div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${s.badge}`}>
                  {s.title}
                </span>
                <p className="text-gray-600 text-sm leading-relaxed mt-3 mb-5">{s.desc}</p>
                <ul className="space-y-2">
                  {parseFeatures(s.features).map((f) => (
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
              <div key={p.id} className="relative bg-white rounded-2xl p-6 border border-gray-100 hover:border-violet-200 hover:shadow-lg transition-all duration-300">
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
                key={plan.id}
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
                  {parseFeatures(plan.features).map((f) => (
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

                <a href="/contact"
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

        <a href="/contact"
          className="inline-block px-8 py-4 bg-white text-violet-700 font-bold rounded-xl hover:bg-violet-50 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          Book Free Consultation →
        </a>
      </section>

    </div>
  );
}