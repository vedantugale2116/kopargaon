import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';

export const ShipmentRequests: React.FC = () => {
  const { requests, acceptShipmentRequest, rejectShipmentRequest } = useData();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-[#fdf7ff] font-sans">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-gray-200 text-gray-700 transition-colors"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </button>
            <div>
              <h1 className="text-2xl font-extrabold text-[#1d1b20] tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-700">inbox</span>
                Farmer Shipment Booking Requests
              </h1>
              <p className="text-xs text-[#494551] mt-0.5">
                Review and accept agricultural cargo transit requests from local Kopargaon farmers.
              </p>
            </div>
          </div>
        </div>

        {/* Requests Feed matching Stitch Shipment_Requests.html */}
        <div className="space-y-4">
          {requests.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-[#cbc4d2]/40">
              <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">inbox</span>
              <h3 className="font-bold text-sm text-gray-700">No Pending Requests</h3>
              <p className="text-xs text-gray-500 mt-1">New farmer booking requests will appear here in real-time.</p>
            </div>
          ) : (
            requests.map((req) => (
              <div
                key={req.id}
                className={`p-6 rounded-2xl border transition-all bg-white flex flex-col lg:flex-row justify-between gap-6 ${
                  req.status === 'ACCEPTED' ? 'border-emerald-300 bg-emerald-50/20' :
                  req.status === 'REJECTED' ? 'border-gray-200 opacity-60' :
                  'border-[#cbc4d2]/50 shadow-sm'
                }`}
              >
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-base text-[#1d1b20]">{req.farmerName}</span>
                    <span className="text-xs text-gray-500 font-mono">({req.farmerPhone})</span>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                      req.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800' :
                      req.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {req.status}
                    </span>
                    <span className="text-xs text-gray-400">• {req.createdAt}</span>
                  </div>

                  <div className="text-xs font-semibold text-gray-700 flex items-center gap-2 flex-wrap">
                    <span>Pickup: <strong className="text-[#1d1b20]">{req.pickupLocation}</strong></span>
                    <span className="material-symbols-outlined text-gray-400 text-[16px]">arrow_forward</span>
                    <span>Drop: <strong className="text-[#1d1b20]">{req.dropLocation}</strong></span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-gray-50 p-3 rounded-xl border border-gray-100 max-w-lg">
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold block">PRODUCE</span>
                      <strong className="text-[#1d1b20]">{req.goodsType}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold block">WEIGHT</span>
                      <strong className="text-emerald-700">{req.weightKg} kg</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold block">PREFERRED TIME</span>
                      <strong className="text-[#1d1b20]">{req.preferredTime}</strong>
                    </div>
                  </div>
                </div>

                <div className="lg:w-64 flex flex-col justify-between items-end border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 lg:pt-0 lg:pl-6 gap-3">
                  <div className="text-right">
                    <div className="text-2xl font-black text-[#1d1b20]">₹{req.offeredPrice}</div>
                    <div className="text-xs text-gray-500">Suggested Freight Payout</div>
                  </div>

                  {req.status === 'PENDING' ? (
                    <div className="flex gap-2 w-full">
                      <button
                        onClick={() => rejectShipmentRequest(req.id)}
                        className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => acceptShipmentRequest(req.id)}
                        className="flex-1 py-2.5 bg-[#4f378a] hover:bg-[#382467] text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                      >
                        Accept
                      </button>
                    </div>
                  ) : (
                    <div className="text-xs font-bold text-gray-500">
                      Request marked as {req.status}
                    </div>
                  )}
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
