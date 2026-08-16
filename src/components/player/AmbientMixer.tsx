'use client';

import React, { useState, useEffect } from 'react';
import { AmbientSettings } from '@/types';
import { audioEngine } from '@/lib/audioEngine';
import { Volume2, VolumeX, CloudRain, Car, Wind, Zap, Sliders } from 'lucide-react';

interface AmbientMixerProps {
  settings: AmbientSettings;
  onChange: (newSettings: AmbientSettings) => void;
  rainIntensity: number;
}

export default function AmbientMixer({
  settings,
  onChange,
  rainIntensity,
}: AmbientMixerProps) {
  const [thunderCooldown, setThunderCooldown] = useState(0);

  // 5-second countdown timer
  useEffect(() => {
    if (thunderCooldown <= 0) return;
    const timer = setInterval(() => {
      setThunderCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [thunderCooldown]);

  const handleUpdate = (partial: Partial<AmbientSettings>) => {
    const updated = { ...settings, ...partial };
    onChange(updated);
    if (audioEngine) {
      audioEngine.updateSettings(updated, rainIntensity);
    }
  };

  const toggleMute = () => {
    const isMuted = !settings.isMuted;
    handleUpdate({ isMuted });
  };

  const handleRollThunder = () => {
    if (thunderCooldown > 0) return;

    if (audioEngine) {
      audioEngine.init();
      audioEngine.triggerThunder();
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('monsoon-thunder'));
    }
    setThunderCooldown(5);
  };

  return (
    <div className="bg-[#120e0b]/90 border border-white/10 backdrop-blur-xl rounded-2xl p-4 sm:p-5 shadow-2xl text-white w-full max-w-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-amber-500" />
          <h3 className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
            Atmospheric Soundboard
          </h3>
        </div>
        <button
          onClick={toggleMute}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            settings.isMuted
              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
              : 'bg-white/5 hover:bg-white/10 text-amber-400'
          }`}
          title={settings.isMuted ? 'Unmute All' : 'Mute All'}
        >
          {settings.isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Sliders */}
      <div className="space-y-3.5">
        {/* 1. Rain Slider */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-white/80">
            <span className="flex items-center gap-1.5 font-medium">
              <CloudRain className="w-3.5 h-3.5 text-sky-400" /> Rain Cadence
            </span>
            <span className="font-mono text-[10px] text-white/50">
              {Math.round(settings.rainVolume * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={settings.rainVolume}
            onChange={(e) => handleUpdate({ rainVolume: parseFloat(e.target.value) })}
            className="w-full h-1.5 bg-white/10 rounded-lg accent-sky-400 cursor-pointer"
          />
        </div>

        {/* 2. Distant Traffic */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-white/80">
            <span className="flex items-center gap-1.5 font-medium">
              <Car className="w-3.5 h-3.5 text-amber-400" /> Distant City Traffic
            </span>
            <span className="font-mono text-[10px] text-white/50">
              {Math.round(settings.trafficVolume * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={settings.trafficVolume}
            onChange={(e) => handleUpdate({ trafficVolume: parseFloat(e.target.value) })}
            className="w-full h-1.5 bg-white/10 rounded-lg accent-amber-400 cursor-pointer"
          />
        </div>

        {/* 3. Room Tone & Fan */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-white/80">
            <span className="flex items-center gap-1.5 font-medium">
              <Wind className="w-3.5 h-3.5 text-emerald-400" /> Room / Fan Tone
            </span>
            <span className="font-mono text-[10px] text-white/50">
              {Math.round(settings.roomVolume * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={settings.roomVolume}
            onChange={(e) => handleUpdate({ roomVolume: parseFloat(e.target.value) })}
            className="w-full h-1.5 bg-white/10 rounded-lg accent-emerald-400 cursor-pointer"
          />
        </div>

        {/* 4. Trigger Thunder Button with 5-second Cooldown */}
        <div className="pt-2.5 border-t border-white/5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-white/80 font-medium flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Thunder & Lightning
            </span>
            <span className="text-[10px] text-white/40 font-mono">
              {thunderCooldown > 0 ? `Cooldown: ${thunderCooldown}s` : 'Click to trigger'}
            </span>
          </div>

          <button
            disabled={thunderCooldown > 0}
            onClick={handleRollThunder}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 ${
              thunderCooldown > 0
                ? 'bg-amber-500/10 text-amber-300/40 border border-amber-500/20 cursor-not-allowed'
                : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 active:scale-95 shadow-[0_0_12px_rgba(245,158,11,0.2)] cursor-pointer'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${thunderCooldown > 0 ? 'text-amber-400/40 animate-pulse' : 'text-amber-400 fill-current'}`} />
            <span>{thunderCooldown > 0 ? `Rolling (${thunderCooldown}s)` : 'Roll Thunder'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
