import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';

export const CitizenPortal: React.FC = () => {
  const { user, setCitizenRole } = useAuth();
  const { buses, trafficRegions, safetyAlerts, schedules } = useData();
  const navigate = useNavigate();

  const activeBuses = buses.filter(b => b.status === 'ACTIVE' || b.status === 'DELAYED');
  const criticalAlerts = safetyAlerts.filter(a => a.active);
  const totalAvailableCargo = buses.reduce((acc, b) => acc + b.availableCargoKg, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#fdf7ff] font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Welcome Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#cbc4d2]/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#e1d4fd]/30 to-transparent pointer-events-none"></div>
          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#e1d4fd] text-[#4f378a]">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
                Kopargaon Smart Mobility Live
              </div>
              <button
                type="button"
                onClick={() => {
                  setCitizenRole('FARMER');
                  navigate('/citizen/farmer');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#e1d4fd] text-[#4f378a] hover:bg-[#cfbcff] active:scale-95 transition-all cursor-pointer border border-[#4f378a]/20 shadow-2xs"
                title="Switch to Farmer Portal"
              >
                <span>GENERAL CITIZEN</span>
                <span className="material-symbols-outlined text-[15px]">swap_horiz</span>
                <span className="text-[10px] text-[#4f378a]/80 font-semibold">Switch to Farmer</span>
              </button>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1d1b20] tracking-tight">
              Namaste, {user?.name || 'Citizen'}!
            </h1>
            <p className="text-sm text-[#494551] mt-1 max-w-xl">
              Plan your travel, track rural MSRTC buses, book parcel cargo space, or check real-time traffic conditions across Kopargaon.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap gap-2">
            <button
              onClick={() => navigate('/citizen/journey')}
              className="bg-[#4f378a] hover:bg-[#382467] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-sm flex items-center gap-2 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">alt_route</span>
              Plan Journey
            </button>
            <button
              onClick={() => navigate('/citizen/farmer/send-goods')}
              className="bg-[#C8D9E6] hover:bg-[#b0c8dc] text-[#22005d] px-5 py-2.5 rounded-xl font-bold text-xs shadow-sm flex items-center gap-2 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">local_shipping</span>
              Send Goods
            </button>
          </div>
        </div>

        {/* Live System Operational Overview Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-xs border border-[#cbc4d2]/30 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#e1d4fd] text-[#4f378a] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">directions_bus</span>
            </div>
            <div>
              <div className="text-xl font-extrabold text-[#1d1b20]">{activeBuses.length}</div>
              <div className="text-xs font-semibold text-[#494551]">Active Buses on Route</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-xs border border-[#cbc4d2]/30 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">inventory_2</span>
            </div>
            <div>
              <div className="text-xl font-extrabold text-[#1d1b20]">{totalAvailableCargo} kg</div>
              <div className="text-xs font-semibold text-[#494551]">Available Bus Cargo</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-xs border border-[#cbc4d2]/30 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">traffic</span>
            </div>
            <div>
              <div className="text-xl font-extrabold text-[#1d1b20]">{trafficRegions.filter(r => r.reportCount > 0).length}</div>
              <div className="text-xs font-semibold text-[#494551]">Active Traffic Reports</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-xs border border-[#cbc4d2]/30 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">warning</span>
            </div>
            <div>
              <div className="text-xl font-extrabold text-red-600">{criticalAlerts.length}</div>
              <div className="text-xs font-semibold text-[#494551]">Road & Travel Advisories</div>
            </div>
          </div>
        </div>

        {/* Quick Action Grid matching Stitch Citizen_Portal.html */}
        <div>
          <h2 className="text-base font-extrabold text-[#1d1b20] mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4f378a]">apps</span>
            Citizen Transit & Logistics Services
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <Link
              to="/citizen/journey"
              className="bg-white p-4 rounded-2xl border border-[#cbc4d2]/40 hover:border-[#4f378a] hover:shadow-md transition-all flex flex-col items-center text-center group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#e1d4fd] text-[#4f378a] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[24px]">alt_route</span>
              </div>
              <span className="text-xs font-bold text-[#1d1b20]">Plan Journey</span>
              <span className="text-[10px] text-[#494551] mt-0.5">Route & Timings</span>
            </Link>

            <Link
              to="/citizen/bus-schedules"
              className="bg-white p-4 rounded-2xl border border-[#cbc4d2]/40 hover:border-[#4f378a] hover:shadow-md transition-all flex flex-col items-center text-center group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#e1d4fd] text-[#4f378a] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[24px]">schedule</span>
              </div>
              <span className="text-xs font-bold text-[#1d1b20]">Bus Schedules</span>
              <span className="text-[10px] text-[#494551] mt-0.5">MSRTC Timetable</span>
            </Link>

            <Link
              to="/citizen/map"
              className="bg-white p-4 rounded-2xl border border-[#cbc4d2]/40 hover:border-[#4f378a] hover:shadow-md transition-all flex flex-col items-center text-center group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#e1d4fd] text-[#4f378a] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[24px]">map</span>
              </div>
              <span className="text-xs font-bold text-[#1d1b20]">Live Map</span>
              <span className="text-[10px] text-[#494551] mt-0.5">Moving Buses & Roads</span>
            </Link>

            <Link
              to="/citizen/farmer/send-goods"
              className="bg-white p-4 rounded-2xl border border-[#cbc4d2]/40 hover:border-[#4f378a] hover:shadow-md transition-all flex flex-col items-center text-center group"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[24px]">local_shipping</span>
              </div>
              <span className="text-xs font-bold text-[#1d1b20]">Send Goods</span>
              <span className="text-[10px] text-[#494551] mt-0.5">Bus & Private Cargo</span>
            </Link>

            <Link
              to="/citizen/report-traffic"
              className="bg-white p-4 rounded-2xl border border-[#cbc4d2]/40 hover:border-[#4f378a] hover:shadow-md transition-all flex flex-col items-center text-center group"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[24px]">photo_camera</span>
              </div>
              <span className="text-xs font-bold text-[#1d1b20]">Report Traffic</span>
              <span className="text-[10px] text-[#494551] mt-0.5">Upload Photo</span>
            </Link>

            <Link
              to="/citizen/ev-stations"
              className="bg-white p-4 rounded-2xl border border-[#cbc4d2]/40 hover:border-[#4f378a] hover:shadow-md transition-all flex flex-col items-center text-center group"
            >
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[24px]">ev_station</span>
              </div>
              <span className="text-xs font-bold text-[#1d1b20]">EV Stations</span>
              <span className="text-[10px] text-[#494551] mt-0.5">Find Fast Chargers</span>
            </Link>
          </div>
        </div>

        {/* Dual Column: Next Departures & Active Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Next Departures with Bus Cargo Info */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-xs border border-[#cbc4d2]/40">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-bold text-sm text-[#1d1b20] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#4f378a]">departure_board</span>
                  Upcoming Bus Departures (Kopargaon Central)
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Live passenger & parcel cargo capacity utilization</p>
              </div>
              <Link to="/citizen/bus-schedules" className="text-xs font-bold text-[#4f378a] hover:underline">
                View All Schedules →
              </Link>
            </div>

            <div className="space-y-3">
              {schedules.slice(0, 3).map((sched) => (
                <div
                  key={sched.id}
                  className="p-3.5 rounded-xl bg-[#fdf7ff] border border-[#cbc4d2]/30 hover:border-[#4f378a]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs text-[#1d1b20]">{sched.busNumber}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        sched.status === 'DELAYED' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {sched.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-700 font-semibold mt-1">
                      {sched.origin} → {sched.destination}
                    </div>
                    <div className="text-[11px] text-gray-500 mt-0.5">
                      Departure: <strong className="text-[#1d1b20]">{sched.departureTime}</strong> | Arrival: {sched.arrivalTime}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    {/* Cargo capacity badge */}
                    <div className="bg-[#e1d4fd]/50 px-3 py-1.5 rounded-lg text-right">
                      <div className="text-[10px] text-[#4f378a] uppercase font-extrabold">Available Cargo</div>
                      <div className="text-xs font-extrabold text-[#22005d]">
                        {sched.availableCargoKg} kg <span className="text-[10px] font-normal text-gray-500">/ {sched.totalCargoKg} kg</span>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate('/citizen/farmer/send-goods')}
                      className="px-3 py-1.5 bg-[#4f378a] text-white text-xs font-bold rounded-lg hover:bg-[#382467] transition-colors"
                    >
                      Book Cargo
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Advisories & Quick Traffic */}
          <div className="space-y-4">
            {/* Safety Alerts Card */}
            <div className="bg-white rounded-2xl p-5 shadow-xs border border-[#cbc4d2]/40">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-sm text-[#1d1b20] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-red-600 text-[18px]">warning</span>
                  Active Road Advisories
                </h3>
                <Link to="/citizen/safety" className="text-xs text-[#4f378a] hover:underline font-bold">
                  All Alerts
                </Link>
              </div>

              <div className="space-y-2.5">
                {criticalAlerts.slice(0, 2).map((alert) => (
                  <div key={alert.id} className="p-3 bg-red-50/70 rounded-xl border border-red-200">
                    <div className="font-bold text-xs text-red-900">{alert.title}</div>
                    <p className="text-[11px] text-red-700 mt-1 line-clamp-2 leading-relaxed">{alert.description}</p>
                    <div className="text-[10px] text-red-500 mt-1 font-semibold">{alert.location} • {alert.timestamp}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Traffic Snapshot */}
            <div className="bg-white rounded-2xl p-5 shadow-xs border border-[#cbc4d2]/40">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-sm text-[#1d1b20] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#4f378a] text-[18px]">traffic</span>
                  Kopargaon Traffic Density
                </h3>
                <Link to="/citizen/map" className="text-xs text-[#4f378a] hover:underline font-bold">
                  View Map
                </Link>
              </div>

              <div className="space-y-2">
                {trafficRegions.map((reg) => (
                  <div key={reg.id} className="flex justify-between items-center text-xs py-1 border-b border-gray-100 last:border-0">
                    <span className="text-gray-700 font-medium truncate max-w-[170px]">{reg.name}</span>
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      reg.currentTraffic === 'RED' ? 'bg-red-100 text-red-700' :
                      reg.currentTraffic === 'ORANGE' ? 'bg-orange-100 text-orange-800' :
                      reg.currentTraffic === 'YELLOW' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {reg.currentTraffic} ({reg.reportCount} reports)
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate('/citizen/report-traffic')}
                className="w-full mt-3 py-2 bg-[#f8f2fa] text-[#4f378a] text-xs font-bold rounded-xl hover:bg-[#e1d4fd] transition-colors flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                Submit Traffic Photo Report
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
