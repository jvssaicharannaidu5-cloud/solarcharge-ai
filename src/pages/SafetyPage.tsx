import React from 'react';
import {
  ShieldAlert,
  Thermometer,
  Battery,
  Sun,
  Radio,
  Cpu,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Percent,
  TrendingDown,
  Flame,
  Zap,
  Activity
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import { TelemetryBadge } from '../components/shared/TelemetryBadge';
import { FaultInjectionState } from '../types';

export const SafetyPage: React.FC = () => {
  const {
    state,
    allocation,
    batteryTelemetry,
    toggleFault,
    resetFaults,
    alerts
  } = useSimulation();

  const faults = state.faults;
  const anyFaultActive = Object.values(faults).some(Boolean);

  return (
    <div className="space-y-10 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* ================= HEADER ================= */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
              <ShieldAlert className="w-7 h-7 text-cyan-400" />
              <span>Safety Interlocks & Electrical Efficiency</span>
            </h1>
            <TelemetryBadge label="FAULT INJECTION SANDBOX" />
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Simulate thermal emergencies, grid outages, and sensor disconnections to observe automated fail-safe responses.
          </p>
        </div>

        {anyFaultActive && (
          <button
            type="button"
            onClick={resetFaults}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-300 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear All Injected Faults</span>
          </button>
        )}
      </div>

      {/* ================= SIMULATED FAULT INJECTION SANDBOX ================= */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border-slate-800 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold block mb-1">
              SANDBOX SIMULATION CONTROLLER
            </span>
            <h2 className="text-xl font-extrabold text-slate-100">
              Simulated Fault-Injection Control Panel
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Click any scenario button to inject a hardware anomaly and observe the microgrid controller's immediate mitigating response:
            </p>
          </div>

          <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
            anyFaultActive
              ? 'bg-rose-950 text-rose-300 border-rose-500/40 animate-pulse'
              : 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
          }`}>
            {anyFaultActive ? 'ANOMALY INJECTED & MITIGATING' : 'ALL SYSTEMS NOMINAL'}
          </span>
        </div>

        {/* 5 Fault Injection Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          {/* Fault 1: High Temp */}
          <button
            type="button"
            onClick={() => toggleFault('highTemp')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              faults.highTemp
                ? 'bg-rose-950/70 border-rose-500 text-rose-200 glow-rose'
                : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Thermometer className={`w-5 h-5 ${faults.highTemp ? 'text-rose-400 animate-bounce' : 'text-slate-400'}`} />
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                faults.highTemp ? 'bg-rose-900 text-rose-200 font-bold' : 'bg-slate-800 text-slate-400'
              }`}>
                {faults.highTemp ? 'ACTIVE' : 'OFF'}
              </span>
            </div>
            <strong className="text-xs block text-slate-100">1. High Battery Temp</strong>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Simulate 56°C thermal excursion (&gt;52°C cutoff threshold).
            </span>
          </button>

          {/* Fault 2: Low SOC */}
          <button
            type="button"
            onClick={() => toggleFault('lowSoc')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              faults.lowSoc
                ? 'bg-amber-950/70 border-amber-500 text-amber-200 glow-solar'
                : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Battery className={`w-5 h-5 ${faults.lowSoc ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`} />
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                faults.lowSoc ? 'bg-amber-900 text-amber-200 font-bold' : 'bg-slate-800 text-slate-400'
              }`}>
                {faults.lowSoc ? 'ACTIVE' : 'OFF'}
              </span>
            </div>
            <strong className="text-xs block text-slate-100">2. Critical Low SOC</strong>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Simulate 11% pack charge (&lt;15% reserve limit).
            </span>
          </button>

          {/* Fault 3: Solar Drop */}
          <button
            type="button"
            onClick={() => toggleFault('solarDrop')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              faults.solarDrop
                ? 'bg-cyan-950/70 border-cyan-500 text-cyan-200 glow-cyan'
                : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Sun className={`w-5 h-5 ${faults.solarDrop ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                faults.solarDrop ? 'bg-cyan-900 text-cyan-200 font-bold' : 'bg-slate-800 text-slate-400'
              }`}>
                {faults.solarDrop ? 'ACTIVE' : 'OFF'}
              </span>
            </div>
            <strong className="text-xs block text-slate-100">3. Sudden Solar Drop</strong>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Simulate 85% instantaneous irradiance drop (thick cloud).
            </span>
          </button>

          {/* Fault 4: Sensor Disconnect */}
          <button
            type="button"
            onClick={() => toggleFault('sensorDisconnect')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              faults.sensorDisconnect
                ? 'bg-rose-950/70 border-rose-500 text-rose-200 glow-rose'
                : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Cpu className={`w-5 h-5 ${faults.sensorDisconnect ? 'text-rose-400 animate-spin' : 'text-slate-400'}`} />
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                faults.sensorDisconnect ? 'bg-rose-900 text-rose-200 font-bold' : 'bg-slate-800 text-slate-400'
              }`}>
                {faults.sensorDisconnect ? 'ACTIVE' : 'OFF'}
              </span>
            </div>
            <strong className="text-xs block text-slate-100">4. Sensor Lost</strong>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Simulate ESP32 I2C bus loss / telemetry timeout.
            </span>
          </button>

          {/* Fault 5: Grid Outage */}
          <button
            type="button"
            onClick={() => toggleFault('gridOutage')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              faults.gridOutage
                ? 'bg-purple-950/70 border-purple-500 text-purple-200'
                : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Radio className={`w-5 h-5 ${faults.gridOutage ? 'text-purple-400' : 'text-slate-400'}`} />
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                faults.gridOutage ? 'bg-purple-900 text-purple-200 font-bold' : 'bg-slate-800 text-slate-400'
              }`}>
                {faults.gridOutage ? 'ACTIVE' : 'OFF'}
              </span>
            </div>
            <strong className="text-xs block text-slate-100">5. Grid Outage</strong>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Simulate utility blackout; trigger islanded microgrid.
            </span>
          </button>

        </div>

        {/* Real-Time System Mitigation Breakdown */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block">
            AUTOMATED MITIGATION STATUS & HARDWARE INTERLOCK LOG
          </span>
          
          <div className="space-y-2 text-xs">
            {faults.highTemp && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong>THERMAL TRIP INTERLOCK ACTIVATED:</strong> Pack temperature (56°C) exceeds safety limit (52°C). Solid-state contactor commanded OPEN. Battery charge and discharge halted to prevent thermal runaway. EVSE throttled to direct solar only.
                </div>
              </div>
            )}

            {faults.lowSoc && (
              <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-200 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong>DEEP-DISCHARGE PREVENTION ENGAGED:</strong> Battery SOC (11%) dropped below the 15% safety floor. Discharge arrested immediately to prevent cathode copper dissolution. Load shifted to grid backup or throttled.
                </div>
              </div>
            )}

            {faults.solarDrop && (
              <div className="p-3 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-200 flex items-start gap-2.5">
                <Sun className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong>TRANSIENT LOAD SHIELDING ACTIVE:</strong> Solar generation dropped by 85%. Inverter immediately commanded BESS battery to ramp up discharge power, seamlessly absorbing the deficit with zero EV charge interruption.
                </div>
              </div>
            )}

            {faults.sensorDisconnect && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 flex items-start gap-2.5">
                <Cpu className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong>FAIL-SAFE AUTONOMOUS FALLBACK:</strong> Heartbeat lost on ESP32 I2C sensor bus. Controller de-rates EVSE charging pilot to a conservative baseline (6A / 1.4 kW) to prevent conductor overcurrent while awaiting telemetry reconnection.
                </div>
              </div>
            )}

            {faults.gridOutage && (
              <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-500/40 text-purple-200 flex items-start gap-2.5">
                <Radio className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <strong>ANTI-ISLANDING TRANSFER SWITCH OPEN:</strong> Grid frequency/voltage drop detected. Transfer switch isolates station from utility grid (preventing back-feeding danger to line workers). Station continues operating autonomously.
                </div>
              </div>
            )}

            {!anyFaultActive && (
              <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>All parameters nominal. Thermal: 28°C • SOC: {state.batterySoc}% • Telemetry: OK • Grid: Synced.</span>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ================= COMPREHENSIVE SAFETY THRESHOLDS TABLE ================= */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border-slate-800 space-y-6">
        <div>
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold block mb-1">
            HARDWARE TOLERANCES
          </span>
          <h2 className="text-xl font-extrabold text-slate-100">
            Multi-Tier Safety Limits & Reaction Times
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="py-3 px-4">Monitored Parameter</th>
                <th className="py-3 px-4">Nominal Target</th>
                <th className="py-3 px-4 text-amber-300">Warning Derate Limit</th>
                <th className="py-3 px-4 text-rose-300">Emergency Cutoff Trip</th>
                <th className="py-3 px-4">Hardware Action</th>
                <th className="py-3 px-4">Reaction Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono">
              <tr>
                <td className="py-3 px-4 font-sans font-semibold text-slate-200">Battery Cell Temp</td>
                <td className="py-3 px-4 text-slate-300">20°C – 35°C</td>
                <td className="py-3 px-4 text-amber-400">&ge; 45°C (Derate 50%)</td>
                <td className="py-3 px-4 text-rose-400 font-bold">&ge; 52°C</td>
                <td className="py-3 px-4 font-sans text-slate-300">Open solid-state contactor</td>
                <td className="py-3 px-4 text-cyan-400">&lt; 15 ms</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-sans font-semibold text-slate-200">Battery State of Charge</td>
                <td className="py-3 px-4 text-slate-300">20% – 90%</td>
                <td className="py-3 px-4 text-amber-400">&le; 20% (Low warning)</td>
                <td className="py-3 px-4 text-rose-400 font-bold">&le; 15% SOC</td>
                <td className="py-3 px-4 font-sans text-slate-300">Arrest discharge current</td>
                <td className="py-3 px-4 text-cyan-400">&lt; 50 ms</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-sans font-semibold text-slate-200">DC Bus Overvoltage</td>
                <td className="py-3 px-4 text-slate-300">48.0V – 54.4V</td>
                <td className="py-3 px-4 text-amber-400">&ge; 56.4V</td>
                <td className="py-3 px-4 text-rose-400 font-bold">&ge; 58.0V</td>
                <td className="py-3 px-4 font-sans text-slate-300">Crowbar clamp & shunt MPPT</td>
                <td className="py-3 px-4 text-cyan-400">&lt; 2 ms</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-sans font-semibold text-slate-200">Ground Fault (CCID)</td>
                <td className="py-3 px-4 text-slate-300">0.0 mA leakage</td>
                <td className="py-3 px-4 text-amber-400">&ge; 4.0 mA</td>
                <td className="py-3 px-4 text-rose-400 font-bold">&ge; 6.0 mA DC / 20 mA AC</td>
                <td className="py-3 px-4 font-sans text-slate-300">Trips dual-pole EVSE relay</td>
                <td className="py-3 px-4 text-cyan-400">&lt; 10 ms</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-sans font-semibold text-slate-200">ESP32 Telemetry Ping</td>
                <td className="py-3 px-4 text-slate-300">100 ms heartbeat</td>
                <td className="py-3 px-4 text-amber-400">&gt; 500 ms missed</td>
                <td className="py-3 px-4 text-rose-400 font-bold">&gt; 1000 ms timeout</td>
                <td className="py-3 px-4 font-sans text-slate-300">Conservative 6A pilot fallback</td>
                <td className="py-3 px-4 text-cyan-400">1000 ms</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= CONVERSION EFFICIENCY STEP-DOWN BREAKDOWN ================= */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border-slate-800 space-y-6">
        <div>
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold block mb-1">
            ENERGY BALANCE & EFFICIENCY
          </span>
          <h2 className="text-xl font-extrabold text-slate-100">
            End-to-End System Conversion Efficiency (91.8% Net)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Engineering breakdown of power conversion stages from raw photovoltaic DC input to vehicle battery storage:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase">STAGE 1: MPPT CONVERTER</span>
            <div className="text-2xl font-bold font-mono text-amber-400">98.4%</div>
            <p className="text-[11px] text-slate-400">
              Synchronous buck-boost switching losses restricted to 1.6% across 35V–150V input.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase">STAGE 2: BESS STORAGE</span>
            <div className="text-2xl font-bold font-mono text-emerald-400">93.5%</div>
            <p className="text-[11px] text-slate-400">
              LiFePO4 round-trip Coulombic and electrochemical internal resistance loss.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase">STAGE 3: EVSE INVERTER</span>
            <div className="text-2xl font-bold font-mono text-cyan-400">96.2%</div>
            <p className="text-[11px] text-slate-400">
              Pure sine wave bidirectional DC-AC conversion and pilot control circuitry.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/40 space-y-1 glow-cyan">
            <span className="text-[10px] font-mono text-cyan-300 uppercase">NET COUPLING EFFICIENCY</span>
            <div className="text-2xl font-bold font-mono text-cyan-300">91.8%</div>
            <p className="text-[11px] text-slate-400">
              Total system efficiency from solar photon capture to EV vehicle delivery.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
