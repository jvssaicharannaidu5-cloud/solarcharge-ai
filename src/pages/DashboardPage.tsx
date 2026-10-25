import React from 'react';
import {
  Sun,
  Battery,
  Car,
  Radio,
  Leaf,
  AlertTriangle,
  RotateCcw,
  Clock,
  Zap,
  TrendingUp,
  Sliders,
  CheckCircle2,
  X,
  Gauge
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
import { StatCard } from '../components/shared/StatCard';
import { EnergyFlowDiagram } from '../components/shared/EnergyFlowDiagram';
import { TelemetryBadge } from '../components/shared/TelemetryBadge';

interface DashboardPageProps {
  setActiveTab: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ setActiveTab }) => {
  const {
    state,
    allocation,
    batteryTelemetry,
    evTelemetry,
    alerts,
    telemetryLogs,
    dismissAlert,
    setTimeFilter,
    resetSimulation
  } = useSimulation();

  return (
    <div className="space-y-8 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* ================= DASHBOARD HEADER ================= */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              Live Energy Telemetry & Control Dashboard
            </h1>
            <TelemetryBadge label="SIMULATED DEMO DATA" />
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time monitoring of solar PV production, 48V LiFePO4 battery pack, EV charging power, and municipal grid interaction.
          </p>
        </div>

        {/* Time Filters & Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-mono">
            {(['live', 'today', 'week', 'month'] as const).map(filter => (
              <button
                key={filter}
                type="button"
                onClick={() => setTimeFilter(filter)}
                className={`px-3 py-1 rounded-lg uppercase tracking-wider font-semibold transition-colors ${
                  state.timeFilter === filter
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {filter === 'live' ? '● Live' : filter}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={resetSimulation}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            title="Reset telemetry counters and parameters to defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* ================= PRIMARY TELEMETRY STRIP (5 KEY CARDS) ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Solar Generation */}
        <StatCard
          title="Solar Generation"
          value={state.faults.solarDrop ? Math.max(0.2, (state.solarGenerationKw * 0.15)).toFixed(2) : state.solarGenerationKw.toFixed(2)}
          unit="kW"
          icon={Sun}
          subtext={`Daily: ${state.dailySolarGeneratedKwh.toFixed(1)} kWh harvest`}
          badge={state.solarGenerationKw > 2.5 ? 'HIGH SOLAR' : 'MODERATE'}
          badgeColor="amber"
          glowColor="solar"
        />

        {/* Battery SOC */}
        <StatCard
          title="BESS Battery Pack"
          value={`${state.batterySoc.toFixed(0)}%`}
          unit={`(${batteryTelemetry.storedKwh} kWh)`}
          icon={Battery}
          subtext={`${batteryTelemetry.voltageV}V nominal • ${batteryTelemetry.temperatureC}°C`}
          badge={batteryTelemetry.status.toUpperCase()}
          badgeColor={batteryTelemetry.status === 'charging' ? 'emerald' : (batteryTelemetry.status === 'discharging' ? 'cyan' : 'slate')}
          glowColor="emerald"
        />

        {/* EV Charging Power */}
        <StatCard
          title="EV Load Delivered"
          value={allocation.totalLoadDeliveredKw.toFixed(2)}
          unit="kW"
          icon={Car}
          subtext={`Session: ${state.sessionEnergyKwh.toFixed(1)} kWh • ${evTelemetry.status}`}
          badge={state.chargingMode.toUpperCase().replace('_', ' ')}
          badgeColor="cyan"
          glowColor="cyan"
        />

        {/* Grid Import */}
        <StatCard
          title="Grid Import Backup"
          value={allocation.gridToLoadKw.toFixed(2)}
          unit="kW"
          icon={Radio}
          subtext={`Total imported: ${state.dailyGridImportedKwh.toFixed(1)} kWh`}
          badge={allocation.gridToLoadKw > 0 ? 'SUPPLEMENTING' : 'ISLANDED / 0 kW'}
          badgeColor={allocation.gridToLoadKw > 0 ? 'rose' : 'emerald'}
        />

        {/* Clean Renewable Share */}
        <StatCard
          title="Clean Energy Purity"
          value={`${allocation.renewableSharePercent}%`}
          icon={Leaf}
          subtext={`CO₂ avoided: ${state.dailyEmissionsAvoidedKg.toFixed(1)} kg`}
          badge={`${allocation.renewableSharePercent >= 80 ? 'EXCELLENT' : 'GRID-MIXED'}`}
          badgeColor={allocation.renewableSharePercent >= 80 ? 'emerald' : 'amber'}
          glowColor="emerald"
        />

      </div>

      {/* ================= INTERACTIVE ENERGY FLOW TOPOLOGY ================= */}
      <EnergyFlowDiagram />

      {/* ================= DETAILED TELEMETRY CHARTS & ALERTS GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (8 cols): Power Telemetry Charts */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Power Curves Chart */}
          <div className="glass-panel p-6 rounded-2xl border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  <span>Real-Time Power Balance Dynamics (kW)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Synchronous multi-channel telemetry curve: Solar generation vs EV load delivered vs Grid import.
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-amber-400">
                  <span className="w-2.5 h-2.5 rounded-sm bg-amber-400" /> Solar kW
                </span>
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400" /> EV Load kW
                </span>
                <span className="flex items-center gap-1.5 text-purple-400">
                  <span className="w-2.5 h-2.5 rounded-sm bg-purple-400" /> Grid Import kW
                </span>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={telemetryLogs} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="solarFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="loadFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gridFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="timestamp" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={[0, 6]} unit=" kW" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px', fontFamily: 'monospace' }}
                  />
                  <Area type="monotone" dataKey="solarKw" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#solarFill)" name="Solar PV" />
                  <Area type="monotone" dataKey="loadKw" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#loadFill)" name="EV Demand" />
                  <Area type="monotone" dataKey="gridKw" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#gridFill)" name="Grid Import" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Secondary Chart: Battery SOC & Voltage Profile */}
          <div className="glass-panel p-6 rounded-2xl border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Battery className="w-4 h-4 text-emerald-400" />
                  <span>LiFePO4 Battery Pack State of Charge (%)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Pack buffer capacity management to prevent overcharge (&gt;98%) and deep-cycle stress (&lt;15%).
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                Current: {state.batterySoc.toFixed(1)}% SOC
              </span>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={telemetryLogs} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="timestamp" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={[0, 100]} unit="%" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px', fontFamily: 'monospace' }}
                  />
                  <Line type="monotone" dataKey="batterySoc" stroke="#10b981" strokeWidth={2.5} dot={false} name="Battery SOC (%)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Right Column (4 cols): Live System Alerts & Battery Health Inspector */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Active Alerts Panel */}
          <div className="glass-panel p-6 rounded-2xl border-slate-800">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <AlertTriangle className={`w-4 h-4 ${alerts.length > 0 ? 'text-amber-400' : 'text-slate-400'}`} />
                <h3 className="text-sm font-bold text-slate-100">Live System Alerts</h3>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {alerts.length} Active
              </span>
            </div>

            {alerts.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400/60" />
                <span>All subsystems reporting nominal parameters.</span>
                <span className="text-[11px] text-slate-500">No thermal, voltage, or communication alerts.</span>
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {alerts.map(alert => {
                  const severityClasses = {
                    critical: 'bg-rose-950/80 border-rose-500/50 text-rose-200',
                    warning: 'bg-amber-950/80 border-amber-500/50 text-amber-200',
                    info: 'bg-cyan-950/80 border-cyan-500/50 text-cyan-200'
                  }[alert.severity];

                  return (
                    <div
                      key={alert.id}
                      className={`p-3.5 rounded-xl border relative text-xs transition-all ${severityClasses}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider font-bold block mb-0.5 opacity-90">
                            [{alert.source}] {alert.severity}
                          </span>
                          <strong className="block font-semibold text-slate-100 text-xs">
                            {alert.title}
                          </strong>
                          <p className="mt-1 text-[11px] opacity-90 leading-relaxed">
                            {alert.message}
                          </p>
                          <span className="mt-2 block text-[9px] font-mono opacity-70">
                            Logged: {alert.timestamp}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => dismissAlert(alert.id)}
                          className="p-1 rounded hover:bg-slate-800/60 text-slate-400 hover:text-slate-100 transition-colors"
                          title="Dismiss alert"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-[11px]">
              <span className="text-slate-500">Simulate anomalies in Safety tab</span>
              <button
                type="button"
                onClick={() => setActiveTab('safety')}
                className="text-cyan-400 hover:text-cyan-300 font-semibold"
              >
                Fault Injector &rarr;
              </button>
            </div>
          </div>

          {/* Subsystem Health Status Inspector */}
          <div className="glass-panel p-6 rounded-2xl border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Gauge className="w-4 h-4 text-cyan-400" />
                <span>BESS Condition (Simulated)</span>
              </h3>
              <TelemetryBadge compact />
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400">Pack State of Health (SOH):</span>
                <span className="font-mono font-bold text-emerald-400">{batteryTelemetry.stateOfHealthPercent}% (Nominal)</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400">Operating Temperature:</span>
                <span className={`font-mono font-bold ${batteryTelemetry.temperatureC >= 45 ? 'text-amber-400' : 'text-slate-200'}`}>
                  {batteryTelemetry.temperatureC}°C ({batteryTelemetry.temperatureC >= 52 ? 'Cutoff' : 'Safe Range'})
                </span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400">C-Rate Power Stress:</span>
                <span className="font-mono font-bold text-slate-200">{batteryTelemetry.cRate} C (Limit: 0.35 C)</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400">Active Bus Current:</span>
                <span className="font-mono font-bold text-cyan-400">{batteryTelemetry.currentA} A DC</span>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-400 leading-relaxed">
              * Note: Health metrics are continuously computed via Coulomb counting and thermal Arrhenius aging approximations within the simulation model.
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
