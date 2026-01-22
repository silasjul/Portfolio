'use client';

import Script from 'next/script';
import { useEffect, useMemo, useState } from 'react';

export default function VantaFog() {

  return useMemo(
    () => (
      <div className="h-full w-full">
        <div
          className={`absolute -z-1 w-screen h-full`}
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

export function VantaBackground() {
  /* Cool hue filter */
  const [hue, setHue] = useState(260);

  useEffect(() => {
    let direction = -1
    const intervalId = setInterval(() => {
      setHue((prevHue) => {
        if (prevHue > 260) direction = -1;
        if (prevHue < 180) direction = 1;
        console.log(prevHue)
        return (prevHue + direction) % 360;
      })
    }, 200);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div
      className="absolute top-[0%] inset-0 -z-10"
      style={{ filter: `hue-rotate(${hue}deg)` }}>
      <VantaFog />
    </div>
  );
}
