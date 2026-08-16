'use client';

import React from 'react';

interface EqualizerProps {
  isPlaying: boolean;
  barCount?: number;
  color?: string;
}

export default function Equalizer({
  isPlaying,
  barCount = 6,
  color = '#e0a13a',
}: EqualizerProps) {
  return (
    <div className="flex items-end gap-0.5 h-6 flex-shrink-0">
      {[...Array(barCount)].map((_, i) => (
        <div
          key={i}
          className="w-1 rounded-t transition-all duration-200"
          style={{
            backgroundColor: color,
            height: isPlaying ? `${Math.floor(25 + Math.sin(i * 1.5) * 30 + (i % 3) * 20)}%` : '15%',
            animation: isPlaying
              ? `equalizerBounce ${0.6 + (i % 4) * 0.15}s ease-in-out infinite alternate ${i * 0.1}s`
              : 'none',
          }}
        />
      ))}

      <style jsx>{`
        @keyframes equalizerBounce {
          0% {
            height: 15%;
          }
          50% {
            height: 90%;
          }
          100% {
            height: 35%;
          }
        }
      `}</style>
    </div>
  );
}
