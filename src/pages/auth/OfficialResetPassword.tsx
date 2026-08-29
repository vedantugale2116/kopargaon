import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LOGO_URL } from '../../components/common/Navbar';

export const OfficialResetPassword: React.FC = () => {
  const { updatePassword, logout } = useAuth();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    setError('');

    if (!password) {
      setError('Please enter a new password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await updatePassword(password);
      if (res.success) {
        setSuccess(true);
        // Clear recovery session state so user must log in freshly
        await logout();
      } else {
        setError(res.error || 'Failed to update password. The reset link may have expired.');
      }
    } catch (err: any) {
      setError('An unexpected error occurred while updating your password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf7ff] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-[#cbc4d2]/40 p-6 sm:p-8 relative z-10 animate-in fade-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-[#f2ecf4] flex items-center justify-center p-2 border border-[#cbc4d2] overflow-hidden mb-3">
            <img alt="Kopargaon Connect Logo" className="w-full h-full object-contain" src={LOGO_URL} />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#1d1b20] tracking-tight">Official Password Update</h1>
            <p className="text-xs text-[#494551] mt-0.5">Secure Password Reset for Municipal Staff</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <span className="material-symbols-outlined text-base shrink-0">error</span>
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="flex flex-col items-center text-center py-4 space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">check_circle</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-gray-900">Password Updated Successfully</h3>
              <p className="text-xs text-gray-600">
                Your password has been changed. Please log in to the Official Portal with your new password.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/official/login')}
              className="w-full bg-[#765b00] hover:bg-[#594400] text-white font-bold text-sm py-3 rounded-xl transition-colors shadow-sm cursor-pointer"
            >
              Sign In to Official Portal
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* New Password */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#494551] ml-1" htmlFor="new-password">
                New Password (min 6 characters) *
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#7a7582] text-[20px] pointer-events-none">
                  lock
                </span>
                <input
                  id="new-password"
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

            {/* Confirm Password */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#494551] ml-1" htmlFor="confirm-password">
                Confirm New Password *
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#7a7582] text-[20px] pointer-events-none">
                  lock_reset
                </span>
                <input
                  id="confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  disabled={isSubmitting}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#fdf7ff] text-[#1d1b20] text-sm rounded-xl py-2.5 pl-10 pr-3 border border-[#cbc4d2] focus:outline-none focus:border-[#765b00] focus:ring-1 focus:ring-[#765b00] transition-all disabled:opacity-60"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#765b00] hover:bg-[#594400] active:bg-[#403000] text-white font-bold text-sm py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mt-2 shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <span>UPDATING PASSWORD...</span>
              ) : (
                <>
                  <span>UPDATE PASSWORD</span>
                  <span className="material-symbols-outlined text-[18px]">check</span>
                </>
              )}
            </button>

            <div className="mt-3 text-center">
              <Link to="/official/login" className="text-xs text-gray-500 hover:text-gray-800 flex items-center justify-center gap-1">
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Cancel & Return to Official Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
