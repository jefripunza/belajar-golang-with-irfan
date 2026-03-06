import { useState } from "react";
import { NavLink } from "react-router";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"request" | "sent">("request");

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">

        {step === "request" ? (
          <>
            {/* Heading */}
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-white text-2xl">🔑</span>
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900">Forgot your password?</h1>
              <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                No worries! Enter your email and we'll send you a reset link.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">📧</span>
                  <input
                    type="email"
                    placeholder="john@email.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
                  />
                </div>
              </div>

              <button
                onClick={() => setStep("sent")}
                className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-violet-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 text-sm"
              >
                Send Reset Link →
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Success State */}
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                <span className="text-white text-3xl">✉️</span>
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900 mb-3">Check your email</h1>
              <p className="text-gray-400 text-sm leading-relaxed mb-2">
                We've sent a password reset link to
              </p>
              <p className="text-violet-600 font-semibold text-sm mb-6">john@email.com</p>

              {/* Steps */}
              <div className="bg-gray-50 rounded-xl p-4 text-left space-y-3 mb-6">
                {[
                  "Open the email we sent you",
                  "Click the 'Reset Password' button",
                  "Create a new strong password",
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-6 h-6 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {i + 1}
                    </div>
                    {step}
                  </div>
                ))}
              </div>

              <p className="text-xs text-gray-400 mb-5">
                Didn't receive an email? Check your spam folder or{" "}
                <button
                  onClick={() => setStep("request")}
                  className="text-violet-600 hover:underline font-medium"
                >
                  try again
                </button>
              </p>

              <NavLink
                to="/auth/login"
                className="block w-full py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-violet-700 hover:to-indigo-700 text-sm text-center shadow-lg hover:shadow-xl transition-all"
              >
                Back to Sign In →
              </NavLink>
            </div>
          </>
        )}
      </div>

      <p className="text-center text-sm text-gray-500 mt-6">
        Remember your password?{" "}
        <NavLink to="/auth/login" className="text-violet-600 font-semibold hover:underline">
          Sign in →
        </NavLink>
      </p>
    </div>
  );
}