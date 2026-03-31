"use client";

import { TTSButton } from "./TTS";

interface ChatBubbleProps {
  role: "user" | "assistant";
  content: string;
}

export function ChatBubble({ role, content }: ChatBubbleProps) {
  const isUser = role === "user";

  // Extract Chinese text for TTS (first line or first sentence with Chinese chars)
  const chineseText = content.match(/[\u4e00-\u9fff]+[^\n]*/)?.[0] || "";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-blue-600 text-white rounded-br-md"
            : "bg-gray-100 text-gray-900 rounded-bl-md"
        }`}
      >
        <div className="whitespace-pre-wrap text-sm leading-relaxed">
          {content}
        </div>
        {!isUser && chineseText && (
          <div className="mt-2 pt-2 border-t border-gray-200/50">
            <TTSButton text={chineseText} />
          </div>
        )}
      </div>
    </div>
  );
}
