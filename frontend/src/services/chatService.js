import api from "./api";

export const ask = async (question) => {
  const res = await api.post("/chat/ask", { question });

<<<<<<< HEAD
  return {
    answer: res.data.answer
  };
=======
  // Backend already parses the Groq response and returns plain text in "answer"
  const answer = res.data.answer || "I couldn't understand the response.";

  return { answer };
>>>>>>> fccfd41 (Fix chatbot, scanner, cart and login issues)
};