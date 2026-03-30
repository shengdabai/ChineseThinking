import { NextRequest, NextResponse } from "next/server";
import { chatWithAI } from "@/lib/ai";
import type { ChatMessage, UserLevel } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
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
