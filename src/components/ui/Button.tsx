"use client";

import { motion } from "framer-motion";
import React, { useState } from "react";

export default function Button({
    children,
    className,
    arrow,
}: {
    children: React.ReactNode;
    className?: string;
    arrow: boolean;
}) {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
        handleMouseMove(e);
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return (
        <motion.button
            className={
                "relative px-6 py-2 text-black rounded-full bg-secondary text-lg shadow-md flex items-center space-x-2 overflow-hidden hover:cursor-pointer " +
                className
            }
            whileHover={{ scale: 1.05, color: "white" }}
            whileTap={{ scale: 0.95 }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            transition={{ duration: 0.2 }}
        >
            {/* Mouse-following ripple overlay */}
            <motion.div
                className="absolute bg-gradient-to-r from-[#0F2027] via-[#203A43] to-[#2C5364] rounded-full pointer-events-none"
                style={{
                    left: mousePosition.x - 75,
                    top: mousePosition.y - 75,
                    width: 150,
                    height: 150,
                }}
                animate={{
                    opacity: isHovered ? 1 : 0,
                    scale: isHovered ? 3 : 0,
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            />

            {/* Button content */}
            <span className="relative z-10">{children}</span>
            {arrow && (
                <motion.svg
                    className="w-4 h-4 relative z-10"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={{
                        x: [0, 3, 0],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    variants={{
                        hover: {
                            x: 2,
                            transition: { duration: 0.2 },
                        },
                    }}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                </motion.svg>
            )}
        </motion.button>
    );
}
