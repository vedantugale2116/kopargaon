import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../../components/common/Sidebar';
import { useData } from '../../context/DataContext';

export const BusDepotOperations: React.FC = () => {
  const { buses, schedules, updateScheduleStatus } = useData();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'AT_DEPOT' | 'DEPARTING' | 'ARRIVING' | 'MAINTENANCE'>('AT_DEPOT');

  const depotBuses = buses.filter(b => b.status === 'AT DEPOT');
  const departingSchedules = schedules.filter(s => s.status === 'PUBLISHED');
  const maintenanceBuses = buses.filter(b => b.status === 'MAINTENANCE');

  return (
    <div className="min-h-screen flex bg-[#f8f2fa] font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 bg-white/95 backdrop-blur-md border-b border-[#cbc4d2]/40 px-6 flex items-center justify-between sticky top-0 z-30">
          <div>
            <h1 className="text-lg font-black text-[#1d1b20] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#765b00]">warehouse</span>
              Kopargaon Central Bus Depot Operations
            </h1>
            <p className="text-[11px] text-gray-500">Platform bay allocation, bus cargo loading, and MSRTC departure management</p>
          </div>

          <button
            onClick={() => navigate('/official/schedules')}
            className="bg-[#4f378a] hover:bg-[#382467] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            Create Schedule
          </button>
        </header>

        <main className="p-6 space-y-6 max-w-7xl w-full mx-auto">
          {/* Depot Metrics Cards matching Stitch Bus_Depot_Operations__Desktop_.html */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-[#cbc4d2]/40 shadow-xs">
              <span className="text-[10px] text-gray-400 font-bold uppercase">BUSES AT PLATFORM</span>
              <div className="text-2xl font-black text-[#1d1b20] mt-1">{depotBuses.length} Vehicles</div>
              <span className="text-[11px] text-gray-500">8 Total Bay Capacity</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#cbc4d2]/40 shadow-xs">
              <span className="text-[10px] text-gray-400 font-bold uppercase">TODAY'S DEPARTURES</span>
              <div className="text-2xl font-black text-emerald-700 mt-1">{departingSchedules.length} Published</div>
              <span className="text-[11px] text-emerald-700 font-semibold">100% On-Time Target</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#cbc4d2]/40 shadow-xs">
              <span className="text-[10px] text-gray-400 font-bold uppercase">DEPOT CARGO HOLDING</span>
              <div className="text-2xl font-black text-[#4f378a] mt-1">1,850 kg</div>
              <span className="text-[11px] text-gray-500">Across 6 Public Buses</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#cbc4d2]/40 shadow-xs">
              <span className="text-[10px] text-gray-400 font-bold uppercase">WORKSHOP STATUS</span>
              <div className="text-2xl font-black text-amber-700 mt-1">{maintenanceBuses.length} Under Inspection</div>
              <span className="text-[11px] text-gray-500">Bay 5 Service</span>
            </div>
          </div>

          {/* Operational Tabs */}
          <div className="bg-white rounded-2xl border border-[#cbc4d2]/40 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-[#cbc4d2]/30 flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('AT_DEPOT')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'AT_DEPOT'
                      ? 'bg-[#765b00] text-white shadow-xs'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Buses at Depot ({depotBuses.length})
                </button>
                <button
                  onClick={() => setActiveTab('DEPARTING')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'DEPARTING'
                      ? 'bg-[#765b00] text-white shadow-xs'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Published Departures ({departingSchedules.length})
                </button>
                <button
                  onClick={() => setActiveTab('MAINTENANCE')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'MAINTENANCE'
                      ? 'bg-[#765b00] text-white shadow-xs'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Workshop Bay ({maintenanceBuses.length})
                </button>
              </div>

              <span className="text-xs text-gray-500">
                Platform Bays 1 to 8 Online
              </span>
            </div>

            {/* List of items depending on tab */}
            <div className="p-5">
              {activeTab === 'AT_DEPOT' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {depotBuses.map((bus) => (
                    <div key={bus.id} className="p-4 bg-[#fdf7ff] rounded-xl border border-gray-200 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-sm text-[#1d1b20]">{bus.busNumber}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                              {bus.depotBay || 'Platform 3'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">Driver: {bus.driverName} ({bus.contactNumber})</p>
                        </div>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg">
                          Next Dep: {bus.nextDeparture}
                        </span>
                      </div>

                      <div className="text-xs text-gray-700">
                        Scheduled Destination: <strong>{bus.destination}</strong>
                      </div>

                      <div className="p-2.5 bg-white rounded-lg border border-gray-200 flex justify-between text-xs font-semibold">
                        <span>Cargo Bay Capacity:</span>
                        <span className="text-[#4f378a] font-bold">{bus.availableCargoKg} kg Available</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'DEPARTING' && (
                <div className="space-y-3">
                  {departingSchedules.map((sched) => (
                    <div key={sched.id} className="p-4 bg-[#fdf7ff] rounded-xl border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#1d1b20]">{sched.busNumber}</span>
                          <span className="text-xs text-gray-600 font-semibold">{sched.origin} → {sched.destination}</span>
                        </div>
                        <div className="text-[11px] text-gray-500 mt-1">
                          Departure: <strong>{sched.departureTime}</strong> | Arrival: {sched.arrivalTime} | Date: {sched.date}
                        </div>
                        <div className="text-[11px] text-[#4f378a] font-bold mt-0.5">
                          Cargo Bay: {sched.availableCargoKg} kg / {sched.totalCargoKg} kg Available
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => updateScheduleStatus(sched.id, 'DELAYED')}
                          className="px-3 py-1.5 bg-red-100 text-red-800 text-xs font-bold rounded-lg hover:bg-red-200"
                        >
                          Mark Delayed
                        </button>
                        <button
                          onClick={() => updateScheduleStatus(sched.id, 'PUBLISHED')}
                          className="px-3 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg hover:bg-emerald-200"
                        >
                          Published
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'MAINTENANCE' && (
                <div className="space-y-3">
                  {maintenanceBuses.map((bus) => (
                    <div key={bus.id} className="p-4 bg-amber-50/70 rounded-xl border border-amber-200 flex justify-between items-center">
                      <div>
                        <div className="font-bold text-xs text-amber-950">{bus.busNumber} • {bus.depotBay || 'Workshop Bay 5'}</div>
                        <p className="text-[11px] text-amber-800 mt-0.5">Scheduled brake fluid & tire tread inspection before Pune long-haul.</p>
                      </div>
                      <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2.5 py-1 rounded-full">
                        In Service
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
