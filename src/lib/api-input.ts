import { isIP } from "node:net";
import type { ChatMessage, UserLevel } from "./types";

export class InputError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}

// Only trust the header overwritten by Vercel when running on Vercel.
// Other hosts share a conservative bucket until a trusted proxy is configured.
export function clientIp(headers: Headers): string {
  const ip = process.env.VERCEL === "1" ? headers.get("x-vercel-forwarded-for")?.trim() : null;
  return ip && isIP(ip) ? ip : "unknown";
}

export async function readJson(request: Request): Promise<Record<string, unknown>> {
  const reader = request.body?.getReader();
  if (!reader) throw new InputError("JSON object is required");
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      // 50 history messages of up to 2000 characters fit; anything larger is not a chat request.
      if (size > 512 * 1024) {
        await reader.cancel();
        throw new InputError("Request body too large", 413);
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  try {
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    const body: unknown = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error();
    return body as Record<string, unknown>;
  } catch {
    throw new InputError("Valid JSON object is required");
  }
}

const MAX_TEXT = 2000;
const HISTORY_LIMIT = 50;

function text(value: unknown, field: string): string {
  if (typeof value !== "string" || !value.trim() || value.length > MAX_TEXT) {
    throw new InputError(`${field} must contain 1–2000 characters`);
  }
  return value;
}

function userLevel(value: unknown = "beginner"): UserLevel {
  if (value !== "beginner" && value !== "intermediate" && value !== "advanced") {
    throw new InputError("Invalid level");
  }
  return value;
}

export function chatInput(body: Record<string, unknown>) {
  const level = userLevel(body.level);
  const scenario = body.scenario === undefined ? "free" : body.scenario;
  if (typeof scenario !== "string" || !["free", "coffee_shop", "taxi", "restaurant", "hospital", "market", "business", "social", "family"].includes(scenario)) {
    throw new InputError("Invalid scenario");
  }
  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    throw new InputError("Messages must be a non-empty array");
  }
  // The client resends the whole conversation. Only the newest message is held to the
  // 1–2000 character rule; older entries are trimmed instead of rejected, so one long
  // reply or an earlier rejected message cannot block the conversation for good.
  const parsed = body.messages.slice(-HISTORY_LIMIT).map((message: unknown): Pick<ChatMessage, "role" | "content"> => {
    if (!message || typeof message !== "object" || !("role" in message) || !("content" in message) ||
        (message.role !== "user" && message.role !== "assistant") || typeof message.content !== "string") {
      throw new InputError("Invalid message");
    }
    return { role: message.role, content: message.content };
  });
  const latest = parsed[parsed.length - 1];
  const messages: Pick<ChatMessage, "role" | "content">[] = [
    ...parsed.slice(0, -1)
      .filter((message) => message.content.trim())
      .map((message) => ({ ...message, content: message.content.slice(0, MAX_TEXT) })),
    { role: latest.role, content: text(latest.content, "Message") },
  ];
  if (messages.at(-1)?.role !== "user") throw new InputError("Last message must be from the user");
  return { messages, level, scenario };
}

export function challengeInput(body: Record<string, unknown>) {
  return { scenario: text(body.scenario, "Scenario"), userResponse: text(body.userResponse, "Response"), level: userLevel(body.level) };
}
