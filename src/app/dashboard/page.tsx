"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { loadUser } from "@/lib/storage";
import { getEntitlementStatus, checkProExpiry } from "@/lib/entitlement";
import type { UserData } from "@/lib/storage";

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [entitlement, setEntitlement] = useState<ReturnType<typeof getEntitlementStatus> | null>(null);

  useEffect(() => {
    checkProExpiry();
    loadUser().then(setUser);
    setEntitlement(getEntitlementStatus());
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  const totalMistakes = user.mistakes.length;
  const totalChallenges = user.challenge_history.length;
  const totalConversations = user.conversations.length;

  return (
    <div className="flex flex-col min-h-screen bg-white pb-20">
      <header className="px-4 py-3 border-b border-gray-100">
        <h1 className="text-lg font-semibold text-gray-900">My Progress</h1>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
            {user.level === "beginner" ? "Level A" : user.level === "intermediate" ? "Level B" : "Level C"}
          </span>
          {user.persona && (
            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
              {user.persona}
            </span>
          )}
          {entitlement?.isPro && (
            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-bold">
              PRO ⭐
            </span>
          )}
        </div>
      </header>

      <div className="flex-1 px-4 py-6 space-y-6">
        {/* Streak */}
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-5 text-center">
          <p className="text-5xl font-bold text-orange-600">
            {user.streak_days}
          </p>
          <p className="text-sm text-orange-500 mt-1 font-medium">
            Day Streak 🔥
          </p>
          {user.streak_days >= 7 && (
            <p className="text-xs text-orange-400 mt-2">
              Amazing! You&apos;re more consistent than 80% of learners.
            </p>
          )}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">
              {totalConversations}
            </p>
            <p className="text-xs text-blue-400 mt-1">Conversations</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-green-600">
              {totalChallenges}
            </p>
            <p className="text-xs text-green-400 mt-1">Challenges</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">
              {totalMistakes}
            </p>
            <p className="text-xs text-purple-400 mt-1">Mistakes Logged</p>
          </div>
        </div>

        {/* Daily usage */}
        {entitlement && !entitlement.isPro && (
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-700">
                Today&apos;s Free Chats
              </p>
              <p className="text-sm text-gray-500">
                {entitlement.chatsRemaining}/{entitlement.dailyLimit} left
              </p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 rounded-full h-2 transition-all"
                style={{
                  width: `${(entitlement.chatsRemaining / entitlement.dailyLimit) * 100}%`,
                }}
              />
            </div>
            {entitlement.chatsRemaining === 0 && (
              <p className="text-xs text-orange-500 mt-2">
                Daily limit reached. Upgrade to Pro for unlimited! 🚀
              </p>
            )}
          </div>
        )}

        {/* Recent mistakes preview */}
        {totalMistakes > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-gray-900 mb-3">
              Recent Mistakes
            </h2>
            <div className="space-y-2">
              {user.mistakes.slice(0, 3).map((m) => (
                <div
                  key={m.id}
                  className="rounded-lg border border-gray-100 p-3"
                >
                  <p className="text-xs text-red-500 line-through">
                    {m.wrong_text}
                  </p>
                  <p className="text-xs text-green-600 font-medium mt-1">
                    → {m.correct_text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state encouragement */}
        {totalConversations === 0 && totalChallenges === 0 && (
          <div className="text-center py-8">
            <p className="text-3xl mb-3">🌱</p>
            <p className="text-gray-600 font-medium">
              Your journey starts here!
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Complete your first chat or challenge to see your progress.
            </p>
          </div>
        )}
      </div>

      <Navigation />
    </div>
  );
}
