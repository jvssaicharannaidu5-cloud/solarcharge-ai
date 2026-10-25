import React from 'react';
import { Activity } from 'lucide-react';

interface TelemetryBadgeProps {
  label?: string;
  className?: string;
  compact?: boolean;
}

export const TelemetryBadge: React.FC<TelemetryBadgeProps> = ({
  label = 'SIMULATED DEMO DATA',
  className = '',
  compact = false
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider font-semibold uppercase bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 shadow-sm ${className}`}
      title="This metric is calculated by the physics simulation engine and represents simulated demo telemetry."
    >
      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
      {!compact && <Activity className="w-2.5 h-2.5 text-cyan-400" />}
      <span>{label}</span>
    </span>
  );
};
