import { Interview } from "../../models/Interview";
import { generateAIResponse } from "../../utils/ai";

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

  const aiReply = await generateAIResponse(interview.messages);

  interview.messages.push({
    sender: "ai",
    text: aiReply || "Sorry, I couldn't respond",
    timestamp: new Date(),
  });

  await interview.save(); // Save to DB

  return interview;
};

export const getInterviewById = async (interviewId: string, userId: string) => {
  const interview = await Interview.findOne({ _id: interviewId, userId });

  if (!interview) {
    throw new Error("Interview not found");
  }

  return interview;
};
