import React from 'react';
import {
  Sparkles,
  Check,
  X,
  Minus,
  Zap,
  ArrowRight,
  TrendingUp,
  Cpu,
  RefreshCw,
  Coins,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { TelemetryBadge } from '../components/shared/TelemetryBadge';

interface MatrixRow {
  dimension: string;
  conventional: string | boolean;
  basicSolar: string | boolean;
  solarBattery: string | boolean;
  solarChargeAi: string | boolean;
  note: string;
}

const COMPARISON_MATRIX: MatrixRow[] = [
  {
    dimension: 'Solar Prioritization',
    conventional: false,
    basicSolar: 'Passive / Direct',
    solarBattery: 'Rule-Fixed',
    solarChargeAi: 'Dynamic Real-Time AI Optimization',
    note: 'SolarCharge AI directs 100% of available solar to load, steering pilot amps dynamically.'
  },
  {
    dimension: 'Battery-Storage Coordination',
    conventional: false,
    basicSolar: false,
    solarBattery: 'Static Charge/Discharge',
    solarChargeAi: 'Intelligent Active Buffering (C-Rate Regulated)',
    note: 'Coordinates charging based on solar surplus and restricts discharge at 15% reserve and 52°C cutoff.'
  },
  {
    dimension: 'Charging-Demand Awareness',
    conventional: 'Fixed 32A/16A',
    basicSolar: 'Uncoordinated',
    solarBattery: 'Threshold-based',
    solarChargeAi: 'Continuous Pilot PWM Throttling',
    note: 'Dynamically modulates EVSE pilot signal to match clean generation and protect battery life.'
  },
  {
    dimension: 'Energy-Flow Visualization',
    conventional: false,
    basicSolar: 'Simple Wattmeter',
    solarBattery: 'Numeric Inverter Display',
    solarChargeAi: 'Animated Particle Topology & Flow Diagram',
    note: 'Visualizes microsecond energy transfers with color-coded direction and wattage.'
  },
  {
    dimension: 'Safety & Thermal Telemetry',
    conventional: 'Breaker Only',
    basicSolar: 'Basic Fuse',
    solarBattery: 'Passive BMS',
    solarChargeAi: 'Multi-Sensor Isolated Gateway (10Hz)',
    note: 'Hardware thermal derating at 45°C, cutoff at 52°C, and optocoupler galvanic isolation.'
  },
  {
    dimension: 'Predictive Forecasting Readiness',
    conventional: false,
    basicSolar: false,
    solarBattery: false,
    solarChargeAi: '24h Predictive Model & LSTM API Ready',
    note: 'Generates 24-hour ahead solar insolation forecasts with 90% confidence bands.'
  },
  {
    dimension: 'Simulation & Evaluation Sandbox',
    conventional: false,
    basicSolar: false,
    solarBattery: false,
    solarChargeAi: 'Hands-on Sliders & Fault Injection',
    note: 'Enables users to inject temperature excursions, solar drops, and grid blackouts.'
  },
  {
    dimension: 'Campus & Fleet Scalability',
    conventional: 'High Grid Upgrade Cost',
    basicSolar: 'Limited Autonomy',
    solarBattery: 'Moderate',
    solarChargeAi: 'High (Islanding & Load Sharing)',
    note: 'Deploys on educational campuses and fleet depots without requiring expensive grid substations.'
  }
];

export const InnovationPage: React.FC = () => {
  return (
    <div className="space-y-10 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* ================= HEADER ================= */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
              <Sparkles className="w-7 h-7 text-cyan-400" />
              <span>Innovation Advantages & Future Scope</span>
            </h1>
            <TelemetryBadge label="BENCHMARK ANALYSIS" />
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Conceptual feature differentiation across 8 dimensions and future roadmap vectors (V2G, TOU Arbitrage, Carbon Credits).
          </p>
        </div>
      </div>

      {/* ================= COMPREHENSIVE COMPARISON MATRIX ================= */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border-slate-800 space-y-6">
        <div>
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold block mb-1">
            FEATURE DIFFERENTIATION
          </span>
          <h2 className="text-xl font-extrabold text-slate-100">
            Conceptual Architecture Comparison Table
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Comparison of typical charging architectures against the integrated SolarCharge AI methodology:
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="py-3.5 px-4 w-1/5">Comparison Dimension</th>
                <th className="py-3.5 px-4 text-slate-400">1. Conventional Grid Charging</th>
                <th className="py-3.5 px-4 text-slate-400">2. Basic Direct Solar</th>
                <th className="py-3.5 px-4 text-slate-400">3. Solar + Passive Battery</th>
                <th className="py-3.5 px-4 text-cyan-300 bg-cyan-950/40 rounded-t-xl font-bold">4. SolarCharge AI Concept</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {COMPARISON_MATRIX.map((row, idx) => {
                const renderCell = (val: string | boolean, isHighlighted = false) => {
                  if (typeof val === 'boolean') {
                    return val ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                        <Check className="w-3.5 h-3.5" /> Supported
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-500">
                        <X className="w-3.5 h-3.5" /> None
                      </span>
                    );
                  }
                  return (
                    <span className={isHighlighted ? 'text-cyan-300 font-semibold' : 'text-slate-300'}>
                      {val}
                    </span>
                  );
                };

                return (
                  <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-200">
                      {row.dimension}
                      <span className="block text-[10px] text-slate-500 font-normal mt-0.5">{row.note}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{renderCell(row.conventional)}</td>
                    <td className="py-3.5 px-4 text-slate-400">{renderCell(row.basicSolar)}</td>
                    <td className="py-3.5 px-4 text-slate-400">{renderCell(row.solarBattery)}</td>
                    <td className="py-3.5 px-4 bg-cyan-950/20 border-l border-r border-cyan-500/20">
                      {renderCell(row.solarChargeAi, true)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="text-[11px] text-slate-400 italic pt-2">
          * Note: Comparison represents conceptual architectural features and system topology capabilities for evaluation purposes.
        </div>
      </div>

      {/* ================= FUTURE EXPANSION VECTORS ================= */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border-slate-800 space-y-6">
        <div>
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold block mb-1">
            FUTURE SCOPE & INNOVATION
          </span>
          <h2 className="text-xl font-extrabold text-slate-100">
            Roadmap Expansion: Next-Generation Capabilities
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Advanced hardware protocols and algorithmic capabilities designed for scaled real-world rollouts:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Vector 1: V2G Bidirectional */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100">Vehicle-to-Grid (V2G) Bidirectional Transfer</h4>
                <span className="text-[10px] font-mono text-cyan-400">ISO 15118-20 Protocol Standard</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enables parked electric vehicles to act as distributed battery reserves. When local facility demand surges, consenting EVs discharge up to 5 kW back into the microgrid, earning financial energy credits for drivers.
            </p>
          </div>

          {/* Vector 2: Dynamic TOU Arbitrage */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100">Dynamic Time-of-Use (TOU) Tariff Arbitrage</h4>
                <span className="text-[10px] font-mono text-emerald-400">Automated Spot-Price Optimization</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ingests live day-ahead electricity spot market prices via utility APIs. The BESS autonomously buys and stores grid energy during off-peak negative-price hours and discharges during expensive peak windows.
            </p>
          </div>

          {/* Vector 3: Multi-Stall Queuing */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100">Multi-Stall Dynamic Load Balancing</h4>
                <span className="text-[10px] font-mono text-amber-400">Fair-Share Proportional Allocation</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Expands the single-stall prototype to 4–8 charging bays. When multiple vehicles connect simultaneously, the AI dynamically shares available solar and battery power according to departure deadlines and requested kWh.
            </p>
          </div>

          {/* Vector 4: Carbon Credit Tokenization */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100">Verifiable Carbon Abatement Certification</h4>
                <span className="text-[10px] font-mono text-purple-400">Cryptographically Signed Telemetry</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Signs telemetry streams from the ESP32 hardware cryptographically to generate immutable audit proofs of green kilowatt-hours delivered, qualifying station owners for voluntary carbon offset credits.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
