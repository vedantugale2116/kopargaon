import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LOGO_URL } from '../../components/common/Navbar';
import { CITIZEN_DEMO_ACCOUNTS } from '../../lib/authHelpers';

export const CitizenLogin: React.FC = () => {
  const { loginCitizen, resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const fromPath = (location.state as any)?.from?.pathname;

  // Short cooldown timer for client-side throttling if rate-limited
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const performLogin = async (loginEmail: string, loginPass: string) => {
    // Strict request locking: prevent multiple simultaneous submissions
    if (isSubmitting || cooldown > 0) return;

    setError('');
    setResetMessage('');
    setIsSubmitting(true);

    try {
      const res = await loginCitizen(loginEmail, loginPass);
      if (res.success) {
        if (fromPath && fromPath.startsWith('/citizen')) {
          navigate(fromPath, { replace: true });
        } else if (res.citizenRole === 'FARMER') {
          navigate('/citizen/farmer');
        } else if (res.citizenRole === 'TRANSPORTER') {
          navigate('/citizen/transporter');
        } else {
          navigate('/citizen');
        }
      } else {
        const errorMsg = res.error || 'Invalid email or password.';
        setError(errorMsg);
        if (errorMsg.toLowerCase().includes('too many') || errorMsg.toLowerCase().includes('rate limit')) {
          setCooldown(15);
        }
      }
    } catch (err: any) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await performLogin(email, password);
  };

  const handleDemoSelect = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    performLogin(demoEmail, demoPass);
  };

  const handleForgotPassword = async () => {
    if (isSubmitting || resetLoading) return;

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter your registered email address in the field above to receive a password reset link.');
      return;
    }

    setError('');
    setResetLoading(true);

    try {
      const res = await resetPassword(email);
      if (res.success) {
        setResetMessage('Password reset link sent to your registered email.');
      } else {
        setError(res.error || 'Could not send password reset link. Please verify your email.');
      }
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5eff7] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background SVG circles */}
      <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
          <circle cx="20" cy="30" fill="#4f378a" opacity="0.4" r="40"></circle>
          <circle cx="80" cy="70" fill="#6750a4" opacity="0.3" r="50"></circle>
        </svg>
      </div>

      {/* Main Login Card matching Stitch Citizen_Login.html */}
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 sm:p-8 relative z-10 border border-[#cbc4d2]/40 animate-in fade-in zoom-in-95 duration-300">
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 mb-3 rounded-full bg-[#f2ecf4] flex items-center justify-center shadow-inner overflow-hidden border-2 border-[#e9ddff] p-2">
            <img
              alt="Kopargaon Connect Logo"
              className="w-full h-full object-contain"
              src={LOGO_URL}
            />
          </div>
          <h1 className="text-2xl font-bold text-[#1d1b20] text-center tracking-tight">Citizen Login</h1>
          <p className="text-xs text-[#494551] mt-1 text-center">
            Welcome back. Please enter your email and password.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <span className="material-symbols-outlined text-base shrink-0">error</span>
            <span>{error}</span>
          </div>
        )}

        {resetMessage && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
            <span className="material-symbols-outlined text-base shrink-0">mark_email_read</span>
            <span>{resetMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email Field */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#4b4263] ml-1" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#7a7582] text-[20px] pointer-events-none">
                mail
              </span>
              <input
                id="email"
                type="email"
                required
                disabled={isSubmitting}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="citizen@example.com"
                className="w-full bg-[#f8f2fa] text-[#1d1b20] text-sm rounded-xl py-2.5 pl-10 pr-3 border border-[#e0e2e6] focus:outline-none focus:border-[#4f378a] focus:ring-1 focus:ring-[#4f378a] transition-all disabled:opacity-60"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-semibold text-[#4b4263]" htmlFor="password">
                Password
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={isSubmitting || resetLoading}
                className="text-[11px] text-[#4f378a] hover:underline font-medium disabled:opacity-50 cursor-pointer"
              >
                {resetLoading ? 'Sending link...' : 'Forgot Password?'}
              </button>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#7a7582] text-[20px] pointer-events-none">
                lock
              </span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                disabled={isSubmitting}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#f8f2fa] text-[#1d1b20] text-sm rounded-xl py-2.5 pl-10 pr-10 border border-[#e0e2e6] focus:outline-none focus:border-[#4f378a] focus:ring-1 focus:ring-[#4f378a] transition-all disabled:opacity-60"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7a7582] hover:text-[#1d1b20]"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || cooldown > 0}
            className="w-full bg-[#C8D9E6] text-[#22005d] font-bold text-sm py-3 rounded-xl mt-2 hover:bg-[#b0c8dc] active:scale-[0.98] transition-all shadow-xs flex justify-center items-center gap-2 group disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <span>SIGNING IN...</span>
            ) : cooldown > 0 ? (
              <span>WAIT ({cooldown}s)</span>
            ) : (
              <>
                <span>SIGN IN</span>
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </>
            )}
          </button>
        </form>

        {/* Demo Accounts Section */}
        <div className="mt-5 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-[#4f378a]">badge</span>
              Use Demo Account
            </span>
            <span className="text-[10px] text-gray-400">Live Supabase Auth</span>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {CITIZEN_DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.id}
                type="button"
                disabled={isSubmitting}
                onClick={() => handleDemoSelect(acc.email, acc.password)}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#f8f2fa] hover:bg-[#ede5f7] border border-[#e4dcf1] transition-all text-center cursor-pointer group disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-base text-[#4f378a] group-hover:scale-110 transition-transform">
                  {acc.icon}
                </span>
                <span className="text-[10px] font-semibold text-[#1d1b20] mt-0.5 leading-tight">
                  {acc.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Don't have an account options */}
        <div className="mt-5 flex flex-col items-center gap-3">
          <p className="text-xs text-[#494551]">Don't have an account?</p>
          <div className="w-full">
            <Link
              to="/citizen/register"
              className="block w-full border border-[#4f378a] text-[#4f378a] font-bold text-xs py-2.5 rounded-xl hover:bg-[#f2ecf4] transition-colors text-center"
            >
              Create Account
            </Link>
          </div>

          <Link to="/" className="text-[11px] text-gray-500 hover:text-gray-800 mt-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">arrow_back</span>
            Back to Landing Page
          </Link>
        </div>
      </div>
    </div>
  );
};
