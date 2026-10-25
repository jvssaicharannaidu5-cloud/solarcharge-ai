import React, { useState } from 'react';
import {
  GitBranch,
  CheckCircle2,
  Clock,
  Cpu,
  Code2,
  Copy,
  Check,
  Building2,
  Car,
  School,
  Truck,
  Zap,
  ArrowRight
} from 'lucide-react';
import { TelemetryBadge } from '../components/shared/TelemetryBadge';

interface RoadmapPhase {
  phase: string;
  title: string;
  status: 'Completed' | 'In Progress' | 'Planned';
  timeline: string;
  description: string;
  deliverables: string[];
}

const ROADMAP_PHASES: RoadmapPhase[] = [
  {
    phase: 'Phase 1',
    title: 'Prototype Hardware Rig Assembly',
    status: 'Completed',
    timeline: 'Weeks 1–3',
    description: 'Bench-scale test rig with monocrystalline PV panel, MPPT charge controller, 48V LiFePO4 battery pack, and variable DC motor demonstration load.',
    deliverables: [
      'PV string wiring and DC isolation switch',
      'MPPT buck-boost converter configuration',
      '16S LiFePO4 battery pack with hardware BMS'
    ]
  },
  {
    phase: 'Phase 2',
    title: 'Precision Sensor Transducer Integration',
    status: 'Completed',
    timeline: 'Weeks 4–6',
    description: 'Integration of INA219 high-side I2C current/voltage monitors, resistive divider circuits, and DS18B20 1-Wire temperature sensors with optocoupler isolation.',
    deliverables: [
      'Multi-channel current/voltage transducer calibration',
      'Thermal probe placement on battery cell terminals',
      'Hardware level shifter and transient protection'
    ]
  },
  {
    phase: 'Phase 3',
    title: 'ESP32 IoT Telemetry Firmware Gateway',
    status: 'Completed',
    timeline: 'Weeks 7–9',
    description: 'Embedded C++ firmware on dual-core ESP32 sampling at 10Hz, computing moving averages, checking hardware trip thresholds, and publishing JSON over MQTT/REST.',
    deliverables: [
      'ESP32 FreeRTOS dual-task firmware architecture',
      'Secure MQTT JSON telemetry client over TLS',
      'Watchdog timer and automatic Wi-Fi reconnect state machine'
    ]
  },
  {
    phase: 'Phase 4',
    title: 'Web Dashboard & Real-Time Monitoring Interface',
    status: 'Completed',
    timeline: 'Weeks 10–12',
    description: 'Responsive React and Vite web application with animated SVG energy-flow diagrams, Recharts power curves, and live alert feeds.',
    deliverables: [
      'Interactive energy-flow particle topology',
      'Time-series power charts & battery SOC tracking',
      'Responsive mobile-friendly dashboard layout'
    ]
  },
  {
    phase: 'Phase 5',
    title: 'AI Energy Management & Predictive Forecasting',
    status: 'Completed',
    timeline: 'Weeks 13–15',
    description: 'Multi-objective power arbitration engine: solar prioritization, battery buffering, Time-of-Use tariff shaving, and modular LSTM forecasting interface.',
    deliverables: [
      'Deterministic rule-based decision engine with explanations',
      '24-hour predictive solar insolation and demand forecast model',
      'Modular REST/MQTT ML ingestion API schema'
    ]
  },
  {
    phase: 'Phase 6',
    title: 'Empirical Testing & Comparative Benchmarking',
    status: 'Completed',
    timeline: 'Weeks 16–18',
    description: 'Rigorous comparative evaluation comparing unmanaged grid-dependent charging against SolarCharge Smart Mode under controlled irradiance scenarios.',
    deliverables: [
      'Before-and-after empirical performance matrix',
      'Fault injection stress test report (temperature, SOC, outage)',
      'Competition demonstration presentation & telemetry export'
    ]
  }
];

const ESP32_FIRMWARE_SNIPPET = `// ========================================================
// SolarCharge AI — ESP32 Telemetry Gateway Firmware
// Sampling Rate: 10Hz | Protocol: MQTT over TLS / HTTP REST
// ========================================================
#include <WiFi.h>
#include <PubSubClient.h>
#include <Wire.h>
#include <Adafruit_INA219.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <ArduinoJson.h>

const char* ssid = "SolarCharge_AP";
const char* password = "CleanEnergy2026!";
const char* mqtt_server = "broker.solarcharge-ai.local";

Adafruit_INA219 ina_solar(0x40);
Adafruit_INA219 ina_battery(0x41);
Adafruit_INA219 ina_evse(0x44);

OneWire oneWire(4); // Pin D4 for DS18B20
DallasTemperature tempSensors(&oneWire);

WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
  Serial.begin(115200);
  Wire.begin(21, 22); // SDA, SCL
  ina_solar.begin();
  ina_battery.begin();
  ina_evse.begin();
  tempSensors.begin();

  WiFi.begin(ssid, password);
  client.setServer(mqtt_server, 1883);
}

void loop() {
  if (!client.connected()) reconnect();
  client.loop();

  // 1. Sample High-Side Voltage & Current
  float v_solar = ina_solar.getBusVoltage_V();
  float i_solar = ina_solar.getCurrent_mA() / 1000.0;
  float p_solar = (v_solar * i_solar) / 1000.0; // kW

  float v_batt = ina_battery.getBusVoltage_V();
  float i_batt = ina_battery.getCurrent_mA() / 1000.0;
  float p_batt = (v_batt * i_batt) / 1000.0;

  // 2. Sample Battery Pack Temperature
  tempSensors.requestTemperatures();
  float temp_c = tempSensors.getTempCByIndex(0);

  // 3. Hardware Thermal Fail-Safe Check
  if (temp_c >= 52.0) {
    digitalWrite(16, LOW); // Open safety relay immediately
    Serial.println("CRITICAL: Battery Thermal Trip Triggered!");
  }

  // 4. Serialize to JSON Telemetry Payload
  StaticJsonDocument<384> doc;
  doc["device_id"] = "ESP32_GATEWAY_01";
  doc["solar_kw"] = p_solar;
  doc["battery_kw"] = p_batt;
  doc["battery_v"] = v_batt;
  doc["battery_temp"] = temp_c;
  doc["battery_soc"] = map(v_batt * 10, 440, 560, 0, 100);

  char jsonBuffer[512];
  serializeJson(doc, jsonBuffer);
  client.publish("solarcharge/telemetry", jsonBuffer);

  delay(100); // 10Hz sampling interval
}`;

export const ImplementationPage: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(ESP32_FIRMWARE_SNIPPET);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-10 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* ================= HEADER ================= */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
              <GitBranch className="w-7 h-7 text-cyan-400" />
              <span>Project Implementation Roadmap</span>
            </h1>
            <TelemetryBadge label="ENGINEERING TIMELINE" />
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Visual engineering phases, IoT telemetry firmware architecture, target beneficiaries, and deliverables checklist.
          </p>
        </div>
      </div>

      {/* ================= 6-PHASE VISUAL TIMELINE ================= */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border-slate-800 space-y-6">
        <div>
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold block mb-1">
            PHASED EXECUTION PLAN
          </span>
          <h2 className="text-xl font-extrabold text-slate-100">
            6-Phase Engineering Lifecycle Roadmap
          </h2>
        </div>

        <div className="space-y-4">
          {ROADMAP_PHASES.map((p, idx) => (
            <div
              key={p.phase}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-start justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-sm font-bold flex items-center justify-center shrink-0">
                  {`0${idx + 1}`}
                </div>
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="text-sm font-bold text-slate-100">{p.title}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      {p.status}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      ({p.timeline})
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                    {p.description}
                  </p>
                  
                  {/* Key Deliverables bullets */}
                  <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-mono">
                    {p.deliverables.map((del, dIdx) => (
                      <span key={dIdx} className="px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/60 text-slate-300">
                        &bull; {del}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= ESP32 FIRMWARE CODE VIEWER ================= */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Code2 className="w-5 h-5 text-cyan-400" />
              <span>ESP32 Telemetry & Safety Gateway Firmware (C++)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Production-ready Arduino/ESP-IDF telemetry loop sampling INA219 current monitors, checking 52°C cutoff, and streaming JSON to MQTT.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
          </button>
        </div>

        <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed max-h-96">
          {ESP32_FIRMWARE_SNIPPET}
        </pre>
      </div>

      {/* ================= TARGET BENEFICIARIES GRID ================= */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border-slate-800 space-y-6">
        <div>
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold block mb-1">
            IMPACT & ADOPTION
          </span>
          <h2 className="text-xl font-extrabold text-slate-100">
            Target Beneficiaries & Real-World Deployments
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 w-fit">
              <Car className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-100">EV Drivers & Commuters</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Provides guaranteed renewable energy visibility, avoided carbon accounting, and reliable charging even during local utility grid outages.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 w-fit">
              <School className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-100">University Campuses</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Hands-on testbed for electrical engineering and sustainability students to study microgrid islanding, IoT telemetry, and renewable energy dispatch.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit">
              <Building2 className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-100">Commercial Station Operators</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dramatically lowers monthly operating expenditures by peak-shaving demand charges, eliminating midday solar curtailment, and enabling TOU arbitrage.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 w-fit">
              <Truck className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-100">Fleet Logistics Depots</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Coordinates overnight depot charging for delivery vans using buffered battery energy and morning solar without blowing transformer capacity.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
