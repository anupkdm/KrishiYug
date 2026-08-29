import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import { 
  Tractor, 
  Search, 
  Filter, 
  MapPin, 
  CheckCircle2, 
  X, 
  Phone, 
  Calendar, 
  IndianRupee, 
  Sparkles, 
  PlusCircle,
  Eye,
  Send,
  Fuel,
  Info,
  ShieldCheck,
  Zap
} from "lucide-react";
import confetti from "canvas-confetti";

export const MachineryTab = () => {
  const { user } = useAuth();
  const [activeMobileTab, setActiveMobileTab] = useState("rent"); // "rent" | "provide"
  
  // Search & Filter State (TO RENT)
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterLocation, setFilterLocation] = useState("All");
  const [filterRentRange, setFilterRentRange] = useState("All");

  // Provide Machine Form State
  const [provideForm, setProvideForm] = useState({
    name: "Tractor",
    ownerName: user?.name || "Rahul Patil",
    modelNumber: "Mahindra 575 DI",
    machineType: "Tractor",
    rentPerAcre: "1200",
    rentPerHectare: "2965",
    location: user?.location ? `${user.location.village || 'Niphad'}, ${user.location.district || 'Nashik'}` : "Niphad, Nashik",
    availability: "Available",
    phone: user?.phone || "+91 98231 45678"
  });
  const [submittingProvide, setSubmittingProvide] = useState(false);
  const [provideSuccessMsg, setProvideSuccessMsg] = useState("");

  // Details Modal State
  const [detailsMachine, setDetailsMachine] = useState(null);

  // Rent Now Modal State
  const [rentMachine, setRentMachine] = useState(null);
  const [rentForm, setRentForm] = useState({
    acres: "5",
    bookingDate: new Date().toISOString().split("T")[0],
    phone: user?.phone || "+91 98231 45678",
    notes: "Requires operator for field preparation"
  });
  const [submittingRent, setSubmittingRent] = useState(false);
  const [rentSuccessMsg, setRentSuccessMsg] = useState("");

  // Initial Seed Machines Matching User Spec
  const INITIAL_MACHINES = [
    {
      id: "mach-1",
      name: "Tractor",
      ownerName: "Rahul Patil",
      modelNumber: "Mahindra 575 DI",
      machineType: "Tractor",
      rentPerAcre: 1200,
      rentPerHectare: 2965,
      location: "Niphad, Nashik",
      availability: "Available",
      phone: "+91 98231 45678",
      capacity: "45 HP / 4-Cylinder",
      fuel: "Diesel",
      suitableFor: ["Ploughing", "Tillage", "Haulage", "Rotavator Operation"],
      rating: 4.9
    },
    {
      id: "mach-2",
      name: "Rotavator",
      ownerName: "Amit Sharma",
      modelNumber: "Shaktiman SRT-200",
      machineType: "Rotavator",
      rentPerAcre: 900,
      rentPerHectare: 2224,
      location: "Lasalgaon, Nashik",
      availability: "Available",
      phone: "+91 97654 88990",
      capacity: "6ft / 42 L-Blades",
      fuel: "Tractor PTO Driven",
      suitableFor: ["Seedbed Preparation", "Stubble Incorporation", "Soil Aeration"],
      rating: 4.8
    },
    {
      id: "mach-3",
      name: "Combine Harvester",
      ownerName: "Ganesh Kadam",
      modelNumber: "Preet 987 Self-Propelled",
      machineType: "Harvester",
      rentPerAcre: 1800,
      rentPerHectare: 4448,
      location: "Dindori, Nashik",
      availability: "Available",
      phone: "+91 98233 44556",
      capacity: "101 HP / 4.2m Cutter Bar",
      fuel: "Diesel",
      suitableFor: ["Soybean", "Wheat", "Paddy (Rice)", "Gram Harvesting"],
      rating: 4.9
    },
    {
      id: "mach-4",
      name: "Agricultural Drone Sprayer",
      ownerName: "Kiran Waghmare",
      modelNumber: "IoTech Agri 16L Drone",
      machineType: "Drone Sprayer",
      rentPerAcre: 450,
      rentPerHectare: 1112,
      location: "Panchavati, Nashik",
      availability: "Available",
      phone: "+91 97654 33210",
      capacity: "16 Litre Tank / DGCA Certified",
      fuel: "Battery Powered",
      suitableFor: ["Nano Urea", "Pesticide Spraying", "Foliar Nutrition"],
      rating: 5.0
    },
    {
      id: "mach-5",
      name: "Power Tiller & Cultivator",
      ownerName: "Sanjay Shinde",
      modelNumber: "VST Shakti 130 DI",
      machineType: "Power Tiller",
      rentPerAcre: 750,
      rentPerHectare: 1853,
      location: "Sinnar, Nashik",
      availability: "Available",
      phone: "+91 98600 55678",
      capacity: "13 HP Engine",
      fuel: "Diesel",
      suitableFor: ["Inter-cultivation", "Orchards", "Vegetable Beds"],
      rating: 4.7
    }
  ];

  const [machines, setMachines] = useState(() => {
    try {
      const saved = localStorage.getItem("krishi_machinery_items");
      return saved ? JSON.parse(saved) : INITIAL_MACHINES;
    } catch (e) {
      return INITIAL_MACHINES;
    }
  });

  // Save to LocalStorage whenever machines state changes
  useEffect(() => {
    try {
      localStorage.setItem("krishi_machinery_items", JSON.stringify(machines));
    } catch (e) {}
  }, [machines]);

  // Handle Rent Per Acre Change to auto-calculate Rent Per Hectare
  const handleRentAcreChange = (val) => {
    const acreNum = parseFloat(val) || 0;
    const hectareCalc = Math.round(acreNum * 2.47105);
    setProvideForm(prev => ({
      ...prev,
      rentPerAcre: val,
      rentPerHectare: hectareCalc.toString()
    }));
  };

  // Handle Add Machine (PROVIDE)
  const handleAddMachine = (e) => {
    e.preventDefault();
    if (!provideForm.name || !provideForm.ownerName || !provideForm.rentPerAcre) {
      alert("Please fill in the required machine name, owner name, and rent.");
      return;
    }

    setSubmittingProvide(true);
    const newMachine = {
      id: `mach-${Date.now()}`,
      name: provideForm.name,
      ownerName: provideForm.ownerName,
      modelNumber: provideForm.modelNumber || "Standard 2026 Model",
      machineType: provideForm.machineType || provideForm.name,
      rentPerAcre: parseFloat(provideForm.rentPerAcre) || 1000,
      rentPerHectare: parseFloat(provideForm.rentPerHectare) || 2471,
      location: provideForm.location || "Niphad, Nashik",
      availability: provideForm.availability || "Available",
      phone: provideForm.phone || "+91 98000 00000",
      capacity: "Standard Agricultural Specification",
      fuel: "Diesel",
      suitableFor: ["Agricultural Operations", "Field Preparation"],
      rating: 5.0,
      createdAt: new Date().toISOString()
    };

    setTimeout(() => {
      setMachines(prev => [newMachine, ...prev]);
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      setProvideSuccessMsg(`🎉 Machine "${newMachine.name}" (${newMachine.modelNumber}) added to rental portal successfully!`);
      setSubmittingProvide(false);
      
      // Reset form
      setProvideForm(prev => ({
        ...prev,
        modelNumber: "",
        rentPerAcre: "",
        rentPerHectare: ""
      }));
    }, 400);
  };

  // Handle Rent Now Submission
  const handleConfirmRent = (e) => {
    e.preventDefault();
    setSubmittingRent(true);

    setTimeout(() => {
      confetti({ particleCount: 50, spread: 60 });
      setRentSuccessMsg(`Booking request sent to owner ${rentMachine.ownerName} for ${rentMachine.name}!`);
      setSubmittingRent(false);
      setRentMachine(null);
    }, 600);
  };

  // Filtered Machines for TO RENT
  const filteredMachines = machines.filter(m => {
    // 1. Search Query (name, model, owner)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = m.name && m.name.toLowerCase().includes(q);
      const matchModel = m.modelNumber && m.modelNumber.toLowerCase().includes(q);
      const matchOwner = m.ownerName && m.ownerName.toLowerCase().includes(q);
      const matchLoc = m.location && m.location.toLowerCase().includes(q);
      if (!matchName && !matchModel && !matchOwner && !matchLoc) return false;
    }

    // 2. Machine Type Filter
    if (filterType !== "All") {
      if (m.machineType && !m.machineType.toLowerCase().includes(filterType.toLowerCase()) && !m.name.toLowerCase().includes(filterType.toLowerCase())) {
        return false;
      }
    }

    // 3. Location Filter
    if (filterLocation !== "All") {
      if (m.location && !m.location.toLowerCase().includes(filterLocation.toLowerCase())) {
        return false;
      }
    }

    // 4. Rent Range Filter
    if (filterRentRange !== "All") {
      const max = parseFloat(filterRentRange);
      if (m.rentPerAcre > max) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6 pb-12 font-sans max-w-[1560px] mx-auto">
      {/* 1. TOP HEADER */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🚜</span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight font-display">
              MACHINE AVAILABILITY
            </h1>
          </div>
          <p className="text-sm font-semibold text-slate-600 mt-1">
            Find, rent and provide agricultural machines
          </p>
        </div>

        {/* Mobile View Toggle */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl md:hidden self-start">
          <button
            onClick={() => setActiveMobileTab("rent")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeMobileTab === "rent" ? "bg-emerald-700 text-white shadow-sm" : "text-slate-600"
            }`}
          >
            TO RENT ({filteredMachines.length})
          </button>
          <button
            onClick={() => setActiveMobileTab("provide")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeMobileTab === "provide" ? "bg-emerald-700 text-white shadow-sm" : "text-slate-600"
            }`}
          >
            ➕ PROVIDE
          </button>
        </div>
      </div>

      {/* Success Messages */}
      {provideSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{provideSuccessMsg}</span>
          </div>
          <button onClick={() => setProvideSuccessMsg("")} className="text-slate-400 hover:text-slate-700 font-bold p-1">✕</button>
        </div>
      )}

      {rentSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{rentSuccessMsg}</span>
          </div>
          <button onClick={() => setRentSuccessMsg("")} className="text-slate-400 hover:text-slate-700 font-bold p-1">✕</button>
        </div>
      )}

      {/* 2. TWO-COLUMN SPLIT: [ TO RENT ] (Left) and [ PROVIDE ] (Right) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* ================= LEFT COLUMN: TO RENT ================= */}
        <div className={`md:col-span-7 space-y-5 ${activeMobileTab === "provide" ? "hidden md:block" : "block"}`}>
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">🚜</span>
                <h2 className="text-lg font-black text-slate-900 font-display">
                  TO RENT
                </h2>
              </div>
              <span className="text-xs font-bold text-slate-500">
                {filteredMachines.length} Machines Available
              </span>
            </div>

            {/* 🔍 Search Machines */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500">
                🔍 Search Machines
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search machine name, model or owner (e.g. Tractor, Mahindra, Rahul)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-10 py-2.5 rounded-2xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
              </div>
            </div>

            {/* ⚙ Filter Section */}
            <div className="space-y-1.5 pt-1">
              <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <Filter className="w-3 h-3 text-slate-400" />
                <span>⚙ Filter</span>
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* Machine Type Filter */}
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 text-slate-700"
                >
                  <option value="All">Machine Type ▼ (All)</option>
                  <option value="Tractor">Tractor</option>
                  <option value="Rotavator">Rotavator</option>
                  <option value="Harvester">Harvester</option>
                  <option value="Drone Sprayer">Drone Sprayer</option>
                  <option value="Power Tiller">Power Tiller</option>
                </select>

                {/* Location Filter */}
                <select
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 text-slate-700"
                >
                  <option value="All">Location ▼ (All)</option>
                  <option value="Niphad">Niphad</option>
                  <option value="Lasalgaon">Lasalgaon</option>
                  <option value="Nashik">Nashik</option>
                  <option value="Dindori">Dindori</option>
                  <option value="Sinnar">Sinnar</option>
                </select>

                {/* Rent Range Filter */}
                <select
                  value={filterRentRange}
                  onChange={(e) => setFilterRentRange(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 text-slate-700"
                >
                  <option value="All">Rent Range ▼ (All)</option>
                  <option value="800">Up to ₹800/Acre</option>
                  <option value="1200">Up to ₹1,200/Acre</option>
                  <option value="2000">Up to ₹2,000/Acre</option>
                </select>
              </div>
            </div>
          </div>

          {/* Machine Cards List */}
          <div className="space-y-4">
            {filteredMachines.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-slate-200">
                <Tractor className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <h3 className="font-bold text-sm text-slate-800">No Machines Found</h3>
                <p className="text-xs text-slate-500 mt-1">Try changing your search or filter criteria.</p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setFilterType("All");
                    setFilterLocation("All");
                    setFilterRentRange("All");
                  }}
                  className="mt-3 px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              filteredMachines.map((machine) => (
                <div
                  key={machine.id}
                  className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all space-y-4"
                >
                  {/* Top Line: Name & Availability */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 text-2xl flex items-center justify-center shadow-inner shrink-0">
                        🚜
                      </div>
                      <div>
                        <h3 className="font-black text-base text-slate-900 font-display">
                          {machine.name}
                        </h3>
                        <p className="text-xs font-semibold text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{machine.location}</span>
                        </p>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{machine.availability}</span>
                    </span>
                  </div>

                  {/* Machine Details Table/List */}
                  <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-200/80 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-500">Owner:</span>
                      <span className="font-black text-slate-900">{machine.ownerName}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-500">Model No.:</span>
                      <span className="font-bold text-slate-800 font-mono">{machine.modelNumber}</span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                      <span className="font-bold text-slate-500">Rent / Acre:</span>
                      <span className="font-black text-emerald-700 text-sm">
                        ₹{machine.rentPerAcre?.toLocaleString('en-IN')} / Acre
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-500">Rent / Hectare:</span>
                      <span className="font-bold text-slate-700">
                        ₹{machine.rentPerHectare?.toLocaleString('en-IN')} / Hectare
                      </span>
                    </div>
                  </div>

                  {/* Buttons: [ View Details ] [ Rent Now ] */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <button
                      onClick={() => setDetailsMachine(machine)}
                      className="py-2.5 px-4 rounded-xl border border-slate-300 hover:border-emerald-600 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 font-black text-xs transition-all flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-emerald-600" />
                      <span>View Details</span>
                    </button>

                    <button
                      onClick={() => {
                        setRentMachine(machine);
                        setRentForm(prev => ({ ...prev, acres: "5" }));
                      }}
                      className="py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-700/30 hover:scale-[1.02]"
                    >
                      <span>Rent Now</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>


        {/* ================= RIGHT COLUMN: PROVIDE ================= */}
        <div className={`md:col-span-5 ${activeMobileTab === "rent" ? "hidden md:block" : "block"}`}>
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5 sticky top-20">
            {/* Header */}
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">➕</span>
                <h2 className="text-lg font-black text-slate-900 font-display">
                  Provide Your Machine
                </h2>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                Rent Out
              </span>
            </div>

            <p className="text-xs font-semibold text-slate-500 leading-relaxed">
              Earn rental income by registering your tractor, harvester, rotavator, or drone for neighboring farmers.
            </p>

            {/* Registration Form */}
            <form onSubmit={handleAddMachine} className="space-y-3.5">
              {/* Machine Name */}
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1">
                  Machine Name *
                </label>
                <select
                  value={provideForm.name}
                  onChange={(e) => {
                    setProvideForm({ ...provideForm, name: e.target.value, machineType: e.target.value });
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="Tractor">Tractor</option>
                  <option value="Rotavator">Rotavator</option>
                  <option value="Combine Harvester">Combine Harvester</option>
                  <option value="Agricultural Drone Sprayer">Agricultural Drone Sprayer</option>
                  <option value="Power Tiller">Power Tiller</option>
                  <option value="Multi-Crop Thresher">Multi-Crop Thresher</option>
                  <option value="Seed Drill & Planter">Seed Drill & Planter</option>
                  <option value="Cultivator">Cultivator</option>
                </select>
              </div>

              {/* Owner Name */}
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1">
                  Owner Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Patil"
                  value={provideForm.ownerName}
                  onChange={(e) => setProvideForm({ ...provideForm, ownerName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Model Number */}
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1">
                  Model No. *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mahindra 575 DI / Shaktiman SRT-200"
                  value={provideForm.modelNumber}
                  onChange={(e) => setProvideForm({ ...provideForm, modelNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              {/* Rent per Acre & Hectare */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1">
                    Rent / Acre (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="1200"
                    value={provideForm.rentPerAcre}
                    onChange={(e) => handleRentAcreChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:ring-2 focus:ring-emerald-500 font-mono text-emerald-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1">
                    Rent / Hectare (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="2965"
                    value={provideForm.rentPerHectare}
                    onChange={(e) => setProvideForm({ ...provideForm, rentPerHectare: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:ring-2 focus:ring-emerald-500 font-mono text-slate-700 bg-slate-50"
                  />
                </div>
              </div>

              {/* Availability Radio Option */}
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1">
                  Availability *
                </label>
                <div className="flex items-center gap-4 pt-1">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                    <input
                      type="radio"
                      name="availability"
                      value="Available"
                      checked={provideForm.availability === "Available"}
                      onChange={(e) => setProvideForm({ ...provideForm, availability: e.target.value })}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>🟢 Available</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                    <input
                      type="radio"
                      name="availability"
                      value="Not Available"
                      checked={provideForm.availability === "Not Available"}
                      onChange={(e) => setProvideForm({ ...provideForm, availability: e.target.value })}
                      className="text-rose-600 focus:ring-rose-500"
                    />
                    <span>🔴 Not Available</span>
                  </label>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1">
                  Location (Village, District) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Niphad, Nashik"
                  value={provideForm.location}
                  onChange={(e) => setProvideForm({ ...provideForm, location: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submittingProvide}
                className="w-full py-3.5 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs shadow-md shadow-emerald-700/30 transition-all flex items-center justify-center gap-2 mt-2 hover:scale-[1.01]"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{submittingProvide ? "Adding..." : "+ ADD MACHINE"}</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* 3. VIEW DETAILS MODAL */}
      {detailsMachine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 sm:p-7 space-y-5 animate-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 text-2xl flex items-center justify-center">
                  🚜
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {detailsMachine.availability}
                  </span>
                  <h3 className="text-xl font-black text-slate-900 font-display mt-0.5">
                    {detailsMachine.name}
                  </h3>
                  <p className="text-xs font-bold text-slate-500 font-mono">
                    Model: {detailsMachine.modelNumber}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setDetailsMachine(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="text-[10px] font-bold uppercase text-slate-400">Owner</div>
                <div className="font-black text-slate-900 mt-0.5">{detailsMachine.ownerName}</div>
                <div className="text-[11px] text-slate-500">{detailsMachine.phone}</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="text-[10px] font-bold uppercase text-slate-400">Location</div>
                <div className="font-black text-slate-900 mt-0.5">{detailsMachine.location}</div>
                <div className="text-[11px] text-emerald-700 font-bold">Verified Provider ✓</div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                <div className="text-[10px] font-bold uppercase text-emerald-800">Rent per Acre</div>
                <div className="text-base font-black text-emerald-900 mt-0.5">
                  ₹{detailsMachine.rentPerAcre} / Acre
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                <div className="text-[10px] font-bold uppercase text-emerald-800">Rent per Hectare</div>
                <div className="text-base font-black text-emerald-900 mt-0.5">
                  ₹{detailsMachine.rentPerHectare} / Hectare
                </div>
              </div>
            </div>

            {/* Suitable Operations */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
              <div className="text-[10px] font-bold uppercase text-slate-500">Suitable Operations & Features:</div>
              <div className="flex flex-wrap gap-1">
                {(detailsMachine.suitableFor || ["Tillage", "Harvesting", "Spraying"]).map((s, idx) => (
                  <span key={idx} className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 font-semibold text-[11px]">
                    ✓ {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <a
                href={`tel:${detailsMachine.phone}`}
                className="py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 font-black text-xs flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>Call Owner</span>
              </a>

              <button
                onClick={() => {
                  const m = detailsMachine;
                  setDetailsMachine(null);
                  setRentMachine(m);
                }}
                className="py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-700/30"
              >
                <span>Rent This Machine</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. RENT NOW MODAL */}
      {rentMachine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 sm:p-7 space-y-5 animate-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🤝</span>
                <div>
                  <h3 className="text-lg font-black text-slate-900 font-display">
                    Rent {rentMachine.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    Owner: {rentMachine.ownerName} ({rentMachine.modelNumber})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setRentMachine(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmRent} className="space-y-4">
              {/* Field Acreage */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                  Farm Area to Work (Acres) *
                </label>
                <input
                  type="number"
                  step="0.5"
                  required
                  min="0.5"
                  value={rentForm.acres}
                  onChange={(e) => setRentForm({ ...rentForm, acres: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              {/* Booking Date */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                  Required Date *
                </label>
                <input
                  type="date"
                  required
                  value={rentForm.bookingDate}
                  onChange={(e) => setRentForm({ ...rentForm, bookingDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Total Calculation Preview */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-black uppercase text-emerald-800">
                    Rate: ₹{rentMachine.rentPerAcre} / Acre
                  </div>
                  <div className="text-xs text-emerald-700 font-bold mt-0.5">
                    For {rentForm.acres || 0} Acre(s)
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] font-black uppercase text-emerald-800">Estimated Total</div>
                  <div className="text-lg font-black text-emerald-900 font-display">
                    ₹{Math.round(rentMachine.rentPerAcre * (parseFloat(rentForm.acres) || 0)).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRentMachine(null)}
                  className="py-3 px-4 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submittingRent}
                  className="py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-700/30"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submittingRent ? "Booking..." : "Confirm Rental"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
