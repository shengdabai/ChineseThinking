/**
 * Data storage abstraction layer.
 * Uses Supabase when credentials are configured, falls back to localStorage.
 * All functions are async for both backends.
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
  challenge_history: string[];
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

function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith("https://")
  );
}

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

// ---------- Supabase backend ----------

async function supabaseLoadUser(): Promise<UserData> {
  const { getSupabase } = await import("./supabase");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = getSupabase() as any;
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return getDefaultUser();

  const { data: profile } = await sb.from("profiles").select("*").eq("id", user.id).single();
  if (!profile) return getDefaultUser();

  const { data: mistakes } = await sb.from("mistakes").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(200);
  const { data: completions } = await sb.from("challenge_completions").select("challenge_id").eq("user_id", user.id).order("completed_at", { ascending: false }).limit(500);

  return {
    persona: String(profile.persona || ""),
    level: (String(profile.level || "beginner")) as UserLevel,
    streak_days: Number(profile.streak_days || 0),
    streak_last_date: String(profile.streak_last_date || ""),
    push_time: String(profile.push_time || "morning"),
    conversations: [],
    mistakes: (mistakes || []).map((m: Record<string, unknown>) => ({
      id: m.id as string,
      user_id: m.user_id as string,
      wrong_text: m.wrong_text as string,
      correct_text: m.correct_text as string,
      context: (m.context as string) || "",
      review_count: (m.review_count as number) || 0,
      last_reviewed: m.last_reviewed as string | undefined,
      created_at: m.created_at as string,
    })),
    challenge_history: (completions || []).map((c: Record<string, unknown>) => c.challenge_id as string),
    onboarded: Boolean(profile.onboarded),
    created_at: String(profile.created_at || new Date().toISOString()),
  };
}

async function supabaseSaveUser(data: Partial<UserData>): Promise<void> {
  const { getSupabase } = await import("./supabase");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = getSupabase() as any;
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return;

  const profileFields: Record<string, unknown> = {};
  if (data.persona !== undefined) profileFields.persona = data.persona;
  if (data.level !== undefined) profileFields.level = data.level;
  if (data.streak_days !== undefined) profileFields.streak_days = data.streak_days;
  if (data.streak_last_date !== undefined) profileFields.streak_last_date = data.streak_last_date;
  if (data.push_time !== undefined) profileFields.push_time = data.push_time;
  if (data.onboarded !== undefined) profileFields.onboarded = data.onboarded;

  if (Object.keys(profileFields).length > 0) {
    await sb.from("profiles").update(profileFields).eq("id", user.id);
  }
}

async function supabaseAddMistake(mistake: Omit<MistakeEntry, "id" | "user_id" | "review_count" | "created_at">): Promise<void> {
  const { getSupabase } = await import("./supabase");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = getSupabase() as any;
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return;

  await sb.from("mistakes").insert({
    user_id: user.id,
    wrong_text: mistake.wrong_text,
    correct_text: mistake.correct_text,
    context: mistake.context,
  });
}

// ---------- localStorage backend ----------

function localLoadUser(): UserData {
  if (typeof window === "undefined") return getDefaultUser();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultUser();
    return { ...getDefaultUser(), ...JSON.parse(raw) };
  } catch {
    return getDefaultUser();
  }
}

function localSaveUser(data: Partial<UserData>): void {
  if (typeof window === "undefined") return;
  const current = localLoadUser();
  const merged = { ...current, ...data };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
}

// ---------- Public API ----------

export async function loadUser(): Promise<UserData> {
  if (isSupabaseConfigured()) {
    try {
      return await supabaseLoadUser();
    } catch {
      return localLoadUser();
    }
  }
  return localLoadUser();
}

export async function saveUser(data: Partial<UserData>): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      await supabaseSaveUser(data);
    } catch {
      localSaveUser(data);
    }
  }
  // Always save to localStorage as cache
  localSaveUser(data);
}

export async function addMistake(mistake: Omit<MistakeEntry, "id" | "user_id" | "review_count" | "created_at">): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      await supabaseAddMistake(mistake);
    } catch { /* fallthrough to local */ }
  }
  // Always save locally too
  const user = localLoadUser();
  const entry: MistakeEntry = {
    ...mistake,
    id: crypto.randomUUID(),
    user_id: "local",
    review_count: 0,
    created_at: new Date().toISOString(),
  };
  user.mistakes = [entry, ...user.mistakes].slice(0, 200);
  localSaveUser({ mistakes: user.mistakes });
}

export async function getMistakes(): Promise<MistakeEntry[]> {
  const user = await loadUser();
  return user.mistakes;
}

export async function saveConversation(conv: ConversationRecord): Promise<void> {
  const user = localLoadUser();
  const existing = user.conversations.findIndex((c) => c.id === conv.id);
  if (existing >= 0) {
    user.conversations[existing] = conv;
  } else {
    user.conversations = [conv, ...user.conversations].slice(0, 50);
  }
  localSaveUser({ conversations: user.conversations });
}

export async function updateStreak(): Promise<number> {
  const user = await loadUser();
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  if (user.streak_last_date === today) {
    return user.streak_days;
  }

  const newStreak = user.streak_last_date === yesterday
    ? user.streak_days + 1
    : 1;

  await saveUser({ streak_days: newStreak, streak_last_date: today });
  return newStreak;
}

export async function markChallengeComplete(challengeId: string): Promise<void> {
  const user = localLoadUser();
  if (!user.challenge_history.includes(challengeId)) {
    user.challenge_history = [challengeId, ...user.challenge_history].slice(0, 500);
    localSaveUser({ challenge_history: user.challenge_history });
  }

  if (isSupabaseConfigured()) {
    try {
      const { getSupabase } = await import("./supabase");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sb = getSupabase() as any;
      const { data: { user: authUser } } = await sb.auth.getUser();
      if (authUser) {
        await sb.from("challenge_completions").insert({
          user_id: authUser.id,
          challenge_id: challengeId,
          user_response: "",
        });
      }
    } catch { /* local fallback already done */ }
  }
}
