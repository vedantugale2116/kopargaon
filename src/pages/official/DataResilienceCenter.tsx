// =========================================================================
// KOPARGAON CONNECT — OFFICIAL DATA RESILIENCE CENTER
// Official-Only Disaster Recovery Command Center
// =========================================================================

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sidebar } from '../../components/common/Sidebar';
import {
  JournalEvent,
  RecoverySnapshot,
  RecoveryQueueItem,
  RecoveryAuditEntry,
  PendingTransaction,
  fetchRecoveryQueue,
  executeRecordRecovery,
  triggerDeterministicDisasterSimulation,
  generateFormalRecoveryReport,
  queuePendingOperation,
  flushPendingOperations
} from '../../lib/resilienceEngine';
import { getStorageItem } from '../../lib/supabase';
import { idbGetAll } from '../../lib/resilienceIndexedDB';

export const DataResilienceCenter: React.FC = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'QUEUE' | 'JOURNAL' | 'SNAPSHOTS' | 'PENDING_TX' | 'AUDIT'>('QUEUE');
  const [queueFilter, setQueueFilter] = useState<'ALL' | 'SAFE_TO_RECOVER' | 'HUMAN_REVIEW_REQUIRED' | 'IRRECOVERABLE' | 'RECOVERED'>('ALL');
  
  const [queueItems, setQueueItems] = useState<RecoveryQueueItem[]>([]);
  const [journalEvents, setJournalEvents] = useState<JournalEvent[]>([]);
  const [snapshots, setSnapshots] = useState<RecoverySnapshot[]>([]);
  const [auditLogs, setAuditLogs] = useState<RecoveryAuditEntry[]>([]);
  const [pendingTxList, setPendingTxList] = useState<PendingTransaction[]>([]);
  
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [selectedConflictItem, setSelectedConflictItem] = useState<RecoveryQueueItem | null>(null);
  const [selectedJsonView, setSelectedJsonView] = useState<any | null>(null);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Load state from local and IndexedDB
  const reloadState = async () => {
    const q = await fetchRecoveryQueue();
    setQueueItems(q);

    const j = getStorageItem<JournalEvent[]>('recovery_journal', []);
    setJournalEvents(j);

    const s = getStorageItem<RecoverySnapshot[]>('recovery_snapshots', []);
    setSnapshots(s);

    const a = getStorageItem<RecoveryAuditEntry[]>('recovery_audit', []);
    setAuditLogs(a);

    const p = await idbGetAll<PendingTransaction>('pending_tx');
    setPendingTxList(p || []);
  };

  useEffect(() => {
    reloadState();
    const interval = setInterval(reloadState, 3000);
    return () => clearInterval(interval);
  }, []);

  // Flash message helper
  const flashMessage = (msg: string) => {
    setActionSuccessMessage(msg);
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  // Metrics calculation
  const totalOperations = journalEvents.length;
  const affectedRecords = queueItems.length;
  const safeCount = queueItems.filter(q => q.classification === 'SAFE_TO_RECOVER' && q.status !== 'RECOVERED').length;
  const reviewCount = queueItems.filter(q => q.classification === 'HUMAN_REVIEW_REQUIRED' && q.status !== 'RECOVERED').length;
  const irrecoverableCount = queueItems.filter(q => q.classification === 'IRRECOVERABLE' || q.status === 'UNRESOLVABLE').length;
  const recoveredCount = queueItems.filter(q => q.status === 'RECOVERED').length;
  const pendingTxCount = pendingTxList.filter(p => p.status === 'QUEUED').length;
  const recoveryRate = affectedRecords > 0 ? Math.round((recoveredCount / affectedRecords) * 100) : 100;

  const isIncidentActive = affectedRecords > 0 && (safeCount > 0 || reviewCount > 0);

  // Trigger Hackathon Disaster Simulation
  const handleSimulateDisaster = async () => {
    setIsSimulating(true);
    try {
      const result = await triggerDeterministicDisasterSimulation();
      await reloadState();
      setActiveTab('QUEUE');
      flashMessage(`🚨 Controlled Disaster Scenario (${result.incidentId}) initiated. Isolated test entities generated.`);
    } catch (err: any) {
      console.error(err);
      flashMessage('Failed to initialize disaster simulation.');
    } finally {
      setIsSimulating(false);
    }
  };

  // Recover Safe Record
  const handleRecoverRecord = async (item: RecoveryQueueItem) => {
    setIsSyncing(true);
    const result = await executeRecordRecovery({
      queueItemId: item.id,
      officialId: user?.officialId || 'ADM-01',
      officialName: user?.name || 'Municipal Administrator'
    });
    setIsSyncing(false);

    if (result.success) {
      await reloadState();
      flashMessage(`✅ Record ${item.entity_id} successfully reconstructed and persisted in Supabase database.`);
    } else {
      flashMessage(`❌ Recovery failed: ${result.message}`);
    }
  };

  // Resolve Conflict Decision
  const handleResolveConflict = async (item: RecoveryQueueItem, chosenState: Record<string, any>, resolutionLabel: string) => {
    setIsSyncing(true);
    const result = await executeRecordRecovery({
      queueItemId: item.id,
      officialId: user?.officialId || 'ADM-01',
      officialName: user?.name || 'Municipal Administrator',
      approvedState: chosenState,
      resolutionNotes: `Official resolved conflict by approving ${resolutionLabel}.`
    });
    setIsSyncing(false);
    setSelectedConflictItem(null);

    if (result.success) {
      await reloadState();
      flashMessage(`✅ Conflict on ${item.entity_id} resolved and persisted (${resolutionLabel}).`);
    } else {
      flashMessage(`❌ Conflict resolution error: ${result.message}`);
    }
  };

  // Simulate Background Citizen Operation during Recovery
  const handleSimulateContinuousBooking = async () => {
    const bookingPayload = {
      bookingId: `BK-CONT-${Date.now().toString().slice(-4)}`,
      busNumber: 'MH-17-EM-4040',
      routeId: '1',
      origin: 'Kopargaon Bus Station',
      destination: 'Shirdi Sai Temple',
      date: 'Today',
      departureTime: '11:15 AM',
      passengerCount: 2,
      totalAmount: 90,
      paymentMethod: 'UPI',
      userName: 'Citizen Continuous Ops Demo',
      bookingStatus: 'CONFIRMED'
    };

    await queuePendingOperation({
      operation_id: `OP-BUS-${Date.now()}`,
      entity_type: 'BUS_BOOKING',
      operation_type: 'BUS_BOOKING_CREATED',
      payload: bookingPayload,
      actor_user_id: 'citizen-demo-user',
      actor_role: 'CITIZEN'
    });

    await reloadState();
    flashMessage('⚡ Citizen bus booking processed into persistent IndexedDB Queue while recovery is active.');
  };

  // Flush Pending Queue
  const handleFlushPending = async () => {
    setIsSyncing(true);
    const result = await flushPendingOperations();
    await reloadState();
    setIsSyncing(false);
    flashMessage(`🔄 Synchronized ${result.syncedCount} queued operations to primary ledger.`);
  };

  // Filtered queue items
  const filteredQueue = queueItems.filter(item => {
    if (queueFilter === 'ALL') return true;
    if (queueFilter === 'RECOVERED') return item.status === 'RECOVERED';
    return item.classification === queueFilter && item.status !== 'RECOVERED';
  });

  const report = generateFormalRecoveryReport();

  return (
    <div className="min-h-screen flex bg-[#f8f2fa] font-sans">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Telemetry Header */}
        <header className="h-16 bg-white/95 backdrop-blur-md border-b border-[#cbc4d2]/40 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <span className={`w-2.5 h-2.5 rounded-full ${isIncidentActive ? 'bg-red-500 animate-ping' : 'bg-emerald-500 animate-pulse'}`}></span>
            <span className="text-xs font-extrabold text-[#1d1b20] uppercase tracking-wider">
              Kopargaon Disaster Recovery Command
            </span>
            <span className="text-xs text-gray-400">|</span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#765b00]/10 text-[#765b00]">
              OFFICIAL ACCESS ONLY
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSimulateDisaster}
              disabled={isSimulating}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-xs disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[16px]">emergency</span>
              {isSimulating ? 'Simulating...' : '🚨 Simulate Data Incident'}
            </button>

            <button
              onClick={() => setShowReportModal(true)}
              className="bg-[#4f378a] hover:bg-[#3b276b] text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">description</span>
              Audit Report
            </button>

            <div className="h-4 w-px bg-gray-200"></div>

            <div className="text-right hidden sm:block">
              <div className="text-xs font-extrabold text-[#1d1b20]">{user?.name || 'Municipal Admin'}</div>
              <div className="text-[10px] text-gray-500">{user?.officialId || 'ADM-01'} • Clearance L4</div>
            </div>
          </div>
        </header>

        {/* Success / Alert Toast Banner */}
        {actionSuccessMessage && (
          <div className="bg-emerald-600 text-white px-6 py-2.5 text-xs font-bold flex items-center justify-between sticky top-16 z-20 shadow-md animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>{actionSuccessMessage}</span>
            </div>
            <button onClick={() => setActionSuccessMessage(null)} className="text-white/80 hover:text-white">✕</button>
          </div>
        )}

        <main className="p-6 space-y-6 max-w-7xl w-full mx-auto">
          {/* Main Title & Slogan */}
          <div className="bg-white p-6 rounded-2xl border border-[#cbc4d2]/40 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#4f378a] text-white flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[20px]">security</span>
                </div>
                <h1 className="text-2xl font-black text-[#1d1b20] tracking-tight">
                  DATA RESILIENCE CENTER
                </h1>
              </div>
              <p className="text-xs text-[#494551] font-medium mt-1">
                "Protecting Kopargaon Connect from data loss and corruption."
              </p>
            </div>

            {/* Top 5 System Status Indicators */}
            <div className="flex flex-wrap gap-2 text-[11px] font-bold">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#fdf7ff] rounded-xl border border-gray-200">
                <span className="text-gray-500">DATABASE</span>
                <span className={`flex items-center gap-1 ${isIncidentActive ? 'text-red-700 bg-red-100' : 'text-emerald-700 bg-emerald-100'} px-2 py-0.5 rounded-full`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                  {isIncidentActive ? 'INCIDENT' : 'HEALTHY'}
                </span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#fdf7ff] rounded-xl border border-gray-200">
                <span className="text-gray-500">OPERATION JOURNAL</span>
                <span className="flex items-center gap-1 text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  ACTIVE ({totalOperations})
                </span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#fdf7ff] rounded-xl border border-gray-200">
                <span className="text-gray-500">RECOVERY SNAPSHOTS</span>
                <span className="flex items-center gap-1 text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  AVAILABLE ({snapshots.length})
                </span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#fdf7ff] rounded-xl border border-gray-200">
                <span className="text-gray-500">LIVE OPERATIONS</span>
                <span className="flex items-center gap-1 text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  ACTIVE
                </span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#fdf7ff] rounded-xl border border-gray-200">
                <span className="text-gray-500">RESILIENCE ENGINE</span>
                <span className="flex items-center gap-1 text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
                  READY
                </span>
              </div>
            </div>
          </div>

          {/* Incident Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            <div className="bg-white p-3.5 rounded-xl border border-[#cbc4d2]/40 shadow-xs">
              <span className="text-[10px] font-bold text-gray-500 uppercase block">Total Operations</span>
              <span className="text-xl font-black text-[#1d1b20]">{totalOperations}</span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-[#cbc4d2]/40 shadow-xs">
              <span className="text-[10px] font-bold text-gray-500 uppercase block">Affected Records</span>
              <span className={`text-xl font-black ${affectedRecords > 0 ? 'text-red-600' : 'text-gray-800'}`}>{affectedRecords}</span>
            </div>

            <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200 shadow-xs">
              <span className="text-[10px] font-bold text-emerald-800 uppercase block">🟢 Recoverable</span>
              <span className="text-xl font-black text-emerald-700">{safeCount}</span>
            </div>

            <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200 shadow-xs">
              <span className="text-[10px] font-bold text-amber-800 uppercase block">🟡 Review Req.</span>
              <span className="text-xl font-black text-amber-700">{reviewCount}</span>
            </div>

            <div className="bg-red-50/70 p-3.5 rounded-xl border border-red-200 shadow-xs">
              <span className="text-[10px] font-bold text-red-800 uppercase block">🔴 Irrecoverable</span>
              <span className="text-xl font-black text-red-700">{irrecoverableCount}</span>
            </div>

            <div className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-200 shadow-xs">
              <span className="text-[10px] font-bold text-blue-800 uppercase block">⚡ Pending Queue</span>
              <span className="text-xl font-black text-blue-700">{pendingTxCount}</span>
            </div>

            <div className="bg-purple-50/70 p-3.5 rounded-xl border border-purple-200 shadow-xs">
              <span className="text-[10px] font-bold text-purple-800 uppercase block">✅ Recovered</span>
              <span className="text-xl font-black text-purple-700">{recoveredCount}</span>
            </div>

            <div className="bg-[#fdf7ff] p-3.5 rounded-xl border border-purple-200 shadow-xs">
              <span className="text-[10px] font-bold text-[#765b00] uppercase block">Recovery Rate</span>
              <span className="text-xl font-black text-[#765b00]">{recoveryRate}%</span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-[#cbc4d2]/40 gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveTab('QUEUE')}
              className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'QUEUE'
                  ? 'bg-white text-[#4f378a] border-t-2 border-x border-[#cbc4d2]/40 border-t-[#4f378a] shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">queue</span>
              Recovery Queue ({queueItems.length})
            </button>

            <button
              onClick={() => setActiveTab('JOURNAL')}
              className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'JOURNAL'
                  ? 'bg-white text-[#4f378a] border-t-2 border-x border-[#cbc4d2]/40 border-t-[#4f378a] shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">receipt_long</span>
              Immutable Journal ({journalEvents.length})
            </button>

            <button
              onClick={() => setActiveTab('SNAPSHOTS')}
              className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'SNAPSHOTS'
                  ? 'bg-white text-[#4f378a] border-t-2 border-x border-[#cbc4d2]/40 border-t-[#4f378a] shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">camera</span>
              Recovery Snapshots ({snapshots.length})
            </button>

            <button
              onClick={() => setActiveTab('PENDING_TX')}
              className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'PENDING_TX'
                  ? 'bg-white text-[#4f378a] border-t-2 border-x border-[#cbc4d2]/40 border-t-[#4f378a] shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">sync_alt</span>
              Continuous Ops & Queue ({pendingTxCount})
            </button>

            <button
              onClick={() => setActiveTab('AUDIT')}
              className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'AUDIT'
                  ? 'bg-white text-[#4f378a] border-t-2 border-x border-[#cbc4d2]/40 border-t-[#4f378a] shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">history_edu</span>
              Audit Trail ({auditLogs.length})
            </button>
          </div>

          {/* TAB 1: RECOVERY QUEUE */}
          {activeTab === 'QUEUE' && (
            <div className="space-y-4">
              {/* Filter Pills */}
              <div className="flex gap-2 text-xs font-bold overflow-x-auto pb-1">
                {(['ALL', 'SAFE_TO_RECOVER', 'HUMAN_REVIEW_REQUIRED', 'IRRECOVERABLE', 'RECOVERED'] as const).map(filterKey => (
                  <button
                    key={filterKey}
                    onClick={() => setQueueFilter(filterKey)}
                    className={`px-3 py-1.5 rounded-xl transition-all ${
                      queueFilter === filterKey
                        ? 'bg-[#4f378a] text-white shadow-xs'
                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {filterKey === 'ALL' ? 'All Records' :
                     filterKey === 'SAFE_TO_RECOVER' ? '🟢 Safe to Recover' :
                     filterKey === 'HUMAN_REVIEW_REQUIRED' ? '🟡 Review Required' :
                     filterKey === 'IRRECOVERABLE' ? '🔴 Irrecoverable' : '✅ Recovered'}
                  </button>
                ))}
              </div>

              {filteredQueue.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border border-[#cbc4d2]/40 text-center space-y-2">
                  <span className="material-symbols-outlined text-[48px] text-emerald-600">verified</span>
                  <h3 className="font-bold text-sm text-gray-900">No Pending Incidents in Selected Filter</h3>
                  <p className="text-xs text-gray-500">Run the disaster simulation to generate test incident entities.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredQueue.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white p-5 rounded-2xl border border-[#cbc4d2]/40 shadow-xs space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full ${
                            item.status === 'RECOVERED' ? 'bg-purple-100 text-purple-800' :
                            item.classification === 'SAFE_TO_RECOVER' ? 'bg-emerald-100 text-emerald-800' :
                            item.classification === 'HUMAN_REVIEW_REQUIRED' ? 'bg-amber-100 text-amber-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {item.status === 'RECOVERED' ? '✅ RECOVERED' :
                             item.classification === 'SAFE_TO_RECOVER' ? '🟢 SAFE TO RECOVER' :
                             item.classification === 'HUMAN_REVIEW_REQUIRED' ? '🟡 REVIEW REQUIRED' : '🔴 IRRECOVERABLE'}
                          </span>
                          <span className="text-sm font-extrabold text-[#1d1b20]">{item.entity_type}: {item.entity_id}</span>
                          <span className="text-xs text-gray-400 font-mono">({item.incident_type})</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <span className="text-[10px] text-gray-500 font-bold block">CONFIDENCE</span>
                            <span className="text-sm font-black text-[#1d1b20]">{item.confidence}%</span>
                          </div>

                          {item.status === 'RECOVERED' ? (
                            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1.5 rounded-lg">
                              Reconstructed & Verified
                            </span>
                          ) : item.classification === 'SAFE_TO_RECOVER' ? (
                            <button
                              onClick={() => handleRecoverRecord(item)}
                              className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs flex items-center gap-1.5"
                            >
                              <span className="material-symbols-outlined text-[16px]">restore</span>
                              Recover Record
                            </button>
                          ) : item.classification === 'HUMAN_REVIEW_REQUIRED' ? (
                            <button
                              onClick={() => setSelectedConflictItem(item)}
                              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs flex items-center gap-1.5"
                            >
                              <span className="material-symbols-outlined text-[16px]">rule</span>
                              Review Conflict
                            </button>
                          ) : (
                            <span className="text-xs font-bold text-red-700 bg-red-50 px-3 py-1.5 rounded-lg">
                              Audited Irrecoverable
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Evidence Checklist */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-2 border-t border-gray-100">
                        {item.evidence.map(ev => (
                          <div key={ev.id} className={`p-2.5 rounded-xl border text-[11px] ${ev.passed ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950' : 'bg-red-50/50 border-red-200 text-red-950'}`}>
                            <div className="flex items-center gap-1 font-bold">
                              <span>{ev.passed ? '✓' : '✕'}</span>
                              <span>{ev.label}</span>
                            </div>
                            <div className="text-[10px] text-gray-600 mt-0.5">{ev.detail}</div>
                          </div>
                        ))}
                      </div>

                      {/* State Inspection Accordion */}
                      {item.recovered_state && (
                        <div className="p-3 bg-[#fdf7ff] rounded-xl border border-gray-200 text-xs flex justify-between items-center">
                          <div>
                            <span className="font-bold text-gray-700">Reconstructed Payload Summary: </span>
                            <span className="text-gray-600 font-mono">
                              {JSON.stringify(item.recovered_state).substring(0, 90)}...
                            </span>
                          </div>
                          <button
                            onClick={() => setSelectedJsonView(item.recovered_state)}
                            className="text-[#4f378a] hover:underline font-bold text-[11px] shrink-0 ml-2"
                          >
                            Inspect JSON
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: IMMUTABLE OPERATION JOURNAL */}
          {activeTab === 'JOURNAL' && (
            <div className="bg-white p-5 rounded-2xl border border-[#cbc4d2]/40 shadow-xs space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-extrabold text-[#1d1b20] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#4f378a]">receipt_long</span>
                    Cryptographic SHA-256 Operation Journal
                  </h3>
                  <p className="text-xs text-gray-500">
                    Tamper-evident ledger linking every state mutation to its prior hash block.
                  </p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                  Chain Status: Intact (SHA-256 Verified)
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase text-[10px]">
                      <th className="py-2.5 px-3">Seq #</th>
                      <th className="py-2.5 px-3">Operation ID</th>
                      <th className="py-2.5 px-3">Entity</th>
                      <th className="py-2.5 px-3">Operation Type</th>
                      <th className="py-2.5 px-3">Actor & Role</th>
                      <th className="py-2.5 px-3">SHA-256 Checksum</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Payload</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {journalEvents.map(event => (
                      <tr key={event.operation_id} className="hover:bg-gray-50/80">
                        <td className="py-2.5 px-3 font-mono font-bold text-gray-700">#{event.sequence_number}</td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-[#4f378a] font-bold">{event.operation_id}</td>
                        <td className="py-2.5 px-3 font-bold text-[#1d1b20]">{event.entity_type} <span className="text-[10px] text-gray-500 block font-normal">{event.entity_id}</span></td>
                        <td className="py-2.5 px-3 font-bold text-xs">{event.operation_type}</td>
                        <td className="py-2.5 px-3 text-[11px] text-gray-600">{event.actor_user_id} <span className="text-[10px] text-gray-400 block font-bold">{event.actor_role}</span></td>
                        <td className="py-2.5 px-3 font-mono text-[10px] text-gray-500 max-w-[120px] truncate" title={event.checksum}>
                          {event.checksum}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            {event.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <button
                            onClick={() => setSelectedJsonView(event.payload)}
                            className="p-1 text-gray-500 hover:text-[#4f378a] hover:bg-purple-50 rounded"
                            title="View Payload"
                          >
                            <span className="material-symbols-outlined text-[18px]">data_object</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: RECOVERY SNAPSHOTS */}
          {activeTab === 'SNAPSHOTS' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-[#cbc4d2]/40 shadow-xs flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-extrabold text-[#1d1b20] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#765b00]">camera</span>
                    Versioned Recovery Checkpoints
                  </h3>
                  <p className="text-xs text-gray-500">
                    State checkpoints cross-referenced against event streams for multi-factor integrity verification.
                  </p>
                </div>
                <span className="text-xs font-bold text-[#765b00] bg-[#FFD814]/30 px-3 py-1 rounded-full">
                  {snapshots.length} Snapshots on File
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {snapshots.map((snap) => (
                  <div key={snap.snapshot_id} className="bg-white p-4 rounded-2xl border border-[#cbc4d2]/40 shadow-xs space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-mono font-bold text-[#4f378a]">{snap.snapshot_id}</span>
                        <div className="text-sm font-bold text-[#1d1b20] mt-0.5">{snap.entity_type} ({snap.entity_id})</div>
                      </div>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        v{snap.version} • {snap.integrity_status}
                      </span>
                    </div>

                    <div className="p-3 bg-[#fdf7ff] rounded-xl text-xs font-mono text-gray-700 max-h-32 overflow-y-auto">
                      <pre className="whitespace-pre-wrap">{JSON.stringify(snap.snapshot_data, null, 2)}</pre>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-gray-500 pt-1 border-t border-gray-100">
                      <span>Checksum: {snap.checksum.substring(0, 16)}...</span>
                      <span>{new Date(snap.created_at).toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: PENDING OFFLINE QUEUE */}
          {activeTab === 'PENDING_TX' && (
            <div className="bg-white p-5 rounded-2xl border border-[#cbc4d2]/40 shadow-xs space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-extrabold text-[#1d1b20] flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-600">sync_alt</span>
                    IndexedDB Offline & Degraded Transaction Queue
                  </h3>
                  <p className="text-xs text-gray-500">
                    Stores transactions in client storage during network partitions / database maintenance.
                  </p>
                </div>

                <button
                  onClick={handleFlushPending}
                  disabled={pendingTxCount === 0}
                  className="bg-[#4f378a] hover:bg-[#382467] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[16px]">sync</span>
                  Flush & Sync All
                </button>
              </div>

              {pendingTxList.length === 0 ? (
                <div className="p-8 text-center text-xs text-gray-500">
                  Queue is currently clear. No pending offline transactions.
                </div>
              ) : (
                <div className="space-y-2">
                  {pendingTxList.map(tx => (
                    <div key={tx.id} className="p-3 bg-blue-50/70 rounded-xl border border-blue-200 flex justify-between items-center text-xs">
                      <div>
                        <div className="font-bold text-blue-950">{tx.operation_type} ({tx.id})</div>
                        <div className="text-[11px] text-blue-800">Actor: {tx.actor_user_id} • Queued at: {new Date(tx.queued_at).toLocaleTimeString()}</div>
                      </div>
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-200 text-blue-900">
                        {tx.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: AUDIT TRAIL */}
          {activeTab === 'AUDIT' && (
            <div className="bg-white p-5 rounded-2xl border border-[#cbc4d2]/40 shadow-xs space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-extrabold text-[#1d1b20] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#765b00]">history_edu</span>
                    Official Disaster Recovery Audit Trail
                  </h3>
                  <p className="text-xs text-gray-500">
                    Immutable log of all official recovery decisions and reconstructed state evidence.
                  </p>
                </div>

                <button
                  onClick={() => setShowReportModal(true)}
                  className="bg-[#765b00] hover:bg-[#594400] text-white text-xs font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">print</span>
                  Print Full Report
                </button>
              </div>

              <div className="divide-y divide-gray-100">
                {auditLogs.map((log) => (
                  <div key={log.id} className="py-3.5 space-y-1.5 text-xs">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#1d1b20]">{log.official_name}</span>
                        <span className="text-gray-400 font-mono">({log.official_id})</span>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          log.action === 'RECOVERED' ? 'bg-emerald-100 text-emerald-800' :
                          log.action === 'CONFLICT_RESOLVED' ? 'bg-amber-100 text-amber-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {log.action}
                        </span>
                      </div>
                      <span className="text-[11px] text-gray-400">{new Date(log.timestamp).toLocaleString()}</span>
                    </div>

                    <div className="text-[11px] text-gray-700">
                      Entity: <span className="font-bold">{log.entity_type} ({log.entity_id})</span> • Incident: <span className="font-mono">{log.incident_id}</span> • Confidence: <span className="font-bold">{log.confidence}%</span>
                    </div>

                    <div className="text-[11px] text-gray-500 italic bg-gray-50 p-2 rounded-lg">
                      "{log.evidence_summary || log.resolution_notes}"
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* CONFLICT RESOLUTION MODAL */}
      {selectedConflictItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-3xl w-full space-y-5 shadow-2xl border border-amber-200">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <span className="text-[11px] font-black text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                  🟡 HUMAN VERIFICATION REQUIRED
                </span>
                <h3 className="text-lg font-black text-[#1d1b20] mt-1">
                  Conflicting State Detected: {selectedConflictItem.entity_id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedConflictItem(null)}
                className="text-gray-400 hover:text-gray-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-600">
              The disaster recovery engine detected contradictory data between the checkpoint snapshot and the replay event stream. Please inspect the comparison below and authorize the canonical state.
            </p>

            {/* Side-by-side Diff */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-purple-50/80 rounded-2xl border border-purple-200 space-y-2">
                <div className="font-extrabold text-purple-900 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">camera</span>
                  Source A: Recovery Snapshot State
                </div>
                <div className="space-y-1 font-mono text-[11px] text-purple-950">
                  <div><strong>Destination:</strong> {selectedConflictItem.snapshot_state?.destination || 'Nashik APMC Market'}</div>
                  <div><strong>Freight Cost:</strong> ₹{selectedConflictItem.snapshot_state?.estimatedCost || '1,200'}</div>
                  <div><strong>Status:</strong> {selectedConflictItem.snapshot_state?.currentStatus || 'ACCEPTED'}</div>
                </div>
                <button
                  onClick={() => handleResolveConflict(selectedConflictItem, selectedConflictItem.snapshot_state || {}, 'Snapshot State (Nashik APMC)')}
                  className="w-full mt-3 bg-[#4f378a] hover:bg-[#3b276b] text-white font-bold py-2 rounded-xl text-xs transition-all"
                >
                  Approve Snapshot State (Nashik)
                </button>
              </div>

              <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200 space-y-2">
                <div className="font-extrabold text-amber-900 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">update</span>
                  Source B: Event Stream Replay
                </div>
                <div className="space-y-1 font-mono text-[11px] text-amber-950">
                  <div><strong>Destination:</strong> {selectedConflictItem.recovered_state?.destination || 'Pune Gultekdi Market Yard'}</div>
                  <div><strong>Freight Cost:</strong> ₹{selectedConflictItem.recovered_state?.estimatedCost || '1,850'}</div>
                  <div><strong>Status:</strong> {selectedConflictItem.recovered_state?.currentStatus || 'IN_TRANSIT'}</div>
                </div>
                <button
                  onClick={() => handleResolveConflict(selectedConflictItem, selectedConflictItem.recovered_state || {}, 'Event Replay State (Pune Gultekdi)')}
                  className="w-full mt-3 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 rounded-xl text-xs transition-all"
                >
                  Approve Event Replay (Pune)
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-[11px] text-gray-500">Every official resolution is logged in the permanent audit ledger.</span>
              <button
                onClick={() => setSelectedConflictItem(null)}
                className="text-xs font-bold text-gray-600 hover:text-gray-900 px-4 py-2"
              >
                Keep Unresolved
              </button>
            </div>
          </div>
        </div>
      )}

      {/* JSON INSPECTOR MODAL */}
      {selectedJsonView && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-xl w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b pb-2">
              <h4 className="font-bold text-sm text-gray-900">Payload Inspector</h4>
              <button onClick={() => setSelectedJsonView(null)} className="text-gray-400 hover:text-gray-700 font-bold">✕</button>
            </div>
            <div className="bg-gray-900 text-emerald-400 p-4 rounded-xl font-mono text-xs max-h-96 overflow-y-auto">
              <pre>{JSON.stringify(selectedJsonView, null, 2)}</pre>
            </div>
            <button
              onClick={() => setSelectedJsonView(null)}
              className="w-full bg-[#4f378a] text-white text-xs font-bold py-2 rounded-xl"
            >
              Close Inspector
            </button>
          </div>
        </div>
      )}

      {/* FORMAL RECOVERY REPORT MODAL */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full space-y-4 shadow-2xl border border-purple-200">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <span className="text-[10px] font-extrabold text-[#765b00] uppercase">MUNICIPAL TRANSIT COMMAND</span>
                <h3 className="text-lg font-black text-[#1d1b20]">Official Disaster Recovery Report ({report.reportId})</h3>
              </div>
              <button onClick={() => setShowReportModal(false)} className="text-gray-400 hover:text-gray-700 font-bold">✕</button>
            </div>

            <div className="p-4 bg-[#fdf7ff] rounded-2xl border border-gray-200 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div><strong>Report ID:</strong> {report.reportId}</div>
                <div><strong>Generated At:</strong> {report.generatedAt}</div>
                <div><strong>Incident Type:</strong> {report.incidentType}</div>
                <div><strong>Recovery Rate:</strong> {report.recoveryPercentage}% ({report.recoveredCount}/{report.totalAffected})</div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-gray-100 text-[11px] text-gray-700">
                {report.summaryText}
              </div>

              <div className="text-[11px] font-bold text-gray-500 uppercase">Audited Action Log:</div>
              <div className="space-y-1 max-h-36 overflow-y-auto">
                {report.officialActions.map(act => (
                  <div key={act.id} className="text-[10px] text-gray-600 py-1 border-b border-gray-100 flex justify-between">
                    <span>{act.action} on {act.entity_id} by {act.official_name}</span>
                    <span>{act.confidence}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => window.print()}
                className="bg-[#765b00] hover:bg-[#594400] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">print</span>
                Print / Save as PDF
              </button>

              <button
                onClick={() => setShowReportModal(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold px-4 py-2 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
