export type UserLevel = "beginner" | "intermediate" | "advanced";

export interface UserProfile {
  id: string;
  email: string;
  level: UserLevel;
  native_lang: string;
  streak_days: number;
  preferences: {
    push_time: "morning" | "noon" | "evening";
    interests: string[];
    upcoming_plans?: string;
  };
  created_at: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  thought_map?: ThoughtMap;
  new_expressions?: string[];
  timestamp: string;
}

export interface ThoughtMap {
  chinese: string;
  pinyin: string;
  literal: string;
  natural_english: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  scenario: string;
  messages: ChatMessage[];
  summary?: string;
  created_at: string;
}

export interface ChallengeScenario {
  id: string;
  prompt_zh: string;
  prompt_pinyin?: string;
  prompt_en?: string;
  difficulty: UserLevel;
  category: string;
  culture_tip?: string;
  hint_zh?: string;
  hint_pinyin?: string;
  hint_en?: string;
}
// Display rules per level:
// A (beginner):  show pinyin + English translation, hide hanzi
// B (intermediate): show pinyin + hanzi mixed, English translation available
// C (advanced): show hanzi only, no pinyin, no English

export interface ChallengeSubmission {
  id: string;
  user_id: string;
  scenario_id: string;
  user_response: string;
  ai_feedback: string;
  better_version: string;
  thought_map?: ThoughtMap;
  completed_at: string;
}

export interface MistakeEntry {
  id: string;
  user_id: string;
  wrong_text: string;
  correct_text: string;
  context: string;
  review_count: number;
  last_reviewed?: string;
  created_at: string;
}
