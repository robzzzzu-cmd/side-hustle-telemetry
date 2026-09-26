import React, { useState, useEffect, useCallback } from 'react';
import type { TelemetryState, WorkerId } from './types/telemetry.ts';
import { mockNominalState, mockOutageState, mockCrashingState } from './data/mockTelemetry.ts';
import { TopHUD } from './components/TopHUD.tsx';
import { OfficeCanvas } from './components/OfficeCanvas.tsx';
import { ScenarioControls } from './components/ScenarioControls.tsx';
import { WorkerModal } from './components/Modals/WorkerModal.tsx';
import { StrategicModal } from './components/Modals/StrategicModal.tsx';
import { SettingsModal } from './components/Modals/SettingsModal.tsx';
import { RetroScanlines } from './components/RetroScanlines.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import { toggleSound, playBeep, playCoinSound } from './utils/soundEffects.ts';
import {
  loadUserTargets,
  saveUserTargets,
  fetchLiveRobloxStats,
  pingRealEndpoints,
  loadPublishedTelemetry,
  type UserTargetsConfig,
} from './utils/liveTelemetry.ts';

export const AppContent: React.FC = () => {
  const [userTargets, setUserTargets] = useState<UserTargetsConfig>(() => loadUserTargets());
  const [currentScenario, setCurrentScenario] = useState<'nominal' | 'outage' | 'crashing'>('nominal');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [crtEnabled, setCrtEnabled] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Modals State
  const [selectedWorker, setSelectedWorker] = useState<WorkerId | null>(null);
  const [isStrategicModalOpen, setIsStrategicModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);

  // Active Telemetry initialized safely with real platform baseline
  const [activeTelemetry, setActiveTelemetry] = useState<TelemetryState>(mockNominalState);

  const hasCustomTargets = Boolean(userTargets.robloxUniverseId || userTargets.monitoredUrls.length > 0);

  // Function to execute live ping against real platforms
  const refreshLiveTelemetry = useCallback(async () => {
    setIsRefreshing(true);
    playBeep();

    try {
      // 1. Check if backend published artifact exists
      const published = await loadPublishedTelemetry();
      let baseState = published || mockNominalState;

      // 2. Fetch live Roblox stats for real Universe
      const targetId = userTargets.robloxUniverseId || '10766029183';
      const robloxLive = await fetchLiveRobloxStats(targetId);
      if (robloxLive) {
        baseState = {
          ...baseState,
          roblox: {
            ...baseState.roblox,
            ...robloxLive,
          },
        };
      }

      // 3. Ping real Web endpoints
      const targetUrls = userTargets.monitoredUrls && userTargets.monitoredUrls.length > 0
        ? userTargets.monitoredUrls
        : ['https://www.tradeopportunities.trade/#opportunities'];
      
      const realWeb = await pingRealEndpoints(targetUrls);
      baseState = {
        ...baseState,
        webHealth: realWeb,
      };

      // 4. Update revenue if configured
      if (userTargets.monthlyRevenueUsd > 0) {
        baseState = {
          ...baseState,
          totalHustleRevenueUsd: userTargets.monthlyRevenueUsd,
        };
      }

      setActiveTelemetry(baseState);
      playCoinSound();
    } catch (e) {
      console.warn('[Dashboard] Live refresh error:', e);
    } finally {
      setIsRefreshing(false);
    }
  }, [userTargets]);

  // Initial load
  useEffect(() => {
    refreshLiveTelemetry();

    loadPublishedTelemetry().then((published) => {
      if (published && published.roblox) {
        setActiveTelemetry(published);
      }
    });
  }, [refreshLiveTelemetry]);

  // Handle Scenario Switcher
  const handleSelectScenario = (scenario: 'nominal' | 'outage' | 'crashing') => {
    setCurrentScenario(scenario);
    if (scenario === 'nominal') setActiveTelemetry(mockNominalState);
    if (scenario === 'outage') setActiveTelemetry(mockOutageState);
    if (scenario === 'crashing') setActiveTelemetry(mockCrashingState);
  };

  const handleSaveTargets = (newConfig: UserTargetsConfig) => {
    setUserTargets(newConfig);
    saveUserTargets(newConfig);
    setIsDemoMode(false);
  };

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

  const activeRoblox = activeTelemetry?.roblox || mockNominalState.roblox;
  const activeWeb = activeTelemetry?.webHealth || mockNominalState.webHealth;
  const endpoints = activeWeb.endpoints || [];

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
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onRefreshLive={refreshLiveTelemetry}
        isRefreshing={isRefreshing}
        hasCustomTargets={hasCustomTargets}
      />

      {/* Main Interactive Stage */}
      <main className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 w-full max-w-7xl mx-auto">
        
        {/* Title & Instructions */}
        <div className="text-center mb-2">
          <h1 className="text-arcade-gold text-sm sm:text-base tracking-widest uppercase mb-1 drop-shadow-md">
            Side-Hustle Command Center
          </h1>
          <p className="text-[10px] text-gray-400 font-retro tracking-normal">
            LIVE MONITORING: <span className="text-arcade-cyan">{activeRoblox.placeName}</span> (ID: {activeRoblox.universeId}) & <span className="text-arcade-green">{endpoints[0]?.url || 'Web App'}</span>
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
          onSelectScenario={handleSelectScenario}
        />
      </main>

      {/* Retro Footer */}
      <footer className="w-full bg-[#111322] border-t-2 border-arcade-border p-2 text-center text-[9px] text-gray-400 font-retro">
        PIXEL STUDIO HQ • MONITORING {activeRoblox.placeName} & {endpoints.length} WEBSITES • MIT LICENSE
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
        audit={activeTelemetry?.growthAudit || mockNominalState.growthAudit}
        onClose={() => setIsStrategicModalOpen(false)}
      />

      {/* Modal: Settings / Real Target URLs */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        config={userTargets}
        onSave={handleSaveTargets}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
};

export default App;
