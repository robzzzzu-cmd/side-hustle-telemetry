import React, { useState } from 'react';
import { X, Save, Plus, Trash2, Globe, Gamepad2, DollarSign, Check } from 'lucide-react';
import type { UserTargetsConfig } from '../../utils/liveTelemetry.ts';

interface SettingsModalProps {
  isOpen: boolean;
  config: UserTargetsConfig;
  onSave: (config: UserTargetsConfig) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, config, onSave, onClose }) => {
  if (!isOpen) return null;

  const [universeId, setUniverseId] = useState(config.robloxUniverseId);
  const [revenue, setRevenue] = useState(config.monthlyRevenueUsd.toString());
  const [urls, setUrls] = useState<string[]>(config.monitoredUrls.length > 0 ? [...config.monitoredUrls] : ['']);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddUrl = () => {
    setUrls([...urls, '']);
  };

  const handleRemoveUrl = (index: number) => {
    setUrls(urls.filter((_, i) => i !== index));
  };

  const handleUrlChange = (index: number, val: string) => {
    const updated = [...urls];
    updated[index] = val;
    setUrls(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrls = urls.map((u) => u.trim()).filter((u) => u.length > 0);

    onSave({
      robloxUniverseId: universeId.trim(),
      monitoredUrls: cleanUrls,
      monthlyRevenueUsd: Number.parseFloat(revenue) || 0,
      autoRefreshIntervalSeconds: config.autoRefreshIntervalSeconds || 60,
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-[#141627] border-4 border-arcade-gold shadow-pixel-lg text-white font-pixel p-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b-4 border-arcade-border pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-arcade-gold text-sm sm:text-base font-bold">⚙️ CONFIGURE REAL TARGETS</span>
          </div>

          <button
            onClick={onClose}
            className="p-1 bg-arcade-red text-white border-2 border-black pixel-btn hover:bg-red-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-[11px] max-h-[65vh] overflow-y-auto pr-2">
          <p className="text-[10px] text-gray-300 font-retro leading-relaxed">
            Enter your real Roblox Universe ID and Web URLs. The dashboard will query them live directly from your browser and update the entire office!
          </p>

          {/* Roblox Universe ID */}
          <div className="bg-[#1b1e36] p-3 border-2 border-arcade-border space-y-2">
            <label className="text-arcade-gold text-xs flex items-center gap-2 font-bold">
              <Gamepad2 className="w-4 h-4" />
              <span>ROBLOX UNIVERSE ID</span>
            </label>
            <p className="text-[9px] text-gray-400 font-retro">
              Found in your Creator Dashboard URL: create.roblox.com/dashboard/creations/experiences/<strong>[UNIVERSE_ID]</strong>
            </p>
            <input
              type="text"
              placeholder="e.g. 5812948291"
              value={universeId}
              onChange={(e) => setUniverseId(e.target.value)}
              className="w-full bg-black/70 border-2 border-white/20 p-2 text-arcade-cyan font-mono text-xs focus:border-arcade-gold focus:outline-none"
            />
          </div>

          {/* Monitored Web Endpoints */}
          <div className="bg-[#1b1e36] p-3 border-2 border-arcade-border space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-arcade-green text-xs flex items-center gap-2 font-bold">
                <Globe className="w-4 h-4" />
                <span>MONITORED WEB URLS</span>
              </label>

              <button
                type="button"
                onClick={handleAddUrl}
                className="px-2 py-1 bg-arcade-green text-black border-2 border-black pixel-btn text-[9px] flex items-center gap-1 font-bold"
              >
                <Plus className="w-3 h-3" />
                <span>ADD URL</span>
              </button>
            </div>

            <p className="text-[9px] text-gray-400 font-retro">
              Web apps, APIs, landing pages, or portals to check for uptime and response latency.
            </p>

            <div className="space-y-2 pt-1">
              {urls.map((url, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="url"
                    placeholder="https://my-real-website.com"
                    value={url}
                    onChange={(e) => handleUrlChange(i, e.target.value)}
                    className="flex-1 bg-black/70 border-2 border-white/20 p-2 text-arcade-green font-mono text-xs focus:border-arcade-green focus:outline-none"
                  />
                  {urls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveUrl(i)}
                      className="p-2 bg-arcade-red text-white border-2 border-black pixel-btn"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Hustle Revenue Target */}
          <div className="bg-[#1b1e36] p-3 border-2 border-arcade-border space-y-2">
            <label className="text-arcade-gold text-xs flex items-center gap-2 font-bold">
              <DollarSign className="w-4 h-4" />
              <span>MONTHLY HUSTLE REVENUE ($ USD)</span>
            </label>
            <input
              type="number"
              step="any"
              placeholder="e.g. 1250.00"
              value={revenue}
              onChange={(e) => setRevenue(e.target.value)}
              className="w-full bg-black/70 border-2 border-white/20 p-2 text-arcade-gold font-mono text-xs focus:border-arcade-gold focus:outline-none"
            />
          </div>

          {/* Save & Apply */}
          <div className="flex items-center justify-between pt-3 border-t-2 border-arcade-border">
            <span className="text-[9px] text-gray-400 font-retro">
              Saved locally to your browser storage.
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 bg-[#2c3258] text-white border-2 border-black pixel-btn text-xs"
              >
                CANCEL
              </button>

              <button
                type="submit"
                className={`px-4 py-1.5 border-2 border-black pixel-btn text-xs font-bold flex items-center gap-1.5 ${
                  savedSuccess ? 'bg-emerald-500 text-black' : 'bg-arcade-gold text-black hover:bg-yellow-400'
                }`}
              >
                {savedSuccess ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                <span>{savedSuccess ? 'SAVED!' : 'SAVE & APPLY REAL DATA'}</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
