import { raw } from "express";
import { Interview } from "../../models/Interview";
import { generateAIResponse, generateInterviewSummary } from "../../utils/ai";

export const startInterview = async (userId: string, type: string) => {
  const interview = await Interview.create({
    userId,
    type,
    messages: [
      {
        sender: "ai",
        text: "Welcome to your mock interview. Tell me about yourself?",
        timestamp: new Date(),
      },
    ],
  });

  return interview;
};

export const addMessageToInterview = async (
  interviewId: string,
  userId: string,
  userMessage: string,
) => {
  const interview = await Interview.findOne({
    _id: interviewId,
    userId,
  });

  if (!interview) {
    throw new Error("Interview not found");
  }

  interview.messages.push({
    sender: "user",
    text: userMessage,
    timestamp: new Date(),
  });

  const rawAIResponse = await generateAIResponse(interview.messages);

  let parsed;

  try {
    const cleanedResponse = (rawAIResponse || "")
      .replace(/```[a-zA-Z]*/g, "")
      .replace(/```/g, "")
      .trim();

    parsed = JSON.parse(cleanedResponse);
  } catch (err) {
    parsed = {
      feedback: rawAIResponse,
      score: 5,
      strength: "N/A",
      improvement: "N/A",
      nextQuestion: "Can you explain further?",
    };
  }

  // Store feedback separately if you want later

  interview.messages.push({
    sender: "ai",
    text:
      parsed.feedback + "\n\nNext Question: " + parsed.nextQuestion ||
      "Can you explain further?",
    timestamp: new Date(),
    score: parsed.score,
    strength: parsed.strength,
    improvement: parsed.improvement,
  });

  const aiMessageWithScore = interview.messages.filter(
    (msg) => msg.sender === "ai" && msg.score !== undefined,
  );

  if (aiMessageWithScore.length > 0) {
    const total = aiMessageWithScore.reduce(
      (sum, msg) => sum + (msg.score || 0),
      0,
    );

    interview.score = Number((total / aiMessageWithScore.length).toFixed(1));
  }

  await interview.save();

  return interview;
};

export const getInterviewById = async (interviewId: string, userId: string) => {
  const interview = await Interview.findOne({ _id: interviewId, userId });

  if (!interview) {
    throw new Error("Interview not found");
  }

  return interview;
};

export const getDashboardStats = async (userId: string) => {
  const interviews = await Interview.find({ userId });

  const totalInterviews = interviews.length;
  const completed = interviews.filter((i) => i.score);

  const averageScore =
    completed.length > 0
      ? (
          completed.reduce((sum, i) => sum + (i.score || 0), 0) /
          completed.length
        ).toFixed(1)
      : 0;

  return {
    totalInterviews,
    averageScore,
  };
};

export const endInterview = async (interviewId: string, userId: string) => {
  const interview = await Interview.findOne({ _id: interviewId, userId });

  if (!interview) {
    throw new Error("Interview not found");
  }

  const aiMessages = interview.messages.filter((msg) => msg.sender === "ai");
  const strengths = aiMessages
    .map((msg) => msg.strength)
    .filter((s): s is string => Boolean(s));
  const improvements = aiMessages
    .map((msg) => msg.improvement)
    .filter((i): i is string => Boolean(i));
  const averageScore = interview.score || 0;

  const rawSummary = await generateInterviewSummary({
    averageScore,
    strengths,
    improvements,
    type: interview.type,
  });

  let parsed;

  try {
    parsed = JSON.parse(rawSummary);
  } catch (err) {
    parsed = {
      summary: rawSummary,
      recommendation: "N/A",
      roadmap: "N/A",
    };
  }

  interview.summary = parsed.summary;
  interview.finalRecommendation = parsed.recommendation;

  await interview.save();
  return interview;
};
