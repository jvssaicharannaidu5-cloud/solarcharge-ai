import React from 'react';
import { Sun, Battery, Car, Zap, Shield, ArrowUpRight } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export const HeroStationVisual: React.FC = () => {
  const { allocation, state } = useSimulation();
  const isReducedMotion = state.isReducedMotion;

  return (
    <div className="relative w-full max-w-2xl mx-auto rounded-3xl p-6 glass-panel border-cyan-500/25 overflow-hidden shadow-2xl">
      {/* Background ambient lighting */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
      
      {/* Station Status Overlay Pill */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="text-xs font-mono font-bold tracking-wider text-emerald-400 uppercase">
            MICROGRID CONTROLLER ACTIVE
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-700/80">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span>{allocation.renewableSharePercent}% CLEAN SOLAR HARVEST</span>
        </div>
      </div>

      {/* SVG Canvas for Isometric Charging Hub */}
      <div className="relative w-full aspect-[16/10] flex items-center justify-center">
        <svg
          viewBox="0 0 800 500"
          className="w-full h-full drop-shadow-2xl"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="groundGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0f172a" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#090e17" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="solarPanelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e3a8a" />
              <stop offset="50%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>
            <linearGradient id="canopyFrameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
            <linearGradient id="carBodyGrad" x1="0%" y1="0%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="50%" stopColor="#0369a1" />
              <stop offset="100%" stopColor="#0c4a6e" />
            </linearGradient>
            <linearGradient id="bessCabinetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="laserLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Isometric Ground Base Platform */}
          <polygon
            points="400,100 750,250 400,450 50,300"
            fill="url(#groundGrad)"
            stroke="#1e293b"
            strokeWidth="3"
          />
          <polygon
            points="50,300 400,450 400,470 50,320"
            fill="#0b1120"
            stroke="#1e293b"
            strokeWidth="1.5"
          />
          <polygon
            points="750,250 400,450 400,470 750,270"
            fill="#080d1a"
            stroke="#1e293b"
            strokeWidth="1.5"
          />

          {/* Grid lines on tarmac */}
          <line x1="280" y1="230" x2="520" y2="350" stroke="#334155" strokeWidth="1" strokeDasharray="4 6" opacity="0.4" />
          <line x1="200" y1="280" x2="440" y2="400" stroke="#334155" strokeWidth="1" strokeDasharray="4 6" opacity="0.4" />

          {/* EV Charging Bay Marking */}
          <polygon
            points="380,260 560,340 460,390 280,310"
            fill="#06b6d4"
            fillOpacity="0.06"
            stroke="#06b6d4"
            strokeWidth="1.5"
            strokeDasharray="6 4"
          />

          {/* ================= CANOPY STRUCTURE ================= */}
          {/* Canopy Rear Pillars */}
          <line x1="260" y1="200" x2="260" y2="90" stroke="url(#canopyFrameGrad)" strokeWidth="10" strokeLinecap="round" />
          <line x1="560" y1="240" x2="560" y2="130" stroke="url(#canopyFrameGrad)" strokeWidth="10" strokeLinecap="round" />

          {/* Solar Canopy Roof (Tilted Plane) */}
          <polygon
            points="180,60 520,30 640,140 300,170"
            fill="url(#solarPanelGrad)"
            stroke="#38bdf8"
            strokeWidth="3"
            filter="url(#glow)"
          />

          {/* Solar PV Module Cell Grid Lines */}
          <line x1="265" y1="52" x2="385" y2="162" stroke="#bae6fd" strokeWidth="1" opacity="0.7" />
          <line x1="350" y1="45" x2="470" y2="155" stroke="#bae6fd" strokeWidth="1" opacity="0.7" />
          <line x1="435" y1="37" x2="555" y2="147" stroke="#bae6fd" strokeWidth="1" opacity="0.7" />

          <line x1="220" y1="96" x2="560" y2="66" stroke="#bae6fd" strokeWidth="1" opacity="0.7" />
          <line x1="260" y1="133" x2="600" y2="103" stroke="#bae6fd" strokeWidth="1" opacity="0.7" />

          {/* Canopy Front Support Pillars */}
          <line x1="300" y1="170" x2="300" y2="300" stroke="url(#canopyFrameGrad)" strokeWidth="12" strokeLinecap="round" />
          <line x1="640" y1="140" x2="640" y2="280" stroke="url(#canopyFrameGrad)" strokeWidth="12" strokeLinecap="round" />

          {/* Sun Ray Beams hitting canopy */}
          <g opacity="0.7">
            <line x1="240" y1="0" x2="280" y2="70" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 6" />
            <line x1="380" y1="0" x2="420" y2="50" stroke="#fbbf24" strokeWidth="2.5" strokeDasharray="4 6" />
            <line x1="520" y1="0" x2="550" y2="40" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 6" />
          </g>

          {/* ================= BESS BATTERY CABINET ================= */}
          {/* Cabinet Base / Box */}
          <polygon points="150,220 220,185 220,290 150,325" fill="#1e293b" stroke="#334155" strokeWidth="2" />
          <polygon points="220,185 260,205 260,310 220,290" fill="#0f172a" stroke="#334155" strokeWidth="2" />
          <polygon points="150,220 220,185 260,205 190,240" fill="#334155" stroke="#475569" strokeWidth="2" />

          {/* BESS LED Status Bars */}
          <line x1="165" y1="245" x2="205" y2="225" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
          <line x1="165" y1="265" x2="205" y2="245" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
          <line x1="165" y1="285" x2="205" y2="265" stroke="#06b6d4" strokeWidth="3" strokeLinecap="round" />
          <line x1="165" y1="305" x2="205" y2="285" stroke="#06b6d4" strokeWidth="3" strokeLinecap="round" />

          {/* ================= EV CHARGER DISPENSER PEDESTAL ================= */}
          <polygon points="320,280 345,268 345,340 320,352" fill="#334155" stroke="#475569" strokeWidth="2" />
          <polygon points="345,268 360,275 360,347 345,340" fill="#1e293b" stroke="#475569" strokeWidth="2" />
          <polygon points="320,280 345,268 360,275 335,287" fill="#64748b" stroke="#94a3b8" strokeWidth="1" />

          {/* EVSE Display Screen */}
          <polygon points="325,290 340,283 340,305 325,312" fill="#06b6d4" filter="url(#glow)" />

          {/* ================= ELECTRIC VEHICLE SILHOUETTE ================= */}
          {/* Main Car Body Isometric */}
          <path
            d="M 400 320 L 460 290 L 550 310 L 590 340 L 530 380 L 440 355 Z"
            fill="url(#carBodyGrad)"
            stroke="#38bdf8"
            strokeWidth="2.5"
          />
          {/* Car Cabin & Windshield */}
          <path
            d="M 440 315 L 480 295 L 530 305 L 540 330 L 460 345 Z"
            fill="#0f172a"
            stroke="#0284c7"
            strokeWidth="1.5"
          />
          {/* Wheels */}
          <ellipse cx="450" cy="355" rx="14" ry="18" fill="#020617" stroke="#475569" strokeWidth="3" />
          <ellipse cx="540" cy="365" rx="14" ry="18" fill="#020617" stroke="#475569" strokeWidth="3" />

          {/* Headlights / Taillights */}
          <polygon points="398,322 410,317 415,325 403,330" fill="#22d3ee" filter="url(#glow)" />
          <polygon points="585,342 590,340 592,348 587,350" fill="#f43f5e" filter="url(#glow)" />

          {/* ================= CHARGING CABLE & POWER PULSES ================= */}
          {/* High-voltage flex cable from Dispenser to EV port */}
          <path
            d="M 345 320 Q 380 345 425 330"
            fill="none"
            stroke="#22d3ee"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Conduit from Canopy MPPT down to BESS and Dispenser */}
          <path
            d="M 300 210 L 220 230 L 220 270 L 320 315"
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeDasharray="6 6"
            className={!isReducedMotion ? 'animate-flow-normal' : ''}
          />

          {/* Glowing Charge Port Plug Socket */}
          <circle cx="425" cy="330" r="6" fill="#38bdf8" filter="url(#glow)" />

          {/* Power particle ripples around car socket */}
          <circle cx="425" cy="330" r="14" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.8">
            {!isReducedMotion && <animate attributeName="r" values="8;20;8" dur="2s" repeatCount="indefinite" />}
          </circle>
        </svg>

        {/* Floating Interactive Badge Overlays */}
        <div className="absolute top-4 left-4 p-2.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-amber-500/40 text-amber-300 text-xs font-mono shadow-lg flex items-center gap-2">
          <Sun className="w-4 h-4 text-amber-400" />
          <div>
            <div className="text-[10px] text-slate-400">Canopy PV Array</div>
            <div className="font-bold">{state.solarGenerationKw} kW Active</div>
          </div>
        </div>

        <div className="absolute bottom-6 left-6 p-2.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-xs font-mono shadow-lg flex items-center gap-2">
          <Battery className="w-4 h-4 text-emerald-400" />
          <div>
            <div className="text-[10px] text-slate-400">10 kWh BESS Pack</div>
            <div className="font-bold">{state.batterySoc}% SOC ({state.batteryTempC}°C)</div>
          </div>
        </div>

        <div className="absolute bottom-6 right-6 p-2.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-cyan-500/40 text-cyan-300 text-xs font-mono shadow-lg flex items-center gap-2">
          <Car className="w-4 h-4 text-cyan-400" />
          <div>
            <div className="text-[10px] text-slate-400">Smart EVSE Load</div>
            <div className="font-bold">{allocation.totalLoadDeliveredKw} kW Delivered</div>
          </div>
        </div>
      </div>

      {/* Mini Telemetry Status Bar below illustration */}
      <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-3 gap-2 text-center text-xs font-mono">
        <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
          <span className="text-slate-400 block text-[10px]">SOLAR HARVEST</span>
          <span className="text-amber-400 font-bold">{state.solarGenerationKw} kW</span>
        </div>
        <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
          <span className="text-slate-400 block text-[10px]">BESS NET BUFFER</span>
          <span className={allocation.batteryNetPowerKw >= 0 ? 'text-emerald-400 font-bold' : 'text-cyan-400 font-bold'}>
            {allocation.batteryNetPowerKw >= 0 ? `+${allocation.batteryNetPowerKw}` : allocation.batteryNetPowerKw} kW
          </span>
        </div>
        <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
          <span className="text-slate-400 block text-[10px]">GRID OFFSET</span>
          <span className="text-purple-400 font-bold">{allocation.gridToLoadKw} kW</span>
        </div>
      </div>
    </div>
  );
};
