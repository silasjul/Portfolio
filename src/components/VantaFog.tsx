'use client';

import Script from 'next/script';
import { useMemo } from 'react';

export default function VantaFog() {

    return useMemo(
        () => (
            <div className="h-[${height}] w-full">
                <div
                    className={`absolute -z-1 w-screen h-[120vh]`}
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

export function VantaFogHueFilter({ hue }: { hue: number }) {
    return (
        <div
            className="absolute top-[0%] inset-0 -z-10"
            style={{ filter: `hue-rotate(${hue}deg)` }}>
            <VantaFog />
        </div>
    );
}
