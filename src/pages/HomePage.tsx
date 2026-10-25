import React from 'react';
import {
  Sun,
  Battery,
  Car,
  Zap,
  ArrowRight,
  ShieldCheck,
  Cpu,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Leaf,
  Layers,
  Clock,
  Compass
} from 'lucide-react';
import { HeroStationVisual } from '../components/visual/HeroStationVisual';
import { TelemetryBadge } from '../components/shared/TelemetryBadge';
import { useSimulation } from '../context/SimulationContext';

interface HomePageProps {
  setActiveTab: (tab: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setActiveTab }) => {
  const { allocation, state } = useSimulation();

  return (
    <div className="space-y-24 py-8">
      
      {/* ================= HERO SECTION ================= */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill border-cyan-500/30 text-cyan-300 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>NEXT-GEN CLEAN MOBILITY INFRASTRUCTURE</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-100 leading-[1.12]">
              Power Your Drive with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-cyan-400 to-emerald-400">
                Intelligent Solar Energy.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              SolarCharge AI combines renewable generation, battery storage, intelligent charging, and AI-assisted optimization into one smart energy-management platform.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Launch Energy Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('architecture')}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold glass-panel-interactive border-slate-700 text-slate-200 hover:text-cyan-300 hover:border-cyan-500/40"
              >
                <Compass className="w-4 h-4 text-cyan-400" />
                <span>Explore How It Works</span>
              </button>
            </div>

            {/* Quick Live Microgrid Snapshot */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[11px] text-slate-400 block font-mono">SOLAR OUTPUT</span>
                <span className="text-lg font-bold font-mono text-amber-400">{state.solarGenerationKw} kW</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[11px] text-slate-400 block font-mono">CLEAN RATIO</span>
                <span className="text-lg font-bold font-mono text-emerald-400">{allocation.renewableSharePercent}%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[11px] text-slate-400 block font-mono">EMISSIONS SAVED</span>
                <span className="text-lg font-bold font-mono text-cyan-400">{state.dailyEmissionsAvoidedKg.toFixed(1)} kg</span>
              </div>
            </div>
          </div>

          {/* Right Visual Column */}
          <div className="lg:col-span-6">
            <HeroStationVisual />
          </div>

        </div>
      </section>

      {/* ================= CORE PROBLEM STATEMENT ================= */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs font-mono mb-3">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>THE INFRASTRUCTURE BOTTLENECK</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight">
            The Fundamental Challenges of Conventional EV Charging
          </h2>
          <p className="text-slate-400 text-sm mt-3 leading-relaxed">
            As global electric vehicle adoption accelerates, standard unmanaged charging infrastructure places severe strain on municipal grids, exacerbates peak demand charges, and frequently fails to capture on-site clean solar energy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="glass-panel p-6 rounded-2xl border-rose-500/20 relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4">
              <Sun className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-200">1. Solar Intermittency</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Photovoltaic generation fluctuates drastically with passing clouds, seasonal azimuth shifts, and diurnal daylight cycles, resulting in unstable direct charging power without intelligent buffers.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border-rose-500/20 relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-200">2. Demand-Generation Mismatch</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Peak solar insolation occurs during mid-day (11:00 AM – 2:00 PM), whereas commuter vehicle charging surges in the early morning and late evening when solar output is minimal or absent.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border-rose-500/20 relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-200">3. Wasted Clean Surplus</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Without synchronized battery storage and dynamic load management, substantial solar energy is curtailed or dumped back into the grid at negligible or negative feed-in compensation rates.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border-rose-500/20 relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-200">4. Grid Strain & Peak Tariffs</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Uncontrolled simultaneous EV charging creates steep electrical peak loads, escalating commercial demand charges by up to 40% and relying heavily on fossil-fueled peaker plants.
            </p>
          </div>

        </div>
      </section>

      {/* ================= THE SOLARCHANGE AI SOLUTION ================= */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-mono mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>ARCHITECTURAL BREAKTHROUGH</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight">
            The SolarCharge AI Solution: 4 Integrated Pillars
          </h2>
          <p className="text-slate-400 text-sm mt-3 leading-relaxed">
            An end-to-end coordinated system uniting high-efficiency power electronics, LiFePO4 battery energy storage, IoT edge telemetry, and AI-assisted power arbitration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="glass-panel-interactive p-6 rounded-2xl border-amber-500/30 relative">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
              <Sun className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">1. Smart PV Capture</h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              MPPT tracking algorithms maintain the solar array at its true maximum power point, extracting 98.4% peak solar energy into a common DC microgrid bus.
            </p>
          </div>

          <div className="glass-panel-interactive p-6 rounded-2xl border-emerald-500/30 relative">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
              <Battery className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">2. LiFePO4 Energy Reservoir</h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Safe 48V Lithium Iron Phosphate battery pack acts as an energy sponge, absorbing generation surges and smoothing EV charging without grid stress.
            </p>
          </div>

          <div className="glass-panel-interactive p-6 rounded-2xl border-cyan-500/30 relative">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">3. AI Dispatch Optimizer</h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Rule-based deterministic engine paired with 24-hour predictive models arbitrates power in real-time to maximize solar consumption and battery longevity.
            </p>
          </div>

          <div className="glass-panel-interactive p-6 rounded-2xl border-purple-500/30 relative">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">4. Islanding & Grid Decoupler</h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Autonomous microgrid control allows the charging station to operate off-grid during grid blackouts or peak tariff spikes with zero service disruption.
            </p>
          </div>

        </div>
      </section>

      {/* ================= HOW IT WORKS: INTERACTIVE 4-STEP FLOW ================= */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border-slate-800">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-semibold block mb-2">
              REAL-TIME OPERATIONAL WORKFLOW
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
              How Energy Flows Through SolarCharge AI
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 relative">
              <span className="text-xs font-mono text-amber-400 font-bold block mb-2">STEP 01</span>
              <h4 className="text-sm font-bold text-slate-100 mb-1">Harvest Photons</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Solar panels convert sunlight to DC electricity. The MPPT buck-boost stage tracks maximum efficiency and delivers stable 48V to the bus.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 relative">
              <span className="text-xs font-mono text-cyan-400 font-bold block mb-2">STEP 02</span>
              <h4 className="text-sm font-bold text-slate-100 mb-1">ESP32 Telemetry</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                INA219 sensors and thermistors measure solar current, battery pack voltage, and EV draw at 10Hz, publishing encrypted JSON telemetry.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 relative">
              <span className="text-xs font-mono text-emerald-400 font-bold block mb-2">STEP 03</span>
              <h4 className="text-sm font-bold text-slate-100 mb-1">AI Power Dispatch</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                The algorithm decides power distribution: direct solar to EV, surplus to battery, or discharge battery to prevent grid import.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 relative">
              <span className="text-xs font-mono text-purple-400 font-bold block mb-2">STEP 04</span>
              <h4 className="text-sm font-bold text-slate-100 mb-1">Controlled EV Delivery</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                The smart EVSE modulates pilot PWM signal to match clean energy output. The user monitors the session on the live dashboard.
              </p>
            </div>

          </div>

          <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Conservation of Energy strictly audited in real-time ($P_{`in`} = P_{`out`}$)</span>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('simulator')}
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors"
            >
              <span>Test with Custom Values in Simulator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* ================= BEFORE VS AFTER STORYBOARD ================= */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-mono text-amber-400 uppercase tracking-widest font-semibold block mb-2">
            TRANSFORMATIVE USER EXPERIENCE
          </span>
          <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight">
            The Before & After Charging Experience
          </h2>
          <p className="text-slate-400 text-sm mt-3 leading-relaxed">
            See how SolarCharge AI shifts the user experience from blind grid dependency to complete energy transparency and clean-fuel autonomy.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* BEFORE CARD */}
          <div className="glass-panel p-8 rounded-3xl border-rose-500/30 relative">
            <div className="flex items-center justify-between mb-6">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-950/80 border border-rose-500/40 text-rose-300">
                BEFORE: CONVENTIONAL UNMANAGED CHARGING
              </span>
              <AlertTriangle className="w-5 h-5 text-rose-400" />
            </div>

            <div className="space-y-4 text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-rose-400 mt-2 shrink-0" />
                <div>
                  <strong className="text-slate-100 block">Zero Source Visibility</strong>
                  <span className="text-xs text-slate-400">User plugs in with no knowledge of whether power comes from coal peakers or intermittent solar.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-rose-400 mt-2 shrink-0" />
                <div>
                  <strong className="text-slate-100 block">Severe Grid Dependence & High Tariffs</strong>
                  <span className="text-xs text-slate-400">Station draws high peak wattage directly from the grid, incurring maximum Time-of-Use rates.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-rose-400 mt-2 shrink-0" />
                <div>
                  <strong className="text-slate-100 block">Wasted Solar Generation</strong>
                  <span className="text-xs text-slate-400">Surplus photovoltaic generation during mid-day is curtailed without battery storage.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-rose-400 mt-2 shrink-0" />
                <div>
                  <strong className="text-slate-100 block">Blackout Vulnerability</strong>
                  <span className="text-xs text-slate-400">Grid failure shuts down charging immediately, leaving vehicles stranded even on sunny days.</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-xs font-mono text-rose-300">
              Average Renewable Share: &lt; 20% &bull; Grid Demand Charge: High
            </div>
          </div>

          {/* AFTER CARD */}
          <div className="glass-panel p-8 rounded-3xl border-emerald-500/40 relative glow-emerald">
            <div className="flex items-center justify-between mb-6">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
                AFTER: SOLARCHANGE AI ORCHESTRATION
              </span>
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>

            <div className="space-y-4 text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 shrink-0" />
                <div>
                  <strong className="text-slate-100 block">Complete Real-Time Telemetry</strong>
                  <span className="text-xs text-slate-400">Driver views exact solar generation, battery SOC, charging rate, and verified CO₂ savings in real time.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 shrink-0" />
                <div>
                  <strong className="text-slate-100 block">Peak Shaving & Tariff Minimization</strong>
                  <span className="text-xs text-slate-400">LiFePO4 battery buffers peak load; grid backup is engaged strictly as a minimal secondary fallback.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 shrink-0" />
                <div>
                  <strong className="text-slate-100 block">100% Clean Surplus Capture</strong>
                  <span className="text-xs text-slate-400">All excess solar photons are captured into storage to charge subsequent vehicles after sunset.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 shrink-0" />
                <div>
                  <strong className="text-slate-100 block">Autonomous Islanded Resilience</strong>
                  <span className="text-xs text-slate-400">If the municipal grid drops, microgrid switches to island mode seamlessly with zero interruption.</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-xs font-mono text-emerald-300">
              Target Renewable Share: Up to 95% &bull; Grid Demand Charge: Shaved by ~70%
            </div>
          </div>

        </div>
      </section>

      {/* ================= FINAL CALL TO ACTION ================= */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-500/30 text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
              Ready to Test the Future of Solar-Powered EV Charging?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Explore live simulated telemetry, evaluate the AI energy management rules, inject thermal faults, and review the hardware implementation roadmap.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                className="px-6 py-3 rounded-xl text-sm font-bold bg-cyan-400 hover:bg-cyan-300 text-slate-950 transition-all shadow-lg shadow-cyan-500/20"
              >
                Open Live Dashboard
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('simulator')}
                className="px-6 py-3 rounded-xl text-sm font-bold glass-panel border-slate-700 text-slate-200 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors"
              >
                Launch Simulator & Scenarios
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
