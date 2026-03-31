"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { getMistakes } from "@/lib/storage";
import type { MistakeEntry } from "@/lib/types";

export default function MistakesPage() {
  const [mistakes, setMistakes] = useState<MistakeEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMistakes().then((data) => {
      setMistakes(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white pb-20">
      <header className="px-4 py-3 border-b border-gray-100">
        <h1 className="text-lg font-semibold text-gray-900">Mistake Review</h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Learn from your mistakes — they&apos;re your best teachers
        </p>
      </header>

      <div className="flex-1 px-4 py-6">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <p className="text-gray-400">Loading...</p>
          </div>
        ) : mistakes.length === 0 ? (
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
            <p className="text-xs text-gray-400 mb-2">
              {mistakes.length} mistake{mistakes.length > 1 ? "s" : ""} recorded
            </p>
            {mistakes.map((m) => (
              <div
                key={m.id}
                className="rounded-xl border border-gray-100 p-4 space-y-2"
              >
                <div className="flex items-start gap-2">
                  <span className="text-red-400 text-xs mt-0.5">✗</span>
                  <p className="text-sm text-red-600 line-through">
                    {m.wrong_text}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500 text-xs mt-0.5">✓</span>
                  <p className="text-sm text-green-700 font-medium">
                    {m.correct_text}
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
