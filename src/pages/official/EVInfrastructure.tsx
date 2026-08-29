import React from 'react';
import { Sidebar } from '../../components/common/Sidebar';
import { useData } from '../../context/DataContext';

export const EVInfrastructure: React.FC = () => {
  const { evStations } = useData();

  const totalPorts = evStations.reduce((a, s) => a + s.totalChargers, 0);
  const availPorts = evStations.reduce((a, s) => a + s.availableChargers, 0);

  return (
    <div className="min-h-screen flex bg-[#f8f2fa] font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 bg-white/95 backdrop-blur-md border-b border-[#cbc4d2]/40 px-6 flex items-center justify-between sticky top-0 z-30">
          <div>
            <h1 className="text-lg font-black text-[#1d1b20] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#765b00]">ev_station</span>
              Municipal EV Infrastructure & Fleet Electrification
            </h1>
            <p className="text-[11px] text-gray-500">Power distribution monitoring, charger grid uptime, and rural expansion planning</p>
          </div>
        </header>

        <main className="p-6 space-y-6 max-w-7xl w-full mx-auto">
          {/* KPI Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-[#cbc4d2]/40 shadow-xs">
              <span className="text-[10px] text-gray-400 font-bold uppercase">TOTAL CHARGING HUBS</span>
              <div className="text-2xl font-black text-[#1d1b20] mt-1">{evStations.length} Hubs</div>
              <span className="text-[11px] text-gray-500">Kopargaon Taluka</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#cbc4d2]/40 shadow-xs">
              <span className="text-[10px] text-gray-400 font-bold uppercase">ACTIVE CHARGER PORTS</span>
              <div className="text-2xl font-black text-emerald-700 mt-1">{availPorts} / {totalPorts}</div>
              <span className="text-[11px] text-emerald-700 font-semibold">Available for use</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#cbc4d2]/40 shadow-xs">
              <span className="text-[10px] text-gray-400 font-bold uppercase">GRID POWER CAPACITY</span>
              <div className="text-2xl font-black text-purple-700 mt-1">252 kW</div>
              <span className="text-[11px] text-gray-500">Peak Municipal Load</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#cbc4d2]/40 shadow-xs">
              <span className="text-[10px] text-gray-400 font-bold uppercase">INFRASTRUCTURE UPTIME</span>
              <div className="text-2xl font-black text-blue-700 mt-1">99.4%</div>
              <span className="text-[11px] text-gray-500">Solar + Grid Hybrid</span>
            </div>
          </div>

          {/* Existing Stations List */}
          <div className="bg-white rounded-2xl border border-[#cbc4d2]/40 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-[#cbc4d2]/30 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-extrabold text-[#1d1b20]">Active Charging Hub Deployments</h3>
                <p className="text-xs text-gray-500 mt-0.5">Telemetry metrics from municipal fast-charging grid</p>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {evStations.map((st) => (
                <div key={st.id} className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-gray-50/50">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-[#1d1b20]">{st.name}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                        {st.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{st.address}</p>
                    <div className="text-xs text-gray-600 mt-1 flex items-center gap-4">
                      <span>Type: <strong>{st.chargerType}</strong></span>
                      <span>•</span>
                      <span>Power: <strong>{st.powerOutputKw} kW</strong></span>
                      <span>•</span>
                      <span>Rate: {st.pricingPerKwh}</span>
                    </div>
                  </div>

                  <div className="text-right self-end sm:self-center">
                    <div className="text-xs font-bold text-[#1d1b20]">
                      {st.availableChargers} / {st.totalChargers} Available
                    </div>
                    <span className="text-[10px] text-gray-400">24/7 Remote Telemetry</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Underserved Rural Corridor Planning (Requirement 35) */}
          <div className="bg-white rounded-2xl p-6 border border-[#cbc4d2]/40 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-[#1d1b20] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#765b00]">engineering</span>
                Underserved Rural Corridor Planning (Phase 2 Roadmap)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 bg-[#fdf7ff] rounded-xl border border-gray-200">
                <div className="font-bold text-[#1d1b20]">Puntamba Railway Crossing Hub</div>
                <p className="text-[11px] text-gray-500 mt-1">High agricultural traffic from sugar mills. Proposed 60kW DC Fast Charger with solar canopy.</p>
                <div className="mt-2 text-[10px] font-bold text-purple-700">Status: Site Feasibility Approved</div>
              </div>

              <div className="p-3.5 bg-[#fdf7ff] rounded-xl border border-gray-200">
                <div className="font-bold text-[#1d1b20]">Yeola Border Bypass (NH-753G)</div>
                <p className="text-[11px] text-gray-500 mt-1">Heavy freight truck movement. Proposed Dual 120kW Ultra Fast Charger for commercial electric pickups.</p>
                <div className="mt-2 text-[10px] font-bold text-amber-700">Status: Grid Allocation in Progress</div>
              </div>

              <div className="p-3.5 bg-[#fdf7ff] rounded-xl border border-gray-200">
                <div className="font-bold text-[#1d1b20]">Dhamori Grampanchayat Agro Center</div>
                <p className="text-[11px] text-gray-500 mt-1">Dedicated electric tractor and rural three-wheeler feeder hub with subsidized agricultural tariffs.</p>
                <div className="mt-2 text-[10px] font-bold text-emerald-700">Status: Tender Draft Ready</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
