export type ChargingMode = 'standard' | 'solar_priority' | 'smart_balanced';

export type AlertSeverity = 'info' | 'warning' | 'critical';

export interface SystemAlert {
  id: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  timestamp: string;
  source: 'Solar' | 'Battery' | 'EVSE' | 'Grid' | 'AI' | 'Telemetry';
  dismissed?: boolean;
}

export interface FaultInjectionState {
  highTemp: boolean;
  lowSoc: boolean;
  solarDrop: boolean;
  sensorDisconnect: boolean;
  gridOutage: boolean;
}

export interface SimulationState {
  // Input parameters
  solarGenerationKw: number;      // 0 - 5.0 kW
  batterySoc: number;             // 0 - 100%
  batteryCapacityKwh: number;     // Nominal 10.0 kWh
  chargingDemandKw: number;       // 0 - 5.0 kW
  batteryTempC: number;           // 15 - 60 °C
  gridBackupEnabled: boolean;
  solarPriorityEnabled: boolean;
  chargingMode: ChargingMode;

  // Simulator Engine Flags
  isLiveTick: boolean;
  isReducedMotion: boolean;
  timeFilter: 'live' | 'today' | 'week' | 'month';
  faults: FaultInjectionState;

  // Accumulated Session Metrics
  sessionEnergyKwh: number;
  dailySolarGeneratedKwh: number;
  dailyGridImportedKwh: number;
  dailyEmissionsAvoidedKg: number;
}

export interface EnergyAllocation {
  solarToLoadKw: number;
  solarToBatteryKw: number;
  solarCurtailedKw: number;
  batteryDischargeToLoadKw: number;
  gridToLoadKw: number;
  totalLoadDeliveredKw: number;
  unmetLoadKw: number;
  batteryNetPowerKw: number;      // Positive = charging, Negative = discharging, 0 = idle
  renewableSharePercent: number;  // 0 - 100%
  emissionsAvoidedKgHr: number;   // 0.82 kg CO2 / kWh of renewable energy delivered
  energyBalanceDelta: number;     // Check: (Supply) - (Load + Loss) === 0
  isEnergyBalanced: boolean;
}

export interface BatteryTelemetry {
  voltageV: number;
  currentA: number;
  storedKwh: number;
  temperatureC: number;
  stateOfHealthPercent: number;  // Simulated SOH
  cRate: number;                 // Power / Capacity
  status: 'charging' | 'discharging' | 'idle' | 'thermal_cutoff' | 'undervoltage_cutoff';
}

export interface EvLoadTelemetry {
  powerKw: number;
  sessionEnergyKwh: number;
  status: 'disconnected' | 'connected' | 'charging' | 'throttled' | 'completed';
  estimatedTimeToFullMinutes: number;
  progressPercent: number;
}

export interface AiPriorities {
  renewableAutonomy: number;  // 0 - 100
  batteryHealth: number;      // 0 - 100
  chargingSpeed: number;      // 0 - 100
  costMinimization: number;   // 0 - 100
}

export interface AiRecommendation {
  recommendedChargingPowerKw: number;
  batteryAction: 'charge' | 'discharge' | 'idle';
  batteryPowerKw: number;
  gridBackupRecommended: boolean;
  renewableUtilizationPercent: number;
  safetyStatus: 'normal' | 'derated' | 'critical_cutoff';
  explanation: string;
}

export interface TelemetryLogEntry {
  timestamp: string;
  solarKw: number;
  loadKw: number;
  batterySoc: number;
  batteryTempC: number;
  batteryPowerKw: number;
  gridKw: number;
  renewableShare: number;
  co2SavedKg: number;
  chargingMode: string;
}

export interface ForecastDataPoint {
  timeLabel: string;
  solarEstimatedKw: number;
  solarConfidenceLowKw: number;
  solarConfidenceHighKw: number;
  loadEstimatedKw: number;
  batterySocForecast: number;
  gridAvoidedKw: number;
}
