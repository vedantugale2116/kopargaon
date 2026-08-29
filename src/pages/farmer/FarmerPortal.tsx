import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';

export const FarmerPortal: React.FC = () => {
  const { user, setCitizenRole } = useAuth();
  const { shipments, trips, buses } = useData();
  const navigate = useNavigate();

  const farmerShipments = shipments.filter(s => s.farmerId === user?.id || s.farmerName.includes(user?.name?.split(' ')[0] || ''));
  const inTransitShipments = farmerShipments.filter(s => s.currentStatus === 'IN TRANSIT' || s.currentStatus === 'ACCEPTED' || s.currentStatus === 'PICKUP');
  const availableBusesWithCargo = buses.filter(b => b.availableCargoKg > 100);
  const activeTripsCount = trips.filter(t => t.status === 'SCHEDULED' || t.status === 'ACTIVE').length;

  return (
    <div className="min-h-screen flex flex-col bg-[#fdf7ff] font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Welcome Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#cbc4d2]/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-emerald-100/40 to-transparent pointer-events-none"></div>
          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                <span className="material-symbols-outlined text-[16px]">agriculture</span>
                Agro Logistics & Smart Rural Transit
              </div>
              <button
                type="button"
                onClick={() => {
                  setCitizenRole('TRANSPORTER');
                  navigate('/citizen/transporter');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#e1d4fd] text-[#4f378a] hover:bg-[#cfbcff] active:scale-95 transition-all cursor-pointer border border-[#4f378a]/20 shadow-2xs"
                title="Switch to Transporter Portal"
              >
                <span>FARMER</span>
                <span className="material-symbols-outlined text-[15px]">swap_horiz</span>
                <span className="text-[10px] text-[#4f378a]/80 font-semibold">Switch to Transporter</span>
              </button>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1d1b20] tracking-tight">
              Farmer Cargo Hub — {user?.name || 'Balasaheb Vikhe'}
            </h1>
            <p className="text-sm text-[#494551] mt-1 max-w-xl">
              Dispatch agricultural harvest (onions, pomegranates, vegetables) using available public bus cargo bays or verified private rural carriers.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap gap-2">
            <button
              onClick={() => navigate('/citizen/farmer/send-goods')}
              className="bg-[#4f378a] hover:bg-[#382467] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md flex items-center gap-2 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">local_shipping</span>
              Send Goods Now
            </button>
            <button
              onClick={() => navigate('/citizen/farmer/ai')}
              className="bg-[#e1d4fd] hover:bg-[#cfbcff] text-[#4f378a] px-4 py-2.5 rounded-xl font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">psychology</span>
              Connect AI
            </button>
          </div>
        </div>

        {/* 4 Stat KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-[#cbc4d2]/30 shadow-xs flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[24px]">inventory_2</span>
            </div>
            <div>
              <div className="text-2xl font-black text-[#1d1b20]">{inTransitShipments.length}</div>
              <div className="text-xs font-semibold text-[#494551]">Active In-Transit</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#cbc4d2]/30 shadow-xs flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#e1d4fd] text-[#4f378a] flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[24px]">directions_bus</span>
            </div>
            <div>
              <div className="text-2xl font-black text-[#1d1b20]">{availableBusesWithCargo.length}</div>
              <div className="text-xs font-semibold text-[#494551]">Buses with Cargo Space</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#cbc4d2]/30 shadow-xs flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[24px]">local_shipping</span>
            </div>
            <div>
              <div className="text-2xl font-black text-[#1d1b20]">{activeTripsCount}</div>
              <div className="text-xs font-semibold text-[#494551]">Private Trips Scheduled</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#cbc4d2]/30 shadow-xs flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[24px]">psychology</span>
            </div>
            <div>
              <div className="text-2xl font-black text-[#1d1b20]">100%</div>
              <div className="text-xs font-semibold text-[#494551]">AI Route Optimization</div>
            </div>
          </div>
        </div>

        {/* Farmer Quick Action Grid matching Stitch Farmer_Portal.html */}
        <div>
          <h2 className="text-base font-extrabold text-[#1d1b20] mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4f378a]">agriculture</span>
            Farmer Logistics Actions
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <Link
              to="/citizen/farmer/send-goods"
              className="bg-white p-4 rounded-2xl border border-emerald-200 hover:border-emerald-500 hover:shadow-md transition-all flex flex-col items-center text-center group bg-gradient-to-b from-emerald-50/30 to-white"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-xs">
                <span className="material-symbols-outlined text-[24px]">add_box</span>
              </div>
              <span className="text-xs font-extrabold text-emerald-900">Send Goods</span>
              <span className="text-[10px] text-gray-500 mt-0.5">Book Produce Freight</span>
            </Link>

            <Link
              to="/citizen/farmer/ai"
              className="bg-white p-4 rounded-2xl border border-purple-200 hover:border-purple-500 hover:shadow-md transition-all flex flex-col items-center text-center group bg-gradient-to-b from-purple-50/30 to-white"
            >
              <div className="w-12 h-12 rounded-xl bg-[#e1d4fd] text-[#4f378a] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-xs">
                <span className="material-symbols-outlined text-[24px]">psychology</span>
              </div>
              <span className="text-xs font-extrabold text-purple-950">Connect AI</span>
              <span className="text-[10px] text-gray-500 mt-0.5">Smart Carrier Match</span>
            </Link>

            <Link
              to="/citizen/farmer/shipments"
              className="bg-white p-4 rounded-2xl border border-[#cbc4d2]/40 hover:border-[#4f378a] hover:shadow-md transition-all flex flex-col items-center text-center group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#e1d4fd] text-[#4f378a] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[24px]">inventory_2</span>
              </div>
              <span className="text-xs font-bold text-[#1d1b20]">My Shipments</span>
              <span className="text-[10px] text-gray-500 mt-0.5">Active & History</span>
            </Link>

            <Link
              to="/citizen/farmer/transport"
              className="bg-white p-4 rounded-2xl border border-[#cbc4d2]/40 hover:border-[#4f378a] hover:shadow-md transition-all flex flex-col items-center text-center group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#e1d4fd] text-[#4f378a] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[24px]">commute</span>
              </div>
              <span className="text-xs font-bold text-[#1d1b20]">All Carriers</span>
              <span className="text-[10px] text-gray-500 mt-0.5">Buses & Private Pickups</span>
            </Link>

            <Link
              to="/citizen/map"
              className="bg-white p-4 rounded-2xl border border-[#cbc4d2]/40 hover:border-[#4f378a] hover:shadow-md transition-all flex flex-col items-center text-center group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#e1d4fd] text-[#4f378a] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[24px]">map</span>
              </div>
              <span className="text-xs font-bold text-[#1d1b20]">Live Map</span>
              <span className="text-[10px] text-gray-500 mt-0.5">Track Rural Corridors</span>
            </Link>

            <Link
              to="/citizen/safety"
              className="bg-white p-4 rounded-2xl border border-[#cbc4d2]/40 hover:border-[#4f378a] hover:shadow-md transition-all flex flex-col items-center text-center group"
            >
              <div className="w-12 h-12 rounded-xl bg-red-100 text-red-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[24px]">warning</span>
              </div>
              <span className="text-xs font-bold text-[#1d1b20]">Road Safety</span>
              <span className="text-[10px] text-gray-500 mt-0.5">Traffic Advisories</span>
            </Link>
          </div>
        </div>

        {/* Live Active Shipments Feed */}
        <div className="bg-white rounded-2xl p-6 border border-[#cbc4d2]/40 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-base text-[#1d1b20] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4f378a]">local_shipping</span>
                Active Agricultural Shipments
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">Live tracking updates from carrier & depot points</p>
            </div>
            <Link to="/citizen/farmer/shipments" className="text-xs font-bold text-[#4f378a] hover:underline">
              View All Shipments →
            </Link>
          </div>

          <div className="space-y-3">
            {farmerShipments.slice(0, 3).map((ship) => (
              <div
                key={ship.id}
                onClick={() => navigate(`/citizen/farmer/track?id=${ship.id}`)}
                className="p-4 rounded-xl bg-[#fdf7ff] border border-[#cbc4d2]/30 hover:border-[#4f378a] cursor-pointer transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-3 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-[#4f378a] bg-white px-2 py-0.5 rounded border border-[#cbc4d2]/40">
                      {ship.trackingNumber}
                    </span>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                      ship.currentStatus === 'DELIVERED' ? 'bg-gray-100 text-gray-800' :
                      ship.currentStatus === 'IN TRANSIT' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {ship.currentStatus}
                    </span>
                    <span className="text-xs text-gray-500 font-semibold">
                      {ship.goodsType} ({ship.weightKg} kg)
                    </span>
                  </div>

                  <div className="text-sm font-bold text-[#1d1b20]">
                    {ship.origin} <span className="text-[#4f378a]">→</span> {ship.destination}
                  </div>

                  <div className="text-xs text-gray-600">
                    Carrier: <strong>{ship.transporterName || 'Public Bus Cargo'}</strong> • Delivery Est: {ship.estimatedDelivery}
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-center">
                  <div className="text-right">
                    <div className="font-extrabold text-sm text-[#1d1b20]">₹{ship.estimatedCost}</div>
                    <div className="text-[10px] text-gray-500">Freight Charge</div>
                  </div>
                  <span className="material-symbols-outlined text-[#4f378a] group-hover:translate-x-1 transition-transform">
                    chevron_right
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
