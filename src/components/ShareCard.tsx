"use client";

import { useState } from "react";

interface ShareCardProps {
  phrase_zh: string;
  phrase_pinyin: string;
  phrase_en: string;
  streak?: number;
  context?: string;
}

export function ShareCard({
  phrase_zh,
  phrase_pinyin,
  phrase_en,
  streak,
  context,
}: ShareCardProps) {
  const [copied, setCopied] = useState(false);

  const shareText = `I just learned to say "${phrase_zh}" (${phrase_pinyin}) in Chinese! 🇨🇳\n${phrase_en}\n${streak ? `🔥 ${streak}-day streak` : ""}\nPractice Chinese thinking at ChineseThinking.app`;

  async function handleShare() {
    if (navigator.share) {
      await navigator.share({
        title: "I learned Chinese today!",
        text: shareText,
      });
    } else {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-5 text-white max-w-sm mx-auto">
      <p className="text-xs font-medium text-blue-200 uppercase tracking-wider">
        Today I learned to say
      </p>
      <p className="text-3xl font-bold mt-2">{phrase_zh}</p>
      <p className="text-sm text-blue-200 mt-1">{phrase_pinyin}</p>
      <p className="text-base text-white/80 mt-2 italic">&ldquo;{phrase_en}&rdquo;</p>

      {context && (
        <p className="text-xs text-blue-300 mt-3 border-t border-blue-500/30 pt-2">
          {context}
        </p>
      )}

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-blue-500/30">
        <div className="flex items-center gap-2">
          {streak && streak > 0 && (
            <span className="text-sm">
              🔥 {streak}-day streak
            </span>
          )}
        </div>
        <button
          onClick={handleShare}
          className="rounded-full bg-white/20 px-4 py-1.5 text-xs font-semibold hover:bg-white/30 transition-colors"
        >
          {copied ? "Copied! ✓" : "Share 🚀"}
        </button>
      </div>

      <p className="text-[10px] text-blue-300/60 mt-3 text-center">
        ChineseThinking — Learn to think, not translate
      </p>
    </div>
  );
}
