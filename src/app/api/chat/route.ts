import { streamText, UIMessage, convertToModelMessages, tool } from "ai";
import { google } from "@ai-sdk/google";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { z } from "zod";
import { SYSTEM_PROMPT } from "@/lib/systemPrompt";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";

  // 1. Burst Rate Limit: 5 requests per minute per IP
  const burstLimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(5, "1 m"),
    analytics: true,
    prefix: "@upstash/ratelimit/burst",
  });

  // 2. Daily Rate Limit: 50 requests per day per IP
  const dailyLimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(50, "1 d"),
    analytics: true,
    prefix: "@upstash/ratelimit/daily",
  });

  // 3. Global Safety Limit: 1000 requests per day (protects wallet)
  const globalLimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(1000, "1 d"),
    analytics: true,
    prefix: "@upstash/ratelimit/global",
  });

  const [burstResult, dailyResult] = await Promise.all([
    burstLimit.limit(ip),
    dailyLimit.limit(ip),
  ]);

  if (!burstResult.success || !dailyResult.success) {
    return new Response("Rate limit exceeded. Please try again later.", {
      status: 429,
    });
  }

  // Only check global limit if IP limits pass to avoid DOSing the global counter
  const globalResult = await globalLimit.limit("global");

  if (!globalResult.success) {
    return new Response("Service momentarily unavailable due to high traffic.", {
      status: 429,
    });
  }

  const result = streamText({
    model: google("gemini-2.5-flash-lite"),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    tools: {
      display_cta: tool({
        description:
          "Show a booking button below this message. This tool is STATELESS - you must call it in EVERY response where you want the button to appear. Previous calls do not persist.",
        inputSchema: z.object({
          shouldShow: z
            .boolean()
            .describe(
              "Set to true to show a booking button below this message. Call this in every response where booking is relevant.",
            ),
        }),
        execute: async ({ shouldShow }) => {
          return {
            shouldShow,
          };
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
