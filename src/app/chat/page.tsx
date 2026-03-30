"use client";

import { useState, useRef, useEffect } from "react";
import { ChatBubble } from "@/components/ChatBubble";
import { Navigation } from "@/components/Navigation";

type Message = { role: "user" | "assistant"; content: string };
type Level = "beginner" | "intermediate" | "advanced";

const SCENARIOS = [
  { id: "free", label: "Free Chat", icon: "💬" },
  { id: "coffee_shop", label: "Coffee Shop", icon: "☕" },
  { id: "taxi", label: "Taxi", icon: "🚕" },
  { id: "restaurant", label: "Restaurant", icon: "🍜" },
  { id: "hospital", label: "Doctor", icon: "🏥" },
  { id: "market", label: "Market", icon: "🛒" },
  { id: "business", label: "Business", icon: "💼" },
  { id: "social", label: "Social", icon: "🎉" },
  { id: "family", label: "Family", icon: "👨‍👩‍👧" },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [level, setLevel] = useState<Level>("beginner");
  const [scenario, setScenario] = useState("free");
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    setShowSettings(false);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, level, scenario }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader");

      const decoder = new TextDecoder();
      let assistantContent = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));

        for (const line of lines) {
          const data = line.slice(6);
          if (data === "[DONE]") break;
          try {
            const parsed = JSON.parse(data);
            assistantContent += parsed.text;
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = {
                role: "assistant",
                content: assistantContent,
              };
              return updated;
            });
          } catch {
            // skip malformed chunks
          }
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev.filter((m) => m.content !== ""),
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again! 再试一次吧！",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h1 className="text-lg font-semibold text-gray-900">
          Chinese Thinking
        </h1>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="text-sm text-blue-600 font-medium"
        >
          {showSettings ? "Hide" : "Settings"}
        </button>
      </header>

      {/* Settings panel */}
      {showSettings && (
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 space-y-3">
          {/* Level selector */}
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Your Level
            </label>
            <div className="flex gap-2 mt-1">
              {(["beginner", "intermediate", "advanced"] as Level[]).map(
                (l) => (
                  <button
                    key={l}
                    onClick={() => setLevel(l)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      level === l
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    {l === "beginner"
                      ? "Beginner"
                      : l === "intermediate"
                        ? "Intermediate"
                        : "Advanced"}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Scenario selector */}
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Scenario
            </label>
            <div className="flex gap-2 mt-1 overflow-x-auto pb-1">
              {SCENARIOS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setScenario(s.id)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    scenario === s.id
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <span>{s.icon}</span>
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-40">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
            <p className="text-4xl mb-4">🇨🇳</p>
            <p className="text-lg font-medium text-gray-600">
              Start practicing Chinese!
            </p>
            <p className="text-sm mt-1">
              Type anything in Chinese (even if it&apos;s not perfect).
              <br />
              I&apos;ll help you express your thoughts naturally.
            </p>
          </div>
        )}
        {messages.map((msg, i) => (
          <ChatBubble key={i} role={msg.role} content={msg.content} />
        ))}
        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.1s]" />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="max-w-2xl mx-auto flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Type in Chinese... 用中文说点什么..."
            className="flex-1 rounded-full border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="rounded-full bg-blue-600 text-white px-5 py-2.5 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
          >
            Send
          </button>
        </div>
      </div>

      <Navigation />
    </div>
  );
}
