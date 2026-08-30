import React, { useState } from "react";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { SimulationProvider } from "./context/SimulationContext";
import { OfflineSyncProvider } from "./context/OfflineSyncContext";
import { DisasterResilienceBar } from "./components/common/DisasterResilienceBar";
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
import { PresentationMode } from "./pages/PresentationMode";

const AppContent = () => {
  const { isAuthenticated, isFarmer, isLabour, loading } = useAuth();
  const [currentView, setCurrentView] = useState("landing"); // "landing" | "farmer-login" | "farmer-register" | "labour-login" | "labour-register"
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleToggleSidebar = () => {
    if (window.innerWidth < 768) {
      setIsMobileMenuOpen(prev => !prev);
    } else {
      setIsSidebarOpen(prev => !prev);
    }
  };

  const handleNavigate = (tabId) => {
    if (tabId === "presentation") {
      setIsPresentationOpen(true);
      return;
    }
    setCurrentTab(tabId);
  };

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

  const handleAuthSuccess = () => {
    setCurrentTab("dashboard");
    setCurrentView("landing");
  };

  // Unauthenticated Views
  if (!isAuthenticated) {
    if (currentView === "farmer-login") {
      return (
        <FarmerAuth
          initialMode="login"
          onBack={() => setCurrentView("landing")}
          onSuccess={handleAuthSuccess}
        />
      );
    }
    if (currentView === "farmer-register") {
      return (
        <FarmerAuth
          initialMode="register"
          onBack={() => setCurrentView("landing")}
          onSuccess={handleAuthSuccess}
        />
      );
    }
    if (currentView === "labour-login") {
      return (
        <LabourAuth
          initialMode="login"
          onBack={() => setCurrentView("landing")}
          onSuccess={handleAuthSuccess}
        />
      );
    }
    if (currentView === "labour-register") {
      return (
        <LabourAuth
          initialMode="register"
          onBack={() => setCurrentView("landing")}
          onSuccess={handleAuthSuccess}
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
      case "my-applications":
        return <MyApplicationsTab onNavigate={handleNavigate} />;
      case "my-work":
        return <MyWorkTab />;
      case "profile":
        return <LabourProfileTab />;
      default:
        return <LabourDashboardHome onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar 
        onPresentationClick={() => setIsPresentationOpen(true)}
        onToggleSidebar={handleToggleSidebar}
      />
      
      {/* Mobile Slide-over Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden animate-in fade-in duration-200">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Slide-in Navigation Panel */}
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl z-50 flex flex-col transform transition-transform ease-in-out duration-300">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  <Sprout className="w-5 h-5 text-white" />
                </div>
                <span className="font-extrabold text-sm text-slate-900">Navigation Menu</span>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              <Sidebar 
                currentTab={currentTab} 
                onNavigate={(tab) => {
                  handleNavigate(tab);
                  setIsMobileMenuOpen(false);
                }} 
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Layout Area - Wide, Spacious & Perfectly Aligned */}
      <div className="flex-1 flex w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6 transition-all duration-300">
        <div className={`hidden md:block transition-all duration-300 ease-in-out origin-left ${
          isSidebarOpen 
            ? "w-64 lg:w-72 opacity-100 translate-x-0 shrink-0" 
            : "w-0 opacity-0 -translate-x-12 pointer-events-none overflow-hidden m-0 p-0 shrink-0"
        }`}>
          <Sidebar currentTab={currentTab} onNavigate={handleNavigate} />
        </div>
        
        <main className="flex-1 min-w-0 transition-all duration-300">
          {isFarmer && renderFarmerContent()}
          {isLabour && renderLabourContent()}
        </main>
      </div>

      <Footer onNavigate={handleNavigate} />
      
      {/* Real-time Disaster Resilience & Recovery Demo Controller */}
      <DisasterResilienceBar />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <SimulationProvider>
          <OfflineSyncProvider>
            <AppContent />
          </OfflineSyncProvider>
        </SimulationProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
