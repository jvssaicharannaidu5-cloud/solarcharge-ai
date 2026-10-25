import React, { useState } from 'react';
import { SimulationProvider, useSimulation } from './context/SimulationContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { AiManagerPage } from './pages/AiManagerPage';
import { SimulatorPage } from './pages/SimulatorPage';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { SafetyPage } from './pages/SafetyPage';
import { ImplementationPage } from './pages/ImplementationPage';
import { InnovationPage } from './pages/InnovationPage';
import { AboutPage } from './pages/AboutPage';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('home');
  const { state } = useSimulation();

  const renderActivePage = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage setActiveTab={setActiveTab} />;
      case 'dashboard':
        return <DashboardPage setActiveTab={setActiveTab} />;
      case 'ai-manager':
        return <AiManagerPage />;
      case 'simulator':
        return <SimulatorPage />;
      case 'architecture':
        return <ArchitecturePage />;
      case 'safety':
        return <SafetyPage />;
      case 'implementation':
        return <ImplementationPage />;
      case 'innovation':
        return <InnovationPage />;
      case 'about':
        return <AboutPage />;
      default:
        return <HomePage setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col bg-[#070b14] text-slate-100 ${state.isReducedMotion ? 'no-motion' : ''}`}>
      {/* Global Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area with fluid view transition */}
      <main className="flex-1">
        {renderActivePage()}
      </main>

      {/* Global Footer */}
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
};

export function App() {
  return (
    <SimulationProvider>
      <AppContent />
    </SimulationProvider>
  );
}

export default App;
