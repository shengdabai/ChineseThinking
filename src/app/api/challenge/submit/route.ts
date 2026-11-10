import { NextRequest, NextResponse } from "next/server";
import { getChallengeFeedback } from "@/lib/ai";
import { checkRateLimit } from "@/lib/rate-limit";
import { challengeInput, clientIp, InputError, readJson } from "@/lib/api-input";

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 20 requests per minute per IP
    const ip = clientIp(request.headers);
    const { allowed } = checkRateLimit(`challenge:${ip}`, 20, 60000);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    const { scenario, userResponse, level } = challengeInput(await readJson(request));

    const feedback = await getChallengeFeedback(scenario, userResponse, level);

    return NextResponse.json({ feedback });
  } catch (error) {
    if (error instanceof InputError) return NextResponse.json({ error: error.message }, { status: error.status });
    console.error("Challenge submit request failed");
    return NextResponse.json(
      { error: "Failed to evaluate response. Please try again." },
      { status: 500 }
    );
  }
}
