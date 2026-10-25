import React, { useState } from 'react';
import { Sun, Battery, Car, Cpu, Radio, ShieldCheck, Zap, Info, X } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';
import { TelemetryBadge } from './TelemetryBadge';

interface ComponentDetail {
  id: string;
  name: string;
  role: string;
  specs: string;
  inputs: string;
  outputs: string;
  safety: string;
  protocol: string;
}

const COMPONENT_DETAILS: Record<string, ComponentDetail> = {
  solar: {
    id: 'solar',
    name: 'Bifacial Monocrystalline PV Array',
    role: 'Primary clean generation source converting solar irradiance into high-voltage DC power.',
    specs: '5.0 kWp nominal array, 12x 420W modules in 2S6P string arrangement, Voc = 98V, Isc = 54A.',
    inputs: 'Solar irradiance (0–1000 W/m²), ambient air temperature.',
    outputs: 'Unregulated DC power (72V–95V DC, up to 55A).',
    safety: 'DC String Fusing (15A/1000V), Type 2 Surge Protective Device (SPD), Rapid Shutdown switch.',
    protocol: 'Hardware DC voltage/current lines, monitored by DC Hall-effect transducers.'
  },
  mppt: {
    id: 'mppt',
    name: 'MPPT Charge Controller & Buck-Boost Stage',
    role: 'Maximizes photovoltaic power harvest via Perturb & Observe (P&O) tracking and steps down voltage to 48V bus.',
    specs: '98.5% peak conversion efficiency, 150V max Voc input, 60A rated output, synchronous rectification.',
    inputs: 'Variable DC from PV array, system DC bus voltage feedback.',
    outputs: 'Regulated 48V–56V DC to battery bank and DC distribution bus.',
    safety: 'Reverse polarity protection, over-current foldback, thermal shutdown at 85°C heat-sink temp.',
    protocol: 'Modbus RS485 RTU telemetry to ESP32 supervisory node (9600 baud).'
  },
  battery: {
    id: 'battery',
    name: 'LiFePO4 Energy Reservoir (BESS)',
    role: 'Buffers intermittency, stores surplus generation, and delivers high-current discharge during peak demand.',
    specs: '10.0 kWh nominal capacity (16S 200Ah cells), 51.2V nominal, 6000+ cycle life at 80% DOD.',
    inputs: 'Charging current from MPPT controller or regulated DC bus (max 3.5 kW).',
    outputs: 'Discharge current to EVSE bidirectional inverter (max 3.5 kW continuous).',
    safety: 'Integrated Smart BMS with per-cell passive balancing, dual MOSFET solid-state contactors, 125A Class-T fuse.',
    protocol: 'CAN 2.0B bus / RS485 transmitting per-cell voltages, pack temperature, SOC, and cycle counts.'
  },
  evse: {
    id: 'evse',
    name: 'Smart EVSE / Demonstration Load',
    role: 'Modulates AC/DC pilot signal duty cycle to dynamically control vehicle charging rate based on available clean energy.',
    specs: 'Level 2 EVSE compliant with SAE J1772 / IEC 61851, 1.2 kW to 7.4 kW dynamic pilot throttling.',
    inputs: '48V DC from BESS/MPPT (via DC-AC inverter) or grid backup AC feed.',
    outputs: 'AC single-phase 230V / Type 2 Mennekes or J1772 pilot PWM control.',
    safety: 'CCID20 Ground Fault Detection (6mA DC / 20mA AC), welded contactor detection, proximity pilot interlock.',
    protocol: 'PWM Duty Cycle Control (1kHz 12V pilot) & OCPP 1.6J over WebSocket/WiFi.'
  },
  grid: {
    id: 'grid',
    name: 'Bidirectional Grid Interconnection & Transfer Switch',
    role: 'Provides auxiliary backup and islanding isolation when solar and battery reserves are depleted.',
    specs: 'Single phase 230V AC @ 50/60Hz, 32A max service connection, automatic transfer switch (ATS).',
    inputs: 'Public distribution grid AC power.',
    outputs: 'Supplemental power to EVSE when clean energy is insufficient and grid backup is enabled.',
    safety: 'Certified Anti-Islanding protection (IEEE 1547 / UL 1741), double-pole mechanical interlocked transfer switch.',
    protocol: 'Bi-directional CT energy meter with Modbus pulse counting.'
  },
  esp32: {
    id: 'esp32',
    name: 'ESP32 Dual-Core IoT Telemetry Gateway',
    role: 'Gathers millisecond-level telemetry from current, voltage, and thermal sensors and streams to AI management layer.',
    specs: 'ESP32-WROOM-32D (240MHz dual core, 520KB SRAM), 802.11 b/g/n Wi-Fi + BLE 4.2.',
    inputs: 'INA219 I2C high-side current sensors, DS18B20 1-Wire temperature probes, voltage dividers.',
    outputs: 'MQTT JSON payloads to cloud/edge broker, local OLED status display, emergency trip relays.',
    safety: 'Optocoupler galvanic isolation on all sensor inputs, hardware watchdog timer (1000ms reset).',
    protocol: 'MQTT over TLS 1.3 / HTTP REST endpoints, sampling rate 10Hz.'
  },
  ai: {
    id: 'ai',
    name: 'SolarCharge AI Dispatch Optimizer',
    role: 'Executes real-time rule-based arbitration and predictive machine learning models to maximize solar self-consumption.',
    specs: 'Dual-tier architecture: Local Edge deterministic arbitration (<5ms latency) + Cloud predictive forecast engine.',
    inputs: 'Live telemetry from ESP32, solar forecast APIs, user priority weights, TOU tariff schedules.',
    outputs: 'EVSE pilot setpoints (A), BESS charge/discharge commands (kW), grid dispatch recommendations.',
    safety: 'Deterministic hard-coded safety limits override AI decisions if thermal or voltage boundaries are violated.',
    protocol: 'Secure REST / WebSocket telemetry ingestion.'
  }
};

export const EnergyFlowDiagram: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { allocation, state, batteryTelemetry } = useSimulation();
  const [selectedComponent, setSelectedComponent] = useState<ComponentDetail | null>(null);

  const isReducedMotion = state.isReducedMotion;
  const solarKw = state.faults.solarDrop ? Math.max(0.2, state.solarGenerationKw * 0.15) : state.solarGenerationKw;
  const isChargingBattery = allocation.solarToBatteryKw > 0;
  const isDischargingBattery = allocation.batteryDischargeToLoadKw > 0;
  const isImportingGrid = allocation.gridToLoadKw > 0;
  const isSolarToLoad = allocation.solarToLoadKw > 0;

  return (
    <div className={`glass-panel p-6 rounded-2xl relative overflow-hidden ${className}`}>
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-electric-400" />
            <h3 className="text-base font-bold text-slate-100 tracking-wide">
              Real-Time Dynamic Energy Flow Topology
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Interactive circuit diagram — click any subsystem node to inspect technical specifications and safety interlocks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <TelemetryBadge label="LIVE FLOW CALCULATOR" />
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-slate-800/80 border border-slate-700 text-slate-300">
            <span className={`w-2 h-2 rounded-full ${allocation.isEnergyBalanced ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
            <span>Balance: {allocation.energyBalanceDelta.toFixed(3)} kW</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas & Node Layout */}
      <div className="relative w-full overflow-x-auto">
        <div className="min-w-[720px] max-w-4xl mx-auto py-4">
          <div className="grid grid-cols-12 gap-4 items-center">
            
            {/* COLUMN 1: Sources (Solar PV & Grid) */}
            <div className="col-span-3 flex flex-col gap-8">
              
              {/* Solar Array Node */}
              <button
                type="button"
                onClick={() => setSelectedComponent(COMPONENT_DETAILS.solar)}
                className="group relative p-4 rounded-xl text-left transition-all duration-200 glass-panel-interactive border-amber-500/30 hover:border-amber-400 hover:glow-solar"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                    <Sun className={`w-6 h-6 ${!isReducedMotion ? 'animate-spin-slow' : ''}`} />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/30">
                    SOLAR PV
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-200">Solar PV Array</div>
                <div className="text-xl font-bold font-mono text-amber-400 mt-1">
                  {solarKw.toFixed(2)} <span className="text-xs text-slate-400 font-normal">kW</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                  <Info className="w-3 h-3 text-amber-400/80" />
                  <span>Click for specs</span>
                </div>
              </button>

              {/* Grid Interconnection Node */}
              <button
                type="button"
                onClick={() => setSelectedComponent(COMPONENT_DETAILS.grid)}
                className={`group relative p-4 rounded-xl text-left transition-all duration-200 glass-panel-interactive ${
                  isImportingGrid ? 'border-purple-500/40' : 'border-slate-700/60 opacity-80'
                } hover:border-purple-400`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg ${isImportingGrid ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-800 text-slate-400'}`}>
                    <Radio className="w-6 h-6" />
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    state.gridBackupEnabled && !state.faults.gridOutage
                      ? 'bg-purple-950/80 text-purple-300 border-purple-500/30'
                      : 'bg-rose-950/80 text-rose-300 border-rose-500/30'
                  }`}>
                    {state.faults.gridOutage ? 'ISLANDED' : (state.gridBackupEnabled ? 'GRID READY' : 'OFFLINE')}
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-200">Grid Interconnect</div>
                <div className="text-xl font-bold font-mono text-purple-400 mt-1">
                  {allocation.gridToLoadKw.toFixed(2)} <span className="text-xs text-slate-400 font-normal">kW</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {isImportingGrid ? 'Active import buffer' : 'Zero grid reliance'}
                </div>
              </button>

            </div>

            {/* COLUMN 2: Central Power Management & Telemetry Hub */}
            <div className="col-span-5 flex flex-col items-center justify-center gap-4 relative">
              
              {/* MPPT & Power Hub */}
              <button
                type="button"
                onClick={() => setSelectedComponent(COMPONENT_DETAILS.mppt)}
                className="w-full p-4 rounded-xl text-left transition-all duration-200 glass-panel-interactive border-electric-500/40 hover:border-electric-400 hover:glow-cyan"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-electric-500/20 text-electric-400">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                    MPPT CONVERTER
                  </span>
                </div>
                <div className="text-sm font-bold text-slate-100">Smart Power Electronics</div>
                <div className="text-xs text-slate-300 mt-0.5">High-efficiency DC-DC 48V Bus</div>
                <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-slate-800 text-[11px] font-mono">
                  <div>
                    <span className="text-slate-400 block">Harvested:</span>
                    <span className="text-amber-400 font-semibold">{solarKw.toFixed(2)} kW</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Efficiency:</span>
                    <span className="text-emerald-400 font-semibold">98.4%</span>
                  </div>
                </div>
              </button>

              {/* Dynamic Energy Distribution Vector (SVG wires) */}
              <div className="w-full h-14 relative flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 320 60" fill="none" preserveAspectRatio="none">
                  {/* Central Bus Bar */}
                  <line x1="20" y1="30" x2="300" y2="30" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
                  
                  {/* Active Solar to Battery / Load pulse */}
                  {isSolarToLoad && (
                    <line
                      x1="20"
                      y1="30"
                      x2="300"
                      y2="30"
                      stroke="#22d3ee"
                      strokeWidth="4"
                      strokeDasharray="6 8"
                      className={!isReducedMotion ? 'animate-flow-normal' : ''}
                      strokeLinecap="round"
                    />
                  )}
                  {isChargingBattery && (
                    <line
                      x1="160"
                      y1="30"
                      x2="160"
                      y2="60"
                      stroke="#10b981"
                      strokeWidth="4"
                      strokeDasharray="6 8"
                      className={!isReducedMotion ? 'animate-flow-normal' : ''}
                      strokeLinecap="round"
                    />
                  )}
                  {isDischargingBattery && (
                    <line
                      x1="160"
                      y1="60"
                      x2="160"
                      y2="30"
                      stroke="#06b6d4"
                      strokeWidth="4"
                      strokeDasharray="6 8"
                      className={!isReducedMotion ? 'animate-flow-reverse' : ''}
                      strokeLinecap="round"
                    />
                  )}
                </svg>
                <div className="absolute px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-slate-900 border border-slate-700 text-slate-300">
                  48V DC BUS INTERFACE
                </div>
              </div>

              {/* BESS Battery Storage Node */}
              <button
                type="button"
                onClick={() => setSelectedComponent(COMPONENT_DETAILS.battery)}
                className={`w-full p-4 rounded-xl text-left transition-all duration-200 glass-panel-interactive ${
                  isChargingBattery ? 'border-emerald-500/40 hover:glow-emerald' : (isDischargingBattery ? 'border-cyan-500/40 hover:glow-cyan' : 'border-slate-700/60')
                } hover:border-emerald-400`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg ${
                    isChargingBattery ? 'bg-emerald-500/20 text-emerald-400' : (isDischargingBattery ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-400')
                  }`}>
                    <Battery className="w-6 h-6" />
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    batteryTelemetry.status === 'thermal_cutoff'
                      ? 'bg-rose-950 text-rose-300 border-rose-500/40'
                      : (isChargingBattery ? 'bg-emerald-950 text-emerald-300 border-emerald-500/30' : (isDischargingBattery ? 'bg-cyan-950 text-cyan-300 border-cyan-500/30' : 'bg-slate-800 text-slate-300 border-slate-600'))
                  }`}>
                    {batteryTelemetry.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-slate-200">LiFePO4 Battery Bank</div>
                  <div className="text-xs font-mono font-bold text-slate-100">{batteryTelemetry.voltageV}V</div>
                </div>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-2xl font-bold font-mono text-emerald-400">
                    {state.batterySoc.toFixed(0)}% <span className="text-xs text-slate-400 font-normal">SOC</span>
                  </span>
                  <span className="text-xs font-mono text-slate-300">
                    {batteryTelemetry.storedKwh} / {state.batteryCapacityKwh} kWh
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
                  <div
                    className={`h-full transition-all duration-500 ${
                      state.batterySoc < 20 ? 'bg-rose-500' : (state.batterySoc > 80 ? 'bg-emerald-400' : 'bg-cyan-400')
                    }`}
                    style={{ width: `${state.batterySoc}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                  <span>Temp: <strong className={state.batteryTempC >= 45 ? 'text-amber-400' : 'text-slate-300'}>{batteryTelemetry.temperatureC}°C</strong></span>
                  <span>Net: <strong className={allocation.batteryNetPowerKw > 0 ? 'text-emerald-400' : (allocation.batteryNetPowerKw < 0 ? 'text-cyan-400' : 'text-slate-400')}>
                    {allocation.batteryNetPowerKw > 0 ? `+${allocation.batteryNetPowerKw}` : allocation.batteryNetPowerKw} kW
                  </strong></span>
                </div>
              </button>

            </div>

            {/* COLUMN 3: Sinks (EV Charger & Load) */}
            <div className="col-span-4 flex flex-col gap-4">
              
              {/* EVSE Load Node */}
              <button
                type="button"
                onClick={() => setSelectedComponent(COMPONENT_DETAILS.evse)}
                className="group relative p-5 rounded-xl text-left transition-all duration-200 glass-panel-interactive border-cyan-500/30 hover:border-cyan-400 hover:glow-cyan"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                    <Car className="w-7 h-7" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                    EVSE / LOAD
                  </span>
                </div>
                <div className="text-sm font-bold text-slate-100">Smart EV Charger</div>
                <div className="text-xs text-slate-400 mt-0.5">Connected EV Demand: {state.chargingDemandKw} kW</div>
                
                <div className="text-2xl font-bold font-mono text-cyan-400 mt-2">
                  {allocation.totalLoadDeliveredKw.toFixed(2)} <span className="text-xs text-slate-400 font-normal">kW Delivered</span>
                </div>

                {/* Delivered Power Mix */}
                <div className="mt-3 pt-3 border-t border-slate-800 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-slate-300">
                    <span className="flex items-center gap-1.5 text-amber-400">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      Solar Direct:
                    </span>
                    <span>{allocation.solarToLoadKw.toFixed(2)} kW</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      Battery Support:
                    </span>
                    <span>{allocation.batteryDischargeToLoadKw.toFixed(2)} kW</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="flex items-center gap-1.5 text-purple-400">
                      <span className="w-2 h-2 rounded-full bg-purple-400" />
                      Grid Import:
                    </span>
                    <span>{allocation.gridToLoadKw.toFixed(2)} kW</span>
                  </div>
                </div>

                <div className="mt-3 p-2 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400">Renewable Purity:</span>
                  <span className="text-emerald-400 font-bold">{allocation.renewableSharePercent}%</span>
                </div>
              </button>

              {/* Edge Telemetry & AI Gateway Indicator */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedComponent(COMPONENT_DETAILS.esp32)}
                  className="p-3 rounded-xl glass-panel-interactive border-slate-700 text-left hover:border-cyan-400"
                >
                  <div className="flex items-center gap-1.5 text-slate-300 text-xs font-semibold mb-1">
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                    <span>ESP32 Node</span>
                  </div>
                  <div className="text-[10px] text-slate-400">INA219 10Hz Telemetry</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedComponent(COMPONENT_DETAILS.ai)}
                  className="p-3 rounded-xl glass-panel-interactive border-slate-700 text-left hover:border-emerald-400"
                >
                  <div className="flex items-center gap-1.5 text-slate-300 text-xs font-semibold mb-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>AI Manager</span>
                  </div>
                  <div className="text-[10px] text-slate-400">Real-time Optimization</div>
                </button>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* Detail Inspector Modal / Drawer */}
      {selectedComponent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="glass-panel w-full max-w-lg p-6 rounded-2xl border-cyan-500/40 relative shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedComponent(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-2">
              <span className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
                <Zap className="w-5 h-5" />
              </span>
              <div>
                <h4 className="text-base font-bold text-slate-100">{selectedComponent.name}</h4>
                <span className="text-[11px] font-mono uppercase text-cyan-400 tracking-wider">Subsystem Architecture Spec</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 mt-2 mb-4 leading-relaxed">
              {selectedComponent.role}
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 font-mono block text-[11px]">ELECTRICAL SPECIFICATIONS</span>
                <span className="text-slate-200 mt-0.5 block">{selectedComponent.specs}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400 font-mono block text-[11px]">INPUT PARAMETERS</span>
                  <span className="text-slate-200 mt-0.5 block">{selectedComponent.inputs}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400 font-mono block text-[11px]">OUTPUT RATINGS</span>
                  <span className="text-slate-200 mt-0.5 block">{selectedComponent.outputs}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-emerald-400 font-mono block text-[11px]">SAFETY & PROTECTION INTERLOCKS</span>
                <span className="text-slate-200 mt-0.5 block">{selectedComponent.safety}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-cyan-400 font-mono block text-[11px]">COMMUNICATION PROTOCOL</span>
                <span className="text-slate-200 font-mono text-[11px] mt-0.5 block">{selectedComponent.protocol}</span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedComponent(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
