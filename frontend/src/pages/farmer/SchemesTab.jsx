import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { api } from "../../services/api";
import { 
  Landmark, 
  Search, 
  Filter, 
  ExternalLink, 
  CheckCircle2, 
  FileText, 
  ChevronRight, 
  X, 
  ShieldCheck, 
  IndianRupee,
  Sparkles,
  Info,
  Calendar,
  Layers
} from "lucide-react";
import confetti from "canvas-confetti";

export const SchemesTab = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterState, setFilterState] = useState("All");
  const [selectedBox, setSelectedBox] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [appliedSchemes, setAppliedSchemes] = useState({});

  // 9 GOVERNMENT SCHEME BOXES (3x3 Layout)
  const SCHEME_BOXES = [
    {
      id: 1,
      number: "1",
      icon: "🌱",
      title: "Crop & Agriculture Development",
      shortDesc: "Subsidies for certified seeds, soil nutrients, bio-fertilizers, and sustainable farming missions.",
      schemesCount: "4 Active Schemes",
      badge: "Production Subsidy",
      schemes: [
        {
          name: "Rashtriya Krishi Vikas Yojana (RKVY-RAFTAAR)",
          ministry: "Ministry of Agriculture & Farmers Welfare",
          benefit: "Up to 50% financial grant for agri-infrastructure & crop development",
          eligibility: "All farmers, FPOs, and SHGs with verified land records",
          documents: ["7/12 & 8A Land Records", "Aadhaar Card", "Bank Passbook", "Farm Soil Health Card"],
          portalUrl: "https://rkvy.nic.in"
        },
        {
          name: "Paramparagat Krishi Vikas Yojana (PKVY - Organic Farming)",
          ministry: "Ministry of Agriculture & Farmers Welfare",
          benefit: "₹50,000/hectare for 3 years for organic conversion, bio-inputs & certification",
          eligibility: "Farmers willing to adopt certified organic clusters (minimum 20-50 farmers group)",
          documents: ["Aadhaar Card", "Land Ownership Proof", "Panchayat Verification"],
          portalUrl: "https://pgsindia-ncof.gov.in"
        },
        {
          name: "National Food Security Mission (NFSM - Oilseeds & Pulses)",
          ministry: "Department of Agriculture and Farmers Welfare",
          benefit: "60% subsidy on high-yield variety certified seeds, micronutrients & weedicides",
          eligibility: "Pulse, Oilseed, Wheat, and Rice cultivating farmers",
          documents: ["Aadhaar Card", "Kisan Credit Card (KCC)", "Bank Account"],
          portalUrl: "https://nfsm.gov.in"
        }
      ]
    },
    {
      id: 2,
      number: "2",
      icon: "💰",
      title: "Financial Support & Subsidies",
      shortDesc: "Direct cash transfers, subsidized credit interest subvention, and emergency working capital.",
      schemesCount: "3 Active Schemes",
      badge: "Direct Benefit Transfer",
      schemes: [
        {
          name: "PM Kisan Samman Nidhi (PM-KISAN)",
          ministry: "Ministry of Agriculture & Farmers Welfare",
          benefit: "₹6,000 per year direct income support in 3 equal installments of ₹2,000 into Aadhaar-seeded bank account",
          eligibility: "All small and marginal landholding farmer families with cultivable land",
          documents: ["Aadhaar Card with e-KYC", "Landholding Records", "Aadhaar-linked Bank Account"],
          portalUrl: "https://pmkisan.gov.in"
        },
        {
          name: "Modified Interest Subvention Scheme (MISS / KCC)",
          ministry: "Ministry of Finance & NABARD",
          benefit: "Short term crop loans up to ₹3,00,000 at highly concessional 4% interest rate (3% prompt repayment incentive)",
          eligibility: "Farmers with active Kisan Credit Card cultivating Kharif/Rabi crops",
          documents: ["Kisan Credit Card", "7/12 Land Extract", "Crop Sowing Certificate"],
          portalUrl: "https://www.nabard.org"
        }
      ]
    },
    {
      id: 3,
      number: "3",
      icon: "💧",
      title: "Irrigation & Water Management",
      shortDesc: "Drip & sprinkler micro-irrigation subsidies, solar water pumps, and farm pond construction.",
      schemesCount: "4 Active Schemes",
      badge: "55-80% Subsidy",
      schemes: [
        {
          name: "PM Krishi Sinchayee Yojana (PMKSY - Per Drop More Crop)",
          ministry: "Ministry of Jal Shakti & Agriculture",
          benefit: "55% subsidy for small/marginal farmers & 45% for others for Drip and Sprinkler Irrigation sets",
          eligibility: "Farmers owning cultivable land with assured water source (well, borewell, canal)",
          documents: ["7/12 Land Extract", "Water Source Certificate", "Electricity Bill (if pump)", "Aadhaar Card"],
          portalUrl: "https://pmksy.gov.in"
        },
        {
          name: "PM-KUSUM (Component-B: Solar Agricultural Pumps)",
          ministry: "Ministry of New and Renewable Energy",
          benefit: "Up to 60% subsidy (30% Central + 30% State) for installing standalone off-grid Solar Water Pumps (3HP to 7.5HP)",
          eligibility: "Farmers in non-electrified grid areas or replacing diesel pumps",
          documents: ["Land Ownership Document", "Borewell/Dug-well proof", "Aadhaar Card", "Bank Details"],
          portalUrl: "https://pmkusum.mnre.gov.in"
        }
      ]
    },
    {
      id: 4,
      number: "4",
      icon: "🚜",
      title: "Agricultural Machinery & Mechanization",
      shortDesc: "Financial grants for tractors, rotavators, power tillers, drone sprayers, and Custom Hiring Centres.",
      schemesCount: "3 Active Schemes",
      badge: "40-50% Subsidy",
      schemes: [
        {
          name: "Sub-Mission on Agricultural Mechanization (SMAM)",
          ministry: "Ministry of Agriculture & Farmers Welfare",
          benefit: "40% to 50% subsidy on purchase of Tractors, Power Tillers, Combine Harvesters, and Multi-Crop Threshers",
          eligibility: "All individual farmers, SC/ST, and Women farmers (who receive up to 50% higher subsidy)",
          documents: ["Aadhaar Card", "Land Record (7/12)", "Quotation from Authorized Dealer", "Bank Passbook"],
          portalUrl: "https://agrimachinery.nic.in"
        },
        {
          name: "Kisan Drone Promotion Scheme",
          ministry: "Ministry of Agriculture & Farmers Welfare",
          benefit: "Up to 50% (max ₹5,00,000) for purchase of Agri-Drones for precision foliar spraying and crop assessment",
          eligibility: "FPOs, Custom Hiring Centres, Agri-Graduates, and Progressive Farmers",
          documents: ["DGCA Drone Pilot Training Certificate", "FPO Registration", "Bank Account"],
          portalUrl: "https://agrimachinery.nic.in"
        }
      ]
    },
    {
      id: 5,
      number: "5",
      icon: "🛡️",
      title: "Crop Insurance & Risk Management",
      shortDesc: "Low-cost safety net protecting against crop failure from drought, floods, unseasonal hail, and pest attacks.",
      schemesCount: "2 Active Schemes",
      badge: "1.5% Premium Cap",
      schemes: [
        {
          name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
          ministry: "Ministry of Agriculture & Farmers Welfare",
          benefit: "Full sum-insured crop loss compensation with farmer paying only 2% premium for Kharif, 1.5% for Rabi, and 5% for Annual Horticultural crops",
          eligibility: "All farmers (loanee and non-loanee) growing notified crops in notified areas",
          documents: ["Sowing Certificate / Talathi Panchanama", "7/12 Land Record", "Bank Passbook", "Aadhaar Card"],
          portalUrl: "https://pmfby.gov.in"
        },
        {
          name: "Restructured Weather Based Crop Insurance Scheme (RWBCIS)",
          ministry: "Ministry of Agriculture & Farmers Welfare",
          benefit: "Automated weather station payout for temperature spikes, unseasonal rainfall, and frost damage",
          eligibility: "Farmers cultivating notified commercial & fruit crops (Grapes, Onion, Pomegranate, etc.)",
          documents: ["Aadhaar Card", "Land Document", "Bank Account Details"],
          portalUrl: "https://pmfby.gov.in"
        }
      ]
    },
    {
      id: 6,
      number: "6",
      icon: "🏪",
      title: "Market & Price Support",
      shortDesc: "MSP price guarantees, electronic mandi trading, and interest-free post-harvest storage loans.",
      schemesCount: "3 Active Schemes",
      badge: "MSP Assurance",
      schemes: [
        {
          name: "Pradhan Mantri Annadata Aay Sanraksan Abhiyan (PM-AASHA)",
          ministry: "Ministry of Agriculture & Farmers Welfare",
          benefit: "Price Support Scheme (PSS) ensuring government procurement at Minimum Support Price (MSP) when mandi prices drop",
          eligibility: "Registered farmers cultivating pulses, oilseeds, and copra",
          documents: ["Farmer Registration Number", "7/12 Land Extract", "Aadhaar Card", "Bank Details"],
          portalUrl: "https://pmaasha.gov.in"
        },
        {
          name: "Agriculture Infrastructure Fund (AIF)",
          ministry: "Ministry of Agriculture & Farmers Welfare",
          benefit: "3% interest subvention and credit guarantee for building post-harvest cold storage, packhouses, and drying yards",
          eligibility: "Farmers, Agri-Entrepreneurs, Startups, and Primary Agricultural Credit Societies (PACS)",
          documents: ["DPR (Detailed Project Report)", "Land Record", "Bank Loan Application"],
          portalUrl: "https://agriinfra.dac.gov.in"
        }
      ]
    },
    {
      id: 7,
      number: "7",
      icon: "👩",
      title: "Women Farmers & SHG Welfare",
      shortDesc: "Specialized financial grants, gender-friendly farm tools, and women agri-entrepreneurship subsidies.",
      schemesCount: "3 Active Schemes",
      badge: "Women Empowerment",
      schemes: [
        {
          name: "Mahila Kisan Sashaktikaran Pariyojana (MKSP)",
          ministry: "Ministry of Rural Development",
          benefit: "Direct skill empowerment, zero-cost input kits, and funding up to ₹1,00,000 for women-led sustainable farm enterprises",
          eligibility: "Women smallholders and women Self Help Group (SHG) members engaged in agriculture",
          documents: ["SHG Membership Certificate", "Aadhaar Card", "Bank Account Details"],
          portalUrl: "https://aajeevika.gov.in"
        },
        {
          name: "Namo Drone Didi Scheme",
          ministry: "Department of Agriculture and Farmers Welfare",
          benefit: "80% financial assistance (up to ₹8 Lakhs) to Women Self Help Groups for purchasing agricultural drones & pilot training",
          eligibility: "Women SHG members identified under Deendayal Antyodaya Yojana - NRLM",
          documents: ["Aadhaar Card", "NRLM SHG ID", "Passbook Copy"],
          portalUrl: "https://agricoop.nic.in"
        }
      ]
    },
    {
      id: 8,
      number: "8",
      icon: "🏠",
      title: "Pradhan Mantri Awaas Yojana – Gramin (PMAY-G)",
      shortDesc: "Direct financial assistance for constructing a durable, disaster-resilient pucca house with basic civic amenities.",
      schemesCount: "Flagship Housing",
      badge: "₹1.20 - ₹1.30 Lakh",
      schemes: [
        {
          name: "Pradhan Mantri Awaas Yojana – Gramin (PMAY-G)",
          ministry: "Ministry of Rural Development",
          benefit: "Direct financial grant of ₹1,20,000 (in plain areas) to ₹1,30,000 (in hilly/difficult areas) + ₹12,000 for Swachh Bharat Toilet construction + 90 days of MGNREGA wages",
          eligibility: "Rural families living in kutcha/dilapidated houses or landless rural households identified under SECC list",
          documents: ["Aadhaar Card", "MGNREGA Job Card", "Bank Account Passbook", "Gram Panchayat Survey Verification Certificate"],
          portalUrl: "https://pmayg.nic.in"
        }
      ]
    },
    {
      id: 9,
      number: "9",
      icon: "👨‍🌾",
      title: "Pradhan Mantri Kisan Maandhan Yojana (PM-KMY)",
      shortDesc: "Guaranteed monthly old-age pension for small and marginal farmers ensuring social security after age 60.",
      schemesCount: "Pension Scheme",
      badge: "₹3,000 / Month",
      schemes: [
        {
          name: "Pradhan Mantri Kisan Maandhan Yojana (PM-KMY)",
          ministry: "Ministry of Agriculture & Farmers Welfare (managed by LIC)",
          benefit: "Assured pension of ₹3,000 per month on attaining 60 years of age, with 50% matching contribution paid by Central Government",
          eligibility: "Small and marginal farmers having cultivable land up to 2 hectares, aged between 18 to 40 years at entry",
          documents: ["Aadhaar Card", "Savings Bank Account / PM-KISAN Account Details", "Land Record (7/12 / RoR)"],
          portalUrl: "https://maandhan.in"
        }
      ]
    }
  ];

  const handleOpenModal = (box) => {
    setSelectedBox(box);
    setModalOpen(true);
  };

  const handleApplyScheme = (schemeName) => {
    setAppliedSchemes(prev => ({ ...prev, [schemeName]: true }));
    confetti({ particleCount: 40, spread: 60 });
  };

  // Filter 9 boxes by search query
  const filteredBoxes = SCHEME_BOXES.filter((box) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      box.title.toLowerCase().includes(q) ||
      box.shortDesc.toLowerCase().includes(q) ||
      box.schemes.some(s => s.name.toLowerCase().includes(q) || s.benefit.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 pb-12 font-sans max-w-[1560px] mx-auto">
      {/* 1. TOP HEADER WITH SEARCH & FILTER IN TOP RIGHT */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Title & Description */}
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏛️</span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight font-display">
              {t("schemes.title", "GOVERNMENT SCHEME")}
            </h1>
          </div>
          <p className="text-sm font-semibold text-slate-600 mt-1">
            {t("schemes.subtitle", "Central & State Welfare Schemes, Direct Benefit Transfers & Subsidies for Farmers")}
          </p>
        </div>

        {/* Top-Right: Search and Filter Container */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          {/* Search Box */}
          <div className="relative min-w-[240px] sm:min-w-[280px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder={t("schemes.searchPlaceholder", "🔍 Search schemes...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-semibold bg-slate-50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <select
              value={filterState}
              onChange={(e) => setFilterState(e.target.value)}
              className="px-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="All">{t("schemes.filterAll", "⚙ Filter: All Categories")}</option>
              <option value="Central">{t("schemes.filterCentral", "Central Govt Schemes")}</option>
              <option value="Subsidies">{t("schemes.filterSubsidies", "High Subsidies (50%+)")}</option>
              <option value="Direct">{t("schemes.filterDirect", "Direct Cash Transfers (DBT)")}</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. EXACT 3x3 GRID (9 BOXES TOTAL, 3 BOXES PER ROW) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {filteredBoxes.map((box) => {
          const localizedTitle = t(`schemes.box${box.id}`, box.title);
          return (
            <div
              key={box.id}
              onClick={() => handleOpenModal(box)}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-400 transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-400 group-hover:h-2 transition-all" />

              <div>
                {/* Card Header: Number, Icon, Title, Badge */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-900 font-black text-2xl flex items-center justify-center shadow-inner border border-emerald-100 shrink-0 group-hover:scale-105 transition-transform">
                      {box.icon}
                    </div>
                    <div>
                      <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
                        {t("schemes.boxLabel", "Box")} {box.number}
                      </span>
                      <h2 className="text-base font-black text-slate-900 font-display mt-1 leading-snug group-hover:text-emerald-800 transition-colors">
                        {box.number}. {localizedTitle}
                      </h2>
                    </div>
                  </div>
                </div>

                {/* Short Description */}
                <p className="text-xs font-medium text-slate-600 leading-relaxed mt-2 line-clamp-2">
                  {box.shortDesc}
                </p>

                {/* Schemes Preview Tags */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {t("schemes.includedPrograms", "Included Programs")}:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {box.schemes.map((s, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60 line-clamp-1"
                      >
                        {s.name.split("(")[0]}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer: Benefit Badge & Action Button */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  ⭐ {box.badge}
                </span>

                <button className="text-xs font-black text-emerald-700 group-hover:text-emerald-800 flex items-center gap-1 group-hover:translate-x-1 transition-all">
                  <span>{t("schemes.viewAndApply", "View & Apply")}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. DETAILED SCHEMES MODAL & OFFICIAL APPLICATION PORTAL */}
      {modalOpen && selectedBox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 space-y-6 animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-2xl flex items-center justify-center">
                  {selectedBox.icon}
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    {t("schemes.categoryLabel", "Category")} {selectedBox.number}
                  </span>
                  <h3 className="text-xl font-black text-slate-900 font-display mt-0.5">
                    {t(`schemes.box${selectedBox.id}`, selectedBox.title)}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Schemes List inside Modal */}
            <div className="space-y-4">
              {selectedBox.schemes.map((scheme, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 hover:bg-white hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <h4 className="font-black text-sm text-slate-900 font-display">
                        {scheme.name}
                      </h4>
                      <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                        🏛️ {scheme.ministry}
                      </p>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                      {t("schemes.verifiedScheme", "Verified Scheme")}
                    </span>
                  </div>

                  {/* Financial Benefit */}
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                    <strong className="font-black">💰 {t("schemes.financialBenefit", "Financial Benefit / Subsidy")}:</strong>
                    <div className="mt-0.5 font-semibold leading-relaxed">
                      {scheme.benefit}
                    </div>
                  </div>

                  {/* Eligibility & Documents */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <div className="text-[10px] font-black uppercase text-slate-400">{t("schemes.eligibility", "Eligibility")}</div>
                      <p className="text-slate-700 font-medium mt-0.5 leading-relaxed">
                        {scheme.eligibility}
                      </p>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <div className="text-[10px] font-black uppercase text-slate-400">{t("schemes.requiredDocs", "Required Documents")}</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {scheme.documents.map((doc, dIdx) => (
                          <span key={dIdx} className="text-[10px] font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                            ✓ {doc}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions: Direct Official Portal Link & One-Click Apply */}
                  <div className="flex items-center justify-between gap-3 pt-2">
                    <a
                      href={scheme.portalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-black text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 underline"
                    >
                      <span>{t("schemes.officialPortal", "Official Portal")} ({new URL(scheme.portalUrl).hostname})</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                      onClick={() => handleApplyScheme(scheme.name)}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                        appliedSchemes[scheme.name]
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm"
                      }`}
                    >
                      {appliedSchemes[scheme.name] ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{t("schemes.appliedBtn", "Application Initiated ✓")}</span>
                        </>
                      ) : (
                        <span>{t("schemes.applyBtn", "Apply / Check Eligibility →")}</span>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Bottom Close */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setModalOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs"
              >
                {t("schemes.close", "Close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
