"use client"

import { motion, Transition } from 'framer-motion';
import { Menu } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import GetInTouchCTA from '../ui/GetInTouchCTA';
import { useLenis } from 'lenis/react';

const transition: Transition = { duration: 1.3, ease: 'anticipate', delay: .3 }

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const lenis = useLenis();

  const scrollTo = (target: string) => {
    lenis?.scrollTo(target, {
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) // easeOutExpo
    });
  };

  return (
    <motion.div
      className="fixed py-8 px-8 w-full flex justify-between items-center text-[1.4rem] z-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={transition}
    >
      <Logo scrollTo={scrollTo} />
      <div className='hidden md:block'>
        <NavLinks scrollTo={scrollTo} />
      </div>
      <CTA />
    </motion.div>
  );
}

function Logo({ scrollTo }: { scrollTo: (target: string) => void }) {
  return (
    <motion.div
      className="flex items-center cursor-pointer gap-2"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={transition}
      onClick={() => scrollTo('top')}
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

function NavLinks({ scrollTo }: { scrollTo: (target: string) => void }) {
  return (
    <motion.div
      className="flex gap-12"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={transition}
    >
      <WorkLink text={'Works'} href={'#works'} number={1} scrollTo={scrollTo} />
      <WorkLink text={'Services'} href={'#services'} number={2} scrollTo={scrollTo} />
      <WorkLink text={'About'} href={'#about'} number={3} scrollTo={scrollTo} />
    </motion.div>
  )
}

function WorkLink({
  text,
  href,
  number,
  scrollTo
}: {
  text: string;
  href: string;
  number: number;
  scrollTo: (target: string) => void;
}) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollTo(href);
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className="tracking-wide transition-colors duration-200 relative group cursor-pointer"
    >
      <span className="flex gap-0.5">
        <span className="text-sm">({number})</span>
        {text}
      </span>
      <span className="absolute bottom-0 left-0 w-0 h-px bg-black transition-all duration-300 group-hover:w-full"></span>
    </a>
  )
}