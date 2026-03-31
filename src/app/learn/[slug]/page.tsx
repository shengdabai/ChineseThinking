import Link from "next/link";
import { notFound } from "next/navigation";
import phrases from "@/content/phrases.json";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return phrases.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const phrase = phrases.find((p) => p.slug === slug);
  if (!phrase) return {};
  return {
    title: `How to say "${phrase.en}" in Chinese — ${phrase.zh} (${phrase.pinyin}) | ChineseThinking`,
    description: `Learn to say "${phrase.en}" in Chinese: ${phrase.zh} (${phrase.pinyin}). Literal meaning: "${phrase.literal}". ${phrase.tip}`,
  };
}

export default async function PhrasePage({ params }: Props) {
  const { slug } = await params;
  const phrase = phrases.find((p) => p.slug === slug);
  if (!phrase) notFound();

  const related = phrases
    .filter((p) => p.category === phrase.category && p.slug !== phrase.slug)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          {" / "}
          <Link href="/learn" className="hover:text-blue-600">Learn</Link>
          {" / "}
          <span className="text-gray-600">{phrase.en}</span>
        </nav>

        {/* Main phrase card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 mb-8">
          <p className="text-sm font-medium text-blue-500 uppercase tracking-wider">
            How to say in Chinese
          </p>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">
            &ldquo;{phrase.en}&rdquo;
          </h1>
          <p className="text-5xl font-bold text-gray-900 mt-4">{phrase.zh}</p>
          <p className="text-lg text-blue-600 mt-2">{phrase.pinyin}</p>
        </div>

        {/* Chinese Thinking breakdown */}
        <div className="bg-white border border-gray-100 rounded-xl p-6 mb-8">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
            🧠 Chinese Thinking Breakdown
          </h2>
          <div className="flex items-center gap-3 text-lg">
            <span className="font-bold text-gray-900">{phrase.zh}</span>
            <span className="text-gray-300">→</span>
            <span className="text-blue-600 italic">&ldquo;{phrase.literal}&rdquo;</span>
          </div>
          <p className="text-sm text-gray-500 mt-3">{phrase.tip}</p>
        </div>

        {/* CTA */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8 text-center">
          <p className="text-gray-600 font-medium">
            Want to practice saying this in a real conversation?
          </p>
          <Link
            href="/onboarding"
            className="inline-block mt-3 rounded-xl bg-blue-600 text-white px-6 py-3 text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            Practice with AI — Free
          </Link>
        </div>

        {/* Related phrases */}
        {related.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Related Phrases
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/learn/${r.slug}`}
                  className="rounded-xl border border-gray-100 p-4 hover:border-blue-300 transition-colors"
                >
                  <p className="text-xl font-bold text-gray-900">{r.zh}</p>
                  <p className="text-xs text-blue-600 mt-1">{r.pinyin}</p>
                  <p className="text-sm text-gray-500 mt-1">{r.en}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
