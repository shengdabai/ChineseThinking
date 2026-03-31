"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { loadUser, updateStreak, markChallengeComplete } from "@/lib/storage";

type Level = "beginner" | "intermediate" | "advanced";

interface Challenge {
  id: string;
  prompt_zh: string;
  prompt_pinyin?: string;
  prompt_en?: string;
  difficulty: string;
  category: string;
  culture_tip?: string;
  hint_zh?: string;
  hint_pinyin?: string;
  hint_en?: string;
}

const LEVEL_LABELS: Record<Level, { label: string; tag: string; desc: string }> = {
  beginner: { label: "Level A", tag: "A", desc: "Pinyin + English" },
  intermediate: { label: "Level B", tag: "B", desc: "Pinyin + 汉字" },
  advanced: { label: "Level C", tag: "C", desc: "纯中文" },
};

export default function ChallengePage() {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [level, setLevel] = useState<Level>("beginner");
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    loadChallenge();
    loadUser().then((user) => {
      setStreak(user.streak_days);
      if (user.level) setLevel(user.level);
    });
  }, []);

  const [error, setError] = useState<string | null>(null);

  async function loadChallenge() {
    setError(null);
    try {
      const res = await fetch(`/api/challenge/today?level=${level}`);
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setChallenge(data.challenge);
      setIsSubmitted(false);
      setFeedback("");
      setInput("");
      window.scrollTo(0, 0);
    } catch {
      setError("Could not load challenge. Check your connection and try again.");
    }
  }

  async function handleSubmit() {
    if (!input.trim() || !challenge || isLoading) return;
    setIsLoading(true);

    try {
      const res = await fetch("/api/challenge/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenario: challenge.prompt_en,
          userResponse: input,
          level,
        }),
      });

      const data = await res.json();
      setFeedback(data.feedback);
      setIsSubmitted(true);

      // Update streak and mark complete
      const newStreak = await updateStreak();
      setStreak(newStreak);
      if (challenge) await markChallengeComplete(challenge.id);
    } catch {
      setFeedback("Something went wrong. Try again!");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-white pb-20">
      {/* Header */}
      <header className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">
            Daily Challenge
          </h1>
          {streak > 0 && (
            <div className="flex items-center gap-1 bg-orange-50 px-3 py-1 rounded-full">
              <span className="text-orange-500 text-sm">🔥</span>
              <span className="text-sm font-semibold text-orange-600">
                {streak} day{streak > 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>
        {/* Level tabs */}
        <div className="flex gap-2 mt-2">
          {(["beginner", "intermediate", "advanced"] as Level[]).map((l) => (
            <button
              key={l}
              onClick={() => { setLevel(l); loadChallenge(); }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                level === l
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {LEVEL_LABELS[l].tag} · {l === "beginner" ? "Beginner" : l === "intermediate" ? "Intermediate" : "Advanced"}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 px-4 py-6 space-y-6">
        {challenge ? (
          <>
            {/* Challenge card - ABC level display */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-blue-500 uppercase tracking-wide">
                  Today&apos;s Challenge
                </p>
                <span className="text-xs font-bold bg-blue-600 text-white px-2 py-0.5 rounded">
                  {LEVEL_LABELS[level].tag} · {LEVEL_LABELS[level].desc}
                </span>
              </div>

              {/* Level A: Pinyin primary + English translation */}
              {level === "beginner" && (
                <>
                  {challenge.prompt_en && (
                    <p className="text-lg font-medium text-gray-900 leading-relaxed">
                      {challenge.prompt_en}
                    </p>
                  )}
                  {challenge.prompt_pinyin && (
                    <p className="text-base text-blue-600 mt-2 font-medium">
                      {challenge.prompt_pinyin}
                    </p>
                  )}
                  <p className="text-sm text-gray-400 mt-1">{challenge.prompt_zh}</p>
                </>
              )}

              {/* Level B: Hanzi + Pinyin mixed, English available */}
              {level === "intermediate" && (
                <>
                  <p className="text-lg font-medium text-gray-900 leading-relaxed">
                    {challenge.prompt_zh}
                  </p>
                  {challenge.prompt_pinyin && (
                    <p className="text-sm text-blue-500 mt-1">{challenge.prompt_pinyin}</p>
                  )}
                  {challenge.prompt_en && (
                    <p className="text-sm text-gray-400 mt-2 italic">{challenge.prompt_en}</p>
                  )}
                </>
              )}

              {/* Level C: Pure Chinese only */}
              {level === "advanced" && (
                <p className="text-lg font-medium text-gray-900 leading-relaxed">
                  {challenge.prompt_zh}
                </p>
              )}
            </div>

            {/* Culture tip */}
            {challenge.culture_tip && (
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                <p className="text-xs font-medium text-amber-600 mb-1">
                  💡 Culture Tip
                </p>
                <p className="text-sm text-amber-800">
                  {challenge.culture_tip}
                </p>
              </div>
            )}

            {/* Input area */}
            {!isSubmitted ? (
              <div className="space-y-3">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Write your response in Chinese... 用中文回答..."
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 min-h-[100px] resize-none"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSubmit}
                  disabled={isLoading || !input.trim()}
                  className="w-full rounded-xl bg-blue-600 text-white py-3 text-sm font-semibold disabled:opacity-50 hover:bg-blue-700 transition-colors"
                >
                  {isLoading ? "Checking..." : "Submit"}
                </button>
              </div>
            ) : (
              /* Feedback */
              <div className="space-y-4">
                <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                  <p className="text-xs font-medium text-green-600 mb-2">
                    ✅ Challenge Complete!
                  </p>
                  <div className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {feedback}
                  </div>
                </div>
                <button
                  onClick={loadChallenge}
                  className="w-full rounded-xl bg-gray-100 text-gray-700 py-3 text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  Try Another Challenge
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 gap-3">
            {error ? (
              <>
                <p className="text-red-500 text-sm">{error}</p>
                <button
                  onClick={loadChallenge}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
                >
                  Retry
                </button>
              </>
            ) : (
              <p className="text-gray-400">Loading challenge...</p>
            )}
          </div>
        )}
      </div>

      <Navigation />
    </div>
  );
}
