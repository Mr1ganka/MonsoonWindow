# Monsoon Window — Architectural & Technical Decisions Log

This document records the design choices, trade-offs, and technical decisions made during the development of Monsoon Window.

---

## 1. Project Scope & Architecture Decisions

| Date | Decision | Rationale | Status |
|------|----------|-----------|--------|
| **2026-08-14** | **City Selection**: Static Universal Indian Monsoon City (Bengaluru / Mumbai atmosphere) | Keep initial release focused and tightly polished. Dynamic multi-city skyline switching can be added modularly in Phase 2. | **Approved** |
| **2026-08-14** | **YouTube Player**: Embedded YouTube IFrame API with Live Video Thumbnails | 100% legal streaming respecting artist royalties & rights, exactly like *Jammu Matador* & *Deluxe Saloon*. Uses `img.youtube.com/vi/<id>/hqdefault.jpg` for album artwork covers. | **Approved** |
| **2026-08-14** | **Featured Playlist Integration**: Tum Se Hi YouTube Radio Mix (`Cb6wuzOurPc`) | Integrated the user's YouTube radio mix featuring iconic monsoon/romantic tracks (*Tum Se Hi, Tera Hone Laga Hoon, Pee Loon, Tu Jaane Na, Phir Se Ud Chala, Kun Faya Kun, Agar Tum Saath Ho, Iktara, Ilahi, Kabira, Rimjhim Gire Sawan, O Sanam*). | **Approved** |
| **2026-08-14** | **Generated Atmospheric Background Scenes**: Custom 16:9 Indian Monsoon Windows | Generated high-res cinematic scenes capturing wet Indian roads, autos, balconies, lit apartments, and monsoon trees. | **Approved** |
| **2026-08-14** | **Time Engine**: System / Local Time Synchronized | Automatically maps the user's real-time local clock into 7 distinct atmospheric periods (*Dawn, Morning, Heavy Downpour, Golden Hour, Evening, Night Rain, Deep Sannata*). | **Approved** |
| **2026-08-14** | **Dual Audio Layer Architecture**: YouTube Stream + Web Audio Ambient Soundboard | Independent control of music vs. rain sound, city rumble, thunder, and room/fan tone using Web Audio API synthesis and low-latency audio nodes. | **Approved** |
| **2026-08-14** | **Window Physics & Condensation Layer**: Canvas droplet engine with glass wiping | Interactive glass physics allowing users to clear fogged-up glass while rain streaks run down in real time. | **Approved** |

---

## 2. Visual & Audio Design System

- **Palette**:
  - Interior: Warm amber (`#E0A13A`), teak brown (`#2C1A11`), vintage cream (`#F5E9D6`), dark ink (`#120E0C`)
  - Exterior: Slate blue (`#334155`), monsoon storm grey (`#1E293B`), deep night indigo (`#0A0F1D`), golden drizzle (`#D97706`)
- **Typography**:
  - Headings & Devanagari: *Rozha One* / *Cinzel*
  - Body & Analog Dial: *Inter* / *Space Mono*
- **Station Identity**:
  - Station: **Monsoon FM (98.7 MHz)**
  - Tagline: *"Somewhere between the rain and the radio."*

---

## 3. Implementation Status

- [x] Create `docs/architecture.md`, `docs/decision.md`, and `docs/songs.md`
- [x] Initialize Next.js 14 App Router project with TypeScript & Tailwind CSS
- [x] Generate custom cinematic background artworks
- [x] Integrate YouTube Radio mix (`Cb6wuzOurPc` - *Tum Se Hi*) with real-time album cover thumbnails
- [x] Implement Time Engine (`timeEngine.ts`) with 7-phase weather & sky gradients
- [x] Build Canvas Rain Engine (`RainCanvas.tsx`) with dynamic velocity, wind, sliding rivulets, and rare lightning
- [x] Build Glass Condensation & Wipe interaction (`GlassCondensation.tsx`)
- [x] Construct Multi-Layer Room (`Room.tsx`, `TableLamp.tsx`, `ChaiCup.tsx`, `Curtains.tsx`, `NotebookModal.tsx`)
- [x] Implement YouTube IFrame Radio Player (`RadioPlayer.tsx`, `songs.ts`, `programs.ts`, `CassetteDrawer.tsx`)
- [x] Implement Multi-channel Ambient Audio Engine (`audioEngine.ts`, `AmbientMixer.tsx`)
- [x] Add retro clock widget, live passenger/listener counter, and share controls
- [x] Performance optimizations & production build verification
