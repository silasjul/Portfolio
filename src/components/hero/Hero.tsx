"use client";

import { motion } from "framer-motion";
import Navbar from "./Navbar";
import { VantaFogHueFilter } from "./VantaFog";

export default function Hero() {

   return (
      <div>
         <Navbar />
         <div className="relative min-h-screen overflow-x-hidden">
            <motion.h1 className="text-8xl sm:text-8xl xl:text-9xl absolute bottom-[33%] ml-8 select-none">
               <motion.div
                  initial={{ opacity: 0, y: 30, color: "#35a9ff" }}
                  animate={{ opacity: 1, y: 0, color: "#000000" }}
                  transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1], delay: .2 }}
               >
                  <span className="hidden md:block">Custom </span>Software Solutions
               </motion.div>
               <motion.div
                  initial={{ opacity: 0, y: 30, color: "#35a9ff" }}
                  animate={{ opacity: 1, y: 0, color: "#000000" }}
                  transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1], delay: 0.35 }}
               >
                  for Your Business.
               </motion.div>
            </motion.h1>
         </div>
         {/* Background */}
         <div>
            <VantaFogHueFilter />
         </div>
      </div>
   );
}
