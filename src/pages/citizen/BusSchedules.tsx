import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { BusBookingModal } from '../../components/bus/BusBookingModal';
import { BusSchedule } from '../../lib/mockData';
import { VerificationBadge } from '../../components/common/VerificationBadge';
import { isRouteMatchingSearch } from '../../lib/routeSearchHelper';

export const BusSchedules: React.FC = () => {
  const { schedules } = useData();

  const [filterFrom, setFilterFrom] = useState('');
  const [filterTo, setFilterTo] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PUBLISHED' | 'DELAYED'>('ALL');

  // Modal State
  const [selectedSchedule, setSelectedSchedule] = useState<BusSchedule | null>(null);
  const [bookingMode, setBookingMode] = useState<'PASSENGER' | 'CARGO'>('PASSENGER');

  const filteredSchedules = schedules.filter(sched => {
    const routeMatch = isRouteMatchingSearch(sched, filterFrom, filterTo);
    const statusMatch = statusFilter === 'ALL' || sched.status === statusFilter;
    return routeMatch && statusMatch;
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
          {filteredSchedules.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-[#cbc4d2]/40 shadow-xs space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#f8f2fa] flex items-center justify-center mx-auto text-[#4f378a]">
                <span className="material-symbols-outlined text-3xl">directions_bus</span>
              </div>
              <h3 className="text-base font-extrabold text-[#1d1b20]">No buses found for this route.</h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                We could not find scheduled buses matching {filterFrom && filterTo ? `"${filterFrom}" → "${filterTo}"` : `your search`}. Try searching major connection hubs like Shirdi, Sangamner, Nashik, or Ahmednagar.
              </p>
              <button
                onClick={() => { setFilterFrom(''); setFilterTo(''); setStatusFilter('ALL'); }}
                className="px-4 py-2 bg-[#4f378a] hover:bg-[#382467] text-white text-xs font-bold rounded-xl transition-all shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">refresh</span>
                Try another route
              </button>
            </div>
          ) : (
            filteredSchedules.map((sched) => {
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
                      <VerificationBadge status="VERIFIED" verifiedBy="MSRTC Kopargaon Depot" size="xs" />
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-[#1d1b20]">
                        {sched.origin} <span className="text-[#4f378a]">→</span> {sched.destination}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Via stops: {sched.stops.join(' • ')}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs bg-gray-50 p-2.5 rounded-xl border border-gray-100 max-w-lg">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-[#4f378a]">schedule</span>
                        <div>
                          <span className="text-[10px] text-gray-400 block font-bold">DEPARTURE</span>
                          <strong className="text-[#1d1b20]">{sched.departureTime}</strong>
                        </div>
                      </div>
                      <span className="text-gray-300">•</span>
                      <div>
                        <span className="text-[10px] text-gray-400 block font-bold">EST. ARRIVAL</span>
                        <strong className="text-[#1d1b20]">{sched.arrivalTime}</strong>
                      </div>
                      <span className="text-gray-300">•</span>
                      <div>
                        <span className="text-[10px] text-gray-400 block font-bold">DATE</span>
                        <strong className="text-[#1d1b20]">{sched.date}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Right Capacity & Action Controls */}
                  <div className="flex flex-col justify-between gap-4 lg:w-80 border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 lg:pt-0 lg:pl-6">
                    <div className="space-y-3">
                      {/* Passenger Seats Indicator */}
                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="flex items-center gap-1 text-gray-700">
                            <span className="material-symbols-outlined text-[15px] text-[#4f378a]">airline_seat_recline_normal</span>
                            Available Passenger Seats
                          </span>
                          <span className={`${sched.availableSeats > 5 ? 'text-emerald-700' : 'text-red-700'}`}>
                            {sched.availableSeats} of {sched.passengerCapacity} left
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              sched.availableSeats > 5 ? 'bg-emerald-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${(sched.availableSeats / sched.passengerCapacity) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Cargo Capacity Utilization */}
                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="flex items-center gap-1 text-gray-700">
                            <span className="material-symbols-outlined text-[15px] text-purple-700">inventory_2</span>
                            Cargo Bay Space
                          </span>
                          <span className="text-gray-700">
                            {sched.availableCargoKg} kg Available
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-600 rounded-full transition-all"
                            style={{ width: `${cargoPercent}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-[10px] text-gray-500 text-right">
                        Cargo rate: ₹{sched.cargoRatePerKg} / kg
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenBooking(sched, 'PASSENGER')}
                        disabled={sched.availableSeats === 0}
                        className="flex-1 py-2.5 bg-white border border-[#4f378a] text-[#4f378a] hover:bg-[#e1d4fd]/30 font-bold text-xs rounded-xl transition-all shadow-2xs active:scale-95 disabled:opacity-50 cursor-pointer"
                      >
                        Book Ticket (₹{sched.fare})
                      </button>
                      <button
                        onClick={() => handleOpenBooking(sched, 'CARGO')}
                        disabled={sched.availableCargoKg === 0}
                        className="flex-1 py-2.5 bg-[#4f378a] hover:bg-[#382467] text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                      >
                        Book Cargo
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
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
