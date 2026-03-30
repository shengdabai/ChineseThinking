"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/chat", label: "Chat", icon: "💬" },
  { href: "/challenge", label: "Challenge", icon: "⚡" },
  { href: "/mistakes", label: "Review", icon: "📝" },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] z-50">
      <div className="max-w-md mx-auto flex justify-around">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                isActive
                  ? "text-blue-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="text-xl" aria-hidden="true">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
