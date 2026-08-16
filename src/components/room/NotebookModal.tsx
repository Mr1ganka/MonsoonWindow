'use client';

import React, { useState } from 'react';
import { NOTEBOOK_ENTRIES } from '@/data/notebookEntries';
import { BookOpen, X, ChevronLeft, ChevronRight, Feather } from 'lucide-react';

interface NotebookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotebookModal({ isOpen, onClose }: NotebookModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const entry = NOTEBOOK_ENTRIES[currentIndex] || NOTEBOOK_ENTRIES[0];

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 pointer-events-auto flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300 select-none"
    >
      {/* Diary Container - Strictly Fixed Dimensions across all entries */}
      <div className="relative w-full max-w-2xl h-[520px] sm:h-[600px] max-h-[92vh] sm:max-h-[88vh] bg-[#fdfbf7] text-[#2c1d11] rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] border border-[#e3d5ca] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Vintage Header Ribbon */}
        <div className="bg-[#4a2e18] text-[#f5ebe0] px-4 py-3 sm:px-6 sm:py-3.5 flex items-center justify-between border-b border-[#3b2310] flex-shrink-0">
          <div className="flex items-center gap-2">
            <Feather className="w-4 h-4 text-[#e0a13a] flex-shrink-0" />
            <span className="text-xs font-mono tracking-widest uppercase text-[#e0a13a] truncate">
              Monsoon Diary (मानसून डायरी)
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-[#f5ebe0] cursor-pointer flex-shrink-0"
            title="Close Diary"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Diary Page Content (Fixed scrollable reading area) */}
        <div className="p-4 sm:p-8 overflow-y-auto flex-1 space-y-4 sm:space-y-5 font-serif leading-relaxed">
          {/* Metadata bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e6ccb2] pb-2 sm:pb-3 text-xs font-mono text-[#7f5539]">
            <span className="font-bold">{entry.date} • {entry.time}</span>
            <span className="bg-[#eddcd2] px-2.5 py-0.5 rounded-full text-[#4a2e18] font-bold">{entry.city}</span>
          </div>

          {/* Titles */}
          <div>
            <h2 className="text-xl sm:text-3xl font-devanagari text-[#3b220d] leading-snug font-bold">
              {entry.titleHi}
            </h2>
            <h3 className="text-base sm:text-xl text-[#7f5539] italic mt-1 font-sans">
              “{entry.title}”
            </h3>
          </div>

          {/* Hindi Text */}
          <div className="p-3.5 sm:p-4 bg-[#f7f2ea] rounded-xl border border-[#e8ded1] text-xs sm:text-[0.95rem] leading-relaxed font-devanagari text-[#3d240e]">
            {entry.contentHi}
          </div>

          {/* English Text */}
          <div className="text-xs sm:text-[0.95rem] text-[#4a2e18]/90 font-sans leading-relaxed whitespace-pre-line">
            {entry.content}
          </div>
        </div>

        {/* Footer Navigation (Pinned to bottom) */}
        <div className="bg-[#f4ebd9] px-4 py-3 sm:px-6 sm:py-3.5 border-t border-[#e3d5ca] flex items-center justify-between flex-shrink-0">
          <button
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-mono text-[#4a2e18] disabled:opacity-30 hover:text-[#e0a13a] transition-colors cursor-pointer disabled:cursor-not-allowed font-bold"
          >
            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Prev
          </button>

          <span className="text-[11px] sm:text-xs font-mono text-[#7f5539] font-bold">
            {currentIndex + 1} / {NOTEBOOK_ENTRIES.length}
          </span>

          <button
            disabled={currentIndex === NOTEBOOK_ENTRIES.length - 1}
            onClick={() => setCurrentIndex((prev) => Math.min(NOTEBOOK_ENTRIES.length - 1, prev + 1))}
            className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-mono text-[#4a2e18] disabled:opacity-30 hover:text-[#e0a13a] transition-colors cursor-pointer disabled:cursor-not-allowed font-bold"
          >
            Next <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
