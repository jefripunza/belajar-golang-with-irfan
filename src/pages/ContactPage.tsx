import { useEffect, useState } from "react";
import { getContactPageData } from "@/services/contact.service";
import type { ContactCard, OfficeHour, ResponseTime, Social, FAQ } from "@/types/contact";

export default function ContactPage() {
  const [contacts,  setContacts]  = useState<ContactCard[]>([]);
  const [hours,     setHours]     = useState<OfficeHour[]>([]);
  const [responses, setResponses] = useState<ResponseTime[]>([]);
  const [socials,   setSocials]   = useState<Social[]>([]);
  const [faqs,      setFaqs]      = useState<FAQ[]>([]);

  useEffect(() => {
    getContactPageData().then((data) => {
      setContacts(data.contact_cards);
      setHours(data.office_hours);
      setResponses(data.response_times);
      setSocials(data.socials);
      setFaqs(data.faqs);
    });
  }, []);

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-violet-50 via-white to-indigo-50 py-24 px-6 text-center">
        <span className="inline-block px-3 py-1 bg-violet-100 text-violet-700 text-xs font-semibold rounded-full mb-6">
          Get In Touch
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 max-w-3xl mx-auto leading-tight">
          Let's build something{" "}
          <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            great together
          </span>
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
          Have a project in mind or just want to chat? Fill out the form below
          or reach out directly — we'd love to hear from you.
        </p>
      </section>

      {/* Contact Cards */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {contacts.map((c) => (
            <div
              key={c.id}
              className={`bg-gradient-to-br ${c.color} border border-gray-100 ${c.border} rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 group`}
            >
              <div className="text-4xl mb-3">{c.icon}</div>
              <h3 className="font-bold text-gray-900 mb-1">{c.title}</h3>
              <p className="text-gray-400 text-xs mb-3">{c.desc}</p>
              <p className="text-violet-600 font-semibold text-sm">{c.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Form + Info */}
      <section className="py-10 px-6 pb-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Form */}
          <div className="lg:col-span-3 bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Send us a message
            </h2>
            <p className="text-gray-400 text-sm mb-8">
              We'll get back to you within 24 hours.
            </p>

            <div className="space-y-5">
              {/* Name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Full Name <span className="text-violet-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email Address <span className="text-violet-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="john@email.com"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
                  />
                </div>
              </div>

              {/* Company + Budget */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Company
                  </label>
                  <input
                    type="text"
                    placeholder="Your company name"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Budget Range
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all bg-white appearance-none">
                    <option value="">Select budget...</option>
                    <option>Under $1,000</option>
                    <option>$1,000 – $5,000</option>
                    <option>$5,000 – $15,000</option>
                    <option>$15,000 – $50,000</option>
                    <option>$50,000+</option>
                  </select>
                </div>
              </div>

              {/* Service */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Service Needed
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {["UI/UX Design", "Web Dev", "Mobile App", "Cloud & DevOps", "AI Integration", "Security"].map((s) => (
                    <label
                      key={s}
                      className="flex items-center gap-2 px-3 py-2.5 border border-gray-200 rounded-xl text-xs text-gray-600 cursor-pointer hover:border-violet-300 hover:bg-violet-50 transition-all group"
                    >
                      <input type="checkbox" className="accent-violet-600 w-3.5 h-3.5" />
                      <span className="group-hover:text-violet-700">{s}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Message <span className="text-violet-500">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell us about your project, goals, timeline..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all resize-none"
                />
              </div>

              {/* Submit */}
              <button className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-violet-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 text-sm">
                Send Message →
              </button>

              <p className="text-center text-xs text-gray-400">
                By submitting this form, you agree to our{" "}
                <a href="#" className="text-violet-500 hover:underline">Privacy Policy</a>.
              </p>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Office Hours */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 mb-4">🕐 Office Hours</h3>
              <ul className="space-y-3 text-sm">
                {hours.map((h) => (
                  <li key={h.id} className="flex items-center justify-between">
                    <span className="text-gray-500">{h.day}</span>
                    <span className={`font-semibold ${h.time === "Closed" ? "text-red-400" : "text-gray-800"}`}>
                      {h.time}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Response Time */}
            <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl p-6 border border-violet-100">
              <h3 className="font-bold text-gray-900 mb-4">⚡ Response Time</h3>
              <div className="space-y-3">
                {responses.map((r) => (
                  <div key={r.id}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600 font-medium">{r.label}</span>
                      <span className="text-gray-400">{r.time}</span>
                    </div>
                    <div className="h-1.5 bg-white rounded-full overflow-hidden">
                      <div className={`h-full ${r.bar} bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Socials */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 mb-4">🌐 Follow Us</h3>
              <div className="grid grid-cols-2 gap-2">
                {socials.map((s) => (
                  <a
                    key={s.id}
                    href={s.url}
                    className="flex items-center gap-2 px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-600 hover:border-violet-300 hover:text-violet-700 hover:bg-violet-50 transition-all duration-200"
                  >
                    <span>{s.emoji}</span>
                    <span>{s.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Quick answers to the questions we hear most often.
            </p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.id}
                className="group bg-white border border-gray-100 hover:border-violet-200 rounded-2xl px-6 py-5 transition-all duration-200 cursor-pointer"
              >
                <summary className="flex items-center justify-between font-semibold text-gray-900 text-sm list-none">
                  {faq.question}
                  <span className="ml-4 flex-shrink-0 w-6 h-6 bg-violet-50 rounded-full flex items-center justify-center text-violet-600 text-xs group-open:rotate-45 transition-transform duration-300">
                    +
                  </span>
                </summary>
                <p className="text-gray-500 text-sm leading-relaxed mt-4 pt-4 border-t border-gray-100">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-gradient-to-br from-violet-600 to-indigo-700 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Still not sure? Let's chat.
        </h2>
        <p className="text-violet-200 mb-8 text-lg max-w-xl mx-auto">
          Book a free 30-minute discovery call and we'll help you figure out the best next step.
        </p>
        <a
          href="#"
          className="inline-block px-8 py-4 bg-white text-violet-700 font-bold rounded-xl hover:bg-violet-50 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          Book a Free Call →
        </a>
      </section>
    </div>
  );
}