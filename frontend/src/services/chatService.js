import api from "./api";

export const ask = async (question) => {
  const res = await api.post("/chat/ask", { question });

  const raw = res.data.answer;

  let parsed;

  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    console.error("Grok JSON parse error:", error);
    return { answer: "AI response format error." };
  }

  const text =
    parsed?.choices?.[0]?.message?.content ||
    "I couldn't understand the response.";

  return { answer: text };
};