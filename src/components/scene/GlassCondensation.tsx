'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

interface GlassCondensationProps {
  intensity?: number;
}

export default function GlassCondensation({ intensity = 0.6 }: GlassCondensationProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isWiping, setIsWiping] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const lastWipedTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const drawInitialFog = () => {
      // Soft translucent monsoon condensation layer
      ctx.fillStyle = `rgba(210, 226, 242, ${0.14 + intensity * 0.16})`;
      ctx.fillRect(0, 0, width, height);

      // Fine textured mist droplets
      ctx.fillStyle = 'rgba(255, 255, 255, 0.045)';
      for (let i = 0; i < 450; i++) {
        ctx.beginPath();
        ctx.arc(
          Math.random() * width,
          Math.random() * height,
          Math.random() * 7 + 1.5,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }

      // Micro condensation specks
      ctx.fillStyle = 'rgba(230, 240, 255, 0.08)';
      for (let i = 0; i < 180; i++) {
        ctx.beginPath();
        ctx.arc(
          Math.random() * width,
          Math.random() * height,
          Math.random() * 2 + 0.8,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    };

    drawInitialFog();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      drawInitialFog();
    };
    window.addEventListener('resize', handleResize);

    // Natural gradual refogging (slow, realistic moisture settling)
    // When mist builds up over time and user has been idle for > 30s, subtle text softly returns
    const interval = setInterval(() => {
      ctx.fillStyle = 'rgba(215, 230, 245, 0.008)';
      ctx.fillRect(0, 0, width, height);

      const idleDuration = Date.now() - lastWipedTimeRef.current;
      if (idleDuration > 30000) {
        setShowPrompt(true);
      }
    }, 4000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, [intensity]);

  // Single spot clearing with larger radius and feathered edge
  const clearSpot = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';

    // Generous wiping radius for effortless clearing (~75px base radius)
    const radius = 75 + (Math.random() * 6 - 3);

    const gradient = ctx.createRadialGradient(
      x + (Math.random() * 2 - 1),
      y + (Math.random() * 2 - 1),
      radius * 0.2,
      x,
      y,
      radius
    );
    gradient.addColorStop(0, 'rgba(0, 0, 0, 1.0)');
    gradient.addColorStop(0.55, 'rgba(0, 0, 0, 0.9)');
    gradient.addColorStop(0.85, 'rgba(0, 0, 0, 0.45)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    // Occasional tiny water beads along the swipe perimeter
    if (Math.random() < 0.2) {
      const angle = Math.random() * Math.PI * 2;
      const beadDist = radius * 0.92;
      const bx = x + Math.cos(angle) * beadDist;
      const by = y + Math.sin(angle) * beadDist;
      ctx.beginPath();
      ctx.arc(bx, by, Math.random() * 1.8 + 0.6, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();

    lastWipedTimeRef.current = Date.now();
    setShowPrompt(false);
  }, []);

  // Interpolated line wiping so fast swipes are completely continuous
  const wipeStroke = useCallback((x: number, y: number) => {
    if (!lastPointRef.current) {
      clearSpot(x, y);
      lastPointRef.current = { x, y };
      return;
    }

    const lastX = lastPointRef.current.x;
    const lastY = lastPointRef.current.y;
    const dist = Math.hypot(x - lastX, y - lastY);
    const steps = Math.max(1, Math.ceil(dist / 14));

    for (let i = 1; i <= steps; i++) {
      const interpX = lastX + (x - lastX) * (i / steps);
      const interpY = lastY + (y - lastY) * (i / steps);
      clearSpot(interpX, interpY);
    }

    lastPointRef.current = { x, y };
  }, [clearSpot]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsWiping(true);
    lastPointRef.current = { x: e.clientX, y: e.clientY };
    clearSpot(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isWiping) {
      wipeStroke(e.clientX, e.clientY);
    }
  };

  const handlePointerUp = () => {
    setIsWiping(false);
    lastPointRef.current = null;
  };

  // Custom Glass Wiper Cursor SVG
  const glassWiperCursor = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='36' height='36' viewBox='0 0 36 36'><circle cx='18' cy='18' r='14' fill='rgba(255,255,255,0.1)' stroke='white' stroke-width='1.8' stroke-opacity='0.85' stroke-dasharray='4 3'/><circle cx='18' cy='18' r='3.5' fill='white' fill-opacity='0.95'/></svg>\") 18 18, grab";

  return (
    <div className="absolute inset-0 z-15 pointer-events-auto touch-none">
      {/* Subtle faint glass reflection sheen */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/[0.015] to-amber-500/[0.02] mix-blend-screen" />

      {/* Condensation Canvas with Custom Tactile Glass Wiper Cursor */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{ cursor: glassWiperCursor }}
        className="w-full h-full opacity-90 transition-opacity duration-1000 touch-none active:cursor-grabbing select-none"
      />

      {/* Subtle, ambient text reminder that gently fades in/out with mist buildup */}
      <div
        className={`absolute top-[34%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none text-center transition-all duration-1000 ${
          showPrompt ? 'opacity-55 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
      >
        <p className="text-[10px] sm:text-[11px] font-mono tracking-widest text-monsoon-cream uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
          wipe glass to clear mist
        </p>
      </div>
    </div>
  );
}
