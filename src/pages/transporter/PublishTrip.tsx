import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';

export const PublishTrip: React.FC = () => {
  const { user } = useAuth();
  const { publishTrip } = useData();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    vehicleType: user?.vehicleDetails?.vehicleType || 'Mahindra Bolero Maxi Truck (Pickup)',
    vehicleNumber: user?.vehicleDetails?.vehicleNumber || 'MH-17-AG-8821',
    origin: 'Kopargaon APMC Yard',
    destination: 'Nashik Agriculture Produce Market',
    date: '2026-08-30',
    departureTime: '09:00 AM',
    estimatedArrival: '11:15 AM',
    totalCapacityKg: 1200,
    availableCapacityKg: 1200,
    chargePerKg: 3.2,
    acceptedGoodsTypes: 'Onions, Pomegranates, Grapes, Vegetables, Grain Sacks',
    notes: 'Covered tarpaulin available. Farm gate pickup available along highway.'
  });

  const [published, setPublished] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    publishTrip({
      transporterId: user?.id || 'trans-1',
      transporterName: user?.name || 'Santosh Tribhuvan',
      phone: user?.phone || '+91 98223 90112',
      vehicleType: formData.vehicleType,
      vehicleNumber: formData.vehicleNumber,
      origin: formData.origin,
      destination: formData.destination,
      date: formData.date,
      departureTime: formData.departureTime,
      estimatedArrival: formData.estimatedArrival,
      totalCapacityKg: Number(formData.totalCapacityKg),
      availableCapacityKg: Number(formData.availableCapacityKg),
      acceptedGoodsTypes: formData.acceptedGoodsTypes.split(',').map(s => s.trim()),
      chargePerKg: Number(formData.chargePerKg),
      notes: formData.notes
    });

    setPublished(true);
    setTimeout(() => {
      navigate('/citizen/transporter/trips');
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fdf7ff] font-sans">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
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
              <span className="material-symbols-outlined text-[#4f378a]">publish</span>
              Publish Vehicle Freight Trip
            </h1>
            <p className="text-xs text-[#494551] mt-0.5">
              List your scheduled transit route and available cargo capacity to receive booking requests from local farmers.
            </p>
          </div>
        </div>

        {published && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 animate-in fade-in">
            <span className="material-symbols-outlined text-2xl text-emerald-600">check_circle</span>
            <div>
              <div className="font-bold text-sm">Trip Published Successfully!</div>
              <div className="text-xs text-emerald-700">
                Your available capacity is now visible to all farmers across Kopargaon. Redirecting...
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#cbc4d2]/40">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Vehicle Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#4b4263]">Vehicle Model / Type *</label>
                <input
                  type="text"
                  required
                  value={formData.vehicleType}
                  onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                  className="w-full bg-[#f8f2fa] text-xs text-[#1d1b20] rounded-xl py-2.5 px-3 border border-[#cbc4d2] focus:outline-none focus:border-[#4f378a]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#4b4263]">Vehicle Registration Number *</label>
                <input
                  type="text"
                  required
                  value={formData.vehicleNumber}
                  onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                  className="w-full bg-[#f8f2fa] text-xs text-[#1d1b20] font-mono rounded-xl py-2.5 px-3 border border-[#cbc4d2] focus:outline-none focus:border-[#4f378a]"
                />
              </div>
            </div>

            {/* Origin & Destination */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#4b4263]">Origin (From) *</label>
                <input
                  type="text"
                  required
                  value={formData.origin}
                  onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                  className="w-full bg-[#f8f2fa] text-xs text-[#1d1b20] rounded-xl py-2.5 px-3 border border-[#cbc4d2] focus:outline-none focus:border-[#4f378a]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#4b4263]">Destination (To) *</label>
                <input
                  type="text"
                  required
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  className="w-full bg-[#f8f2fa] text-xs text-[#1d1b20] rounded-xl py-2.5 px-3 border border-[#cbc4d2] focus:outline-none focus:border-[#4f378a]"
                />
              </div>
            </div>

            {/* Date, Departure & Arrival */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#4b4263]">Trip Date *</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-[#f8f2fa] text-xs text-[#1d1b20] rounded-xl py-2.5 px-3 border border-[#cbc4d2] focus:outline-none focus:border-[#4f378a]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#4b4263]">Departure Time *</label>
                <input
                  type="text"
                  required
                  value={formData.departureTime}
                  onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                  placeholder="09:00 AM"
                  className="w-full bg-[#f8f2fa] text-xs text-[#1d1b20] rounded-xl py-2.5 px-3 border border-[#cbc4d2] focus:outline-none focus:border-[#4f378a]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#4b4263]">Est. Arrival Time</label>
                <input
                  type="text"
                  value={formData.estimatedArrival}
                  onChange={(e) => setFormData({ ...formData, estimatedArrival: e.target.value })}
                  placeholder="11:15 AM"
                  className="w-full bg-[#f8f2fa] text-xs text-[#1d1b20] rounded-xl py-2.5 px-3 border border-[#cbc4d2] focus:outline-none focus:border-[#4f378a]"
                />
              </div>
            </div>

            {/* Capacity & Rate */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#4b4263]">Available Cargo Capacity (kg) *</label>
                <input
                  type="number"
                  min="50"
                  max="10000"
                  required
                  value={formData.availableCapacityKg}
                  onChange={(e) => setFormData({ ...formData, availableCapacityKg: Number(e.target.value), totalCapacityKg: Number(e.target.value) })}
                  className="w-full bg-[#f8f2fa] text-xs font-bold text-[#1d1b20] rounded-xl py-2.5 px-3 border border-[#cbc4d2] focus:outline-none focus:border-[#4f378a]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#4b4263]">Freight Charge Rate (₹ / kg) *</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.5"
                  required
                  value={formData.chargePerKg}
                  onChange={(e) => setFormData({ ...formData, chargePerKg: Number(e.target.value) })}
                  className="w-full bg-[#f8f2fa] text-xs font-bold text-[#1d1b20] rounded-xl py-2.5 px-3 border border-[#cbc4d2] focus:outline-none focus:border-[#4f378a]"
                />
              </div>
            </div>

            {/* Accepted Goods & Notes */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#4b4263]">Accepted Produce / Goods Types</label>
              <input
                type="text"
                value={formData.acceptedGoodsTypes}
                onChange={(e) => setFormData({ ...formData, acceptedGoodsTypes: e.target.value })}
                className="w-full bg-[#f8f2fa] text-xs text-[#1d1b20] rounded-xl py-2.5 px-3 border border-[#cbc4d2] focus:outline-none focus:border-[#4f378a]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#4b4263]">Special Route Notes & Tarpaulin Facility</label>
              <textarea
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full bg-[#f8f2fa] text-xs text-[#1d1b20] rounded-xl py-2 px-3 border border-[#cbc4d2] focus:outline-none focus:border-[#4f378a]"
              ></textarea>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={published}
              className="w-full bg-[#4f378a] hover:bg-[#382467] text-white font-bold text-xs py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">publish</span>
              PUBLISH TRIP TO KOPARGAON FARMER NETWORK
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};
