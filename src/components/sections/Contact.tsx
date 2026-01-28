"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Mail, MapPin, Clock } from "lucide-react";
import BookingWrapper from "../BookingWrapper";

type ContactDict = {
  label: string;
  title: string;
  titleLine2: string;
  description: string;
  cta: string;
  emailLabel: string;
  email: string;
  locationLabel: string;
  location: string;
  responseLabel: string;
  response: string;
}

export default function Contact({ dict }: { dict: ContactDict }) {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });

  return (
    <section
      ref={containerRef}
      className="relative py-32 px-8 md:px-16 lg:px-24 bg-transparent overflow-hidden"
    >

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left Column - CTA */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <span className="inline-block text-[#0077cc] text-sm tracking-[0.3em] uppercase font-medium bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full">
              {dict.label}
            </span>
            <h2 className="text-5xl md:text-7xl text-black mt-4 mb-8 font-(family-name:--font-playfair)">
              {dict.title}
              <br />
              {dict.titleLine2}
            </h2>
            <p className="text-black/70 text-lg max-w-md mb-10 leading-relaxed">
              {dict.description}
            </p>

            {/* Main CTA Button */}
            <BookingWrapper theme="light">
              <motion.div
                className="group inline-flex items-center gap-4 px-8 py-5 bg-black text-white rounded-full shadow-md hover:bg-white hover:text-black text-lg font-base transition-colors duration-300 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <span>{dict.cta}</span>
                <motion.div
                  className="w-10 h-10 rounded-full bg-white/10 group-hover:bg-black/10 flex items-center justify-center transition-colors duration-300"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </motion.div>
            </BookingWrapper>
          </motion.div>

          {/* Right Column - Contact Info */}
          <div className="flex items-center">
            <motion.div
              className="space-y-8 w-full"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.8,
                delay: 0.2,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              {/* Contact Cards */}
              <ContactCard
                icon={Mail}
                label={dict.emailLabel}
                value={dict.email}
                href="mailto:contact@silab.dk"
                delay={0.3}
                isInView={isInView}
              />
              <ContactCard
                icon={MapPin}
                label={dict.locationLabel}
                value={dict.location}
                delay={0.4}
                isInView={isInView}
              />
              <ContactCard
                icon={Clock}
                label={dict.responseLabel}
                value={dict.response}
                delay={0.5}
                isInView={isInView}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactCard({
  icon: Icon,
  label,
  value,
  href,
  delay,
  isInView,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  href?: string;
  delay: number;
  isInView: boolean;
}) {
  const content = (
    <motion.div
      className="group flex items-center gap-6 p-6 rounded-[20px]  transition-colors duration-300 overflow-hidden relative"
      initial={{ opacity: 0, x: 30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
      style={{
        background: "rgba(255, 255, 255, 0.21)",
        backdropFilter: "blur(17px)",
        WebkitBackdropFilter: "blur(17px)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.5), inset 0 -1px 0 rgba(255, 255, 255, 0.1), inset 0 0 12px 6px rgba(255, 255, 255, 0.15)",
      }}
    >
      {/* Top edge highlight */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-[1px]"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent)",
        }}
      />
      {/* Left edge highlight */}
      <div
        className="pointer-events-none absolute top-0 left-0 w-[1px] h-full"
        style={{
          background: "linear-gradient(180deg, rgba(255, 255, 255, 0.8), transparent, rgba(255, 255, 255, 0.3))",
        }}
      />
      <div className="relative z-10 w-14 h-14 rounded-xl bg-[#0077cc]/10 flex items-center justify-center group-hover:bg-[#0077cc]/20 transition-colors duration-300">
        <Icon className="w-6 h-6 text-[#0077cc]" />
      </div>
      <div className="relative z-10">
        <span className="text-black/60 text-sm uppercase tracking-wider block font-medium">
          {label}
        </span>
        <span className="text-black text-xl">{value}</span>
      </div>
    </motion.div>
  );

  if (href) {
    return (
      <a href={href} className="block hover:no-underline">
        {content}
      </a>
    );
  }

  return content;
}
