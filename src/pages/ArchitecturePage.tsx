import React, { useState } from 'react';
import {
  Network,
  Sun,
  Battery,
  Cpu,
  Car,
  Radio,
  ShieldAlert,
  Server,
  Layers,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import { EnergyFlowDiagram } from '../components/shared/EnergyFlowDiagram';
import { TelemetryBadge } from '../components/shared/TelemetryBadge';

interface SubsystemSpec {
  id: string;
  title: string;
  layer: 'Power' | 'Sensors' | 'IoT' | 'AI' | 'UI';
  description: string;
  specs: { label: string; value: string }[];
  safety: string;
  protocols: string;
}

const SUBSYSTEM_SPECS: SubsystemSpec[] = [
  {
    id: 'pv',
    title: 'Photovoltaic Array & String Combiner',
    layer: 'Power',
    description: 'High-efficiency monocrystalline solar modules configured in series-parallel strings to provide high voltage DC input.',
    specs: [
      { label: 'Nominal Capacity', value: '5.0 kWp DC' },
      { label: 'Open Circuit Voltage (Voc)', value: '98.4 V DC' },
      { label: 'Max Power Current (Imp)', value: '52.5 A DC' },
      { label: 'Temperature Coefficient', value: '-0.35% / °C' }
    ],
    safety: '1000V DC rated isolation fuses, 40kA Type 2 Surge Protective Device (SPD), and roof-level Rapid Shutdown Initiator.',
    protocols: 'Direct DC conductor lines via MC4 waterproof connectors.'
  },
  {
    id: 'mppt',
    title: 'MPPT Synchronous Buck-Boost Converter',
    layer: 'Power',
    description: 'High-frequency switched-mode DC-DC converter executing continuous Perturb & Observe (P&O) maximum power point tracking.',
    specs: [
      { label: 'Peak Efficiency', value: '98.4% at full load' },
      { label: 'Input Voltage Range', value: '35V – 150V DC' },
      { label: 'Regulated Output Bus', value: '48.0V – 56.4V DC' },
      { label: 'Rated Output Current', value: '60 A continuous' }
    ],
    safety: 'Hardware over-voltage clamp, reverse-polarity MOSFET switch, and heatsink thermal cut-off at 85°C.',
    protocols: 'Modbus RS485 RTU interface to ESP32 gateway at 9600 baud.'
  },
  {
    id: 'bess',
    title: '48V LiFePO4 Battery Energy Storage System (BESS)',
    layer: 'Power',
    description: 'Deep-cycle Lithium Iron Phosphate rack system buffering intermittent solar generation and providing high surge current.',
    specs: [
      { label: 'Pack Energy Capacity', value: '10.0 kWh nominal' },
      { label: 'Nominal Pack Voltage', value: '51.2 V DC (16S 3.2V cells)' },
      { label: 'Max Continuous C-Rate', value: '0.35 C (3.5 kW)' },
      { label: 'Cycle Life Longevity', value: '6000+ cycles at 80% DOD' }
    ],
    safety: 'Integrated Smart BMS with cell passive balancing, dual solid-state contactors, 125A Class-T fast fuse, and aerosol fire suppression.',
    protocols: 'Isolated CAN bus 2.0B / RS485 transmitting per-cell voltages and pack temperatures.'
  },
  {
    id: 'sensors',
    title: 'Precision Sensor Transducer Array',
    layer: 'Sensors',
    description: 'Multi-point electrical and thermal sensing grid collecting millisecond current, voltage, and temperature metrics.',
    specs: [
      { label: 'Current Sensing', value: 'INA219 I2C high-side transducers' },
      { label: 'Thermal Probes', value: 'DS18B20 1-Wire digital probes (±0.5°C)' },
      { label: 'Sampling Frequency', value: '10 Hz (100ms intervals)' },
      { label: 'Isolation Barrier', value: '2.5 kV RMS optocoupler galvanic isolation' }
    ],
    safety: 'Zener diode over-voltage clamping and TVS transient protection on all analog lines.',
    protocols: 'I2C and 1-Wire buses with hardware pull-up termination.'
  },
  {
    id: 'esp32',
    title: 'ESP32 Dual-Core IoT Telemetry Gateway',
    layer: 'IoT',
    description: 'Embedded microcontroller processing sensor data, calculating moving averages, and managing telemetry communication.',
    specs: [
      { label: 'Microcontroller', value: 'ESP32-WROOM-32D (240MHz dual-core)' },
      { label: 'SRAM & Flash', value: '520 KB SRAM, 4 MB SPI Flash' },
      { label: 'Connectivity', value: '802.11 b/g/n Wi-Fi + BLE 4.2' },
      { label: 'Watchdog Timeout', value: '1000ms hardware auto-recovery' }
    ],
    safety: 'Independent hardware brownout detector and hardware watchdog timer.',
    protocols: 'MQTT over TLS 1.3 / HTTP REST endpoints publishing JSON payloads.'
  },
  {
    id: 'evse',
    title: 'Smart EVSE / Demonstration Load Module',
    layer: 'Power',
    description: 'SAE J1772 / IEC 61851 compliant charging equipment regulating pilot duty cycle to steer vehicle charging rate.',
    specs: [
      { label: 'Output Rating', value: '1.2 kW to 7.4 kW (6A to 32A)' },
      { label: 'Pilot Modulation', value: '1 kHz 12V PWM signal (duty 10%–80%)' },
      { label: 'Contactor Relays', value: '40A dual-pole safety contactor' },
      { label: 'Efficiency', value: '96.2% end-to-end' }
    ],
    safety: 'CCID20 ground-fault circuit interrupter (6mA DC / 20mA AC trip), weld check, and proximity interlock.',
    protocols: 'OCPP 1.6J over WebSocket to AI management engine.'
  }
];

export const ArchitecturePage: React.FC = () => {
  const [selectedSubsystem, setSelectedSubsystem] = useState<SubsystemSpec>(SUBSYSTEM_SPECS[0]);

  return (
    <div className="space-y-10 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* ================= HEADER ================= */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
              <Network className="w-7 h-7 text-cyan-400" />
              <span>System Architecture & Telemetry Engineering</span>
            </h1>
            <TelemetryBadge label="TOPOLOGY SCHEMATIC" />
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Complete electrical, telemetry, and software layers spanning PV panels, MPPT conversion, BESS storage, and AI management.
          </p>
        </div>
      </div>

      {/* ================= CRITICAL HARDWARE SAFETY NOTICE ================= */}
      <div className="p-5 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-4">
        <ShieldAlert className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-200/90 leading-relaxed">
          <strong className="text-amber-300 font-bold block text-sm mb-1">
            Hardware Safety Boundary & Electrical Protection Standard
          </strong>
          A software controller or ESP32 microcontroller must <strong>never</strong> directly switch high-voltage EV charging lines without compliant industrial power electronics. A safe production deployment requires a certified Battery Management System (BMS), UL 1741 certified anti-islanding inverters, fast-acting Class-T DC fuses, hardware ground-fault interrupters (CCID20), and dual-pole safety contactors compliant with <strong>IEC 61851-1</strong> and <strong>SAE J1772</strong>.
        </div>
      </div>

      {/* ================= 5-TIER ARCHITECTURE LAYERS OVERVIEW ================= */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border-slate-800 space-y-6">
        <div>
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold block mb-1">
            SYSTEM HIERARCHY
          </span>
          <h2 className="text-xl font-extrabold text-slate-100">
            5-Tier Coordinated Engineering Hierarchy
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/30 space-y-2">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-bold">
              LAYER 1
            </span>
            <h4 className="text-sm font-bold text-slate-100">Power Electronics</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Photovoltaic array, MPPT buck-boost, 48V LiFePO4 battery pack, bidirectional inverter, and EVSE.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/30 space-y-2">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-bold">
              LAYER 2
            </span>
            <h4 className="text-sm font-bold text-slate-100">Sensors & Isolation</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              INA219 Hall current sensors, resistive voltage dividers, and DS18B20 digital thermal probes with galvanic isolation.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/30 space-y-2">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold">
              LAYER 3
            </span>
            <h4 className="text-sm font-bold text-slate-100">IoT Edge Gateway</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              ESP32 dual-core node aggregating 10Hz measurements, executing fail-safe limits, and publishing JSON via MQTT.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-purple-500/30 space-y-2">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-purple-950 text-purple-300 font-bold">
              LAYER 4
            </span>
            <h4 className="text-sm font-bold text-slate-100">AI Optimization</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Multi-objective deterministic rule engine coupled with 24-hour predictive solar insolation forecasting models.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700 space-y-2">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
              LAYER 5
            </span>
            <h4 className="text-sm font-bold text-slate-100">User Dashboard</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Responsive React/Vite operator console, real-time telemetry stream, interactive simulator, and safety alerts.
            </p>
          </div>

        </div>
      </div>

      {/* ================= INTERACTIVE ENERGY FLOW TOPOLOGY ================= */}
      <EnergyFlowDiagram />

      {/* ================= SUBSYSTEM SPECIFICATIONS INSPECTOR ================= */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border-slate-800 space-y-6">
        <div>
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold block mb-1">
            TECHNICAL DATA SHEETS
          </span>
          <h2 className="text-xl font-extrabold text-slate-100">
            Hardware & Firmware Subsystem Specifications
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Select a subsystem below to inspect engineering parameters, electrical tolerances, and hardware communication protocols.
          </p>
        </div>

        {/* Subsystem Selector Buttons */}
        <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-800">
          {SUBSYSTEM_SPECS.map(item => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedSubsystem(item)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedSubsystem.id === item.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.title.split('&')[0]}
            </button>
          ))}
        </div>

        {/* Active Subsystem Detail Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          
          <div className="lg:col-span-7 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  {selectedSubsystem.layer} Layer
                </span>
                <h3 className="text-lg font-bold text-slate-100">{selectedSubsystem.title}</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedSubsystem.description}
              </p>
            </div>

            {/* Electrical specs grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {selectedSubsystem.specs.map((spec, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-mono">
                    {spec.label}
                  </span>
                  <span className="text-xs font-bold font-mono text-slate-200 mt-0.5 block">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <span className="text-[11px] font-mono text-emerald-400 uppercase font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>SAFETY & PROTECTION INTERLOCKS</span>
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedSubsystem.safety}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <span className="text-[11px] font-mono text-cyan-400 uppercase font-bold flex items-center gap-1.5">
                <Zap className="w-4 h-4" />
                <span>INTERFACE & PROTOCOLS</span>
              </span>
              <p className="text-xs font-mono text-slate-300 leading-relaxed text-[11px]">
                {selectedSubsystem.protocols}
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
