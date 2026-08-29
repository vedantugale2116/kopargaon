import React, { useState } from 'react';
import { Sidebar } from '../../components/common/Sidebar';
import { useData } from '../../context/DataContext';
import { TrafficReport } from '../../lib/mockData';

export const TrafficSafetyManagement: React.FC = () => {
  const { trafficReports, trafficRegions, acknowledgeTrafficReport, issueAlertFromTraffic, resolveTrafficReport } = useData();

  const [selectedReport, setSelectedReport] = useState<TrafficReport | null>(null);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertDesc, setAlertDesc] = useState('');
  const [alertIssuedSuccess, setAlertIssuedSuccess] = useState(false);

  const handleIssueAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport) return;
    issueAlertFromTraffic(selectedReport.id, alertTitle, alertDesc);
    setAlertIssuedSuccess(true);
    setTimeout(() => {
      setAlertIssuedSuccess(false);
      setSelectedReport(null);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex bg-[#f8f2fa] font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 bg-white/95 backdrop-blur-md border-b border-[#cbc4d2]/40 px-6 flex items-center justify-between sticky top-0 z-30">
          <div>
            <h1 className="text-lg font-black text-[#1d1b20] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#765b00]">traffic</span>
              Traffic Incident & Photo Report Verification
            </h1>
            <p className="text-[11px] text-gray-500">Review citizen photo submissions, verify severity levels, and broadcast municipal alerts</p>
          </div>
        </header>

        <main className="p-6 space-y-6 max-w-7xl w-full mx-auto">
          {/* Corridor Severity Overview */}
          <div className="bg-white rounded-2xl p-5 border border-[#cbc4d2]/40 shadow-xs space-y-3">
            <h2 className="text-xs font-extrabold text-[#1d1b20] uppercase tracking-wider">
              Active Regional Road Severities
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {trafficRegions.map((reg) => (
                <div key={reg.id} className="p-3 bg-[#fdf7ff] rounded-xl border border-gray-200">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-xs text-[#1d1b20] truncate max-w-[130px]">{reg.name}</span>
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                      reg.currentTraffic === 'RED' ? 'bg-red-100 text-red-700' :
                      reg.currentTraffic === 'ORANGE' ? 'bg-orange-100 text-orange-800' :
                      reg.currentTraffic === 'YELLOW' ? 'bg-yellow-100 text-yellow-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {reg.currentTraffic}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-500 mt-2">
                    {reg.reportCount} Verified Reports • Avg {reg.avgSpeedKmph} km/h
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Citizen Photo Reports Feed */}
          <div className="bg-white rounded-2xl border border-[#cbc4d2]/40 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-[#cbc4d2]/30 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-extrabold text-[#1d1b20]">Citizen Traffic & Incident Feed</h3>
                <p className="text-xs text-gray-500 mt-0.5">Uploaded photos and descriptions requiring official action</p>
              </div>
            </div>

            <div className="p-5 space-y-4">
              {trafficReports.map((rep) => (
                <div
                  key={rep.id}
                  className="p-5 bg-[#fdf7ff] rounded-2xl border border-gray-200 flex flex-col md:flex-row justify-between gap-5"
                >
                  {/* Photo & Details */}
                  <div className="flex gap-4 items-start">
                    <div className="w-28 h-24 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0 shadow-xs">
                      <img src={rep.photoUrl} alt="Traffic" className="w-full h-full object-cover" />
                    </div>

                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-sm text-[#1d1b20]">{rep.roadName}</span>
                        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                          rep.severity === 'SEVERE' ? 'bg-red-100 text-red-700' :
                          rep.severity === 'HEAVY' ? 'bg-orange-100 text-orange-800' :
                          rep.severity === 'MODERATE' ? 'bg-yellow-100 text-yellow-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {rep.severity} SEVERITY
                        </span>
                        <span className="text-xs text-gray-500 font-semibold">• {rep.status}</span>
                      </div>

                      <p className="text-xs text-gray-700 font-medium leading-relaxed">
                        "{rep.description}"
                      </p>

                      <div className="text-[11px] text-gray-500 flex items-center gap-3">
                        <span>Reported by: <strong>{rep.userName}</strong></span>
                        <span>•</span>
                        <span>Location: {rep.locationDescription}</span>
                        <span>•</span>
                        <span>Time: {rep.timestamp}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex md:flex-col justify-end items-end gap-2 shrink-0 border-t md:border-t-0 md:border-l border-gray-200 pt-3 md:pt-0 md:pl-5">
                    {rep.status !== 'ACKNOWLEDGED' && rep.status !== 'ALERT_ISSUED' && rep.status !== 'RESOLVED' && (
                      <button
                        onClick={() => acknowledgeTrafficReport(rep.id)}
                        className="px-3 py-1.5 bg-blue-50 text-blue-800 hover:bg-blue-100 text-xs font-bold rounded-lg transition-colors"
                      >
                        Acknowledge
                      </button>
                    )}

                    {rep.status !== 'ALERT_ISSUED' && rep.status !== 'RESOLVED' && (
                      <button
                        onClick={() => {
                          setSelectedReport(rep);
                          setAlertTitle(`Congestion Warning: ${rep.roadName}`);
                          setAlertDesc(`Heavy vehicular queuing reported near ${rep.locationDescription}. ${rep.description}`);
                        }}
                        className="px-3 py-1.5 bg-[#765b00] hover:bg-[#594400] text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
                      >
                        Issue Safety Alert
                      </button>
                    )}

                    {rep.status !== 'RESOLVED' ? (
                      <button
                        onClick={() => resolveTrafficReport(rep.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors"
                      >
                        Mark Resolved
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">check_circle</span>
                        Resolved
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Issue Alert Modal */}
          {selectedReport && (
            <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-[#cbc4d2]/60 animate-in zoom-in-95 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-extrabold text-base text-[#1d1b20]">
                    Broadcast Official Safety Alert
                  </h3>
                  <button onClick={() => setSelectedReport(null)} className="text-gray-400 hover:text-black">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                {alertIssuedSuccess && (
                  <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">check_circle</span>
                    Safety alert broadcasted to all citizens and drivers!
                  </div>
                )}

                <form onSubmit={handleIssueAlert} className="space-y-4 text-xs">
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-gray-600">Alert Title *</label>
                    <input
                      type="text"
                      required
                      value={alertTitle}
                      onChange={(e) => setAlertTitle(e.target.value)}
                      className="bg-[#f8f2fa] text-xs p-2.5 rounded-xl border border-[#cbc4d2] font-bold"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-gray-600">Public Advisory Description *</label>
                    <textarea
                      rows={3}
                      required
                      value={alertDesc}
                      onChange={(e) => setAlertDesc(e.target.value)}
                      className="bg-[#f8f2fa] text-xs p-2.5 rounded-xl border border-[#cbc4d2]"
                    ></textarea>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedReport(null)}
                      className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">campaign</span>
                      Broadcast Alert Now
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
