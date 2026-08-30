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
  UserCheck, 
  LogOut, 
  FileCheck2, 
  Wallet,
  PhoneCall,
  ChevronRight
} from "lucide-react";

export const Sidebar = ({ currentTab, onNavigate, isMobile = false }) => {
  const { isFarmer, isLabour, user, logout } = useAuth();
  const { t } = useLanguage();

  const farmerNavItems = [
    { id: "dashboard", label: t("nav.dashboard"), icon: LayoutDashboard },
    { id: "market", label: t("nav.mandiRates"), icon: TrendingUp },
    { id: "labour-hiring", label: t("nav.farmLabour"), icon: Users },
    { id: "machinery", label: t("nav.machinery"), icon: Tractor },
    { id: "schemes", label: t("nav.schemes"), icon: Landmark },
    { id: "ai-advisor", label: t("nav.farmAdvice"), icon: BrainCircuit },
    { id: "profile", label: t("nav.profile"), icon: UserCheck },
  ];

  const labourNavItems = [
    { id: "dashboard", label: t("nav.dashboard"), icon: LayoutDashboard },
    { id: "my-applications", label: t("nav.myApplications"), icon: FileCheck2 },
    { id: "my-work", label: t("nav.workAndWages"), icon: Wallet },
    { id: "profile", label: t("nav.profile"), icon: UserCheck },
  ];

  const navItems = isFarmer ? farmerNavItems : labourNavItems;


  const containerClasses = isMobile
    ? "w-full flex flex-col justify-between p-4 min-h-full bg-white space-y-6"
    : "w-64 lg:w-72 shrink-0 hidden md:flex flex-col justify-between bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sticky top-20 h-[calc(100vh-6.5rem)] self-start";

  return (
    <aside className={containerClasses}>
      <div className="space-y-4">
        {/* Navigation Section Header */}
        <div className="px-2 pt-1 flex items-center justify-between">
          <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">
            {t("nav.menu", "Navigation Menu")}
          </p>
          <span className="flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Live</span>
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all group ${
                  isActive
                    ? isFarmer 
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20 font-black" 
                      : "bg-amber-600 text-white shadow-md shadow-amber-600/20 font-black"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-700"}`} />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center">
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Container: Helpline Support Card + Logout */}
      <div className="space-y-3 pt-3 border-t border-slate-100 mt-auto">
        {/* Support & Helpline Card */}
        <div className={`p-3.5 rounded-2xl border ${
          isFarmer 
            ? "bg-gradient-to-br from-emerald-50/80 to-slate-50 border-emerald-200/80 text-emerald-950" 
            : "bg-gradient-to-br from-amber-50/80 to-slate-50 border-amber-200/80 text-amber-950"
        }`}>
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs text-white ${
              isFarmer ? "bg-emerald-600" : "bg-amber-600"
            }`}>
              <PhoneCall className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-wide">
              {isFarmer ? "Kisan Helpline" : "Worker Helpline"}
            </span>
          </div>
          <p className="text-[11px] font-black text-slate-900 font-mono tracking-tight">
            1800-180-1551
          </p>
          <p className="text-[10px] text-slate-500 font-medium">
            24x7 Toll-Free Support
          </p>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>{t("common.logout")}</span>
        </button>
      </div>
    </aside>
  );
};
