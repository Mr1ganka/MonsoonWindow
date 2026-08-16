# Monsoon Window 🌧️📻

> **"Somewhere between the rain and the radio."**  
> An atmospheric, 24-hour time-responsive digital sanctuary set inside an Indian apartment during monsoon season, overlooking a rainy city window with curated music and ambient soundscapes.

[![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Web Audio API](https://img.shields.io/badge/Web_Audio_API-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

---

## ✨ Features & Experiences

- **🌆 Multi-City Monsoon Sceneries**: Seamlessly switch between iconic monsoon atmospheres:
  - **Bengaluru** (Chilly drizzle over gulmohar trees and city skyline)
  - **Kolkata** (Nostalgic vintage colonial balconies with tram bell echoes)
  - **Mumbai** (Marine Drive storm clouds and high-rise sea breeze)
- **🕒 24-Hour Responsive Time Engine**: The sky lighting, rain intensity, city activity, and radio broadcasts dynamically sync with your local clock across 7 periods:
  - *Dawn*, *Morning Overcast*, *Afternoon Downpour*, *Rainy Golden Hour*, *Evening Glow*, *Night Rain*, and *Deep Sannata*.
  - Includes an intuitive **Time Scrubber** to freely travel through any mood.
- **🎨 Interactive Visuals & Canvas Shaders**:
  - **Procedural Rain Canvas**: Dynamic physics-based rain droplets, velocity vectors, and wind shear.
  - **Glass Condensation**: Interactive window pane where dragging your cursor or finger wipes condensation away to reveal the clear city view.
  - **Lighting Atmosphere**: Reactive incandescent brass desk lamp casting dynamic amber ambient room glow.
- **📻 Monsoon FM 98.7 & Analog Cassette Player**:
  - Vintage radio tuner with frequency dial, animated audio visualizer equalizer, and cassette drawer.
  - Curated nostalgic indie, classical, and monsoon lo-fi track library.
- **🎚️ Multi-Channel Ambient Soundboard**:
  - Independent Web Audio API mixers for **Rain Intensity**, **Distant Thunder**, **City Traffic Rumble**, and **Room / Ceiling Fan Hum**.
- **☕ Interactive Room Artifacts**:
  - Steaming ceramic chai cup with particle physics.
  - Handwritten monsoon journal & poetry notebook in English and Hindi.

---

## 🛠️ Tech Stack & Architecture

- **Core Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server Components & Dynamic Route Handlers)
- **Language**: TypeScript with strict typing
- **Styling**: Tailwind CSS, CSS variables, backdrop filters, and custom animation keyframes
- **Graphics Engine**: HTML5 2D Canvas for rain particle physics & procedural condensation rendering
- **Audio Engineering**: Web Audio API (gain nodes, convolver filters, multi-track gain mixers) + YouTube IFrame API audio stream sync

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js 18.17+ or later
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/Mr1ganka/MonsoonWindow.git
cd MonsoonWindow

# Install dependencies
npm install

# Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to experience the sanctuary.

---

## 📁 Project Structure

```
MonsoonWindow/
├── src/
│   ├── app/                    # Next.js 14 App Router pages & city routes (bangalore, kolkata, mumbai)
│   ├── components/
│   │   ├── scene/              # MonsoonWindow, SceneRenderer, RainCanvas, GlassCondensation
│   │   ├── player/             # RadioPlayer, CassetteDrawer, Equalizer, AmbientMixer
│   │   ├── room/               # Room layout, Curtains, NotebookModal
│   │   └── ui/                 # Header, GeoLandingRedirect, AboutModal
│   ├── data/                   # Scenes, songs, radio programs, notebook poetry
│   ├── lib/                    # Web Audio API engine, 24-hour time engine
│   └── types/                  # TypeScript interface definitions
├── public/
│   └── scenes/                 # City scene backgrounds across time periods
└── docs/                       # Architecture diagrams, decision logs, and sound designs
```

---

## 👤 Author
**Mriganka Das**
- GitHub: [@Mr1ganka](https://github.com/Mr1ganka)
- LinkedIn: [in/das-mriganka](https://linkedin.com/in/das-mriganka)
- Email: [mrigankadas1712@gmail.com](mailto:mrigankadas1712@gmail.com)
