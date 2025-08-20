"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { VantaFogHueFilter } from "./VantaFog";

export default function Hero() {
    const [hue, setHue] = useState(0);

    const changeHue = () => setHue((prev) => prev + 1);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setHue(prevHue => (prevHue + 1) % 360);
        }, 16);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div onClick={changeHue}>
            <Navbar />
            <div className="relative min-h-screen overflow-x-hidden">
                <motion.h1 className="text-7xl sm:text-8xl lg:text-9xl mt-[20%] mb-[8%] ml-8 select-none">
                    <motion.div
                        initial={{ opacity: 0, y: 30, color: "#ff6600" }}
                        animate={{ opacity: 1, y: 0, color: "#000000" }}
                        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: .2 }}
                    >
                        Custom Software Solutions
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 30, color: "#ff6600" }}
                        animate={{ opacity: 1, y: 0, color: "#000000" }}
                        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.35 }}
                    >
                        for Your Business.
                    </motion.div>
                </motion.h1>
            </div>
            <VantaFogHueFilter hue={hue} />
        </div>
    );
}
