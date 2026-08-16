'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Song, RadioProgram } from '@/types';
import { SONGS_DATABASE } from '@/data/songs';
import { RADIO_PROGRAMS } from '@/data/programs';
import Equalizer from './Equalizer';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  ListMusic,
  Sliders,
  ExternalLink,
  Tv,
} from 'lucide-react';

interface RadioPlayerProps {
  currentSong?: Song;
  activeProgram?: RadioProgram;
  isPlaying: boolean;
  onPlayToggle: () => void;
  onNext: () => void;
  onPrev: () => void;
  onOpenDrawer: () => void;
  onOpenMixer: () => void;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function RadioPlayer({
  currentSong,
  activeProgram,
  isPlaying,
  onPlayToggle,
  onNext,
  onPrev,
  onOpenDrawer,
  onOpenMixer,
}: RadioPlayerProps) {
  const song: Song = useMemo(() => currentSong || SONGS_DATABASE[0], [currentSong]);
  const program: RadioProgram = useMemo(() => activeProgram || RADIO_PROGRAMS[0], [activeProgram]);

  const playerRef = useRef<any>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(song.durationSeconds || 240);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isApiReady, setIsApiReady] = useState(false);
  const [playerState, setPlayerState] = useState<number>(-1); // -1: unstarted, 1: playing, 2: paused, 3: buffering
  const [showLargeScreen, setShowLargeScreen] = useState(false);

  // Sync duration when song changes
  useEffect(() => {
    if (song.durationSeconds) {
      setDuration(song.durationSeconds);
      setCurrentTime(0);
    }
  }, [song.id, song.durationSeconds]);

  // Keep onNext reference current for YouTube player callbacks
  const onNextRef = useRef(onNext);
  useEffect(() => {
    onNextRef.current = onNext;
  }, [onNext]);

  // 1. Reliable YouTube IFrame API Script Loader
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (window.YT && window.YT.Player) {
      setIsApiReady(true);
      return;
    }

    const existingCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof existingCallback === 'function') {
        existingCallback();
      }
      setIsApiReady(true);
    };

    if (!document.getElementById('yt-iframe-api-script')) {
      const tag = document.createElement('script');
      tag.id = 'yt-iframe-api-script';
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }
  }, []);

  // 2. Initialize or Update YouTube Player
  useEffect(() => {
    if (!isApiReady || typeof window === 'undefined' || !window.YT || !song?.youtubeId) return;

    if (!playerRef.current) {
      try {
        playerRef.current = new window.YT.Player('yt-radio-screen', {
          width: '100%',
          height: '100%',
          videoId: song.youtubeId,
          playerVars: {
            autoplay: isPlaying ? 1 : 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            iv_load_policy: 3,
            enablejsapi: 1,
            origin: window.location.origin,
            playsinline: 1,
          },
          events: {
            onReady: (event: any) => {
              event.target.setVolume(isMuted ? 0 : volume);
              if (isPlaying) {
                try {
                  event.target.playVideo();
                } catch (e) {
                  console.warn('Autoplay blocked on ready:', e);
                }
              }
            },
            onStateChange: (event: any) => {
              setPlayerState(event.data);
              // 0 = YT.PlayerState.ENDED
              if (event.data === 0) {
                onNextRef.current();
              }
            },
            onError: (err: any) => {
              console.warn('YouTube video error (code:', err?.data, '), advancing track...');
              setTimeout(() => {
                onNextRef.current();
              }, 1200);
            },
          },
        });
      } catch (err) {
        console.warn('Error creating YT.Player:', err);
      }
    } else {
      try {
        if (typeof playerRef.current.loadVideoById === 'function') {
          if (isPlaying) {
            playerRef.current.loadVideoById(song.youtubeId);
          } else {
            playerRef.current.cueVideoById(song.youtubeId);
          }
        }
      } catch (err) {
        console.warn('Error loading video by ID:', err);
      }
    }
  }, [song.youtubeId, isApiReady]);

  // 3. Synchronize play/pause state with player
  useEffect(() => {
    if (!playerRef.current) return;
    try {
      if (isPlaying) {
        if (typeof playerRef.current.playVideo === 'function') {
          playerRef.current.playVideo();
        }
      } else {
        if (typeof playerRef.current.pauseVideo === 'function') {
          playerRef.current.pauseVideo();
        }
      }
    } catch (e) {
      console.warn('Playback toggle error:', e);
    }
  }, [isPlaying]);

  // 4. Progress ticker & Duration updater
  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function' && isPlaying) {
        try {
          const curr = playerRef.current.getCurrentTime() || 0;
          const dur = playerRef.current.getDuration() || song.durationSeconds || 240;
          setCurrentTime(curr);
          setDuration(dur);
        } catch (e) {
          // ignore
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isPlaying, song.durationSeconds]);

  // 5. Seek handler (Supports Mouse & Touch on Mobile)
  const handleSeek = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clickPos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const seekTarget = clickPos * duration;
    if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
      try {
        playerRef.current.seekTo(seekTarget, true);
        setCurrentTime(seekTarget);
      } catch (err) {
        console.warn('Seek error:', err);
      }
    }
  };

  // 6. Volume handler
  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (isMuted) setIsMuted(false);
    if (playerRef.current && typeof playerRef.current.setVolume === 'function') {
      try {
        playerRef.current.setVolume(newVol);
        if (newVol > 0 && typeof playerRef.current.unMute === 'function') {
          playerRef.current.unMute();
        }
      } catch (err) {
        console.warn('Volume change error:', err);
      }
    }
  };

  // 7. Mute toggle handler
  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (playerRef.current) {
      try {
        if (nextMute) {
          if (typeof playerRef.current.mute === 'function') playerRef.current.mute();
        } else {
          if (typeof playerRef.current.unMute === 'function') playerRef.current.unMute();
          if (typeof playerRef.current.setVolume === 'function') playerRef.current.setVolume(volume);
        }
      } catch (err) {
        console.warn('Mute error:', err);
      }
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <div className="relative z-30 w-full max-w-4xl mx-auto px-3 sm:px-6 select-none pointer-events-none">
      {/* Optional Expanded TV Screen Modal for Cinema View */}
      {showLargeScreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300 pointer-events-auto">
          <div className="relative w-full max-w-3xl bg-[#140e0b] border border-white/20 rounded-2xl overflow-hidden shadow-2xl p-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                <Tv className="w-4 h-4" />
                <span>Monsoon Window • CRT Cinema Deck</span>
              </div>
              <button
                onClick={() => setShowLargeScreen(false)}
                className="text-white/60 hover:text-white text-xs font-mono bg-white/10 px-3 py-1 rounded-lg"
              >
                Close View ✕
              </button>
            </div>
            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-white/10">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${song.youtubeId}?autoplay=1&controls=1&modestbranding=1&rel=0`}
                title={song.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-white/60 font-mono">
              <span>{song.title} — {song.artist}</span>
              <a
                href={`https://www.youtube.com/watch?v=${song.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:underline flex items-center gap-1"
              >
                Open in YouTube <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Main Glassmorphic Radio Console */}
      <div className="bg-[#120e0b]/94 border border-white/15 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex flex-col md:flex-row items-center justify-between gap-2.5 sm:gap-4 pointer-events-auto">
        {/* Left Side: Retro TV/Cassette Screen & Program Metadata */}
        <div className="w-full md:w-1/2 flex items-center gap-2 sm:gap-3.5 bg-black/60 border border-white/8 rounded-xl p-1.5 sm:p-2.5 shadow-inner min-w-0">
          {/* Vintage CRT / Cassette Monitor Screen with Live YouTube Video */}
          <div className="relative w-16 h-12 sm:w-28 sm:h-18 rounded-lg overflow-hidden border border-white/15 flex-shrink-0 bg-black shadow-md group">
            {/* The Live YouTube Video Embed mounts here */}
            <div className="w-full h-full overflow-hidden">
              <div id="yt-radio-screen" className="w-full h-full object-cover pointer-events-auto" />
            </div>

            {/* Clickable Play Overlay if video is paused */}
            {!isPlaying && (
              <div
                onClick={onPlayToggle}
                className="absolute inset-0 bg-black/60 cursor-pointer flex flex-col items-center justify-center transition-opacity z-10 hover:bg-black/40"
                title="Click to play"
              >
                <img
                  src={song.thumbnailUrl}
                  alt={song.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none"
                />
                <div className="relative z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-500 text-black flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                  <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current ml-0.5" />
                </div>
              </div>
            )}

            {/* Equalizer animation when playing */}
            {isPlaying && (
              <div className="absolute bottom-1 right-1 bg-black/70 px-1 py-0.5 rounded border border-white/10 z-20 pointer-events-none">
                <Equalizer isPlaying={isPlaying} barCount={3} color="#f59e0b" />
              </div>
            )}

            {/* Subtle retro scanline texture overlay */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-35 z-10" />
          </div>

          {/* Song text & credits */}
          <div className="flex-grow min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span
                suppressHydrationWarning
                className="inline-block bg-amber-500/20 text-amber-300 text-[8px] sm:text-[9px] font-mono font-bold px-1.5 sm:px-2 py-0.5 rounded tracking-widest uppercase"
              >
                {program.title}
              </span>
              <span suppressHydrationWarning className="text-[9px] sm:text-[10px] text-white/40 hidden sm:inline font-mono">
                {program.frequency}
              </span>
            </div>

            <h3 suppressHydrationWarning className="text-xs sm:text-base font-bold text-white truncate mt-0.5">
              {song.title}
            </h3>

            <p suppressHydrationWarning className="text-[10px] sm:text-xs text-amber-200/70 truncate">
              {song.artist} {song.film ? `• ${song.film}` : ''} ({song.year || 'Retro'})
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => setShowLargeScreen(true)}
              className="p-1 sm:p-1.5 hover:bg-white/10 rounded-lg border border-white/10 text-white/70 hover:text-amber-400 transition-colors flex-shrink-0 cursor-pointer"
              title="Expand Cinema Screen"
            >
              <Tv className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onOpenDrawer}
              className="p-1 sm:p-1.5 hover:bg-white/10 rounded-lg border border-white/10 text-white/70 hover:text-amber-400 transition-colors flex-shrink-0 cursor-pointer"
              title="Browse Cassette Tapes"
            >
              <ListMusic className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Side: Player Controls & Soundboard */}
        <div className="w-full md:w-1/2 flex flex-col gap-2 sm:gap-2.5">
          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4">
            {/* Ambient Soundboard Toggle */}
            <button
              onClick={onOpenMixer}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] sm:text-xs font-mono text-amber-300 transition-colors cursor-pointer"
              title="Open Soundboard"
            >
              <Sliders className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Ambience</span>
            </button>

            {/* Skip Previous */}
            <button
              onClick={onPrev}
              className="p-1.5 sm:p-2 text-white/70 hover:text-amber-400 transition-colors active:scale-95 cursor-pointer"
              title="Previous Track"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            {/* Play / Pause Primary Button */}
            <button
              onClick={onPlayToggle}
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-amber-500 text-black hover:bg-amber-400 flex items-center justify-center transition-all active:scale-95 shadow-[0_0_20px_rgba(245,158,11,0.5)] cursor-pointer flex-shrink-0"
              title={isPlaying ? 'Pause Radio' : 'Play Radio'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
              ) : (
                <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current ml-0.5" />
              )}
            </button>

            {/* Skip Next */}
            <button
              onClick={onNext}
              className="p-1.5 sm:p-2 text-white/70 hover:text-amber-400 transition-colors active:scale-95 cursor-pointer"
              title="Next Track"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            {/* Volume Control (Tablet/Desktop) */}
            <div className="hidden sm:flex items-center gap-2 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5 max-w-[130px]">
              <button
                onClick={toggleMute}
                className="text-white/60 hover:text-white"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-3.5 h-3.5 text-red-400" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                className="w-16 h-1 bg-white/10 rounded-lg accent-amber-400 cursor-pointer"
              />
            </div>
          </div>

          {/* Progress Bar & Seek */}
          <div className="w-full flex items-center gap-2 sm:gap-2.5">
            <span suppressHydrationWarning className="text-[9px] sm:text-[10px] font-mono text-white/40 w-7 sm:w-8 text-right tabular-nums">
              {formatTime(currentTime)}
            </span>
            <div
              onClick={handleSeek}
              onTouchStart={handleSeek}
              className="relative flex-grow h-2 sm:h-1.5 bg-white/10 rounded-full cursor-pointer overflow-hidden group py-1 sm:py-0"
            >
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)] transition-all duration-200"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span suppressHydrationWarning className="text-[9px] sm:text-[10px] font-mono text-white/40 w-7 sm:w-8 tabular-nums">
              {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
