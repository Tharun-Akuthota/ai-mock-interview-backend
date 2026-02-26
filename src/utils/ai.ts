import dotenv from "dotenv";
dotenv.config();

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const generateAIResponse = async (
  conversation: { sender: "user" | "ai"; text: string }[],
): Promise<string> => {
  const history = conversation
    .map((msg) =>
      msg.sender === "user"
        ? `Candidate: ${msg.text}`
        : `Interviewer: ${msg.text}`,
    )
    .join("\n");

  const prompt = `
  You are a professional technical interviewer.
  
  For every candidate response: 
  1. Give constructive feedback on their answer.
  2. Give a score out of 10.
  3. Identify 1 strength.
  4. Identify 1 area for improvement.
  5.Ask the next technical question.

  Respond ONLY in valid JSON with this format:

  {
    "feedback": "...",
    "score": number,
    "strength": "...",
    "improvement": "...",
    "nextQuestion": "..."
  }

  Conversation so far:
  ${history}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("AI service failed");
  }
};
