import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  SimulationState,
  EnergyAllocation,
  BatteryTelemetry,
  EvLoadTelemetry,
  AiRecommendation,
  AiPriorities,
  SystemAlert,
  TelemetryLogEntry,
  ChargingMode,
  ForecastDataPoint,
  FaultInjectionState
} from '../types';
import {
  calculateEnergyAllocation,
  computeBatteryTelemetry,
  computeEvTelemetry,
  computeAiRecommendation,
  evaluateSystemAlerts
} from '../utils/calculations';

interface SimulationContextType {
  state: SimulationState;
  allocation: EnergyAllocation;
  batteryTelemetry: BatteryTelemetry;
  evTelemetry: EvLoadTelemetry;
  aiRecommendation: AiRecommendation;
  aiPriorities: AiPriorities;
  alerts: SystemAlert[];
  telemetryLogs: TelemetryLogEntry[];
  forecastData: ForecastDataPoint[];
  
  // Setters & Actions
  setSolarGenerationKw: (kw: number) => void;
  setBatterySoc: (soc: number) => void;
  setChargingDemandKw: (kw: number) => void;
  setBatteryTempC: (temp: number) => void;
  setGridBackupEnabled: (enabled: boolean) => void;
  setSolarPriorityEnabled: (enabled: boolean) => void;
  setChargingMode: (mode: ChargingMode) => void;
  setAiPriorities: (priorities: AiPriorities) => void;
  toggleLiveTick: () => void;
  toggleReducedMotion: () => void;
  setTimeFilter: (filter: SimulationState['timeFilter']) => void;
  toggleFault: (fault: keyof FaultInjectionState) => void;
  resetFaults: () => void;
  dismissAlert: (id: string) => void;
  resetSimulation: () => void;
  applyScenario: (scenario: 'A' | 'B' | 'C' | 'D') => void;
}

const defaultFaults: FaultInjectionState = {
  highTemp: false,
  lowSoc: false,
  solarDrop: false,
  sensorDisconnect: false,
  gridOutage: false
};

const initialSimulationState: SimulationState = {
  solarGenerationKw: 3.8,
  batterySoc: 68,
  batteryCapacityKwh: 10.0,
  chargingDemandKw: 3.3,
  batteryTempC: 28,
  gridBackupEnabled: true,
  solarPriorityEnabled: true,
  chargingMode: 'smart_balanced',
  isLiveTick: true,
  isReducedMotion: false,
  timeFilter: 'today',
  faults: defaultFaults,
  sessionEnergyKwh: 4.8,
  dailySolarGeneratedKwh: 18.4,
  dailyGridImportedKwh: 3.2,
  dailyEmissionsAvoidedKg: 12.6
};

const initialPriorities: AiPriorities = {
  renewableAutonomy: 85,
  batteryHealth: 75,
  chargingSpeed: 60,
  costMinimization: 90
};

// Generate initial 24h predictive forecast dataset
function generateForecastDataset(): ForecastDataPoint[] {
  const hours = [
    '00:00', '02:00', '04:00', '06:00', '08:00', '10:00',
    '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'
  ];

  return hours.map((hour, idx) => {
    // Solar Bell curve peaking at 12:00
    let solarBase = 0;
    if (idx >= 3 && idx <= 8) {
      solarBase = Math.max(0, 4.8 * Math.sin(((idx - 3) / 5) * Math.PI));
    }
    
    // EV load peak in morning and evening
    let loadBase = 1.0;
    if (idx >= 4 && idx <= 5) loadBase = 3.6; // Morning arrivals
    if (idx >= 8 && idx <= 10) loadBase = 4.2; // Evening commuters

    const solarEst = Number(solarBase.toFixed(2));
    const solarLow = Number(Math.max(0, solarEst * 0.85).toFixed(2));
    const solarHigh = Number((solarEst * 1.15).toFixed(2));
    const loadEst = Number(loadBase.toFixed(2));
    const soc = Math.min(95, Math.max(25, Math.round(50 + (solarEst - loadEst) * 8)));
    const gridAvoided = Number((Math.min(solarEst, loadEst)).toFixed(2));

    return {
      timeLabel: hour,
      solarEstimatedKw: solarEst,
      solarConfidenceLowKw: solarLow,
      solarConfidenceHighKw: solarHigh,
      loadEstimatedKw: loadEst,
      batterySocForecast: soc,
      gridAvoidedKw: gridAvoided
    };
  });
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<SimulationState>(initialSimulationState);
  const [aiPriorities, setAiPriorities] = useState<AiPriorities>(initialPriorities);
  const [dismissedAlertIds, setDismissedAlertIds] = useState<Set<string>>(new Set());
  const [forecastData] = useState<ForecastDataPoint[]>(generateForecastDataset());

  // 15-point rolling historic telemetry log
  const [telemetryLogs, setTelemetryLogs] = useState<TelemetryLogEntry[]>(() => {
    const logs: TelemetryLogEntry[] = [];
    const baseTime = Date.now() - 15 * 60 * 1000;
    for (let i = 0; i < 15; i++) {
      const t = new Date(baseTime + i * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      logs.push({
        timestamp: t,
        solarKw: Number((3.0 + Math.sin(i * 0.4) * 0.8).toFixed(2)),
        loadKw: 3.3,
        batterySoc: Math.round(62 + i * 0.4),
        batteryTempC: 28,
        batteryPowerKw: 0.5,
        gridKw: 0,
        renewableShare: 100,
        co2SavedKg: 0.65,
        chargingMode: 'smart_balanced'
      });
    }
    return logs;
  });

  // Derived calculations
  const allocation = useMemo(() => calculateEnergyAllocation(state), [state]);
  const batteryTelemetry = useMemo(() => computeBatteryTelemetry(state, allocation), [state, allocation]);
  const evTelemetry = useMemo(() => computeEvTelemetry(state, allocation), [state, allocation]);
  const aiRecommendation = useMemo(() => computeAiRecommendation(state, allocation, aiPriorities), [state, allocation, aiPriorities]);

  // Evaluated alerts minus dismissed ones
  const alerts = useMemo(() => {
    const allAlerts = evaluateSystemAlerts(state, allocation);
    return allAlerts.filter(a => !dismissedAlertIds.has(a.id));
  }, [state, allocation, dismissedAlertIds]);

  // Live simulation tick engine (1 second interval)
  useEffect(() => {
    if (!state.isLiveTick) return;

    const interval = setInterval(() => {
      setState(prev => {
        // Subtle realistic solar irradiance fluctuation (+/- 0.04 kW)
        const solarDelta = (Math.random() - 0.48) * 0.08;
        const nextSolar = Math.max(0, Math.min(5.0, Number((prev.solarGenerationKw + solarDelta).toFixed(2))));

        // EV session progression
        const energyPerSecond = prev.chargingDemandKw / 3600;
        const nextSessionKwh = prev.sessionEnergyKwh + energyPerSecond;

        // Battery state of charge evolution based on net power
        // 1 kW for 1 second = 1/3600 kWh into battery
        const netBattKw = allocation.batteryNetPowerKw;
        const battEnergyDeltaKwh = (netBattKw / 3600);
        const socDeltaPercent = (battEnergyDeltaKwh / prev.batteryCapacityKwh) * 100;
        const nextSoc = Math.max(5, Math.min(100, Number((prev.batterySoc + socDeltaPercent).toFixed(2))));

        // Update daily aggregates
        const nextDailySolar = prev.dailySolarGeneratedKwh + (nextSolar / 3600);
        const nextDailyGrid = prev.dailyGridImportedKwh + (allocation.gridToLoadKw / 3600);
        const nextDailyEmissions = prev.dailyEmissionsAvoidedKg + (allocation.emissionsAvoidedKgHr / 3600);

        return {
          ...prev,
          solarGenerationKw: nextSolar,
          sessionEnergyKwh: nextSessionKwh,
          batterySoc: nextSoc,
          dailySolarGeneratedKwh: Number(nextDailySolar.toFixed(3)),
          dailyGridImportedKwh: Number(nextDailyGrid.toFixed(3)),
          dailyEmissionsAvoidedKg: Number(nextDailyEmissions.toFixed(3))
        };
      });

      // Append entry to rolling logs every 3 seconds to keep history fresh
      const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setTelemetryLogs(prevLogs => {
        const newEntry: TelemetryLogEntry = {
          timestamp: nowTime,
          solarKw: state.solarGenerationKw,
          loadKw: allocation.totalLoadDeliveredKw,
          batterySoc: state.batterySoc,
          batteryTempC: state.batteryTempC,
          batteryPowerKw: allocation.batteryNetPowerKw,
          gridKw: allocation.gridToLoadKw,
          renewableShare: allocation.renewableSharePercent,
          co2SavedKg: allocation.emissionsAvoidedKgHr,
          chargingMode: state.chargingMode
        };
        const updated = [...prevLogs.slice(1), newEntry];
        return updated;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [state.isLiveTick, state.chargingDemandKw, allocation, state.batteryCapacityKwh, state.solarGenerationKw, state.batterySoc, state.batteryTempC, state.chargingMode]);

  // Setters
  const setSolarGenerationKw = useCallback((kw: number) => {
    setState(s => ({ ...s, solarGenerationKw: Number(Math.max(0, Math.min(5.0, kw)).toFixed(2)) }));
  }, []);

  const setBatterySoc = useCallback((soc: number) => {
    setState(s => ({ ...s, batterySoc: Number(Math.max(0, Math.min(100, soc)).toFixed(1)) }));
  }, []);

  const setChargingDemandKw = useCallback((kw: number) => {
    setState(s => ({ ...s, chargingDemandKw: Number(Math.max(0, Math.min(5.0, kw)).toFixed(2)) }));
  }, []);

  const setBatteryTempC = useCallback((temp: number) => {
    setState(s => ({ ...s, batteryTempC: Math.max(15, Math.min(60, temp)) }));
  }, []);

  const setGridBackupEnabled = useCallback((enabled: boolean) => {
    setState(s => ({ ...s, gridBackupEnabled: enabled }));
  }, []);

  const setSolarPriorityEnabled = useCallback((enabled: boolean) => {
    setState(s => ({ ...s, solarPriorityEnabled: enabled }));
  }, []);

  const setChargingMode = useCallback((mode: ChargingMode) => {
    setState(s => ({ ...s, chargingMode: mode }));
  }, []);

  const toggleLiveTick = useCallback(() => {
    setState(s => ({ ...s, isLiveTick: !s.isLiveTick }));
  }, []);

  const toggleReducedMotion = useCallback(() => {
    setState(s => ({ ...s, isReducedMotion: !s.isReducedMotion }));
  }, []);

  const setTimeFilter = useCallback((filter: SimulationState['timeFilter']) => {
    setState(s => ({ ...s, timeFilter: filter }));
  }, []);

  const toggleFault = useCallback((fault: keyof FaultInjectionState) => {
    setState(s => ({
      ...s,
      faults: { ...s.faults, [fault]: !s.faults[fault] }
    }));
  }, []);

  const resetFaults = useCallback(() => {
    setState(s => ({ ...s, faults: defaultFaults }));
  }, []);

  const dismissAlert = useCallback((id: string) => {
    setDismissedAlertIds(prev => new Set(prev).add(id));
  }, []);

  const resetSimulation = useCallback(() => {
    setState(initialSimulationState);
    setAiPriorities(initialPriorities);
    setDismissedAlertIds(new Set());
  }, []);

  const applyScenario = useCallback((scenario: 'A' | 'B' | 'C' | 'D') => {
    setDismissedAlertIds(new Set());
    if (scenario === 'A') {
      // SCENARIO A: Standard / Grid-dependent charging
      setState(s => ({
        ...s,
        solarGenerationKw: 3.5,
        batterySoc: 70,
        chargingDemandKw: 4.0,
        batteryTempC: 28,
        gridBackupEnabled: true,
        solarPriorityEnabled: false,
        chargingMode: 'standard',
        faults: defaultFaults
      }));
    } else if (scenario === 'B') {
      // SCENARIO B: SolarCharge AI Smart Mode
      setState(s => ({
        ...s,
        solarGenerationKw: 4.5,
        batterySoc: 65,
        chargingDemandKw: 3.5,
        batteryTempC: 27,
        gridBackupEnabled: true,
        solarPriorityEnabled: true,
        chargingMode: 'smart_balanced',
        faults: defaultFaults
      }));
    } else if (scenario === 'C') {
      // SCENARIO C: Night / Low Solar with Battery Backup
      setState(s => ({
        ...s,
        solarGenerationKw: 0.2,
        batterySoc: 82,
        chargingDemandKw: 3.0,
        batteryTempC: 25,
        gridBackupEnabled: true,
        solarPriorityEnabled: true,
        chargingMode: 'smart_balanced',
        faults: defaultFaults
      }));
    } else if (scenario === 'D') {
      // SCENARIO D: Off-Grid Islanded Emergency
      setState(s => ({
        ...s,
        solarGenerationKw: 3.2,
        batterySoc: 55,
        chargingDemandKw: 3.8,
        batteryTempC: 29,
        gridBackupEnabled: false,
        solarPriorityEnabled: true,
        chargingMode: 'solar_priority',
        faults: { ...defaultFaults, gridOutage: true }
      }));
    }
  }, []);

  return (
    <SimulationContext.Provider
      value={{
        state,
        allocation,
        batteryTelemetry,
        evTelemetry,
        aiRecommendation,
        aiPriorities,
        alerts,
        telemetryLogs,
        forecastData,
        setSolarGenerationKw,
        setBatterySoc,
        setChargingDemandKw,
        setBatteryTempC,
        setGridBackupEnabled,
        setSolarPriorityEnabled,
        setChargingMode,
        setAiPriorities,
        toggleLiveTick,
        toggleReducedMotion,
        setTimeFilter,
        toggleFault,
        resetFaults,
        dismissAlert,
        resetSimulation,
        applyScenario
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const ctx = useContext(SimulationContext);
  if (!ctx) throw new Error('useSimulation must be used within SimulationProvider');
  return ctx;
};
