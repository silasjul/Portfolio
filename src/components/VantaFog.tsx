"use client";

import Script from "next/script";

export default function VantaFog() {
    return (
        <div className="h-screen bg-linear-to-b from-white to-25% to-transparent">
            <div
                className="absolute -z-1 w-screen h-screen"
                id="vanta-fog"
            ></div>
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
    );
}
