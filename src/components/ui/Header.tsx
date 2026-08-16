'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TimePeriod } from '@/types';
import { TIME_PERIODS } from '@/data/scenes';
import { CloudRain, Clock, Share2, Info, Check, Book, MapPin, Camera, ChevronDown, MoreVertical } from 'lucide-react';

interface HeaderProps {
  timePeriod?: TimePeriod;
  formattedTime: string;
  onSelectPeriodOverride: (periodKey: string | null) => void;
  currentOverride: string | null;
  onOpenAbout: () => void;
  onOpenDiary?: () => void;
  location?: string;
  availableScenes?: Record<string, TimePeriod>;
  variantIndex?: number;
  onToggleVariant?: () => void;
}

const CITIES = [
  { id: 'generic', name: 'Universal', hindi: 'सार्वभौमिक', path: '/?stay=1', display: 'Universal' },
  { id: 'kolkata', name: 'Kolkata', hindi: 'कोलकाता', path: '/kolkata', display: 'Kolkata' },
  { id: 'bangalore', name: 'Bengaluru', hindi: 'बेंगलुरु', path: '/bangalore', display: 'Bengaluru' },
  { id: 'mumbai', name: 'Mumbai', hindi: 'मुंबई', path: '/mumbai', display: 'Mumbai' },
];

export default function Header({
  timePeriod,
  formattedTime,
  onSelectPeriodOverride,
  currentOverride,
  onOpenAbout,
  onOpenDiary,
  location = 'generic',
  availableScenes,
  variantIndex = 0,
  onToggleVariant,
}: HeaderProps) {
  const router = useRouter();
  const [listenerCount, setListenerCount] = useState(148);
  const [copied, setCopied] = useState(false);
  const [showTimeMenu, setShowTimeMenu] = useState(false);
  const [showCityMenu, setShowCityMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const loc = location?.toLowerCase();
  const currentCityObj = CITIES.find((c) => c.id === loc || (loc === 'bengaluru' && c.id === 'bangalore')) || CITIES[0];
  const cityName = currentCityObj.name.toUpperCase();
  const periodName = timePeriod?.name ? timePeriod.name.toUpperCase() : 'MONSOON';
  const scenesList = availableScenes || TIME_PERIODS;

  // Organic simulated listener fluctuation
  useEffect(() => {
    const timer = setInterval(() => {
      setListenerCount((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.max(85, prev + delta);
      });
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const handleShare = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const handleCitySelect = (cityId: string, path: string) => {
    try {
      localStorage.setItem('monsoon_pref_city', cityId);
      document.cookie = `monsoon_pref_city=${cityId}; path=/; max-age=2592000`;
    } catch {}
    setShowCityMenu(false);
    setShowMobileMenu(false);
    router.push(path);
  };

  const hasMultipleAngles = Boolean(timePeriod?.bgImages && timePeriod.bgImages.length > 1);

  return (
    <header className="relative z-30 w-full p-2 sm:p-6 select-none">
      {/* ---------------- MOBILE HEADER BAR (< sm) ---------------- */}
      <div className="flex sm:hidden w-full items-center justify-between gap-1.5 bg-[#120e0b]/92 backdrop-blur-xl border border-white/10 px-3 py-1.5 rounded-xl shadow-2xl">
        {/* Left: Live Status & Clock */}
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="relative flex h-2 w-2 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <span
            suppressHydrationWarning
            className="text-xs font-bold font-mono text-white tracking-tight tabular-nums truncate"
          >
            {formattedTime}
          </span>
          <span className="text-[9px] font-mono text-amber-400/90 uppercase font-bold bg-amber-500/15 px-1.5 py-0.5 rounded truncate max-w-[70px]">
            {currentCityObj.display}
          </span>
        </div>

        {/* Right: City, Time/Mood, Angle (if multi), and Menu dots */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* City Picker Button */}
          <button
            onClick={() => {
              setShowCityMenu(!showCityMenu);
              setShowTimeMenu(false);
              setShowMobileMenu(false);
            }}
            className={`p-1.5 rounded-lg border transition-all flex items-center justify-center cursor-pointer ${
              currentCityObj.id !== 'generic'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/80'
            }`}
            title="Switch City Skyline"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
          </button>

          {/* Time / Mood Button */}
          <button
            onClick={() => {
              setShowTimeMenu(!showTimeMenu);
              setShowCityMenu(false);
              setShowMobileMenu(false);
            }}
            className={`p-1.5 rounded-lg border transition-all flex items-center justify-center cursor-pointer ${
              currentOverride
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/80'
            }`}
            title="Switch Atmosphere Mood"
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
          </button>

          {/* Angle Button if available */}
          {hasMultipleAngles && onToggleVariant && (
            <button
              onClick={onToggleVariant}
              className="p-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 rounded-lg flex items-center justify-center cursor-pointer shadow-[0_0_10px_rgba(245,158,11,0.2)]"
              title={`Switch view angle (${((variantIndex ?? 0) % (timePeriod?.bgImages?.length || 1)) + 1}/${timePeriod?.bgImages?.length || 1})`}
            >
              <Camera className="w-3.5 h-3.5 text-amber-400" />
            </button>
          )}

          {/* More Options / Menu Button */}
          <button
            onClick={() => {
              setShowMobileMenu(!showMobileMenu);
              setShowCityMenu(false);
              setShowTimeMenu(false);
            }}
            className="p-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white rounded-lg flex items-center justify-center cursor-pointer"
            title="More Options"
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ---------------- DESKTOP HEADER BAR (>= sm) ---------------- */}
      <div className="hidden sm:flex w-full items-start justify-between gap-3">
        {/* Left Box: Live Listeners & Time */}
        <div className="bg-[#120e0b]/90 backdrop-blur-md border border-white/10 p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-xl flex flex-col gap-1 sm:gap-1.5 flex-shrink-0 min-w-[160px] sm:min-w-[170px] max-w-[250px] z-20">
          {/* Live status badge */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
            <span
              suppressHydrationWarning
              className="text-xs font-mono font-bold tracking-wider text-amber-400 uppercase truncate"
            >
              {listenerCount} Listening
            </span>
          </div>

          {/* Live Clock */}
          <div className="flex items-baseline gap-2">
            <span
              suppressHydrationWarning
              className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight tabular-nums"
            >
              {formattedTime}
            </span>
            <span className="text-[10px] font-mono text-white/50 tracking-wider flex-shrink-0">
              IST
            </span>
          </div>

          {/* City & Weather subtitle */}
          <div className="flex items-center gap-1.5 text-[10px] text-white/60 font-mono border-t border-white/5 pt-1.5 mt-0.5 min-w-0">
            <CloudRain className="w-3 h-3 text-sky-400 flex-shrink-0" />
            <span suppressHydrationWarning className="truncate">{cityName} • {periodName}</span>
          </div>
        </div>

        {/* Center Title - Absolutely locked to horizontal center */}
        <div className="hidden lg:flex absolute left-1/2 top-3 sm:top-5 -translate-x-1/2 flex-col items-center justify-center text-center pointer-events-none z-10">
          <div className="inline-block bg-amber-500/10 border border-amber-500/20 px-3 py-0.5 rounded-full text-[9px] font-mono tracking-widest text-amber-400 uppercase mb-1">
            98.7 FM • {cityName} BROADCAST
          </div>
          <h1 className="text-2xl font-black font-sans tracking-widest text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
            MONSOON WINDOW
          </h1>
          <p className="text-[10px] text-amber-200/60 font-serif italic">
            “Somewhere between the rain and the radio.”
          </p>
        </div>

        {/* Right Controls Desktop */}
        <div className="flex items-center gap-2 flex-shrink-0 z-20">
          {/* City / Location Dropdown Selector */}
          <button
            onClick={() => {
              setShowCityMenu(!showCityMenu);
              setShowTimeMenu(false);
            }}
            className={`px-3 py-2 rounded-xl text-xs font-mono border transition-all flex items-center gap-1.5 cursor-pointer min-w-[110px] justify-center ${
              currentCityObj.id !== 'generic'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                : 'bg-[#120e0b]/85 text-white/80 border-white/10 hover:bg-[#1a1410] hover:text-white'
            }`}
            title="Switch City Skyline"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span className="truncate">{currentCityObj.display}</span>
            <ChevronDown className="w-3 h-3 text-white/50 flex-shrink-0" />
          </button>

          {/* Alternate Scene Angle / View Switcher if multiple images exist */}
          {hasMultipleAngles && onToggleVariant && (
            <button
              onClick={onToggleVariant}
              className="bg-[#120e0b]/85 hover:bg-[#1a1410] border border-amber-500/40 text-amber-300 hover:text-amber-200 px-3 py-2 rounded-xl text-xs font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-[0_0_12px_rgba(245,158,11,0.2)]"
              title={`Switch scene view (${((variantIndex ?? 0) % (timePeriod?.bgImages?.length || 1)) + 1}/${timePeriod?.bgImages?.length || 1})`}
            >
              <Camera className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span suppressHydrationWarning className="truncate">
                Angle {((variantIndex ?? 0) % (timePeriod?.bgImages?.length || 1)) + 1}/{timePeriod?.bgImages?.length || 1}
              </span>
            </button>
          )}

          {/* Time Mood Selector */}
          <button
            onClick={() => {
              setShowTimeMenu(!showTimeMenu);
              setShowCityMenu(false);
            }}
            className={`px-3 py-2 rounded-xl text-xs font-mono border transition-all flex items-center gap-1.5 cursor-pointer min-w-[120px] max-w-[190px] justify-center ${
              currentOverride
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                : 'bg-[#120e0b]/85 text-white/80 border-white/10 hover:bg-[#1a1410] hover:text-white'
            }`}
            title="Switch time of day mood"
          >
            <Clock className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span suppressHydrationWarning className="truncate">
              {currentOverride && scenesList[currentOverride] ? scenesList[currentOverride].name : 'Live Time'}
            </span>
          </button>

          {/* Monsoon Diary Quick Header Button */}
          {onOpenDiary && (
            <button
              onClick={onOpenDiary}
              className="bg-[#120e0b]/85 hover:bg-[#1a1410] border border-white/10 text-white/80 hover:text-amber-400 px-3 py-2 rounded-xl text-xs font-mono flex items-center justify-center gap-1.5 transition-colors cursor-pointer flex-shrink-0"
              title="Read Monsoon Diary (मानसून डायरी)"
            >
              <Book className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span className="truncate">Diary</span>
            </button>
          )}

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="bg-[#120e0b]/85 hover:bg-[#1a1410] border border-white/10 text-white/80 hover:text-amber-400 px-3 py-2 rounded-xl text-xs font-mono flex items-center justify-center gap-1.5 transition-colors cursor-pointer flex-shrink-0"
            title="Share Monsoon Window"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" /> : <Share2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />}
            <span className="truncate">{copied ? 'Copied' : 'Share'}</span>
          </button>

          {/* About Info Button */}
          <button
            onClick={onOpenAbout}
            className="bg-[#120e0b]/85 hover:bg-[#1a1410] border border-white/10 text-white/80 hover:text-amber-400 px-3 py-2 rounded-xl text-xs font-mono flex items-center justify-center gap-1.5 transition-colors cursor-pointer flex-shrink-0"
            title="About Monsoon Window"
          >
            <Info className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span className="truncate">About</span>
          </button>
        </div>
      </div>

      {/* ---------------- SHARED DROPDOWN MENUS ---------------- */}

      {/* 1. City Dropdown Menu */}
      {showCityMenu && (
        <div className="absolute right-2 sm:right-6 top-12 sm:top-20 w-48 max-w-[85vw] bg-[#18110c] border border-white/15 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
          <div className="px-2.5 py-1 text-[9px] font-mono uppercase tracking-widest text-amber-400 border-b border-white/10 mb-1">
            Select City
          </div>
          {CITIES.map((c) => {
            const isActive = (loc === c.id) || (loc === 'bengaluru' && c.id === 'bangalore') || (!loc && c.id === 'generic');
            return (
              <button
                key={c.id}
                onClick={() => handleCitySelect(c.id, c.path)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors flex items-center justify-between cursor-pointer ${
                  isActive ? 'bg-amber-500 text-black font-bold' : 'text-white/80 hover:bg-white/10'
                }`}
              >
                <div>
                  <div>{c.name}</div>
                  <div className="text-[9px] opacity-60 font-devanagari">{c.hindi}</div>
                </div>
                {isActive && <Check className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </div>
      )}

      {/* 2. Time Menu Dropdown */}
      {showTimeMenu && (
        <div className="absolute right-2 sm:right-6 top-12 sm:top-20 w-56 max-w-[85vw] bg-[#18110c] border border-white/15 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
          <div className="px-2.5 py-1 text-[9px] font-mono uppercase tracking-widest text-amber-400 border-b border-white/10 mb-1">
            {cityName} Atmospheres
          </div>
          <button
            onClick={() => {
              onSelectPeriodOverride(null);
              setShowTimeMenu(false);
            }}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors flex items-center justify-between cursor-pointer ${
              !currentOverride ? 'bg-amber-500 text-black font-bold' : 'text-white/80 hover:bg-white/10'
            }`}
          >
            <span>Live System Clock</span>
            {!currentOverride && <Check className="w-3.5 h-3.5" />}
          </button>

          <div className="my-1 border-t border-white/5" />

          {Object.entries(scenesList).map(([key, p]) => (
            <button
              key={key}
              onClick={() => {
                onSelectPeriodOverride(key);
                setShowTimeMenu(false);
              }}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors flex items-center justify-between cursor-pointer ${
                currentOverride === key ? 'bg-amber-500 text-black font-bold' : 'text-white/80 hover:bg-white/10'
              }`}
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span>{p.name}</span>
                  {p.bgImages && p.bgImages.length > 1 && (
                    <span className="text-[9px] text-amber-400 font-mono bg-amber-500/20 px-1 rounded">2 views</span>
                  )}
                </div>
                <div className="text-[9px] opacity-60 font-devanagari">{p.hindiName}</div>
              </div>
              {currentOverride === key && <Check className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>
      )}

      {/* 3. Mobile More Menu Dropdown */}
      {showMobileMenu && (
        <div className="absolute right-2 top-12 w-48 max-w-[85vw] bg-[#18110c] border border-white/15 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 sm:hidden">
          <div className="px-2.5 py-1 text-[9px] font-mono uppercase tracking-widest text-amber-400 border-b border-white/10 mb-1">
            Menu & Actions
          </div>
          {onOpenDiary && (
            <button
              onClick={() => {
                setShowMobileMenu(false);
                onOpenDiary();
              }}
              className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-mono text-white/80 hover:bg-white/10 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Book className="w-3.5 h-3.5 text-amber-400" />
              <span>Monsoon Diary</span>
            </button>
          )}
          <button
            onClick={() => {
              setShowMobileMenu(false);
              handleShare();
            }}
            className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-mono text-white/80 hover:bg-white/10 transition-colors flex items-center gap-2 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-amber-400" />}
            <span>{copied ? 'Link Copied' : 'Share Window'}</span>
          </button>
          <button
            onClick={() => {
              setShowMobileMenu(false);
              onOpenAbout();
            }}
            className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-mono text-white/80 hover:bg-white/10 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Info className="w-3.5 h-3.5 text-amber-400" />
            <span>About Project</span>
          </button>
        </div>
      )}
    </header>
  );
}
