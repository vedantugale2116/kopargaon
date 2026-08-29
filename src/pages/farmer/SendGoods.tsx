import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';

export const SendGoods: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    pickupLocation: 'Kopargaon APMC Yard',
    destination: 'Nashik Agriculture Market',
    goodsType: 'Pomegranate Crates (Fresh Harvest)',
    quantity: '25 crates',
    weightKg: 250,
    preferredDate: '2026-08-30',
    preferredTime: 'Morning (09:00 AM)',
    specialNotes: 'Perishable agro produce. Require dry covered transport.'
  });

  const goodsPresetOptions = [
    { label: 'Pomegranates (250 kg)', type: 'Pomegranate Crates (Fresh Harvest)', weight: 250, qty: '25 crates' },
    { label: 'Red Onions (500 kg)', type: 'Red Onion Sacks', weight: 500, qty: '10 sacks (50kg each)' },
    { label: 'Shirdi Temple Flowers (90 kg)', type: 'Fresh Marigold Flowers & Tulsi', weight: 90, qty: '12 bags' },
    { label: 'Organic Vegetables (150 kg)', type: 'Mixed Green Vegetables (Crates)', weight: 150, qty: '15 crates' }
  ];

  const handleApplyPreset = (preset: typeof goodsPresetOptions[0]) => {
    setFormData({
      ...formData,
      goodsType: preset.type,
      weightKg: preset.weight,
      quantity: preset.qty
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Pass search criteria to available transport page via query params
    const query = new URLSearchParams({
      pickup: formData.pickupLocation,
      dest: formData.destination,
      weight: formData.weightKg.toString(),
      goods: formData.goodsType,
      date: formData.preferredDate,
      time: formData.preferredTime,
      qty: formData.quantity,
      notes: formData.specialNotes
    }).toString();

    navigate(`/citizen/farmer/transport?${query}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fdf7ff] font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-200 text-gray-700 transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">arrow_back</span>
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-[#1d1b20] tracking-tight flex items-center gap-2">
              <span className="material-symbols-outlined text-[#4f378a]">local_shipping</span>
              Send Agricultural Goods & Produce
            </h1>
            <p className="text-xs text-[#494551] mt-0.5">
              Enter your cargo dispatch details to match with available public bus cargo bays and private transporters.
            </p>
          </div>
        </div>

        {/* Quick Presets for Demo Evaluation */}
        <div className="bg-white p-4 rounded-2xl border border-[#cbc4d2]/40 shadow-xs">
          <div className="text-xs font-bold text-gray-600 mb-2 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#4f378a] text-[16px]">touch_app</span>
            Quick Cargo Presets (Kopargaon Farm Harvest Scenarios):
          </div>
          <div className="flex flex-wrap gap-2">
            {goodsPresetOptions.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  formData.weightKg === p.weight && formData.goodsType === p.type
                    ? 'bg-[#4f378a] text-white border-[#4f378a] shadow-xs'
                    : 'bg-[#fdf7ff] text-[#4f378a] border-[#cbc4d2]/40 hover:bg-[#e1d4fd]/30'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dispatch Form matching Stitch Send_Goods.html */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#cbc4d2]/40">
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Origin & Destination Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#4b4263]">
                  Pickup Location / Farm Gate *
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#7a7582] text-[18px]">
                    trip_origin
                  </span>
                  <input
                    type="text"
                    required
                    value={formData.pickupLocation}
                    onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                    placeholder="e.g. Kopargaon APMC Yard / Sanvatsar"
                    className="w-full bg-[#f8f2fa] text-xs text-[#1d1b20] font-semibold rounded-xl py-2.5 pl-9 pr-3 border border-[#cbc4d2] focus:outline-none focus:border-[#4f378a]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#4b4263]">
                  Destination Produce Market *
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#7a7582] text-[18px]">
                    location_on
                  </span>
                  <input
                    type="text"
                    required
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    placeholder="e.g. Nashik APMC / Shirdi Temple / Sangamner"
                    className="w-full bg-[#f8f2fa] text-xs text-[#1d1b20] font-semibold rounded-xl py-2.5 pl-9 pr-3 border border-[#cbc4d2] focus:outline-none focus:border-[#4f378a]"
                  />
                </div>
              </div>
            </div>

            {/* Goods Type & Quantity */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-xs font-semibold text-[#4b4263]">
                  Produce / Goods Description *
                </label>
                <input
                  type="text"
                  required
                  value={formData.goodsType}
                  onChange={(e) => setFormData({ ...formData, goodsType: e.target.value })}
                  placeholder="e.g. Fresh Pomegranates / Red Onions / Vegetables"
                  className="w-full bg-[#f8f2fa] text-xs text-[#1d1b20] rounded-xl py-2.5 px-3 border border-[#cbc4d2] focus:outline-none focus:border-[#4f378a]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#4b4263]">
                  Packaging & Unit Count *
                </label>
                <input
                  type="text"
                  required
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="e.g. 25 crates / 10 sacks"
                  className="w-full bg-[#f8f2fa] text-xs text-[#1d1b20] rounded-xl py-2.5 px-3 border border-[#cbc4d2] focus:outline-none focus:border-[#4f378a]"
                />
              </div>
            </div>

            {/* Approximate Weight, Date, Time */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#4b4263]">
                  Total Weight (kg) *
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#7a7582] text-[18px]">
                    scale
                  </span>
                  <input
                    type="number"
                    min="1"
                    max="5000"
                    required
                    value={formData.weightKg}
                    onChange={(e) => setFormData({ ...formData, weightKg: Number(e.target.value) })}
                    className="w-full bg-[#f8f2fa] text-xs font-bold text-[#1d1b20] rounded-xl py-2.5 pl-9 pr-3 border border-[#cbc4d2] focus:outline-none focus:border-[#4f378a]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#4b4263]">
                  Dispatch Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.preferredDate}
                  onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                  className="w-full bg-[#f8f2fa] text-xs text-[#1d1b20] rounded-xl py-2.5 px-3 border border-[#cbc4d2] focus:outline-none focus:border-[#4f378a]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#4b4263]">
                  Preferred Time Slot
                </label>
                <input
                  type="text"
                  value={formData.preferredTime}
                  onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                  placeholder="e.g. 09:00 AM / Morning"
                  className="w-full bg-[#f8f2fa] text-xs text-[#1d1b20] rounded-xl py-2.5 px-3 border border-[#cbc4d2] focus:outline-none focus:border-[#4f378a]"
                />
              </div>
            </div>

            {/* Special Instructions */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#4b4263]">
                Special Handling Requirements
              </label>
              <textarea
                rows={2}
                value={formData.specialNotes}
                onChange={(e) => setFormData({ ...formData, specialNotes: e.target.value })}
                placeholder="e.g. Perishable produce, tarpaulin rain cover required, gentle loading needed..."
                className="w-full bg-[#f8f2fa] text-xs text-[#1d1b20] rounded-xl py-2 px-3 border border-[#cbc4d2] focus:outline-none focus:border-[#4f378a]"
              ></textarea>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row justify-between items-center gap-3">
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-emerald-600">verified</span>
                Verified rural freight rates start at ₹2.50 / kg
              </span>

              <button
                type="submit"
                className="w-full sm:w-auto bg-[#4f378a] hover:bg-[#382467] text-white font-bold text-xs px-8 py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <span>FIND MATCHING TRANSPORT</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};
