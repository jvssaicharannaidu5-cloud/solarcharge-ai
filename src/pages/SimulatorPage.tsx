import React from 'react';
import {
  Sliders,
  Sun,
  Battery,
  Car,
  Thermometer,
  Radio,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Layers,
  Shield,
  Zap
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import { EnergyFlowDiagram } from '../components/shared/EnergyFlowDiagram';
import { TelemetryBadge } from '../components/shared/TelemetryBadge';
import { ChargingMode } from '../types';

export const SimulatorPage: React.FC = () => {
  const {
    state,
    allocation,
    batteryTelemetry,
    setSolarGenerationKw,
    setBatterySoc,
    setChargingDemandKw,
    setBatteryTempC,
    setGridBackupEnabled,
    setSolarPriorityEnabled,
    setChargingMode,
    applyScenario,
    resetSimulation
  } = useSimulation();

  return (
    <div className="space-y-8 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* ================= HEADER ================= */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
              <Sliders className="w-7 h-7 text-cyan-400" />
              <span>Interactive Charging Physics Simulator</span>
            </h1>
            <TelemetryBadge label="STRICT PHYSICS ENGINE" />
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manipulate solar flux, battery state of charge, temperature, and vehicle load demands to observe real-time power arbitration and conservation.
          </p>
        </div>

        {/* Global Reset */}
        <button
          type="button"
          onClick={resetSimulation}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Sliders</span>
        </button>
      </div>

      {/* ================= 1-CLICK DEMONSTRATION PRESETS ================= */}
      <div className="glass-panel p-5 rounded-2xl border-slate-800">
        <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold block mb-3">
          1-CLICK BENCHMARK SCENARIOS
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          <button
            type="button"
            onClick={() => applyScenario('A')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              state.chargingMode === 'standard'
                ? 'bg-rose-950/50 border-rose-500/50 text-rose-200'
                : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-100">Scenario A</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/30">
                GRID HEAVY
              </span>
            </div>
            <div className="text-[11px] text-slate-400 leading-snug">
              Standard legacy charging. Solar is uncoordinated; heavy reliance on municipal grid.
            </div>
          </button>

          <button
            type="button"
            onClick={() => applyScenario('B')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              state.chargingMode === 'smart_balanced' && state.solarGenerationKw > 4
                ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-200 glow-emerald'
                : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-100">Scenario B</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                SMART AI
              </span>
            </div>
            <div className="text-[11px] text-slate-400 leading-snug">
              SolarCharge Smart Mode. Full solar utilization, battery buffering, zero grid import.
            </div>
          </button>

          <button
            type="button"
            onClick={() => applyScenario('C')}
            className="p-3.5 rounded-xl border bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300 text-left transition-all"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-100">Scenario C</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                LOW SOLAR
              </span>
            </div>
            <div className="text-[11px] text-slate-400 leading-snug">
              Evening / Low Sunlight. High battery SOC discharges safely to satisfy EV load.
            </div>
          </button>

          <button
            type="button"
            onClick={() => applyScenario('D')}
            className="p-3.5 rounded-xl border bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300 text-left transition-all"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-100">Scenario D</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30">
                OFF-GRID
              </span>
            </div>
            <div className="text-[11px] text-slate-400 leading-snug">
              Islanded Emergency. Grid completely disconnected; running solely on PV + BESS.
            </div>
          </button>

        </div>
      </div>

      {/* ================= INTERACTIVE INPUT SLIDERS & CONTROLS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sliders Panel (7 cols) */}
        <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-3xl border-slate-800 space-y-6">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 pb-2 border-b border-slate-800">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Simulation Input Parameters</span>
          </h3>

          {/* Slider 1: Solar Generation */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-200 flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-400" />
                Solar PV Generation
              </span>
              <span className="font-mono text-base font-bold text-amber-400">
                {state.solarGenerationKw.toFixed(1)} <span className="text-xs text-slate-400 font-normal">kW</span>
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="5.0"
              step="0.1"
              value={state.solarGenerationKw}
              onChange={e => setSolarGenerationKw(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>0.0 kW (Night)</span>
              <span>2.5 kW (Overcast)</span>
              <span>5.0 kW (Peak Insolation)</span>
            </div>
          </div>

          {/* Slider 2: EV Charging Demand */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-200 flex items-center gap-2">
                <Car className="w-4 h-4 text-cyan-400" />
                EV Charging Demand
              </span>
              <span className="font-mono text-base font-bold text-cyan-400">
                {state.chargingDemandKw.toFixed(1)} <span className="text-xs text-slate-400 font-normal">kW</span>
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="5.0"
              step="0.1"
              value={state.chargingDemandKw}
              onChange={e => setChargingDemandKw(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>0.0 kW (Unplugged)</span>
              <span>2.3 kW (Slow Level 1)</span>
              <span>5.0 kW (Fast Level 2)</span>
            </div>
          </div>

          {/* Slider 3: Battery SOC */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-200 flex items-center gap-2">
                <Battery className="w-4 h-4 text-emerald-400" />
                Battery State of Charge (SOC)
              </span>
              <span className="font-mono text-base font-bold text-emerald-400">
                {state.batterySoc.toFixed(0)} <span className="text-xs text-slate-400 font-normal">%</span>
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={state.batterySoc}
              onChange={e => setBatterySoc(Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>0% (Empty)</span>
              <span>15% (Reserve Floor)</span>
              <span>98% (Float Ceiling)</span>
              <span>100%</span>
            </div>
          </div>

          {/* Slider 4: Battery Temperature */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-200 flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-rose-400" />
                Battery Pack Temperature
              </span>
              <span className={`font-mono text-base font-bold ${
                state.batteryTempC >= 52 ? 'text-rose-400' : (state.batteryTempC >= 45 ? 'text-amber-400' : 'text-slate-200')
              }`}>
                {state.batteryTempC}°C
              </span>
            </div>
            <input
              type="range"
              min="15"
              max="60"
              step="1"
              value={state.batteryTempC}
              onChange={e => setBatteryTempC(Number(e.target.value))}
              className={`w-full cursor-pointer ${
                state.batteryTempC >= 52 ? 'accent-rose-500' : 'accent-slate-400'
              }`}
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>15°C (Cool)</span>
              <span>28°C (Optimal)</span>
              <span>45°C (Derate)</span>
              <span>52°C+ (Cutoff)</span>
            </div>
          </div>

          {/* Mode Selector & Toggles */}
          <div className="pt-4 border-t border-slate-800 space-y-4">
            
            {/* Mode Selector */}
            <div>
              <span className="text-xs font-semibold text-slate-300 block mb-2">
                Charging Strategy Mode:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {(['standard', 'solar_priority', 'smart_balanced'] as ChargingMode[]).map(mode => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setChargingMode(mode)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors border ${
                      state.chargingMode === mode
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {mode.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <input
                  type="checkbox"
                  checked={state.gridBackupEnabled}
                  onChange={e => setGridBackupEnabled(e.target.checked)}
                  className="w-4 h-4 rounded accent-cyan-400 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-300">
                  Grid Backup Allowed
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <input
                  type="checkbox"
                  checked={state.solarPriorityEnabled}
                  onChange={e => setSolarPriorityEnabled(e.target.checked)}
                  className="w-4 h-4 rounded accent-amber-400 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-300">
                  Solar Priority Enabled
                </span>
              </label>
            </div>

          </div>

        </div>

        {/* Real-Time Mathematical Energy Audit (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border-slate-800 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>Strict Conservation of Energy Audit</span>
              </h3>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                allocation.isEnergyBalanced
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                  : 'bg-rose-950 text-rose-300 border-rose-500/40'
              }`}>
                {allocation.isEnergyBalanced ? 'AUDIT PASSED (0.000 Δ)' : 'IMBALANCED'}
              </span>
            </div>

            {/* Power In vs Power Out Breakdown */}
            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                <span className="text-slate-400 block font-sans text-[11px] font-semibold">POWER GENERATION & INFLOW</span>
                <div className="flex justify-between text-amber-400">
                  <span>+ Solar Harvest:</span>
                  <span className="font-bold">{state.solarGenerationKw.toFixed(2)} kW</span>
                </div>
                <div className="flex justify-between text-cyan-400">
                  <span>+ Battery Discharge:</span>
                  <span className="font-bold">{allocation.batteryDischargeToLoadKw.toFixed(2)} kW</span>
                </div>
                <div className="flex justify-between text-purple-400">
                  <span>+ Grid Import:</span>
                  <span className="font-bold">{allocation.gridToLoadKw.toFixed(2)} kW</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between text-slate-100 font-bold">
                  <span>TOTAL POWER IN:</span>
                  <span>{(state.solarGenerationKw + allocation.batteryDischargeToLoadKw + allocation.gridToLoadKw).toFixed(2)} kW</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                <span className="text-slate-400 block font-sans text-[11px] font-semibold">POWER CONSUMPTION & OUTFLOW</span>
                <div className="flex justify-between text-cyan-400">
                  <span>- EV Delivered:</span>
                  <span className="font-bold">{allocation.totalLoadDeliveredKw.toFixed(2)} kW</span>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <span>- Battery Storage Charge:</span>
                  <span className="font-bold">{allocation.solarToBatteryKw.toFixed(2)} kW</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>- Curtailment (Surplus unused):</span>
                  <span className="font-bold">{allocation.solarCurtailedKw.toFixed(2)} kW</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between text-slate-100 font-bold">
                  <span>TOTAL POWER OUT:</span>
                  <span>{(allocation.totalLoadDeliveredKw + allocation.solarToBatteryKw + allocation.solarCurtailedKw).toFixed(2)} kW</span>
                </div>
              </div>
            </div>

            {/* Metrics Snapshot */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Renewable Purity</span>
                <span className="text-xl font-bold font-mono text-emerald-400">{allocation.renewableSharePercent}%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Hourly Avoided CO₂</span>
                <span className="text-xl font-bold font-mono text-cyan-400">{allocation.emissionsAvoidedKgHr.toFixed(2)} kg</span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ================= DYNAMIC ENERGY FLOW DIAGRAM ================= */}
      <EnergyFlowDiagram />

      {/* ================= SIDE-BY-SIDE SCENARIO A VS SCENARIO B COMPARISON ================= */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border-slate-800 space-y-6">
        <div>
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold block mb-1">
            BENCHMARK COMPARISON
          </span>
          <h3 className="text-xl font-extrabold text-slate-100">
            Scenario A (Standard Grid-Heavy) vs Scenario B (SolarCharge Smart Mode)
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Direct side-by-side comparison under equivalent operating conditions (Solar: 4.0 kW, EV Demand: 4.0 kW, 10 kWh BESS pack).
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="py-3 px-4">Evaluation Dimension</th>
                <th className="py-3 px-4 text-rose-300 bg-rose-950/20 rounded-t-lg">Scenario A: Standard Unmanaged</th>
                <th className="py-3 px-4 text-emerald-300 bg-emerald-950/20 rounded-t-lg">Scenario B: SolarCharge Smart Mode</th>
                <th className="py-3 px-4 text-cyan-300">Measured Advantage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono">
              <tr>
                <td className="py-3 px-4 font-sans font-semibold text-slate-200">Grid Power Inflow</td>
                <td className="py-3 px-4 text-rose-400 bg-rose-950/10">3.40 kW (85% grid reliance)</td>
                <td className="py-3 px-4 text-emerald-400 bg-emerald-950/10 font-bold">0.00 kW (100% clean islanded)</td>
                <td className="py-3 px-4 text-cyan-400">-3.40 kW Grid Draw</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-sans font-semibold text-slate-200">Direct Solar to EV</td>
                <td className="py-3 px-4 text-slate-300 bg-rose-950/10">0.60 kW (unmanaged coupling)</td>
                <td className="py-3 px-4 text-emerald-400 bg-emerald-950/10 font-bold">4.00 kW (100% solar matched)</td>
                <td className="py-3 px-4 text-cyan-400">+566% Clean Solar Delivery</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-sans font-semibold text-slate-200">Battery Storage Buffer</td>
                <td className="py-3 px-4 text-slate-500 bg-rose-950/10">0.00 kW (idle passive pack)</td>
                <td className="py-3 px-4 text-emerald-400 bg-emerald-950/10 font-bold">Buffers transients at 0.5C</td>
                <td className="py-3 px-4 text-cyan-400">Peak demand shaving active</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-sans font-semibold text-slate-200">Renewable Energy Share</td>
                <td className="py-3 px-4 text-rose-400 bg-rose-950/10">15.0% clean</td>
                <td className="py-3 px-4 text-emerald-400 bg-emerald-950/10 font-bold">100.0% clean solar</td>
                <td className="py-3 px-4 text-cyan-400">+85.0% Renewable Purity</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-sans font-semibold text-slate-200">Hourly CO₂ Abatement</td>
                <td className="py-3 px-4 text-slate-400 bg-rose-950/10">0.49 kg CO₂ / hr</td>
                <td className="py-3 px-4 text-emerald-400 bg-emerald-950/10 font-bold">3.28 kg CO₂ / hr</td>
                <td className="py-3 px-4 text-cyan-400">+2.79 kg CO₂ Avoided</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
