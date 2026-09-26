import React from 'react';

interface RetroScanlinesProps {
  enabled: boolean;
}

export const RetroScanlines: React.FC<RetroScanlinesProps> = ({ enabled }) => {
  if (!enabled) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Scanline bars */}
      <div className="absolute inset-0 crt-overlay" />
      {/* Subtle CRT curve & vignette */}
      <div className="absolute inset-0 crt-vignette" />
    </div>
  );
};
