import React, { useState } from 'react';
import { Sidebar } from '../../components/common/Sidebar';
import { useData } from '../../context/DataContext';
import { SafetyAlert } from '../../lib/mockData';

export const AlertManagementCenter: React.FC = () => {
  const { safetyAlerts, createSafetyAlert, toggleAlertActive } = useData();

  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: 'Bridge Inspection & Single-Lane Transit',
    category: 'ROAD_CLOSURE' as SafetyAlert['category'],
    severity: 'WARNING' as SafetyAlert['severity'],
    location: 'Godavari Bridge Bypass, Kopargaon',
    description: 'Municipal engineering inspection between 10:00 AM to 03:00 PM. Expect minor single-lane traffic delays.',
    issuedBy: 'Kopargaon Municipal Engineering Dept',
    expiresAt: 'Today, 05:00 PM'
  });

  const [alertSuccess, setAlertSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createSafetyAlert(formData);
    setAlertSuccess(true);
    setTimeout(() => {
      setAlertSuccess(false);
      setIsCreating(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex bg-[#f8f2fa] font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 bg-white/95 backdrop-blur-md border-b border-[#cbc4d2]/40 px-6 flex items-center justify-between sticky top-0 z-30">
          <div>
            <h1 className="text-lg font-black text-[#1d1b20] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#765b00]">notifications_active</span>
              Alert Management Center
            </h1>
            <p className="text-[11px] text-gray-500">Official incident broadcasting, traffic advisories, and municipal emergency bulletins</p>
          </div>

          <button
            onClick={() => setIsCreating(true)}
            className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add_alert</span>
            Create New Alert
          </button>
        </header>

        <main className="p-6 space-y-6 max-w-7xl w-full mx-auto">
          {/* Create Alert Modal matching Stitch Alert_Management_Center.html */}
          {isCreating && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-red-500 shadow-xl animate-in fade-in space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-black text-[#1d1b20]">Create Public Safety Bulletin</h2>
                  <p className="text-xs text-gray-500">Alerts will immediately be broadcasted across citizen portals and mobile notifications.</p>
                </div>
                <button onClick={() => setIsCreating(false)} className="text-gray-400 hover:text-black">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {alertSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">check_circle</span>
                  Official alert broadcasted successfully!
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1 sm:col-span-2">
                    <label className="font-semibold text-gray-600">Alert Headline *</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="bg-[#f8f2fa] text-xs p-2.5 rounded-xl border border-[#cbc4d2] font-bold"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-gray-600">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as SafetyAlert['category'] })}
                      className="bg-[#f8f2fa] text-xs p-2.5 rounded-xl border border-[#cbc4d2] font-bold"
                    >
                      <option value="TRAFFIC">Traffic Congestion</option>
                      <option value="ROAD_CLOSURE">Road Work & Diversions</option>
                      <option value="BUS_DELAY">MSRTC Bus Delay</option>
                      <option value="WEATHER">Monsoon / Weather</option>
                      <option value="SAFETY_ADVISORY">General Safety Advisory</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-gray-600">Severity Level *</label>
                    <select
                      value={formData.severity}
                      onChange={(e) => setFormData({ ...formData, severity: e.target.value as SafetyAlert['severity'] })}
                      className="bg-[#f8f2fa] text-xs p-2.5 rounded-xl border border-[#cbc4d2] font-bold"
                    >
                      <option value="CRITICAL">CRITICAL (Red Alert)</option>
                      <option value="WARNING">WARNING (High Priority)</option>
                      <option value="ADVISORY">ADVISORY (Medium)</option>
                      <option value="INFO">INFO (Standard Bulletin)</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-gray-600">Location Landmark *</label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="bg-[#f8f2fa] text-xs p-2.5 rounded-xl border border-[#cbc4d2]"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-gray-600">Expiry Time</label>
                    <input
                      type="text"
                      value={formData.expiresAt}
                      onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                      className="bg-[#f8f2fa] text-xs p-2.5 rounded-xl border border-[#cbc4d2]"
                    />
                  </div>

                  <div className="flex flex-col gap-1 sm:col-span-2">
                    <label className="font-semibold text-gray-600">Advisory Details & Detour Instructions *</label>
                    <textarea
                      rows={3}
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="bg-[#f8f2fa] text-xs p-2.5 rounded-xl border border-[#cbc4d2]"
                    ></textarea>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[18px]">campaign</span>
                    Broadcast Official Alert
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Active Alerts List */}
          <div className="bg-white rounded-2xl border border-[#cbc4d2]/40 shadow-xs p-6 space-y-4">
            <h2 className="text-sm font-extrabold text-[#1d1b20]">Active & Published Municipal Bulletins</h2>

            <div className="space-y-3">
              {safetyAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-5 rounded-2xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                    !alert.active ? 'bg-gray-50 opacity-60 border-gray-200' :
                    alert.severity === 'CRITICAL' ? 'bg-red-50/70 border-red-200' :
                    alert.severity === 'WARNING' ? 'bg-amber-50/70 border-amber-200' :
                    'bg-[#fdf7ff] border-[#cbc4d2]/40'
                  }`}
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        alert.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                        alert.severity === 'WARNING' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {alert.severity}
                      </span>
                      <h3 className="font-extrabold text-sm text-[#1d1b20]">{alert.title}</h3>
                      <span className="text-xs text-gray-500">• {alert.location}</span>
                    </div>

                    <p className="text-xs text-gray-700 leading-relaxed max-w-3xl">
                      {alert.description}
                    </p>

                    <div className="text-[11px] text-gray-500 flex items-center gap-4">
                      <span>Issued: {alert.issuedBy}</span>
                      <span>•</span>
                      <span>Broadcast: {alert.timestamp}</span>
                      <span>•</span>
                      <span>Expires: {alert.expiresAt}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => toggleAlertActive(alert.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                        alert.active
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {alert.active ? 'Mark Resolved' : 'Reactivate'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
