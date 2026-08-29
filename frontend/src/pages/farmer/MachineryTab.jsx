import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import { Badge } from "../../components/common/Badge";
import { Modal } from "../../components/common/Modal";
import { 
  Tractor, 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Calendar, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  IndianRupee,
  ShieldCheck,
  Zap,
  Phone,
  Layers
} from "lucide-react";
import confetti from "canvas-confetti";

export const MachineryTab = () => {
  const { user } = useAuth();
  const [machineryList, setMachineryList] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");

  // Recommendation Form
  const [recForm, setRecForm] = useState({
    crop: user?.farm?.primaryCrop || "Soybean",
    farmSizeAcres: user?.farm?.sizeAcres || "8.5",
    stage: "Harvesting & Maturation",
    soilType: user?.farm?.soilType || "Black Cotton Soil",
    operation: "Harvesting & Threshing"
  });

  // Booking Modal
  const [selectedMachineForBooking, setSelectedMachineForBooking] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    acreage: user?.farm?.sizeAcres || "8.5",
    bookingDate: "2026-09-10",
    contactPhone: user?.phone || "+91 98231 45678",
    notes: "Requires operator for field harvesting operation."
  });
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [machRes, recRes] = await Promise.all([
        api.getMachinery({ category: selectedCategory }),
        api.getMachineryRecommendations({
          crop: recForm.crop,
          farmSizeAcres: recForm.farmSizeAcres,
          stage: recForm.stage,
          soilType: recForm.soilType,
          operation: recForm.operation
        })
      ]);

      setMachineryList(machRes.machinery || []);
      setRecommendations(recRes.recommendations || []);
    } catch (err) {
      console.error("Machinery data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCategory]);

  const handleGenerateRecommendations = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.getMachineryRecommendations(recForm);
      setRecommendations(res.recommendations || []);
      confetti({ particleCount: 40, spread: 60 });
    } catch (err) {
      alert("Failed to generate recommendations: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenBooking = (machine) => {
    setSelectedMachineForBooking(machine);
    setBookingModalOpen(true);
    setBookingSubmitted(false);
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    setBookingSubmitted(true);
    try {
      await api.bookMachinery({
        machineryId: selectedMachineForBooking.id,
        acreage: bookingForm.acreage,
        bookingDate: bookingForm.bookingDate,
        contactPhone: bookingForm.contactPhone,
        notes: bookingForm.notes
      });

      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      setBookingSuccessMsg(`Successfully booked ${selectedMachineForBooking.name} for ${bookingForm.bookingDate}!`);
      setBookingModalOpen(false);
    } catch (err) {
      alert("Booking failed: " + err.message);
      setBookingSubmitted(false);
    }
  };

  const CATEGORIES = [
    "Tractor",
    "Harvester",
    "Rotavator",
    "Drone",
    "Seeder",
    "Sprayer",
    "Cultivator",
    "Irrigation Pump"
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-800 bg-sky-100 px-3 py-0.5 rounded-full border border-sky-200">
              Farm Machinery Intelligence
            </span>
            <span className="text-xs font-bold text-slate-400">• Custom Hiring Centre Hub</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-display mt-1">
            Machinery Availability & Recommendations
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare rental costs, calculate time and labour savings, and book nearby tractors, harvesters & drones.
          </p>
        </div>
      </div>

      {bookingSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{bookingSuccessMsg}</span>
          </div>
          <button onClick={() => setBookingSuccessMsg("")} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
        </div>
      )}

      {/* Crop-Based AI Machinery Recommendation Engine (Requirement #13) */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-400/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-display text-white">Crop-Based Machinery Recommendation Engine</h2>
            <p className="text-xs text-slate-300">Input crop stage and operation to calculate ROI, hours required & labour cost savings.</p>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleGenerateRecommendations} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
              Crop
            </label>
            <select
              value={recForm.crop}
              onChange={(e) => setRecForm({ ...recForm, crop: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-medium focus:outline-none"
            >
              <option value="Soybean" className="text-slate-900">Soybean</option>
              <option value="Wheat" className="text-slate-900">Wheat</option>
              <option value="Cotton" className="text-slate-900">Cotton</option>
              <option value="Onion" className="text-slate-900">Onion</option>
              <option value="Tomato" className="text-slate-900">Tomato</option>
              <option value="Rice" className="text-slate-900">Rice (Paddy)</option>
              <option value="Sugarcane" className="text-slate-900">Sugarcane</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
              Farm Size (Acres)
            </label>
            <input
              type="number"
              step="0.5"
              value={recForm.farmSizeAcres}
              onChange={(e) => setRecForm({ ...recForm, farmSizeAcres: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-medium focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
              Farming Stage
            </label>
            <select
              value={recForm.stage}
              onChange={(e) => setRecForm({ ...recForm, stage: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-medium focus:outline-none"
            >
              <option value="Harvesting" className="text-slate-900">Harvesting & Maturation</option>
              <option value="Sowing" className="text-slate-900">Sowing & Seedbed Preparation</option>
              <option value="Crop Protection" className="text-slate-900">Crop Protection & Spraying</option>
              <option value="Land Leveling" className="text-slate-900">Pre-sowing Land Leveling</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
              Soil Type
            </label>
            <input
              type="text"
              value={recForm.soilType}
              onChange={(e) => setRecForm({ ...recForm, soilType: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-medium focus:outline-none"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Get AI Recommendation</span>
            </button>
          </div>
        </form>

        {/* Recommendations Output Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {recommendations.map((rec) => (
            <div
              key={rec.rank}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-sky-400/20 text-sky-300 border border-sky-400/30">
                    #{rec.rank} Recommended Choice
                  </span>
                  <span className="text-xs font-bold text-emerald-400">{rec.suitabilityScore}% Fit</span>
                </div>

                <h3 className="font-bold text-sm text-white">{rec.machineName}</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">{rec.reason}</p>

                <div className="mt-4 space-y-1.5 text-xs text-slate-200">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Est. Rental Cost:</span>
                    <span className="font-bold text-white">₹{rec.estimatedRentalCost?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Time Required:</span>
                    <span className="font-bold text-white">{rec.timeRequiredHours} Hours</span>
                  </div>
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>Labour Cost Saved:</span>
                    <span>+₹{rec.netSavingsVsManual?.toLocaleString('en-IN')} ({rec.savingsPercent}%)</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] text-slate-300 font-medium">{rec.providerName}</span>
                <button
                  onClick={() => {
                    const match = machineryList.find(m => m.category === rec.category) || machineryList[0];
                    handleOpenBooking(match);
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-slate-900 hover:bg-sky-100 transition-colors"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Machinery Directory & Category Filter */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900 font-display">Available Equipment Catalog</h2>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setSelectedCategory("")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === "" ? "bg-slate-900 text-white" : "bg-white text-slate-700 border border-slate-200"
              }`}
            >
              All Equipment
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat ? "bg-slate-900 text-white" : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Machinery Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {machineryList.map((mach) => (
            <div
              key={mach.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {mach.category}
                    </span>
                    <h3 className="font-bold text-base text-slate-900 font-display">{mach.name}</h3>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 text-amber-800 text-xs font-bold">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{mach.rating}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{mach.location} (~{mach.distanceKm} km)</span>
                </p>

                <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Rental Rate:</span>
                    <span className="font-bold text-slate-900">₹{mach.rentalPricePerAcre} / acre</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Capacity:</span>
                    <span className="font-semibold text-slate-700">{mach.capacity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Provider:</span>
                    <span className="font-semibold text-slate-700 truncate max-w-[150px]">{mach.provider}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {mach.features?.map((f) => (
                    <span key={f} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-sky-50 text-sky-800 border border-sky-200/60">
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  🟢 {mach.availability}
                </span>
                <button
                  onClick={() => handleOpenBooking(mach)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-all"
                >
                  Book Machine →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      <Modal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        title={`Book Machinery: ${selectedMachineForBooking?.name}`}
      >
        {selectedMachineForBooking && (
          <form onSubmit={handleConfirmBooking} className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-slate-900">{selectedMachineForBooking.name}</span>
                <span className="font-bold text-sky-700">₹{selectedMachineForBooking.rentalPricePerAcre} / acre</span>
              </div>
              <p className="text-xs text-slate-500">{selectedMachineForBooking.provider} • {selectedMachineForBooking.location}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Acreage to Work *
                </label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={bookingForm.acreage}
                  onChange={(e) => setBookingForm({ ...bookingForm, acreage: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Preferred Date *
                </label>
                <input
                  type="date"
                  required
                  value={bookingForm.bookingDate}
                  onChange={(e) => setBookingForm({ ...bookingForm, bookingDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Contact Phone *
              </label>
              <input
                type="text"
                required
                value={bookingForm.contactPhone}
                onChange={(e) => setBookingForm({ ...bookingForm, contactPhone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs font-bold text-emerald-900">
              <span>Estimated Total Rental Cost:</span>
              <span className="text-sm">
                ₹{(parseFloat(bookingForm.acreage || 1) * selectedMachineForBooking.rentalPricePerAcre).toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setBookingModalOpen(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={bookingSubmitted}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-md transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{bookingSubmitted ? "Confirming..." : "Confirm Machinery Booking"}</span>
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
