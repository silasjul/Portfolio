"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Mail, MapPin, Clock } from "lucide-react";
import BookingWrapper from "../BookingWrapper";

export default function Contact() {
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
            <span className="text-[#0077cc] text-sm tracking-[0.3em] uppercase font-medium">
              Let&apos;s Connect
            </span>
            <h2 className="text-5xl md:text-7xl text-black mt-4 mb-8 font-[family-name:var(--font-playfair)]">
              Ready to start
              <br />
              your project?
            </h2>
            <p className="text-black/70 text-lg max-w-md mb-10 leading-relaxed">
              We&apos;re always excited to discuss new opportunities and
              challenges. Let&apos;s talk about how we can work together to
              bring your vision to life.
            </p>

            {/* Main CTA Button */}
            <BookingWrapper theme="light">
              <motion.div
                className="group inline-flex items-center gap-4 px-8 py-5 bg-black text-white rounded-full shadow-md hover:bg-white hover:text-black text-lg font-base transition-colors duration-300 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <span>Get In Touch</span>
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
                label="Email"
                value="contact@silab.dk"
                href="mailto:contact@silab.dk"
                delay={0.3}
                isInView={isInView}
              />
              <ContactCard
                icon={MapPin}
                label="Location"
                value="Available Worldwide"
                delay={0.4}
                isInView={isInView}
              />
              <ContactCard
                icon={Clock}
                label="Response Time"
                value="Within 24 hours"
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
      className="group flex items-center gap-6 p-6 rounded-2xl bg-white/40 backdrop-blur-sm border border-black/10 hover:border-[#0077cc]/30 transition-colors duration-300"
      initial={{ opacity: 0, x: 30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="w-14 h-14 rounded-xl bg-[#0077cc]/10 flex items-center justify-center group-hover:bg-[#0077cc]/20 transition-colors duration-300">
        <Icon className="w-6 h-6 text-[#0077cc]" />
      </div>
      <div>
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
