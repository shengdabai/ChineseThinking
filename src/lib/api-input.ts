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
      if (size > 128 * 1024) {
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

function text(value: unknown, field: string): string {
  if (typeof value !== "string" || !value.trim() || value.length > 2000) {
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
  if (!Array.isArray(body.messages) || body.messages.length === 0 || body.messages.length > 50) {
    throw new InputError("Messages must be an array of 1–50 items");
  }
  const messages: Pick<ChatMessage, "role" | "content">[] = body.messages.map((message: unknown) => {
    if (!message || typeof message !== "object" || !("role" in message) || !("content" in message) ||
        (message.role !== "user" && message.role !== "assistant")) {
      throw new InputError("Invalid message");
    }
    return { role: message.role, content: text(message.content, "Message") };
  });
  if (messages.at(-1)?.role !== "user") throw new InputError("Last message must be from the user");
  return { messages, level, scenario };
}

export function challengeInput(body: Record<string, unknown>) {
  return { scenario: text(body.scenario, "Scenario"), userResponse: text(body.userResponse, "Response"), level: userLevel(body.level) };
}
