# Monsoon Window — System Architecture & Specification

> **"Somewhere between the rain and the radio."**  
> An atmospheric, 24-hour time-responsive digital sanctuary set inside an Indian apartment during monsoon season, overlooking a rainy city window with curated music and ambient soundscapes.

---

## 1. Vision & Identity

- **Core Metaphor**: You are sitting inside a quiet room in an Indian apartment (such as Mumbai, Bengaluru, Kolkata, or Delhi) during the monsoon season. Rain falls outside your window, the city bustles below, chai steams on your desk, and an old FM radio ("Monsoon FM 98.7") plays curated nostalgic tunes.
- **Original Identity**: Handcrafted visual atmosphere, warm analog nostalgia (90s–2000s cassette & radio aesthetics, vintage desk, incandescent lighting), avoiding generic SaaS dashboards, cyberpunk tropes, or flat stock images.
- **24-Hour Responsive World**: The exterior sky, rain intensity, ambient lighting, city traffic, and radio programs dynamically respond to the user's real-time local clock (with an intuitive time-travel scrubber/mode for previewing all moods).

---

## 2. Technical Stack

- **Framework**: Next.js 14+ (App Router) / React 18+
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom CSS Variables & Animations (cinematic grain, glow, steam, vignettes)
- **Visual Engine**:
  - HTML5 Canvas for dynamic procedural rain, sliding glass droplets, condensation streaks, wind turbulence, and lightning flashes.
  - Multi-layer parallax depth system (Foreground: Window frame, curtains, desk objects; Midground: Glass reflections, rain; Background: City skyline, traffic headlights, moving clouds).
- **Audio Architecture**:
  - **Music Stream**: YouTube IFrame API integration with fallback HTML5 audio streams, metadata sync, live track progress, animated audio visualizer/equalizer.
  - **Multi-channel Ambient Sound Engine**: Web Audio API generated / audio-layered synthesizers for rain (light to heavy), distant city rumble, occasional thunder, and room/fan tone with individual volume mixers.
- **State & Time Engine**:
  - Zero-lag precision clock with automated cross-fading scene transitions.
  - LocalStorage persistence for user preferences (volume levels, lamp state, manual time mode).

---

## 3. The 7-Period Dynamic Time System

| Time Period | Name | Sky & Lighting | Rain Intensity | Outside City Activity | Radio Program |
|-------------|------|----------------|----------------|------------------------|---------------|
| **06:00 – 08:00** | **Dawn (भोर)** | Pale blue/grey, soft mist | 20% gentle drizzle | Quiet streets, early morning buses | *Baarish Ki Subah* |
| **08:00 – 12:00** | **Monsoon Morning (सुबह)** | Bright overcast grey, cool daylight | 45% steady rain | Traffic, pedestrians with umbrellas | *Chai & Clouds* |
| **12:00 – 16:00** | **Heavy Rain (दोपहर)** | Dark charcoal storm clouds | 90% torrential downpour | Headlights reflecting on wet asphalt, strong winds | *Dopahar Ki Baarish* |
| **16:00 – 18:30** | **Rainy Golden Hour (गोधूलि)** | Amber/gold breaking through storm | 30% golden showers | Sunset traffic, warm road reflections | *Shaam Ka Safar* |
| **18:30 – 22:00** | **Monsoon Evening (शाम)** | Deep indigo, glowing city lights | 60% steady rain | Streetlights, neon reflections, warm room contrast | *Baarish After Dark* |
| **22:00 – 02:00** | **Night Rain (रात)** | Midnight navy/black, warm lamp glow | 75% night rain | Occasional passing vehicle beams, quiet buildings | *Raat Aur Baarish* |
| **02:00 – 06:00** | **Deep Night (सन्नाटा)** | Pitch dark, calm ambient silence | 25% quiet drizzle | Distant single headlights, tranquil intimate room | *Sannata & Sitar* |

---

## 4. Interactive Room Objects

1. **Monsoon FM 98.7 Radio**:
   - Vintage dial with illuminated frequency scale.
   - Interactive tuner to switch programs/stations or browse the curated cassette tape catalog.
   - Working play/pause, track skip, volume slider, and cassette tape list drawer.
2. **Steaming Chai Cup (चाय की प्याली)**:
   - Dynamic canvas/CSS steam particle animation.
   - Click to take a sip / stir: increases steam, plays soothing clink audio, displays intimate ephemeral notes (e.g. *"Still warm.", "Cardamom and rain."*).
3. **Window Pane & Condensation**:
   - Interactive glass: clicking/dragging wipes condensation off the glass, exposing the crisp view outside.
   - Dynamic raindrops that run down the pane and merge into rivulets.
4. **Vintage Brass Table Lamp**:
   - Clickable pull-chain / switch toggling between warm incandescent amber glow, soft neutral, and off.
5. **Rain Notebook / Diary (डायरी)**:
   - Click to open a handwritten journal of monsoon poems, nostalgic reflections, and vintage stamps in English & Hindi.
6. **Breeze-swept Curtains**:
   - Interactive fabric reacting smoothly to mouse movement and ambient wind velocity.

---

## 5. Audio Engineering

- **Dual-Stream Architecture**:
  1. **Monsoon FM Radio**: YouTube IFrame API player syncing track title, artist, year, album art, and live progress.
  2. **Atmospheric Soundboard**:
     - 🌧️ Rain (Intensity synced to time period or user mixer)
     - 🚗 Distant City Traffic & Horns
     - ⚡ Occasional Distant Thunder
     - 🌀 Room Tone & Ceiling Fan
- **Audio Autoplay Safeguards**: Non-intrusive "Click to Tune In / Step Inside" initial interaction that cleanly unlocks the Web Audio Context without browser blocking.

---

## 6. Directory Structure

```
monsoon-window/
├── public/
│   ├── audio/          # High-fidelity ambient loops
│   ├── scenes/         # Time-of-day backgrounds & layer assets
│   ├── icons/          # Custom retro UI icons
│   └── fonts/          # Nostalgic typography
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── scene/
│   │   │   ├── MonsoonWindow.tsx
│   │   │   ├── SceneRenderer.tsx
│   │   │   ├── RainCanvas.tsx
│   │   │   ├── GlassCondensation.tsx
│   │   │   └── LightingOverlay.tsx
│   │   ├── room/
│   │   │   ├── Room.tsx
│   │   │   ├── Radio.tsx
│   │   │   ├── ChaiCup.tsx
│   │   │   ├── TableLamp.tsx
│   │   │   ├── NotebookModal.tsx
│   │   │   └── Curtains.tsx
│   │   ├── player/
│   │   │   ├── NowPlaying.tsx
│   │   │   ├── Equalizer.tsx
│   │   │   ├── CassetteDrawer.tsx
│   │   │   └── AmbientMixer.tsx
│   │   └── ui/
│   │       ├── ClockWidget.tsx
│   │       ├── TimeScrubber.tsx
│   │       ├── CitySelector.tsx
│   │       └── InfoModal.tsx
│   ├── data/
│   │   ├── songs.ts
│   │   ├── programs.ts
│   │   ├── scenes.ts
│   │   └── notebookEntries.ts
│   ├── lib/
│   │   ├── timeEngine.ts
│   │   ├── weatherEngine.ts
│   │   └── audioEngine.ts
│   └── types/
│       └── index.ts
```
