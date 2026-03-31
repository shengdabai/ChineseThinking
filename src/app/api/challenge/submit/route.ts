import { NextRequest, NextResponse } from "next/server";
import { getChallengeFeedback } from "@/lib/ai";
import { checkRateLimit } from "@/lib/rate-limit";
import type { UserLevel } from "@/lib/types";

const VALID_LEVELS = ["beginner", "intermediate", "advanced"];

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 20 requests per minute per IP
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const { allowed } = checkRateLimit(ip, 20, 60000);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    const body = await request.json();
    const {
      scenario,
      userResponse,
      level = "beginner",
    }: {
      scenario: string;
      userResponse: string;
      level: UserLevel;
    } = body;

    if (!userResponse?.trim()) {
      return NextResponse.json(
        { error: "Response is required" },
        { status: 400 }
      );
    }

    if (userResponse.length > 2000) {
      return NextResponse.json(
        { error: "Response too long (max 2000 characters)" },
        { status: 400 }
      );
    }

    if (!scenario) {
      return NextResponse.json(
        { error: "Scenario is required" },
        { status: 400 }
      );
    }

    if (!VALID_LEVELS.includes(level)) {
      return NextResponse.json({ error: "Invalid level" }, { status: 400 });
    }

    const feedback = await getChallengeFeedback(scenario, userResponse, level);

    return NextResponse.json({ feedback });
  } catch (error) {
    console.error("Challenge submit error:", error);
    return NextResponse.json(
      { error: "Failed to evaluate response. Please try again." },
      { status: 500 }
    );
  }
}
