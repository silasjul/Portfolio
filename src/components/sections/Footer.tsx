"use client";

import { motion } from "framer-motion";
import { useLenis } from 'lenis/react';
import { useLanguage } from "@/contexts/LanguageContext";

const socialLinks = [
  { name: "LinkedIn", href: "https://www.linkedin.com/company/silab-studio/about" },
];

export default function Footer() {
  const lenis = useLenis();
  const { t } = useLanguage();

  const navLinks = [
    { name: t('nav.works'), href: "#works" },
    { name: t('nav.services'), href: "#services" },
    { name: t('nav.about'), href: "#about" },
  ];

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    lenis?.scrollTo(href, {
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) // easeOutExpo
    });
  };

  return (
    <footer className="relative py-16 px-8 md:px-16 lg:px-24 bg-white/40 backdrop-blur-sm border-t border-black/10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">

          {/* Navigation */}
          <div className="flex gap-8">
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
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}
