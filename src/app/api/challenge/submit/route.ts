import { NextRequest, NextResponse } from "next/server";
import { getChallengeFeedback } from "@/lib/ai";
import type { UserLevel } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
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
