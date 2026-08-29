import React from 'react';
import { Sidebar } from '../../components/common/Sidebar';
import { useData } from '../../context/DataContext';

export const OfficialShipments: React.FC = () => {
  const { shipments, updateShipmentStatus } = useData();

  return (
    <div className="min-h-screen flex bg-[#f8f2fa] font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 bg-white/95 backdrop-blur-md border-b border-[#cbc4d2]/40 px-6 flex items-center justify-between sticky top-0 z-30">
          <div>
            <h1 className="text-lg font-black text-[#1d1b20] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#765b00]">local_shipping</span>
              Rural Logistics & Agro Cargo Shipments
            </h1>
            <p className="text-[11px] text-gray-500">Master monitoring of public bus cargo allocations and private transporter freight</p>
          </div>
        </header>

        <main className="p-6 space-y-6 max-w-7xl w-full mx-auto">
          {/* Table */}
          <div className="bg-white rounded-2xl border border-[#cbc4d2]/40 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-[#cbc4d2]/30 flex justify-between items-center">
              <div>
                <h2 className="text-sm font-extrabold text-[#1d1b20]">Active Cargo Dispatches ({shipments.length})</h2>
                <p className="text-xs text-gray-500 mt-0.5">Real-time status updates and milestone confirmations</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f8f2fa] text-gray-600 font-bold uppercase text-[10px] border-b border-[#cbc4d2]/30">
                  <tr>
                    <th className="py-3.5 px-4">Tracking ID</th>
                    <th className="py-3.5 px-4">Farmer / Sender</th>
                    <th className="py-3.5 px-4">Route Path</th>
                    <th className="py-3.5 px-4">Produce / Weight</th>
                    <th className="py-3.5 px-4">Assigned Carrier</th>
                    <th className="py-3.5 px-4">Freight Payout</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {shipments.map((ship) => (
                    <tr key={ship.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#4f378a]">
                        {ship.trackingNumber}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-[#1d1b20]">{ship.farmerName}</div>
                        <div className="text-[10px] text-gray-500">{ship.farmerPhone}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-gray-800">{ship.origin}</div>
                        <div className="text-[10px] text-gray-500">To: {ship.destination}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-[#1d1b20]">{ship.goodsType}</div>
                        <div className="text-[10px] text-emerald-700 font-bold">{ship.weightKg} kg ({ship.quantity})</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-gray-800">{ship.transporterName || 'Public Bus Cargo'}</div>
                        <div className="text-[10px] text-gray-500">{ship.transporterVehicle}</div>
                      </td>
                      <td className="py-3 px-4 font-extrabold text-[#1d1b20]">
                        ₹{ship.estimatedCost}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          ship.currentStatus === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800' :
                          ship.currentStatus === 'IN TRANSIT' ? 'bg-blue-100 text-blue-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {ship.currentStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <select
                          value={ship.currentStatus}
                          onChange={(e) => updateShipmentStatus(ship.id, e.target.value as any)}
                          className="bg-[#f8f2fa] text-[11px] font-bold p-1.5 rounded-lg border border-[#cbc4d2]"
                        >
                          <option value="REQUESTED">REQUESTED</option>
                          <option value="MATCHED">MATCHED</option>
                          <option value="ACCEPTED">ACCEPTED</option>
                          <option value="PICKUP">PICKUP</option>
                          <option value="IN TRANSIT">IN TRANSIT</option>
                          <option value="DELIVERED">DELIVERED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
