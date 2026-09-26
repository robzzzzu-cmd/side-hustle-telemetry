import React from 'react';
import {
  DollarSign,
  Activity,
  Users,
  Volume2,
  VolumeX,
  Tv,
  Layers
} from 'lucide-react';
import type { TelemetryState } from '../types/telemetry.ts';

interface TopHUDProps {
  telemetry: TelemetryState;
  isDemoMode: boolean;
  onToggleDemoMode: () => void;
  crtEnabled: boolean;
  onToggleCrt: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const TopHUD: React.FC<TopHUDProps> = ({
  telemetry,
  isDemoMode,
  onToggleDemoMode,
  crtEnabled,
  onToggleCrt,
  soundEnabled,
  onToggleSound,
}) => {
  const { roblox, webHealth, totalHustleRevenueUsd } = telemetry;
  const isHealthy = webHealth.downCount === 0 && roblox.errorCount === 0;

  return (
    <header className="w-full bg-[#131525] border-b-4 border-black p-3 text-white font-pixel text-xs tracking-wider shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand & Live Beacon */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#20243d] px-3 py-1.5 border-2 border-white/80 shadow-pixel-sm">
            <span className="text-sm">🕹️</span>
            <span className="font-bold text-arcade-cyan text-[11px] sm:text-xs">PIXEL STUDIO HQ</span>
          </div>

          {/* Animated Green Beacon */}
          <div className="flex items-center gap-2 bg-black/60 px-2.5 py-1.5 border border-white/20">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isHealthy ? 'bg-green-400' : 'bg-red-500'
              }`} />
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                isHealthy ? 'bg-green-500' : 'bg-red-500'
              }`} />
            </span>
            <span className={`text-[9px] ${isHealthy ? 'text-green-400' : 'text-red-400'}`}>
              {isHealthy ? 'ONLINE' : 'ALERT'}
            </span>
          </div>
        </div>

        {/* Telemetry Stats Tickers */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-6">
          {/* Revenue */}
          <div className="flex items-center gap-2 bg-[#1b1e36] px-3 py-1.5 border-2 border-arcade-border">
            <DollarSign className="w-3.5 h-3.5 text-arcade-gold animate-bounce" />
            <div>
              <div className="text-[9px] text-gray-400 font-retro tracking-normal">HUSTLE REVENUE</div>
              <div className="text-arcade-gold font-bold text-[10px] sm:text-xs">
                ${totalHustleRevenueUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          {/* System Uptime */}
          <div className="flex items-center gap-2 bg-[#1b1e36] px-3 py-1.5 border-2 border-arcade-border">
            <Activity className="w-3.5 h-3.5 text-arcade-green" />
            <div>
              <div className="text-[9px] text-gray-400 font-retro tracking-normal">GLOBAL UPTIME</div>
              <div className={`font-bold text-[10px] sm:text-xs ${
                webHealth.uptimePercent >= 99 ? 'text-arcade-green' : 'text-arcade-red'
              }`}>
                {webHealth.uptimePercent}%
              </div>
            </div>
          </div>

          {/* Live Roblox CCU */}
          <div className="flex items-center gap-2 bg-[#1b1e36] px-3 py-1.5 border-2 border-arcade-border">
            <Users className="w-3.5 h-3.5 text-arcade-blue" />
            <div>
              <div className="text-[9px] text-gray-400 font-retro tracking-normal">LIVE ROBLOX CCU</div>
              <div className="text-arcade-blue font-bold text-[10px] sm:text-xs">
                {roblox.currentCcu.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Toggles & Options */}
        <div className="flex items-center gap-2">
          {/* CRT Toggle */}
          <button
            onClick={onToggleCrt}
            title="Toggle Retro CRT Scanlines"
            className={`p-2 border-2 border-black pixel-btn text-[10px] flex items-center gap-1 ${
              crtEnabled ? 'bg-arcade-cyan text-black' : 'bg-[#2b2d42] text-gray-300'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span className="hidden md:inline">CRT</span>
          </button>

          {/* Audio Toggle */}
          <button
            onClick={onToggleSound}
            title="Toggle 8-Bit Chiptune Sound FX"
            className={`p-2 border-2 border-black pixel-btn text-[10px] flex items-center gap-1 ${
              soundEnabled ? 'bg-arcade-green text-black' : 'bg-[#2b2d42] text-gray-300'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">SFX</span>
          </button>

          {/* Demo Mode Toggle */}
          <button
            onClick={onToggleDemoMode}
            title="Toggle Demo vs Live Data"
            className={`px-2.5 py-1.5 border-2 border-black pixel-btn text-[10px] flex items-center gap-1.5 ${
              isDemoMode ? 'bg-arcade-gold text-black' : 'bg-arcade-purple text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isDemoMode ? 'DEMO' : 'LIVE'}</span>
          </button>
        </div>

      </div>
    </header>
  );
};
