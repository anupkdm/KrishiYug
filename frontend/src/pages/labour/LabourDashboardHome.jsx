import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { 
  User, 
  Phone, 
  MapPin, 
  IndianRupee, 
  Wrench, 
  ArrowDown, 
  ArrowRight, 
  CheckCircle2, 
  Briefcase, 
  FileCheck2, 
  Wallet, 
  UserCheck, 
  Clock, 
  Sparkles, 
  Edit3, 
  HelpCircle,
  TrendingUp,
  ShieldCheck,
  ChevronRight
} from "lucide-react";

export const LabourDashboardHome = ({ onNavigate }) => {
  const { user } = useAuth();
  const { t } = useLanguage();

  // Dynamic user data extraction with safe fallbacks
  const labourName = user?.name || "Rahul Patil";
  const labourPhone = user?.phone || "9876543210";
  
  // Resolve locality gracefully from village, district, or location string
  const labourLocality = user?.village 
    ? `${user.village}${user.district ? ', ' + user.district : ''}`
    : user?.locality || user?.location || "Kopargaon";

  // Resolve skill gracefully from array or string
  const labourSkill = Array.isArray(user?.skills) && user.skills.length > 0 
    ? user.skills.join(", ") 
    : user?.skill || "Farm Labour";

  // Resolve expected wage gracefully
  const labourWage = user?.expectedDailyWage 
    ? `₹${user.expectedDailyWage}/day` 
    : user?.dailyWage 
    ? `₹${user.dailyWage}/day` 
    : "₹500/day";

  // Step-by-Step Project Workflow Data
  const workflowSteps = [
    {
      step: 1,
      number: "①",
      title: t("labourDashboard.step1Title", "① Registration"),
      desc: t("labourDashboard.step1Desc", "Labourer creates an account."),
      icon: UserCheck,
      color: "bg-amber-100 text-amber-800 border-amber-200",
      accent: "text-amber-700"
    },
    {
      step: 2,
      number: "②",
      title: t("labourDashboard.step2Title", "② Profile"),
      desc: t("labourDashboard.step2Desc", "Labourer's personal information and skills are stored."),
      icon: User,
      color: "bg-blue-100 text-blue-800 border-blue-200",
      accent: "text-blue-700"
    },
    {
      step: 3,
      number: "③",
      title: t("labourDashboard.step3Title", "③ Find Work"),
      desc: t("labourDashboard.step3Desc", "System displays suitable work opportunities based on skill and locality."),
      icon: Briefcase,
      color: "bg-emerald-100 text-emerald-800 border-emerald-200",
      accent: "text-emerald-700",
      actionTab: "available-jobs"
    },
    {
      step: 4,
      number: "④",
      title: t("labourDashboard.step4Title", "④ Apply"),
      desc: t("labourDashboard.step4Desc", "Labourer applies for a suitable job."),
      icon: Sparkles,
      color: "bg-purple-100 text-purple-800 border-purple-200",
      accent: "text-purple-700"
    },
    {
      step: 5,
      number: "⑤",
      title: t("labourDashboard.step5Title", "⑤ Application Status"),
      desc: t("labourDashboard.step5Desc", "Labourer can check whether the application is pending, accepted, or rejected."),
      icon: FileCheck2,
      color: "bg-orange-100 text-orange-800 border-orange-200",
      accent: "text-orange-700",
      actionTab: "my-applications"
    },
    {
      step: 6,
      number: "⑥",
      title: t("labourDashboard.step6Title", "⑥ Work"),
      desc: t("labourDashboard.step6Desc", "After acceptance, labourer completes the assigned work."),
      icon: Clock,
      color: "bg-teal-100 text-teal-800 border-teal-200",
      accent: "text-teal-700"
    },
    {
      step: 7,
      number: "⑦",
      title: t("labourDashboard.step7Title", "⑦ Earnings"),
      desc: t("labourDashboard.step7Desc", "Completed work and earned wages are displayed."),
      icon: Wallet,
      color: "bg-emerald-100 text-emerald-800 border-emerald-200",
      accent: "text-emerald-700",
      actionTab: "my-work"
    }
  ];

  return (
    <div className="space-y-6 pb-12 font-sans max-w-5xl mx-auto">
      {/* ========================================================================= */}
      {/* 1. WELCOME CONTAINER                                                      */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 font-black text-9xl select-none pointer-events-none">
          🛠️
        </div>

        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-extrabold uppercase tracking-wider bg-white/20 text-amber-100 px-3 py-1 rounded-full backdrop-blur-sm border border-white/20 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t("labourDashboard.verifiedWorker", "Registered Agricultural Worker")}</span>
            </span>
            <span className="text-xs text-amber-100 font-semibold flex items-center gap-1 bg-black/10 px-2.5 py-0.5 rounded-full">
              <MapPin className="w-3 h-3" />
              <span>{labourLocality}</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black font-display tracking-tight text-white mt-1">
            Welcome, {labourName}! 👋
          </h1>

          <p className="text-xs sm:text-sm text-amber-100/90 font-medium leading-relaxed max-w-xl">
            {t("labourDashboard.welcomeSubtitle", "Find suitable work opportunities and manage your work easily from your dashboard.")}
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. LABOURER PROFILE SECTION                                               */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 font-display">
                {t("labourDashboard.myProfileTitle", "My Profile")}
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                {t("labourDashboard.myProfileSubtitle", "Your verified personal details and work preferences.")}
              </p>
            </div>
          </div>

          {onNavigate && (
            <button
              onClick={() => onNavigate("profile")}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-all flex items-center gap-1.5 w-fit"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{t("labourDashboard.editProfile", "Edit Profile")}</span>
            </button>
          )}
        </div>

        {/* Profile Information Table / Key-Value Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-inner bg-slate-50/50">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/90 text-slate-600 font-black uppercase text-[11px] border-b border-slate-200">
                <th className="py-3 px-4 w-1/3 sm:w-1/4">{t("labourDashboard.field", "Field")}</th>
                <th className="py-3 px-4">{t("labourDashboard.information", "Information")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 bg-white">
              {/* Full Name */}
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-4 font-bold text-slate-500 flex items-center gap-2">
                  <User className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{t("labourDashboard.fullName", "Full Name")}</span>
                </td>
                <td className="py-3.5 px-4 font-black text-slate-900 text-sm">
                  {labourName}
                </td>
              </tr>

              {/* Contact Number */}
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-4 font-bold text-slate-500 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{t("labourDashboard.contactNumber", "Contact Number")}</span>
                </td>
                <td className="py-3.5 px-4 font-bold text-slate-800 font-mono">
                  {labourPhone}
                </td>
              </tr>

              {/* Locality */}
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-4 font-bold text-slate-500 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{t("labourDashboard.locality", "Locality")}</span>
                </td>
                <td className="py-3.5 px-4 font-bold text-slate-900">
                  {labourLocality}
                </td>
              </tr>

              {/* Skill */}
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-4 font-bold text-slate-500 flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{t("labourDashboard.skill", "Skill")}</span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 font-extrabold text-xs border border-amber-200">
                    {labourSkill}
                  </span>
                </td>
              </tr>

              {/* Expected Daily Wages */}
              <tr className="hover:bg-slate-50/80 transition-colors bg-amber-50/30">
                <td className="py-3.5 px-4 font-bold text-slate-500 flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{t("labourDashboard.expectedDailyWages", "Expected Daily Wages")}</span>
                </td>
                <td className="py-3.5 px-4 font-black text-amber-800 text-sm font-mono">
                  {labourWage}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. PROJECT WORKFLOW SECTION (How It Works)                                */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3.5">
          <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 font-display">
              {t("labourDashboard.projectWorkflowTitle", "Project Workflow")}
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
              {t("labourDashboard.projectWorkflowSubtitle", "Complete step-by-step journey of a labourer on KrishiMitra")}
            </p>
          </div>
        </div>

        {/* Workflow Progression Container (7 Steps) */}
        <div className="space-y-3">
          {workflowSteps.map((ws, idx) => {
            const IconComponent = ws.icon;
            const isLast = idx === workflowSteps.length - 1;

            return (
              <div key={ws.step} className="relative">
                {/* Step Box */}
                <div className="p-4 rounded-2xl border border-slate-200/90 bg-white hover:bg-slate-50/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-start sm:items-center gap-3.5">
                    {/* Step Icon Badge */}
                    <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center font-black text-sm shrink-0 shadow-xs ${ws.color}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>

                    {/* Step Text Content */}
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-black uppercase tracking-wider ${ws.accent}`}>
                          Step {ws.step}
                        </span>
                        <h3 className="text-sm font-black text-slate-900 font-display">
                          {ws.title}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">
                        {ws.desc}
                      </p>
                    </div>
                  </div>

                  {/* Direct Action Link if available */}
                  {ws.actionTab && onNavigate && (
                    <button
                      onClick={() => onNavigate(ws.actionTab)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 hover:border-emerald-200 transition-all flex items-center gap-1 shrink-0 self-end sm:self-center"
                    >
                      <span>Open</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Downward Connector Arrow between steps */}
                {!isLast && (
                  <div className="flex justify-center py-1">
                    <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 font-bold flex items-center justify-center border border-slate-200">
                      <ArrowDown className="w-3.5 h-3.5" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick Action Navigation Footer */}
        {onNavigate && (
          <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => onNavigate("available-jobs")}
              className="w-full py-2.5 px-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
            >
              <Briefcase className="w-4 h-4" />
              <span>{t("labourDashboard.findWorkBtn", "Find Work")}</span>
            </button>

            <button
              onClick={() => onNavigate("my-applications")}
              className="w-full py-2.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>{t("labourDashboard.checkStatusBtn", "Application Status")}</span>
            </button>

            <button
              onClick={() => onNavigate("my-work")}
              className="w-full py-2.5 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
            >
              <Wallet className="w-4 h-4" />
              <span>{t("labourDashboard.viewEarningsBtn", "My Work & Earnings")}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
