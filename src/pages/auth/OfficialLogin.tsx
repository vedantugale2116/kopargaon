import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LOGO_URL } from '../../components/common/Navbar';

export const OfficialLogin: React.FC = () => {
  const { loginOfficial } = useAuth();
  const navigate = useNavigate();

  const [officialId, setOfficialId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await loginOfficial(officialId, password);
    setLoading(false);

    if (res.success) {
      navigate('/official');
    } else {
      setError(res.error || 'Access Denied. Please verify your official credentials.');
    }
  };

  const handleQuickOfficialLogin = async (id: string, pass: string) => {
    setOfficialId(id);
    setPassword(pass);
    setLoading(true);
    const res = await loginOfficial(id, pass);
    setLoading(false);
    if (res.success) {
      navigate('/official');
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Official ID / Email */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#494551] ml-1" htmlFor="official-id">
              Official ID or Department Email
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#7a7582] text-[20px] pointer-events-none">
                badge
              </span>
              <input
                id="official-id"
                type="text"
                required
                value={officialId}
                onChange={(e) => setOfficialId(e.target.value)}
                placeholder="e.g. ADM-01 or admin@kopargaon.gov.in"
                className="w-full bg-[#fdf7ff] text-[#1d1b20] text-sm rounded-xl py-2.5 pl-10 pr-3 border border-[#cbc4d2] focus:outline-none focus:border-[#765b00] focus:ring-1 focus:ring-[#765b00] transition-all"
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
                onClick={() => setResetSent(true)}
                className="text-[11px] text-[#765b00] hover:underline font-semibold"
              >
                Forgot Password?
              </button>
            </div>
            {resetSent && (
              <div className="text-[11px] text-amber-800 font-semibold bg-amber-50 p-2 rounded-lg border border-amber-200">
                Official password recovery request sent to Municipal IT Administration.
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
                className="w-full bg-[#fdf7ff] text-[#1d1b20] text-sm rounded-xl py-2.5 pl-10 pr-10 border border-[#cbc4d2] focus:outline-none focus:border-[#765b00] focus:ring-1 focus:ring-[#765b00] transition-all"
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

          {/* Sign In Button with #FFD814 / #765b00 theme from Stitch */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#765b00] hover:bg-[#594400] active:bg-[#403000] text-white font-bold text-sm py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mt-2 shadow-sm disabled:opacity-50"
          >
            {loading ? (
              <span>AUTHENTICATING OFFICIAL...</span>
            ) : (
              <>
                <span>SIGN IN TO OFFICIAL PORTAL</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Pre-authorized Official Logins */}
        <div className="mt-5 pt-4 border-t border-gray-100">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 text-center">
            Pre-Authorized Official Roles (1-Click Demo Access)
          </div>
          <div className="space-y-1.5">
            <button
              onClick={() => handleQuickOfficialLogin('admin@kopargaon.gov.in', 'adminpassword')}
              className="w-full px-3 py-2 bg-[#FFD814]/15 hover:bg-[#FFD814]/30 text-[#765b00] rounded-xl text-xs font-bold transition-colors flex items-center justify-between border border-[#FFD814]/40"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base">admin_panel_settings</span>
                <span>Municipal HQ Admin (Full System)</span>
              </div>
              <span className="text-[10px] text-gray-500 font-mono">ADM-01</span>
            </button>

            <button
              onClick={() => handleQuickOfficialLogin('depot@kopargaon.gov.in', 'depotpassword')}
              className="w-full px-3 py-2 bg-[#f8f2fa] hover:bg-[#e1d4fd] text-[#4f378a] rounded-xl text-xs font-bold transition-colors flex items-center justify-between border border-[#cbc4d2]/30"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base">warehouse</span>
                <span>Depot Operations Manager</span>
              </div>
              <span className="text-[10px] text-gray-500 font-mono">DEPOT-04</span>
            </button>

            <button
              onClick={() => handleQuickOfficialLogin('safety@kopargaon.gov.in', 'safetypassword')}
              className="w-full px-3 py-2 bg-[#f8f2fa] hover:bg-[#e1d4fd] text-[#4f378a] rounded-xl text-xs font-bold transition-colors flex items-center justify-between border border-[#cbc4d2]/30"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base">traffic</span>
                <span>Traffic & Road Safety Bureau</span>
              </div>
              <span className="text-[10px] text-gray-500 font-mono">TRAFFIC-09</span>
            </button>
          </div>
        </div>

        {/* System Trust Badge */}
        <div className="w-full mt-5 pt-3 border-t border-gray-100 flex items-center justify-center gap-2">
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
