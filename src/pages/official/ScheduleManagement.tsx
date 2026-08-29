import React, { useState } from 'react';
import { Sidebar } from '../../components/common/Sidebar';
import { useData } from '../../context/DataContext';
import { BusSchedule } from '../../lib/mockData';

export const ScheduleManagement: React.FC = () => {
  const { schedules, createSchedule, updateScheduleStatus } = useData();

  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    busId: 'bus-1',
    busNumber: 'MH-17-BT-5540',
    routeId: 'KP-105',
    origin: 'Kopargaon Bus Station',
    destination: 'Shirdi Temple — Rahata',
    stops: 'Kopargaon, Sanvatsar, Shirdi, Rahata',
    departureTime: '12:30 PM',
    arrivalTime: '01:45 PM',
    date: '2026-08-30',
    passengerCapacity: 45,
    availableSeats: 45,
    totalCargoKg: 500,
    availableCargoKg: 500,
    fare: 45,
    cargoRatePerKg: 3.0,
    status: 'PUBLISHED' as BusSchedule['status']
  });

  const [successMsg, setSuccessMsg] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createSchedule({
      busId: formData.busId,
      busNumber: formData.busNumber,
      routeId: formData.routeId,
      origin: formData.origin,
      destination: formData.destination,
      stops: formData.stops.split(',').map(s => s.trim()),
      departureTime: formData.departureTime,
      arrivalTime: formData.arrivalTime,
      date: formData.date,
      passengerCapacity: Number(formData.passengerCapacity),
      availableSeats: Number(formData.availableSeats),
      totalCargoKg: Number(formData.totalCargoKg),
      availableCargoKg: Number(formData.availableCargoKg),
      fare: Number(formData.fare),
      cargoRatePerKg: Number(formData.cargoRatePerKg),
      status: formData.status
    });

    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
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
              <span className="material-symbols-outlined text-[#765b00]">calendar_month</span>
              Bus Schedule & Cargo Bay Publishing
            </h1>
            <p className="text-[11px] text-gray-500">Official schedule publishing with automatic synchronization to citizen apps</p>
          </div>

          <button
            onClick={() => setIsCreating(true)}
            className="bg-[#4f378a] hover:bg-[#382467] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Create New Schedule
          </button>
        </header>

        <main className="p-6 space-y-6 max-w-7xl w-full mx-auto">
          {/* Create Modal */}
          {isCreating && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#4f378a] shadow-xl animate-in fade-in space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-black text-[#1d1b20]">Create & Publish New Bus Schedule</h2>
                  <p className="text-xs text-gray-500">Published schedules instantly become available to passengers and farmers.</p>
                </div>
                <button onClick={() => setIsCreating(false)} className="text-gray-400 hover:text-black">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {successMsg && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">check_circle</span>
                  Schedule successfully created and published to citizen timetables!
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-gray-600">Bus Registration Number *</label>
                    <input
                      type="text"
                      required
                      value={formData.busNumber}
                      onChange={(e) => setFormData({ ...formData, busNumber: e.target.value })}
                      className="bg-[#f8f2fa] text-xs p-2.5 rounded-xl border border-[#cbc4d2] font-mono font-bold"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-gray-600">Origin Bus Station *</label>
                    <input
                      type="text"
                      required
                      value={formData.origin}
                      onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                      className="bg-[#f8f2fa] text-xs p-2.5 rounded-xl border border-[#cbc4d2]"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-gray-600">Destination *</label>
                    <input
                      type="text"
                      required
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                      className="bg-[#f8f2fa] text-xs p-2.5 rounded-xl border border-[#cbc4d2]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-gray-600">Departure Time *</label>
                    <input
                      type="text"
                      required
                      value={formData.departureTime}
                      onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                      className="bg-[#f8f2fa] text-xs p-2.5 rounded-xl border border-[#cbc4d2]"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-gray-600">Arrival Time (Est) *</label>
                    <input
                      type="text"
                      required
                      value={formData.arrivalTime}
                      onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })}
                      className="bg-[#f8f2fa] text-xs p-2.5 rounded-xl border border-[#cbc4d2]"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-gray-600">Passenger Capacity *</label>
                    <input
                      type="number"
                      required
                      value={formData.passengerCapacity}
                      onChange={(e) => setFormData({ ...formData, passengerCapacity: Number(e.target.value), availableSeats: Number(e.target.value) })}
                      className="bg-[#f8f2fa] text-xs p-2.5 rounded-xl border border-[#cbc4d2]"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-gray-600">Cargo Bay Capacity (kg) *</label>
                    <input
                      type="number"
                      required
                      value={formData.totalCargoKg}
                      onChange={(e) => setFormData({ ...formData, totalCargoKg: Number(e.target.value), availableCargoKg: Number(e.target.value) })}
                      className="bg-[#f8f2fa] text-xs p-2.5 rounded-xl border border-[#cbc4d2] font-bold text-[#4f378a]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-gray-600">Passenger Fare (₹)</label>
                    <input
                      type="number"
                      value={formData.fare}
                      onChange={(e) => setFormData({ ...formData, fare: Number(e.target.value) })}
                      className="bg-[#f8f2fa] text-xs p-2.5 rounded-xl border border-[#cbc4d2]"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-gray-600">Cargo Rate (₹ / kg)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={formData.cargoRatePerKg}
                      onChange={(e) => setFormData({ ...formData, cargoRatePerKg: Number(e.target.value) })}
                      className="bg-[#f8f2fa] text-xs p-2.5 rounded-xl border border-[#cbc4d2]"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-gray-600">Publishing Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as BusSchedule['status'] })}
                      className="bg-[#f8f2fa] text-xs p-2.5 rounded-xl border border-[#cbc4d2] font-bold"
                    >
                      <option value="PUBLISHED">PUBLISHED (Visible to Citizens)</option>
                      <option value="DRAFT">DRAFT</option>
                      <option value="DELAYED">DELAYED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
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
                    className="px-6 py-2.5 bg-[#4f378a] hover:bg-[#382467] text-white font-bold rounded-xl shadow-md"
                  >
                    Publish Schedule Now
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Existing Schedules Table */}
          <div className="bg-white rounded-2xl border border-[#cbc4d2]/40 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-[#cbc4d2]/30 flex justify-between items-center">
              <div>
                <h2 className="text-sm font-extrabold text-[#1d1b20]">Active & Draft Schedules</h2>
                <p className="text-xs text-gray-500 mt-0.5">Control timetable status and cargo bay allocation</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f8f2fa] text-gray-600 font-bold uppercase text-[10px] border-b border-[#cbc4d2]/30">
                  <tr>
                    <th className="py-3.5 px-4">Bus / Route</th>
                    <th className="py-3.5 px-4">Route Path</th>
                    <th className="py-3.5 px-4">Timings (Dep / Arr)</th>
                    <th className="py-3.5 px-4">Cargo Capacity (Avail/Total)</th>
                    <th className="py-3.5 px-4">Rates</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {schedules.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3 px-4 font-bold text-[#1d1b20]">
                        <div>{s.busNumber}</div>
                        <div className="text-[10px] text-gray-500 font-mono">#{s.routeId}</div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-gray-800">
                        {s.origin} → {s.destination}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-[#1d1b20]">{s.departureTime}</div>
                        <div className="text-[10px] text-gray-500">Arr: {s.arrivalTime}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-[#4f378a]">{s.availableCargoKg} kg</span> / {s.totalCargoKg} kg
                      </td>
                      <td className="py-3 px-4">
                        <div>₹{s.fare} fare</div>
                        <div className="text-[10px] text-gray-500">₹{s.cargoRatePerKg}/kg cargo</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          s.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-800' :
                          s.status === 'DELAYED' ? 'bg-red-100 text-red-700' :
                          s.status === 'DRAFT' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          {s.status === 'DRAFT' ? (
                            <button
                              onClick={() => updateScheduleStatus(s.id, 'PUBLISHED')}
                              className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-[10px] font-bold"
                            >
                              Publish
                            </button>
                          ) : (
                            <button
                              onClick={() => updateScheduleStatus(s.id, s.status === 'DELAYED' ? 'PUBLISHED' : 'DELAYED')}
                              className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-[10px] font-bold"
                            >
                              {s.status === 'DELAYED' ? 'Resolve Delay' : 'Flag Delayed'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
