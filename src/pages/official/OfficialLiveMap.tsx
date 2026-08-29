import React, { useState } from 'react';
import { Sidebar } from '../../components/common/Sidebar';
import { KopargaonMap } from '../../components/map/KopargaonMap';
import { useData } from '../../context/DataContext';

export const OfficialLiveMap: React.FC = () => {
  const { buses } = useData();
  const [selectedBusId, setSelectedBusId] = useState<string>(buses[0]?.id || '');

  const selectedBus = buses.find(b => b.id === selectedBusId) || buses[0];

  return (
    <div className="min-h-screen flex bg-[#f8f2fa] font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 bg-white/95 backdrop-blur-md border-b border-[#cbc4d2]/40 px-6 flex items-center justify-between sticky top-0 z-30">
          <div>
            <h1 className="text-lg font-black text-[#1d1b20] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#765b00]">map</span>
              Live Fleet Telemetry & Highway Transit Map
            </h1>
            <p className="text-[11px] text-gray-500">Live GPS tracking of MSRTC public fleet across Kopargaon taluka</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-[#10B981]/15 text-[#10B981] rounded-full text-xs font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping"></span>
              GPS Gateway Connected
            </span>
          </div>
        </header>

        <main className="p-6 space-y-6 max-w-7xl w-full mx-auto">
          {/* Map Container */}
          <div className="h-[550px] rounded-2xl overflow-hidden shadow-md border border-[#cbc4d2]/40 bg-white">
            <KopargaonMap
              isOfficial={true}
              selectedBusId={selectedBusId}
              onSelectBus={(id) => setSelectedBusId(id)}
              height="550px"
            />
          </div>

          {/* Selected Bus Telemetry Card */}
          {selectedBus && (
            <div className="bg-white rounded-2xl p-6 border border-[#cbc4d2]/40 shadow-xs grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase">SELECTED VEHICLE</span>
                <h3 className="text-lg font-black text-[#1d1b20] mt-0.5">{selectedBus.busNumber}</h3>
                <p className="text-xs text-gray-500">Driver: {selectedBus.driverName} ({selectedBus.contactNumber})</p>
              </div>

              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase">CURRENT ROUTE & SPEED</span>
                <div className="text-xs font-bold text-[#1d1b20] mt-0.5">{selectedBus.currentStop} → {selectedBus.destination}</div>
                <p className="text-xs text-emerald-700 font-semibold">{selectedBus.speed} km/h • GPS Active</p>
              </div>

              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase">CARGO BAY OCCUPANCY</span>
                <div className="text-xs font-bold text-[#4f378a] mt-0.5">
                  {selectedBus.availableCargoKg} kg Available (of {selectedBus.totalCargoKg} kg)
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="h-full bg-[#4f378a] rounded-full"
                    style={{ width: `${(selectedBus.usedCargoKg / selectedBus.totalCargoKg) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex flex-col justify-center items-end gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  selectedBus.status === 'DELAYED' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  Status: {selectedBus.status}
                </span>
                <a
                  href={`tel:${selectedBus.contactNumber}`}
                  className="px-4 py-1.5 bg-[#765b00] hover:bg-[#594400] text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1 shadow-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">call</span>
                  Contact Driver ({selectedBus.contactNumber})
                </a>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
