import React, { useState } from 'react';
import {
  Brain,
  Cpu,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  CloudSun,
  ShieldCheck,
  Code2,
  HelpCircle,
  Zap,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { useSimulation } from '../context/SimulationContext';
import { TelemetryBadge } from '../components/shared/TelemetryBadge';

export const AiManagerPage: React.FC = () => {
  const {
    state,
    allocation,
    batteryTelemetry,
    aiRecommendation,
    aiPriorities,
    setAiPriorities,
    forecastData
  } = useSimulation();

  const [activeSubTab, setActiveSubTab] = useState<'decision_engine' | 'forecasting' | 'ml_integration'>('decision_engine');

  const handlePriorityChange = (key: keyof typeof aiPriorities, val: number) => {
    setAiPriorities({ ...aiPriorities, [key]: val });
  };

  return (
    <div className="space-y-8 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* ================= HEADER ================= */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
              <Brain className="w-7 h-7 text-cyan-400" />
              <span>AI Energy Manager & Decision Engine</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40">
              RULE-BASED DETERMINISTIC PROTOTYPE
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Transparent multi-objective power arbitration coordinating photovoltaic harvesting, LiFePO4 battery longevity, and EV charging demands.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveSubTab('decision_engine')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeSubTab === 'decision_engine'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Decision Logic
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('forecasting')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeSubTab === 'forecasting'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            24h Predictive Forecast
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('ml_integration')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeSubTab === 'ml_integration'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ML API Blueprint
          </button>
        </div>
      </div>

      {/* ================= TAB 1: DECISION LOGIC & REASONING ================= */}
      {activeSubTab === 'decision_engine' && (
        <div className="space-y-8">
          
          {/* Transparent AI Explanation Card */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border-cyan-500/30 relative overflow-hidden glow-cyan">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-cyan-400 tracking-wider font-bold">
                    ACTIVE ARBITRATION EXPLANATION
                  </span>
                  <h3 className="text-xl font-bold text-slate-100">
                    Why the System Chose This Power Routing
                  </h3>
                </div>
              </div>
              <TelemetryBadge label="LIVE REASONER" />
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-sm text-slate-200 leading-relaxed font-mono">
              &ldquo;{aiRecommendation.explanation}&rdquo;
            </div>

            {/* Recommended Target Output Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 block text-[11px] font-mono">TARGET EV POWER</span>
                <span className="text-base font-bold font-mono text-cyan-400">
                  {aiRecommendation.recommendedChargingPowerKw.toFixed(2)} kW
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 block text-[11px] font-mono">BATTERY ACTION</span>
                <span className={`text-base font-bold font-mono ${
                  aiRecommendation.batteryAction === 'charge' ? 'text-emerald-400' : (aiRecommendation.batteryAction === 'discharge' ? 'text-cyan-400' : 'text-slate-400')
                }`}>
                  {aiRecommendation.batteryAction.toUpperCase()} ({aiRecommendation.batteryPowerKw.toFixed(2)} kW)
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 block text-[11px] font-mono">GRID BACKUP PERMITTED</span>
                <span className="text-base font-bold font-mono text-purple-400">
                  {aiRecommendation.gridBackupRecommended ? 'YES (Supplying Deficit)' : 'NO (Clean Autonomous)'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 block text-[11px] font-mono">SAFETY STATUS</span>
                <span className={`text-base font-bold font-mono ${
                  aiRecommendation.safetyStatus === 'normal' ? 'text-emerald-400' : (aiRecommendation.safetyStatus === 'derated' ? 'text-amber-400' : 'text-rose-400')
                }`}>
                  {aiRecommendation.safetyStatus.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* 5-Stage Decision Pipeline Visual */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border-slate-800">
            <h3 className="text-lg font-bold text-slate-100 mb-2 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <span>Transparent 5-Stage Decision Logic Execution</span>
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Evaluation rules executed deterministically in microsecond cycles. Live checks reflect current simulation parameters:
            </p>

            <div className="space-y-4">
              
              {/* Rule 1 */}
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono text-xs flex items-center justify-center shrink-0">
                    1
                  </span>
                  <div>
                    <strong className="text-sm text-slate-200 block">Solar Priority for EV Load</strong>
                    <span className="text-xs text-slate-400">
                      When solar is present ({state.solarGenerationKw} kW), route 100% to satisfy EV demand ({state.chargingDemandKw} kW) first.
                    </span>
                  </div>
                </div>
                <div className="text-xs font-mono px-3 py-1 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 self-start sm:self-center">
                  Delivering {allocation.solarToLoadKw} kW Direct
                </div>
              </div>

              {/* Rule 2 */}
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono text-xs flex items-center justify-center shrink-0">
                    2
                  </span>
                  <div>
                    <strong className="text-sm text-slate-200 block">Surplus Solar to BESS Buffer</strong>
                    <span className="text-xs text-slate-400">
                      If solar exceeds load ($P_{`solar`} &gt; P_{`demand`}$), direct eligible surplus into LiFePO4 battery (SOC: {state.batterySoc}%).
                    </span>
                  </div>
                </div>
                <div className={`text-xs font-mono px-3 py-1 rounded-lg border self-start sm:self-center ${
                  allocation.solarToBatteryKw > 0
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {allocation.solarToBatteryKw > 0 ? `Charging +${allocation.solarToBatteryKw} kW` : 'No Solar Surplus'}
                </div>
              </div>

              {/* Rule 3 */}
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono text-xs flex items-center justify-center shrink-0">
                    3
                  </span>
                  <div>
                    <strong className="text-sm text-slate-200 block">Battery Discharge for Load Deficit</strong>
                    <span className="text-xs text-slate-400">
                      When solar is insufficient, discharge stored battery energy if SOC &gt; 15% and temperature &lt; 52°C.
                    </span>
                  </div>
                </div>
                <div className={`text-xs font-mono px-3 py-1 rounded-lg border self-start sm:self-center ${
                  allocation.batteryDischargeToLoadKw > 0
                    ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {allocation.batteryDischargeToLoadKw > 0 ? `Discharging ${allocation.batteryDischargeToLoadKw} kW` : 'Standby / Fully Met'}
                </div>
              </div>

              {/* Rule 4 */}
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono text-xs flex items-center justify-center shrink-0">
                    4
                  </span>
                  <div>
                    <strong className="text-sm text-slate-200 block">Grid Backup Supplementation</strong>
                    <span className="text-xs text-slate-400">
                      If clean power + battery cannot meet full demand, import grid power if backup is enabled and grid is online.
                    </span>
                  </div>
                </div>
                <div className={`text-xs font-mono px-3 py-1 rounded-lg border self-start sm:self-center ${
                  allocation.gridToLoadKw > 0
                    ? 'bg-purple-950/80 text-purple-300 border-purple-500/30'
                    : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30'
                }`}>
                  {allocation.gridToLoadKw > 0 ? `Importing ${allocation.gridToLoadKw} kW` : 'Zero Grid Import'}
                </div>
              </div>

              {/* Rule 5 */}
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono text-xs flex items-center justify-center shrink-0">
                    5
                  </span>
                  <div>
                    <strong className="text-sm text-slate-200 block">Safety Cutoffs & Thermal Derating</strong>
                    <span className="text-xs text-slate-400">
                      If temperature &ge; 45&deg;C throttle power by 50%; if temperature &ge; 52&deg;C or SOC &le; 15%, isolate battery relay.
                    </span>
                  </div>
                </div>
                <div className={`text-xs font-mono px-3 py-1 rounded-lg border self-start sm:self-center ${
                  batteryTelemetry.temperatureC >= 52
                    ? 'bg-rose-950/80 text-rose-300 border-rose-500/30'
                    : (batteryTelemetry.temperatureC >= 45 ? 'bg-amber-950/80 text-amber-300 border-amber-500/30' : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30')
                }`}>
                  {batteryTelemetry.temperatureC >= 52 ? 'Critical Thermal Cutoff' : (batteryTelemetry.temperatureC >= 45 ? 'Thermal Derate 50%' : 'Thermal Nominal (28°C)')}
                </div>
              </div>

            </div>
          </div>

          {/* Configurable Priority Weights */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-cyan-400" />
                <span>Configurable Optimization Objectives</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">Dynamic AI Weights</span>
            </div>
            <p className="text-xs text-slate-400 mb-6">
              Adjust priority sliders to bias the arbitration engine toward green purity, battery preservation, speed, or cost minimization:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Priority 1 */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-200">Renewable Energy Autonomy</span>
                  <span className="font-mono text-emerald-400 font-bold">{aiPriorities.renewableAutonomy}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={aiPriorities.renewableAutonomy}
                  onChange={e => handlePriorityChange('renewableAutonomy', Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
                <span className="text-[11px] text-slate-500 block">Strictly minimizes grid import, accepting EV charge throttling if necessary.</span>
              </div>

              {/* Priority 2 */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-200">Battery Health Preservation</span>
                  <span className="font-mono text-cyan-400 font-bold">{aiPriorities.batteryHealth}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={aiPriorities.batteryHealth}
                  onChange={e => handlePriorityChange('batteryHealth', Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <span className="text-[11px] text-slate-500 block">Limits peak C-rates to 0.3C and restricts extreme SOC cycling.</span>
              </div>

              {/* Priority 3 */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-200">Charging Speed & Delivery</span>
                  <span className="font-mono text-amber-400 font-bold">{aiPriorities.chargingSpeed}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={aiPriorities.chargingSpeed}
                  onChange={e => handlePriorityChange('chargingSpeed', Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <span className="text-[11px] text-slate-500 block">Ensures fast vehicle turnaround by permitting grid backup when solar dips.</span>
              </div>

              {/* Priority 4 */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-200">Time-of-Use Cost Minimization</span>
                  <span className="font-mono text-purple-400 font-bold">{aiPriorities.costMinimization}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={aiPriorities.costMinimization}
                  onChange={e => handlePriorityChange('costMinimization', Number(e.target.value))}
                  className="w-full accent-purple-400 cursor-pointer"
                />
                <span className="text-[11px] text-slate-500 block">Blocks grid usage during peak tariff periods (e.g., 4:00 PM – 9:00 PM).</span>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* ================= TAB 2: 24H PREDICTIVE FORECAST ================= */}
      {activeSubTab === 'forecasting' && (
        <div className="space-y-8">
          
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <CloudSun className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-bold text-slate-100">
                    24-Hour Solar Insolation & EV Demand Forecast
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Predictive scheduling model displaying expected solar generation with 90% confidence bands vs expected charging sessions.
                </p>
              </div>
              <TelemetryBadge label="SIMULATED FORECAST MODEL" />
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="forecastSolarGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="confidenceBand" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#fbbf24" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="timeLabel" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit=" kW" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px', fontFamily: 'monospace' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Area type="monotone" dataKey="solarConfidenceHighKw" stroke="none" fill="url(#confidenceBand)" name="90% Upper Solar Bound" />
                  <Area type="monotone" dataKey="solarEstimatedKw" stroke="#f59e0b" strokeWidth={2.5} fill="url(#forecastSolarGrad)" name="Expected Solar (kW)" />
                  <Line type="monotone" dataKey="loadEstimatedKw" stroke="#06b6d4" strokeWidth={2.5} dot={{ r: 3 }} name="Predicted EV Demand (kW)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-800 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 block font-mono text-[11px]">PROJECTED DAILY SOLAR</span>
                <span className="text-base font-bold font-mono text-amber-400">28.4 kWh</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 block font-mono text-[11px]">PREDICTED EV DEMAND</span>
                <span className="text-base font-bold font-mono text-cyan-400">22.8 kWh</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 block font-mono text-[11px]">NET AUTONOMY RATIO</span>
                <span className="text-base font-bold font-mono text-emerald-400">92.6% Clean</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ================= TAB 3: MACHINE LEARNING API BLUEPRINT ================= */}
      {activeSubTab === 'ml_integration' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border-slate-800 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Code2 className="w-5 h-5 text-cyan-400" />
                <span>Modular Machine Learning Ingestion Pipeline Blueprint</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                How external deep learning models (LSTM solar forecasters & XGBoost load estimators) interface with the live controller.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-slate-800 text-slate-300 border border-slate-700">
              REST / MQTT Schema
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* JSON Schema Definition */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-slate-300 block">
                TELEMETRY INGESTION PAYLOAD (POST /api/v1/telemetry)
              </span>
              <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed">
{`{
  "device_id": "ESP32_STATION_001",
  "timestamp": 1728662400,
  "pv_metrics": {
    "voltage_v": 78.4,
    "current_a": 48.5,
    "power_kw": 3.80,
    "irradiance_wm2": 760
  },
  "bess_metrics": {
    "soc_percent": 68.0,
    "voltage_v": 52.4,
    "temp_c": 28.2,
    "soh_percent": 98.4
  },
  "evse_metrics": {
    "pilot_amps": 16,
    "delivered_kw": 3.30,
    "state": "CHARGING"
  }
}`}
              </pre>
            </div>

            {/* AI Dispatch Response */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-slate-300 block">
                AI DISPATCH SETPOINT (RESPONSE 200 OK)
              </span>
              <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
{`{
  "status": "OPTIMIZED",
  "dispatch_command": {
    "mppt_mode": "MPPT_TRACKING",
    "bess_target_kw": 0.50,
    "bess_direction": "CHARGE",
    "evse_pilot_amps": 14.3,
    "grid_relay_state": "OPEN_ISLANDED"
  },
  "forecast_metadata": {
    "model": "LSTM_Solar_v2.4",
    "confidence_p90": 0.89,
    "next_1h_expected_kw": 4.10
  }
}`}
              </pre>
            </div>

          </div>

          <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed">
            <strong className="text-amber-300 font-semibold">Production Deployment Note:</strong> In hardware field deployments, deterministic safety checks reside in firmware on the ESP32. If cloud connection drops, the station drops back to autonomous local rule execution with zero downtime.
          </div>
        </div>
      )}

    </div>
  );
};
