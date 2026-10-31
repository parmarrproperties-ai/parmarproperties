import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { signIn } from "@/lib/auth";

export const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn(email, password);
      navigate("/admin", { replace: true });
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4] flex items-center justify-center p-6 font-['Instrument_Sans']">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="mb-10 text-center">
          <h1 className="text-[28px] font-semibold tracking-[-0.04em] text-black">
            Parmar Properties
          </h1>
          <p className="text-sm text-black/40 mt-1 tracking-wide">Admin Portal</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-black/8 rounded-2xl p-8 shadow-[0_2px_16px_rgba(0,0,0,0.06)] flex flex-col gap-5"
        >
          <h2 className="text-[22px] font-semibold tracking-[-0.04em] text-black mb-1">
            Sign In
          </h2>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="admin-email" className="text-xs font-medium text-black/50 uppercase tracking-wider">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl border border-black/10 bg-[#f8f7f4] text-sm text-black placeholder-black/45 outline-none focus:ring-2 focus:ring-black/15 focus:border-black/30 transition-all duration-200"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="admin-password" className="text-xs font-medium text-black/50 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-10 rounded-xl border border-black/10 bg-[#f8f7f4] text-sm text-black placeholder-black/45 outline-none focus:ring-2 focus:ring-black/15 focus:border-black/30 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 hover:text-black/60 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            id="admin-login-submit"
            type="submit"
            disabled={loading}
            className="w-full mt-1 py-3.5 px-6 rounded-xl bg-black text-white text-sm font-medium tracking-wide hover:bg-black/85 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in…
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="text-center text-xs text-black/30 mt-6">
          Parmar Properties Admin — Restricted Access
        </p>
      </div>
    </div>
  );
};
