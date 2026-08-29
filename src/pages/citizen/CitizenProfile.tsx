import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, CitizenRole } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Navbar, LOGO_URL } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';

export const CitizenProfile: React.FC = () => {
  const { user, logout, updateProfile, setCitizenRole } = useAuth();
  const { shipments, trips, trafficReports } = useData();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '+91 98220 11223');
  const [location, setLocation] = useState(user?.location || 'Kopargaon, Maharashtra');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, phone, location });
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleSwitchRole = (newRole: CitizenRole) => {
    setCitizenRole(newRole);
    if (newRole === 'FARMER') navigate('/citizen/farmer');
    else if (newRole === 'TRANSPORTER') navigate('/citizen/transporter');
    else navigate('/citizen');
  };

  const userShipments = shipments.filter(s => s.farmerId === user?.id || s.farmerName.includes(user?.name?.split(' ')[0] || ''));
  const userTrips = trips.filter(t => t.transporterId === user?.id || t.transporterName.includes(user?.name?.split(' ')[0] || ''));
  const userReports = trafficReports.filter(r => r.userName.includes(user?.name?.split(' ')[0] || ''));

  return (
    <div className="min-h-screen flex flex-col bg-[#fdf7ff] font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Profile Card Header matching Stitch My_Profile.html */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#cbc4d2]/40 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="w-24 h-24 rounded-2xl bg-[#e1d4fd] text-[#4f378a] flex items-center justify-center font-black text-3xl shrink-0 shadow-md border-2 border-white">
              {user?.name ? user.name[0] : 'U'}
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl font-black text-[#1d1b20]">{user?.name || 'Citizen User'}</h1>
                <span className="bg-[#e1d4fd] text-[#4f378a] text-xs font-extrabold px-3 py-0.5 rounded-full">
                  {user?.citizenRole === 'FARMER' ? '🌾 Farmer / Goods Sender' :
                   user?.citizenRole === 'TRANSPORTER' ? '🚛 Private Transporter' : '👤 General Citizen'}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{user?.email} • Member since 2026</p>
              <p className="text-xs text-[#494551] mt-0.5 font-medium flex items-center justify-center sm:justify-start gap-1">
                <span className="material-symbols-outlined text-[16px] text-[#4f378a]">location_on</span>
                {user?.location || 'Kopargaon Taluka, Ahmednagar'}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 border border-[#4f378a] text-[#4f378a] hover:bg-[#f2ecf4] rounded-xl text-xs font-bold transition-colors"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>

          {saveSuccess && (
            <div className="mt-4 p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-base">check_circle</span>
              Profile updated successfully!
            </div>
          )}
        </div>

        {/* Edit Form Modal/Drawer if editing */}
        {isEditing && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#4f378a]/30 animate-in fade-in">
            <h2 className="text-sm font-extrabold text-[#1d1b20] mb-4">Edit Profile Information</h2>
            <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-[#f8f2fa] text-xs text-black rounded-xl p-2.5 border border-[#cbc4d2] focus:outline-none focus:border-[#4f378a]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600">Contact Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-[#f8f2fa] text-xs text-black rounded-xl p-2.5 border border-[#cbc4d2] focus:outline-none focus:border-[#4f378a]"
                />
              </div>

              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-xs font-semibold text-gray-600">Village / Residential Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-[#f8f2fa] text-xs text-black rounded-xl p-2.5 border border-[#cbc4d2] focus:outline-none focus:border-[#4f378a]"
                />
              </div>

              <div className="sm:col-span-2 flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#4f378a] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#382467]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Switch Active Citizen Role (Requirement) */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#cbc4d2]/40 space-y-4">
          <h2 className="text-sm font-extrabold text-[#1d1b20] uppercase tracking-wider flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#4f378a]">swap_horiz</span>
            Switch Platform Portal & Role
          </h2>
          <p className="text-xs text-gray-500">
            Switch between Farmer Logistics, Private Transporter Dispatch, and General Citizen view without re-authenticating.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => handleSwitchRole('FARMER')}
              className={`p-4 rounded-xl border text-left transition-all flex flex-col gap-2 ${
                user?.citizenRole === 'FARMER'
                  ? 'border-[#4f378a] bg-[#4f378a]/5 shadow-xs ring-1 ring-[#4f378a]/30'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <span className="material-symbols-outlined">agriculture</span>
              </div>
              <div>
                <div className="text-xs font-extrabold text-[#1d1b20]">Farmer Portal</div>
                <div className="text-[11px] text-gray-500 mt-0.5">Send goods & Connect AI</div>
              </div>
            </button>

            <button
              onClick={() => handleSwitchRole('TRANSPORTER')}
              className={`p-4 rounded-xl border text-left transition-all flex flex-col gap-2 ${
                user?.citizenRole === 'TRANSPORTER'
                  ? 'border-[#4f378a] bg-[#4f378a]/5 shadow-xs ring-1 ring-[#4f378a]/30'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                <span className="material-symbols-outlined">local_shipping</span>
              </div>
              <div>
                <div className="text-xs font-extrabold text-[#1d1b20]">Transporter Portal</div>
                <div className="text-[11px] text-gray-500 mt-0.5">Publish trips & freight</div>
              </div>
            </button>

            <button
              onClick={() => handleSwitchRole('GENERAL_CITIZEN')}
              className={`p-4 rounded-xl border text-left transition-all flex flex-col gap-2 ${
                user?.citizenRole === 'GENERAL_CITIZEN'
                  ? 'border-[#4f378a] bg-[#4f378a]/5 shadow-xs ring-1 ring-[#4f378a]/30'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                <span className="material-symbols-outlined">person</span>
              </div>
              <div>
                <div className="text-xs font-extrabold text-[#1d1b20]">General Citizen</div>
                <div className="text-[11px] text-gray-500 mt-0.5">Buses, map & traffic</div>
              </div>
            </button>
          </div>
        </div>

        {/* Activity Statistics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-[#cbc4d2]/40 text-center shadow-xs">
            <div className="text-2xl font-black text-[#4f378a]">{userShipments.length}</div>
            <div className="text-xs font-bold text-gray-700 mt-0.5">Active Shipments</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-[#cbc4d2]/40 text-center shadow-xs">
            <div className="text-2xl font-black text-purple-700">{userTrips.length}</div>
            <div className="text-xs font-bold text-gray-700 mt-0.5">Published Trips</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-[#cbc4d2]/40 text-center shadow-xs">
            <div className="text-2xl font-black text-amber-700">{userReports.length}</div>
            <div className="text-xs font-bold text-gray-700 mt-0.5">Traffic Reports</div>
          </div>
        </div>

        {/* Sign Out Button */}
        <div className="pt-2 flex justify-center">
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="px-6 py-2.5 bg-red-50 text-red-700 hover:bg-red-100 text-xs font-bold rounded-xl transition-colors flex items-center gap-2 border border-red-200"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Sign Out of Account
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};
