import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import { MetricCard } from "../../components/common/MetricCard";
import { Badge } from "../../components/common/Badge";
import { Modal } from "../../components/common/Modal";
import { 
  Briefcase, 
  MapPin, 
  Calendar, 
  IndianRupee, 
  Clock, 
  Users, 
  CheckCircle2, 
  Sparkles, 
  Send, 
  Wallet,
  Star,
  ShieldCheck,
  Search,
  Filter
} from "lucide-react";
import confetti from "canvas-confetti";

export const LabourDashboardHome = ({ onNavigate }) => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCrop, setSearchCrop] = useState("");

  // Apply Modal State
  const [selectedJobForApply, setSelectedJobForApply] = useState(null);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applyForm, setApplyForm] = useState({
    wageExpected: user?.expectedDailyWage || "450",
    note: "Experienced agricultural worker available for this entire duration. Ready to start early morning."
  });
  const [applying, setApplying] = useState(false);
  const [appliedSuccessMsg, setAppliedSuccessMsg] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [dashRes, jobsRes] = await Promise.all([
        api.getLabourDashboard(),
        api.getLabourRequirements({ status: "Open" })
      ]);

      setDashboardData(dashRes);
      setJobs(jobsRes.requirements || []);
    } catch (err) {
      console.error("Labour dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenApply = (job) => {
    setSelectedJobForApply(job);
    setApplyForm({
      wageExpected: user?.expectedDailyWage || job.dailyWageOffered.toString(),
      note: `Experienced in ${job.crop} ${job.activity}. Ready to join on ${job.startDate}.`
    });
    setApplyModalOpen(true);
  };

  const handleConfirmApply = async (e) => {
    e.preventDefault();
    setApplying(true);
    try {
      await api.applyForJob({
        requirementId: selectedJobForApply.id,
        wageExpected: parseFloat(applyForm.wageExpected),
        note: applyForm.note
      });

      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      setAppliedSuccessMsg(`Successfully applied for ${selectedJobForApply.activity} at ${selectedJobForApply.farmName}!`);
      setApplyModalOpen(false);
      fetchData();
    } catch (err) {
      alert("Application failed: " + err.message);
    } finally {
      setApplying(false);
    }
  };

  const filteredJobs = jobs.filter(j => 
    j.crop.toLowerCase().includes(searchCrop.toLowerCase()) ||
    j.activity.toLowerCase().includes(searchCrop.toLowerCase()) ||
    j.location.toLowerCase().includes(searchCrop.toLowerCase())
  );

  const stats = dashboardData?.stats || {
    totalJobsAvailable: jobs.length,
    appliedJobsCount: 2,
    acceptedJobsCount: 1,
    completedJobsCount: 47,
    estimatedTotalEarnings: 21150,
    rating: user?.rating || 4.9
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-harvest-600 to-amber-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-white/20 text-amber-100 px-3 py-1 rounded-full backdrop-blur-sm">
              🛠️ Verified Agricultural Worker
            </span>
            <span className="text-xs text-amber-200">
              • {user?.location || "Nashik, Maharashtra"}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold font-display">
            Welcome, {user?.name || "Pandurang Shinde"}!
          </h1>
          <p className="text-xs sm:text-sm text-amber-100/90 mt-1 max-w-xl">
            Skills: <strong className="text-white">{user?.skills?.join(", ") || "Harvesting, Crop Maintenance"}</strong> • Base Rate: <strong>₹{user?.expectedDailyWage || 450}/day</strong>
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
          <div className="text-center px-4 border-r border-white/10">
            <div className="text-xs text-amber-200">Total Work Days</div>
            <div className="text-xl font-extrabold text-white font-mono">{stats.completedJobsCount} Days</div>
          </div>
          <div className="text-center px-4">
            <div className="text-xs text-amber-200">Est. Total Earnings</div>
            <div className="text-xl font-extrabold text-white font-mono">₹{stats.estimatedTotalEarnings?.toLocaleString('en-IN')}</div>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Open Farm Jobs"
          value={stats.totalJobsAvailable}
          subtitle="Matching your district & skills"
          icon={Briefcase}
          color="amber"
        />
        <MetricCard
          title="My Applications"
          value={stats.appliedJobsCount}
          subtitle={`${stats.acceptedJobsCount} Accepted / Confirmed`}
          icon={CheckCircle2}
          color="emerald"
        />
        <MetricCard
          title="Expected Daily Wage"
          value={`₹${user?.expectedDailyWage || 450}`}
          unit="/ day"
          subtitle="Direct payment by farmer"
          icon={IndianRupee}
          color="gold"
        />
        <MetricCard
          title="Labour Rating"
          value={stats.rating}
          unit="/ 5.0"
          subtitle="Based on verified farmer reviews"
          icon={Star}
          color="indigo"
        />
      </div>

      {appliedSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{appliedSuccessMsg}</span>
          </div>
          <button onClick={() => setAppliedSuccessMsg("")} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
        </div>
      )}

      {/* Available Jobs Section (Requirement #8) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
              Live Hiring Feed
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 font-display mt-1">
              Available Farm Jobs in Your Area
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Filter by crop / activity..."
                value={searchCrop}
                onChange={(e) => setSearchCrop(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-amber-500 w-48 sm:w-64"
              />
            </div>
          </div>
        </div>

        {/* Job Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                      {job.crop}
                    </span>
                    <h3 className="font-bold text-base text-slate-900 font-display mt-1.5">{job.activity}</h3>
                    <p className="text-xs text-slate-500 font-medium">{job.farmName || job.farmerName}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-extrabold text-amber-700 font-display">₹{job.dailyWageOffered}</div>
                    <span className="text-[10px] text-slate-400 font-semibold">/ Day</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-3 leading-relaxed line-clamp-3">
                  {job.description}
                </p>

                {/* Job Specs */}
                <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{job.workersRequired} Workers</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{job.durationDays} Days Duration</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Start: {job.startDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="truncate">{job.location}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500">
                  {job.applicantsCount || 0} applicants so far
                </span>
                <button
                  onClick={() => handleOpenApply(job)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Apply for Job</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Apply Modal */}
      <Modal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        title={`Apply for ${selectedJobForApply?.activity} (${selectedJobForApply?.crop})`}
      >
        {selectedJobForApply && (
          <form onSubmit={handleConfirmApply} className="space-y-4">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-slate-900">{selectedJobForApply.farmName}</span>
                <span className="font-bold text-amber-800">Offered: ₹{selectedJobForApply.dailyWageOffered}/day</span>
              </div>
              <p className="text-xs text-slate-600">{selectedJobForApply.location} • Starts: {selectedJobForApply.startDate} ({selectedJobForApply.durationDays} Days)</p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Your Expected Daily Wage (₹)
              </label>
              <input
                type="number"
                step="20"
                required
                value={applyForm.wageExpected}
                onChange={(e) => setApplyForm({ ...applyForm, wageExpected: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Message to Farmer / Experience Note
              </label>
              <textarea
                rows="3"
                value={applyForm.note}
                onChange={(e) => setApplyForm({ ...applyForm, note: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setApplyModalOpen(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={applying}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-md transition-all flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{applying ? "Submitting Application..." : "Submit Job Application"}</span>
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
