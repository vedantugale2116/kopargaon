import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';

export const MyTrips: React.FC = () => {
  const { user } = useAuth();
  const { trips } = useData();
  const navigate = useNavigate();

  const myTrips = trips.filter(t => t.transporterId === user?.id || t.transporterName.includes(user?.name?.split(' ')[0] || '') || true);

  return (
    <div className="min-h-screen flex flex-col bg-[#fdf7ff] font-sans">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-gray-200 text-gray-700 transition-colors"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </button>
            <div>
              <h1 className="text-2xl font-extrabold text-[#1d1b20] tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4f378a]">route</span>
                My Published Freight Trips
              </h1>
              <p className="text-xs text-[#494551] mt-0.5">
                Manage your scheduled vehicle routes, remaining cargo space, and farm gate pickup commitments.
              </p>
            </div>
          </div>

          <Link
            to="/citizen/transporter/publish-trip"
            className="bg-[#4f378a] hover:bg-[#382467] text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            Publish New Trip
          </Link>
        </div>

        <div className="space-y-4">
          {myTrips.map((trip) => {
            const usedKg = trip.totalCapacityKg - trip.availableCapacityKg;
            const utilPercent = Math.round((usedKg / trip.totalCapacityKg) * 100);

            return (
              <div
                key={trip.id}
                className="bg-white rounded-2xl p-6 border border-[#cbc4d2]/40 shadow-xs hover:shadow-md transition-all flex flex-col lg:flex-row justify-between gap-6"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-xs text-[#4f378a] bg-[#e1d4fd] px-3 py-1 rounded-lg">
                      {trip.vehicleNumber}
                    </span>
                    <span className="text-xs font-bold text-gray-700">{trip.vehicleType}</span>
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900">
                      {trip.status}
                    </span>
                  </div>

                  <div className="text-base font-extrabold text-[#1d1b20]">
                    {trip.origin} <span className="text-[#4f378a]">→</span> {trip.destination}
                  </div>

                  <div className="text-xs text-gray-600 flex items-center gap-3 flex-wrap">
                    <span>Date: <strong>{trip.date}</strong></span>
                    <span className="text-gray-300">•</span>
                    <span>Departure: <strong>{trip.departureTime}</strong></span>
                    <span className="text-gray-300">•</span>
                    <span>Est. Arrival: <strong>{trip.estimatedArrival}</strong></span>
                  </div>

                  <p className="text-xs text-gray-500 italic">
                    Accepted: {trip.acceptedGoodsTypes.join(', ')}
                  </p>
                </div>

                <div className="lg:w-80 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 lg:pt-0 lg:pl-6 space-y-3">
                  <div className="bg-[#f8f2fa] p-3 rounded-xl border border-[#cbc4d2]/30 space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-gray-600">Capacity Utilization:</span>
                      <span className="text-[#4f378a]">{utilPercent}% Booked</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-[#4f378a] rounded-full" style={{ width: `${utilPercent}%` }}></div>
                    </div>
                    <div className="flex justify-between text-[11px] text-gray-600 pt-1">
                      <span>Total: <strong>{trip.totalCapacityKg} kg</strong></span>
                      <span className="text-emerald-700 font-bold">Avail: <strong>{trip.availableCapacityKg} kg</strong></span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500">Freight Rate:</span>
                    <span className="font-extrabold text-[#1d1b20] text-sm">₹{trip.chargePerKg} / kg</span>
                  </div>

                  <button
                    onClick={() => navigate('/citizen/transporter/requests')}
                    className="w-full py-2 bg-white border border-[#4f378a] text-[#4f378a] hover:bg-[#e1d4fd]/30 font-bold text-xs rounded-xl transition-colors text-center"
                  >
                    View Farmer Booking Requests
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
};
