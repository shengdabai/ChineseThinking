// Network chunks can split both UTF-8 characters and SSE JSON records.
export async function* readChatStream(stream: ReadableStream<Uint8Array>): AsyncGenerator<string> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) throw new Error("Chat stream ended before completion");
      buffer += decoder.decode(value, { stream: true });
      let newline;
      while ((newline = buffer.indexOf("\n")) !== -1) {
        const line = buffer.slice(0, newline).trimEnd();
        buffer = buffer.slice(newline + 1);
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6);
        if (data === "[DONE]") return;
        const event: unknown = JSON.parse(data);
        if (!event || typeof event !== "object" || "error" in event ||
            !("text" in event) || typeof event.text !== "string") {
          throw new Error("Chat stream failed");
        }
        yield event.text;
      }
    }
  } finally {
    await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}
