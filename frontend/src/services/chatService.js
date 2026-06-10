import api from "./api";

export const ask = async (question) => {
  const res = await api.post("/chat/ask", { question });

  return {
    answer: res.data.answer
  };
};