import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
          Chinese
          <span className="text-blue-600">Thinking</span>
        </h1>
        <p className="mt-4 text-lg text-gray-500 max-w-md leading-relaxed">
          Learn to think in Chinese, not just translate.
          <br />
          Practice with AI that encourages you, never judges.
        </p>

        <div className="mt-10 flex flex-col gap-3 w-full max-w-xs">
          <Link
            href="/onboarding"
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 text-white py-3.5 text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            🚀 Get Started — Free
          </Link>
          <Link
            href="/chat"
            className="flex items-center justify-center gap-2 rounded-xl bg-gray-100 text-gray-700 py-3.5 text-sm font-semibold hover:bg-gray-200 transition-colors"
          >
            💬 Jump to Chat
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-6 text-center max-w-sm">
          <div>
            <p className="text-2xl font-bold text-blue-600">2 min</p>
            <p className="text-xs text-gray-400 mt-1">Daily practice</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">24/7</p>
            <p className="text-xs text-gray-400 mt-1">AI partner</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">0</p>
            <p className="text-xs text-gray-400 mt-1">Judgment</p>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-gray-300">
        ChineseThinking — Learn to express, not to translate
      </footer>
    </div>
  );
}
