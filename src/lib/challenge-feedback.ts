export async function challengeFeedback(response: Response): Promise<string> {
  if (!response.ok) throw new Error("Challenge evaluation failed");
  const data: unknown = await response.json();
  if (!data || typeof data !== "object" || !("feedback" in data) ||
      typeof data.feedback !== "string" || !data.feedback.trim()) {
    throw new Error("Invalid challenge feedback");
  }
  return data.feedback;
}
