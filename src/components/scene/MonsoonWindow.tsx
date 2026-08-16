'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import SceneRenderer from './SceneRenderer';
import Room from '../room/Room';
import RadioPlayer from '../player/RadioPlayer';
import CassetteDrawer from '../player/CassetteDrawer';
import AmbientMixer from '../player/AmbientMixer';
import Header from '../ui/Header';
import AboutModal from '../ui/AboutModal';
import NotebookModal from '../room/NotebookModal';
import { getCurrentTimeData, getProgramForPeriod } from '@/lib/timeEngine';
import { getScenesForLocation, TIME_PERIODS } from '@/data/scenes';
import { RADIO_PROGRAMS } from '@/data/programs';
import { audioEngine } from '@/lib/audioEngine';
import { Song, AmbientSettings, TimePeriod, RadioProgram } from '@/types';
import { SONGS_DATABASE } from '@/data/songs';
import { Volume2, Play } from 'lucide-react';

interface MonsoonWindowProps {
  location?: 'generic' | 'kolkata' | 'bangalore' | 'mumbai' | string;
}

export default function MonsoonWindow({ location = 'generic' }: MonsoonWindowProps) {
  const scenes = useMemo(() => getScenesForLocation(location), [location]);
  const [timeData, setTimeData] = useState(() => getCurrentTimeData(undefined, location));
  const [periodOverride, setPeriodOverride] = useState<string | null>(null);
  const [variantIndex, setVariantIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedSongId, setSelectedSongId] = useState<string>(SONGS_DATABASE[0].id);
  const [isCassetteDrawerOpen, setIsCassetteDrawerOpen] = useState(false);
  const [isMixerOpen, setIsMixerOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isDiaryOpen, setIsDiaryOpen] = useState(false);
  const [hasUserUnlockedAudio, setHasUserUnlockedAudio] = useState(false);

  const [ambientSettings, setAmbientSettings] = useState<AmbientSettings>({
    masterVolume: 0.8,
    musicVolume: 0.8,
    rainVolume: 0.8,
    trafficVolume: 0.6,
    roomVolume: 0.2,
    thunderVolume: 0.6,
    isMuted: false,
  });

  // Keep live time and atmosphere synchronized every second
  useEffect(() => {
    setTimeData(getCurrentTimeData(undefined, location));

    const timer = setInterval(() => {
      setTimeData(getCurrentTimeData(undefined, location));
    }, 1000);

    return () => clearInterval(timer);
  }, [location]);

  // Safe fallback period
  const defaultPeriod: TimePeriod = scenes['morning'] || Object.values(scenes)[0] || TIME_PERIODS['morning'];

  // Compute active period considering any override
  const activePeriod: TimePeriod = useMemo(() => {
    if (periodOverride && scenes[periodOverride]) {
      return scenes[periodOverride];
    }
    return timeData.currentPeriod || defaultPeriod;
  }, [periodOverride, scenes, timeData.currentPeriod, defaultPeriod]);

  // Reset variant index when period or location changes
  useEffect(() => {
    setVariantIndex(0);
  }, [activePeriod?.id, location]);

  const handleToggleVariant = useCallback(() => {
    if (activePeriod?.bgImages && activePeriod.bgImages.length > 1) {
      setVariantIndex((prev) => (prev + 1) % activePeriod.bgImages!.length);
    }
  }, [activePeriod?.bgImages]);

  // Compute active program considering any override
  const activeProgram: RadioProgram = useMemo(() => {
    if (periodOverride) {
      return getProgramForPeriod(periodOverride);
    }
    return timeData.activeProgram || RADIO_PROGRAMS[0];
  }, [periodOverride, timeData.activeProgram]);

  // Current active song with guaranteed safe fallback (Defaults to Barsaat - Banjaare)
  const currentSong: Song = useMemo(() => {
    return SONGS_DATABASE.find((s) => s.id === selectedSongId) || SONGS_DATABASE[0];
  }, [selectedSongId]);

  // Initialize Web Audio upon user gesture or auto-start
  const unlockAudioContext = useCallback(() => {
    if (audioEngine) {
      audioEngine.init();
      audioEngine.updateSettings(ambientSettings, activePeriod?.rainIntensity ?? 0.5);
    }
    setHasUserUnlockedAudio(true);
    setIsPlaying(true);
  }, [ambientSettings, activePeriod?.rainIntensity]);

  // Keep ambient settings synchronized with audio engine
  useEffect(() => {
    if (hasUserUnlockedAudio && audioEngine) {
      audioEngine.updateSettings(ambientSettings, activePeriod?.rainIntensity ?? 0.5);
    }
  }, [ambientSettings, activePeriod?.rainIntensity, hasUserUnlockedAudio]);

  // Auto-play attempt on desktop / responsive startup
  useEffect(() => {
    const autoPlayTimer = setTimeout(() => {
      setIsPlaying(true);
      unlockAudioContext();
    }, 800);

    return () => clearTimeout(autoPlayTimer);
  }, [unlockAudioContext]);

  const handlePlayToggle = () => {
    unlockAudioContext();
    setIsPlaying((prev) => !prev);
  };

  const handleNext = () => {
    unlockAudioContext();
    const currentIndex = SONGS_DATABASE.findIndex((s) => s.id === selectedSongId);
    const nextSong = SONGS_DATABASE[(currentIndex + 1) % SONGS_DATABASE.length];
    setSelectedSongId(nextSong.id);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    unlockAudioContext();
    const currentIndex = SONGS_DATABASE.findIndex((s) => s.id === selectedSongId);
    const prevSong = SONGS_DATABASE[(currentIndex - 1 + SONGS_DATABASE.length) % SONGS_DATABASE.length];
    setSelectedSongId(prevSong.id);
    setIsPlaying(true);
  };

  const handleSelectSong = (song: Song) => {
    unlockAudioContext();
    setSelectedSongId(song.id);
    setIsPlaying(true);
  };

  return (
    <main
      onClick={unlockAudioContext}
      onTouchStart={unlockAudioContext}
      className="fixed inset-0 w-full h-[100dvh] max-h-[100dvh] overflow-hidden bg-monsoon-ink text-white font-sans flex flex-col justify-between select-none"
    >
      {/* 1. Dynamic Exterior Monsoon City & Weather Scene */}
      <SceneRenderer timePeriod={activePeriod} variantIndex={variantIndex} />

      {/* 2. Room Foreground, Window Sill & Curtains */}
      <Room
        timePeriod={activePeriod}
        currentSong={currentSong}
        isPlaying={isPlaying}
        onTogglePlay={handlePlayToggle}
        onOpenDrawer={() => setIsCassetteDrawerOpen(true)}
        onOpenDiary={() => setIsDiaryOpen(true)}
      />

      {/* 3. Top Header Bar */}
      <Header
        timePeriod={activePeriod}
        formattedTime={timeData.formattedTime || '12:00:00 PM'}
        onSelectPeriodOverride={setPeriodOverride}
        currentOverride={periodOverride}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenDiary={() => setIsDiaryOpen(true)}
        location={location}
        availableScenes={scenes}
        variantIndex={variantIndex}
        onToggleVariant={handleToggleVariant}
      />

      {/* 4. Center Tap Prompt if not playing */}
      {!isPlaying && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            handlePlayToggle();
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
            handlePlayToggle();
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-35 cursor-pointer text-center animate-in fade-in zoom-in-95 duration-500 w-[90vw] max-w-sm pointer-events-auto"
        >
          <div className="bg-black/85 backdrop-blur-md px-5 py-3 rounded-2xl border border-amber-500/40 shadow-2xl flex items-center justify-center gap-3 text-xs font-mono text-amber-300 active:scale-95 transition-transform hover:border-amber-400">
            <div className="w-9 h-9 rounded-full bg-amber-500 text-black flex items-center justify-center flex-shrink-0 shadow-lg">
              <Play className="w-4 h-4 fill-current ml-0.5" />
            </div>
            <div className="text-left min-w-0">
              <div className="font-bold text-white text-xs sm:text-sm truncate">Tap to Tune Radio & Listen</div>
              <div className="text-[10px] text-amber-400/80 truncate">98.7 FM • {currentSong.title} ({currentSong.artist})</div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Bottom Radio & Music Console */}
      <div className="relative z-40 mb-1 sm:mb-3 pointer-events-none">
        <RadioPlayer
          currentSong={currentSong}
          activeProgram={activeProgram}
          isPlaying={isPlaying}
          onPlayToggle={handlePlayToggle}
          onNext={handleNext}
          onPrev={handlePrev}
          onOpenDrawer={() => setIsCassetteDrawerOpen(true)}
          onOpenMixer={() => setIsMixerOpen(!isMixerOpen)}
        />
      </div>

      {/* 6. Soundboard / Ambient Mixer Popover */}
      {isMixerOpen && (
        <div className="fixed bottom-20 sm:bottom-28 right-2 left-2 sm:left-auto sm:right-8 z-45 max-w-sm ml-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
          <AmbientMixer
            settings={ambientSettings}
            onChange={setAmbientSettings}
            rainIntensity={activePeriod.rainIntensity || 0.5}
            onClose={() => setIsMixerOpen(false)}
          />
        </div>
      )}

      {/* 7. Cassette Rack / Playlist Drawer Modal */}
      <CassetteDrawer
        isOpen={isCassetteDrawerOpen}
        onClose={() => setIsCassetteDrawerOpen(false)}
        currentSong={currentSong}
        onSelectSong={handleSelectSong}
      />

      {/* 8. About & Credits Modal */}
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />

      {/* 9. Monsoon Diary Modal */}
      <NotebookModal isOpen={isDiaryOpen} onClose={() => setIsDiaryOpen(false)} />
    </main>
  );
}
