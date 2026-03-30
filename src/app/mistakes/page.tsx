"use client";

import { useState } from "react";
import { Navigation } from "@/components/Navigation";

interface Mistake {
  wrong: string;
  correct: string;
  context: string;
  date: string;
}

export default function MistakesPage() {
  // MVP: localStorage-based mistake tracking
  const [mistakes] = useState<Mistake[]>(() => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("ct-mistakes");
    return saved ? JSON.parse(saved) : [];
  });

  return (
    <div className="flex flex-col min-h-screen bg-white pb-20">
      <header className="px-4 py-3 border-b border-gray-100">
        <h1 className="text-lg font-semibold text-gray-900">Mistake Review</h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Learn from your mistakes — they&apos;re your best teachers
        </p>
      </header>

      <div className="flex-1 px-4 py-6">
        {mistakes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <p className="text-4xl mb-3">🎯</p>
            <p className="text-gray-600 font-medium">No mistakes yet!</p>
            <p className="text-sm text-gray-400 mt-1">
              Start chatting or doing challenges.
              <br />
              Your mistakes will appear here for review.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {mistakes.map((m, i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-100 p-4 space-y-2"
              >
                <div className="flex items-start gap-2">
                  <span className="text-red-400 text-xs mt-0.5">✗</span>
                  <p className="text-sm text-red-600 line-through">
                    {m.wrong}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500 text-xs mt-0.5">✓</span>
                  <p className="text-sm text-green-700 font-medium">
                    {m.correct}
                  </p>
                </div>
                <p className="text-xs text-gray-400 pl-5">{m.context}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <Navigation />
    </div>
  );
}
