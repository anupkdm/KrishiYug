import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Wallet, Calendar, CheckCircle2, Star, IndianRupee, TrendingUp, Award, Clock } from "lucide-react";
import { MetricCard } from "../../components/common/MetricCard";

export const MyWorkTab = () => {
  const { user } = useAuth();

  const workHistory = [
    {
      id: "work-1",
      farmName: "Patil Organic & Grain Farm",
      farmerName: "Ramesh Patil",
      location: "Niphad, Nashik",
      activity: "Soybean Pod Harvesting & Threshing",
      crop: "Soybean",
      daysWorked: 3,
      dailyWage: 480,
      totalEarned: 1440,
      completionDate: "2026-08-20",
      ratingGiven: 5.0,
      farmerFeedback: "Extremely hardworking and punctual. Fast harvest speed."
    },
    {
      id: "work-2",
      farmName: "Godavari Grape Orchards",
      farmerName: "Sachin Kulkarni",
      location: "Dindori, Nashik",
      activity: "Grape Canopy Pruning & Tying",
      crop: "Grapes",
      daysWorked: 5,
      dailyWage: 500,
      totalEarned: 2500,
      completionDate: "2026-08-12",
      ratingGiven: 4.9,
      farmerFeedback: "Very skilled with pruning shears. Zero vine damage."
    },
    {
      id: "work-3",
      farmName: "Malwa Agri Fields",
      farmerName: "Rajesh Sharma",
      location: "Sanwer, Indore",
      activity: "Onion Seedling Transplantation",
      crop: "Onion",
      daysWorked: 4,
      dailyWage: 450,
      totalEarned: 1800,
      completionDate: "2026-07-28",
      ratingGiven: 4.8,
      farmerFeedback: "Good team worker."
    }
  ];

  const totalDays = workHistory.reduce((acc, curr) => acc + curr.daysWorked, 47);
  const totalEarnings = workHistory.reduce((acc, curr) => acc + curr.totalEarned, 21150);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-0.5 rounded-full border border-amber-200">
            Earnings Ledger & Work Log
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 font-display mt-1">
            My Work Assignments & Completed Jobs
          </h1>
        </div>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Total Days Worked"
          value={`${totalDays} Days`}
          subtitle="Seasonal cumulative farm days"
          icon={Calendar}
          color="amber"
        />
        <MetricCard
          title="Total Income Earned"
          value={`₹${totalEarnings.toLocaleString('en-IN')}`}
          subtitle="Direct wage payments received"
          icon={Wallet}
          color="emerald"
          trend="up"
          trendValue="Verified"
        />
        <MetricCard
          title="Average Employer Rating"
          value={user?.rating || 4.9}
          unit="/ 5.0"
          subtitle="Top 5% rated worker in Nashik district"
          icon={Star}
          color="gold"
        />
      </div>

      {/* Work History Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-slate-900 font-display">Completed Farm Work Assignments</h2>
        
        <div className="space-y-4">
          {workHistory.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                    {item.crop}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900">{item.activity}</h3>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  <strong>{item.farmName}</strong> ({item.farmerName}) • {item.location}
                </p>
                <p className="text-xs text-slate-500 italic mt-2">
                  Feedback: "{item.farmerFeedback}"
                </p>
              </div>

              <div className="text-right flex md:flex-col items-center md:items-end justify-between">
                <div className="text-sm font-extrabold text-emerald-700 font-display">
                  ₹{item.totalEarned?.toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-slate-400">
                  {item.daysWorked} days @ ₹{item.dailyWage}/day
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-amber-600 mt-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{item.ratingGiven}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
