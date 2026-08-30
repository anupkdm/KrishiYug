import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import { Badge } from "../../components/common/Badge";
import { FileCheck2, Calendar, IndianRupee, MapPin, CheckCircle2, Clock, Phone, Check, X } from "lucide-react";

export const MyApplicationsTab = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [hiringRequests, setHiringRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("offers"); // "offers" | "applications"
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [appsRes, reqsRes] = await Promise.all([
        api.getMyLabourApplications().catch(() => ({ applications: [] })),
        api.getHiringRequests().catch(() => ({ requests: [] }))
      ]);
      setApplications(appsRes.applications || []);
      setHiringRequests(reqsRes.requests || []);
    } catch (err) {
      console.error("Fetch applications/offers error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRespondHire = async (id, status) => {
    try {
      await api.updateHiringRequestStatus(id, status);
      fetchData();
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-0.5 rounded-full border border-amber-200">
            Work Tracker & Job Offers
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 font-display mt-1">
            Incoming Job Offers & Applications
          </h1>
        </div>

        {/* View Toggle: Incoming Offers vs Applied Jobs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl self-start sm:self-auto">
          <button
            onClick={() => setActiveView("offers")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeView === "offers" ? "bg-amber-600 text-white shadow-sm font-extrabold" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>🤝 Direct Offers from Farmers ({hiringRequests.length})</span>
          </button>

          <button
            onClick={() => setActiveView("applications")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeView === "applications" ? "bg-white text-slate-900 shadow-sm font-extrabold" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            My Job Applications ({applications.length})
          </button>
        </div>
      </div>

      {/* VIEW 1: DIRECT OFFERS FROM FARMERS */}
      {activeView === "offers" && (
        <div className="space-y-4">
          {hiringRequests.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center text-slate-400 border border-slate-200/80">
              <FileCheck2 className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <p className="text-sm font-semibold">No direct job offers received yet.</p>
              <p className="text-xs text-slate-400 mt-1">When farmers hire you from the farmer portal, their offers will appear here.</p>
            </div>
          ) : (
            hiringRequests.map((offer) => (
              <div
                key={offer.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">👨‍🌾</span>
                    <h3 className="font-bold text-base text-slate-900 font-display">
                      Farmer {offer.farmerName}
                    </h3>
                    <Badge variant={offer.status === "Accepted" ? "success" : offer.status === "Rejected" ? "default" : "warning"}>
                      {offer.status}
                    </Badge>
                  </div>

                  <p className="text-xs font-semibold text-emerald-800">
                    🌱 Work Type: <strong>{offer.workType}</strong> • 📅 Start: <strong>{offer.date}</strong> ({offer.duration} Days)
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-600">
                    <span className="flex items-center gap-1 font-mono font-bold text-emerald-700">
                      <IndianRupee className="w-3.5 h-3.5" /> Total Offer: ₹{offer.totalCost} (₹{offer.dailyWage}/day)
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {offer.farmerLocation}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <a
                    href={`tel:${offer.farmerPhone}`}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Call Farmer</span>
                  </a>

                  {offer.status === "Pending" && (
                    <>
                      <button
                        onClick={() => handleRespondHire(offer.id, "Accepted")}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept Offer</span>
                      </button>

                      <button
                        onClick={() => handleRespondHire(offer.id, "Rejected")}
                        className="px-3.5 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs flex items-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Decline</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* VIEW 2: JOB APPLICATIONS */}
      {activeView === "applications" && (
        <div className="space-y-4">
          {applications.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center text-slate-400 border border-slate-200/80">
              <FileCheck2 className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <p className="text-sm font-semibold">No applications submitted yet.</p>
            </div>
          ) : (
            applications.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                      {app.crop}
                    </span>
                    <h3 className="font-bold text-base text-slate-900 font-display">{app.activity}</h3>
                    <Badge variant={app.status === "Accepted" ? "success" : app.status === "Pending" ? "warning" : "default"}>
                      {app.status}
                    </Badge>
                  </div>

                  <p className="text-xs font-medium text-slate-600">
                    Farmer: <strong className="text-slate-900">{app.farmName}</strong>
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-mono font-bold text-slate-700">
                      <IndianRupee className="w-3.5 h-3.5 text-slate-400" /> ₹{app.wageExpected}/day expected
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> Applied: {new Date(app.appliedDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
