import React from 'react';
import {
  Info,
  Download,
  BookOpen,
  FileJson,
  FileSpreadsheet,
  Award,
  Zap,
  Shield,
  Layers,
  HeartHandshake
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import { TelemetryBadge } from '../components/shared/TelemetryBadge';
import { exportTelemetryToCSV, exportTelemetryToJSON } from '../utils/exportData';

interface GlossaryTerm {
  term: string;
  definition: string;
}

const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: 'MPPT (Maximum Power Point Tracking)',
    definition: 'An electronic DC-DC conversion algorithm that continuously adjusts the electrical operating point of photovoltaic modules to harvest the maximum extractable power under variable sunlight.'
  },
  {
    term: 'BESS (Battery Energy Storage System)',
    definition: 'An integrated electrochemical energy reservoir (such as LiFePO4 cells) accompanied by a battery management system, thermal monitoring, and bidirectional inverters.'
  },
  {
    term: 'SOC (State of Charge)',
    definition: 'The remaining available capacity in a battery expressed as a percentage of its maximum rated capacity (0% to 100%).'
  },
  {
    term: 'SOH (State of Health)',
    definition: 'A figure of merit reflecting the general condition and irreversible degradation of a battery pack relative to its initial factory condition.'
  },
  {
    term: 'C-Rate',
    definition: 'A measure of the rate at which a battery is charged or discharged relative to its maximum capacity. 1C discharges the entire pack in 1 hour; 0.35C delivers moderate power to preserve cell lifespan.'
  },
  {
    term: 'Microgrid Islanding',
    definition: 'The ability of a localized renewable energy installation to disconnect from the municipal electrical utility and sustain critical loads autonomously using local solar and storage.'
  },
  {
    term: 'Pilot Signal (SAE J1772 / IEC 61851)',
    definition: 'A 1 kHz pulse-width modulated (PWM) analog signal communicated through the charging cable to command the vehicle on-board charger how much current it is permitted to draw.'
  },
  {
    term: 'Peak Shaving',
    definition: 'The practice of utilizing on-site stored battery power to reduce peak grid electrical consumption spikes, avoiding high commercial demand tariff penalties.'
  }
];

export const AboutPage: React.FC = () => {
  const { telemetryLogs, state } = useSimulation();

  return (
    <div className="space-y-10 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* ================= HEADER ================= */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
              <Info className="w-7 h-7 text-cyan-400" />
              <span>About the SolarCharge AI Project</span>
            </h1>
            <TelemetryBadge label="COMPETITION PROTOTYPE" />
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Background, architectural context, engineering philosophy, telemetry data export, and clean energy technical glossary.
          </p>
        </div>
      </div>

      {/* ================= PROJECT OVERVIEW & MISSION ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-8 glass-panel p-6 sm:p-8 rounded-3xl border-slate-800 space-y-4">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold block mb-1">
            MISSION & PROBLEM CONTEXT
          </span>
          <h2 className="text-2xl font-extrabold text-slate-100">
            Intelligent Energy Management for Zero-Grid EV Infrastructure
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            The <strong>SolarCharge AI</strong> project was engineered to solve the disconnect between intermittent renewable generation and surging electric vehicle charging demands. Rather than treating EV charging as an uncontrollable electrical burden on municipal grids, SolarCharge AI transforms charging stations into agile, autonomous microgrids.
          </p>
          <p className="text-sm text-slate-400 leading-relaxed">
            By orchestrating maximum power point tracking (MPPT) photovoltaic generation, 48V Lithium Iron Phosphate (LiFePO4) storage reservoirs, dynamic EVSE pilot throttling, and edge IoT telemetry via ESP32, the system maximizes clean self-consumption while protecting battery longevity and ensuring reliable charging even during grid blackouts.
          </p>

          <div className="pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block font-mono text-[11px]">CORE FOCUS</span>
              <span className="text-slate-200 font-bold mt-0.5 block">Renewable EV Infrastructure</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block font-mono text-[11px]">SYSTEM TYPE</span>
              <span className="text-slate-200 font-bold mt-0.5 block">Autonomous Microgrid</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block font-mono text-[11px]">BENCHMARK TARGET</span>
              <span className="text-emerald-400 font-bold mt-0.5 block">&gt; 90% Clean Energy Purity</span>
            </div>
          </div>
        </div>

        {/* Telemetry Log Export Tool */}
        <div className="lg:col-span-4 glass-panel p-6 sm:p-8 rounded-3xl border-slate-800 space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Download className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-slate-100">Export Telemetry Data</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Download the real-time simulation session telemetry log for evaluation, charting, or grading in research tools like Python, Excel, or MATLAB.
          </p>

          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={() => exportTelemetryToCSV(telemetryLogs)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Export Telemetry as CSV ({telemetryLogs.length} rows)</span>
            </button>

            <button
              type="button"
              onClick={() => exportTelemetryToJSON(telemetryLogs)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <FileJson className="w-4 h-4 text-cyan-400" />
              <span>Export Telemetry as JSON Payload</span>
            </button>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-slate-400">
            Current Session Logs: <strong className="text-cyan-300">{telemetryLogs.length} entries</strong> &bull; Sampling: 1000ms
          </div>
        </div>

      </div>

      {/* ================= TECHNICAL GLOSSARY ================= */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border-slate-800 space-y-6">
        <div>
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold block mb-1">
            REFERENCE GUIDE
          </span>
          <h2 className="text-xl font-extrabold text-slate-100">
            Clean Energy & Microgrid Engineering Glossary
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Standard terminology and definitions for judges, students, and engineers evaluating the SolarCharge AI system:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {GLOSSARY_TERMS.map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <strong className="text-xs font-mono font-bold text-cyan-300 block">
                {item.term}
              </strong>
              <p className="text-xs text-slate-300 leading-relaxed">
                {item.definition}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ================= COMPLIANCE & STANDARDS ================= */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-400" />
          <span>Governing Electrical & Safety Standards References</span>
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          The physical architecture of SolarCharge AI is modeled after internationally recognized standards governing microgrids and electric vehicle supply equipment:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <strong className="text-slate-200 block font-mono">IEC 61851-1 / SAE J1772</strong>
            <span className="text-[11px] text-slate-400">Conductive charging systems, PWM pilot signaling, and safety interlocking.</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <strong className="text-slate-200 block font-mono">IEEE 1547 / UL 1741</strong>
            <span className="text-[11px] text-slate-400">Standard for interconnecting distributed resources with electric power systems & anti-islanding.</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <strong className="text-slate-200 block font-mono">NEC Article 625 / NFPA 70</strong>
            <span className="text-[11px] text-slate-400">National Electrical Code requirements for Electric Vehicle Power Transfer Systems.</span>
          </div>
        </div>
      </div>

    </div>
  );
};
