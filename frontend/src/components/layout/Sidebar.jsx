import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { 
  LayoutDashboard, 
  Users, 
  Tractor, 
  Landmark, 
  TrendingUp, 
  BrainCircuit, 
  Bell, 
  UserCheck, 
  LogOut, 
  Briefcase, 
  FileCheck2, 
  Wallet
} from "lucide-react";
import { useSimulation } from "../../context/SimulationContext";

export const Sidebar = ({ currentTab, onNavigate, isMobile = false }) => {
  const { isFarmer, isLabour, user, logout } = useAuth();
  const { unreadCount } = useSimulation();
  const { t } = useLanguage();

  const farmerNavItems = [
    { id: "dashboard", label: t("nav.dashboard"), icon: LayoutDashboard },
    { id: "market", label: t("nav.mandiRates"), icon: TrendingUp },
    { id: "labour-hiring", label: t("nav.farmLabour"), icon: Users },
    { id: "machinery", label: t("nav.machinery"), icon: Tractor },
    { id: "schemes", label: t("nav.schemes"), icon: Landmark },
    { id: "ai-advisor", label: t("nav.farmAdvice"), icon: BrainCircuit },
    { id: "notifications", label: t("nav.notifications"), icon: Bell, count: unreadCount },
    { id: "profile", label: t("nav.profile"), icon: UserCheck },
  ];

  const labourNavItems = [
    { id: "dashboard", label: t("nav.dashboard"), icon: LayoutDashboard },
    { id: "available-jobs", label: t("nav.availableJobs"), icon: Briefcase },
    { id: "my-applications", label: t("nav.myApplications"), icon: FileCheck2 },
    { id: "my-work", label: t("nav.workAndWages"), icon: Wallet },
    { id: "notifications", label: t("nav.notifications"), icon: Bell, count: unreadCount },
    { id: "profile", label: t("nav.profile"), icon: UserCheck },
  ];

  const navItems = isFarmer ? farmerNavItems : labourNavItems;

  const containerClasses = isMobile
    ? "w-full flex flex-col justify-between p-4 min-h-full bg-white"
    : "w-64 shrink-0 hidden md:flex flex-col justify-between bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 h-fit sticky top-24";

  return (
    <aside className={containerClasses}>
      <div className="space-y-4">
        {/* Navigation Links */}
        <nav className="space-y-1">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            {t("nav.menu")}
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? isFarmer 
                      ? "bg-agri-600 text-white shadow-sm font-bold" 
                      : "bg-amber-600 text-white shadow-sm font-bold"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-700"}`} />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.count > 0 && (
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${isActive ? "bg-white text-slate-900" : "bg-rose-500 text-white animate-pulse"}`}>
                      {item.count}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / Logout */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>{t("common.logout")}</span>
        </button>
      </div>
    </aside>
  );
};
