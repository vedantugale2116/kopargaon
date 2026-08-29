import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';

export const TransporterPortal: React.FC = () => {
  const { user, setCitizenRole } = useAuth();
  const { trips, requests } = useData();
  const navigate = useNavigate();

  const myTrips = trips.filter(t => t.transporterId === user?.id || t.transporterName.includes(user?.name?.split(' ')[0] || '') || true);
  const pendingRequests = requests.filter(r => r.status === 'PENDING');
  const totalAvailableKg = myTrips.reduce((a, t) => a + t.availableCapacityKg, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#fdf7ff] font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#cbc4d2]/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-purple-100/40 to-transparent pointer-events-none"></div>
          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-900">
                <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                Private Freight Carrier Hub
              </div>
              <button
                type="button"
                onClick={() => {
                  setCitizenRole('FARMER');
                  navigate('/citizen/farmer');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#e1d4fd] text-[#4f378a] hover:bg-[#cfbcff] active:scale-95 transition-all cursor-pointer border border-[#4f378a]/20 shadow-2xs"
                title="Switch to Farmer Portal"
              >
                <span>TRANSPORTER</span>
                <span className="material-symbols-outlined text-[15px]">swap_horiz</span>
                <span className="text-[10px] text-[#4f378a]/80 font-semibold">Switch to Farmer</span>
              </button>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1d1b20] tracking-tight">
              Transporter Dashboard — {user?.name || 'Santosh Tribhuvan'}
            </h1>
            <p className="text-sm text-[#494551] mt-1 max-w-xl">
              Publish empty truck/pickup trips, accept freight requests from local farmers, and maximize rural vehicle revenue.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap gap-2">
            <button
              onClick={() => navigate('/citizen/transporter/publish-trip')}
              className="bg-[#4f378a] hover:bg-[#382467] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md flex items-center gap-2 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              Publish New Trip
            </button>
            <button
              onClick={() => navigate('/citizen/transporter/requests')}
              className="bg-[#e1d4fd] hover:bg-[#cfbcff] text-[#4f378a] px-4 py-2.5 rounded-xl font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">inbox</span>
              Farmer Requests ({pendingRequests.length})
            </button>
          </div>
        </div>

        {/* 4 Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-[#cbc4d2]/30 shadow-xs flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[24px]">local_shipping</span>
            </div>
            <div>
              <div className="text-2xl font-black text-[#1d1b20]">{myTrips.length}</div>
              <div className="text-xs font-semibold text-[#494551]">Scheduled Trips</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#cbc4d2]/30 shadow-xs flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[24px]">pending_actions</span>
            </div>
            <div>
              <div className="text-2xl font-black text-amber-800">{pendingRequests.length}</div>
              <div className="text-xs font-semibold text-[#494551]">Pending Requests</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#cbc4d2]/30 shadow-xs flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[24px]">scale</span>
            </div>
            <div>
              <div className="text-2xl font-black text-[#1d1b20]">{totalAvailableKg} kg</div>
              <div className="text-xs font-semibold text-[#494551]">Total Capacity Available</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#cbc4d2]/30 shadow-xs flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#e1d4fd] text-[#4f378a] flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[24px]">currency_rupee</span>
            </div>
            <div>
              <div className="text-2xl font-black text-[#1d1b20]">₹3.20</div>
              <div className="text-xs font-semibold text-[#494551]">Avg Rate / kg</div>
            </div>
          </div>
        </div>

        {/* Quick Actions Grid matching Stitch Transporter_Portal.html */}
        <div>
          <h2 className="text-base font-extrabold text-[#1d1b20] mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4f378a]">local_shipping</span>
            Transporter Logistics Management
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link
              to="/citizen/transporter/publish-trip"
              className="bg-white p-4 rounded-2xl border border-[#cbc4d2]/40 hover:border-[#4f378a] hover:shadow-md transition-all flex flex-col items-center text-center group"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[24px]">add_road</span>
              </div>
              <span className="text-xs font-extrabold text-[#1d1b20]">Publish Trip</span>
              <span className="text-[10px] text-gray-500 mt-0.5">List Route & Capacity</span>
            </Link>

            <Link
              to="/citizen/transporter/requests"
              className="bg-white p-4 rounded-2xl border border-[#cbc4d2]/40 hover:border-[#4f378a] hover:shadow-md transition-all flex flex-col items-center text-center group relative"
            >
              {pendingRequests.length > 0 && (
                <span className="absolute top-2 right-2 px-2 py-0.5 bg-red-600 text-white rounded-full text-[10px] font-bold">
                  {pendingRequests.length}
                </span>
              )}
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[24px]">inbox</span>
              </div>
              <span className="text-xs font-extrabold text-[#1d1b20]">Shipment Requests</span>
              <span className="text-[10px] text-gray-500 mt-0.5">Accept / Reject</span>
            </Link>

            <Link
              to="/citizen/transporter/trips"
              className="bg-white p-4 rounded-2xl border border-[#cbc4d2]/40 hover:border-[#4f378a] hover:shadow-md transition-all flex flex-col items-center text-center group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#e1d4fd] text-[#4f378a] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[24px]">route</span>
              </div>
              <span className="text-xs font-extrabold text-[#1d1b20]">My Trips</span>
              <span className="text-[10px] text-gray-500 mt-0.5">Active & History</span>
            </Link>

            <Link
              to="/citizen/map"
              className="bg-white p-4 rounded-2xl border border-[#cbc4d2]/40 hover:border-[#4f378a] hover:shadow-md transition-all flex flex-col items-center text-center group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#e1d4fd] text-[#4f378a] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[24px]">map</span>
              </div>
              <span className="text-xs font-extrabold text-[#1d1b20]">Live Traffic Map</span>
              <span className="text-[10px] text-gray-500 mt-0.5">Check Road Bottlenecks</span>
            </Link>
          </div>
        </div>

        {/* Dual: Published Trips & Pending Requests Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Trips */}
          <div className="bg-white rounded-2xl p-5 border border-[#cbc4d2]/40 shadow-xs space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-sm text-[#1d1b20] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#4f378a]">local_shipping</span>
                My Scheduled Trips
              </h3>
              <Link to="/citizen/transporter/trips" className="text-xs font-bold text-[#4f378a] hover:underline">
                View All →
              </Link>
            </div>

            <div className="space-y-2.5">
              {myTrips.map((trip) => (
                <div key={trip.id} className="p-3.5 bg-[#fdf7ff] rounded-xl border border-gray-200 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-xs text-[#1d1b20]">{trip.origin} → {trip.destination}</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">{trip.date} • Dep: {trip.departureTime} • Rate: ₹{trip.chargePerKg}/kg</div>
                    <div className="text-[11px] text-emerald-700 font-bold mt-1">
                      {trip.availableCapacityKg} kg available (of {trip.totalCapacityKg} kg)
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 bg-purple-100 text-purple-900 rounded-full font-bold text-[10px]">
                    {trip.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Farmer Requests */}
          <div className="bg-white rounded-2xl p-5 border border-[#cbc4d2]/40 shadow-xs space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-sm text-[#1d1b20] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-amber-700">inbox</span>
                Pending Farmer Cargo Requests
              </h3>
              <Link to="/citizen/transporter/requests" className="text-xs font-bold text-[#4f378a] hover:underline">
                Review All →
              </Link>
            </div>

            <div className="space-y-2.5">
              {pendingRequests.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-xs">
                  No pending farmer requests at this moment.
                </div>
              ) : (
                pendingRequests.map((req) => (
                  <div key={req.id} className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-xs text-amber-950">{req.farmerName} • {req.weightKg} kg</div>
                      <div className="text-[11px] text-amber-800 mt-0.5">{req.goodsType}</div>
                      <div className="text-[11px] text-gray-600 mt-0.5">{req.pickupLocation} → {req.dropLocation}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-extrabold text-xs text-[#1d1b20]">₹{req.offeredPrice}</div>
                      <Link
                        to="/citizen/transporter/requests"
                        className="inline-block mt-1 px-3 py-1 bg-[#4f378a] text-white text-[10px] font-bold rounded-lg"
                      >
                        Respond
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
