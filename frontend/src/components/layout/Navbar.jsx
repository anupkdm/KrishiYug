import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useSimulation } from "../../context/SimulationContext";
import { useLanguage } from "../../context/LanguageContext";
import { LanguageSelector } from "../common/LanguageSelector";
import { 
  Sprout, 
  Bell, 
  User, 
  LogOut, 
  CheckCheck, 
  ChevronDown,
  Menu
} from "lucide-react";
import { Badge } from "../common/Badge";

export const Navbar = ({ onNavigate, currentTab, onToggleSidebar, onToggleMobileMenu, isSidebarOpen = true }) => {
  const { user, logout, isFarmer } = useAuth();
  const { t } = useLanguage();
  const { 
    notifications, 
    unreadCount, 
    markNotificationRead, 
    markAllNotificationsRead 
  } = useSimulation();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleToggle = () => {
    if (onToggleSidebar) {
      onToggleSidebar();
    } else if (onToggleMobileMenu) {
      onToggleMobileMenu();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3 transition-all">
      <div className="flex items-center justify-between w-full max-w-[1560px] mx-auto">
        {/* Navigation Menu Button & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggle}
            className="p-2 sm:p-2.5 rounded-2xl text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 bg-slate-50/80 hover:bg-slate-100 border border-slate-200/90 hover:border-emerald-200 flex items-center justify-center shadow-xs transition-all cursor-pointer group"
            aria-label="Toggle Navigation Menu"
            title="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5 group-hover:scale-105 transition-transform" />
          </button>

          <div 
            onClick={() => onNavigate("dashboard")}
            className="cursor-pointer flex items-center gap-2.5 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-700 to-emerald-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 font-display">
                  Krishi<span className="text-emerald-600">Mitra</span>
                </span>
                <span className="hidden md:inline-flex px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {t("common.portal")}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                {t("common.tagline")}
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Selector */}
          <LanguageSelector />

          {/* Notifications Dropdown Trigger */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/70 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Drawer Popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200/80 py-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{t("nav.alerts")}</span>
                    <Badge variant="primary">{unreadCount} {t("nav.newAlerts")}</Badge>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-xs text-agri-600 hover:text-agri-800 font-semibold flex items-center gap-1"
                    >
                      <CheckCheck className="w-3.5 h-3.5" /> {t("nav.markAllRead")}
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-xs">
                      {t("nav.noNotifications")}
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => markNotificationRead(notif.id)}
                        className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer text-left ${!notif.isRead ? "bg-agri-50/40" : ""}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold text-xs text-slate-900">{notif.title}</span>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap">
                            {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            notif.severity === "warning" ? "bg-amber-100 text-amber-800" :
                            notif.severity === "success" ? "bg-emerald-100 text-emerald-800" :
                            notif.severity === "danger" ? "bg-rose-100 text-rose-800" : "bg-sky-100 text-sky-800"
                          }`}>
                            {notif.category}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Account Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl border border-slate-200/80 hover:bg-slate-100 transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-agri-600 to-agri-400 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                {user?.name ? user.name[0] : "K"}
              </div>
              <div className="hidden md:block">
                <p className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[120px]">{user?.name || "User"}</p>
                <p className="text-[10px] font-semibold text-agri-700 uppercase tracking-wide">
                  {user?.role === "FARMER" ? `🌾 ${t("auth.farmerPortalTitle")}` : `🛠️ ${t("auth.labourPortalTitle")}`}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200/80 py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                  <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                    {user?.role === "FARMER" ? t("auth.farmerPortalTitle") : t("auth.labourPortalTitle")}
                  </span>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      onNavigate("profile");
                      setShowUserMenu(false);
                    }}
                    className="w-full px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                  >
                    <User className="w-4 h-4 text-slate-400" /> {t("nav.profile")}
                  </button>
                  <button
                    onClick={() => {
                      onNavigate("notifications");
                      setShowUserMenu(false);
                    }}
                    className="w-full px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                  >
                    <Bell className="w-4 h-4 text-slate-400" /> {t("nav.notifications")}
                  </button>
                </div>

                <div className="border-t border-slate-100 pt-1">
                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                    className="w-full px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-semibold"
                  >
                    <LogOut className="w-4 h-4" /> {t("common.logout")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
