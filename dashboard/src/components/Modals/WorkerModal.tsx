import React from 'react';
import { X, Gamepad2, Server, Search, AlertCircle, ShieldAlert } from 'lucide-react';
import type { TelemetryState, WorkerId } from '../../types/telemetry.ts';

interface WorkerModalProps {
  workerId: WorkerId | null;
  telemetry: TelemetryState;
  onClose: () => void;
}

export const WorkerModal: React.FC<WorkerModalProps> = ({ workerId, telemetry, onClose }) => {
  if (!workerId || workerId === 'ai_director') return null;

  const { roblox, webHealth, searchConsole } = telemetry;

  return (
    <div className="fixed inset-0 z-40 bg-black/80 flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-[#171a2e] border-4 border-white shadow-pixel-lg text-white font-pixel p-5">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b-4 border-arcade-border pb-3 mb-4">
          <div className="flex items-center gap-2">
            {workerId === 'roblox_dev' && <Gamepad2 className="w-5 h-5 text-arcade-gold" />}
            {workerId === 'web_admin' && <Server className="w-5 h-5 text-arcade-green" />}
            {workerId === 'seo_specialist' && <Search className="w-5 h-5 text-arcade-cyan" />}
            <span className="text-xs sm:text-sm text-arcade-gold tracking-wide">
              {workerId === 'roblox_dev' && 'DESK 1: ROBLOX GAME DEV TELEMETRY'}
              {workerId === 'web_admin' && 'DESK 2: WEB SYSADMIN & SERVER HEALTH'}
              {workerId === 'seo_specialist' && 'DESK 3: SEARCH CONSOLE & GROWTH LEAKS'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 bg-arcade-red text-white border-2 border-black pixel-btn hover:bg-red-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="text-[11px] leading-relaxed max-h-[60vh] overflow-y-auto pr-2 space-y-4">
          
          {/* ==================================================== */}
          {/* ROBLOX DEV VIEW */}
          {/* ==================================================== */}
          {workerId === 'roblox_dev' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="bg-[#20253f] p-3 border-2 border-arcade-border">
                  <div className="text-[9px] text-gray-400 font-retro">CONCURRENT PLAYERS</div>
                  <div className="text-sm font-bold text-arcade-blue">{roblox.currentCcu} CCU</div>
                </div>
                <div className="bg-[#20253f] p-3 border-2 border-arcade-border">
                  <div className="text-[9px] text-gray-400 font-retro">D1 RETENTION</div>
                  <div className="text-sm font-bold text-arcade-green">{roblox.estimatedD1Retention}%</div>
                </div>
                <div className="bg-[#20253f] p-3 border-2 border-arcade-border">
                  <div className="text-[9px] text-gray-400 font-retro">DAILY VISITS</div>
                  <div className="text-sm font-bold text-arcade-gold">{roblox.dailyVisits.toLocaleString()}</div>
                </div>
                <div className="bg-[#20253f] p-3 border-2 border-arcade-border">
                  <div className="text-[9px] text-gray-400 font-retro">CRASH RATE</div>
                  <div className={`text-sm font-bold ${roblox.crashRatePercent > 1.0 ? 'text-arcade-red' : 'text-arcade-green'}`}>
                    {roblox.crashRatePercent}%
                  </div>
                </div>
              </div>

              {/* Luau Runtime Exceptions Table */}
              <div className="border-2 border-arcade-border bg-[#101222] p-3">
                <div className="text-xs text-arcade-cyan mb-2 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>LUAU RUNTIME EXCEPTIONS (ERRORLOGGER.LUAU)</span>
                </div>

                {roblox.recentErrors.length === 0 ? (
                  <div className="text-arcade-green text-[10px] py-2">
                    ✓ Zero active server crashes. Game loop nominal.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {roblox.recentErrors.map((err, i) => (
                      <div key={i} className="bg-red-950/40 border border-red-500/50 p-2 text-[10px]">
                        <div className="flex justify-between text-red-300 font-bold mb-1">
                          <span>{err.script}</span>
                          <span className="text-[9px] text-amber-300">{err.count}x • {err.time}</span>
                        </div>
                        <div className="text-gray-300 font-mono text-[9px] bg-black/60 p-1">
                          {err.message}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* WEB SYSADMIN VIEW */}
          {/* ==================================================== */}
          {workerId === 'web_admin' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-[#20253f] p-3 border-2 border-arcade-border">
                  <div className="text-[9px] text-gray-400 font-retro">MONITORED ENDPOINTS</div>
                  <div className="text-sm font-bold text-arcade-cyan">{webHealth.totalMonitored}</div>
                </div>
                <div className="bg-[#20253f] p-3 border-2 border-arcade-border">
                  <div className="text-[9px] text-gray-400 font-retro">AVERAGE LATENCY</div>
                  <div className={`text-sm font-bold ${webHealth.avgLatencyMs > 1000 ? 'text-arcade-red' : 'text-arcade-green'}`}>
                    {webHealth.avgLatencyMs} ms
                  </div>
                </div>
                <div className="bg-[#20253f] p-3 border-2 border-arcade-border">
                  <div className="text-[9px] text-gray-400 font-retro">OUTAGES</div>
                  <div className={`text-sm font-bold ${webHealth.downCount > 0 ? 'text-arcade-red' : 'text-arcade-green'}`}>
                    {webHealth.downCount}
                  </div>
                </div>
              </div>

              {/* Endpoints Table */}
              <div className="border-2 border-arcade-border bg-[#101222] p-3">
                <div className="text-xs text-arcade-green mb-2 flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5" />
                  <span>CONCURRENT HTTP STATUS & SSL EXPIRATION</span>
                </div>

                <div className="space-y-2">
                  {webHealth.endpoints.map((ep, i) => (
                    <div
                      key={i}
                      className={`p-2.5 border text-[10px] flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                        ep.status === 'HEALTHY'
                          ? 'bg-green-950/20 border-green-600/40 text-gray-200'
                          : ep.status === 'DEGRADED'
                            ? 'bg-amber-950/20 border-amber-600/40 text-amber-200'
                            : 'bg-red-950/40 border-red-600 text-red-200'
                      }`}
                    >
                      <div>
                        <div className="font-bold flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${
                            ep.status === 'HEALTHY' ? 'bg-green-500' : ep.status === 'DEGRADED' ? 'bg-amber-500' : 'bg-red-500'
                          }`} />
                          <span className="font-mono text-[9px]">{ep.url}</span>
                        </div>
                        {ep.error && <div className="text-[9px] text-red-300 mt-1">{ep.error}</div>}
                      </div>

                      <div className="flex items-center gap-3 text-[9px] font-mono">
                        <span className="bg-black/60 px-2 py-1 border border-white/10">
                          HTTP {ep.statusCode}
                        </span>
                        <span className="bg-black/60 px-2 py-1 border border-white/10">
                          {ep.responseTimeMs} ms
                        </span>
                        <span className="bg-black/60 px-2 py-1 border border-white/10 text-cyan-300">
                          SSL: {ep.sslDaysRemaining}d
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* SEO SPECIALIST VIEW */}
          {/* ==================================================== */}
          {workerId === 'seo_specialist' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-[#20253f] p-3 border-2 border-arcade-border">
                  <div className="text-[9px] text-gray-400 font-retro">WEEKLY IMPRESSIONS</div>
                  <div className="text-sm font-bold text-arcade-gold">{searchConsole.totalImpressions.toLocaleString()}</div>
                </div>
                <div className="bg-[#20253f] p-3 border-2 border-arcade-border">
                  <div className="text-[9px] text-gray-400 font-retro">TOTAL CLICKS</div>
                  <div className="text-sm font-bold text-arcade-green">{searchConsole.totalClicks.toLocaleString()}</div>
                </div>
                <div className="bg-[#20253f] p-3 border-2 border-arcade-border">
                  <div className="text-[9px] text-gray-400 font-retro">OVERALL CTR</div>
                  <div className="text-sm font-bold text-arcade-cyan">{searchConsole.overallCtr}%</div>
                </div>
              </div>

              {/* Growth Leaks Diagnostic Table */}
              <div className="border-2 border-arcade-border bg-[#101222] p-3">
                <div className="text-xs text-arcade-gold mb-2 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>HIGH IMPRESSION / LOW CTR OPPORTUNITIES (&gt;300 IMP, &lt;2.0% CTR)</span>
                </div>

                <div className="space-y-2">
                  {searchConsole.growthLeaks.map((leak, i) => (
                    <div key={i} className="bg-amber-950/30 border border-amber-500/50 p-2.5 text-[10px]">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-arcade-cyan">"{leak.query}"</span>
                        <span className="text-[9px] text-amber-300">
                          {leak.impressions.toLocaleString()} Imp • CTR: {leak.ctr.toFixed(1)}% (Rank #{leak.averagePosition})
                        </span>
                      </div>
                      <div className="text-[9px] text-gray-300 bg-black/60 p-1.5 border border-white/10 mt-1">
                        💡 <span className="text-amber-200">Recommended Action:</span> {leak.recommendedAction}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="mt-4 pt-3 border-t-2 border-arcade-border flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#2c3258] text-white border-2 border-black pixel-btn text-xs hover:bg-[#3b4374]"
          >
            DISMISS
          </button>
        </div>

      </div>
    </div>
  );
};
