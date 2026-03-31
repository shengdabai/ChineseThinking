"use client";

import { useState } from "react";

interface PaywallProps {
  chatsUsed: number;
  dailyLimit: number;
  onClose: () => void;
}

export function Paywall({ chatsUsed, dailyLimit, onClose }: PaywallProps) {
  const [showReferral, setShowReferral] = useState(false);

  const referralLink =
    typeof window !== "undefined"
      ? `${window.location.origin}?ref=${Math.random().toString(36).slice(2, 8)}`
      : "";

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-lg"
        >
          ✕
        </button>

        <div className="text-center">
          <p className="text-4xl mb-3">🔒</p>
          <h2 className="text-xl font-bold text-gray-900">
            You&apos;ve used {chatsUsed}/{dailyLimit} free chats today
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Upgrade to Pro for unlimited conversations, all 90 days of
            challenges, and personalized learning.
          </p>
        </div>

        <div className="mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-3xl font-bold text-gray-900">$9.99</span>
              <span className="text-gray-500 text-sm">/month</span>
            </div>
            <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full font-medium">
              Recommended
            </span>
          </div>
          <ul className="mt-3 space-y-1.5 text-sm text-gray-700">
            <li>✓ Unlimited AI conversations</li>
            <li>✓ All 90 days of challenges</li>
            <li>✓ Mistake review & smart repetition</li>
            <li>✓ Personalized learning path</li>
            <li>✓ Voice playback</li>
          </ul>
        </div>

        <button
          onClick={() => alert("Payment integration coming soon! For now, enjoy your free daily chats.")}
          className="w-full mt-4 rounded-xl bg-blue-600 text-white py-3.5 text-sm font-bold hover:bg-blue-700 transition-colors"
        >
          Upgrade to Pro — $9.99/mo
        </button>

        <div className="mt-3 text-center">
          {!showReferral ? (
            <button
              onClick={() => setShowReferral(true)}
              className="text-xs text-blue-600 hover:underline"
            >
              Or invite a friend for 7 days free Pro →
            </button>
          ) : (
            <div className="bg-gray-50 rounded-lg p-3 mt-2">
              <p className="text-xs text-gray-600 mb-2">
                Share this link — when they sign up, you both get 7 days Pro:
              </p>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={referralLink}
                  className="flex-1 text-xs bg-white border border-gray-200 rounded px-2 py-1.5"
                />
                <button
                  onClick={() => navigator.clipboard.writeText(referralLink)}
                  className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded font-medium"
                >
                  Copy
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-[10px] text-gray-300 text-center mt-4">
          Cancel anytime. Come back tomorrow for 5 more free chats.
        </p>
      </div>
    </div>
  );
}
