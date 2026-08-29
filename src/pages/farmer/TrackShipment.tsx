import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';

export const TrackShipment: React.FC = () => {
  const { shipments, updateShipmentStatus } = useData();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const shipmentId = searchParams.get('id') || shipments[0]?.id;
  const shipment = shipments.find(s => s.id === shipmentId) || shipments[0];

  const [simulating, setSimulating] = useState(false);

  if (!shipment) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fdf7ff]">
        <Navbar />
        <div className="max-w-4xl mx-auto py-16 text-center">
          <p>No active shipment selected.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const handleSimulateStatus = (nextStatus: typeof shipment.currentStatus) => {
    setSimulating(true);
    setTimeout(() => {
      updateShipmentStatus(shipment.id, nextStatus, `Live milestone reached: ${nextStatus}`);
      setSimulating(false);
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fdf7ff] font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
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
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-sm text-[#4f378a] bg-[#e1d4fd] px-2.5 py-0.5 rounded-md">
                  {shipment.trackingNumber}
                </span>
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                  shipment.currentStatus === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800' :
                  shipment.currentStatus === 'IN TRANSIT' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                }`}>
                  {shipment.currentStatus}
                </span>
              </div>
              <h1 className="text-xl font-extrabold text-[#1d1b20] mt-1">
                {shipment.origin} → {shipment.destination}
              </h1>
            </div>
          </div>

          <div className="text-right hidden sm:block">
            <div className="text-xs text-gray-400 font-bold uppercase">Estimated Delivery</div>
            <div className="font-extrabold text-sm text-[#1d1b20]">{shipment.estimatedDelivery}</div>
          </div>
        </div>

        {/* Cargo & Carrier Summary Card */}
        <div className="bg-white rounded-2xl p-5 border border-[#cbc4d2]/40 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase">Agricultural Cargo</span>
            <div className="font-bold text-sm text-[#1d1b20] mt-0.5">{shipment.goodsType}</div>
            <div className="text-xs text-gray-500">{shipment.weightKg} kg • {shipment.quantity}</div>
          </div>

          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase">Assigned Carrier</span>
            <div className="font-bold text-sm text-[#1d1b20] mt-0.5">{shipment.transporterName}</div>
            <div className="text-xs text-gray-500">{shipment.transporterVehicle}</div>
          </div>

          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase">Total Freight Charge</span>
            <div className="font-extrabold text-base text-[#4f378a] mt-0.5">₹{shipment.estimatedCost}</div>
            <div className="text-xs text-emerald-700 font-semibold">Payment upon delivery confirmation</div>
          </div>
        </div>

        {/* Visual Timeline matching Stitch Track_Shipment.html */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#cbc4d2]/40 shadow-sm space-y-6">
          <h2 className="text-base font-extrabold text-[#1d1b20] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4f378a]">timeline</span>
            Transit Milestones & Live Status
          </h2>

          <div className="relative pl-6 space-y-8 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#cbc4d2]/50">
            {shipment.timeline.map((step, idx) => {
              const isDone = step.completed;
              const isCurrent = step.current;

              return (
                <div key={idx} className="relative flex items-start gap-4">
                  {/* Step Dot */}
                  <div className={`absolute -left-6 top-0 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs z-10 transition-all ${
                    isDone
                      ? 'bg-[#4f378a] text-white ring-4 ring-[#e1d4fd]'
                      : 'bg-white border-2 border-gray-300 text-gray-400'
                  }`}>
                    {isDone ? (
                      <span className="material-symbols-outlined text-[14px]">check</span>
                    ) : (
                      <span className="text-[10px]">{idx + 1}</span>
                    )}
                  </div>

                  {/* Step Details */}
                  <div className="flex-1 -mt-1">
                    <div className="flex flex-wrap justify-between items-center gap-2">
                      <h3 className={`text-sm font-extrabold ${isCurrent ? 'text-[#4f378a]' : 'text-[#1d1b20]'}`}>
                        {step.status}
                      </h3>
                      <span className="text-xs font-semibold text-gray-400">{step.timestamp}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Demonstration State Progress Simulator */}
        <div className="bg-[#f8f2fa] rounded-2xl p-5 border border-[#e1d4fd] space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-[#4f378a] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">play_circle</span>
              Demo Milestone Progress Simulator
            </div>
            <span className="text-[10px] font-bold text-gray-500 uppercase">One-Click End-to-End Test</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleSimulateStatus('PICKUP')}
              disabled={simulating}
              className="px-3 py-1.5 bg-white text-xs font-bold text-[#4f378a] rounded-xl border border-[#4f378a]/30 hover:bg-[#4f378a] hover:text-white transition-all"
            >
              1. Mark as Picked Up
            </button>
            <button
              onClick={() => handleSimulateStatus('IN TRANSIT')}
              disabled={simulating}
              className="px-3 py-1.5 bg-white text-xs font-bold text-blue-700 rounded-xl border border-blue-300 hover:bg-blue-600 hover:text-white transition-all"
            >
              2. Mark as In Transit (On Highway)
            </button>
            <button
              onClick={() => handleSimulateStatus('DELIVERED')}
              disabled={simulating}
              className="px-3 py-1.5 bg-white text-xs font-bold text-emerald-700 rounded-xl border border-emerald-300 hover:bg-emerald-600 hover:text-white transition-all"
            >
              3. Mark as Delivered & Handed Over
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
