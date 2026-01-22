"use client";

import { motion } from "framer-motion";

const socialLinks = [
  { name: "LinkedIn", href: "#" },
  { name: "GitHub", href: "#" },
  { name: "Twitter", href: "#" },
];

const navLinks = [
  { name: "Works", href: "#works" },
  { name: "Services", href: "#services" },
  { name: "About", href: "#about" },
];

export default function Footer() {
  return (
    <footer className="relative py-16 px-8 md:px-16 lg:px-24 bg-[#0a0a0a] border-t border-white/[0.05]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">

          {/* Navigation */}
          <div className="flex gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-white/60 hover:text-white transition-colors duration-200 text-base"
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
                className="text-white/50 hover:text-[#35a9ff] transition-colors duration-200 text-sm"
                whileHover={{ y: -2 }}
              >
                {link.name}
              </motion.a>
            ))}
          </div>
          {/* Logo & Copyright */}
          <p className="text-white/30 text-sm">
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
