'use client';

import { motion } from 'framer-motion';
import React, { useState } from 'react';

export default function GetInTouchCTA({
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

  const handleInteractionStart = (e: React.PointerEvent<HTMLButtonElement>) => {
    // Prevent a tap on mobile from triggering the hover state
    if (e.pointerType === 'mouse') {
      setIsHovered(true);
    } else {
      // This is for touch devices, a tap is not a hover.
      setIsHovered(false);
    }

    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleInteractionEnd = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType === 'mouse') {
      setIsHovered(false);
    }
  };

  return (
    <motion.button
      className={
        'relative px-6 py-2 text-black rounded-full bg-secondary text-lg shadow-md flex items-center space-x-2 overflow-hidden hover:cursor-pointer ' +
        className
      }
      whileHover={{ scale: 1.05, color: 'white' }}
      whileTap={{ scale: 0.95 }}
      onPointerEnter={handleInteractionStart}
      onPointerLeave={handleInteractionEnd}
      onMouseMove={(e) => {
        if (isHovered) {
          const rect = e.currentTarget.getBoundingClientRect();
          setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          });
        }
      }}
      transition={{ duration: 0.2 }}
    >
      {/* Mouse-following ripple overlay */}
      <motion.div
        className="absolute bg-black rounded-full pointer-events-none opacity-0"
        style={{
          left: mousePosition.x - 62,
          top: mousePosition.y - 62,
          width: 125,
          height: 125,
        }}
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 3 : 0,
        }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
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
            ease: 'easeInOut',
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