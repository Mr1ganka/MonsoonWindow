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
import { Volume2 } from 'lucide-react';

interface MonsoonWindowProps {
  location?: 'generic' | 'kolkata' | 'bangalore' | 'mumbai' | string;
}

export default function MonsoonWindow({ location = 'generic' }: MonsoonWindowProps) {
  const scenes = useMemo(() => getScenesForLocation(location), [location]);
  const [timeData, setTimeData] = useState(() => getCurrentTimeData(undefined, location));
  const [periodOverride, setPeriodOverride] = useState<string | null>(null);
  const [variantIndex, setVariantIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
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

  // Tick clock every second
  useEffect(() => {
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

  // Active playlist for current time period
  const activeSongs: Song[] = useMemo(() => {
    const filtered = SONGS_DATABASE.filter((s) => s.programId === activeProgram.id);
    return filtered.length > 0 ? filtered : SONGS_DATABASE;
  }, [activeProgram.id]);

  // When program changes due to time period transition, reset to first track of that program
  useEffect(() => {
    setCurrentSongIndex(0);
  }, [activeProgram.id]);

  // Current active song with guaranteed safe fallback
  const currentSong: Song = useMemo(() => {
    if (!activeSongs || activeSongs.length === 0) return SONGS_DATABASE[0];
    const safeIndex = ((currentSongIndex % activeSongs.length) + activeSongs.length) % activeSongs.length;
    return activeSongs[safeIndex] || SONGS_DATABASE[0];
  }, [activeSongs, currentSongIndex]);

  // Initialize Web Audio upon user gesture or auto-start
  const unlockAudioContext = useCallback(() => {
    if (!hasUserUnlockedAudio && audioEngine) {
      audioEngine.init();
      audioEngine.updateSettings(ambientSettings, activePeriod?.rainIntensity ?? 0.5);
      setHasUserUnlockedAudio(true);
    }
  }, [hasUserUnlockedAudio, ambientSettings, activePeriod?.rainIntensity]);

  // Keep ambient settings synchronized with audio engine
  useEffect(() => {
    if (hasUserUnlockedAudio && audioEngine) {
      audioEngine.updateSettings(ambientSettings, activePeriod?.rainIntensity ?? 0.5);
    }
  }, [ambientSettings, activePeriod?.rainIntensity, hasUserUnlockedAudio]);

  // Auto-play 1 second after page loads
  useEffect(() => {
    const autoPlayTimer = setTimeout(() => {
      setIsPlaying(true);
      unlockAudioContext();
    }, 1000);

    return () => clearTimeout(autoPlayTimer);
  }, [unlockAudioContext]);

  const handlePlayToggle = () => {
    unlockAudioContext();
    setIsPlaying((prev) => !prev);
  };

  const handleNext = () => {
    unlockAudioContext();
    setCurrentSongIndex((prev) => (prev + 1) % (activeSongs.length || 1));
  };

  const handlePrev = () => {
    unlockAudioContext();
    setCurrentSongIndex((prev) => (prev - 1 + (activeSongs.length || 1)) % (activeSongs.length || 1));
  };

  const handleSelectSong = (song: Song) => {
    unlockAudioContext();
    const index = activeSongs.findIndex((s) => s.id === song.id);
    if (index !== -1) {
      setCurrentSongIndex(index);
    } else {
      // Find matching period for this song's program if different
      const matchingPeriodKey = Object.keys(scenes).find(
        (k) => getProgramForPeriod(k).id === song.programId
      );
      if (matchingPeriodKey) {
        setPeriodOverride(matchingPeriodKey);
      }
      const globalIndex = SONGS_DATABASE.findIndex((s) => s.id === song.id);
      if (globalIndex !== -1) {
        setCurrentSongIndex(globalIndex);
      }
    }
    setIsPlaying(true);
  };

  return (
    <main
      onClick={unlockAudioContext}
      className="relative w-screen h-screen max-h-screen overflow-hidden bg-monsoon-ink text-white font-sans flex flex-col justify-between"
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

      {/* 4. Center Subtle Prompt if not started */}
      {!isPlaying && !hasUserUnlockedAudio && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-35 pointer-events-none text-center animate-in fade-in zoom-in-95 duration-500 w-[90vw] max-w-sm">
          <div className="bg-black/75 backdrop-blur-md px-4 py-2.5 sm:px-5 rounded-full border border-amber-500/30 shadow-2xl flex items-center justify-center gap-2 text-[11px] sm:text-xs font-mono text-amber-300">
            <Volume2 className="w-4 h-4 text-amber-400 animate-pulse flex-shrink-0" />
            <span className="truncate">Tap anywhere to step into room & tune radio</span>
          </div>
        </div>
      )}

      {/* 5. Bottom Radio & Music Console */}
      <div className="relative z-40 mb-2 sm:mb-3 pointer-events-none">
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
        <div className="fixed bottom-24 sm:bottom-28 right-3 left-3 sm:left-auto sm:right-8 z-40 max-w-sm ml-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
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
