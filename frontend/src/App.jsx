import React, { useState } from "react";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { SimulationProvider } from "./context/SimulationContext";
import { Navbar } from "./components/layout/Navbar";
import { Sidebar } from "./components/layout/Sidebar";
import { Footer } from "./components/layout/Footer";
import { X, Sprout } from "lucide-react";

// Pages
import { LandingPage } from "./pages/LandingPage";
import { FarmerAuth } from "./pages/auth/FarmerAuth";
import { LabourAuth } from "./pages/auth/LabourAuth";

// Farmer Tabs
import { FarmerDashboardHome } from "./pages/farmer/FarmerDashboardHome";
import { LabourHiringTab } from "./pages/farmer/LabourHiringTab";
import { MachineryTab } from "./pages/farmer/MachineryTab";
import { SchemesTab } from "./pages/farmer/SchemesTab";
import { MarketIntelligenceTab } from "./pages/farmer/MarketIntelligenceTab";
import { AIFarmAdvisorTab } from "./pages/farmer/AIFarmAdvisorTab";
import { FarmerProfileTab } from "./pages/farmer/FarmerProfileTab";

// Labour Tabs
import { LabourDashboardHome } from "./pages/labour/LabourDashboardHome";
import { MyApplicationsTab } from "./pages/labour/MyApplicationsTab";
import { MyWorkTab } from "./pages/labour/MyWorkTab";
import { LabourProfileTab } from "./pages/labour/LabourProfileTab";

// Shared Tabs
import { NotificationsTab } from "./pages/NotificationsTab";
import { PresentationMode } from "./pages/PresentationMode";

const AppContent = () => {
  const { isAuthenticated, isFarmer, isLabour, loading } = useAuth();
  const [currentView, setCurrentView] = useState("landing"); // "landing" | "farmer-login" | "farmer-register" | "labour-login" | "labour-register"
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold tracking-wide uppercase font-display text-emerald-400">
            Initializing Krishi Intelligence Decision Systems...
          </p>
        </div>
      </div>
    );
  }

  // Hackathon Presentation Mode Full-screen overlay
  if (isPresentationOpen) {
    return <PresentationMode onExit={() => setIsPresentationOpen(false)} />;
  }

  // Unauthenticated Views
  if (!isAuthenticated) {
    if (currentView === "farmer-login") {
      return (
        <FarmerAuth
          initialMode="login"
          onBack={() => setCurrentView("landing")}
          onSuccess={() => setCurrentTab("dashboard")}
        />
      );
    }
    if (currentView === "farmer-register") {
      return (
        <FarmerAuth
          initialMode="register"
          onBack={() => setCurrentView("landing")}
          onSuccess={() => setCurrentTab("dashboard")}
        />
      );
    }
    if (currentView === "labour-login") {
      return (
        <LabourAuth
          initialMode="login"
          onBack={() => setCurrentView("landing")}
          onSuccess={() => setCurrentTab("dashboard")}
        />
      );
    }
    if (currentView === "labour-register") {
      return (
        <LabourAuth
          initialMode="register"
          onBack={() => setCurrentView("landing")}
          onSuccess={() => setCurrentTab("dashboard")}
        />
      );
    }

    return (
      <LandingPage
        onSelectAuth={(view) => setCurrentView(view)}
      />
    );
  }

  // Authenticated Portal Views
  const handleNavigate = (tab) => {
    if (tab === "presentation") {
      setIsPresentationOpen(true);
      return;
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderFarmerContent = () => {
    switch (currentTab) {
      case "dashboard":
        return <FarmerDashboardHome onNavigate={handleNavigate} />;
      case "labour-hiring":
        return <LabourHiringTab />;
      case "machinery":
        return <MachineryTab />;
      case "schemes":
        return <SchemesTab />;
      case "market":
        return <MarketIntelligenceTab />;
      case "ai-advisor":
        return <AIFarmAdvisorTab />;
      case "notifications":
        return <NotificationsTab />;
      case "profile":
        return <FarmerProfileTab />;
      default:
        return <FarmerDashboardHome onNavigate={handleNavigate} />;
    }
  };

  const renderLabourContent = () => {
    switch (currentTab) {
      case "dashboard":
        return <LabourDashboardHome onNavigate={handleNavigate} />;
      case "available-jobs":
        return <LabourDashboardHome onNavigate={handleNavigate} />;
      case "my-applications":
        return <MyApplicationsTab />;
      case "my-work":
        return <MyWorkTab />;
      case "notifications":
        return <NotificationsTab />;
      case "profile":
        return <LabourProfileTab />;
      default:
        return <LabourDashboardHome onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar 
        onNavigate={handleNavigate} 
        currentTab={currentTab} 
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />
      
      {/* Mobile Sidebar Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-300">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 font-display font-black text-slate-900 text-base">
                <span className="text-lg">🌱</span>
                <span>KrishiMitra</span>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
                aria-label="Close Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <Sidebar 
                currentTab={currentTab} 
                onNavigate={(tab) => {
                  handleNavigate(tab);
                  setIsMobileMenuOpen(false);
                }} 
                isMobile
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Layout Area - Wide, Spacious & Perfectly Aligned */}
      <div className="flex-1 flex w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        <Sidebar currentTab={currentTab} onNavigate={handleNavigate} />
        
        <main className="flex-1 min-w-0">
          {isFarmer && renderFarmerContent()}
          {isLabour && renderLabourContent()}
        </main>
      </div>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <SimulationProvider>
          <AppContent />
        </SimulationProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
