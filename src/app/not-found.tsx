import Link from 'next/link';
import { CloudRain, Home, Radio } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="relative min-h-screen w-full bg-[#0c0a09] text-white flex flex-col items-center justify-center p-6 select-none overflow-hidden font-sans">
      {/* Subtle Background Radial Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,119,6,0.15)_0%,rgba(12,10,9,0.95)_70%)] pointer-events-none" />

      {/* Decorative Rain Atmosphere */}
      <div className="relative z-10 max-w-md w-full text-center space-y-6 bg-[#140e0b]/90 border border-white/10 p-8 rounded-3xl backdrop-blur-xl shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
          <CloudRain className="w-8 h-8 animate-pulse" />
        </div>

        <div className="space-y-2">
          <div className="inline-block bg-amber-500/15 text-amber-300 text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-widest">
            404 • Page Lost in the Fog
          </div>
          <h1 className="text-2xl font-bold font-serif text-white">
            Lost in the Monsoon Rain
          </h1>
          <p className="text-xs text-white/60 leading-relaxed font-mono">
            The page you are looking for got washed away or does not exist. Tune back into the live station.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(245,158,11,0.4)] active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>Return to Monsoon Window (होम स्क्रीन)</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
