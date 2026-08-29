import React from 'react';
import { KopargaonMap } from '../../components/map/KopargaonMap';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { useData } from '../../context/DataContext';

export const CitizenLiveMap: React.FC = () => {
  const { buses, trafficRegions, evStations } = useData();

  return (
    <div className="min-h-screen flex flex-col bg-[#fdf7ff] font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-4">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-[#1d1b20] tracking-tight flex items-center gap-2">
              <span className="material-symbols-outlined text-[#4f378a]">map</span>
              Kopargaon Live Mobility & Traffic Map
            </h1>
            <p className="text-xs text-[#494551] mt-0.5">
              Live tracking of rural buses, public cargo bays, dynamic road congestion colors, EV stations, and active safety alerts.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs bg-white px-3.5 py-1.5 rounded-full border border-[#cbc4d2]/50 shadow-xs">
            <span className="flex items-center gap-1 font-bold text-[#4f378a]">
              <span className="material-symbols-outlined text-[16px]">directions_bus</span>
              {buses.length} Buses
            </span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-1 font-bold text-amber-700">
              <span className="material-symbols-outlined text-[16px]">traffic</span>
              {trafficRegions.length} Corridors
            </span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-1 font-bold text-emerald-700">
              <span className="material-symbols-outlined text-[16px]">ev_station</span>
              {evStations.length} EV Hubs
            </span>
          </div>
        </div>

        {/* Map Container */}
        <div className="w-full h-[480px] sm:h-[650px] rounded-2xl overflow-hidden shadow-lg border border-[#cbc4d2]/50">
          <KopargaonMap isOfficial={false} height="100%" />
        </div>

        {/* Info Highlights under map */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="bg-white p-4 rounded-xl border border-[#cbc4d2]/30 shadow-xs">
            <div className="font-bold text-xs text-[#1d1b20] flex items-center gap-1.5 mb-1">
              <span className="material-symbols-outlined text-[#4f378a] text-[18px]">touch_app</span>
              Interactive Features
            </div>
            <p className="text-[11px] text-[#494551] leading-relaxed">
              Click on any bus to view live speed, route, and available cargo capacity. Click on road segments to inspect traffic reports.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#cbc4d2]/30 shadow-xs">
            <div className="font-bold text-xs text-[#1d1b20] flex items-center gap-1.5 mb-1">
              <span className="material-symbols-outlined text-amber-700 text-[18px]">traffic</span>
              Dynamic Traffic Coloring
            </div>
            <p className="text-[11px] text-[#494551] leading-relaxed">
              Green (0-1 reports), Yellow (2-3 reports), Orange (4 reports), Red (5+ reports). Colors update dynamically when citizens report incidents.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#cbc4d2]/30 shadow-xs">
            <div className="font-bold text-xs text-[#1d1b20] flex items-center gap-1.5 mb-1">
              <span className="material-symbols-outlined text-emerald-700 text-[18px]">ev_station</span>
              EV Fast Charging Hubs
            </div>
            <p className="text-[11px] text-[#494551] leading-relaxed">
              Find DC Fast chargers at Kopargaon Central Bus Depot and along SH-10 Highway with real-time port availability.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
