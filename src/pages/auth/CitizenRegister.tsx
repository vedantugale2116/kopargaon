import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LOGO_URL } from '../../components/common/Navbar';

export const CitizenRegister: React.FC = () => {
  const { registerCitizen } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dob: '',
    location: 'Kopargaon',
    termsAccepted: false
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(0);

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

    // Strict request locking: prevent multiple submissions while running
    if (isSubmitting || cooldown > 0) return;

    setError('');

    if (!formData.fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    if (!formData.termsAccepted) {
      setError('Please accept the Terms & Conditions and Privacy Policy to proceed.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await registerCitizen({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        dob: formData.dob,
        location: formData.location
      });

      if (res.success) {
        navigate('/citizen/role');
      } else {
        const errorMsg = res.error || 'Registration failed. Please check your details.';
        setError(errorMsg);
        if (errorMsg.toLowerCase().includes('too many') || errorMsg.toLowerCase().includes('rate limit')) {
          setCooldown(15);
        }
      }
    } catch (err: any) {
      setError('An unexpected registration error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5eff7] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8 relative z-10 border border-[#cbc4d2]/40 my-8 animate-in fade-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 mb-2 rounded-full bg-[#f2ecf4] flex items-center justify-center shadow-inner overflow-hidden border-2 border-[#e9ddff] p-2">
            <img alt="Kopargaon Connect Logo" className="w-full h-full object-contain" src={LOGO_URL} />
          </div>
          <h1 className="text-2xl font-bold text-[#1d1b20] text-center tracking-tight">Citizen Registration</h1>
          <p className="text-xs text-[#494551] mt-1 text-center">
            Create your account to access rural logistics, public bus freight, and live mobility.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <span className="material-symbols-outlined text-base shrink-0">error</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          {/* Full Name */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#4b4263] ml-1" htmlFor="fullName">
              Full Name *
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#7a7582] text-[18px] pointer-events-none">
                person
              </span>
              <input
                id="fullName"
                type="text"
                required
                disabled={isSubmitting}
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="e.g. Balasaheb Vikhe"
                className="w-full bg-[#f8f2fa] text-[#1d1b20] text-sm rounded-xl py-2 pl-9 pr-3 border border-[#e0e2e6] focus:outline-none focus:border-[#4f378a] transition-all disabled:opacity-60"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#4b4263] ml-1" htmlFor="email">
              Email Address (Login ID) *
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#7a7582] text-[18px] pointer-events-none">
                mail
              </span>
              <input
                id="email"
                type="email"
                required
                disabled={isSubmitting}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@example.com"
                className="w-full bg-[#f8f2fa] text-[#1d1b20] text-sm rounded-xl py-2 pl-9 pr-3 border border-[#e0e2e6] focus:outline-none focus:border-[#4f378a] transition-all disabled:opacity-60"
              />
            </div>
          </div>

          {/* Location & DOB in Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#4b4263] ml-1" htmlFor="location">
                City / Village *
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#7a7582] text-[18px] pointer-events-none">
                  location_on
                </span>
                <input
                  id="location"
                  type="text"
                  required
                  disabled={isSubmitting}
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Kopargaon / Shirdi / Sanvatsar"
                  className="w-full bg-[#f8f2fa] text-[#1d1b20] text-sm rounded-xl py-2 pl-9 pr-3 border border-[#e0e2e6] focus:outline-none focus:border-[#4f378a] transition-all disabled:opacity-60"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#4b4263] ml-1" htmlFor="dob">
                Date of Birth
              </label>
              <input
                id="dob"
                type="date"
                disabled={isSubmitting}
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                className="w-full bg-[#f8f2fa] text-[#1d1b20] text-sm rounded-xl py-2 px-3 border border-[#e0e2e6] focus:outline-none focus:border-[#4f378a] transition-all disabled:opacity-60"
              />
            </div>
          </div>

          {/* Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#4b4263] ml-1" htmlFor="password">
                Password *
              </label>
              <input
                id="password"
                type="password"
                required
                disabled={isSubmitting}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Min 6 chars"
                className="w-full bg-[#f8f2fa] text-[#1d1b20] text-sm rounded-xl py-2 px-3 border border-[#e0e2e6] focus:outline-none focus:border-[#4f378a] transition-all disabled:opacity-60"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#4b4263] ml-1" htmlFor="confirmPassword">
                Confirm Password *
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                disabled={isSubmitting}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Re-enter password"
                className="w-full bg-[#f8f2fa] text-[#1d1b20] text-sm rounded-xl py-2 px-3 border border-[#e0e2e6] focus:outline-none focus:border-[#4f378a] transition-all disabled:opacity-60"
              />
            </div>
          </div>

          {/* Terms & Conditions Checkbox */}
          <div className="flex items-start gap-2 pt-2">
            <input
              id="terms"
              type="checkbox"
              disabled={isSubmitting}
              checked={formData.termsAccepted}
              onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
              className="mt-1 w-4 h-4 rounded text-[#4f378a] focus:ring-[#4f378a] disabled:opacity-60"
            />
            <label htmlFor="terms" className="text-xs text-[#494551] leading-tight cursor-pointer">
              I agree to the <span className="text-[#4f378a] font-semibold">Terms of Service</span> and <span className="text-[#4f378a] font-semibold">Municipal Data Privacy Policy</span> for Kopargaon Connect.
            </label>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting || cooldown > 0}
            className="w-full bg-[#4f378a] text-white font-bold text-sm py-3 rounded-xl mt-3 hover:bg-[#382467] active:scale-[0.98] transition-all shadow-md flex justify-center items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <span>CREATING ACCOUNT...</span>
            ) : cooldown > 0 ? (
              <span>PLEASE WAIT ({cooldown}s)</span>
            ) : (
              <>
                <span>CREATE ACCOUNT</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-5 text-center">
          <p className="text-xs text-[#494551]">
            Already have an account?{' '}
            <Link to="/citizen/login" className="text-[#4f378a] font-bold hover:underline">
              Sign In Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
