"use server";
import { Resend } from "resend";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { headers } from "next/headers";
import { ContactNotificationEmail } from "@/components/emails/ContactNotificationEmail";
import { ConfirmationEmail } from "@/components/emails/ConfirmationEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

// Rate limit: 3 emails per day per IP
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 d"),
  analytics: true,
  prefix: "@upstash/ratelimit/email",
});

export async function sendEmail(formData: FormData, lang: "en" | "da" = "en") {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;
  const honeypot = formData.get("extra_field"); // The hidden trap

  // 1. Check the honeypot
  if (honeypot) {
    return { error: "Bot detected" };
  }

  // 2. Rate limiting - max 3 messages per day per IP
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") ?? "127.0.0.1";
  const { success, remaining } = await ratelimit.limit(ip);

  if (!success) {
    return { error: "rate_limit", remaining: 0 };
  }

  try {
    // Send notification email to team
    const { error: notificationError } = await resend.emails.send({
      from: "Contact Form <form@silab.dk>",
      to: ["silas@silab.dk", "silaskierstein@gmail.com"],
      replyTo: email,
      subject: `New Inquiry from ${name}`,
      react: ContactNotificationEmail({ name, email, message }),
    });

    if (notificationError) {
      console.error("Notification email error:", notificationError);
      return { error: notificationError.message };
    }

    // Send confirmation email to the person who submitted
    const { error: confirmationError } = await resend.emails.send({
      from: "Silab <noreply@silab.dk>",
      to: [email],
      subject:
        lang === "da"
          ? "Vi har modtaget din besked"
          : "We've received your message",
      react: ConfirmationEmail({ name, lang }),
    });

    if (confirmationError) {
      console.error("Confirmation email error:", confirmationError);
      // Don't return error here - the main email was sent successfully
    }

    console.log("Emails sent successfully");
    return { success: true };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { error: "Failed to send" };
  }
}
