import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LOGO_URL } from '../../components/common/Navbar';

export const CitizenLogin: React.FC = () => {
  const { loginCitizen } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await loginCitizen(email, password);
    setLoading(false);

    if (res.success) {
      navigate('/citizen/role');
    } else {
      setError(res.error || 'Invalid credentials');
    }
  };

  const handleQuickDemoLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    setLoading(true);
    const res = await loginCitizen(demoEmail, 'password123');
    setLoading(false);
    if (res.success) {
      navigate('/citizen/role');
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email Field (Strictly Email, NO OTP) */}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="farmer@kopargaon.gov.in"
                className="w-full bg-[#f8f2fa] text-[#1d1b20] text-sm rounded-xl py-2.5 pl-10 pr-3 border border-[#e0e2e6] focus:outline-none focus:border-[#4f378a] focus:ring-1 focus:ring-[#4f378a] transition-all"
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
                onClick={() => setResetSent(true)}
                className="text-[11px] text-[#4f378a] hover:underline font-medium"
              >
                Forgot Password?
              </button>
            </div>
            {resetSent && (
              <div className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                Password reset link sent to your registered email.
              </div>
            )}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#7a7582] text-[20px] pointer-events-none">
                lock
              </span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#f8f2fa] text-[#1d1b20] text-sm rounded-xl py-2.5 pl-10 pr-10 border border-[#e0e2e6] focus:outline-none focus:border-[#4f378a] focus:ring-1 focus:ring-[#4f378a] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7a7582] hover:text-[#1d1b20]"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {/* Submit Button with #C8D9E6 Accent Theme from Stitch */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C8D9E6] text-[#22005d] font-bold text-sm py-3 rounded-xl mt-2 hover:bg-[#b0c8dc] active:scale-[0.98] transition-all shadow-xs flex justify-center items-center gap-2 group disabled:opacity-50"
          >
            {loading ? (
              <span>AUTHENTICATING...</span>
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

        {/* Quick Demo Logins for Evaluation */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 text-center">
            One-Click Demo Credentials
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => handleQuickDemoLogin('farmer@kopargaon.gov.in')}
              className="px-2 py-1.5 bg-[#f8f2fa] hover:bg-[#e1d4fd] text-[#4f378a] rounded-lg text-[10px] font-bold transition-colors truncate"
            >
              🌾 Farmer
            </button>
            <button
              onClick={() => handleQuickDemoLogin('transporter@kopargaon.gov.in')}
              className="px-2 py-1.5 bg-[#f8f2fa] hover:bg-[#e1d4fd] text-[#4f378a] rounded-lg text-[10px] font-bold transition-colors truncate"
            >
              🚛 Transporter
            </button>
            <button
              onClick={() => handleQuickDemoLogin('citizen@kopargaon.gov.in')}
              className="px-2 py-1.5 bg-[#f8f2fa] hover:bg-[#e1d4fd] text-[#4f378a] rounded-lg text-[10px] font-bold transition-colors truncate"
            >
              👤 Citizen
            </button>
          </div>
        </div>

        {/* Don't have an account & Guest options */}
        <div className="mt-6 flex flex-col items-center gap-3">
          <p className="text-xs text-[#494551]">Don't have an account?</p>
          <div className="flex gap-2 w-full">
            <Link
              to="/citizen/register"
              className="flex-1 border border-[#4f378a] text-[#4f378a] font-bold text-xs py-2 rounded-xl hover:bg-[#f2ecf4] transition-colors text-center"
            >
              Create Account
            </Link>
            <button
              type="button"
              onClick={() => navigate('/citizen/role')}
              className="flex-1 bg-[#fdf7ff] text-[#4b4263] border border-[#e0e2e6] font-bold text-xs py-2 rounded-xl hover:bg-[#f2ecf4] transition-colors text-center"
            >
              Guest Mode
            </button>
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
