import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../../components/common/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export const OfficialProfile: React.FC = () => {
  const { user, logout } = useAuth();
  const { resetToDemoDefaults } = useData();
  const [resetMessage, setResetMessage] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-[#f8f2fa] font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 bg-white/95 backdrop-blur-md border-b border-[#cbc4d2]/40 px-6 flex items-center justify-between sticky top-0 z-30">
          <div>
            <h1 className="text-lg font-black text-[#1d1b20] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#765b00]">settings</span>
              Official Profile & Municipal System Settings
            </h1>
            <p className="text-[11px] text-gray-500">Staff security credentials and administrative control dashboard</p>
          </div>
        </header>

        <main className="p-6 space-y-6 max-w-4xl w-full mx-auto">
          {/* Profile Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#cbc4d2]/40 shadow-xs space-y-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-[#765b00] text-white flex items-center justify-center font-black text-3xl shrink-0 shadow-md">
                {user?.name ? user.name[0] : 'A'}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-[#1d1b20]">{user?.name || 'Administrative Officer'}</h2>
                  <span className="bg-[#FFD814]/30 text-[#765b00] font-extrabold text-[10px] px-2.5 py-0.5 rounded-full border border-[#765b00]/30">
                    {user?.officialRole || 'ADMIN'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{user?.department || 'Municipal Smart Mobility & Logistics HQ'}</p>
                <div className="text-xs font-mono font-bold text-[#4f378a] mt-1">
                  Official ID: {user?.officialId || 'ADM-01'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100 text-xs">
              <div className="p-3.5 bg-[#f8f2fa] rounded-xl border border-gray-200">
                <span className="text-[10px] text-gray-400 font-bold uppercase">OFFICIAL EMAIL</span>
                <div className="font-bold text-[#1d1b20] mt-0.5">{user?.email || 'admin@kopargaon.gov.in'}</div>
              </div>

              <div className="p-3.5 bg-[#f8f2fa] rounded-xl border border-gray-200">
                <span className="text-[10px] text-gray-400 font-bold uppercase">MUNICIPAL JURISDICTION</span>
                <div className="font-bold text-[#1d1b20] mt-0.5">{user?.location || 'Kopargaon Municipal Corporation'}</div>
              </div>
            </div>
          </div>

          {/* System Control Settings */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#cbc4d2]/40 shadow-xs space-y-4">
            <h3 className="font-extrabold text-sm text-[#1d1b20] uppercase tracking-wider">
              Demonstration & System Management
            </h3>

            <div className="p-4 bg-[#fdf7ff] rounded-2xl border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <div className="font-bold text-xs text-[#1d1b20]">Reset All Datasets to Demo Default</div>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Restores initial buses, traffic reports, shipments, schedules, and alerts for a clean demonstration run.
                </p>
                {resetMessage && (
                  <p className="text-[11px] text-emerald-700 font-bold mt-1">
                    ✓ All datasets reset to initial Kopargaon demo state.
                  </p>
                )}
              </div>
              <button
                onClick={() => {
                  resetToDemoDefaults();
                  setResetMessage(true);
                  setTimeout(() => setResetMessage(false), 4000);
                }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold rounded-xl transition-colors shrink-0"
              >
                Reset Demo Data
              </button>
            </div>

            <div className="pt-2 flex justify-between items-center">
              <button
                onClick={() => navigate('/citizen')}
                className="text-xs font-bold text-[#4f378a] hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">visibility</span>
                View Public Citizen Portal
              </button>

              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="px-6 py-2 bg-red-50 text-red-700 hover:bg-red-100 font-bold text-xs rounded-xl border border-red-200 transition-colors flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
                Sign Out of Official Portal
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
