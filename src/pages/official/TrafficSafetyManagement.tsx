import React, { useState } from 'react';
import { Sidebar } from '../../components/common/Sidebar';
import { useData } from '../../context/DataContext';
import { TrafficReport } from '../../lib/mockData';
import { VerificationBadge } from '../../components/common/VerificationBadge';

export const TrafficSafetyManagement: React.FC = () => {
  const { trafficReports, trafficRegions, acknowledgeTrafficReport, verifyReport, rejectReport, markReportOutdated, issueAlertFromTraffic, resolveTrafficReport } = useData();

  const [activeTab, setActiveTab] = useState<'ALL' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED_OUTDATED'>('ALL');
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

  const filteredReports = trafficReports.filter(rep => {
    if (activeTab === 'UNDER_REVIEW') return rep.verificationStatus === 'UNDER_REVIEW';
    if (activeTab === 'VERIFIED') return rep.verificationStatus === 'VERIFIED';
    if (activeTab === 'REJECTED_OUTDATED') return rep.verificationStatus === 'REJECTED' || rep.verificationStatus === 'OUTDATED';
    return true;
  });

  const pendingCount = trafficReports.filter(r => r.verificationStatus === 'UNDER_REVIEW').length;
  const verifiedCount = trafficReports.filter(r => r.verificationStatus === 'VERIFIED').length;

  return (
    <div className="min-h-screen flex bg-[#f8f2fa] font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 bg-white/95 backdrop-blur-md border-b border-[#cbc4d2]/40 px-6 flex items-center justify-between sticky top-0 z-30">
          <div>
            <h1 className="text-lg font-black text-[#1d1b20] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#765b00]">verified_user</span>
              Official Mobility Information & Incident Verification Center
            </h1>
            <p className="text-[11px] text-gray-500">Review citizen photo submissions, verify severity levels, and broadcast municipal alerts</p>
          </div>
        </header>

        <main className="p-6 space-y-6 max-w-7xl w-full mx-auto">
          {/* Corridor Severity Overview */}
          <div className="bg-white rounded-2xl p-5 border border-[#cbc4d2]/40 shadow-xs space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-extrabold text-[#1d1b20] uppercase tracking-wider">
                Active Regional Road Severities
              </h2>
              <div className="flex gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 font-bold border border-amber-200">
                  {pendingCount} Pending Review
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                  {verifiedCount} Verified
                </span>
              </div>
            </div>
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
                    {reg.reportCount} Active Reports • Avg {reg.avgSpeedKmph} km/h
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Citizen Photo Reports Feed & Verification Console */}
          <div className="bg-white rounded-2xl border border-[#cbc4d2]/40 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-[#cbc4d2]/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 className="text-sm font-extrabold text-[#1d1b20]">Citizen Traffic & Incident Feed</h3>
                <p className="text-xs text-gray-500 mt-0.5">Verify crowdsourced submissions before they become confirmed municipal data</p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-[#f2ecf4] rounded-xl text-xs font-bold">
                <button
                  onClick={() => setActiveTab('ALL')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === 'ALL' ? 'bg-white text-[#1d1b20] shadow-xs' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  All ({trafficReports.length})
                </button>
                <button
                  onClick={() => setActiveTab('UNDER_REVIEW')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                    activeTab === 'UNDER_REVIEW' ? 'bg-white text-amber-900 shadow-xs' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  <span>Under Review</span>
                  <span className="px-1.5 py-0.2 bg-amber-200 text-amber-900 rounded-full text-[10px]">
                    {pendingCount}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('VERIFIED')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === 'VERIFIED' ? 'bg-white text-emerald-800 shadow-xs' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Verified ({verifiedCount})
                </button>
                <button
                  onClick={() => setActiveTab('REJECTED_OUTDATED')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === 'REJECTED_OUTDATED' ? 'bg-white text-gray-800 shadow-xs' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Rejected / Outdated
                </button>
              </div>
            </div>

            <div className="p-5 space-y-4">
              {filteredReports.length === 0 ? (
                <div className="py-12 text-center text-gray-400 text-xs">
                  No reports in this category.
                </div>
              ) : (
                filteredReports.map((rep) => (
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
                          <VerificationBadge
                            status={rep.verificationStatus || 'UNDER_REVIEW'}
                            verifiedBy={rep.verifiedBy}
                            verifiedAt={rep.verifiedAt}
                            duplicateCount={rep.duplicateCount}
                            size="xs"
                          />
                        </div>

                        <p className="text-xs text-gray-700 font-medium leading-relaxed">
                          "{rep.description}"
                        </p>

                        <div className="text-[11px] text-gray-500 flex items-center gap-3 flex-wrap">
                          <span>Reported by: <strong>{rep.userName}</strong></span>
                          <span>•</span>
                          <span>Location: {rep.locationDescription}</span>
                          <span>•</span>
                          <span>Time: {rep.timestamp}</span>
                          {rep.duplicateCount && rep.duplicateCount > 1 && (
                            <>
                              <span>•</span>
                              <span className="text-amber-700 font-bold">
                                {rep.duplicateCount} similar reports received for this area
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Official Actions */}
                    <div className="flex md:flex-col justify-end items-end gap-2 shrink-0 border-t md:border-t-0 md:border-l border-gray-200 pt-3 md:pt-0 md:pl-5">
                      {rep.verificationStatus !== 'VERIFIED' && (
                        <button
                          onClick={() => verifyReport(rep.id, 'Municipal Traffic Command')}
                          className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[15px]">verified</span>
                          Verify Report
                        </button>
                      )}

                      {rep.verificationStatus !== 'REJECTED' && (
                        <button
                          onClick={() => rejectReport(rep.id, 'Unsubstantiated upon inspection')}
                          className="px-3 py-1.5 bg-gray-100 hover:bg-red-50 hover:text-red-700 text-gray-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[15px]">cancel</span>
                          Reject
                        </button>
                      )}

                      {rep.verificationStatus !== 'OUTDATED' && (
                        <button
                          onClick={() => markReportOutdated(rep.id)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[15px]">history</span>
                          Mark Outdated
                        </button>
                      )}

                      {rep.status !== 'ALERT_ISSUED' && (
                        <button
                          onClick={() => {
                            setSelectedReport(rep);
                            setAlertTitle(`Congestion Warning: ${rep.roadName}`);
                            setAlertDesc(`Heavy vehicular queuing reported near ${rep.locationDescription}. ${rep.description}`);
                          }}
                          className="px-3 py-1.5 bg-[#765b00] hover:bg-[#594400] text-white text-xs font-bold rounded-lg transition-colors shadow-xs flex items-center gap-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[15px]">campaign</span>
                          Issue Safety Alert
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
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
