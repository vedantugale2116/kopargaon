import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { VerificationBadge } from '../../components/common/VerificationBadge';

export const SafetyAlerts: React.FC = () => {
  const { safetyAlerts } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filteredAlerts = safetyAlerts.filter(a => {
    if (selectedCategory === 'ALL') return true;
    return a.category === selectedCategory;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#fdf7ff] font-sans">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-[#1d1b20] tracking-tight flex items-center gap-2">
              <span className="material-symbols-outlined text-red-600">notifications_active</span>
              Safety & Mobility Road Advisories
            </h1>
            <p className="text-xs text-[#494551] mt-0.5">
              Official bulletins on road works, traffic bottlenecks, MSRTC bus delays, and weather advisories across Kopargaon taluka.
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {['ALL', 'TRAFFIC', 'ROAD_CLOSURE', 'BUS_DELAY', 'WEATHER'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-[#4f378a] text-white shadow-xs'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-[#cbc4d2]/40'
              }`}
            >
              {cat === 'ALL' ? 'All Advisories' :
               cat === 'TRAFFIC' ? 'Traffic Warnings' :
               cat === 'ROAD_CLOSURE' ? 'Road Work & Closures' :
               cat === 'BUS_DELAY' ? 'MSRTC Bus Delays' : 'Monsoon / Weather'}
            </button>
          ))}
        </div>

        {/* Alerts Feed */}
        <div className="space-y-4">
          {filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-5 rounded-2xl border transition-all bg-white ${
                alert.severity === 'CRITICAL' ? 'border-red-300 shadow-sm ring-1 ring-red-200' :
                alert.severity === 'WARNING' ? 'border-amber-300 shadow-xs ring-1 ring-amber-200' :
                'border-[#cbc4d2]/40 shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    alert.severity === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                    alert.severity === 'WARNING' ? 'bg-amber-100 text-amber-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    <span className="material-symbols-outlined text-[22px]">
                      {alert.category === 'BUS_DELAY' ? 'departure_board' :
                       alert.category === 'WEATHER' ? 'cloud' :
                       alert.category === 'ROAD_CLOSURE' ? 'construction' : 'warning'}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-extrabold text-[#1d1b20]">{alert.title}</h3>
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        alert.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                        alert.severity === 'WARNING' ? 'bg-amber-100 text-amber-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {alert.severity}
                      </span>
                      <VerificationBadge status="VERIFIED" verifiedBy={alert.issuedBy} size="xs" />
                    </div>

                    <p className="text-xs text-gray-700 mt-1.5 leading-relaxed">
                      {alert.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">location_on</span>
                        <strong>{alert.location}</strong>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">verified_user</span>
                        Issued by: {alert.issuedBy}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                        {alert.timestamp} (Valid until {alert.expiresAt})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};
