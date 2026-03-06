import { useEffect, useState } from "react";
import { getAnalytic } from "@/services/analytic.service";
import type { AnalyticStat } from "@/types/analytic";
import { getFeatures } from "@/services/feature.service";
import type { Feature } from "@/types/feature";

export default function HomePage() {
  const [stats, setStats] = useState<AnalyticStat[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);

  const fetchData = async () => {
    const features = await getFeatures();
    const stats = await getAnalytic();

    setFeatures(features);
    setStats(stats);
  };

  useEffect(() => {
    console.log("Buka HomePage"); // componentDidMount & onMount
    fetchData();
    return () => {
      console.log("Tutup HomePage"); // componentDidUnmount & onUnmount
    };
  }, []);

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-white to-indigo-50 py-24 px-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-100/40 via-transparent to-transparent" />
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-violet-100 text-violet-700 text-xs font-semibold rounded-full mb-6">
            🎉 Now in Beta — Try it free
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Build faster with{" "}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Nexora
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            The modern platform to design, build, and launch stunning digital
            products — faster than ever before.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-violet-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Start for Free →
            </a>

            <a
              href="/portfolio"
              className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:border-violet-300 hover:text-violet-700 shadow-sm hover:shadow-md transition-all duration-200"
            >
              View Portfolio
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="text-4xl font-extrabold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500 mt-1 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Powerful features built for modern teams. Simple enough for
              individuals, powerful enough for enterprises.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-violet-200 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:bg-violet-100 transition-colors">
                  {f.icon}
                </div>
                <h3 className="text-gray-900 font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 px-6 bg-gradient-to-br from-violet-600 to-indigo-700">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-violet-200 mb-8 text-lg">
            Join thousands of teams building amazing products with Nexora.
          </p>

          <a
            href="/contact"
            className="inline-block px-8 py-4 bg-white text-violet-700 font-bold rounded-xl hover:bg-violet-50 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Start Free Trial →
          </a>
        </div>
      </section>
    </div>
  );
}
