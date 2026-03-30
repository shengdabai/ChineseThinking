import { NextRequest, NextResponse } from "next/server";
import challenges from "@/content/challenges.json";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const level = searchParams.get("level") || "beginner";

  // Simple day-based rotation through available challenges
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );

  const filtered = challenges.filter(
    (c) => c.difficulty === level || level === "all"
  );

  if (filtered.length === 0) {
    return NextResponse.json(
      { error: "No challenges found for this level" },
      { status: 404 }
    );
  }

  const todayChallenge = filtered[dayOfYear % filtered.length];

  return NextResponse.json({
    challenge: todayChallenge,
    day_number: dayOfYear,
  });
}
