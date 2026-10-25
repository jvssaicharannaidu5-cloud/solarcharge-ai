import React from 'react';
import { LucideIcon } from 'lucide-react';
import { TelemetryBadge } from './TelemetryBadge';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  subtext?: string;
  badge?: string;
  badgeColor?: 'emerald' | 'amber' | 'cyan' | 'rose' | 'slate';
  glowColor?: 'emerald' | 'solar' | 'cyan' | 'rose';
  isSimulated?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  icon: Icon,
  subtext,
  badge,
  badgeColor = 'cyan',
  glowColor,
  isSimulated = true
}) => {
  const badgeClasses = {
    emerald: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40',
    amber: 'bg-amber-950/80 text-amber-300 border-amber-500/40',
    cyan: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40',
    rose: 'bg-rose-950/80 text-rose-300 border-rose-500/40',
    slate: 'bg-slate-800 text-slate-300 border-slate-600/40'
  }[badgeColor];

  const glowClass = glowColor ? `glow-${glowColor}` : '';

  return (
    <div className={`glass-panel p-5 rounded-2xl relative overflow-hidden group transition-all duration-300 hover:border-cyan-500/30 ${glowClass}`}>
      {/* Decorative gradient flare */}
      <div className="absolute -top-12 -right-12 w-28 h-28 rounded-full bg-cyan-500/5 blur-2xl pointer-events-none group-hover:bg-cyan-500/10 transition-colors" />

      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-slate-800/90 border border-slate-700/60 text-cyan-400 group-hover:text-cyan-300 transition-colors">
            <Icon className="w-5 h-5" />
          </div>
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">{title}</span>
        </div>

        {badge && (
          <span className={`text-[11px] font-mono px-2 py-0.5 rounded-md border font-medium ${badgeClasses}`}>
            {badge}
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-1.5 mt-1">
        <span className="text-3xl font-extrabold font-mono text-slate-100 tracking-tight">
          {value}
        </span>
        {unit && <span className="text-sm font-semibold text-slate-400 font-mono">{unit}</span>}
      </div>

      <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-slate-800/80">
        <span className="text-xs text-slate-400 truncate">{subtext || 'Telemetry nominal'}</span>
        {isSimulated && <TelemetryBadge compact />}
      </div>
    </div>
  );
};
