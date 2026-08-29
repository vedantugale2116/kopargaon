import React from 'react';
import { Sidebar } from '../../components/common/Sidebar';
import { useData } from '../../context/DataContext';

export const CargoCapacityMonitor: React.FC = () => {
  const { buses, schedules } = useData();

  const totalCapacityAllBuses = buses.reduce((a, b) => a + b.totalCargoKg, 0);
  const totalUsedCargo = buses.reduce((a, b) => a + b.usedCargoKg, 0);
  const totalAvailableCargo = buses.reduce((a, b) => a + b.availableCargoKg, 0);
  const overallUtilizationPercent = Math.round((totalUsedCargo / totalCapacityAllBuses) * 100) || 0;

  return (
    <div className="min-h-screen flex bg-[#f8f2fa] font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 bg-white/95 backdrop-blur-md border-b border-[#cbc4d2]/40 px-6 flex items-center justify-between sticky top-0 z-30">
          <div>
            <h1 className="text-lg font-black text-[#1d1b20] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#765b00]">inventory_2</span>
              Bus Cargo Capacity & Rural Utilization Monitor
            </h1>
            <p className="text-[11px] text-gray-500">Core municipal feature: monetizing and utilizing unused MSRTC bus cargo space for parcel logistics</p>
          </div>
        </header>

        <main className="p-6 space-y-6 max-w-7xl w-full mx-auto">
          {/* Core Concept Banner */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#4f378a] shadow-xs space-y-4 relative overflow-hidden">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#e1d4fd] text-[#4f378a] flex items-center justify-center font-bold shrink-0">
                <span className="material-symbols-outlined text-[32px]">inventory_2</span>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-black text-[#1d1b20]">Smart Cargo Utilization Framework</h2>
                <p className="text-xs text-[#494551] mt-1 leading-relaxed max-w-3xl">
                  Public transit buses traditionally run with empty undercarriage luggage compartments. Kopargaon Connect matches local agricultural produce (pomegranates, onions, flowers, seeds) with available bus cargo bays, reducing logistics costs for farmers while generating non-fare municipal revenue.
                </p>
              </div>
            </div>

            {/* Capacity KPI Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-[#f8f2fa] p-4 rounded-2xl border border-[#cbc4d2]/40">
                <span className="text-[10px] text-gray-500 font-bold uppercase">TOTAL FLEET CARGO CAPACITY</span>
                <div className="text-3xl font-black text-[#1d1b20] mt-1">{totalCapacityAllBuses} kg</div>
                <div className="text-xs text-gray-500 mt-0.5">Across {buses.length} registered buses</div>
              </div>

              <div className="bg-[#f8f2fa] p-4 rounded-2xl border border-[#cbc4d2]/40">
                <span className="text-[10px] text-gray-500 font-bold uppercase">CURRENTLY OCCUPIED (USED)</span>
                <div className="text-3xl font-black text-purple-700 mt-1">{totalUsedCargo} kg</div>
                <div className="text-xs text-purple-700 font-semibold mt-0.5">{overallUtilizationPercent}% Overall Utilization</div>
              </div>

              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
                <span className="text-[10px] text-emerald-800 font-bold uppercase">AVAILABLE FOR FARMERS</span>
                <div className="text-3xl font-black text-emerald-700 mt-1">{totalAvailableCargo} kg</div>
                <div className="text-xs text-emerald-700 font-bold mt-0.5">Ready for instant dispatch</div>
              </div>
            </div>
          </div>

          {/* Per-Bus Cargo Allocation Breakdown (Requirement 19) */}
          <div className="bg-white rounded-2xl border border-[#cbc4d2]/40 shadow-xs p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-sm text-[#1d1b20]">Bus-by-Bus Cargo Bay Telemetry</h3>
                <p className="text-xs text-gray-500">Live kilogram metrics for each active scheduled bus</p>
              </div>
              <span className="text-xs font-bold text-gray-500">Standard Bay Rating: 500-800 kg</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {buses.map((bus) => {
                const usedPercent = Math.round((bus.usedCargoKg / bus.totalCargoKg) * 100);

                return (
                  <div key={bus.id} className="p-5 bg-[#fdf7ff] rounded-2xl border border-[#cbc4d2]/40 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-extrabold text-sm text-[#1d1b20] flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[18px] text-[#4f378a]">directions_bus</span>
                          {bus.busNumber}
                        </div>
                        <p className="text-xs text-gray-500">{bus.currentStop} → {bus.destination}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        bus.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {bus.status}
                      </span>
                    </div>

                    {/* Visual Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-gray-600">Cargo Bay Fill:</span>
                        <span className="text-[#4f378a]">{usedPercent}% Occupied</span>
                      </div>
                      <div className="w-full h-3 bg-white rounded-full overflow-hidden border border-[#cbc4d2]/40">
                        <div
                          className="h-full bg-[#4f378a] rounded-full transition-all"
                          style={{ width: `${usedPercent}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* 3 Explicit Metrics matching Project Requirement 19 */}
                    <div className="grid grid-cols-3 gap-2 pt-1 text-center text-xs">
                      <div className="p-2 bg-white rounded-xl border border-gray-200">
                        <span className="text-[10px] text-gray-400 font-bold block">TOTAL</span>
                        <strong className="text-[#1d1b20]">{bus.totalCargoKg} kg</strong>
                      </div>
                      <div className="p-2 bg-white rounded-xl border border-gray-200">
                        <span className="text-[10px] text-gray-400 font-bold block">USED</span>
                        <strong className="text-purple-700">{bus.usedCargoKg} kg</strong>
                      </div>
                      <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200">
                        <span className="text-[10px] text-emerald-700 font-bold block">AVAILABLE</span>
                        <strong className="text-emerald-700">{bus.availableCargoKg} kg</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
