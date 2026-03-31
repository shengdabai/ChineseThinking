import { NextRequest, NextResponse } from "next/server";
import { chatWithAI } from "@/lib/ai";
import { checkRateLimit } from "@/lib/rate-limit";
import type { ChatMessage, UserLevel } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    // Get IP (prefer Vercel trusted header)
    const ip = request.headers.get("x-vercel-forwarded-for")
      || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || "unknown";

    // Rate limit: 30 requests per minute per IP
    const { allowed } = checkRateLimit(ip, 30, 60000);
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

    const body = await request.json();
    const {
      messages,
      level = "beginner",
      scenario = "free",
    }: {
      messages: ChatMessage[];
      level: UserLevel;
      scenario: string;
    } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages are required" },
        { status: 400 }
      );
    }

    if (messages.length > 50) {
      return NextResponse.json(
        { error: "Too many messages (max 50)" },
        { status: 400 }
      );
    }

    const VALID_LEVELS = ["beginner", "intermediate", "advanced"];
    const VALID_SCENARIOS = ["free", "coffee_shop", "taxi", "restaurant", "hospital", "market", "business", "social", "family"];
    if (!VALID_LEVELS.includes(level)) {
      return NextResponse.json({ error: "Invalid level" }, { status: 400 });
    }
    if (!VALID_SCENARIOS.includes(scenario)) {
      return NextResponse.json({ error: "Invalid scenario" }, { status: 400 });
    }

    // Validate message roles (prevent role injection)
    const VALID_ROLES = new Set(["user", "assistant"]);
    for (const msg of messages) {
      if (!VALID_ROLES.has(msg.role)) {
        return NextResponse.json({ error: "Invalid message role" }, { status: 400 });
      }
    }

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage?.content?.trim()) {
      return NextResponse.json(
        { error: "Empty message" },
        { status: 400 }
      );
    }

    // Limit message length to prevent abuse
    if (lastMessage.content.length > 2000) {
      return NextResponse.json(
        { error: "Message too long (max 2000 characters)" },
        { status: 400 }
      );
    }

    const stream = await chatWithAI(messages, level, scenario);

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to get AI response. Please try again." },
      { status: 500 }
    );
  }
}
