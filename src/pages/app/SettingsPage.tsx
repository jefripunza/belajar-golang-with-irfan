import { useState } from "react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    weekly: true,
    marketing: false,
  });

  const tabs = [
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "account", label: "Account", icon: "🔐" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "appearance", label: "Appearance", icon: "🎨" },
    { id: "billing", label: "Billing", icon: "💳" },
  ];

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`w-11 h-6 rounded-full transition relative ${
        checked ? "bg-violet-600" : "bg-gray-200"
      }`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
          checked ? "translate-x-5 left-0.5" : "left-0.5"
        }`}
      />
    </button>
  );

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-400 text-sm mt-1">
          Manage your account preferences
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* Sidebar Tabs */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white/80 backdrop-blur border border-gray-100 rounded-2xl p-2 shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-violet-50 to-indigo-50 text-violet-700 shadow-sm"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white/80 backdrop-blur border border-gray-100 rounded-2xl p-8 shadow-sm">

          {/* PROFILE */}
          {activeTab === "profile" && (
            <div className="space-y-8">

              <h2 className="font-semibold text-gray-900 text-lg">
                Profile Settings
              </h2>

              {/* Avatar */}
              <div className="flex items-center gap-6">

                <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                  A
                </div>

                <div>
                  <button className="px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-xl hover:bg-violet-700 transition">
                    Change Photo
                  </button>
                  <p className="text-xs text-gray-400 mt-2">
                    JPG, PNG max 2MB
                  </p>
                </div>

              </div>

              {/* Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                {[
                  { label: "First Name", value: "Alice" },
                  { label: "Last Name", value: "Johnson" },
                  { label: "Email", value: "alice@nexora.com" },
                  { label: "Phone", value: "+62 812 3456 7890" },
                  { label: "Role", value: "CEO & Founder" },
                  { label: "Location", value: "Jakarta, Indonesia" },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {f.label}
                    </label>

                    <input
                      defaultValue={f.value}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700
                      focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100
                      transition"
                    />
                  </div>
                ))}
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>

                <textarea
                  rows={3}
                  defaultValue="CEO & Founder of Nexora. Passionate about technology and design."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700
                  focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 resize-none"
                />
              </div>

              <button className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:from-violet-700 hover:to-indigo-700 shadow transition">
                Save Changes
              </button>

            </div>
          )}

          {/* NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <div className="space-y-6">

              <h2 className="font-semibold text-gray-900 text-lg">
                Notification Preferences
              </h2>

              <div className="space-y-4">

                {[
                  { key: "email", label: "Email Notifications", desc: "Receive updates and alerts via email" },
                  { key: "push", label: "Push Notifications", desc: "Browser push notifications" },
                  { key: "weekly", label: "Weekly Digest", desc: "Weekly summary of activity" },
                  { key: "marketing", label: "Marketing Emails", desc: "Product updates and announcements" },
                ].map((item) => (

                  <div
                    key={item.key}
                    className="flex items-center justify-between p-5 bg-gray-50 hover:bg-gray-100 rounded-xl transition"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {item.label}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {item.desc}
                      </p>
                    </div>

                    <Toggle
                      checked={notifications[item.key as keyof typeof notifications]}
                      onChange={() =>
                        setNotifications((prev) => ({
                          ...prev,
                          [item.key]: !prev[item.key as keyof typeof notifications],
                        }))
                      }
                    />
                  </div>

                ))}

              </div>

            </div>
          )}

          {/* COMING SOON */}
          {(activeTab === "appearance" || activeTab === "billing") && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="text-5xl mb-4">
                {tabs.find(t => t.id === activeTab)?.icon}
              </span>

              <h2 className="font-semibold text-gray-900 text-lg mb-2 capitalize">
                {activeTab} Settings
              </h2>

              <p className="text-gray-400 text-sm">
                This section is coming soon.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}