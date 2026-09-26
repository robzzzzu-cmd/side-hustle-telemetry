import React, { useRef, useEffect, useState } from 'react';
import type { TelemetryState, WorkerId } from '../types/telemetry.ts';
import { playBeep, playCoinSound, playAlarmSound, playVictoryFanfare } from '../utils/soundEffects.ts';

interface OfficeCanvasProps {
  telemetry: TelemetryState;
  onSelectWorker: (workerId: WorkerId) => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  type: 'smoke' | 'coin' | 'fire' | 'sparkle';
}

export const OfficeCanvas: React.FC<OfficeCanvasProps> = ({ telemetry, onSelectWorker }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoveredWorker, setHoveredWorker] = useState<WorkerId | null>(null);

  // Dynamic States from Telemetry
  const { roblox, webHealth, searchConsole } = telemetry;
  const isRobloxCrashing = roblox.errorCount > 0;
  const isRobloxBooming = !isRobloxCrashing && roblox.currentCcu > 50;
  const isWebDown = webHealth.downCount > 0;
  const hasGrowthLeak = searchConsole.growthLeaks.length > 0;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Enable pixel sharpness
    ctx.imageSmoothingEnabled = false;

    let animationFrameId: number;
    let ticks = 0;
    const particles: Particle[] = [];

    // Director Pacing Logic
    let directorX = 460;
    let directorY = 240;
    let directorDir = 1;
    const directorMinX = 380;
    const directorMaxX = 540;

    const render = () => {
      ticks++;
      const w = canvas.width;
      const h = canvas.height;

      // 1. Clear & Background
      ctx.fillStyle = '#0f111e';
      ctx.fillRect(0, 0, w, h);

      // 2. Draw Office Wall & Baseboards
      ctx.fillStyle = '#1c2038';
      ctx.fillRect(20, 20, w - 40, 140);
      // Wall panel stripes
      ctx.fillStyle = '#171a2e';
      for (let px = 20; px < w - 40; px += 40) {
        ctx.fillRect(px, 20, 2, 140);
      }
      // Baseboard trim
      ctx.fillStyle = '#2d3356';
      ctx.fillRect(20, 155, w - 40, 8);

      // 3. Draw Floor (Isometric / Tiled Pixel Planks)
      const tileSize = 24;
      for (let y = 163; y < h - 20; y += tileSize) {
        for (let x = 20; x < w - 20; x += tileSize) {
          const isOdd = ((x / tileSize) + (y / tileSize)) % 2 === 0;
          ctx.fillStyle = isOdd ? '#272b47' : '#22263f';
          ctx.fillRect(x, y, tileSize, tileSize);
          // Subtle tile grid line
          ctx.fillStyle = '#1b1d33';
          ctx.strokeRect(x, y, tileSize, tileSize);
        }
      }

      // 4. Wall Decorations & Postings
      // Poster 1: Motivational 8-bit sign
      ctx.fillStyle = '#34495e';
      ctx.fillRect(60, 45, 60, 40);
      ctx.fillStyle = '#f1c40f';
      ctx.font = '7px "Press Start 2P"';
      ctx.fillText('HUSTLE', 66, 68);

      // Poster 2: Roblox Studio Logo banner
      ctx.fillStyle = '#c0392b';
      ctx.fillRect(210, 45, 70, 40);
      ctx.fillStyle = '#ffffff';
      ctx.font = '6px "Press Start 2P"';
      ctx.fillText('RBX LIVE', 216, 68);

      // Whiteboard behind SEO Specialist (Desk 3)
      ctx.fillStyle = '#ecf0f1';
      ctx.fillRect(620, 35, 110, 75);
      ctx.fillStyle = '#7f8c8d';
      ctx.strokeRect(620, 35, 110, 75);
      // Graph on Whiteboard
      ctx.strokeStyle = '#27ae60';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(635, 90);
      ctx.lineTo(660, 70);
      ctx.lineTo(685, 80);
      ctx.lineTo(715, 50);
      ctx.stroke();
      // Arrowhead
      ctx.fillStyle = '#27ae60';
      ctx.fillRect(714, 48, 5, 5);

      // Water Cooler in corner
      ctx.fillStyle = '#bdc3c7';
      ctx.fillRect(765, 110, 24, 45);
      ctx.fillStyle = '#3498db';
      ctx.fillRect(768, 85, 18, 25); // Water bottle

      // ==========================================
      // DESK 1: ROBLOX GAME DEV (x: 80, y: 190)
      // ==========================================
      const desk1X = 70;
      const desk1Y = 190;
      const isHovered1 = hoveredWorker === 'roblox_dev';

      // Highlight on hover
      if (isHovered1) {
        ctx.strokeStyle = '#f1c40f';
        ctx.lineWidth = 2;
        ctx.strokeRect(desk1X - 8, desk1Y - 10, 126, 95);
      }

      // Wooden Desk
      ctx.fillStyle = '#795548';
      ctx.fillRect(desk1X, desk1Y + 30, 110, 35);
      ctx.fillStyle = '#5d4037';
      ctx.fillRect(desk1X, desk1Y + 65, 12, 20); // Leg L
      ctx.fillRect(desk1X + 98, desk1Y + 65, 12, 20); // Leg R

      // Chair
      ctx.fillStyle = '#2c3e50';
      ctx.fillRect(desk1X + 35, desk1Y + 45, 36, 30);

      // Worker 1 (Dev)
      // Body
      ctx.fillStyle = '#e67e22'; // Orange hoodie
      ctx.fillRect(desk1X + 42, desk1Y + 30, 24, 22);
      // Head
      ctx.fillStyle = '#f5cd79';
      ctx.fillRect(desk1X + 45, desk1Y + 16, 18, 16);
      // Hair / Headset
      ctx.fillStyle = '#2c3e50';
      ctx.fillRect(desk1X + 43, desk1Y + 14, 22, 6);
      ctx.fillStyle = '#e74c3c';
      ctx.fillRect(desk1X + 42, desk1Y + 20, 4, 8); // Headphone ear
      ctx.fillRect(desk1X + 62, desk1Y + 20, 4, 8); // Headphone ear

      // Animated Hands Typing
      const typeOffset = Math.sin(ticks * 0.4) > 0 ? 2 : 0;
      ctx.fillStyle = '#f5cd79';
      ctx.fillRect(desk1X + 38, desk1Y + 42 - typeOffset, 6, 6);
      ctx.fillRect(desk1X + 64, desk1Y + 42 + typeOffset, 6, 6);

      // Computer Monitor
      ctx.fillStyle = '#34495e';
      ctx.fillRect(desk1X + 35, desk1Y + 5, 40, 28);
      ctx.fillStyle = '#111';
      ctx.fillRect(desk1X + 38, desk1Y + 8, 34, 22);

      // Monitor Screen State
      if (isRobloxCrashing) {
        // Red Screen with Error Skull
        ctx.fillStyle = '#c0392b';
        ctx.fillRect(desk1X + 38, desk1Y + 8, 34, 22);
        ctx.fillStyle = '#ffffff';
        ctx.font = '8px "Press Start 2P"';
        ctx.fillText('ERR!', desk1X + 41, desk1Y + 22);

        // Spawn Smoke Particles
        if (ticks % 3 === 0) {
          particles.push({
            x: desk1X + 85 + (Math.random() * 8),
            y: desk1Y + 25,
            vx: (Math.random() - 0.5) * 0.6,
            vy: -0.8 - Math.random() * 0.8,
            size: 4 + Math.random() * 4,
            color: Math.random() > 0.5 ? '#7f8c8d' : '#34495e',
            alpha: 0.9,
            decay: 0.02,
            type: 'smoke'
          });
        }
      } else if (isRobloxBooming) {
        // Green Screen with Money graph
        ctx.fillStyle = '#27ae60';
        ctx.fillRect(desk1X + 38, desk1Y + 8, 34, 22);
        ctx.fillStyle = '#ffffff';
        ctx.font = '7px "Press Start 2P"';
        ctx.fillText('$$$', desk1X + 44, desk1Y + 22);

        // Spawn Bouncing Coins / Sparkles
        if (ticks % 5 === 0) {
          particles.push({
            x: desk1X + 50 + (Math.random() * 20),
            y: desk1Y + 10,
            vx: (Math.random() - 0.5) * 1.2,
            vy: -2 - Math.random() * 1.5,
            size: 5,
            color: '#f1c40f',
            alpha: 1.0,
            decay: 0.025,
            type: 'coin'
          });
        }
      } else {
        // Normal Working: Scrolling code lines
        ctx.fillStyle = '#1e272e';
        ctx.fillRect(desk1X + 38, desk1Y + 8, 34, 22);
        ctx.fillStyle = '#2ecc71';
        ctx.fillRect(desk1X + 41, desk1Y + 12 + ((ticks % 20) * 0.4), 26, 2);
        ctx.fillRect(desk1X + 41, desk1Y + 18, 18, 2);
        ctx.fillRect(desk1X + 41, desk1Y + 24, 22, 2);
      }

      // PC Tower
      ctx.fillStyle = '#2c3e50';
      ctx.fillRect(desk1X + 85, desk1Y + 22, 16, 28);
      ctx.fillStyle = isRobloxCrashing ? '#e74c3c' : '#2ecc71';
      ctx.fillRect(desk1X + 88, desk1Y + 26, 3, 3); // LED

      // Status Badge
      ctx.fillStyle = '#000';
      ctx.fillRect(desk1X + 15, desk1Y - 2, 85, 14);
      ctx.fillStyle = isRobloxCrashing ? '#e74c3c' : isRobloxBooming ? '#f1c40f' : '#2ecc71';
      ctx.font = '6px "Press Start 2P"';
      ctx.fillText(
        isRobloxCrashing ? '💥 CRASHING' : isRobloxBooming ? '💰 BOOMING' : '⚡ DEV ACTIVE',
        desk1X + 18,
        desk1Y + 8
      );

      // ==========================================
      // DESK 2: WEB SYSADMIN & SERVER (x: 230, y: 190)
      // ==========================================
      const desk2X = 230;
      const desk2Y = 190;
      const isHovered2 = hoveredWorker === 'web_admin';

      if (isHovered2) {
        ctx.strokeStyle = '#f1c40f';
        ctx.lineWidth = 2;
        ctx.strokeRect(desk2X - 8, desk2Y - 10, 136, 95);
      }

      // Desk
      ctx.fillStyle = '#34495e';
      ctx.fillRect(desk2X, desk2Y + 30, 90, 35);
      ctx.fillStyle = '#1c2833';
      ctx.fillRect(desk2X, desk2Y + 65, 10, 20);
      ctx.fillRect(desk2X + 80, desk2Y + 65, 10, 20);

      // Server Rack Unit on right
      const rackX = desk2X + 96;
      ctx.fillStyle = '#1e272e';
      ctx.fillRect(rackX, desk2Y - 5, 24, 85);
      ctx.fillStyle = '#2f3640';
      ctx.strokeRect(rackX, desk2Y - 5, 24, 85);

      // Server Rack LEDs (4 slots)
      for (let s = 0; s < 4; s++) {
        const ledY = desk2Y + 6 + (s * 18);
        ctx.fillStyle = '#111';
        ctx.fillRect(rackX + 3, ledY, 18, 12);

        if (isWebDown) {
          // Blinking Red Outage
          ctx.fillStyle = ticks % 12 < 6 ? '#e74c3c' : '#7f1d1d';
          ctx.fillRect(rackX + 6, ledY + 4, 4, 4);
          ctx.fillRect(rackX + 13, ledY + 4, 4, 4);
        } else {
          // Blinking Green/Blue Nominal
          ctx.fillStyle = (ticks + s * 5) % 16 < 8 ? '#2ecc71' : '#00ffff';
          ctx.fillRect(rackX + 6, ledY + 4, 4, 4);
          ctx.fillStyle = (ticks + s * 8) % 20 < 10 ? '#3498db' : '#27ae60';
          ctx.fillRect(rackX + 13, ledY + 4, 4, 4);
        }
      }

      // Siren Beacon on top of rack
      if (isWebDown) {
        // Red Siren
        ctx.fillStyle = ticks % 8 < 4 ? '#ff0000' : '#8b0000';
        ctx.fillRect(rackX + 7, desk2Y - 14, 10, 9);
        // Flashing light beam
        ctx.fillStyle = 'rgba(255, 0, 0, 0.25)';
        ctx.beginPath();
        ctx.arc(rackX + 12, desk2Y - 10, 45, 0, Math.PI * 2);
        ctx.fill();

        // Spawn Fire / Spark particles
        if (ticks % 3 === 0) {
          particles.push({
            x: rackX + 12 + (Math.random() * 8 - 4),
            y: desk2Y + 10,
            vx: (Math.random() - 0.5) * 0.8,
            vy: -1.2 - Math.random() * 0.8,
            size: 4 + Math.random() * 3,
            color: Math.random() > 0.4 ? '#e74c3c' : '#f39c12',
            alpha: 0.9,
            decay: 0.03,
            type: 'fire'
          });
        }
      }

      // Sysadmin Character
      ctx.fillStyle = '#2980b9'; // Blue shirt
      ctx.fillRect(desk2X + 32, desk2Y + 30, 24, 22);
      ctx.fillStyle = '#f5cd79'; // Head
      ctx.fillRect(desk2X + 35, desk2Y + 16, 18, 16);
      ctx.fillStyle = '#8e44ad'; // Glasses
      ctx.fillRect(desk2X + 37, desk2Y + 22, 14, 4);

      // Sweat drops if down
      if (isWebDown) {
        ctx.fillStyle = '#3498db';
        ctx.fillRect(desk2X + 54, desk2Y + 18, 3, 5);
      }

      // Dual Monitors
      ctx.fillStyle = '#2c3e50';
      ctx.fillRect(desk2X + 15, desk2Y + 8, 28, 22);
      ctx.fillRect(desk2X + 46, desk2Y + 8, 28, 22);
      ctx.fillStyle = isWebDown ? '#c0392b' : '#111';
      ctx.fillRect(desk2X + 17, desk2Y + 10, 24, 18);
      ctx.fillRect(desk2X + 48, desk2Y + 10, 24, 18);

      if (isWebDown) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '6px "Press Start 2P"';
        ctx.fillText('DOWN', desk2X + 20, desk2Y + 22);
        ctx.fillText('502', desk2X + 53, desk2Y + 22);
      } else {
        ctx.fillStyle = '#2ecc71';
        ctx.fillRect(desk2X + 19, desk2Y + 13, 20, 2);
        ctx.fillRect(desk2X + 50, desk2Y + 13, 20, 2);
      }

      // Status Badge
      ctx.fillStyle = '#000';
      ctx.fillRect(desk2X + 10, desk2Y - 2, 75, 14);
      ctx.fillStyle = isWebDown ? '#e74c3c' : '#2ecc71';
      ctx.font = '6px "Press Start 2P"';
      ctx.fillText(isWebDown ? '🚨 DOWN' : '🟢 SYS 100%', desk2X + 14, desk2Y + 8);

      // ==========================================
      // DESK 3: GROWTH & SEO SPECIALIST (x: 620, y: 190)
      // ==========================================
      const desk3X = 620;
      const desk3Y = 190;
      const isHovered3 = hoveredWorker === 'seo_specialist';

      if (isHovered3) {
        ctx.strokeStyle = '#f1c40f';
        ctx.lineWidth = 2;
        ctx.strokeRect(desk3X - 8, desk3Y - 10, 116, 95);
      }

      // Desk
      ctx.fillStyle = '#7f8c8d';
      ctx.fillRect(desk3X, desk3Y + 30, 95, 35);
      ctx.fillStyle = '#34495e';
      ctx.fillRect(desk3X, desk3Y + 65, 10, 20);
      ctx.fillRect(desk3X + 85, desk3Y + 65, 10, 20);

      // Specialist Character (Standing next to whiteboard)
      ctx.fillStyle = '#27ae60'; // Green polo
      ctx.fillRect(desk3X + 38, desk3Y + 22, 22, 24);
      ctx.fillStyle = '#f5cd79'; // Head
      ctx.fillRect(desk3X + 40, desk3Y + 8, 18, 15);
      ctx.fillStyle = '#d35400'; // Red hair
      ctx.fillRect(desk3X + 39, desk3Y + 6, 20, 6);

      // Animated Arm drawing on whiteboard
      const armUp = Math.sin(ticks * 0.1) > 0;
      ctx.fillStyle = '#27ae60';
      ctx.fillRect(desk3X + 58, armUp ? desk3Y + 12 : desk3Y + 22, 10, 5);
      ctx.fillStyle = '#e74c3c'; // Marker in hand
      ctx.fillRect(desk3X + 68, armUp ? desk3Y + 10 : desk3Y + 20, 4, 4);

      // Monitor on Desk
      ctx.fillStyle = '#2c3e50';
      ctx.fillRect(desk3X + 10, desk3Y + 12, 26, 18);
      ctx.fillStyle = '#00ffff';
      ctx.fillRect(desk3X + 12, desk3Y + 14, 22, 14);

      // Status Badge
      ctx.fillStyle = '#000';
      ctx.fillRect(desk3X + 10, desk3Y - 2, 75, 14);
      ctx.fillStyle = hasGrowthLeak ? '#e67e22' : '#2ecc71';
      ctx.font = '6px "Press Start 2P"';
      ctx.fillText(hasGrowthLeak ? '⚠️ SEO LEAK' : '📈 RANKING', desk3X + 13, desk3Y + 8);

      // Floating Speech Bubble for Search Leak
      if (hasGrowthLeak) {
        const bubbleX = desk3X - 25;
        const bubbleY = desk3Y - 55;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(bubbleX, bubbleY, 140, 28);
        ctx.fillStyle = '#000000';
        ctx.strokeRect(bubbleX, bubbleY, 140, 28);

        // Pointer triangle
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(bubbleX + 65, bubbleY + 28);
        ctx.lineTo(bubbleX + 72, bubbleY + 36);
        ctx.lineTo(bubbleX + 79, bubbleY + 28);
        ctx.fill();

        ctx.fillStyle = '#c0392b';
        ctx.font = '6px "Press Start 2P"';
        const topLeak = searchConsole.growthLeaks[0];
        const queryLabel = topLeak ? topLeak.query.substring(0, 14) : 'codes';
        ctx.fillText(`🔍 "${queryLabel}..."`, bubbleX + 6, bubbleY + 11);
        ctx.fillStyle = '#2c3e50';
        ctx.fillText(`Imp: ${topLeak?.impressions.toLocaleString() || '4k'} | CTR: ${topLeak?.ctr.toFixed(1) || '1.1'}%`, bubbleX + 6, bubbleY + 22);
      }

      // ==========================================
      // DESK 4 / PACING: THE AI DIRECTOR (x: directorX, y: 220)
      // ==========================================
      directorX += directorDir * 0.45;
      if (directorX > directorMaxX) directorDir = -1;
      if (directorX < directorMinX) directorDir = 1;

      const isHovered4 = hoveredWorker === 'ai_director';

      if (isHovered4) {
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(directorX - 16, directorY - 25, 48, 65);
      }

      // Director Body (Sharp Midnight Suit)
      ctx.fillStyle = '#1a1d36';
      ctx.fillRect(directorX - 8, directorY + 5, 20, 24);
      // Red Tie
      ctx.fillStyle = '#e74c3c';
      ctx.fillRect(directorX + 1, directorY + 8, 3, 14);

      // Walking legs animation
      const legStep = Math.sin(ticks * 0.3) * 4;
      ctx.fillStyle = '#111';
      ctx.fillRect(directorX - 6, directorY + 29, 6, 12 + legStep);
      ctx.fillRect(directorX + 4, directorY + 29, 6, 12 - legStep);

      // Head
      ctx.fillStyle = '#f5cd79';
      ctx.fillRect(directorX - 6, directorY - 10, 16, 16);
      // Dark slick hair
      ctx.fillStyle = '#000';
      ctx.fillRect(directorX - 7, directorY - 14, 18, 6);

      // Glowing Cyan Cyber Visor / Hologram Shades
      ctx.fillStyle = '#00ffff';
      ctx.fillRect(directorX - 4, directorY - 6, 14, 4);

      // Floating Holographic Diamond / AI Prompt Above Head
      const floatY = Math.sin(ticks * 0.1) * 3;
      ctx.fillStyle = '#00ffff';
      ctx.beginPath();
      ctx.moveTo(directorX + 2, directorY - 26 + floatY);
      ctx.lineTo(directorX + 9, directorY - 19 + floatY);
      ctx.lineTo(directorX + 2, directorY - 12 + floatY);
      ctx.lineTo(directorX - 5, directorY - 19 + floatY);
      ctx.fill();

      // Director Speech / Hover Prompt
      ctx.fillStyle = '#000';
      ctx.fillRect(directorX - 42, directorY - 42, 92, 13);
      ctx.fillStyle = '#00ffff';
      ctx.font = '6px "Press Start 2P"';
      ctx.fillText('💡 AI DIRECTIVE', directorX - 38, directorY - 33);

      // ==========================================
      // 5. UPDATE & DRAW PARTICLES
      // ==========================================
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;

        if (p.type === 'coin') {
          // 8-bit coin with gravity
          p.vy += 0.08;
          ctx.fillRect(p.x, p.y, p.size, p.size);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(p.x + 1, p.y + 1, 1, 1);
        } else {
          ctx.fillRect(p.x, p.y, p.size, p.size);
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [telemetry, hoveredWorker, isRobloxCrashing, isRobloxBooming, isWebDown, hasGrowthLeak]);

  // Mouse Movement to detect Hover Target
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    // Desk 1: Roblox Dev (70, 190, w: 120, h: 90)
    if (mouseX >= 60 && mouseX <= 190 && mouseY >= 180 && mouseY <= 280) {
      setHoveredWorker('roblox_dev');
      return;
    }

    // Desk 2: Web Sysadmin (230, 190, w: 130, h: 90)
    if (mouseX >= 220 && mouseX <= 360 && mouseY >= 180 && mouseY <= 280) {
      setHoveredWorker('web_admin');
      return;
    }

    // Desk 3: SEO Specialist (620, 190, w: 120, h: 90)
    if (mouseX >= 610 && mouseX <= 740 && mouseY >= 170 && mouseY <= 280) {
      setHoveredWorker('seo_specialist');
      return;
    }

    // Desk 4: AI Director (paces between 360 and 560, y: 190 to 280)
    if (mouseX >= 360 && mouseX <= 560 && mouseY >= 180 && mouseY <= 280) {
      setHoveredWorker('ai_director');
      return;
    }

    setHoveredWorker(null);
  };

  // Click on character/desk to inspect
  const handleClick = () => {
    if (!hoveredWorker) return;

    if (hoveredWorker === 'ai_director') {
      playVictoryFanfare();
    } else if (hoveredWorker === 'roblox_dev' && isRobloxBooming) {
      playCoinSound();
    } else if ((hoveredWorker === 'web_admin' && isWebDown) || (hoveredWorker === 'roblox_dev' && isRobloxCrashing)) {
      playAlarmSound();
    } else {
      playBeep();
    }

    onSelectWorker(hoveredWorker);
  };

  return (
    <div className="relative w-full flex flex-col items-center justify-center p-2">
      <div className="relative border-4 border-black shadow-pixel-lg bg-[#0f111e] overflow-hidden max-w-full">
        <canvas
          ref={canvasRef}
          width={800}
          height={320}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredWorker(null)}
          onClick={handleClick}
          className="w-full max-w-[800px] h-auto cursor-pointer block"
        />

        {/* Hover Action Badge Indicator */}
        {hoveredWorker && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/90 text-arcade-gold font-pixel text-[10px] px-3 py-1.5 border-2 border-white pointer-events-none shadow-pixel-sm animate-pulse">
            PRESS TO INSPECT [
            {hoveredWorker === 'roblox_dev' && 'ROBLOX DEV'}
            {hoveredWorker === 'web_admin' && 'SYSADMIN & SERVERS'}
            {hoveredWorker === 'seo_specialist' && 'GROWTH / SEO SPECIALIST'}
            {hoveredWorker === 'ai_director' && 'AI STRATEGIC DIRECTOR'}
            ]
          </div>
        )}
      </div>
    </div>
  );
};
