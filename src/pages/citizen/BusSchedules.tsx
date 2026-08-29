import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { BusBookingModal } from '../../components/bus/BusBookingModal';
import { BusSchedule } from '../../lib/mockData';

export const BusSchedules: React.FC = () => {
  const { schedules } = useData();

  const [filterFrom, setFilterFrom] = useState('');
  const [filterTo, setFilterTo] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PUBLISHED' | 'DELAYED'>('ALL');

  // Modal State
  const [selectedSchedule, setSelectedSchedule] = useState<BusSchedule | null>(null);
  const [bookingMode, setBookingMode] = useState<'PASSENGER' | 'CARGO'>('PASSENGER');

  const filteredSchedules = schedules.filter(sched => {
    const origMatch = !filterFrom || sched.origin.toLowerCase().includes(filterFrom.toLowerCase());
    const destMatch = !filterTo || sched.destination.toLowerCase().includes(filterTo.toLowerCase()) || sched.stops.some(s => s.toLowerCase().includes(filterTo.toLowerCase()));
    const statusMatch = statusFilter === 'ALL' || sched.status === statusFilter;
    return origMatch && destMatch && statusMatch;
  });

  const handleOpenBooking = (sched: BusSchedule, mode: 'PASSENGER' | 'CARGO') => {
    setSelectedSchedule(sched);
    setBookingMode(mode);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fdf7ff] font-sans">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-[#1d1b20] tracking-tight flex items-center gap-2">
              <span className="material-symbols-outlined text-[#4f378a]">schedule</span>
              MSRTC Bus Schedules & Cargo Availability
            </h1>
            <p className="text-xs text-[#494551] mt-0.5">
              Live timetables from Kopargaon Central Bus Station with passenger seat & cargo bay utilization.
            </p>
          </div>

          {schedules.length > 0 && (
            <button
              onClick={() => handleOpenBooking(schedules[0], 'CARGO')}
              className="bg-[#4f378a] hover:bg-[#382467] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">local_shipping</span>
              Book Bus Cargo Bay
            </button>
          )}
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-[#cbc4d2]/40 shadow-xs flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              value={filterFrom}
              onChange={(e) => setFilterFrom(e.target.value)}
              placeholder="Search origin (e.g. Kopargaon)..."
              className="w-full bg-[#f8f2fa] text-xs text-[#1d1b20] rounded-xl px-3.5 py-2 border border-[#cbc4d2] focus:outline-none focus:border-[#4f378a]"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              value={filterTo}
              onChange={(e) => setFilterTo(e.target.value)}
              placeholder="Search destination (e.g. Sangamner, Nashik)..."
              className="w-full bg-[#f8f2fa] text-xs text-[#1d1b20] rounded-xl px-3.5 py-2 border border-[#cbc4d2] focus:outline-none focus:border-[#4f378a]"
            />
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-2 text-xs font-bold rounded-xl transition-all ${
                statusFilter === 'ALL' ? 'bg-[#4f378a] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Status
            </button>
            <button
              onClick={() => setStatusFilter('PUBLISHED')}
              className={`px-3 py-2 text-xs font-bold rounded-xl transition-all ${
                statusFilter === 'PUBLISHED' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              On Time
            </button>
            <button
              onClick={() => setStatusFilter('DELAYED')}
              className={`px-3 py-2 text-xs font-bold rounded-xl transition-all ${
                statusFilter === 'DELAYED' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Delayed
            </button>
          </div>
        </div>

        {/* Schedules Grid */}
        <div className="space-y-4">
          {filteredSchedules.map((sched) => {
            const usedCargo = sched.totalCargoKg - sched.availableCargoKg;
            const cargoPercent = Math.round((usedCargo / sched.totalCargoKg) * 100);

            return (
              <div
                key={sched.id}
                className="bg-white rounded-2xl p-5 border border-[#cbc4d2]/40 shadow-xs hover:shadow-md transition-all flex flex-col lg:flex-row justify-between gap-6"
              >
                {/* Left Route & Timing Details */}
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-sm text-[#1d1b20] bg-[#f8f2fa] px-3 py-1 rounded-lg border border-[#cbc4d2]/30">
                      {sched.busNumber}
                    </span>
                    <span className="text-xs text-gray-600 font-semibold">Route #{sched.routeId}</span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      sched.status === 'DELAYED' ? 'bg-red-100 text-red-700' :
                      sched.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {sched.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-[#1d1b20]">
                      {sched.origin} <span className="text-[#4f378a]">→</span> {sched.destination}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Via stops: {sched.stops.join(' • ')}
                    </p>
                  </div>

                  {/* Departure and Arrival Box */}
                  <div className="flex items-center gap-4 text-xs bg-gray-50 p-3 rounded-xl border border-gray-100 max-w-md">
                    <div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase">Departure</div>
                      <div className="font-extrabold text-sm text-[#1d1b20]">{sched.departureTime}</div>
                    </div>
                    <span className="material-symbols-outlined text-gray-400">arrow_forward</span>
                    <div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase">Arrival (Est)</div>
                      <div className="font-extrabold text-sm text-[#1d1b20]">{sched.arrivalTime}</div>
                    </div>
                    <div className="ml-auto text-right">
                      <div className="text-[10px] text-gray-400 font-bold uppercase">Date</div>
                      <div className="font-semibold text-xs text-gray-700">{sched.date}</div>
                    </div>
                  </div>
                </div>

                {/* Right Capacity & Action Panel */}
                <div className="lg:w-80 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 lg:pt-0 lg:pl-6 space-y-4">
                  {/* Passenger Seat Capacity */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-gray-600 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-[#4f378a]">event_seat</span>
                        Passenger Seats:
                      </span>
                      <span className="text-[#1d1b20] font-bold">{sched.availableSeats} Available / {sched.passengerCapacity}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#4f378a] rounded-full"
                        style={{ width: `${((sched.passengerCapacity - sched.availableSeats) / sched.passengerCapacity) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Core Bus Cargo Capacity Display */}
                  <div className="p-3 bg-[#e1d4fd]/30 rounded-xl border border-[#4f378a]/20 space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-[#4f378a] flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">inventory_2</span>
                        Bus Cargo Capacity
                      </span>
                      <span className="text-[11px] font-extrabold text-[#22005d]">{cargoPercent}% Used</span>
                    </div>
                    <div className="w-full h-2.5 bg-white rounded-full overflow-hidden border border-[#4f378a]/20">
                      <div
                        className="h-full bg-[#4f378a] rounded-full transition-all"
                        style={{ width: `${cargoPercent}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[11px] text-gray-700 pt-0.5">
                      <span>Total: <strong>{sched.totalCargoKg} kg</strong></span>
                      <span>Used: <strong>{usedCargo} kg</strong></span>
                      <span className="text-emerald-700 font-extrabold">Avail: <strong>{sched.availableCargoKg} kg</strong></span>
                    </div>
                    <div className="text-[10px] text-gray-500 text-right">
                      Cargo rate: ₹{sched.cargoRatePerKg} / kg
                    </div>
                  </div>

                  {/* Action Buttons (Opening Modals - No alert popups) */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenBooking(sched, 'PASSENGER')}
                      disabled={sched.availableSeats === 0}
                      className="flex-1 py-2.5 bg-white border border-[#4f378a] text-[#4f378a] hover:bg-[#e1d4fd]/30 font-bold text-xs rounded-xl transition-all shadow-2xs active:scale-95 disabled:opacity-50"
                    >
                      Book Ticket (₹{sched.fare})
                    </button>
                    <button
                      onClick={() => handleOpenBooking(sched, 'CARGO')}
                      disabled={sched.availableCargoKg === 0}
                      className="flex-1 py-2.5 bg-[#4f378a] hover:bg-[#382467] text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95 disabled:opacity-50"
                    >
                      Book Cargo
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Booking Modal Instance */}
      {selectedSchedule && (
        <BusBookingModal
          schedule={selectedSchedule}
          mode={bookingMode}
          onClose={() => setSelectedSchedule(null)}
        />
      )}

      <Footer />
    </div>
  );
};
