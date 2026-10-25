import React from 'react';
import { Zap, ShieldAlert, Cpu, HeartHandshake, ExternalLink } from 'lucide-react';
import { TelemetryBadge } from '../shared/TelemetryBadge';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="mt-20 border-t border-slate-800 bg-slate-950/90 text-slate-400 text-xs">
      {/* High-visibility Safety & Prototype Notice */}
      <div className="bg-amber-950/30 border-b border-amber-500/20 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-amber-200/90 text-[11px] leading-relaxed">
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold text-amber-300">Engineering & Safety Prototype Notice:</strong>{' '}
              This web application is a technical demonstration and competition prototype. It simulates energy flow, MPPT tracking, LiFePO4 battery buffering, and AI dispatch. It does <em>not</em> replace hardware-level Battery Management Systems (BMS), physical galvanic isolation, fast-acting fuses, emergency stop interlocks, or certified EV charging equipment adhering to IEC 61851 / SAE J1772 electrical safety standards.
            </div>
          </div>
          <TelemetryBadge label="DEMO TELEMETRY" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-cyan-500 p-[1px]">
                <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
                  <Zap className="w-4 h-4 text-electric-400" />
                </div>
              </div>
              <span className="text-base font-bold text-slate-100 tracking-tight">
                SolarCharge<span className="text-electric-400"> AI</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              Solar-Powered Smart Charging Infrastructure with Battery Storage and Intelligent Energy Management. Bridging intermittent photovoltaic generation and electric vehicle load demands through edge telemetry and predictive AI dispatch.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[10px]">
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">ESP32 IoT Ready</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">48V LiFePO4 BESS</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">Microgrid Islanding</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">Zero-Grid Priority</span>
            </div>
          </div>

          {/* Core Modules Links */}
          <div className="space-y-2">
            <span className="text-slate-200 font-bold uppercase tracking-wider text-[11px] block">
              Core Modules
            </span>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button type="button" onClick={() => setActiveTab('dashboard')} className="hover:text-cyan-400 transition-colors">
                  Live Energy Dashboard
                </button>
              </li>
              <li>
                <button type="button" onClick={() => setActiveTab('ai-manager')} className="hover:text-cyan-400 transition-colors">
                  AI Energy Manager
                </button>
              </li>
              <li>
                <button type="button" onClick={() => setActiveTab('simulator')} className="hover:text-cyan-400 transition-colors">
                  Charging Simulator & Scenarios
                </button>
              </li>
              <li>
                <button type="button" onClick={() => setActiveTab('architecture')} className="hover:text-cyan-400 transition-colors">
                  System Architecture & Wiring
                </button>
              </li>
              <li>
                <button type="button" onClick={() => setActiveTab('safety')} className="hover:text-cyan-400 transition-colors">
                  Safety & Fault Injection
                </button>
              </li>
            </ul>
          </div>

          {/* Project & Research */}
          <div className="space-y-2">
            <span className="text-slate-200 font-bold uppercase tracking-wider text-[11px] block">
              Project & Tech
            </span>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button type="button" onClick={() => setActiveTab('implementation')} className="hover:text-cyan-400 transition-colors">
                  Implementation Roadmap & ESP32
                </button>
              </li>
              <li>
                <button type="button" onClick={() => setActiveTab('innovation')} className="hover:text-cyan-400 transition-colors">
                  Innovation & Comparison Matrix
                </button>
              </li>
              <li>
                <button type="button" onClick={() => setActiveTab('about')} className="hover:text-cyan-400 transition-colors">
                  About Project & Telemetry Export
                </button>
              </li>
              <li className="pt-2 text-slate-500 flex items-center gap-1 font-mono text-[10px]">
                <span>Version 1.0.0 &bull; 2026</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <div>
            &copy; 2026 SolarCharge AI Team. All rights reserved. Designed for clean-tech innovation & academic evaluation.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Deterministic Rule Engine + Edge Forecaster</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
