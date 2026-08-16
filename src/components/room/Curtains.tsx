'use client';

import React from 'react';

export default function Curtains() {
  return (
    <div className="absolute inset-0 pointer-events-none z-22 overflow-hidden select-none">
      {/* 1. Realistic Antique Brass Curtain Rod Header with Finials */}
      <div className="absolute top-0 inset-x-0 h-6 sm:h-7 z-25 flex items-center justify-between px-2 sm:px-6">
        {/* Left Finial */}
        <div className="flex items-center -ml-2 sm:-ml-4 drop-shadow-[0_4px_8px_rgba(0,0,0,0.85)]">
          <div className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 rounded-full bg-gradient-to-br from-[#d4af37] via-[#99701d] to-[#452b0c] border border-[#f5df88]/30" />
          <div className="w-1.5 h-2.5 sm:w-2 sm:h-3 bg-[#2e1c0d] rounded-r border-y border-[#704d1f]" />
        </div>

        {/* Turned Antique Brass Rod Pole */}
        <div className="relative w-full h-1.5 sm:h-2 mx-1 rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.9)] bg-gradient-to-b from-[#8a683e] via-[#d4af37] to-[#241508] border-y border-[#f0d47b]/20">
          <div className="absolute inset-x-0 top-0 h-[1px] bg-white/30 rounded-full" />
        </div>

        {/* Right Finial */}
        <div className="flex items-center -mr-2 sm:-mr-4 drop-shadow-[0_4px_8px_rgba(0,0,0,0.85)]">
          <div className="w-1.5 h-2.5 sm:w-2 sm:h-3 bg-[#2e1c0d] rounded-l border-y border-[#704d1f]" />
          <div className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 rounded-full bg-gradient-to-bl from-[#d4af37] via-[#99701d] to-[#452b0c] border border-[#f5df88]/30" />
        </div>
      </div>

      {/* Hanging Eyelet Rings */}
      <div className="absolute top-1.5 inset-x-0 flex justify-between px-6 sm:px-12 z-24 pointer-events-none opacity-85">
        <div className="flex gap-3 sm:gap-6">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={`ring-l-${i}`}
              className="w-2.5 h-4 sm:w-3 sm:h-5 rounded-full border-2 border-[#b89430] bg-transparent shadow-sm -mt-0.5"
            />
          ))}
        </div>
        <div className="flex gap-3 sm:gap-6">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={`ring-r-${i}`}
              className="w-2.5 h-4 sm:w-3 sm:h-5 rounded-full border-2 border-[#b89430] bg-transparent shadow-sm -mt-0.5"
            />
          ))}
        </div>
      </div>

      {/* 2. Left Curtain Panel (Realistic Lightweight Linen Fabric) */}
      <div className="absolute top-4 left-0 w-12 sm:w-36 md:w-48 h-full origin-top animate-curtain-left z-22">
        {/* Soft cast drop shadow on the window behind it */}
        <div className="absolute inset-0 w-full h-full bg-black/40 blur-lg -translate-x-2 pointer-events-none" />

        {/* Real Volumetric Pinch-Pleated Fabric Column */}
        <div
          className="relative w-full h-full"
          style={{
            background: `
              linear-gradient(to right,
                rgba(238, 230, 220, 0.94) 0%,
                rgba(165, 148, 132, 0.6) 10%,
                rgba(245, 238, 228, 0.96) 22%,
                rgba(150, 132, 116, 0.55) 34%,
                rgba(240, 232, 222, 0.92) 46%,
                rgba(142, 124, 108, 0.5) 58%,
                rgba(235, 225, 214, 0.85) 70%,
                rgba(130, 112, 96, 0.4) 82%,
                rgba(215, 202, 188, 0.65) 92%,
                rgba(110, 92, 78, 0.05) 100%
              )
            `,
            boxShadow: 'inset -8px 0 18px rgba(0, 0, 0, 0.45), 6px 0 20px rgba(0, 0, 0, 0.5)',
            maskImage: 'linear-gradient(to bottom, black 0%, black 85%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 85%, transparent 100%)',
          }}
        >
          {/* Subtle Organic Weave & Vertical Slub Creases */}
          <div className="w-full h-full opacity-20 bg-[repeating-linear-gradient(90deg,#20140c,#20140c_1px,transparent_1px,transparent_3.5px)]" />

          {/* Gentle Translucent Exterior Daylight Diffuse Wash */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none" />

          {/* Stitched Bottom Hem Line */}
          <div className="absolute bottom-20 inset-x-0 h-0.5 border-b border-[#a89482]/40 opacity-75" />
        </div>

        {/* Soft Linen Tieback Sash at Mid-Height */}
        <div className="absolute top-1/2 -left-1 w-10 sm:w-36 h-4 -translate-y-1/2 pointer-events-none flex items-center justify-end pr-1 z-23">
          <div className="w-full h-1.5 rounded-full bg-gradient-to-r from-transparent via-[#704d2c] to-[#b38928] shadow-sm opacity-80 border-y border-[#d4af37]/20" />
          <div className="w-2 sm:w-2.5 h-2.5 sm:h-3 rounded-full bg-gradient-to-b from-[#edd074] to-[#6d4a13] border border-[#f5df88]/60 shadow-md -ml-1 flex-shrink-0" />
        </div>
      </div>

      {/* 3. Right Curtain Panel (Realistic Lightweight Linen Fabric) */}
      <div className="absolute top-4 right-0 w-12 sm:w-36 md:w-48 h-full origin-top animate-curtain-right z-22">
        {/* Soft cast drop shadow on the window behind it */}
        <div className="absolute inset-0 w-full h-full bg-black/40 blur-lg translate-x-2 pointer-events-none" />

        {/* Real Volumetric Pinch-Pleated Fabric Column */}
        <div
          className="relative w-full h-full"
          style={{
            background: `
              linear-gradient(to left,
                rgba(238, 230, 220, 0.94) 0%,
                rgba(165, 148, 132, 0.6) 10%,
                rgba(245, 238, 228, 0.96) 22%,
                rgba(150, 132, 116, 0.55) 34%,
                rgba(240, 232, 222, 0.92) 46%,
                rgba(142, 124, 108, 0.5) 58%,
                rgba(235, 225, 214, 0.85) 70%,
                rgba(130, 112, 96, 0.4) 82%,
                rgba(215, 202, 188, 0.65) 92%,
                rgba(110, 92, 78, 0.05) 100%
              )
            `,
            boxShadow: 'inset 8px 0 18px rgba(0, 0, 0, 0.45), -6px 0 20px rgba(0, 0, 0, 0.5)',
            maskImage: 'linear-gradient(to bottom, black 0%, black 85%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 85%, transparent 100%)',
          }}
        >
          {/* Subtle Organic Weave & Vertical Slub Creases */}
          <div className="w-full h-full opacity-20 bg-[repeating-linear-gradient(90deg,#20140c,#20140c_1px,transparent_1px,transparent_3.5px)]" />

          {/* Gentle Translucent Exterior Daylight Diffuse Wash */}
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/[0.08] to-transparent pointer-events-none" />

          {/* Stitched Bottom Hem Line */}
          <div className="absolute bottom-20 inset-x-0 h-0.5 border-b border-[#a89482]/40 opacity-75" />
        </div>

        {/* Soft Linen Tieback Sash at Mid-Height */}
        <div className="absolute top-1/2 -right-1 w-10 sm:w-36 h-4 -translate-y-1/2 pointer-events-none flex items-center justify-start pl-1 z-23">
          <div className="w-2 sm:w-2.5 h-2.5 sm:h-3 rounded-full bg-gradient-to-b from-[#edd074] to-[#6d4a13] border border-[#f5df88]/60 shadow-md -mr-1 flex-shrink-0" />
          <div className="w-full h-1.5 rounded-full bg-gradient-to-l from-transparent via-[#704d2c] to-[#b38928] shadow-sm opacity-80 border-y border-[#d4af37]/20" />
        </div>
      </div>
    </div>
  );
}
