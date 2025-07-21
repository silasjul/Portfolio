"use client";
import React from "react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";

export default function Hero() {
    return (
        <div className="relative min-h-screen overflow-hidden ml">
            <Navbar />
            <motion.h1 className="text-9xl mt-[10%] ml-8">
                Optimized websites,
                <br />
                powerful automations.
            </motion.h1>
        </div>
    );
}
