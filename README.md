# SolarCharge AI ⚡☀️

> **Solar-Powered Smart Charging Infrastructure with Battery Storage and Intelligent Energy Management**

SolarCharge AI is a competition-ready, responsive, and interactive clean-energy technology web application that demonstrates how solar generation, 48V LiFePO4 battery energy storage systems (BESS), intelligent EV load charging, IoT edge telemetry, and AI-assisted power arbitration work together to minimize grid dependence while safeguarding battery longevity.

---

## 🌟 Key Features

1. **Live Energy Dashboard**: Real-time telemetry monitoring solar harvest (kW), BESS battery pack (SOC %, voltage, temp, C-rate), EV load delivered (kW), grid backup import, and clean renewable purity percentage.
2. **Dynamic Energy Flow Topology**: Interactive SVG circuit diagram featuring animated dashed energy particles indicating real-time wattage and power direction.
3. **AI Energy Manager**: Transparent 5-stage rule execution reasoner with plain-English explanations, multi-objective priority sliders, and 24-hour predictive forecasting with 90% confidence bands.
4. **Charging Physics Simulator**: Interactive sliders (Solar 0–5 kW, SOC 0–100%, EV Demand 0–5 kW, Temp 15–60°C) with real-time conservation of energy auditing ($P_{\text{in}} = P_{\text{out}}$).
5. **Scenario Comparison**: Direct side-by-side comparison between *Scenario A (Standard Grid-Dependent)* and *Scenario B (SolarCharge AI Smart Mode)* under identical operating conditions.
6. **Safety & Fault-Injection Sandbox**: Real-time simulation of high battery temp (>52°C cutoff), critical low SOC (<15% reserve floor), sudden solar drops (-85%), telemetry timeouts, and utility blackouts with automated microgrid mitigation.
7. **System Architecture**: 5-tier engineering hierarchy (Power Electronics, Sensors, IoT Gateway, AI Optimization, Web Dashboard) with clickable component inspector.
8. **Project Implementation Roadmap**: 6-phase engineering lifecycle and embedded ESP32 C++ (Arduino/ESP-IDF) telemetry firmware code viewer with a 1-click copy button.
9. **Innovation & Benchmark Matrix**: 8-dimension comparative feature matrix and future expansion vectors (V2G ISO 15118-20, TOU dynamic arbitrage, multi-stall load sharing).
10. **Telemetry Data Export**: 1-click export of live simulation telemetry logs to CSV or JSON format.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Lucide Icons
- **Data Visualization**: Recharts
- **Telemetry Protocols**: ESP32, INA219, DS18B20, Modbus RS485, MQTT/REST

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd solarcharge-ai

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Building for Production

```bash
npm run build
npm run preview
```

---

## 🛡️ Electrical & Safety Notice

This web application is a technical demonstration prototype. It simulates energy flow, MPPT tracking, LiFePO4 battery buffering, and AI dispatch. It does **not** replace hardware-level Battery Management Systems (BMS), physical galvanic isolation, fast-acting fuses, emergency stop interlocks, or certified EV charging equipment adhering to **IEC 61851-1** and **SAE J1772** electrical standards.

---

## 📄 License
ISC License &copy; 2026 SolarCharge AI Team.
