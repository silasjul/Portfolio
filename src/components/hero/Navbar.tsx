"use client"

import { motion, Transition, useInView } from 'framer-motion';
import Image from 'next/image';
import { useRef, useEffect, useState, useLayoutEffect } from 'react';
import GetInTouchCTA from '../ui/GetInTouchCTA';
import { useLenis } from 'lenis/react';
import BookingWrapper from '../BookingWrapper';

const transition: Transition = { duration: 1.3, ease: 'anticipate', delay: .3 }

type NavDict = {
  services: string;
  works: string;
  about: string;
  getInTouch: string;
}

// Hook to track which section is in view
function useSectionInView(sectionId: string) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    ref.current = document.getElementById(sectionId);
  }, [sectionId]);

  const isInView = useInView(ref, {
    margin: "-50% 0px -50% 0px",
    amount: 0
  });

  return isInView;
}

export default function Navbar({ dict }: { dict: NavDict }) {
  const lenis = useLenis();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);

  // Track each section's visibility
  const servicesInView = useSectionInView('services');
  const worksInView = useSectionInView('works');
  const aboutInView = useSectionInView('about');

  // Update active section based on which is in view
  useEffect(() => {
    if (isScrolling) return;

    if (servicesInView) setActiveSection('services');
    else if (worksInView) setActiveSection('works');
    else if (aboutInView) setActiveSection('about');
    else setActiveSection(null);
  }, [servicesInView, worksInView, aboutInView, isScrolling]);

  const scrollTo = (target: string) => {
    const targetSection = target.replace('#', '');
    setActiveSection(targetSection);

    if (lenis) {
      setIsScrolling(true);

      // Safety timeout in case onComplete doesn't fire
      const timeout = setTimeout(() => setIsScrolling(false), 500);

      lenis.scrollTo(target, {
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        onComplete: () => {
          clearTimeout(timeout);
          setIsScrolling(false);
        }
      });
    }
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
        <NavLinks scrollTo={scrollTo} dict={dict} activeSection={activeSection} />
      </div>
      <div className="flex items-center gap-4">
        <CTA dict={dict} />
      </div>
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
        className="rounded-md w-15 opacity-90"
        src={'/logo.png'}
        alt={'logo'}
        width={735}
        height={485}
      />
    </motion.div>
  )
}

function CTA({ dict }: { dict: NavDict }) {
  return (
    <BookingWrapper theme="light">
      <motion.div
        className="inline-block"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={transition}
      >
        <GetInTouchCTA arrow={true}>{dict.getInTouch}</GetInTouchCTA>
      </motion.div>
    </BookingWrapper>
  )
}

const sections = ['services', 'works', 'about'] as const;

function NavLinks({
  scrollTo,
  dict,
  activeSection
}: {
  scrollTo: (target: string) => void,
  dict: NavDict,
  activeSection: string | null
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  // Measure the active link's position
  useLayoutEffect(() => {
    if (activeSection && linkRefs.current[activeSection] && containerRef.current) {
      const link = linkRefs.current[activeSection]!;
      const container = containerRef.current;

      setIndicatorStyle({
        left: link.offsetLeft,
        width: link.offsetWidth
      });
    }
  }, [activeSection, dict]);

  return (
    <motion.div
      ref={containerRef}
      className="flex rounded-full bg-secondary p-2 px-2 shadow relative"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={transition}
    >
      {/* Single indicator - never unmounts, just animates opacity */}
      <motion.div
        className="absolute top-2 bottom-2 bg-primary/20 rounded-full"
        animate={{
          opacity: activeSection ? 1 : 0,
          left: indicatorStyle.left,
          width: indicatorStyle.width
        }}
        transition={{
          opacity: { duration: 0.2 },
          left: { type: "spring", stiffness: 300, damping: 35, mass: 1 },
          width: { type: "spring", stiffness: 300, damping: 35, mass: 1 }
        }}
      />

      {sections.map((section) => (
        <a
          key={section}
          ref={(el) => { linkRefs.current[section] = el; }}
          href={`#${section}`}
          onClick={(e) => { e.preventDefault(); scrollTo(`#${section}`); }}
          className="tracking-wide relative cursor-pointer text-lg z-10 px-4 py-1 group"
        >
          {dict[section]}
          <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 bg-primary/50 rounded-full transition-all duration-200 w-0 group-hover:w-6" />
        </a>
      ))}
    </motion.div>
  )
}
