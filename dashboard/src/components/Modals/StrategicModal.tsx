import React from 'react';
import { X, Sparkles, Target, Zap, Rocket } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { GrowthAuditReport } from '../../types/telemetry.ts';

interface StrategicModalProps {
  isOpen: boolean;
  audit: GrowthAuditReport;
  onClose: () => void;
}

export const StrategicModal: React.FC<StrategicModalProps> = ({ isOpen, audit, onClose }) => {
  if (!isOpen) return null;

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-[#111322] border-4 border-arcade-cyan shadow-pixel-lg text-white font-pixel p-5 sm:p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b-4 border-arcade-border pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-arcade-cyan animate-pulse" />
            <span className="text-xs sm:text-sm text-arcade-cyan font-bold tracking-wider">
              WEEKLY STRATEGIC DIRECTIVE • AI DIRECTOR
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 bg-arcade-red text-white border-2 border-black pixel-btn hover:bg-red-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="text-[11px] leading-relaxed max-h-[65vh] overflow-y-auto pr-2 space-y-4">
          
          {/* Executive Summary Terminal Card */}
          <div className="bg-[#1b1e36] border-2 border-arcade-cyan/60 p-3.5">
            <div className="text-[9px] text-arcade-cyan mb-1.5 font-retro tracking-normal">
              &gt; QUANTITATIVE EXECUTIVE DIAGNOSIS ({audit.provider})
            </div>
            <div className="text-gray-200 text-[10px] leading-relaxed">
              {audit.executiveSummary}
            </div>
          </div>

          {/* Diagnosed Friction Points */}
          <div className="bg-[#181a2e] border-2 border-arcade-border p-3">
            <div className="text-xs text-arcade-gold mb-2 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" />
              <span>DIAGNOSED GROWTH FRICTION POINTS</span>
            </div>
            <ul className="space-y-1.5 text-[10px] text-gray-300">
              {audit.keyBottlenecks.map((b, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-arcade-gold font-bold">{i + 1}.</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 3 High-Impact Tactical Experiments */}
          <div className="space-y-3">
            <div className="text-xs text-arcade-green flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-arcade-green" />
              <span>3 TESTABLE WEEKLY GROWTH EXPERIMENTS</span>
            </div>

            {audit.tacticalExperiments.map((exp, idx) => (
              <div
                key={exp.id || idx}
                className="bg-[#171b30] border-2 border-white/20 p-3.5 space-y-2 hover:border-arcade-cyan transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
                  <span className="font-bold text-arcade-gold text-[11px]">
                    #{idx + 1} {exp.title}
                  </span>
                  <span className="bg-black/60 px-2 py-0.5 text-[8px] text-arcade-cyan border border-arcade-cyan/40">
                    {exp.area} • EFFORT: {exp.effortEstimate}
                  </span>
                </div>

                <div className="text-[10px] text-gray-300">
                  <strong className="text-white">Hypothesis:</strong> {exp.hypothesis}
                </div>

                {/* Steps */}
                <div className="bg-black/40 p-2 border border-white/10 space-y-1">
                  <div className="text-[9px] text-gray-400 font-retro">IMPLEMENTATION PLAN:</div>
                  {exp.implementationSteps.map((step, sIdx) => (
                    <div key={sIdx} className="text-[9px] text-gray-300 flex items-start gap-1.5">
                      <span className="text-arcade-green">└ •</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>

                {/* Target Metric */}
                <div className="flex justify-between items-center text-[9px] pt-1 text-gray-400">
                  <span>Track Metric: <code className="text-arcade-green">{exp.metricToTrack}</code></span>
                  <span className="text-arcade-gold font-bold">Target Lift: {exp.targetImprovement}</span>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Footer with Confetti Button */}
        <div className="mt-4 pt-3 border-t-2 border-arcade-border flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={triggerConfetti}
            className="px-3 py-1.5 bg-arcade-green text-black border-2 border-black pixel-btn text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-400"
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>APPROVE & CELEBRATE</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#2c3258] text-white border-2 border-black pixel-btn text-xs hover:bg-[#3b4374]"
          >
            CLOSE DIRECTIVE
          </button>
        </div>

      </div>
    </div>
  );
};
