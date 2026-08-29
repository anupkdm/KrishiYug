import React from "react";
import { useSimulation } from "../context/SimulationContext";
import { Badge } from "../components/common/Badge";
import { Bell, CheckCheck, CheckCircle2, AlertTriangle, Info, ShieldCheck, Clock } from "lucide-react";

export const NotificationsTab = () => {
  const { notifications, unreadCount, markNotificationRead, markAllNotificationsRead } = useSimulation();

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Real-Time Telemetry & Alert Stream
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 font-display mt-1">
            Notifications & System Alerts
          </h1>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-all flex items-center gap-1.5 self-start sm:self-auto"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All ({unreadCount}) Read</span>
          </button>
        )}
      </div>

      {/* Notification Stream */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center text-slate-400 border border-slate-200/80">
            <Bell className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="text-sm font-semibold">No alerts or notifications at this time.</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => markNotificationRead(notif.id)}
              className={`p-5 rounded-3xl border transition-all cursor-pointer ${
                !notif.isRead 
                  ? "bg-white border-agri-300 shadow-sm ring-1 ring-agri-400/30" 
                  : "bg-white/80 border-slate-200/80 opacity-80"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <div className={`p-2.5 rounded-2xl shrink-0 ${
                    notif.severity === "warning" ? "bg-amber-100 text-amber-800" :
                    notif.severity === "success" ? "bg-emerald-100 text-emerald-800" :
                    notif.severity === "danger" ? "bg-rose-100 text-rose-800" : "bg-sky-100 text-sky-800"
                  }`}>
                    {notif.severity === "warning" ? <AlertTriangle className="w-5 h-5" /> :
                     notif.severity === "success" ? <CheckCircle2 className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-slate-900">{notif.title}</h3>
                      <Badge variant={notif.severity === "warning" ? "warning" : notif.severity === "success" ? "success" : "info"}>
                        {notif.category}
                      </Badge>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{notif.message}</p>
                  </div>
                </div>

                <span className="text-[11px] text-slate-400 whitespace-nowrap font-mono shrink-0">
                  {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
