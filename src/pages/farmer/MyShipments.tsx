import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';

export const MyShipments: React.FC = () => {
  const { user } = useAuth();
  const { shipments } = useData();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'PENDING' | 'COMPLETED'>('ACTIVE');

  const farmerShipments = shipments.filter(s => s.farmerId === user?.id || s.farmerName.includes(user?.name?.split(' ')[0] || '') || true);

  const activeShipments = farmerShipments.filter(s => s.currentStatus === 'IN TRANSIT' || s.currentStatus === 'ACCEPTED' || s.currentStatus === 'PICKUP');
  const pendingShipments = farmerShipments.filter(s => s.currentStatus === 'REQUESTED' || s.currentStatus === 'MATCHED');
  const completedShipments = farmerShipments.filter(s => s.currentStatus === 'DELIVERED');

  const displayedList = activeTab === 'ACTIVE' ? activeShipments :
                        activeTab === 'PENDING' ? pendingShipments : completedShipments;

  return (
    <div className="min-h-screen flex flex-col bg-[#fdf7ff] font-sans">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-[#1d1b20] tracking-tight flex items-center gap-2">
              <span className="material-symbols-outlined text-[#4f378a]">inventory_2</span>
              My Agricultural Shipments
            </h1>
            <p className="text-xs text-[#494551] mt-0.5">
              Live status, carrier dispatches, transit milestones, and delivery receipts.
            </p>
          </div>

          <Link
            to="/citizen/farmer/send-goods"
            className="bg-[#4f378a] hover:bg-[#382467] text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add_box</span>
            New Shipment
          </Link>
        </div>

        {/* Status Tabs */}
        <div className="flex border-b border-[#cbc4d2]/40 gap-2">
          <button
            onClick={() => setActiveTab('ACTIVE')}
            className={`pb-3 px-4 text-xs font-extrabold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'ACTIVE'
                ? 'border-[#4f378a] text-[#4f378a]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <span>Active in Transit</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800">
              {activeShipments.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('PENDING')}
            className={`pb-3 px-4 text-xs font-extrabold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'PENDING'
                ? 'border-[#4f378a] text-[#4f378a]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <span>Requested / Pending</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-800">
              {pendingShipments.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('COMPLETED')}
            className={`pb-3 px-4 text-xs font-extrabold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'COMPLETED'
                ? 'border-[#4f378a] text-[#4f378a]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <span>Delivered History</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-gray-100 text-gray-800">
              {completedShipments.length}
            </span>
          </button>
        </div>

        {/* Shipments List */}
        <div className="space-y-4">
          {displayedList.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-[#cbc4d2]/40">
              <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">inventory_2</span>
              <h3 className="font-bold text-sm text-gray-700">No shipments found in this category</h3>
              <p className="text-xs text-gray-500 mt-1">Submit a new agro produce booking to get started.</p>
            </div>
          ) : (
            displayedList.map((ship) => (
              <div
                key={ship.id}
                className="bg-white rounded-2xl p-5 border border-[#cbc4d2]/40 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-black text-[#4f378a] bg-[#f8f2fa] px-2.5 py-1 rounded-lg border border-[#cbc4d2]/40">
                      {ship.trackingNumber}
                    </span>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                      ship.currentStatus === 'DELIVERED' ? 'bg-gray-100 text-gray-800' :
                      ship.currentStatus === 'IN TRANSIT' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {ship.currentStatus}
                    </span>
                    <span className="text-xs text-gray-500">
                      Booked on: {ship.createdAt}
                    </span>
                  </div>

                  <div className="text-base font-extrabold text-[#1d1b20]">
                    {ship.origin} <span className="text-[#4f378a]">→</span> {ship.destination}
                  </div>

                  <div className="text-xs text-gray-700">
                    Cargo: <strong>{ship.goodsType}</strong> ({ship.weightKg} kg • {ship.quantity})
                  </div>

                  <div className="text-xs text-gray-500 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-[#4f378a]">directions_bus</span>
                    <span>Carrier: <strong>{ship.transporterName || 'Public Bus Cargo'}</strong> ({ship.transporterVehicle})</span>
                  </div>
                </div>

                <div className="flex md:flex-col justify-between md:justify-center items-end border-t md:border-t-0 md:border-l border-gray-100 pt-3 md:pt-0 md:pl-6 gap-3 shrink-0">
                  <div className="text-right">
                    <div className="text-lg font-black text-[#1d1b20]">₹{ship.estimatedCost}</div>
                    <div className="text-[10px] text-gray-500">Estimated Delivery: {ship.estimatedDelivery}</div>
                  </div>

                  <button
                    onClick={() => navigate(`/citizen/farmer/track?id=${ship.id}`)}
                    className="px-4 py-2 bg-[#4f378a] hover:bg-[#382467] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1"
                  >
                    <span>Track Live</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};
