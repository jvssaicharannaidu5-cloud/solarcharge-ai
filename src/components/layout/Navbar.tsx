import React, { useState } from 'react';
import {
  Sun,
  LayoutDashboard,
  Brain,
  Sliders,
  Network,
  ShieldAlert,
  GitBranch,
  Sparkles,
  Info,
  Menu,
  X,
  Play,
  Pause,
  RotateCcw,
  Eye,
  EyeOff,
  Zap
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export interface NavItem {
  id: string;
  label: string;
  shortLabel?: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', shortLabel: 'Home', icon: Sun },
  { id: 'dashboard', label: 'Live Energy Dashboard', shortLabel: 'Dashboard', icon: LayoutDashboard },
  { id: 'ai-manager', label: 'AI Energy Manager', shortLabel: 'AI Manager', icon: Brain },
  { id: 'simulator', label: 'Charging Simulator', shortLabel: 'Simulator', icon: Sliders },
  { id: 'architecture', label: 'System Architecture', shortLabel: 'Architecture', icon: Network },
  { id: 'safety', label: 'Safety & Efficiency', shortLabel: 'Safety', icon: ShieldAlert },
  { id: 'implementation', label: 'Project Implementation', shortLabel: 'Roadmap', icon: GitBranch },
  { id: 'innovation', label: 'Innovation & Scope', shortLabel: 'Innovation', icon: Sparkles },
  { id: 'about', label: 'About Project', shortLabel: 'About', icon: Info },
];

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { state, toggleLiveTick, toggleReducedMotion, resetSimulation } = useSimulation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/85 border-b border-slate-800/80 transition-all">
      {/* Top micro-bar for simulation controls & status beacon */}
      <div className="bg-slate-900/90 border-b border-slate-800/60 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          
          {/* Status Beacon */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="font-mono text-[11px] font-semibold text-emerald-400 tracking-wider">
                ESP32 SIMULATED TELEMETRY ONLINE
              </span>
            </div>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline font-mono text-[11px] text-slate-400">
              Solar: <strong className="text-amber-400">{state.solarGenerationKw} kW</strong> &bull; SOC: <strong className="text-emerald-400">{state.batterySoc}%</strong> &bull; EVSE: <strong className="text-cyan-400">{state.chargingDemandKw} kW</strong>
            </span>
          </div>

          {/* Quick Engine Controls */}
          <div className="flex items-center gap-2">
            {/* Auto Tick Play/Pause */}
            <button
              type="button"
              onClick={toggleLiveTick}
              className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono text-[11px] font-medium border transition-colors ${
                state.isLiveTick
                  ? 'bg-cyan-950/80 border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/50'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
              }`}
              title={state.isLiveTick ? 'Pause continuous real-time simulation tick' : 'Resume real-time simulation tick'}
            >
              {state.isLiveTick ? <Pause className="w-3 h-3 text-cyan-400" /> : <Play className="w-3 h-3 text-slate-300" />}
              <span>{state.isLiveTick ? 'Live Clock: ON' : 'Live Clock: PAUSED'}</span>
            </button>

            {/* Reduced Motion Toggle */}
            <button
              type="button"
              onClick={toggleReducedMotion}
              className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono text-[11px] font-medium border transition-colors ${
                state.isReducedMotion
                  ? 'bg-amber-950/80 border-amber-500/40 text-amber-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
              }`}
              title="Toggle particle and pulse animations (Reduced Motion mode for accessibility)"
            >
              {state.isReducedMotion ? <EyeOff className="w-3 h-3 text-amber-400" /> : <Eye className="w-3 h-3 text-slate-400" />}
              <span className="hidden md:inline">{state.isReducedMotion ? 'Motion: Reduced' : 'Motion: Full'}</span>
            </button>

            {/* Global Reset */}
            <button
              type="button"
              onClick={resetSimulation}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono text-[11px] bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-colors"
              title="Reset all simulation values and faults to default"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden md:inline">Reset</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-2.5 group text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-cyan-500 to-emerald-500 p-[1.5px] shadow-lg group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Zap className="w-5 h-5 text-electric-400 group-hover:text-amber-400 transition-colors" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-black tracking-tight text-slate-100">
                    SolarCharge<span className="text-electric-400"> AI</span>
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    PROTOTYPE
                  </span>
                </div>
                <div className="text-[10px] font-mono text-slate-400 tracking-wider">
                  SMART RENEWABLE EV MICROGRID
                </div>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all relative ${
                    isActive
                      ? 'text-cyan-300 bg-cyan-950/60 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60 border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.shortLabel || item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Button & Mobile Menu Toggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('simulator')}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 shadow-md shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sliders className="w-3.5 h-3.5 text-slate-950" />
              <span>Launch Simulator</span>
            </button>

            {/* Mobile hamburger button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950/95 border-b border-slate-800 px-4 pt-2 pb-6 space-y-1 backdrop-blur-2xl animate-fadeIn">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'text-cyan-300 bg-cyan-950/60 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
