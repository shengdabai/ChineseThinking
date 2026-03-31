"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Persona = "professional" | "heritage" | "student" | "traveler";
type Level = "beginner" | "intermediate" | "advanced";

const PERSONAS = [
  {
    id: "professional" as Persona,
    icon: "💼",
    title: "Working Professional",
    desc: "I need Chinese for work — meetings, emails, business dinners",
    example: "Like Mark, who wanted to decline a drink at a business dinner",
  },
  {
    id: "heritage" as Persona,
    icon: "🏠",
    title: "Heritage Learner",
    desc: "I have Chinese family roots and want to connect with my culture",
    example: "Like Jason, who wanted to explain his job to his grandparents",
  },
  {
    id: "student" as Persona,
    icon: "📚",
    title: "Student / HSK Prep",
    desc: "I'm studying Chinese at school or preparing for HSK exams",
    example: "Like Anna, who tracks her HSK vocabulary coverage",
  },
  {
    id: "traveler" as Persona,
    icon: "✈️",
    title: "Traveler / Hobbyist",
    desc: "I want survival Chinese for trips or just for fun",
    example: "Like David, who wants funny 2-minute challenges before a trip",
  },
];

const LEVELS = [
  {
    id: "beginner" as Level,
    title: "Beginner",
    desc: "I know very little — ni hao, xie xie, numbers",
    hsk: "HSK 1-2",
  },
  {
    id: "intermediate" as Level,
    title: "Intermediate",
    desc: "I can have basic conversations but struggle with complex topics",
    hsk: "HSK 3-4",
  },
  {
    id: "advanced" as Level,
    title: "Advanced",
    desc: "I'm conversational but want to sound more natural and cultural",
    hsk: "HSK 5+",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [persona, setPersona] = useState<Persona | null>(null);
  const [level, setLevel] = useState<Level | null>(null);

  function handleComplete() {
    if (!persona || !level) return;
    localStorage.setItem("ct-persona", persona);
    localStorage.setItem("ct-level", level);
    localStorage.setItem("ct-onboarded", "true");
    router.push("/chat");
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Chinese<span className="text-blue-600">Thinking</span>
      </h1>

      {step === 1 ? (
        <>
          <p className="text-gray-500 mb-8 text-center max-w-sm">
            Why are you learning Chinese? This helps us personalize your
            experience.
          </p>

          <div className="w-full max-w-md space-y-3">
            {PERSONAS.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setPersona(p.id);
                  setStep(2);
                }}
                className={`w-full text-left rounded-xl border-2 p-4 transition-all hover:border-blue-400 ${
                  persona === p.id
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-100"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-0.5">{p.icon}</span>
                  <div>
                    <p className="font-semibold text-gray-900">{p.title}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{p.desc}</p>
                    <p className="text-xs text-blue-500 mt-1 italic">
                      {p.example}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <p className="text-gray-500 mb-8 text-center max-w-sm">
            What&apos;s your current Chinese level?
          </p>

          <div className="w-full max-w-md space-y-3">
            {LEVELS.map((l) => (
              <button
                key={l.id}
                onClick={() => setLevel(l.id)}
                className={`w-full text-left rounded-xl border-2 p-4 transition-all hover:border-blue-400 ${
                  level === l.id
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{l.title}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{l.desc}</p>
                  </div>
                  <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">
                    {l.hsk}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="flex gap-3 mt-8 w-full max-w-md">
            <button
              onClick={() => setStep(1)}
              className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={handleComplete}
              disabled={!level}
              className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white disabled:opacity-50 hover:bg-blue-700 transition-colors"
            >
              Start Learning
            </button>
          </div>
        </>
      )}

      <p className="text-xs text-gray-300 mt-12">
        You can change these anytime in Settings
      </p>
    </div>
  );
}
