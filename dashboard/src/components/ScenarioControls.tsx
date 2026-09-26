import React from 'react';
import { RefreshCw, AlertTriangle, ShieldCheck, Flame } from 'lucide-react';

interface ScenarioControlsProps {
  currentScenario: string;
  onSelectScenario: (scenario: 'nominal' | 'outage' | 'crashing') => void;
}

export const ScenarioControls: React.FC<ScenarioControlsProps> = ({
  currentScenario,
  onSelectScenario,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto my-3 bg-[#131526] p-3 border-2 border-arcade-border font-pixel text-xs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-gray-300 text-[10px]">
          <RefreshCw className="w-3.5 h-3.5 text-arcade-cyan animate-spin" />
          <span>SIMULATE TELEMETRY STATE:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Nominal */}
          <button
            onClick={() => onSelectScenario('nominal')}
            className={`px-2.5 py-1.5 border-2 border-black pixel-btn text-[9px] flex items-center gap-1.5 ${
              currentScenario === 'nominal'
                ? 'bg-arcade-green text-black font-bold'
                : 'bg-[#22263f] text-gray-300'
            }`}
          >
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>NOMINAL (BOOMING)</span>
          </button>

          {/* Web Outage */}
          <button
            onClick={() => onSelectScenario('outage')}
            className={`px-2.5 py-1.5 border-2 border-black pixel-btn text-[9px] flex items-center gap-1.5 ${
              currentScenario === 'outage'
                ? 'bg-arcade-red text-white font-bold'
                : 'bg-[#22263f] text-gray-300'
            }`}
          >
            <Flame className="w-3 h-3 text-red-400" />
            <span>WEB OUTAGE (DESK 2)</span>
          </button>

          {/* Roblox Crashing */}
          <button
            onClick={() => onSelectScenario('crashing')}
            className={`px-2.5 py-1.5 border-2 border-black pixel-btn text-[9px] flex items-center gap-1.5 ${
              currentScenario === 'crashing'
                ? 'bg-arcade-gold text-black font-bold'
                : 'bg-[#22263f] text-gray-300'
            }`}
          >
            <AlertTriangle className="w-3 h-3 text-amber-300" />
            <span>CRASH SPIKE (DESK 1)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
