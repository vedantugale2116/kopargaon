import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { VerificationBadge } from '../../components/common/VerificationBadge';

export const EVStations: React.FC = () => {
  const { evStations } = useData();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'FAST' | 'AC' | 'HIGHWAY'>('ALL');
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const filteredStations = evStations.filter(station => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match = station.name.toLowerCase().includes(q) ||
        station.location.toLowerCase().includes(q) ||
        station.address.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (onlyAvailable && station.availableChargers === 0) return false;
    if (filterType === 'FAST' && !station.chargerType.includes('DC')) return false;
    if (filterType === 'AC' && !station.chargerType.includes('AC')) return false;
    if (filterType === 'HIGHWAY' && !station.nearHighway) return false;
    return true;
  });

  const handleDirectionsClick = (stationId: string) => {
    // Navigate directly to the Live Map passing the EV station ID
    navigate(`/citizen/map?evStation=${stationId}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fdf7ff] font-sans">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-[#1d1b20] tracking-tight flex items-center gap-2">
              <span className="material-symbols-outlined text-[#059669]">ev_station</span>
              EV Charging Stations — Kopargaon Network
            </h1>
            <p className="text-xs text-[#494551] mt-0.5">
              Locate public electric vehicle charging points, DC fast chargers, and farm solar hubs in Kopargaon.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs bg-white px-3 py-1.5 rounded-xl border border-[#cbc4d2]/40 shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-bold text-gray-700">
              {evStations.reduce((a, s) => a + s.availableChargers, 0)} Ports Active & Available
            </span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-[#cbc4d2]/40 shadow-xs space-y-3">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-[18px]">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search EV Hub by location, corridor, or name (e.g. Shirdi, Sanvatsar, APMC, Depot, Yeola)..."
              className="w-full bg-[#f8f2fa] text-xs text-[#1d1b20] rounded-xl pl-9 pr-3.5 py-2.5 border border-[#cbc4d2] focus:outline-none focus:border-[#059669]"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterType('ALL')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  filterType === 'ALL' ? 'bg-[#059669] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Stations ({evStations.length})
              </button>
            <button
              onClick={() => setFilterType('FAST')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                filterType === 'FAST' ? 'bg-[#059669] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ⚡ DC Fast Charging (60-120 kW)
            </button>
            <button
              onClick={() => setFilterType('AC')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                filterType === 'AC' ? 'bg-[#059669] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🔌 AC Type 2
            </button>
            <button
              onClick={() => setFilterType('HIGHWAY')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                filterType === 'HIGHWAY' ? 'bg-[#059669] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🛣️ Highway SH-10 Corridor
            </button>
          </div>

            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                className="w-4 h-4 rounded text-[#059669] focus:ring-[#059669]"
              />
              <span>Show Available Now Only</span>
            </label>
          </div>
        </div>

        {/* Stations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredStations.map((station) => (
            <div
              key={station.id}
              className="bg-white rounded-2xl p-5 border border-[#cbc4d2]/40 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-extrabold text-base text-[#1d1b20]">{station.name}</h3>
                      <VerificationBadge status="VERIFIED" verifiedBy="MSEDCL Grid Command" size="xs" />
                    </div>
                    <p className="text-xs text-gray-500">{station.address}</p>
                  </div>
                  <span className="text-xs font-extrabold bg-[#e1d4fd] text-[#4f378a] px-2.5 py-1 rounded-lg">
                    {station.distanceKm} km
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                    <span className="text-gray-400 font-semibold block text-[10px]">CHARGER TYPE</span>
                    <span className="font-bold text-[#1d1b20]">{station.chargerType}</span>
                  </div>
                  <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                    <span className="text-gray-400 font-semibold block text-[10px]">POWER OUTPUT</span>
                    <span className="font-bold text-[#1d1b20]">{station.powerOutputKw} kW Output</span>
                  </div>
                  <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                    <span className="text-gray-400 font-semibold block text-[10px]">PRICING TARIFF</span>
                    <span className="font-bold text-[#1d1b20]">{station.pricingPerKwh}</span>
                  </div>
                  <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                    <span className="text-gray-400 font-semibold block text-[10px]">HOURS</span>
                    <span className="font-bold text-[#1d1b20]">{station.operatingHours}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    station.availableChargers > 0 ? 'bg-emerald-500' : 'bg-red-500'
                  }`}></span>
                  <span className="text-xs font-bold text-gray-700">
                    {station.availableChargers} of {station.totalChargers} Available
                  </span>
                </div>

                <button
                  onClick={() => handleDirectionsClick(station.id)}
                  className="px-4 py-1.5 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold rounded-xl flex items-center gap-1 transition-colors shadow-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">navigation</span>
                  Directions
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};
