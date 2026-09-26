import React, { useState } from 'react';
import type { TelemetryState, WorkerId } from './types/telemetry.ts';
import { mockNominalState, mockOutageState, mockCrashingState } from './data/mockTelemetry.ts';
import { TopHUD } from './components/TopHUD.tsx';
import { OfficeCanvas } from './components/OfficeCanvas.tsx';
import { ScenarioControls } from './components/ScenarioControls.tsx';
import { WorkerModal } from './components/Modals/WorkerModal.tsx';
import { StrategicModal } from './components/Modals/StrategicModal.tsx';
import { RetroScanlines } from './components/RetroScanlines.tsx';
import { toggleSound } from './utils/soundEffects.ts';

export const App: React.FC = () => {
  const [currentScenario, setCurrentScenario] = useState<'nominal' | 'outage' | 'crashing'>('nominal');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [crtEnabled, setCrtEnabled] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const [selectedWorker, setSelectedWorker] = useState<WorkerId | null>(null);
  const [isStrategicModalOpen, setIsStrategicModalOpen] = useState<boolean>(false);

  // Active Telemetry Dataset
  const activeTelemetry: TelemetryState =
    currentScenario === 'nominal'
      ? mockNominalState
      : currentScenario === 'outage'
        ? mockOutageState
        : mockCrashingState;

  const handleSelectWorker = (workerId: WorkerId) => {
    if (workerId === 'ai_director') {
      setIsStrategicModalOpen(true);
    } else {
      setSelectedWorker(workerId);
    }
  };

  const handleToggleSound = () => {
    const next = toggleSound();
    setSoundEnabled(next);
  };

  return (
    <div className="min-h-screen bg-[#0b0c16] text-white font-pixel flex flex-col justify-between selection:bg-arcade-cyan selection:text-black">
      {/* CRT Scanline & Curved Vignette Overlay */}
      <RetroScanlines enabled={crtEnabled} />

      {/* Top HUD Bar */}
      <TopHUD
        telemetry={activeTelemetry}
        isDemoMode={isDemoMode}
        onToggleDemoMode={() => setIsDemoMode(!isDemoMode)}
        crtEnabled={crtEnabled}
        onToggleCrt={() => setCrtEnabled(!crtEnabled)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Main Interactive Stage */}
      <main className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 w-full max-w-7xl mx-auto">
        
        {/* Title & Instructions */}
        <div className="text-center mb-2">
          <h1 className="text-arcade-gold text-sm sm:text-base tracking-widest uppercase mb-1 drop-shadow-md">
            Side-Hustle Command Center
          </h1>
          <p className="text-[10px] text-gray-400 font-retro tracking-normal">
            CLICK ON WORKERS OR THE PACING AI DIRECTOR TO INSPECT DETAILED TELEMETRY
          </p>
        </div>

        {/* Animated Office Canvas */}
        <OfficeCanvas
          telemetry={activeTelemetry}
          onSelectWorker={handleSelectWorker}
        />

        {/* Interactive Scenario Switcher */}
        <ScenarioControls
          currentScenario={currentScenario}
          onSelectScenario={(s) => setCurrentScenario(s)}
        />
      </main>

      {/* Retro Footer */}
      <footer className="w-full bg-[#111322] border-t-2 border-arcade-border p-2 text-center text-[9px] text-gray-400 font-retro">
        PIXEL STUDIO HQ • POWERED BY GITHUB ACTIONS & ROBLOX OPEN CLOUD • MIT LICENSE
      </footer>

      {/* Modal: Roblox Dev / Sysadmin / SEO Specialist */}
      <WorkerModal
        workerId={selectedWorker}
        telemetry={activeTelemetry}
        onClose={() => setSelectedWorker(null)}
      />

      {/* Modal: AI Director Strategic Directive */}
      <StrategicModal
        isOpen={isStrategicModalOpen}
        audit={activeTelemetry.growthAudit}
        onClose={() => setIsStrategicModalOpen(false)}
      />
    </div>
  );
};

export default App;
