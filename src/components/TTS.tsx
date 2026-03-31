"use client";

import { useState } from "react";

interface TTSProps {
  text: string;
  lang?: string;
}

export function TTSButton({ text, lang = "zh-CN" }: TTSProps) {
  const [playing, setPlaying] = useState(false);

  function speak() {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.85; // Slightly slower for learners
    utterance.pitch = 1;

    // Try to find a Chinese voice
    const voices = window.speechSynthesis.getVoices();
    const zhVoice = voices.find(
      (v) => v.lang.startsWith("zh") && v.name.includes("Female")
    ) || voices.find((v) => v.lang.startsWith("zh"));
    if (zhVoice) utterance.voice = zhVoice;

    utterance.onstart = () => setPlaying(true);
    utterance.onend = () => setPlaying(false);
    utterance.onerror = () => setPlaying(false);

    window.speechSynthesis.speak(utterance);
  }

  return (
    <button
      onClick={speak}
      disabled={playing}
      className="inline-flex items-center gap-1 text-blue-500 hover:text-blue-700 transition-colors text-xs"
      title="Listen to pronunciation"
    >
      {playing ? "🔊" : "🔈"} {playing ? "Playing..." : "Listen"}
    </button>
  );
}
