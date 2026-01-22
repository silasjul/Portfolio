"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Mail, MapPin, Clock } from "lucide-react";

export default function Contact() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });

  return (
    <section
      ref={containerRef}
      className="relative py-32 px-8 md:px-16 lg:px-24 bg-[#fafafa] overflow-hidden"
    >
      {/* Background accent */}
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#35a9ff]/5 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left Column - CTA */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <span className="text-[#35a9ff] text-sm tracking-[0.3em] uppercase font-medium">
              Let&apos;s Connect
            </span>
            <h2 className="text-5xl md:text-7xl text-black mt-4 mb-8 font-[family-name:var(--font-playfair)]">
              Ready to start
              <br />
              your project?
            </h2>
            <p className="text-black/50 text-lg max-w-md mb-10 leading-relaxed">
              I&apos;m always excited to discuss new opportunities and
              challenges. Let&apos;s talk about how we can work together to
              bring your vision to life.
            </p>

            {/* Main CTA Button */}
            <motion.a
              href="mailto:hello@example.com"
              className="group inline-flex items-center gap-4 px-8 py-5 bg-black text-white rounded-full text-lg font-medium hover:bg-[#35a9ff] transition-colors duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Get In Touch</span>
              <motion.div
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </motion.a>
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
                value="hello@silab.dev"
                href="mailto:hello@silab.dev"
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
      className="group flex items-center gap-6 p-6 rounded-2xl bg-black/[0.02] border border-black/[0.05] hover:border-[#35a9ff]/30 transition-colors duration-300"
      initial={{ opacity: 0, x: 30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="w-14 h-14 rounded-xl bg-[#35a9ff]/10 flex items-center justify-center group-hover:bg-[#35a9ff]/20 transition-colors duration-300">
        <Icon className="w-6 h-6 text-[#35a9ff]" />
      </div>
      <div>
        <span className="text-black/40 text-sm uppercase tracking-wider block">
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
