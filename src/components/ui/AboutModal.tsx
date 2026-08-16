'use client';

import React from 'react';
import { X, CloudRain, Radio, BookOpen } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 pointer-events-auto flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300 select-none"
    >
      <div className="relative w-full max-w-2xl bg-[#140e0a] text-monsoon-cream rounded-2xl shadow-2xl border border-white/10 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-[#1f150f] px-6 py-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <CloudRain className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-sm font-mono uppercase tracking-widest text-amber-400 font-bold">
                About Monsoon Window (मानसून विंडो)
              </h2>
              <p className="text-[10px] text-white/50 font-serif italic">
                “Somewhere between the rain and the radio.”
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs sm:text-sm leading-relaxed text-monsoon-cream/80 font-sans">
          <div>
            <h3 className="text-base font-bold text-white mb-1.5 font-serif">
              An Atmospheric Indian Monsoon Sanctuary
            </h3>
            <p className="text-white/70">
              Monsoon Window is a living digital place designed to stay open in the background for hours. Sitting inside a cozy room, watching raindrops stream across the window glass, while listening to curated 90s cassettes, ghazals, and acoustic melodies on <strong>Monsoon FM (98.7 MHz)</strong>.
            </p>
          </div>

          {/* Interactive Elements Guide */}
          <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-3">
            <h4 className="font-mono text-amber-400 font-bold uppercase tracking-wider text-xs">
              Room Interactions
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="flex items-start gap-2">
                <BookOpen className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span><strong>Monsoon Diary</strong>: Click the notebook on the desk or in the header to read handwritten reflections.</span>
              </div>
              <div className="flex items-start gap-2">
                <Radio className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span><strong>Monsoon FM Radio</strong>: Play, pause, browse cassette tapes, and tune atmospheric ambient sounds.</span>
              </div>
              <div className="flex items-start gap-2">
                <CloudRain className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
                <span><strong>Window Glass</strong>: Click and wipe across the pane to clear condensation mist.</span>
              </div>
            </div>
          </div>

          {/* Time engine explanation */}
          <div>
            <h4 className="font-mono text-amber-400 font-bold uppercase tracking-wider text-xs mb-1">
              The 24-Hour Time Engine
            </h4>
            <p className="text-white/60">
              The sky, rain intensity, street headlights, and radio programs dynamically evolve with your real local time across 7 atmospheric cycles: <em>Dawn, Morning, Heavy Downpour, Golden Hour, Evening, Night Rain, and Deep Sannata</em>.
            </p>
          </div>

          {/* Legal / Audio Notice */}
          <div className="border-t border-white/10 pt-4 text-[11px] text-white/50 leading-relaxed font-mono">
            <strong>Music Streaming & Rights Notice:</strong> Audio is streamed via the official YouTube IFrame API. All musical rights and royalties belong entirely to the respective composers, lyricists, vocalists, and record labels. No audio is hosted on this server.
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#1a120c] px-6 py-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/50">
          <span>Made for rainy day dreamers</span>
          <span>Version 1.0</span>
        </div>
      </div>
    </div>
  );
}
