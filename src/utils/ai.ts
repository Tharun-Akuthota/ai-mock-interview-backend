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

    return response.text || "";
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("AI service failed");
  }
};

export const generateInterviewSummary = async (interviewData: {
  averageScore: number;
  strengths: string[];
  improvements: string[];
  type: string;
}) => {
  const prompt = `
  You are a senior ${interviewData.type} interviewer.

  Based on:
  - Average score:${interviewData.averageScore}
  - Strengths observed: ${interviewData.strengths.join(",")}
  - Areas needing improvement: ${interviewData.improvements.join(",")}

  Generate:
  1. A concise professional summary (4-5 sentences).
  2. A final hiring recommendation (Hire / Strong Hire / No Hire / Lean Hire)
  3. A clear improvement roadmap.

  Respond STRICTLY ONLY in valid JSON:

  {
    "summary": "string",
    "recommendation": "string",
    "roadmap": "string"
  }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text || "";
  } catch (error) {
    console.log("INTERVIEW SUMMARY ERROR: ", error);
    throw new Error("Unable to generate Interview Summary");
  }
};
