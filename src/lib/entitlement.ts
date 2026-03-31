/**
 * Entitlement gateway — controls free vs paid access.
 * Free tier: 5 AI chats/day + 1 challenge/day
 * Pro tier: unlimited everything
 */

const DAILY_FREE_CHATS = 5;
const DAILY_FREE_CHALLENGES = 3;
const STORAGE_KEY = "ct-usage";

interface DailyUsage {
  date: string;
  chats: number;
  challenges: number;
}

interface EntitlementStatus {
  isPro: boolean;
  chatsRemaining: number;
  challengesRemaining: number;
  chatsUsed: number;
  dailyLimit: number;
}

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

function getUsage(): DailyUsage {
  if (typeof window === "undefined") {
    return { date: getToday(), chats: 0, challenges: 0 };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { date: getToday(), chats: 0, challenges: 0 };
    const usage = JSON.parse(raw) as DailyUsage;
    // Reset if new day
    if (usage.date !== getToday()) {
      return { date: getToday(), chats: 0, challenges: 0 };
    }
    return usage;
  } catch {
    return { date: getToday(), chats: 0, challenges: 0 };
  }
}

function saveUsage(usage: DailyUsage): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(usage));
}

export function isPro(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("ct-pro") === "true";
}

export function getEntitlementStatus(): EntitlementStatus {
  const pro = isPro();
  const usage = getUsage();

  return {
    isPro: pro,
    chatsRemaining: pro ? 999 : Math.max(0, DAILY_FREE_CHATS - usage.chats),
    challengesRemaining: pro ? 999 : Math.max(0, DAILY_FREE_CHALLENGES - usage.challenges),
    chatsUsed: usage.chats,
    dailyLimit: DAILY_FREE_CHATS,
  };
}

export function consumeChat(): { allowed: boolean; remaining: number } {
  if (isPro()) return { allowed: true, remaining: 999 };
  const usage = getUsage();
  if (usage.chats >= DAILY_FREE_CHATS) {
    return { allowed: false, remaining: 0 };
  }
  usage.chats++;
  saveUsage(usage);
  return { allowed: true, remaining: DAILY_FREE_CHATS - usage.chats };
}

export function consumeChallenge(): { allowed: boolean; remaining: number } {
  if (isPro()) return { allowed: true, remaining: 999 };
  const usage = getUsage();
  if (usage.challenges >= DAILY_FREE_CHALLENGES) {
    return { allowed: false, remaining: 0 };
  }
  usage.challenges++;
  saveUsage(usage);
  return { allowed: true, remaining: DAILY_FREE_CHALLENGES - usage.challenges };
}

// Referral: grant 7 days Pro
export function activateReferralPro(): void {
  if (typeof window === "undefined") return;
  const expiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  localStorage.setItem("ct-pro", "true");
  localStorage.setItem("ct-pro-expiry", expiry);
}

// Check and expire trial Pro
export function checkProExpiry(): void {
  if (typeof window === "undefined") return;
  const expiry = localStorage.getItem("ct-pro-expiry");
  if (expiry && new Date(expiry) < new Date()) {
    localStorage.removeItem("ct-pro");
    localStorage.removeItem("ct-pro-expiry");
  }
}
