import { NextRequest, NextResponse } from "next/server";
import { chatWithAI } from "@/lib/ai";
import { checkRateLimit } from "@/lib/rate-limit";
import { chatInput, clientIp, InputError, readJson } from "@/lib/api-input";

export async function POST(request: NextRequest) {
  try {
    const ip = clientIp(request.headers);

    // Rate limit: 30 requests per minute per IP
    const { allowed } = checkRateLimit(`chat:${ip}`, 30, 60000);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    // Server-side daily entitlement check (prevents localStorage bypass)
    const dailyKey = `daily:${ip}:${new Date().toISOString().split("T")[0]}`;
    const { allowed: dailyAllowed } = checkRateLimit(dailyKey, 50, 86400000);
    if (!dailyAllowed) {
      return NextResponse.json(
        { error: "Daily free limit reached. Upgrade to Pro for unlimited access.", upgrade: true },
        { status: 402 }
      );
    }

    const { messages, level, scenario } = chatInput(await readJson(request));

    const stream = await chatWithAI(messages, level, scenario);

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    if (error instanceof InputError) return NextResponse.json({ error: error.message }, { status: error.status });
    console.error("Chat API request failed");
    return NextResponse.json(
      { error: "Failed to get AI response. Please try again." },
      { status: 500 }
    );
  }
}
