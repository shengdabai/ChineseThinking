import OpenAI from "openai";
import { BASE_SYSTEM_PROMPT, CONVERSATION_SUMMARY_PROMPT } from "./prompts/base";
import { getLevelPrompt } from "./prompts/levels";
import { getScenarioPrompt } from "./prompts/scenarios";
import type { ChatMessage, UserLevel } from "./types";

let _client: OpenAI | null = null;
function getOpenAI() {
  if (!_client) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("Missing OPENAI_API_KEY environment variable");
    _client = new OpenAI({ apiKey });
  }
  return _client;
}

export function buildSystemPrompt(
  level: UserLevel,
  scenario: string,
  userContext?: string
): string {
  const parts = [
    BASE_SYSTEM_PROMPT,
    getLevelPrompt(level),
    getScenarioPrompt(scenario),
  ];
  if (userContext) {
    parts.push(`## User Context\n${userContext}`);
  }
  return parts.join("\n\n");
}

export async function chatWithAI(
  messages: ChatMessage[],
  level: UserLevel,
  scenario: string,
  userContext?: string
): Promise<ReadableStream> {
  const systemPrompt = buildSystemPrompt(level, scenario, userContext);

  const apiMessages = [
    { role: "system" as const, content: systemPrompt },
    ...messages.slice(-20).map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  ];

  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o-mini",
    messages: apiMessages,
    stream: true,
    max_tokens: 800,
    temperature: 0.8,
  });

  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of response) {
          const text = chunk.choices[0]?.delta?.content;
          if (text) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
          }
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      } catch {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: "Stream interrupted. Please try again." })}\n\n`));
      } finally {
        controller.close();
      }
    },
  });
}

export async function getChallengeFeedback(
  scenario: string,
  userResponse: string,
  level: UserLevel
): Promise<string> {
  const systemPrompt = `You are evaluating a Chinese language learner's response to a daily challenge.

${getLevelPrompt(level)}

Provide feedback in this exact format:
1. 【评价】Brief encouraging comment about their attempt (in English)
2. 【你说的】Their original text
3. 【更地道的说法】A more natural Chinese way to say it, with pinyin
4. 【逐字对照】Character-by-character breakdown of the better version
5. 【小提示】One specific tip for improvement (if any mistakes found)

Be warm and encouraging. Remember: confidence > perfection.`;

  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Challenge scenario: ${scenario}\n\nMy response: ${userResponse}` },
    ],
    max_tokens: 500,
    temperature: 0.7,
  });

  return response.choices[0]?.message?.content || "Error generating feedback";
}

export async function generateConversationSummary(
  messages: ChatMessage[]
): Promise<string> {
  const conversationText = messages
    .map((m) => `${m.role}: ${m.content}`)
    .join("\n");

  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: CONVERSATION_SUMMARY_PROMPT },
      { role: "user", content: conversationText },
    ],
    max_tokens: 300,
    temperature: 0.3,
  });

  return response.choices[0]?.message?.content || "{}";
}
