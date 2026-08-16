'use client';

import React from 'react';
import Curtains from './Curtains';
import { TimePeriod, Song } from '@/types';
import { Book, Radio } from 'lucide-react';

interface RoomProps {
  timePeriod?: TimePeriod;
  currentSong?: Song;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onOpenDrawer: () => void;
  onOpenDiary: () => void;
}

export default function Room({
  timePeriod,
  currentSong,
  isPlaying,
  onTogglePlay,
  onOpenDrawer,
  onOpenDiary,
}: RoomProps) {
  const songTitle = currentSong?.title || 'Barsaat';

  return (
    <div className="absolute inset-0 pointer-events-none select-none">
      {/* 1. Hanging swaying linen curtains with brass rod & finials on the sides */}
      <Curtains />

      {/* 2. Clean, unobstructed outer window frame casing with subtle inner shadow */}
      <div className="absolute inset-0 border-[8px] sm:border-[12px] border-[#1a0f08] pointer-events-none shadow-[inset_0_0_30px_rgba(0,0,0,0.85)] z-22" />

      {/* 3. Reduced Thinner Wooden Window Sill / Desk Edge (~10-12% Viewport Height) */}
      <div className="absolute inset-x-0 bottom-0 h-20 sm:h-24 bg-gradient-to-t from-[#0c0805] via-[#170e09] to-[#26160e] border-t-2 border-[#3d2314] shadow-[0_-10px_30px_rgba(0,0,0,0.95)] pointer-events-auto z-35 flex items-center justify-between px-3 sm:px-10">
        {/* Subtle Specular Highlight Lip on Sill Edge */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/25 to-transparent pointer-events-none" />

        {/* Left Side: Monsoon Diary Card on Desk */}
        <div className="flex items-center gap-3 relative z-45 pointer-events-auto">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onOpenDiary();
            }}
            className="group cursor-pointer p-2 sm:px-3 sm:py-2 bg-[#2a170d] hover:bg-[#3d2214] border border-[#4d2c18] hover:border-amber-500/70 rounded-xl shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95 text-left pointer-events-auto"
            title="Read Monsoon Diary (मानसून डायरी)"
          >
            <div className="flex items-center gap-2 text-monsoon-cream/90 text-xs font-mono">
              <Book className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform flex-shrink-0" />
              <span className="font-medium">Monsoon Diary</span>
            </div>
            <p className="text-[8px] text-white/40 hidden sm:block font-devanagari mt-0.5">
              मानसून डायरी • Click to read
            </p>
          </button>
        </div>

        {/* Right Side: Monsoon FM Station Status Card */}
        <div className="relative z-45 pointer-events-auto">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onTogglePlay();
            }}
            className="group cursor-pointer flex items-center gap-2.5 bg-[#170e09] hover:bg-[#26170f] border border-[#3d2314] hover:border-amber-500/50 p-2 sm:px-3 sm:py-2 rounded-xl shadow-xl transition-all duration-200 hover:-translate-y-0.5 active:scale-95 text-left pointer-events-auto"
            title="Click to toggle radio playback"
          >
            <div className="w-7 h-7 bg-black/60 rounded-lg border border-white/5 flex items-center justify-center relative overflow-hidden flex-shrink-0">
              <Radio className={`w-3.5 h-3.5 ${isPlaying ? 'text-amber-400 animate-pulse' : 'text-white/40'}`} />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full inline-block ${isPlaying ? 'bg-amber-400 animate-ping' : 'bg-white/20'}`} />
                <span className="text-[9px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                  MONSOON FM
                </span>
              </div>
              <p className="text-[11px] font-bold text-white truncate max-w-[110px] sm:max-w-[150px] leading-tight">
                {songTitle}
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
