import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LOGO_URL } from '../../components/common/Navbar';

export const OfficialLogin: React.FC = () => {
  const { loginOfficial, resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [officialId, setOfficialId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Strict request locking: prevent multiple simultaneous submissions
    if (isSubmitting || cooldown > 0) return;

    setError('');
    setResetSent(false);
    setIsSubmitting(true);

    try {
      const res = await loginOfficial(officialId, password);
      if (res.success) {
        if (fromPath && fromPath.startsWith('/official')) {
          navigate(fromPath, { replace: true });
        } else if (res.officialRole === 'DEPOT_MANAGER') {
          navigate('/official/depot');
        } else if (res.officialRole === 'TRAFFIC_SAFETY_OFFICIAL') {
          navigate('/official/traffic-safety');
        } else {
          navigate('/official');
        }
      } else {
        const errorMsg = res.error || 'Invalid official ID/email or password.';
        setError(errorMsg);
        if (errorMsg.toLowerCase().includes('too many') || errorMsg.toLowerCase().includes('rate limit')) {
          setCooldown(15);
        }
      }
    } catch (err: any) {
      setError('An unexpected official authentication error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async () => {
    if (isSubmitting || resetLoading) return;

    if (!officialId.trim() || !officialId.includes('@')) {
      setError('Please enter your official department email in the field above to receive a recovery link.');
      return;
    }

    setError('');
    setResetLoading(true);

    try {
      const res = await resetPassword(officialId);
      if (res.success) {
        setResetSent(true);
      } else {
        setError(res.error || 'Official password recovery failed. Please contact Municipal IT Support.');
      }
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf7ff] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-[#cbc4d2]/40 p-6 sm:p-8 relative z-10 animate-in fade-in zoom-in-95 duration-300">
        {/* Logo and Header matching Stitch Official_Portal_Login.html */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-[#f2ecf4] flex items-center justify-center p-2 border border-[#cbc4d2] overflow-hidden mb-3">
            <img alt="Kopargaon Connect Logo" className="w-full h-full object-contain" src={LOGO_URL} />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#1d1b20] tracking-tight">Official Portal</h1>
            <p className="text-xs text-[#494551] mt-0.5">Secure Access for Administrative & Depot Staff</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <span className="material-symbols-outlined text-base shrink-0">error</span>
            <span>{error}</span>
          </div>
        )}

        {resetSent && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl flex items-center gap-2">
            <span className="material-symbols-outlined text-base shrink-0">mark_email_read</span>
            <span>Official password reset link sent to your registered department email.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Official ID / Email */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#494551] ml-1" htmlFor="official-id">
              Official Department Email
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#7a7582] text-[20px] pointer-events-none">
                badge
              </span>
              <input
                id="official-id"
                type="text"
                required
                disabled={isSubmitting}
                value={officialId}
                onChange={(e) => setOfficialId(e.target.value)}
                placeholder="official@kopargaon.gov.in"
                className="w-full bg-[#fdf7ff] text-[#1d1b20] text-sm rounded-xl py-2.5 pl-10 pr-3 border border-[#cbc4d2] focus:outline-none focus:border-[#765b00] focus:ring-1 focus:ring-[#765b00] transition-all disabled:opacity-60"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-semibold text-[#494551]" htmlFor="password">
                Password
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={isSubmitting || resetLoading}
                className="text-[11px] text-[#765b00] hover:underline font-semibold disabled:opacity-50 cursor-pointer"
              >
                {resetLoading ? 'Sending...' : 'Forgot Password?'}
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
                className="w-full bg-[#fdf7ff] text-[#1d1b20] text-sm rounded-xl py-2.5 pl-10 pr-10 border border-[#cbc4d2] focus:outline-none focus:border-[#765b00] focus:ring-1 focus:ring-[#765b00] transition-all disabled:opacity-60"
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

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={isSubmitting || cooldown > 0}
            className="w-full bg-[#765b00] hover:bg-[#594400] active:bg-[#403000] text-white font-bold text-sm py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mt-2 shadow-sm disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <span>AUTHENTICATING OFFICIAL...</span>
            ) : cooldown > 0 ? (
              <span>WAIT ({cooldown}s)</span>
            ) : (
              <>
                <span>SIGN IN TO OFFICIAL PORTAL</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        {/* System Trust Badge */}
        <div className="w-full mt-6 pt-3 border-t border-gray-100 flex items-center justify-center gap-2">
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
          </div>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
            Municipal Logistics Server Active
          </span>
        </div>

        <div className="mt-3 text-center">
          <Link to="/" className="text-xs text-gray-500 hover:text-gray-800 flex items-center justify-center gap-1">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back to Public Portal
          </Link>
        </div>
      </div>
    </div>
  );
};
