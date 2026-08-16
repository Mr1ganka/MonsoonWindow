'use client';

import React from 'react';
import { Song } from '@/types';
import { SONGS_DATABASE } from '@/data/songs';
import { RADIO_PROGRAMS } from '@/data/programs';
import { X, Disc3, Play, Clock } from 'lucide-react';

interface CassetteDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentSong: Song;
  onSelectSong: (song: Song) => void;
}

export default function CassetteDrawer({
  isOpen,
  onClose,
  currentSong,
  onSelectSong,
}: CassetteDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-4xl bg-[#130f0c] text-white rounded-2xl shadow-2xl border border-white/10 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[88vh]">
        {/* Header */}
        <div className="bg-[#1f1611] px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <Disc3 className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 animate-spin [animation-duration:8s] flex-shrink-0" />
            <div className="min-w-0">
              <h2 className="text-xs sm:text-sm font-mono uppercase tracking-widest text-amber-400 font-bold truncate">
                Monsoon FM • Cassette Tape Rack (कैसेट संग्रह)
              </h2>
              <p className="text-[10px] sm:text-xs text-white/50 truncate">
                Curated Indian Monsoon, 90s/2000s Bollywood & Ghazal recordings
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white flex-shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Songs Grid */}
        <div className="p-3 sm:p-6 overflow-y-auto flex-grow grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-4">
          {SONGS_DATABASE.map((song) => {
            const isPlaying = song.id === currentSong?.id;
            const program = RADIO_PROGRAMS.find((p) => p.id === song.programId);

            return (
              <div
                key={song.id}
                onClick={() => {
                  onSelectSong(song);
                  onClose();
                }}
                className={`group p-2.5 sm:p-3.5 rounded-xl border transition-all cursor-pointer flex gap-3 items-start ${
                  isPlaying
                    ? 'bg-amber-500/15 border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                    : 'bg-[#1a1410] border-white/5 hover:border-amber-500/40 hover:bg-[#241c16]'
                }`}
              >
                {/* YouTube Video / Album Thumbnail */}
                <div className="relative w-20 h-14 sm:w-24 sm:h-16 rounded-lg overflow-hidden border border-white/10 flex-shrink-0 bg-black shadow-md group-hover:scale-105 transition-transform">
                  <img
                    src={song.thumbnailUrl}
                    alt={song.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 fill-current" />
                  </div>
                  {isPlaying && (
                    <div className="absolute top-1 right-1 px-1.5 py-0.5 rounded bg-amber-500 text-black text-[7px] sm:text-[8px] font-mono font-bold uppercase">
                      Playing
                    </div>
                  )}
                </div>

                {/* Metadata */}
                <div className="flex-grow min-w-0">
                  <div className="flex items-center justify-between text-[9px] font-mono text-white/40 mb-1">
                    <span className="text-amber-400/90 font-bold uppercase">{program?.title || 'Monsoon'}</span>
                    <span>{song.year || 'Retro'}</span>
                  </div>

                  <h3 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors truncate">
                    {song.title}
                  </h3>
                  {song.titleHi && (
                    <p className="text-xs font-devanagari text-amber-200/80 truncate">
                      {song.titleHi}
                    </p>
                  )}
                  <p className="text-xs text-white/60 truncate mt-0.5">
                    {song.artist} {song.film ? `• ${song.film}` : ''}
                  </p>

                  <div className="flex items-center justify-between pt-2 mt-2 border-t border-white/5 text-[10px] font-mono text-white/40">
                    <span className="bg-white/5 px-2 py-0.2 rounded text-amber-300/80">{song.mood}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {Math.floor(song.durationSeconds / 60)}:{(song.durationSeconds % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="bg-[#1a1410] px-6 py-3 border-t border-white/5 text-center text-[10px] text-white/40 font-mono">
          Audio streamed via YouTube API • All rights belong to respective record labels & composers
        </div>
      </div>
    </div>
  );
}
