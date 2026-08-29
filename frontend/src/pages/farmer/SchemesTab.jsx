import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import { Badge } from "../../components/common/Badge";
import { Modal } from "../../components/common/Modal";
import { 
  Landmark, 
  Search, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  FileText, 
  AlertCircle, 
  ShieldCheck,
  Zap,
  Info
} from "lucide-react";

export const SchemesTab = () => {
  const { user } = useAuth();
  const [recommendedSchemes, setRecommendedSchemes] = useState([]);
  const [allSchemes, setAllSchemes] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Guidance Modal
  const [selectedSchemeForInfo, setSelectedSchemeForInfo] = useState(null);
  const [infoModalOpen, setInfoModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [recRes, allRes, alertRes] = await Promise.all([
          api.getRecommendedSchemes({
            state: user?.location?.state || "Maharashtra",
            category: user?.category || "Small & Marginal",
            primaryCrop: user?.farm?.primaryCrop || "Soybean",
            farmSize: user?.farm?.sizeAcres || 8.5
          }),
          api.getSchemes({ category: selectedCategory }),
          api.getNewSchemeAlerts()
        ]);

        setRecommendedSchemes(recRes.schemes || []);
        setAllSchemes(allRes.schemes || []);
        setAlerts(alertRes.alerts || []);
      } catch (err) {
        console.error("Schemes fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedCategory]);

  const filteredSchemes = allSchemes.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenInfoModal = (scheme) => {
    setSelectedSchemeForInfo(scheme);
    setInfoModalOpen(true);
  };

  const CATEGORIES = [
    "Income Support & DBT",
    "Crop Insurance & Risk Mitigation",
    "Farm Mechanization Subsidy",
    "Institutional Credit & Loan",
    "Micro-Irrigation & Water Conservation",
    "Organic Farming & Soil Health",
    "Storage & Post Harvest Infrastructure"
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-800 bg-purple-100 px-3 py-0.5 rounded-full border border-purple-200">
              Government Scheme Intelligence
            </span>
            <span className="text-xs font-bold text-slate-400">• Verified Portal Redirections</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-display mt-1">
            Personalized Government Schemes & Subsidies
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Targeted agricultural schemes matched against your landholding ({user?.farm?.sizeAcres || 8.5} acres), state ({user?.location?.state || "Maharashtra"}), and crop.
          </p>
        </div>
      </div>

      {/* New Scheme Alerts (Requirement #14) */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          <h2 className="text-base font-bold font-display text-white">Live Government Scheme Alerts & Deadlines</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {alerts.map((al) => (
            <div key={al.id} className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-400 text-slate-950">
                    {al.tag}
                  </span>
                  <span className="text-[10px] text-slate-300">Deadline: {al.deadline}</span>
                </div>
                <h3 className="font-bold text-xs text-white leading-snug">{al.title}</h3>
                <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">{al.description}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">Posted: {al.postedDate}</span>
                <a
                  href={al.portal}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1"
                >
                  <span>Portal ↗</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended for You Section (Requirement #14) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              Personalized Matching
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 font-display mt-1">Recommended for Your Farm Profile</h2>
          </div>
          <span className="text-xs text-slate-500 font-semibold">Matched: {recommendedSchemes.length} Schemes</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendedSchemes.slice(0, 4).map((scheme) => (
            <div
              key={scheme.id}
              className="bg-white rounded-3xl p-6 border-2 border-purple-500/20 hover:border-purple-500/60 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-200">
                      {scheme.category}
                    </span>
                    <h3 className="font-bold text-base text-slate-900 font-display mt-1.5">{scheme.name}</h3>
                    <p className="text-xs text-slate-500 font-medium">{scheme.department}</p>
                  </div>
                  <Badge variant="purple">{scheme.matchScore}% Match</Badge>
                </div>

                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{scheme.description}</p>

                {/* Benefits Pill */}
                <div className="mt-4 p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100 space-y-1 text-xs">
                  <div className="font-bold text-purple-950 flex items-center gap-1.5">
                    <span>💰 Benefit:</span>
                    <span>{scheme.benefits}</span>
                  </div>
                  <div className="text-[11px] text-purple-800">
                    <strong>Eligibility:</strong> {scheme.eligibility}
                  </div>
                </div>

                {/* Matched Criteria */}
                {scheme.matchedCriteria && (
                  <div className="mt-3 space-y-1">
                    {scheme.matchedCriteria.map((c, i) => (
                      <div key={i} className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>{c}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  onClick={() => handleOpenInfoModal(scheme)}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>Required Documents ({scheme.requiredDocuments.length})</span>
                </button>

                <a
                  href={scheme.officialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-700 hover:bg-purple-800 text-white shadow-sm transition-all flex items-center gap-1.5"
                >
                  <span>Visit Official Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All Schemes Catalog with Category Filter & Search */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-slate-900 font-display">All National & State Schemes</h2>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search scheme name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-purple-500 w-48 sm:w-64"
              />
            </div>
          </div>
        </div>

        {/* Category filter pills */}
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setSelectedCategory("")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === "" ? "bg-purple-800 text-white" : "bg-white text-slate-700 border border-slate-200"
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === c ? "bg-purple-800 text-white" : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Catalog Table / Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchemes.map((scheme) => (
            <div
              key={scheme.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                    {scheme.category}
                  </span>
                  <Badge variant="default">{scheme.status.split(" ")[0]}</Badge>
                </div>

                <h3 className="font-bold text-sm text-slate-900 font-display mt-2">{scheme.name}</h3>
                <p className="text-[11px] text-slate-500">{scheme.department}</p>
                <p className="text-xs text-slate-600 mt-2 line-clamp-3">{scheme.description}</p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => handleOpenInfoModal(scheme)}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  View Details
                </button>
                <a
                  href={scheme.officialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-all flex items-center gap-1"
                >
                  <span>Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scheme Document & Application Details Modal */}
      <Modal
        isOpen={infoModalOpen}
        onClose={() => setInfoModalOpen(false)}
        title={selectedSchemeForInfo?.name || "Scheme Application Details"}
        maxWidth="max-w-2xl"
      >
        {selectedSchemeForInfo && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200">
              <div className="text-xs font-bold text-purple-900 uppercase">Department</div>
              <p className="text-xs text-purple-800 mt-0.5">{selectedSchemeForInfo.department}</p>
              <div className="text-xs font-bold text-purple-900 uppercase mt-2">Financial Benefit</div>
              <p className="text-xs font-bold text-emerald-800 mt-0.5">{selectedSchemeForInfo.benefits}</p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Required Application Documents Checklist
              </h4>
              <div className="space-y-2">
                {selectedSchemeForInfo.requiredDocuments.map((doc, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-xs font-medium text-slate-800">
                    <FileText className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
              ⚠️ <strong>Official Government Portal Redirection:</strong> Click below to access the verified official government portal. Ensure you have your Aadhaar-linked mobile number ready for OTP verification.
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setInfoModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
              <a
                href={selectedSchemeForInfo.officialUrl}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2 rounded-xl text-xs font-bold bg-purple-700 hover:bg-purple-800 text-white shadow-md transition-all flex items-center gap-2"
              >
                <span>Visit Official Portal Now</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
