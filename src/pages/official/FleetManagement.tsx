import React, { useState } from 'react';
import { Sidebar } from '../../components/common/Sidebar';
import { useData } from '../../context/DataContext';
import { Bus } from '../../lib/mockData';

export const FleetManagement: React.FC = () => {
  const { buses, updateBusStatus } = useData();

  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [newStatus, setNewStatus] = useState<Bus['status']>('ACTIVE');
  const [delayInput, setDelayInput] = useState<number>(0);
  const [statusUpdated, setStatusUpdated] = useState(false);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBus) return;
    updateBusStatus(selectedBus.id, newStatus, delayInput);
    setStatusUpdated(true);
    setTimeout(() => {
      setStatusUpdated(false);
      setSelectedBus(null);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex bg-[#f8f2fa] font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 bg-white/95 backdrop-blur-md border-b border-[#cbc4d2]/40 px-6 flex items-center justify-between sticky top-0 z-30">
          <div>
            <h1 className="text-lg font-black text-[#1d1b20] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#765b00]">directions_bus</span>
              Public Transport Fleet Management
            </h1>
            <p className="text-[11px] text-gray-500">MSRTC Kopargaon division fleet telemetry, maintenance logs, and passenger/cargo capacity</p>
          </div>
        </header>

        <main className="p-6 space-y-6 max-w-7xl w-full mx-auto">
          {/* Summary Stat Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-[#cbc4d2]/40 shadow-xs">
              <span className="text-[10px] text-gray-400 font-bold uppercase">TOTAL BUS FLEET</span>
              <div className="text-2xl font-black text-[#1d1b20] mt-1">{buses.length} Vehicles</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-[#cbc4d2]/40 shadow-xs">
              <span className="text-[10px] text-gray-400 font-bold uppercase">ACTIVE ON ROUTE</span>
              <div className="text-2xl font-black text-emerald-700 mt-1">
                {buses.filter(b => b.status === 'ACTIVE').length} Buses
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-[#cbc4d2]/40 shadow-xs">
              <span className="text-[10px] text-gray-400 font-bold uppercase">DELAYED TRIPS</span>
              <div className="text-2xl font-black text-red-600 mt-1">
                {buses.filter(b => b.status === 'DELAYED').length} Buses
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-[#cbc4d2]/40 shadow-xs">
              <span className="text-[10px] text-gray-400 font-bold uppercase">MAINTENANCE BAY</span>
              <div className="text-2xl font-black text-amber-700 mt-1">
                {buses.filter(b => b.status === 'MAINTENANCE').length} In Workshop
              </div>
            </div>
          </div>

          {/* Fleet Roster Table */}
          <div className="bg-white rounded-2xl border border-[#cbc4d2]/40 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-[#cbc4d2]/30 flex justify-between items-center">
              <div>
                <h2 className="text-sm font-extrabold text-[#1d1b20]">MSRTC Kopargaon Fleet Roster</h2>
                <p className="text-xs text-gray-500 mt-0.5">Live status and driver dispatch info</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f8f2fa] text-gray-600 font-bold uppercase text-[10px] border-b border-[#cbc4d2]/30">
                  <tr>
                    <th className="py-3.5 px-4">Bus ID / Registration</th>
                    <th className="py-3.5 px-4">Driver & Contact</th>
                    <th className="py-3.5 px-4">Current Stop / Route</th>
                    <th className="py-3.5 px-4">Passenger Occupancy</th>
                    <th className="py-3.5 px-4">Cargo Capacity (kg)</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {buses.map((bus) => (
                    <tr key={bus.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3 px-4 font-bold text-[#1d1b20]">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[18px] text-[#4f378a]">directions_bus</span>
                          <span>{bus.busNumber}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-gray-800">{bus.driverName}</div>
                        <div className="text-[10px] text-gray-500">{bus.contactNumber}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-gray-800">{bus.currentStop}</div>
                        <div className="text-[10px] text-gray-500">To: {bus.destination}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-[#1d1b20]">{bus.passengerOccupied}</span> / {bus.passengerCapacity} seats
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-[#4f378a]">{bus.availableCargoKg} kg Avail</div>
                        <div className="text-[10px] text-gray-500">Total: {bus.totalCargoKg} kg</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          bus.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' :
                          bus.status === 'DELAYED' ? 'bg-red-100 text-red-700' :
                          bus.status === 'AT DEPOT' ? 'bg-blue-100 text-blue-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {bus.status} {bus.delayMins > 0 ? `(+${bus.delayMins}m)` : ''}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedBus(bus);
                            setNewStatus(bus.status);
                            setDelayInput(bus.delayMins || 0);
                          }}
                          className="px-3 py-1 bg-[#f8f2fa] text-[#765b00] hover:bg-[#FFD814]/30 rounded-lg font-bold text-[11px] border border-[#cbc4d2]/40"
                        >
                          Update Status
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Update Modal */}
          {selectedBus && (
            <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-[#cbc4d2]/60 animate-in zoom-in-95 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-extrabold text-base text-[#1d1b20]">
                    Update Status: {selectedBus.busNumber}
                  </h3>
                  <button onClick={() => setSelectedBus(null)} className="text-gray-400 hover:text-black">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                {statusUpdated && (
                  <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">check_circle</span>
                    Status updated successfully!
                  </div>
                )}

                <form onSubmit={handleUpdate} className="space-y-3 text-xs">
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-gray-600">Operational Status</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as Bus['status'])}
                      className="w-full bg-[#f8f2fa] text-xs p-2.5 rounded-xl border border-[#cbc4d2] font-semibold"
                    >
                      <option value="ACTIVE">ACTIVE (On Route)</option>
                      <option value="DELAYED">DELAYED</option>
                      <option value="AT DEPOT">AT DEPOT (Platform Ready)</option>
                      <option value="MAINTENANCE">MAINTENANCE (Workshop)</option>
                      <option value="OUT OF SERVICE">OUT OF SERVICE</option>
                    </select>
                  </div>

                  {newStatus === 'DELAYED' && (
                    <div className="flex flex-col gap-1">
                      <label className="font-semibold text-gray-600">Reported Delay (Minutes)</label>
                      <input
                        type="number"
                        min="5"
                        max="180"
                        value={delayInput}
                        onChange={(e) => setDelayInput(Number(e.target.value))}
                        className="w-full bg-[#f8f2fa] text-xs p-2.5 rounded-xl border border-[#cbc4d2] font-bold"
                      />
                    </div>
                  )}

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedBus(null)}
                      className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#765b00] hover:bg-[#594400] text-white font-bold rounded-xl shadow-xs"
                    >
                      Save Status
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
