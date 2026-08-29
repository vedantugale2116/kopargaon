import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { evaluateTransportOptions, TransportOption } from '../../lib/aiRecommender';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';

export const AvailableTransport: React.FC = () => {
  const { user } = useAuth();
  const { schedules, trips, trafficRegions, createShipment } = useData();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const pickup = searchParams.get('pickup') || 'Kopargaon APMC Yard';
  const dest = searchParams.get('dest') || 'Nashik Agriculture Market';
  const weight = Number(searchParams.get('weight')) || 250;
  const goods = searchParams.get('goods') || 'Pomegranate Crates (Fresh Harvest)';
  const date = searchParams.get('date') || '2026-08-30';
  const time = searchParams.get('time') || '09:00 AM';
  const qty = searchParams.get('qty') || '25 crates';
  const notes = searchParams.get('notes') || 'Perishable cargo';

  const [filterMode, setFilterMode] = useState<'ALL' | 'BUS' | 'TRANSPORTER'>('ALL');
  const [bookingInProgress, setBookingInProgress] = useState<string | null>(null);

  // Evaluate options using the engine
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

  const displayedOptions = evalResult.allRankedOptions.filter(opt => {
    if (filterMode === 'BUS') return opt.type === 'PUBLIC_BUS';
    if (filterMode === 'TRANSPORTER') return opt.type === 'PRIVATE_TRANSPORTER';
    return true;
  });

  const handleBookOption = (option: TransportOption) => {
    setBookingInProgress(option.id);

    setTimeout(() => {
      const newShipmentId = createShipment({
        farmerId: user?.id || 'farmer-1',
        farmerName: user?.name || 'Balasaheb Vikhe',
        farmerPhone: user?.phone || '+91 98220 11223',
        origin: pickup,
        destination: dest,
        goodsType: goods,
        quantity: qty,
        weightKg: weight,
        preferredDate: date,
        preferredTime: time,
        specialNotes: notes,
        assignedType: option.type,
        transporterName: option.type === 'PUBLIC_BUS' ? `${option.providerName} (${option.vehicleNumber})` : option.providerName,
        transporterVehicle: option.vehicleName,
        transporterPhone: '+91 98223 90112',
        estimatedCost: option.costEstimate,
        currentStatus: option.type === 'PUBLIC_BUS' ? 'IN TRANSIT' : 'ACCEPTED',
        estimatedDelivery: `${date} ${option.estimatedArrival}`
      });

      navigate(`/citizen/farmer/track?id=${newShipmentId}`);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fdf7ff] font-sans">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-[#1d1b20] tracking-tight flex items-center gap-2">
              <span className="material-symbols-outlined text-[#4f378a]">commute</span>
              Available Freight Transport
            </h1>
            <p className="text-xs text-[#494551] mt-0.5">
              Matching for <strong className="text-[#1d1b20]">{weight} kg {goods}</strong> from {pickup} to {dest}.
            </p>
          </div>

          <Link
            to={`/citizen/farmer/ai?pickup=${encodeURIComponent(pickup)}&dest=${encodeURIComponent(dest)}&weight=${weight}&goods=${encodeURIComponent(goods)}`}
            className="bg-[#e1d4fd] hover:bg-[#cfbcff] text-[#4f378a] px-4 py-2.5 rounded-xl font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all border border-[#4f378a]/20"
          >
            <span className="material-symbols-outlined text-[18px]">psychology</span>
            View Connect AI Recommendation
          </Link>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-3 rounded-2xl border border-[#cbc4d2]/40 shadow-xs flex items-center justify-between gap-3">
          <div className="flex gap-2">
            <button
              onClick={() => setFilterMode('ALL')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterMode === 'ALL' ? 'bg-[#4f378a] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Available ({evalResult.allRankedOptions.length})
            </button>
            <button
              onClick={() => setFilterMode('BUS')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterMode === 'BUS' ? 'bg-[#4f378a] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🚌 Public Bus Cargo Bay
            </button>
            <button
              onClick={() => setFilterMode('TRANSPORTER')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterMode === 'TRANSPORTER' ? 'bg-[#4f378a] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🚛 Private Rural Transporters
            </button>
          </div>

          <span className="text-xs text-gray-500 hidden sm:block">
            Ranked by capacity match & cost
          </span>
        </div>

        {/* Transport List */}
        <div className="space-y-4">
          {displayedOptions.map((opt) => (
            <div
              key={opt.id}
              className={`p-6 rounded-2xl border transition-all bg-white relative overflow-hidden ${
                opt.isAiRecommended
                  ? 'border-[#4f378a] shadow-md ring-2 ring-[#4f378a]/20'
                  : 'border-[#cbc4d2]/40 shadow-xs hover:shadow-md'
              }`}
            >
              {opt.isAiRecommended && (
                <div className="absolute top-0 right-0 bg-[#4f378a] text-white text-[10px] uppercase font-extrabold px-3 py-1 rounded-bl-xl flex items-center gap-1 shadow-xs">
                  <span className="material-symbols-outlined text-[14px]">psychology</span>
                  Connect AI Top Match
                </div>
              )}

              <div className="flex flex-col lg:flex-row justify-between gap-6">
                {/* Details */}
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white ${
                      opt.type === 'PUBLIC_BUS' ? 'bg-[#4f378a]' : 'bg-purple-700'
                    }`}>
                      <span className="material-symbols-outlined text-[20px]">
                        {opt.type === 'PUBLIC_BUS' ? 'directions_bus' : 'local_shipping'}
                      </span>
                    </span>
                    <div>
                      <h3 className="font-extrabold text-base text-[#1d1b20]">{opt.vehicleName}</h3>
                      <p className="text-xs text-gray-500">{opt.providerName}</p>
                    </div>
                    <span className="text-[10px] font-extrabold bg-[#f8f2fa] text-[#4f378a] px-2.5 py-1 rounded-lg border border-[#cbc4d2]/40 ml-2">
                      {opt.badge}
                    </span>
                  </div>

                  <div className="text-xs text-gray-700 font-semibold flex items-center gap-2 flex-wrap">
                    <span>From: <strong>{opt.origin}</strong></span>
                    <span className="material-symbols-outlined text-gray-400 text-[16px]">arrow_forward</span>
                    <span>To: <strong>{opt.destination}</strong></span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs bg-gray-50 p-2.5 rounded-xl border border-gray-100 max-w-lg">
                    <div>
                      <span className="text-[10px] text-gray-400 block font-bold">DEPARTURE</span>
                      <strong className="text-[#1d1b20]">{opt.departureTime}</strong>
                    </div>
                    <span className="text-gray-300">•</span>
                    <div>
                      <span className="text-[10px] text-gray-400 block font-bold">EST. ARRIVAL</span>
                      <strong className="text-[#1d1b20]">{opt.estimatedArrival}</strong>
                    </div>
                    <span className="text-gray-300">•</span>
                    <div>
                      <span className="text-[10px] text-gray-400 block font-bold">AVAILABLE CAPACITY</span>
                      <strong className="text-emerald-700">{opt.availableCapacityKg} kg Available</strong>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 italic">
                    "{opt.suitabilityReason}"
                  </p>
                </div>

                {/* Pricing & Booking */}
                <div className="lg:w-64 flex flex-col justify-between items-end border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 lg:pt-0 lg:pl-6 gap-3">
                  <div className="text-right">
                    <div className="text-2xl font-black text-[#1d1b20]">₹{opt.costEstimate}</div>
                    <div className="text-xs text-gray-500">Total freight for {weight} kg</div>
                  </div>

                  <button
                    onClick={() => handleBookOption(opt)}
                    disabled={bookingInProgress === opt.id}
                    className={`w-full py-3 rounded-xl font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all ${
                      opt.isAiRecommended
                        ? 'bg-[#4f378a] hover:bg-[#382467] text-white shadow-md'
                        : 'bg-[#C8D9E6] hover:bg-[#b0c8dc] text-[#22005d]'
                    }`}
                  >
                    {bookingInProgress === opt.id ? (
                      <span>CONFIRMING DISPATCH...</span>
                    ) : (
                      <>
                        <span>BOOK THIS CARRIER</span>
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};
