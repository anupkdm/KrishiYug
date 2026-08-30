import React, { useState } from "react";
import { useOfflineSync } from "../../context/OfflineSyncContext";
import { 
  Database, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronUp, 
  ChevronDown, 
  Layers,
  Sparkles,
  Zap,
  HardDrive,
  ArrowUpRight,
  ShieldCheck,
  X
} from "lucide-react";

export const DisasterResilienceBar = () => {
  const {
    isDbOnline,
    isSyncing,
    pendingActions,
    pendingCount,
    lastSyncStatus,
    toastNotification,
    clearToast,
    simulateDbFailure,
    restoreDatabase,
    syncPendingQueue
  } = useOfflineSync();

  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* Toast Notification Banner */}
      {toastNotification && (
        <div className="fixed top-20 right-4 z-50 max-w-md bg-slate-950/95 text-white border border-emerald-500/40 shadow-2xl rounded-2xl p-4 backdrop-blur-md animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400">
                Resilience Engine Notification
              </h4>
              <p className="text-xs text-slate-200 mt-1 font-medium leading-relaxed">
                {toastNotification}
              </p>
            </div>
            <button 
              onClick={clearToast}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Developer / Judge Disaster Recovery Controller */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-4xl font-sans">
        <div className={`transition-all duration-300 rounded-3xl border shadow-2xl backdrop-blur-xl ${
          isDbOnline 
            ? "bg-slate-950/90 border-slate-700/80 text-white shadow-emerald-950/20" 
            : "bg-amber-950/95 border-amber-500/60 text-white shadow-amber-950/40 animate-pulse-border"
        }`}>
          {/* Main Bar Header */}
          <div className="p-3 sm:p-3.5 flex flex-wrap items-center justify-between gap-3">
            {/* Left: Status Indicator */}
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-2xl flex items-center justify-center text-white shadow-md ${
                isDbOnline ? "bg-emerald-600 shadow-emerald-600/30" : "bg-rose-600 shadow-rose-600/40 animate-bounce"
              }`}>
                <Database className="w-4 h-4" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black tracking-tight">
                    {isDbOnline ? "MongoDB Atlas Primary" : "MongoDB Offline (Simulation)"}
                  </span>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 border ${
                    isDbOnline 
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40" 
                      : "bg-rose-500/20 text-rose-300 border-rose-500/40"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isDbOnline ? "bg-emerald-400 animate-pulse" : "bg-rose-400"}`} />
                    <span>{isDbOnline ? "ONLINE" : "OFFLINE RECOVERY MODE"}</span>
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block">
                  {isDbOnline 
                    ? "Writes stream directly to MongoDB Atlas. IndexedDB stands ready as hot buffer." 
                    : "Zero data loss active: Mutations persist safely into browser IndexedDB."}
                </p>
              </div>
            </div>

            {/* Right: Actions & Pending Sync Counter */}
            <div className="flex items-center gap-2 sm:gap-3 ml-auto">
              {/* Pending Sync Counter Badge */}
              <div 
                onClick={() => setIsExpanded(!isExpanded)}
                className={`cursor-pointer px-3 py-1.5 rounded-xl border text-xs font-black flex items-center gap-1.5 transition-all ${
                  pendingCount > 0 
                    ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md animate-pulse" 
                    : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                }`}
              >
                <HardDrive className="w-3.5 h-3.5" />
                <span>Pending Sync: <strong>{pendingCount}</strong></span>
                {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
              </div>

              {/* Simulation Toggle Button */}
              {isDbOnline ? (
                <button
                  onClick={simulateDbFailure}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/30 transition-all flex items-center gap-1.5"
                  title="Simulate MongoDB database failure to demonstrate offline recovery"
                >
                  <WifiOff className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Simulate DB Failure</span>
                  <span className="sm:hidden">Simulate Fail</span>
                </button>
              ) : (
                <button
                  onClick={restoreDatabase}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all flex items-center gap-1.5 animate-pulse"
                  title="Restore MongoDB database and auto-synchronize pending records"
                >
                  <Wifi className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Restore Database</span>
                  <span className="sm:hidden">Restore DB</span>
                </button>
              )}

              {/* Sync Now Button (when pending actions exist) */}
              {pendingCount > 0 && isDbOnline && (
                <button
                  onClick={syncPendingQueue}
                  disabled={isSyncing}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
                  <span>{isSyncing ? "Syncing..." : "Sync Now"}</span>
                </button>
              )}
            </div>
          </div>

          {/* Expandable IndexedDB Queue Inspector */}
          {isExpanded && (
            <div className="p-4 border-t border-slate-800 bg-slate-900/90 rounded-b-3xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">
                    IndexedDB Offline Queue (`KrishiMitraOfflineDB`)
                  </h4>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">
                  {pendingActions.length} record{pendingActions.length !== 1 ? 's' : ''} stored locally
                </span>
              </div>

              {pendingActions.length === 0 ? (
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                  <p className="text-xs font-bold text-slate-300">Queue is empty — 100% synchronized with MongoDB Atlas</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Click <strong>Simulate DB Failure</strong> and perform actions (e.g. Register Labourer) to see offline queuing live.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {pendingActions.map((action, idx) => (
                    <div 
                      key={action.id || idx}
                      className="p-3 rounded-2xl bg-slate-950/80 border border-amber-500/30 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md border border-amber-500/30">
                            {action.type || "MUTATION"}
                          </span>
                          <strong className="text-slate-200">{action.title || action.endpoint}</strong>
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono truncate max-w-md">
                          {action.payload ? JSON.stringify(action.payload) : "No payload details"}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] text-slate-400 font-mono block">
                          {new Date(action.timestamp).toLocaleTimeString()}
                        </span>
                        <span className="text-[10px] font-bold text-amber-400">
                          Pending Sync
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {lastSyncStatus && (
                <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-[11px] text-emerald-300 font-medium flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{lastSyncStatus.message}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
