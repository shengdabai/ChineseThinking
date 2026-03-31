import Link from "next/link";
import phrases from "@/content/phrases.json";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learn Chinese Phrases — ChineseThinking",
  description:
    "Learn essential Chinese phrases with Chinese thinking breakdowns. Understand not just WHAT to say, but HOW Chinese speakers think.",
};

const CATEGORIES: Record<string, { label: string; icon: string }> = {
  greetings: { label: "Greetings", icon: "👋" },
  shopping: { label: "Shopping", icon: "🛒" },
  directions: { label: "Directions", icon: "🧭" },
  food: { label: "Food & Dining", icon: "🍜" },
  survival: { label: "Survival", icon: "🆘" },
  taxi: { label: "Taxi & Transport", icon: "🚕" },
  daily: { label: "Daily Life", icon: "☀️" },
  social: { label: "Social", icon: "🎉" },
  culture: { label: "Culture", icon: "🏮" },
};

export default function LearnPage() {
  const grouped = phrases.reduce(
    (acc, p) => {
      const cat = p.category || "other";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(p);
      return acc;
    },
    {} as Record<string, typeof phrases>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900">
          Learn Chinese Phrases
        </h1>
        <p className="text-gray-500 mt-2">
          Each phrase includes a <strong>Chinese Thinking breakdown</strong> —
          understand how Chinese speakers actually construct their sentences.
        </p>

        <div className="mt-8 space-y-8">
          {Object.entries(grouped).map(([cat, items]) => {
            const meta = CATEGORIES[cat] || { label: cat, icon: "📝" };
            return (
              <div key={cat}>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  {meta.icon} {meta.label}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {items.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/learn/${p.slug}`}
                      className="rounded-xl border border-gray-100 p-4 hover:border-blue-300 hover:bg-blue-50/30 transition-all"
                    >
                      <p className="text-2xl font-bold text-gray-900">
                        {p.zh}
                      </p>
                      <p className="text-xs text-blue-600 mt-1">{p.pinyin}</p>
                      <p className="text-sm text-gray-500 mt-1">{p.en}</p>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-center text-white">
          <h2 className="text-xl font-bold">
            Ready to practice these in conversation?
          </h2>
          <p className="text-blue-100 mt-2 text-sm">
            Our AI partner speaks your level, never judges, and teaches you to
            think in Chinese.
          </p>
          <Link
            href="/onboarding"
            className="inline-block mt-4 rounded-xl bg-white text-blue-700 px-6 py-3 text-sm font-bold hover:bg-blue-50 transition-colors"
          >
            Start Free Practice
          </Link>
        </div>
      </div>
    </div>
  );
}
