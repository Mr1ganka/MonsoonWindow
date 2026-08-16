'use client';

import React, { useEffect, useRef } from 'react';
import { audioEngine } from '@/lib/audioEngine';

interface RainCanvasProps {
  rainIntensity: number; // 0 to 1
  windSpeed: number; // -1 to 1
  lightningChance: number; // 0 to 1
}

interface Drop {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
  layer: number; // 0 = far, 1 = mid, 2 = near
}

interface GlassDroplet {
  x: number;
  y: number;
  radius: number;
  speed: number;
  trail: { x: number; y: number; r: number }[];
  life: number;
  maxLife: number;
}

export default function RainCanvas({
  rainIntensity,
  windSpeed,
  lightningChance,
}: RainCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isLightningRef = useRef(false);
  const lightningAlphaRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const handleThunderEvent = () => {
      isLightningRef.current = true;
      lightningAlphaRef.current = 0.95;
    };
    window.addEventListener('monsoon-thunder', handleThunderEvent);

    // Initialize rain drops
    const baseCount = Math.floor(180 + rainIntensity * 350);
    const drops: Drop[] = [];
    for (let i = 0; i < baseCount; i++) {
      drops.push({
        x: Math.random() * (width + 300) - 150,
        y: Math.random() * height,
        length: 15 + Math.random() * 25,
        speed: 12 + Math.random() * 16,
        opacity: 0.2 + Math.random() * 0.5,
        layer: Math.floor(Math.random() * 3),
      });
    }

    // Glass droplets
    const glassDroplets: GlassDroplet[] = [];
    const maxGlassDroplets = Math.floor(15 + rainIntensity * 30);

    const addGlassDroplet = () => {
      if (glassDroplets.length < maxGlassDroplets) {
        glassDroplets.push({
          x: Math.random() * width,
          y: Math.random() * (height * 0.6),
          radius: 1.5 + Math.random() * 2.5,
          speed: 0.2 + Math.random() * 0.8,
          trail: [],
          life: 0,
          maxLife: 200 + Math.random() * 400,
        });
      }
    };

    for (let i = 0; i < maxGlassDroplets; i++) {
      addGlassDroplet();
    }

    let lastLightningTime = Date.now();

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Handle Lightning
      const now = Date.now();
      if (
        !isLightningRef.current &&
        lightningChance > 0.005 &&
        now - lastLightningTime > 12000 &&
        Math.random() < lightningChance * 0.05
      ) {
        isLightningRef.current = true;
        lightningAlphaRef.current = 0.85;
        lastLightningTime = now;
        if (audioEngine) {
          setTimeout(() => {
            audioEngine?.triggerThunder();
          }, 350);
        }
      }

      if (isLightningRef.current) {
        lightningAlphaRef.current *= 0.88;
        ctx.fillStyle = `rgba(230, 240, 255, ${lightningAlphaRef.current})`;
        ctx.fillRect(0, 0, width, height);

        if (lightningAlphaRef.current < 0.01) {
          isLightningRef.current = false;
          lightningAlphaRef.current = 0;
        }
      }

      // Draw Rain Streaks
      const currentWind = windSpeed * 7;
      ctx.lineWidth = 1.2;

      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];
        ctx.strokeStyle = `rgba(200, 225, 255, ${d.opacity * (0.3 + rainIntensity * 0.7)})`;

        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + currentWind, d.y + d.length);
        ctx.stroke();

        d.y += d.speed * (0.8 + rainIntensity * 0.5);
        d.x += currentWind;

        if (d.y > height) {
          d.y = -d.length;
          d.x = Math.random() * (width + 300) - 150;
        }
      }

      // Draw Glass Droplets and Rivulets
      if (Math.random() < 0.08 * rainIntensity) {
        addGlassDroplet();
      }

      for (let i = glassDroplets.length - 1; i >= 0; i--) {
        const gd = glassDroplets[i];
        gd.life++;

        // Draw trail
        if (gd.trail.length > 0) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
          ctx.lineWidth = gd.radius * 0.8;
          ctx.beginPath();
          ctx.moveTo(gd.trail[0].x, gd.trail[0].y);
          for (let t = 1; t < gd.trail.length; t++) {
            ctx.lineTo(gd.trail[t].x, gd.trail[t].y);
          }
          ctx.stroke();
        }

        // Draw droplet
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.arc(gd.x, gd.y, gd.radius, 0, Math.PI * 2);
        ctx.fill();

        // Droplet specular highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.beginPath();
        ctx.arc(gd.x - gd.radius * 0.3, gd.y - gd.radius * 0.3, gd.radius * 0.4, 0, Math.PI * 2);
        ctx.fill();

        // Physics movement
        if (Math.random() < 0.35) {
          gd.trail.push({ x: gd.x, y: gd.y, r: gd.radius });
          if (gd.trail.length > 15) gd.trail.shift();
          gd.y += gd.speed * 2;
          gd.x += (Math.random() - 0.5) * 0.8;
        }

        if (gd.y > height || gd.life > gd.maxLife) {
          glassDroplets.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('monsoon-thunder', handleThunderEvent);
    };
  }, [rainIntensity, windSpeed, lightningChance]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10 w-full h-full"
    />
  );
}
