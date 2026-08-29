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
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Top Clean Navigation */}
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur sticky top-0 z-50 px-4 sm:px-8 py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 font-display">
                  Krishi <span className="text-emerald-600">Intelligence</span>
                </span>
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md hidden sm:inline-block">
                  {t("common.portal")}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                {t("common.tagline")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Selector */}
            <LanguageSelector />

            <button
              onClick={() => onSelectAuth("farmer-login")}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-sm transition-all"
            >
              {t("landing.farmerLoginBtn")}
            </button>
          </div>
        </div>
      </header>

      {/* Welcoming Hero Section */}
      <section className="relative px-4 sm:px-6 pt-12 pb-16 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold mb-5 border border-emerald-200 shadow-sm">
          <span>🌱</span>
          <span>{t("landing.welcomeTag")}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight font-display max-w-4xl mx-auto leading-tight">
          {t("landing.heroTitle")}
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto mt-4 leading-relaxed">
          {t("landing.heroSubtitle")}
        </p>
      </section>

      {/* Dual Role Gateway */}
      <section className="px-4 sm:px-6 py-6 max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            {t("landing.chooseRoleTitle")}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {t("landing.chooseRoleSubtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Farmer Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-500/40 hover:border-emerald-600 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-2xl shadow-md shadow-emerald-600/20">
                  🌾
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  {t("landing.farmerCardBadge")}
                </span>
              </div>

              <h3 className="text-2xl font-extrabold text-slate-900 font-display">
                {t("landing.farmerCardTitle")}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5">
                {t("landing.farmerCardSubtitle")}
              </p>

              {/* Showcase Image */}
              <div className="mt-5 relative rounded-2xl overflow-hidden shadow-sm border border-slate-200 aspect-[16/10] group-hover:shadow-md transition-all">
                <img 
                  src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&auto=format&fit=crop&q=80" 
                  alt="Smart Indian Farmer" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-4">
                  <span className="text-white text-xs font-bold flex items-center gap-1.5">
                    🌱 {t("landing.farmerBenefit1")}
                  </span>
                </div>
              </div>

              {/* 3 Benefits */}
              <div className="mt-5 space-y-2 text-xs font-medium text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{t("landing.farmerBenefit1")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{t("landing.farmerBenefit2")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{t("landing.farmerBenefit3")}</span>
                </div>
              </div>
            </div>

            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => onSelectAuth("farmer-login")}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all text-center"
              >
                {t("landing.farmerLoginBtn")}
              </button>
              <button
                onClick={() => onSelectAuth("farmer-register")}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm border border-slate-200 transition-all text-center"
              >
                {t("landing.farmerRegisterBtn")}
              </button>
            </div>
          </div>

          {/* Labourer Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-500/40 hover:border-amber-600 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-600 text-white flex items-center justify-center text-2xl shadow-md shadow-amber-600/20">
                  🛠️
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                  {t("landing.labourCardBadge")}
                </span>
              </div>

              <h3 className="text-2xl font-extrabold text-slate-900 font-display">
                {t("landing.labourCardTitle")}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5">
                {t("landing.labourCardSubtitle")}
              </p>

              {/* Showcase Image */}
              <div className="mt-5 relative rounded-2xl overflow-hidden shadow-sm border border-slate-200 aspect-[16/10] group-hover:shadow-md transition-all">
                <img 
                  src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=800&auto=format&fit=crop&q=80" 
                  alt="Agricultural Work & Labourers" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-4">
                  <span className="text-white text-xs font-bold flex items-center gap-1.5">
                    🤝 {t("landing.labourBenefit2")}
                  </span>
                </div>
              </div>

              {/* 3 Benefits */}
              <div className="mt-5 space-y-2 text-xs font-medium text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="text-amber-600 font-bold">✓</span>
                  <span>{t("landing.labourBenefit1")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-amber-600 font-bold">✓</span>
                  <span>{t("landing.labourBenefit2")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-amber-600 font-bold">✓</span>
                  <span>{t("landing.labourBenefit3")}</span>
                </div>
              </div>
            </div>

            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => onSelectAuth("labour-login")}
                className="flex-1 py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-amber-600/20 transition-all text-center"
              >
                {t("landing.labourLoginBtn")}
              </button>
              <button
                onClick={() => onSelectAuth("labour-register")}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm border border-slate-200 transition-all text-center"
              >
                {t("landing.labourRegisterBtn")}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Services */}
      <section className="px-4 sm:px-6 py-14 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            {t("landing.servicesTitle")}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {t("landing.servicesSubtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-slate-50 text-emerald-600 border border-slate-200 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="mb-2 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded inline-block">
                    {item.badge}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 font-display mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it Works - 3 Simple Steps */}
      <section className="px-4 sm:px-6 py-12 max-w-5xl mx-auto bg-white rounded-3xl border border-slate-200 my-6 shadow-sm">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
            {t("landing.stepsTag")}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mt-2">
            {t("landing.stepsTitle")}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center mx-auto mb-3">
              1
            </div>
            <h4 className="font-bold text-sm text-slate-900">{t("landing.step1Title")}</h4>
            <p className="text-xs text-slate-500 mt-1.5">
              {t("landing.step1Desc")}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center mx-auto mb-3">
              2
            </div>
            <h4 className="font-bold text-sm text-slate-900">{t("landing.step2Title")}</h4>
            <p className="text-xs text-slate-500 mt-1.5">
              {t("landing.step2Desc")}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center mx-auto mb-3">
              3
            </div>
            <h4 className="font-bold text-sm text-emerald-900">{t("landing.step3Title")}</h4>
            <p className="text-xs text-emerald-700 mt-1.5">
              {t("landing.step3Desc")}
            </p>
          </div>
        </div>
      </section>

      {/* Universal Rich Footer */}
      <Footer onNavigate={() => onSelectAuth("farmer-login")} />
    </div>
  );
};

