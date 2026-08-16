'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GeoLandingRedirect() {
  const router = useRouter();

  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has('stay') || urlParams.has('universal')) {
        localStorage.setItem('monsoon_pref_city', 'universal');
        document.cookie = 'monsoon_pref_city=universal; path=/; max-age=2592000';
        return;
      }

      const savedPref = localStorage.getItem('monsoon_pref_city')?.toLowerCase();
      if (savedPref === 'universal') {
        return;
      }
      if (savedPref === 'kolkata') {
        router.replace('/kolkata');
        return;
      }
      if (savedPref === 'bangalore' || savedPref === 'bengaluru') {
        router.replace('/bangalore');
        return;
      }
      if (savedPref === 'mumbai') {
        router.replace('/mumbai');
        return;
      }

      // Check client location via IP geolocation lookup
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      fetch('https://ipapi.co/json/', { signal: controller.signal })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          clearTimeout(timeoutId);
          if (!data || !data.city) return;

          const city = (data.city as string).toLowerCase().trim();
          if (city.includes('kolkata') || city.includes('calcutta')) {
            localStorage.setItem('monsoon_pref_city', 'kolkata');
            document.cookie = 'monsoon_pref_city=kolkata; path=/; max-age=2592000';
            router.replace('/kolkata');
          } else if (city.includes('bangalore') || city.includes('bengaluru')) {
            localStorage.setItem('monsoon_pref_city', 'bangalore');
            document.cookie = 'monsoon_pref_city=bangalore; path=/; max-age=2592000';
            router.replace('/bangalore');
          } else if (city.includes('mumbai') || city.includes('bombay')) {
            localStorage.setItem('monsoon_pref_city', 'mumbai');
            document.cookie = 'monsoon_pref_city=mumbai; path=/; max-age=2592000';
            router.replace('/mumbai');
          } else {
            // Unmatched city -> stay on Universal "/"
            localStorage.setItem('monsoon_pref_city', 'universal');
            document.cookie = 'monsoon_pref_city=universal; path=/; max-age=2592000';
          }
        })
        .catch(() => {
          // If offline or blocked by ad-blocker, stay on "/"
        });

      return () => {
        clearTimeout(timeoutId);
        controller.abort();
      };
    } catch {
      // Graceful fallback
    }
  }, [router]);

  return null;
}
