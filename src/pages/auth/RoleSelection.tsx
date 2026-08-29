import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, CitizenRole } from '../../context/AuthContext';
import { LOGO_URL } from '../../components/common/Navbar';

export const RoleSelection: React.FC = () => {
  const { user, setCitizenRole } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<CitizenRole | null>(
    user?.citizenRole || 'FARMER'
  );

  const handleContinue = () => {
    if (!selectedRole) return;
    setCitizenRole(selectedRole);

    if (selectedRole === 'FARMER') {
      navigate('/citizen/farmer');
    } else if (selectedRole === 'TRANSPORTER') {
      navigate('/citizen/transporter');
    } else {
      navigate('/citizen');
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf7ff] flex flex-col items-center justify-center p-4 font-sans relative">
      <div className="w-full max-w-xl mx-auto py-8">
        {/* Top Branding */}
        <div className="text-center mb-8 flex flex-col items-center">
          <img src={LOGO_URL} alt="Logo" className="w-16 h-16 object-contain mb-3 drop-shadow-xs" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1d1b20] tracking-tight">
            How do you want to use Kopargaon Connect?
          </h1>
          <p className="text-sm text-[#494551] mt-2 max-w-md">
            Select your primary role to customize your experience. You can switch roles at any time from the top menu.
          </p>
        </div>

        {/* 3 Role Selection Cards matching Stitch Select_Your_Role.html */}
        <div className="space-y-4">
          {/* Role 1: Farmer */}
          <div
            onClick={() => setSelectedRole('FARMER')}
            className={`cursor-pointer w-full bg-white rounded-2xl p-5 border-2 transition-all relative overflow-hidden flex items-start gap-4 shadow-sm hover:shadow-md ${
              selectedRole === 'FARMER'
                ? 'border-[#4f378a] bg-[#4f378a]/5 ring-2 ring-[#4f378a]/20'
                : 'border-transparent hover:border-[#cbc4d2]'
            }`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
              selectedRole === 'FARMER' ? 'bg-[#4f378a] text-white shadow-xs' : 'bg-[#C8D9E6]/40 text-[#4f378a]'
            }`}>
              <span className="material-symbols-outlined text-[28px]">agriculture</span>
            </div>
            <div className="flex-1 pr-6">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-[#1d1b20]">FARMER / GOODS SENDER</h3>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">Agri Logistics</span>
              </div>
              <p className="text-xs text-[#494551] mt-1 leading-relaxed">
                Send agricultural produce, book public bus cargo space, use Connect AI to match private carriers, and track shipments live.
              </p>
            </div>
            <div className={`absolute right-4 top-1/2 -translate-y-1/2 transition-opacity ${
              selectedRole === 'FARMER' ? 'opacity-100 text-[#4f378a]' : 'opacity-0'
            }`}>
              <span className="material-symbols-outlined text-[28px]">check_circle</span>
            </div>
          </div>

          {/* Role 2: Transporter */}
          <div
            onClick={() => setSelectedRole('TRANSPORTER')}
            className={`cursor-pointer w-full bg-white rounded-2xl p-5 border-2 transition-all relative overflow-hidden flex items-start gap-4 shadow-sm hover:shadow-md ${
              selectedRole === 'TRANSPORTER'
                ? 'border-[#4f378a] bg-[#4f378a]/5 ring-2 ring-[#4f378a]/20'
                : 'border-transparent hover:border-[#cbc4d2]'
            }`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
              selectedRole === 'TRANSPORTER' ? 'bg-[#4f378a] text-white shadow-xs' : 'bg-[#C8D9E6]/40 text-[#4f378a]'
            }`}>
              <span className="material-symbols-outlined text-[28px]">local_shipping</span>
            </div>
            <div className="flex-1 pr-6">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-[#1d1b20]">PRIVATE VEHICLE TRANSPORTER</h3>
                <span className="bg-purple-100 text-purple-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">Freight Partner</span>
              </div>
              <p className="text-xs text-[#494551] mt-1 leading-relaxed">
                Publish available vehicle capacity (Pickups, Chhota Hathi, Trucks), receive booking requests from local farmers, and monetize empty trips.
              </p>
            </div>
            <div className={`absolute right-4 top-1/2 -translate-y-1/2 transition-opacity ${
              selectedRole === 'TRANSPORTER' ? 'opacity-100 text-[#4f378a]' : 'opacity-0'
            }`}>
              <span className="material-symbols-outlined text-[28px]">check_circle</span>
            </div>
          </div>

          {/* Role 3: General Citizen */}
          <div
            onClick={() => setSelectedRole('GENERAL_CITIZEN')}
            className={`cursor-pointer w-full bg-white rounded-2xl p-5 border-2 transition-all relative overflow-hidden flex items-start gap-4 shadow-sm hover:shadow-md ${
              selectedRole === 'GENERAL_CITIZEN'
                ? 'border-[#4f378a] bg-[#4f378a]/5 ring-2 ring-[#4f378a]/20'
                : 'border-transparent hover:border-[#cbc4d2]'
            }`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
              selectedRole === 'GENERAL_CITIZEN' ? 'bg-[#4f378a] text-white shadow-xs' : 'bg-[#C8D9E6]/40 text-[#4f378a]'
            }`}>
              <span className="material-symbols-outlined text-[28px]">person</span>
            </div>
            <div className="flex-1 pr-6">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-[#1d1b20]">GENERAL CITIZEN</h3>
                <span className="bg-blue-100 text-blue-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">Public Transit</span>
              </div>
              <p className="text-xs text-[#494551] mt-1 leading-relaxed">
                Plan daily journeys, view MSRTC bus schedules and passenger availability, report traffic photos, and find nearby EV charging stations.
              </p>
            </div>
            <div className={`absolute right-4 top-1/2 -translate-y-1/2 transition-opacity ${
              selectedRole === 'GENERAL_CITIZEN' ? 'opacity-100 text-[#4f378a]' : 'opacity-0'
            }`}>
              <span className="material-symbols-outlined text-[28px]">check_circle</span>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="mt-8">
          <button
            onClick={handleContinue}
            disabled={!selectedRole}
            className="w-full bg-[#4f378a] text-white font-bold text-sm py-3.5 rounded-full shadow-lg hover:bg-[#382467] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-40"
          >
            <span>GET STARTED</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
