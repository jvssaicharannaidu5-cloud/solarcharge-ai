import {
  SimulationState,
  EnergyAllocation,
  BatteryTelemetry,
  EvLoadTelemetry,
  AiRecommendation,
  AiPriorities,
  SystemAlert
} from '../types';

export const CO2_GRID_FACTOR_KG_PER_KWH = 0.82; // Standard fossil-heavy grid baseline
export const BATTERY_MAX_C_RATE_KW = 3.5;       // Safe C-rate limit for a 10kWh pack
export const BATTERY_TEMP_DERATE_THRESHOLD = 45; // °C
export const BATTERY_TEMP_CUTOFF_THRESHOLD = 52; // °C
export const BATTERY_SOC_MIN_RESERVE = 15;       // %
export const BATTERY_SOC_MAX_LIMIT = 98;         // %

export function calculateEnergyAllocation(state: SimulationState): EnergyAllocation {
  const {
    batteryCapacityKwh,
    gridBackupEnabled,
    solarPriorityEnabled,
    chargingMode,
    faults
  } = state;

  // Apply fault mutations to effective physics values
  const effectiveSolar = faults.solarDrop ? Math.max(0.2, state.solarGenerationKw * 0.15) : state.solarGenerationKw;
  const effectiveSoc = faults.lowSoc ? 11 : state.batterySoc;
  const effectiveTemp = faults.highTemp ? 56 : state.batteryTempC;
  const gridAvailable = gridBackupEnabled && !faults.gridOutage;
  const demand = state.chargingDemandKw;

  // Thermal Derating & Cutoff Logic
  let maxChargeKw = BATTERY_MAX_C_RATE_KW;
  let maxDischargeKw = BATTERY_MAX_C_RATE_KW;

  if (effectiveTemp >= BATTERY_TEMP_CUTOFF_THRESHOLD) {
    maxChargeKw = 0;
    maxDischargeKw = 0;
  } else if (effectiveTemp >= BATTERY_TEMP_DERATE_THRESHOLD) {
    maxChargeKw *= 0.5;
    maxDischargeKw *= 0.5;
  }

  // SOC Boundary Limits
  if (effectiveSoc <= BATTERY_SOC_MIN_RESERVE) {
    maxDischargeKw = 0; // Cut off discharge to preserve LiFePO4 cells
  }
  if (effectiveSoc >= BATTERY_SOC_MAX_LIMIT) {
    maxChargeKw = 0; // Prevent overcharge
  }

  let solarToLoadKw = 0;
  let solarToBatteryKw = 0;
  let solarCurtailedKw = 0;
  let batteryDischargeToLoadKw = 0;
  let gridToLoadKw = 0;

  if (chargingMode === 'standard') {
    // Standard baseline mode: Solar generation is unmanaged, battery is kept in standby,
    // load predominantly pulls from grid even if sun is shining.
    const directSolarShare = solarPriorityEnabled ? 0.35 : 0.15;
    solarToLoadKw = Math.min(demand * directSolarShare, effectiveSolar);
    solarCurtailedKw = Math.max(0, effectiveSolar - solarToLoadKw); // Excess solar wasted/curtailed
    
    // Battery remains inactive in standard mode
    batteryDischargeToLoadKw = 0;
    solarToBatteryKw = 0;

    const remainingDemand = demand - solarToLoadKw;
    gridToLoadKw = gridAvailable ? remainingDemand : 0;

  } else if (chargingMode === 'solar_priority') {
    // Pure Solar Priority: Solar satisfies load 100% first.
    // Unused solar charges battery. Grid is strictly blocked unless demand is unmet and grid allowed.
    solarToLoadKw = Math.min(effectiveSolar, demand);
    const surplusSolar = effectiveSolar - solarToLoadKw;

    solarToBatteryKw = Math.min(surplusSolar, maxChargeKw);
    solarCurtailedKw = Math.max(0, surplusSolar - solarToBatteryKw);

    const unmetLoadAfterSolar = demand - solarToLoadKw;
    batteryDischargeToLoadKw = Math.min(unmetLoadAfterSolar, maxDischargeKw);

    const remainingUnmet = unmetLoadAfterSolar - batteryDischargeToLoadKw;
    gridToLoadKw = gridAvailable ? remainingUnmet : 0;

  } else {
    // Smart Balanced (AI Optimized) Mode:
    // Balances dynamic solar, battery buffering, and minimal grid supplement to ensure full EV delivery.
    solarToLoadKw = Math.min(effectiveSolar, demand);
    const surplusSolar = effectiveSolar - solarToLoadKw;

    solarToBatteryKw = Math.min(surplusSolar, maxChargeKw);
    solarCurtailedKw = Math.max(0, surplusSolar - solarToBatteryKw);

    const unmetAfterSolar = demand - solarToLoadKw;
    batteryDischargeToLoadKw = Math.min(unmetAfterSolar, maxDischargeKw);

    const remainingDeficit = unmetAfterSolar - batteryDischargeToLoadKw;
    gridToLoadKw = gridAvailable ? remainingDeficit : 0;
  }

  const totalLoadDeliveredKw = solarToLoadKw + batteryDischargeToLoadKw + gridToLoadKw;
  const unmetLoadKw = Math.max(0, demand - totalLoadDeliveredKw);

  // Net battery power (positive = charging, negative = discharging)
  const batteryNetPowerKw = solarToBatteryKw > 0
    ? solarToBatteryKw
    : (batteryDischargeToLoadKw > 0 ? -batteryDischargeToLoadKw : 0);

  // Renewable share
  const cleanPowerDelivered = solarToLoadKw + batteryDischargeToLoadKw;
  const renewableSharePercent = totalLoadDeliveredKw > 0
    ? Math.round((cleanPowerDelivered / totalLoadDeliveredKw) * 100)
    : (effectiveSolar > 0 ? 100 : 0);

  // CO2 avoided calculation for this hour
  const emissionsAvoidedKgHr = cleanPowerDelivered * CO2_GRID_FACTOR_KG_PER_KWH;

  // Energy Balance verification check
  // Generated + Discharged + Imported === Delivered + Stored + Curtailed
  const totalIn = effectiveSolar + (batteryDischargeToLoadKw) + gridToLoadKw;
  const totalOut = totalLoadDeliveredKw + solarToBatteryKw + solarCurtailedKw;
  const energyBalanceDelta = Math.abs(totalIn - totalOut);
  const isEnergyBalanced = energyBalanceDelta < 0.001;

  return {
    solarToLoadKw: Number(solarToLoadKw.toFixed(2)),
    solarToBatteryKw: Number(solarToBatteryKw.toFixed(2)),
    solarCurtailedKw: Number(solarCurtailedKw.toFixed(2)),
    batteryDischargeToLoadKw: Number(batteryDischargeToLoadKw.toFixed(2)),
    gridToLoadKw: Number(gridToLoadKw.toFixed(2)),
    totalLoadDeliveredKw: Number(totalLoadDeliveredKw.toFixed(2)),
    unmetLoadKw: Number(unmetLoadKw.toFixed(2)),
    batteryNetPowerKw: Number(batteryNetPowerKw.toFixed(2)),
    renewableSharePercent: Math.min(100, Math.max(0, renewableSharePercent)),
    emissionsAvoidedKgHr: Number(emissionsAvoidedKgHr.toFixed(3)),
    energyBalanceDelta: Number(energyBalanceDelta.toFixed(4)),
    isEnergyBalanced
  };
}

export function computeBatteryTelemetry(
  state: SimulationState,
  allocation: EnergyAllocation
): BatteryTelemetry {
  const { batterySoc, batteryCapacityKwh, batteryTempC, faults } = state;
  const effectiveTemp = faults.highTemp ? 56 : batteryTempC;
  const effectiveSoc = faults.lowSoc ? 11 : batterySoc;

  // Nominal 48V / 51.2V LiFePO4 pack voltage curve:
  // 3.2V per cell * 16 cells = 51.2V nominal. 0% SOC ~ 44.0V, 100% SOC ~ 56.4V
  const voltageV = Number((44.0 + (effectiveSoc / 100) * 12.4).toFixed(1));
  const storedKwh = Number(((effectiveSoc / 100) * batteryCapacityKwh).toFixed(2));
  const powerKw = Math.abs(allocation.batteryNetPowerKw);
  const currentA = voltageV > 0 ? Number(((powerKw * 1000) / voltageV).toFixed(1)) : 0;
  const cRate = Number((powerKw / batteryCapacityKwh).toFixed(2));

  let status: BatteryTelemetry['status'] = 'idle';
  if (effectiveTemp >= BATTERY_TEMP_CUTOFF_THRESHOLD) {
    status = 'thermal_cutoff';
  } else if (effectiveSoc <= BATTERY_SOC_MIN_RESERVE && allocation.batteryNetPowerKw < 0) {
    status = 'undervoltage_cutoff';
  } else if (allocation.batteryNetPowerKw > 0) {
    status = 'charging';
  } else if (allocation.batteryNetPowerKw < 0) {
    status = 'discharging';
  }

  // Simulated SOH based on temperature stress and cycle profile
  const tempPenalty = effectiveTemp > 45 ? 4 : 0;
  const simulatedSoh = Math.max(88, 98.4 - tempPenalty);

  return {
    voltageV,
    currentA,
    storedKwh,
    temperatureC: effectiveTemp,
    stateOfHealthPercent: simulatedSoh,
    cRate,
    status
  };
}

export function computeEvTelemetry(
  state: SimulationState,
  allocation: EnergyAllocation
): EvLoadTelemetry {
  const powerKw = allocation.totalLoadDeliveredKw;
  const demand = state.chargingDemandKw;

  let status: EvLoadTelemetry['status'] = 'disconnected';
  if (demand === 0) {
    status = 'disconnected';
  } else if (powerKw === 0) {
    status = 'throttled';
  } else if (powerKw < demand) {
    status = 'throttled';
  } else {
    status = 'charging';
  }

  // Estimate remaining time for a standard 40 kWh EV pack battery top-up (simulated session)
  const remainingSessionKwhNeeded = Math.max(0, 15.0 - state.sessionEnergyKwh);
  const estimatedTimeToFullMinutes = powerKw > 0
    ? Math.round((remainingSessionKwhNeeded / powerKw) * 60)
    : 0;

  const progressPercent = Math.min(100, Math.round((state.sessionEnergyKwh / 15.0) * 100));

  return {
    powerKw,
    sessionEnergyKwh: Number(state.sessionEnergyKwh.toFixed(2)),
    status,
    estimatedTimeToFullMinutes,
    progressPercent
  };
}

export function computeAiRecommendation(
  state: SimulationState,
  allocation: EnergyAllocation,
  priorities: AiPriorities
): AiRecommendation {
  const { faults, batteryTempC, batterySoc } = state;
  const effectiveTemp = faults.highTemp ? 56 : batteryTempC;
  const effectiveSoc = faults.lowSoc ? 11 : batterySoc;

  let safetyStatus: AiRecommendation['safetyStatus'] = 'normal';
  let explanation = '';

  if (effectiveTemp >= BATTERY_TEMP_CUTOFF_THRESHOLD) {
    safetyStatus = 'critical_cutoff';
    explanation = `Emergency thermal safety interlock active (${effectiveTemp}°C >= ${BATTERY_TEMP_CUTOFF_THRESHOLD}°C). Battery isolated to prevent thermal runaway.`;
    return {
      recommendedChargingPowerKw: allocation.solarToLoadKw,
      batteryAction: 'idle',
      batteryPowerKw: 0,
      gridBackupRecommended: false,
      renewableUtilizationPercent: allocation.renewableSharePercent,
      safetyStatus,
      explanation
    };
  }

  if (effectiveSoc <= BATTERY_SOC_MIN_RESERVE) {
    safetyStatus = 'derated';
    explanation = `Battery reached critical low reserve (${effectiveSoc}% <= ${BATTERY_SOC_MIN_RESERVE}%). Discharge arrested to preserve cell cathode longevity. Load routed to available solar and grid.`;
  } else if (effectiveTemp >= BATTERY_TEMP_DERATE_THRESHOLD) {
    safetyStatus = 'derated';
    explanation = `Battery temperature elevated (${effectiveTemp}°C). Power throughput derated by 50% for thermal moderation.`;
  } else if (faults.solarDrop) {
    safetyStatus = 'derated';
    explanation = `Sudden solar irradiance reduction detected (cloud cover). Battery discharge ramped up to buffer EV load and avoid grid import surge.`;
  } else if (faults.gridOutage) {
    explanation = `Grid outage detected. System seamlessly transitioned to Islanded Microgrid Mode. Supplying EV load exclusively from solar PV and BESS.`;
  } else if (allocation.solarCurtailedKw > 0) {
    explanation = `Peak solar surplus available (${allocation.solarCurtailedKw.toFixed(1)} kW curtailed). Recommend connecting additional load or increasing battery capacity to capture 100% clean energy.`;
  } else if (allocation.batteryNetPowerKw > 0) {
    explanation = `Solar generation exceeds charging demand. Directing ${allocation.solarToLoadKw.toFixed(1)} kW directly to EV and buffering ${allocation.solarToBatteryKw.toFixed(1)} kW into battery storage.`;
  } else if (allocation.batteryNetPowerKw < 0) {
    explanation = `Solar insufficient for demand. Supplementing load with ${allocation.batteryDischargeToLoadKw.toFixed(1)} kW clean battery discharge, minimizing grid import.`;
  } else {
    explanation = `Optimal power distribution achieved. EV charging operating at ${allocation.totalLoadDeliveredKw.toFixed(1)} kW with ${allocation.renewableSharePercent}% renewable contribution.`;
  }

  let batteryAction: AiRecommendation['batteryAction'] = 'idle';
  if (allocation.batteryNetPowerKw > 0) batteryAction = 'charge';
  else if (allocation.batteryNetPowerKw < 0) batteryAction = 'discharge';

  return {
    recommendedChargingPowerKw: allocation.totalLoadDeliveredKw,
    batteryAction,
    batteryPowerKw: Math.abs(allocation.batteryNetPowerKw),
    gridBackupRecommended: allocation.gridToLoadKw > 0,
    renewableUtilizationPercent: allocation.renewableSharePercent,
    safetyStatus,
    explanation
  };
}

export function evaluateSystemAlerts(
  state: SimulationState,
  allocation: EnergyAllocation
): SystemAlert[] {
  const alerts: SystemAlert[] = [];
  const now = new Date().toLocaleTimeString();

  const effectiveTemp = state.faults.highTemp ? 56 : state.batteryTempC;
  const effectiveSoc = state.faults.lowSoc ? 11 : state.batterySoc;

  if (effectiveTemp >= BATTERY_TEMP_CUTOFF_THRESHOLD) {
    alerts.push({
      id: 'alert-high-temp-crit',
      title: 'CRITICAL: High Battery Temperature',
      message: `Cell temperature reached ${effectiveTemp}°C! Hardware thermal cutoff relay tripped. Charge and discharge suspended.`,
      severity: 'critical',
      timestamp: now,
      source: 'Battery'
    });
  } else if (effectiveTemp >= BATTERY_TEMP_DERATE_THRESHOLD) {
    alerts.push({
      id: 'alert-high-temp-warn',
      title: 'WARNING: Thermal Derating Active',
      message: `Battery pack at ${effectiveTemp}°C. C-rate throttled by 50% to prevent degradation.`,
      severity: 'warning',
      timestamp: now,
      source: 'Battery'
    });
  }

  if (effectiveSoc <= BATTERY_SOC_MIN_RESERVE) {
    alerts.push({
      id: 'alert-low-soc',
      title: 'WARNING: Low Battery State of Charge',
      message: `Battery SOC at ${effectiveSoc}%. Discharge halted to prevent deep cycle damage.`,
      severity: 'warning',
      timestamp: now,
      source: 'Battery'
    });
  }

  if (state.faults.solarDrop) {
    alerts.push({
      id: 'alert-solar-drop',
      title: 'Solar Generation Anomaly',
      message: 'Sudden irradiance drop detected (-85%). Inverter shifting load to battery buffer.',
      severity: 'info',
      timestamp: now,
      source: 'Solar'
    });
  }

  if (state.faults.gridOutage) {
    alerts.push({
      id: 'alert-grid-outage',
      title: 'Grid Islanding Engaged',
      message: 'Grid loss detected. Anti-islanding switch open. Station running fully autonomous.',
      severity: 'warning',
      timestamp: now,
      source: 'Grid'
    });
  }

  if (state.faults.sensorDisconnect) {
    alerts.push({
      id: 'alert-sensor-lost',
      title: 'ESP32 Telemetry Timeout',
      message: 'No heartbeat from primary INA219/ESP32 sensor bus. Operating on fail-safe conservative defaults.',
      severity: 'critical',
      timestamp: now,
      source: 'Telemetry'
    });
  }

  if (allocation.unmetLoadKw > 0) {
    alerts.push({
      id: 'alert-unmet-demand',
      title: 'EV Charging Throttled',
      message: `Available solar and storage cannot meet requested load (${allocation.unmetLoadKw.toFixed(1)} kW unmet). Grid backup disabled or off-grid.`,
      severity: 'warning',
      timestamp: now,
      source: 'EVSE'
    });
  }

  return alerts;
}
