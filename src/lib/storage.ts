/**
 * Data storage abstraction layer.
 * Currently uses localStorage. Drop-in Supabase upgrade when ready.
 * All functions are async to match future Supabase API.
 */

import type { UserLevel, ChatMessage, MistakeEntry } from "./types";

export interface UserData {
  persona: string;
  level: UserLevel;
  streak_days: number;
  streak_last_date: string;
  push_time: string;
  conversations: ConversationRecord[];
  mistakes: MistakeEntry[];
  challenge_history: string[]; // completed challenge IDs
  onboarded: boolean;
  created_at: string;
}

export interface ConversationRecord {
  id: string;
  scenario: string;
  messages: ChatMessage[];
  summary?: string;
  created_at: string;
}

const STORAGE_KEY = "ct-user-data";

function getDefaultUser(): UserData {
  return {
    persona: "",
    level: "beginner",
    streak_days: 0,
    streak_last_date: "",
    push_time: "morning",
    conversations: [],
    mistakes: [],
    challenge_history: [],
    onboarded: false,
    created_at: new Date().toISOString(),
  };
}

export async function loadUser(): Promise<UserData> {
  if (typeof window === "undefined") return getDefaultUser();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultUser();
    return { ...getDefaultUser(), ...JSON.parse(raw) };
  } catch {
    return getDefaultUser();
  }
}

export async function saveUser(data: Partial<UserData>): Promise<void> {
  if (typeof window === "undefined") return;
  const current = await loadUser();
  const merged = { ...current, ...data };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
}

export async function addMistake(mistake: Omit<MistakeEntry, "id" | "user_id" | "review_count" | "created_at">): Promise<void> {
  const user = await loadUser();
  const entry: MistakeEntry = {
    ...mistake,
    id: crypto.randomUUID(),
    user_id: "local",
    review_count: 0,
    created_at: new Date().toISOString(),
  };
  user.mistakes = [entry, ...user.mistakes].slice(0, 200); // cap at 200
  await saveUser({ mistakes: user.mistakes });
}

export async function getMistakes(): Promise<MistakeEntry[]> {
  const user = await loadUser();
  return user.mistakes;
}

export async function saveConversation(conv: ConversationRecord): Promise<void> {
  const user = await loadUser();
  const existing = user.conversations.findIndex((c) => c.id === conv.id);
  if (existing >= 0) {
    user.conversations[existing] = conv;
  } else {
    user.conversations = [conv, ...user.conversations].slice(0, 50); // cap at 50
  }
  await saveUser({ conversations: user.conversations });
}

export async function updateStreak(): Promise<number> {
  const user = await loadUser();
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  if (user.streak_last_date === today) {
    return user.streak_days; // already counted today
  }

  let newStreak: number;
  if (user.streak_last_date === yesterday) {
    newStreak = user.streak_days + 1;
  } else {
    newStreak = 1; // streak broken, restart
  }

  await saveUser({
    streak_days: newStreak,
    streak_last_date: today,
  });
  return newStreak;
}

export async function markChallengeComplete(challengeId: string): Promise<void> {
  const user = await loadUser();
  if (!user.challenge_history.includes(challengeId)) {
    user.challenge_history = [challengeId, ...user.challenge_history].slice(0, 500);
    await saveUser({ challenge_history: user.challenge_history });
  }
}
