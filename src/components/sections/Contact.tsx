"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { sendEmail } from "@/actions/sendEmail";

type Lang = "en" | "da";

type ContactDict = {
  label: string;
  title: string;
  titleLine2: string;
  description: string;
  form: {
    name: string;
    namePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    message: string;
    messagePlaceholder: string;
    submit: string;
    sending: string;
    successTitle: string;
    successMessage: string;
    errorTitle: string;
    errorMessage: string;
    nameRequired: string;
    emailRequired: string;
    emailInvalid: string;
    messageRequired: string;
    messageMin: string;
    rateLimitTitle: string;
    rateLimitMessage: string;
  };
};

const createFormSchema = (dict: ContactDict["form"]) =>
  z.object({
    name: z.string().min(1, dict.nameRequired),
    email: z.string().min(1, dict.emailRequired).email(dict.emailInvalid),
    message: z.string().min(1, dict.messageRequired).min(10, dict.messageMin),
    extra_field: z.string().optional(), // Honeypot field
  });

type FormData = z.infer<ReturnType<typeof createFormSchema>>;

export default function Contact({ dict, lang = "en" }: { dict: ContactDict; lang?: Lang }) {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "loading" | "success" | "error" | "rate_limit"
  >("idle");

  const formSchema = createFormSchema(dict.form);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
      extra_field: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setSubmitStatus("loading");

    try {
      // Convert to FormData for the server action
      const formData = new window.FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("message", data.message);
      formData.append("extra_field", data.extra_field || "");

      const result = await sendEmail(formData, lang);

      if (result.success) {
        setSubmitStatus("success");
        reset();
        setTimeout(() => setSubmitStatus("idle"), 5000);
      } else if (result.error === "rate_limit") {
        setSubmitStatus("rate_limit");
        setTimeout(() => setSubmitStatus("idle"), 8000);
      } else {
        setSubmitStatus("error");
        setTimeout(() => setSubmitStatus("idle"), 5000);
      }
    } catch {
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 5000);
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative py-10 md:py-32 px-5 sm:px-8 md:px-16 lg:px-24 bg-transparent overflow-hidden max-w-[100vw]"
    >
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-24">
          {/* Left Column - Title and description */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col min-w-0"
          >
            <span className="inline-block text-[#0077cc] text-sm tracking-[0.3em] uppercase font-medium bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full w-fit">
              {dict.label}
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-7xl text-black mt-4 mb-4 md:mb-6 font-(family-name:--font-playfair)">
              {dict.title}
              <br />
              {dict.titleLine2}
            </h2>
            <p className="text-black/70 text-sm sm:text-lg max-w-md leading-relaxed">
              {dict.description}
            </p>
          </motion.div>

          {/* Right Column - Contact Form */}
          <div className="flex items-center min-w-0">
            <motion.div
              className="w-full"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.8,
                delay: 0.2,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <motion.div
                layout
                transition={{
                  layout: {
                    duration: 0.5,
                    ease: [0.25, 0.1, 0.25, 1],
                  },
                }}
                className="p-4 sm:p-6 md:p-8 rounded-[20px] md:rounded-3xl relative overflow-hidden"
                style={{
                  background: "rgba(255, 255, 255, 0.21)",
                  backdropFilter: "blur(17px)",
                  WebkitBackdropFilter: "blur(17px)",
                  boxShadow:
                    "0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.5), inset 0 -1px 0 rgba(255, 255, 255, 0.1), inset 0 0 12px 6px rgba(255, 255, 255, 0.15)",
                }}
              >
                {/* Top edge highlight */}
                <div
                  className="pointer-events-none absolute top-0 left-0 right-0 h-px"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent)",
                  }}
                />
                {/* Left edge highlight */}
                <div
                  className="pointer-events-none absolute top-0 left-0 w-px h-full"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(255, 255, 255, 0.8), transparent, rgba(255, 255, 255, 0.3))",
                  }}
                />

                <AnimatePresence mode="wait">
                  {submitStatus === "success" ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -20 }}
                      transition={{
                        duration: 0.5,
                        ease: [0.25, 0.1, 0.25, 1],
                      }}
                      className="flex flex-col items-center justify-center py-16 text-center"
                    >
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 15,
                          delay: 0.1,
                        }}
                        className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mb-6 shadow-lg shadow-green-500/30"
                      >
                        <CheckCircle className="w-10 h-10 text-white" />
                      </motion.div>
                      <motion.h3
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-2xl font-semibold text-black mb-3"
                      >
                        {dict.form.successTitle}
                      </motion.h3>
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-black/70 text-lg"
                      >
                        {dict.form.successMessage}
                      </motion.p>
                    </motion.div>
                  ) : submitStatus === "error" ? (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -20 }}
                      transition={{
                        duration: 0.5,
                        ease: [0.25, 0.1, 0.25, 1],
                      }}
                      className="flex flex-col items-center justify-center py-16 text-center"
                    >
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 15,
                          delay: 0.1,
                        }}
                        className="w-20 h-20 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center mb-6 shadow-lg shadow-red-500/30"
                      >
                        <AlertCircle className="w-10 h-10 text-white" />
                      </motion.div>
                      <motion.h3
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-2xl font-semibold text-black mb-3"
                      >
                        {dict.form.errorTitle}
                      </motion.h3>
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-black/70 text-lg"
                      >
                        {dict.form.errorMessage}
                      </motion.p>
                    </motion.div>
                  ) : submitStatus === "rate_limit" ? (
                    <motion.div
                      key="rate_limit"
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -20 }}
                      transition={{
                        duration: 0.5,
                        ease: [0.25, 0.1, 0.25, 1],
                      }}
                      className="flex flex-col items-center justify-center py-16 text-center"
                    >
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 15,
                          delay: 0.1,
                        }}
                        className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-6 shadow-lg shadow-orange-500/30"
                      >
                        <AlertCircle className="w-10 h-10 text-white" />
                      </motion.div>
                      <motion.h3
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-2xl font-semibold text-black mb-3"
                      >
                        {dict.form.rateLimitTitle}
                      </motion.h3>
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-black/70 text-lg"
                      >
                        {dict.form.rateLimitMessage}
                      </motion.p>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{
                        duration: 0.5,
                        ease: [0.25, 0.1, 0.25, 1],
                      }}
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-3 sm:space-y-5 relative z-10"
                    >
                      {/* Honeypot field - hidden from humans, bots will fill it */}
                      <input
                        type="text"
                        {...register("extra_field")}
                        tabIndex={-1}
                        autoComplete="off"
                        className="absolute opacity-0 top-0 left-0 h-0 w-0 z-[-1]"
                        aria-hidden="true"
                      />

                      {/* Name Field */}
                      <div className="space-y-1.5 sm:space-y-2">
                        <Label
                          htmlFor="name"
                          className="text-black/80 text-xs sm:text-sm font-medium"
                        >
                          {dict.form.name}
                        </Label>
                        <Input
                          id="name"
                          {...register("name")}
                          placeholder={dict.form.namePlaceholder}
                          aria-invalid={!!errors.name}
                          className="bg-white/50 border-white/30 text-black placeholder:text-black/40 focus:bg-white/70 focus:border-[#0077cc]/50 transition-all h-10 sm:h-11 text-sm sm:text-base"
                        />
                        {errors.name && (
                          <p className="text-red-600 text-xs sm:text-sm">
                            {errors.name.message}
                          </p>
                        )}
                      </div>

                      {/* Email Field */}
                      <div className="space-y-1.5 sm:space-y-2">
                        <Label
                          htmlFor="email"
                          className="text-black/80 text-xs sm:text-sm font-medium"
                        >
                          {dict.form.email}
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          {...register("email")}
                          placeholder={dict.form.emailPlaceholder}
                          aria-invalid={!!errors.email}
                          className="bg-white/50 border-white/30 text-black placeholder:text-black/40 focus:bg-white/70 focus:border-[#0077cc]/50 transition-all h-10 sm:h-11 text-sm sm:text-base"
                        />
                        {errors.email && (
                          <p className="text-red-600 text-xs sm:text-sm">
                            {errors.email.message}
                          </p>
                        )}
                      </div>

                      {/* Message Field */}
                      <div className="space-y-1.5 sm:space-y-2">
                        <Label
                          htmlFor="message"
                          className="text-black/80 text-xs sm:text-sm font-medium"
                        >
                          {dict.form.message}
                        </Label>
                        <Textarea
                          id="message"
                          {...register("message")}
                          placeholder={dict.form.messagePlaceholder}
                          aria-invalid={!!errors.message}
                          className="bg-white/50 border-white/30 text-black placeholder:text-black/40 focus:bg-white/70 focus:border-[#0077cc]/50 transition-all resize-none min-h-28 sm:min-h-32 text-sm sm:text-base"
                        />
                        {errors.message && (
                          <p className="text-red-600 text-xs sm:text-sm">
                            {errors.message.message}
                          </p>
                        )}
                      </div>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        disabled={submitStatus === "loading"}
                        className="w-full bg-black hover:bg-black/80 text-white rounded-full py-5 sm:py-6 text-sm sm:text-base font-medium transition-all duration-300 disabled:opacity-70"
                      >
                        {submitStatus === "loading" ? (
                          <span className="flex items-center gap-2">
                            <motion.div
                              className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            />
                            {dict.form.sending}
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            {dict.form.submit}
                            <Send className="w-4 h-4" />
                          </span>
                        )}
                      </Button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
