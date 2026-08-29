import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { BusBookingModal } from '../../components/bus/BusBookingModal';
import { BusSchedule } from '../../lib/mockData';

export const JourneyPlanner: React.FC = () => {
  const { schedules, trafficRegions } = useData();
  const navigate = useNavigate();

  const [fromLocation, setFromLocation] = useState('Kopargaon');
  const [toLocation, setToLocation] = useState('Sangamner');
  const [journeyDate, setJourneyDate] = useState('2026-08-30');
  const [journeyTime, setJourneyTime] = useState('08:30');
  const [hasSearched, setHasSearched] = useState(true);

  // Modal State
  const [selectedSchedule, setSelectedSchedule] = useState<BusSchedule | null>(null);
  const [bookingMode, setBookingMode] = useState<'PASSENGER' | 'CARGO'>('PASSENGER');

  // Filter matching schedules
  const matchingSchedules = schedules.filter(s => {
    const orig = (s.origin + ' ' + s.stops.join(' ')).toLowerCase();
    const dest = (s.destination + ' ' + s.stops.join(' ')).toLowerCase();
    return orig.includes(fromLocation.toLowerCase()) || dest.includes(toLocation.toLowerCase()) || fromLocation.toLowerCase().includes('kopargaon');
  });

  const heavyTraffic = trafficRegions.find(r => r.currentTraffic === 'RED' || r.currentTraffic === 'ORANGE');

  const handleOpenBooking = (sched: BusSchedule, mode: 'PASSENGER' | 'CARGO') => {
    setSelectedSchedule(sched);
    setBookingMode(mode);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fdf7ff] font-sans">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-200 text-gray-700 transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">arrow_back</span>
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-[#1d1b20] tracking-tight">Plan Your Journey</h1>
            <p className="text-xs text-[#494551] mt-0.5">
              Find scheduled MSRTC buses, connected routes, live seat availability, and traffic advisories.
            </p>
          </div>
        </div>

        {/* Traffic Advisory Box if heavy congestion exists */}
        {heavyTraffic && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-xs">
            <span className="material-symbols-outlined text-amber-600 text-xl">traffic</span>
            <div>
              <strong className="text-amber-900 block font-bold">Traffic Advisory on Corridors:</strong>
              <p className="text-amber-800 mt-0.5">
                {heavyTraffic.name} is currently reporting {heavyTraffic.reportCount} congestion incident(s) ({heavyTraffic.currentTraffic}). Average transit speeds around {heavyTraffic.avgSpeedKmph} km/h. Please plan additional buffer time.
              </p>
            </div>
          </div>
        )}

        {/* Journey Query Card */}
        <div className="bg-white rounded-2xl p-6 border border-[#cbc4d2]/40 shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">From Origin</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-[18px]">trip_origin</span>
                <input
                  type="text"
                  value={fromLocation}
                  onChange={(e) => setFromLocation(e.target.value)}
                  placeholder="e.g. Kopargaon"
                  className="w-full bg-[#f8f2fa] text-xs text-[#1d1b20] rounded-xl pl-9 pr-3 py-2.5 border border-[#cbc4d2] focus:outline-none focus:border-[#4f378a]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">To Destination</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-[18px]">location_on</span>
                <input
                  type="text"
                  value={toLocation}
                  onChange={(e) => setToLocation(e.target.value)}
                  placeholder="e.g. Shirdi / Sangamner"
                  className="w-full bg-[#f8f2fa] text-xs text-[#1d1b20] rounded-xl pl-9 pr-3 py-2.5 border border-[#cbc4d2] focus:outline-none focus:border-[#4f378a]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Journey Date</label>
              <input
                type="date"
                value={journeyDate}
                onChange={(e) => setJourneyDate(e.target.value)}
                className="w-full bg-[#f8f2fa] text-xs text-[#1d1b20] rounded-xl px-3 py-2.5 border border-[#cbc4d2] focus:outline-none focus:border-[#4f378a]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Preferred Time</label>
              <input
                type="time"
                value={journeyTime}
                onChange={(e) => setJourneyTime(e.target.value)}
                className="w-full bg-[#f8f2fa] text-xs text-[#1d1b20] rounded-xl px-3 py-2.5 border border-[#cbc4d2] focus:outline-none focus:border-[#4f378a]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setHasSearched(true)}
              className="bg-[#4f378a] hover:bg-[#382467] text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">search</span>
              Search Available Routes
            </button>
          </div>
        </div>

        {/* Results List */}
        {hasSearched && (
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs text-gray-600 font-bold px-1">
              <span>{matchingSchedules.length} Available Bus Services Found</span>
              <span>Sorted by Departure Time</span>
            </div>

            {matchingSchedules.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center text-gray-500 text-xs border border-gray-200">
                No direct buses found matching your criteria. Try adjusting origin or destination locations.
              </div>
            ) : (
              matchingSchedules.map((sched) => (
                <div
                  key={sched.id}
                  className="bg-white rounded-2xl p-5 border border-[#cbc4d2]/40 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row justify-between gap-5"
                >
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-sm text-[#1d1b20] bg-[#f8f2fa] px-3 py-1 rounded-lg border border-[#cbc4d2]/30">
                        {sched.busNumber}
                      </span>
                      <span className="text-xs text-gray-500 font-semibold">Route #{sched.routeId}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        sched.status === 'DELAYED' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {sched.status}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-extrabold text-[#1d1b20]">
                        {sched.origin} <span className="text-[#4f378a]">→</span> {sched.destination}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Via stops: {sched.stops.join(' • ')}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-gray-600 bg-gray-50 p-2.5 rounded-xl max-w-md">
                      <div>
                        <span className="text-[10px] text-gray-400 block font-bold uppercase">Departure</span>
                        <strong className="text-[#1d1b20]">{sched.departureTime}</strong>
                      </div>
                      <span className="material-symbols-outlined text-gray-300">arrow_forward</span>
                      <div>
                        <span className="text-[10px] text-gray-400 block font-bold uppercase">Arrival (Est)</span>
                        <strong className="text-[#1d1b20]">{sched.arrivalTime}</strong>
                      </div>
                      <span className="text-gray-300">|</span>
                      <div className="text-right ml-auto">
                        <span className="text-[10px] text-gray-400 block font-bold uppercase">Seats Available</span>
                        <strong className="text-emerald-700">{sched.availableSeats} of {sched.passengerCapacity}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Right Action Panel */}
                  <div className="flex md:flex-col justify-between md:justify-center items-end border-t md:border-t-0 md:border-l border-gray-100 pt-3 md:pt-0 md:pl-6 gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-xl font-black text-[#4f378a]">₹{sched.fare}</div>
                      <div className="text-[10px] text-gray-500">per passenger</div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenBooking(sched, 'PASSENGER')}
                        disabled={sched.availableSeats === 0}
                        className="px-4 py-2 bg-[#4f378a] hover:bg-[#382467] text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 disabled:opacity-50"
                      >
                        Book Seat
                      </button>
                      <button
                        onClick={() => handleOpenBooking(sched, 'CARGO')}
                        disabled={sched.availableCargoKg === 0}
                        className="px-3 py-2 bg-[#f8f2fa] hover:bg-[#e1d4fd]/50 border border-[#e1d4fd] text-[#4f378a] text-xs font-bold rounded-xl shadow-2xs transition-all active:scale-95 disabled:opacity-50"
                        title="Book parcel luggage in bus cargo bay"
                      >
                        Send Parcel
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* Booking Modal */}
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
