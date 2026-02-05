import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export const generativeAIResponse = async (
  conversation: { sender: "user" | "ai"; text: string }[],
) => {
  const history = conversation
    .map((msg) =>
      msg.sender === "user" ? `User: ${msg.text}` : `Interviewer: ${msg.text}`,
    )
    .join("\n");

  const prompt = `
    You are a Professional technical interviewer.
    Ask one question at a time.
    After each answer, give constructive feedback and ask the next question.

    Conversation so far:
    ${history}

    Respond as the interviewer.
    `;

  const result = await model.generateContent(prompt);
  const response = await result.response;

  const text = response.text();
  return text;
};
