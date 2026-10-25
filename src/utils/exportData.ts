import { TelemetryLogEntry } from '../types';

export function exportTelemetryToCSV(logs: TelemetryLogEntry[]): void {
  if (!logs || logs.length === 0) return;

  const headers = [
    'Timestamp',
    'Solar Generation (kW)',
    'EV Demand (kW)',
    'Battery SOC (%)',
    'Battery Temp (C)',
    'Battery Net Power (kW)',
    'Grid Import (kW)',
    'Renewable Share (%)',
    'CO2 Avoided (kg)',
    'Charging Mode'
  ];

  const rows = logs.map(entry => [
    `"${entry.timestamp}"`,
    entry.solarKw.toFixed(2),
    entry.loadKw.toFixed(2),
    entry.batterySoc.toFixed(1),
    entry.batteryTempC.toFixed(1),
    entry.batteryPowerKw.toFixed(2),
    entry.gridKw.toFixed(2),
    entry.renewableShare.toFixed(1),
    entry.co2SavedKg.toFixed(3),
    `"${entry.chargingMode}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `solarcharge_telemetry_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportTelemetryToJSON(logs: TelemetryLogEntry[]): void {
  if (!logs || logs.length === 0) return;

  const jsonString = JSON.stringify(logs, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `solarcharge_telemetry_${Date.now()}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
