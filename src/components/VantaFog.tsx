'use client';

import Script from 'next/script';
import { useEffect, useMemo, useState, useRef } from 'react';

export default function VantaFog() {
  return useMemo(
    () => (
      <div className="h-full w-full">
        <div
          className="absolute h-full w-full"
          id="vanta-fog"
        />
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.fog.min.js"
          strategy="beforeInteractive"
        />
        <Script id="script">
          {`VANTA.FOG({
      el: "#vanta-fog",
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
    });`}
        </Script>
      </div>
    ),
    []
  );
}

export function VantaParallaxBackground({ scrollspeed = 0.05 }: { scrollspeed?: number }) {
  const [hue, setHue] = useState(260);
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Slow hue rotation for color variation
  useEffect(() => {
    let direction = -1;
    const intervalId = setInterval(() => {
      setHue((prevHue) => {
        if (prevHue > 260) direction = -1;
        if (prevHue < 180) direction = 1;
        return (prevHue + direction) % 360;
      });
    }, 200);

    return () => clearInterval(intervalId);
  }, []);

  // Parallax scroll effect - background moves at 10% of scroll speed
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const parallaxOffset = scrollY * scrollspeed;

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-[-25vw] md:left-0 w-[250vw] md:w-full h-[140vh] -z-10"
      style={{
        filter: `hue-rotate(${hue}deg)`,
        transform: `translateY(-${parallaxOffset}px)`,
        willChange: 'transform',
      }}
    >
      <VantaFog />
    </div>
  );
}

// Keep the old export for backwards compatibility if needed
export function VantaBackground() {
  const [hue, setHue] = useState(260);

  useEffect(() => {
    let direction = -1;
    const intervalId = setInterval(() => {
      setHue((prevHue) => {
        if (prevHue > 260) direction = -1;
        if (prevHue < 180) direction = 1;
        return (prevHue + direction) % 360;
      });
    }, 200);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div
      className="absolute top-[0%] inset-0 -z-10"
      style={{ filter: `hue-rotate(${hue}deg)` }}
    >
      <VantaFog />
    </div>
  );
}
