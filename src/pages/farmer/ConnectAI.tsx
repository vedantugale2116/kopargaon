import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { evaluateTransportOptions } from '../../lib/aiRecommender';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';

export const ConnectAI: React.FC = () => {
  const { user } = useAuth();
  const { schedules, trips, trafficRegions, createShipment } = useData();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const pickup = searchParams.get('pickup') || 'Kopargaon APMC Yard';
  const dest = searchParams.get('dest') || 'Nashik Agriculture Produce Market';
  const weight = Number(searchParams.get('weight')) || 250;
  const goods = searchParams.get('goods') || 'Pomegranate Crates (Fresh Harvest)';
  const date = searchParams.get('date') || '2026-08-30';

  const [bookingLoading, setBookingLoading] = useState(false);

  const evalResult = evaluateTransportOptions(
    pickup,
    dest,
    weight,
    goods,
    date,
    schedules,
    trips,
    trafficRegions
  );

  const bestOption = evalResult.bestOption;

  const handleAcceptRecommendation = () => {
    if (!bestOption) return;
    setBookingLoading(true);

    setTimeout(() => {
      const newShipmentId = createShipment({
        farmerId: user?.id || 'farmer-1',
        farmerName: user?.name || 'Balasaheb Vikhe',
        farmerPhone: user?.phone || '+91 98220 11223',
        origin: pickup,
        destination: dest,
        goodsType: goods,
        quantity: '25 standard crates',
        weightKg: weight,
        preferredDate: date,
        preferredTime: bestOption.departureTime,
        specialNotes: 'Booked via Connect AI Intelligent Dispatch',
        assignedType: bestOption.type,
        transporterName: bestOption.type === 'PUBLIC_BUS' ? `${bestOption.providerName} (${bestOption.vehicleNumber})` : bestOption.providerName,
        transporterVehicle: bestOption.vehicleName,
        transporterPhone: '+91 94231 88710',
        estimatedCost: bestOption.costEstimate,
        currentStatus: 'IN TRANSIT',
        estimatedDelivery: `${date} ${bestOption.estimatedArrival}`
      });

      navigate(`/citizen/farmer/track?id=${newShipmentId}`);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fdf7ff] font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Header matching Stitch Connect_AI_Recommendation.html */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-200 text-gray-700 transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">arrow_back</span>
          </button>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#e1d4fd] text-[#4f378a] mb-1">
              <span className="material-symbols-outlined text-[14px]">psychology</span>
              DEMO AI RECOMMENDATION ENGINE
            </div>
            <h1 className="text-2xl font-extrabold text-[#1d1b20] tracking-tight">
              Connect AI Recommendation
            </h1>
            <p className="text-xs text-[#494551] mt-0.5">
              Deterministic rural transport intelligence considering cargo weight, highway bottlenecks, bus bay availability, and costs.
            </p>
          </div>
        </div>

        {/* Cargo Input Summary Banner */}
        <div className="bg-white p-4 rounded-2xl border border-[#cbc4d2]/40 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-gray-400 block text-[10px] font-bold">SHIPMENT LOAD</span>
              <strong className="text-[#1d1b20]">{weight} kg {goods}</strong>
            </div>
            <span className="text-gray-300">•</span>
            <div>
              <span className="text-gray-400 block text-[10px] font-bold">CORRIDOR</span>
              <strong className="text-[#1d1b20]">{pickup} → {dest}</strong>
            </div>
          </div>
          <button
            onClick={() => navigate('/citizen/farmer/send-goods')}
            className="text-xs text-[#4f378a] hover:underline font-bold"
          >
            Edit Cargo Details
          </button>
        </div>

        {/* Primary Recommended Card */}
        {bestOption ? (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#4f378a] shadow-xl relative overflow-hidden space-y-6">
            <div className="absolute top-0 right-0 bg-[#4f378a] text-white px-5 py-1.5 rounded-bl-2xl font-extrabold text-xs flex items-center gap-1.5 shadow-xs">
              <span className="material-symbols-outlined text-[16px]">stars</span>
              #1 HIGHEST SCORING MATCH
            </div>

            {/* Carrier Title */}
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#e1d4fd] text-[#4f378a] flex items-center justify-center font-bold shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-[32px]">
                  {bestOption.type === 'PUBLIC_BUS' ? 'directions_bus' : 'local_shipping'}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-black text-[#1d1b20]">{bestOption.vehicleName}</h2>
                <p className="text-xs text-gray-500 font-semibold">{bestOption.providerName} • {bestOption.badge}</p>
                <div className="text-xs text-emerald-700 font-bold mt-1">
                  Verified Available Cargo Space: {bestOption.availableCapacityKg} kg
                </div>
              </div>
            </div>

            {/* AI Explanation Box (Requirement) */}
            <div className="p-4 bg-[#f8f2fa] rounded-2xl border border-[#e1d4fd] space-y-2">
              <div className="text-xs font-bold text-[#4f378a] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">psychology</span>
                Why Connect AI Recommends This Carrier:
              </div>
              <p className="text-xs text-[#1d1b20] leading-relaxed">
                {evalResult.recommendationExplanation}
              </p>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-center">
                <div className="text-lg font-black text-emerald-700">100%</div>
                <div className="text-[10px] font-bold text-gray-500 uppercase">Capacity Match</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-center">
                <div className="text-lg font-black text-[#4f378a]">{bestOption.departureTime}</div>
                <div className="text-[10px] font-bold text-gray-500 uppercase">Earliest Departure</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-center">
                <div className="text-lg font-black text-purple-700">₹{bestOption.costEstimate}</div>
                <div className="text-[10px] font-bold text-gray-500 uppercase">Estimated Freight</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-center">
                <div className="text-lg font-black text-blue-700">{bestOption.estimatedArrival}</div>
                <div className="text-[10px] font-bold text-gray-500 uppercase">Est. Delivery</div>
              </div>
            </div>

            {/* Accept Button */}
            <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-xs text-gray-500">
                Guaranteed cargo bay reservation upon confirmation.
              </div>

              <button
                onClick={handleAcceptRecommendation}
                disabled={bookingLoading}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#4f378a] hover:bg-[#382467] text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {bookingLoading ? (
                  <span>RECORDING BOOKING...</span>
                ) : (
                  <>
                    <span>ACCEPT AI RECOMMENDED DISPATCH</span>
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-3xl border border-[#cbc4d2]/40">
            <span className="material-symbols-outlined text-5xl text-gray-300 mb-2">warning</span>
            <h3 className="font-bold text-base text-gray-800">No Carrier Meets This Cargo Size</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              Please submit a custom carrier quote request or divide your produce into smaller lots.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
