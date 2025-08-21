"use client"

import { motion, Transition } from 'framer-motion';
import { Menu } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import GetInTouchCTA from '../ui/GetInTouchCTA';

const transition: Transition = { duration: 1.3, ease: 'anticipate', delay: .3 }

export default function Navbar() {
   const [isOpen, setIsOpen] = useState(false);

   return (
      <motion.div
         className="sticky top-8 my-8 mx-8 flex justify-between items-center text-[1.4rem] z-10"
         initial={{ opacity: 0, y: -20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={transition}
      >
         <Logo />
         <div className='hidden md:block'>
            <NavLinks />
         </div>
         <CTA />
         <div className='md:hidden block'>
            <HamburgerMenu />
         </div>
      </motion.div>
   );
}

function HamburgerMenu() {
   return (
      <div>
         <Menu />
      </div>
   )
}

function Logo() {
   return (
      <motion.div
         className="flex items-center cursor-pointer gap-2"
         initial={{ opacity: 0, x: -20 }}
         animate={{ opacity: 1, x: 0 }}
         transition={transition}
      >
         <Image
            className="rounded-md w-15"
            src={'/logo.png'}
            alt={'logo'}
            width={735}
            height={485}
         />
      </motion.div>
   )
}

function CTA() {
   return (
      <motion.div
         className="inline-block"
         initial={{ opacity: 0, x: 20 }}
         animate={{ opacity: 1, x: 0 }}
         transition={transition}
      >
         <GetInTouchCTA arrow={true}>Get In Touch</GetInTouchCTA>
      </motion.div>
   )
}

function NavLinks() {
   return (
      <motion.div
         className="flex gap-12"
         initial={{ opacity: 0, y: -10 }}
         animate={{ opacity: 1, y: 0 }}
         transition={transition}
      >
         <a
            href="#works"
            className="tracking-wide transition-colors duration-200 relative group"
         >
            <span className="flex gap-0.5">
               <span className="text-sm">(1)</span>
               Works
            </span>
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-black transition-all duration-300 group-hover:w-full"></span>
         </a>
         <a
            href="#services"
            className="tracking-wide transition-colors duration-200 relative group"
         >
            <span className="flex gap-0.5">
               <span className="text-sm">(2)</span>
               Services
            </span>

            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-black transition-all duration-300 group-hover:w-full"></span>
         </a>
         <a
            href="#about"
            className="tracking-wide transition-colors duration-200 relative group"
         >
            <span className="flex gap-0.5">
               <span className="text-sm">(3)</span>
               About
            </span>

            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-black transition-all duration-300 group-hover:w-full"></span>
         </a>
      </motion.div>
   )
}