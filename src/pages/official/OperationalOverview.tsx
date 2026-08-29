import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Sidebar } from '../../components/common/Sidebar';
import { KopargaonMap } from '../../components/map/KopargaonMap';

export const OperationalOverview: React.FC = () => {
  const { user } = useAuth();
  const { buses, schedules, shipments, trafficReports, safetyAlerts, trafficRegions } = useData();
  const [isSyncing, setIsSyncing] = useState(false);
  const navigate = useNavigate();

  const activeBuses = buses.filter(b => b.status === 'ACTIVE' || b.status === 'DELAYED');
  const delayedBuses = buses.filter(b => b.status === 'DELAYED');
  const depotBuses = buses.filter(b => b.status === 'AT DEPOT');
  const activeShipments = shipments.filter(s => s.currentStatus !== 'DELIVERED');
  const totalCargoAvailable = buses.reduce((a, b) => a + b.availableCargoKg, 0);
  const pendingTrafficReports = trafficReports.filter(r => r.status === 'REPORTED' || r.status === 'ACKNOWLEDGED');

  return (
    <div className="min-h-screen flex bg-[#f8f2fa] font-sans">
      {/* Official Desktop Sidebar */}
      <Sidebar />

      {/* Main Command Center Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header matching Stitch Operational_Overview__Desktop_.html */}
        <header className="h-16 bg-white/95 backdrop-blur-md border-b border-[#cbc4d2]/40 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse"></span>
            <span className="text-xs font-extrabold text-[#1d1b20] uppercase tracking-wider">
              Kopargaon Mobility Command Center
            </span>
            <span className="text-xs text-gray-400">|</span>
            <span className="text-xs text-gray-500">Live Telemetry Active</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setIsSyncing(true);
                setTimeout(() => setIsSyncing(false), 1200);
              }}
              disabled={isSyncing}
              className="bg-[#765b00] hover:bg-[#594400] text-white text-xs font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-xs disabled:opacity-50"
            >
              <span className={`material-symbols-outlined text-[16px] ${isSyncing ? 'animate-spin' : ''}`}>refresh</span>
              {isSyncing ? 'Syncing...' : 'Force Sync'}
            </button>
            <div className="h-4 w-px bg-gray-200"></div>
            <div className="text-right hidden sm:block">
              <div className="text-xs font-extrabold text-[#1d1b20]">{user?.name || 'Administrator'}</div>
              <div className="text-[10px] text-gray-500">{user?.department || 'Municipal HQ'}</div>
            </div>
          </div>
        </header>

        <main className="p-6 space-y-6 max-w-7xl w-full mx-auto">
          {/* Subheader Title */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-5 rounded-2xl border border-[#cbc4d2]/40 shadow-xs">
            <div>
              <h1 className="text-2xl font-black text-[#1d1b20] tracking-tight">
                Operational Command Overview
              </h1>
              <p className="text-xs text-[#494551] mt-0.5">
                Real-time monitoring of active MSRTC buses, freight logistics, depot bays, and citizen traffic alerts.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => navigate('/official/schedules')}
                className="bg-[#4f378a] hover:bg-[#382467] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                Create Schedule
              </button>
              <button
                onClick={() => navigate('/official/alerts')}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">warning</span>
                Issue Alert
              </button>
            </div>
          </div>

          {/* 4 Operational KPIs matching Stitch Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* KPI 1: Active Fleet */}
            <div className="bg-white p-5 rounded-2xl border border-[#cbc4d2]/40 shadow-xs relative overflow-hidden group">
              <div className="flex justify-between items-start">
                <div className="w-11 h-11 bg-[#e1d4fd] text-[#4f378a] rounded-xl flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[24px]">directions_bus</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span>
                  {activeBuses.length} on Route
                </span>
              </div>
              <div className="mt-3">
                <div className="text-3xl font-black text-[#1d1b20]">{buses.length}</div>
                <div className="text-xs font-bold text-[#494551] uppercase tracking-wider mt-0.5">
                  Total Fleet (MSRTC Depot)
                </div>
              </div>
            </div>

            {/* KPI 2: Active Shipments */}
            <div className="bg-white p-5 rounded-2xl border border-[#cbc4d2]/40 shadow-xs relative overflow-hidden group">
              <div className="flex justify-between items-start">
                <div className="w-11 h-11 bg-[#FFD814]/30 text-[#765b00] rounded-xl flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[24px]">local_shipping</span>
                </div>
                <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                  {shipments.filter(s => s.currentStatus === 'IN TRANSIT').length} In Transit
                </span>
              </div>
              <div className="mt-3">
                <div className="text-3xl font-black text-[#1d1b20]">{activeShipments.length}</div>
                <div className="text-xs font-bold text-[#494551] uppercase tracking-wider mt-0.5">
                  Active Cargo Shipments
                </div>
              </div>
            </div>

            {/* KPI 3: Bus Cargo Capacity */}
            <div className="bg-white p-5 rounded-2xl border border-[#cbc4d2]/40 shadow-xs relative overflow-hidden group">
              <div className="flex justify-between items-start">
                <div className="w-11 h-11 bg-emerald-100 text-emerald-800 rounded-xl flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[24px]">inventory_2</span>
                </div>
                <span className="text-[11px] font-bold text-gray-600">Bus Bays</span>
              </div>
              <div className="mt-3">
                <div className="text-3xl font-black text-[#1d1b20]">{totalCargoAvailable} <span className="text-base font-normal text-gray-500">kg</span></div>
                <div className="text-xs font-bold text-[#494551] uppercase tracking-wider mt-0.5">
                  Available Bus Cargo Space
                </div>
              </div>
            </div>

            {/* KPI 4: Critical Alerts */}
            <div className="bg-red-50 p-5 rounded-2xl border border-red-200 shadow-xs relative overflow-hidden group">
              <div className="flex justify-between items-start">
                <div className="w-11 h-11 bg-red-600 text-white rounded-xl flex items-center justify-center font-bold shadow-xs">
                  <span className="material-symbols-outlined text-[24px]">warning</span>
                </div>
                <Link to="/official/alerts" className="text-red-700 hover:text-red-900 p-1">
                  <span className="material-symbols-outlined text-[20px]">open_in_new</span>
                </Link>
              </div>
              <div className="mt-3">
                <div className="text-3xl font-black text-red-900">{safetyAlerts.filter(a => a.active).length}</div>
                <div className="text-xs font-bold text-red-700 uppercase tracking-wider mt-0.5">
                  Active Safety Advisories
                </div>
              </div>
            </div>
          </div>

          {/* Main Operational Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Live Map & Immediate Action Required */}
            <div className="lg:col-span-2 space-y-6">
              {/* Map Card */}
              <div className="bg-white rounded-2xl p-5 border border-[#cbc4d2]/40 shadow-xs space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-extrabold text-sm text-[#1d1b20] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#765b00]">my_location</span>
                    Live Operational Fleet & Congestion Tracking
                  </h3>
                  <Link to="/official/map" className="text-xs font-bold text-[#765b00] hover:underline">
                    Expand Full Map →
                  </Link>
                </div>

                <div className="h-[380px] rounded-xl overflow-hidden border border-[#cbc4d2]/40">
                  <KopargaonMap isOfficial={true} height="380px" />
                </div>
              </div>

              {/* Immediate Actions Required (Requirement: NOT Analytics!) */}
              <div className="bg-white rounded-2xl p-5 border border-[#cbc4d2]/40 shadow-xs space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-extrabold text-sm text-[#1d1b20] flex items-center gap-2">
                    <span className="material-symbols-outlined text-red-600">task_alt</span>
                    Immediate Operational Actions Required ({delayedBuses.length + pendingTrafficReports.length})
                  </h3>
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Live Dispatch Queue</span>
                </div>

                <div className="space-y-2.5">
                  {/* Delayed Bus Action */}
                  {delayedBuses.map((bus) => (
                    <div key={bus.id} className="p-3.5 bg-red-50/80 rounded-xl border border-red-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div>
                        <div className="font-bold text-xs text-red-900">
                          ⚠️ Bus {bus.busNumber} Delayed by {bus.delayMins} mins on {bus.currentStop} → {bus.destination}
                        </div>
                        <div className="text-[11px] text-red-700 mt-0.5">
                          Driver: {bus.driverName} ({bus.contactNumber}) • {bus.passengerOccupied} Passengers onboard
                        </div>
                      </div>
                      <button
                        onClick={() => navigate('/official/fleet')}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-xs"
                      >
                        Adjust Schedule
                      </button>
                    </div>
                  ))}

                  {/* Citizen Traffic Report Action */}
                  {pendingTrafficReports.slice(0, 2).map((rep) => (
                    <div key={rep.id} className="p-3.5 bg-amber-50/80 rounded-xl border border-amber-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div className="flex items-center gap-3">
                        <img src={rep.photoUrl} alt="Report" className="w-10 h-10 object-cover rounded-lg border border-amber-300 shrink-0" />
                        <div>
                          <div className="font-bold text-xs text-amber-950">
                            📸 Traffic Report: {rep.roadName} ({rep.severity})
                          </div>
                          <div className="text-[11px] text-amber-800 mt-0.5">
                            "{rep.description}" • Reported by {rep.userName} at {rep.timestamp}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate('/official/traffic-safety')}
                        className="px-3 py-1 bg-[#765b00] hover:bg-[#594400] text-white text-xs font-bold rounded-lg shadow-xs shrink-0"
                      >
                        Review Photo & Issue Alert
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Depot Status & Traffic Highlights */}
            <div className="space-y-6">
              {/* Bus Depot Status */}
              <div className="bg-white rounded-2xl p-5 border border-[#cbc4d2]/40 shadow-xs space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-extrabold text-sm text-[#1d1b20] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#765b00]">warehouse</span>
                    Kopargaon Bus Depot
                  </h3>
                  <Link to="/official/depot" className="text-xs font-bold text-[#765b00] hover:underline">
                    Depot Details →
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 bg-[#fdf7ff] rounded-xl border border-gray-100">
                    <span className="text-[10px] text-gray-500 font-bold block">BUSES AT DEPOT</span>
                    <span className="text-lg font-black text-[#1d1b20]">{depotBuses.length}</span>
                  </div>
                  <div className="p-3 bg-[#fdf7ff] rounded-xl border border-gray-100">
                    <span className="text-[10px] text-gray-500 font-bold block">IN WORKSHOP</span>
                    <span className="text-lg font-black text-amber-700">
                      {buses.filter(b => b.status === 'MAINTENANCE').length}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <div className="text-[11px] font-bold text-gray-500 uppercase">Current Bay Allocations:</div>
                  {buses.filter(b => b.depotBay).map(b => (
                    <div key={b.id} className="flex justify-between text-xs py-1 border-b border-gray-100">
                      <span className="font-bold text-[#1d1b20]">{b.busNumber}</span>
                      <span className="text-gray-600">{b.depotBay} ({b.status})</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Traffic Severity Corridors */}
              <div className="bg-white rounded-2xl p-5 border border-[#cbc4d2]/40 shadow-xs space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-extrabold text-sm text-[#1d1b20] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-amber-700">traffic</span>
                    Road Congestion Status
                  </h3>
                  <Link to="/official/traffic-safety" className="text-xs font-bold text-[#765b00] hover:underline">
                    Review Reports →
                  </Link>
                </div>

                <div className="space-y-2">
                  {trafficRegions.map((reg) => (
                    <div key={reg.id} className="p-2.5 bg-[#fdf7ff] rounded-xl border border-gray-100 flex justify-between items-center">
                      <div>
                        <div className="font-bold text-xs text-[#1d1b20]">{reg.name}</div>
                        <div className="text-[10px] text-gray-500">{reg.reportCount} reports received • Avg {reg.avgSpeedKmph} km/h</div>
                      </div>
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        reg.currentTraffic === 'RED' ? 'bg-red-100 text-red-700' :
                        reg.currentTraffic === 'ORANGE' ? 'bg-orange-100 text-orange-800' :
                        reg.currentTraffic === 'YELLOW' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {reg.currentTraffic}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
