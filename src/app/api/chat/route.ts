import { streamText, UIMessage, convertToModelMessages, tool } from "ai";
import { google } from "@ai-sdk/google";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { z } from "zod";
import { SYSTEM_PROMPT } from "@/lib/systemPrompt";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(2, "1 m"),
    analytics: true,
  });

  const { success } = await ratelimit.limit("ip adress");

  if (!success) {
    return new Response("Rate limit exceeded", { status: 429 });
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
