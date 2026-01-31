"use client";

import { motion } from "framer-motion";
import { useLenis } from 'lenis/react';

const socialLinks = [
  { name: "LinkedIn", href: "https://www.linkedin.com/company/silab-studio/about" },
];

type FooterDict = {
  copyright: string;
}

type NavDict = {
  services: string;
  works: string;
  about: string;
}

export default function Footer({ footerDict, navDict }: { footerDict: FooterDict, navDict: NavDict }) {
  const lenis = useLenis();

  const navLinks = [
    { name: navDict.works, href: "#works" },
    { name: navDict.services, href: "#services" },
    { name: navDict.about, href: "#about" },
  ];

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    lenis?.scrollTo(href, {
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) // easeOutExpo
    });
  };

  return (
    <footer className="relative py-10 md:py-16 px-5 md:px-16 lg:px-24 bg-white/40 backdrop-blur-sm border-t border-black/10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-10">

          {/* Navigation */}
          <div className="flex gap-6 md:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleSmoothScroll(e, link.href)}
                className="text-black/70 hover:text-black transition-colors duration-200 text-base"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Social Links */}
          <div className="flex gap-6">
            {socialLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.href}
                target="_blank"
                className="text-black/70 hover:text-black transition-colors duration-200 text-sm"
              >
                {link.name}
              </motion.a>
            ))}
          </div>
          {/* Logo & Copyright */}
          <p className="text-black/60 text-sm">
            {footerDict.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
