import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { LanguageSelector } from "../components/common/LanguageSelector";
import { Footer } from "../components/layout/Footer";
import { 
  Sprout, 
  Users, 
  Tractor, 
  Landmark, 
  TrendingUp, 
  CheckCircle2,
  ArrowRight
} from "lucide-react";

export const LandingPage = ({ onSelectAuth }) => {
  const { t } = useLanguage();

  const services = [
    {
      id: "mandi-rates",
      title: t("landing.service1Title"),
      description: t("landing.service1Desc"),
      icon: TrendingUp,
      badge: t("landing.service1Badge")
    },
    {
      id: "farm-labour",
      title: t("landing.service2Title"),
      description: t("landing.service2Desc"),
      icon: Users,
      badge: t("landing.service2Badge")
    },
    {
      id: "machinery-rental",
      title: t("landing.service3Title"),
      description: t("landing.service3Desc"),
      icon: Tractor,
      badge: t("landing.service3Badge")
    },
    {
      id: "govt-schemes",
      title: t("landing.service4Title"),
      description: t("landing.service4Desc"),
      icon: Landmark,
      badge: t("landing.service4Badge")
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col justify-between">
      {/* Top Clean Navigation */}
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur sticky top-0 z-50 px-4 sm:px-8 py-3 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 font-display">
                  Krishi <span className="text-emerald-600">Intelligence</span>
                </span>
                <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full hidden sm:inline-block">
                  {t("common.portal")}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                {t("common.tagline")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Selector */}
            <LanguageSelector />

            <button
              onClick={() => onSelectAuth("farmer-login")}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
            >
              <span>🌾</span>
              <span className="hidden sm:inline">{t("landing.farmerLoginBtn")}</span>
              <span className="sm:hidden">{t("common.login")}</span>
            </button>

            <button
              onClick={() => onSelectAuth("labour-login")}
              className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
            >
              <span>🛠️</span>
              <span className="hidden sm:inline">{t("landing.labourLoginBtn")}</span>
              <span className="sm:hidden">{t("landing.labourLoginBtn")}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Welcoming Hero Section & Portal Gateway */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 space-y-8 sm:space-y-10">
        {/* Welcoming Hero Banner with Vivid Agricultural Background */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-200/80 shadow-xl bg-slate-950 min-h-[360px] sm:min-h-[400px] flex items-center justify-center p-6 sm:p-12 text-center group">
          {/* Background Agricultural Landscape Image */}
          <img 
            src="/images/hero-bg.jpg" 
            alt="Smart Indian Agriculture Ecosystem" 
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />

          {/* Crisp Gradient Overlay for Maximum Legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-slate-950/30" />

          {/* Hero Content */}
          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950/70 backdrop-blur-md text-emerald-300 text-xs font-bold border border-emerald-500/30 shadow-md">
              <span>🌱</span>
              <span>{t("landing.welcomeTag")}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-display leading-tight drop-shadow-lg">
              {t("landing.heroTitle")}
            </h1>

            <p className="text-xs sm:text-base text-slate-100 max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-md">
              {t("landing.heroSubtitle")}
            </p>
          </div>
        </div>

        {/* Dual Role Gateway Cards */}
        <section className="space-y-4">
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
              {t("landing.chooseRoleTitle")}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              {t("landing.chooseRoleSubtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* Farmer Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-emerald-500/30 hover:border-emerald-500 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 pointer-events-none transition-transform group-hover:scale-110"></div>
              
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-xl shadow-md shadow-emerald-600/20">
                    🌾
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                    {t("landing.farmerCardBadge")}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
                  {t("landing.farmerCardTitle")}
                </h3>
                <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
                  {t("landing.farmerCardSubtitle")}
                </p>

                {/* 3 Benefits */}
                <div className="mt-4 p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-2 text-xs font-semibold text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 font-black">✓</span>
                    <span>{t("landing.farmerBenefit1")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 font-black">✓</span>
                    <span>{t("landing.farmerBenefit2")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 font-black">✓</span>
                    <span>{t("landing.farmerBenefit3")}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
                <button
                  onClick={() => onSelectAuth("farmer-login")}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all text-center flex items-center justify-center gap-1.5"
                >
                  <span>🌾 {t("landing.farmerLoginBtn")}</span>
                </button>
                <button
                  onClick={() => onSelectAuth("farmer-register")}
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 transition-all text-center"
                >
                  {t("landing.farmerRegisterBtn")}
                </button>
              </div>
            </div>

            {/* Labourer Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-amber-500/30 hover:border-amber-500 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full -mr-16 -mt-16 pointer-events-none transition-transform group-hover:scale-110"></div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center text-xl shadow-md shadow-amber-600/20">
                    🛠️
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                    {t("landing.labourCardBadge")}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
                  {t("landing.labourCardTitle")}
                </h3>
                <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
                  {t("landing.labourCardSubtitle")}
                </p>

                {/* 3 Benefits */}
                <div className="mt-4 p-3.5 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-2 text-xs font-semibold text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-600 font-black">✓</span>
                    <span>{t("landing.labourBenefit1")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-amber-600 font-black">✓</span>
                    <span>{t("landing.labourBenefit2")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-amber-600 font-black">✓</span>
                    <span>{t("landing.labourBenefit3")}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
                <button
                  onClick={() => onSelectAuth("labour-login")}
                  className="flex-1 py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-600/20 transition-all text-center flex items-center justify-center gap-1.5"
                >
                  <span>🛠️ {t("landing.labourLoginBtn")}</span>
                </button>
                <button
                  onClick={() => onSelectAuth("labour-register")}
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 transition-all text-center"
                >
                  {t("landing.labourRegisterBtn")}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 4 Core Services */}
        <section className="space-y-6 pt-2">
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
              {t("landing.servicesTitle")}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              {t("landing.servicesSubtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center mb-3.5">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="mb-2 text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full inline-block border border-emerald-100">
                      {item.badge}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 font-display mb-1.5">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* How it Works - 3 Simple Steps */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="text-center space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              {t("landing.stepsTag")}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display mt-2">
              {t("landing.stepsTitle")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-center">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center mx-auto mb-2.5 shadow-sm">
                1
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-slate-900">{t("landing.step1Title")}</h3>
              <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">
                {t("landing.step1Desc")}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center mx-auto mb-2.5 shadow-sm">
                2
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-slate-900">{t("landing.step2Title")}</h3>
              <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">
                {t("landing.step2Desc")}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200">
              <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center mx-auto mb-2.5 shadow-sm">
                3
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-emerald-950">{t("landing.step3Title")}</h3>
              <p className="text-xs text-emerald-800 mt-1 font-medium leading-relaxed">
                {t("landing.step3Desc")}
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Universal Rich Footer */}
      <Footer onNavigate={() => onSelectAuth("farmer-login")} />
    </div>
  );
};

