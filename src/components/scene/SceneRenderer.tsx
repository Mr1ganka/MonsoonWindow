'use client';

import React, { useState, useEffect } from 'react';
import { TimePeriod } from '@/types';
import { TIME_PERIODS, getSceneBgImage } from '@/data/scenes';
import { getAssetPath } from '@/lib/assetPath';
import RainCanvas from './RainCanvas';
import GlassCondensation from './GlassCondensation';

interface SceneRendererProps {
  timePeriod?: TimePeriod;
  activeBgImage?: string;
  variantIndex?: number;
}

export default function SceneRenderer({ timePeriod, activeBgImage, variantIndex }: SceneRendererProps) {
  const period = timePeriod || TIME_PERIODS['morning'] || Object.values(TIME_PERIODS)[0];
  const targetImage = activeBgImage || getSceneBgImage(period, variantIndex) || '/scenes/generic/morning.webp';

  const [currentImage, setCurrentImage] = useState<string>(targetImage);

  // Synchronize target image when period or activeBgImage changes
  useEffect(() => {
    setCurrentImage(targetImage);

    // Image load preflight & fallback verification
    const img = new Image();
    img.src = getAssetPath(targetImage);
    img.onerror = () => {
      // Graceful fallback to generic scene if a specific city image doesn't exist yet
      const fallbackUrl = `/scenes/generic/${period?.id === 'heavy-rain' ? 'afternoon' : period?.id || 'morning'}.webp`;
      setCurrentImage(fallbackUrl);
    };
  }, [targetImage, period?.id]);

  const skyGradient = period?.skyGradient || 'linear-gradient(to bottom, #3a506b 0%, #5c6b73 45%, #9db4c0 80%, #c2dfe3 100%)';
  const rainIntensity = typeof period?.rainIntensity === 'number' ? period.rainIntensity : 0.45;
  const windSpeed = typeof period?.windSpeed === 'number' ? period.windSpeed : 0.3;
  const lightningChance = typeof period?.lightningChance === 'number' ? period.lightningChance : 0.02;
  const roomLightLevel = typeof period?.roomLightLevel === 'number' ? period.roomLightLevel : 0.5;

  return (
    <div className="absolute inset-0 overflow-hidden select-none">
      {/* 1. Dynamic Exterior Image Scene with Smooth Transition */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out scale-105"
        style={{
          backgroundImage: `url(${getAssetPath(currentImage)})`,
          filter: `brightness(${roomLightLevel < 0.3 ? 0.75 : 0.95}) contrast(1.05) saturate(0.95)`,
        }}
      />

      {/* 2. Color Gradient Tint for Time Period Mood */}
      <div
        className="absolute inset-0 transition-all duration-1000 pointer-events-none mix-blend-color"
        style={{
          background: skyGradient,
          opacity: 0.25,
        }}
      />

      {/* 3. Deep Vignette & Rain Sky Shading */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/60 pointer-events-none" />

      {/* 4. Realistic Procedural Rain Canvas */}
      <RainCanvas
        rainIntensity={rainIntensity}
        windSpeed={windSpeed}
        lightningChance={lightningChance}
      />

      {/* 5. Interactive Fog / Condensation Layer */}
      <GlassCondensation intensity={rainIntensity} />

      {/* 6. Ambient Room Tone & Lighting Overlay */}
      <div
        className="absolute inset-0 pointer-events-none transition-colors duration-1000 z-16 mix-blend-multiply"
        style={{
          backgroundColor:
            period?.id === 'deep-night'
              ? 'rgba(5, 8, 20, 0.4)'
              : period?.id === 'night'
              ? 'rgba(8, 14, 30, 0.3)'
              : period?.id === 'golden-hour'
              ? 'rgba(180, 100, 30, 0.15)'
              : period?.id === 'heavy-rain'
              ? 'rgba(20, 30, 45, 0.25)'
              : 'transparent',
        }}
      />
    </div>
  );
}
