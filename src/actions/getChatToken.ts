"use server";

import { SignJWT } from "jose";

// This checks if the user is human, then prints a ticket
export async function getChatToken(captchaToken: string) {
  // 1. Ask Cloudflare: "Is this user legit?"
  const verifyRes = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY, // Private Key
        response: captchaToken,
      }),
    },
  );

  const verifyData = await verifyRes.json();

  if (!verifyData.success) {
    throw new Error("Bot detected! Go away.");
  }

  // 2. Determine our secret "stamp" for the ticket
  const secret = new TextEncoder().encode(process.env.CHAT_SECRET_KEY);

  // 3. Print the Ticket (JWT)
  // It is valid for only 5 minutes
  const token = await new SignJWT({ allowed: true })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(secret);

  return token;
}
