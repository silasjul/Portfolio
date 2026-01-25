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
    <footer className="relative py-16 px-8 md:px-16 lg:px-24 bg-white/40 backdrop-blur-sm border-t border-black/10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">

          {/* Navigation */}
          <div className="flex gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-black/60 hover:text-black transition-colors duration-200 text-base"
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
                className="text-black/50 hover:text-[#0077cc] transition-colors duration-200 text-sm"
                whileHover={{ y: -2 }}
              >
                {link.name}
              </motion.a>
            ))}
          </div>
          {/* Logo & Copyright */}
          <p className="text-black/40 text-sm">
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
