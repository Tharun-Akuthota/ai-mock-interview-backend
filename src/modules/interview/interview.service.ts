import { Interview } from "../../models/Interview";

export const startInterview = async (userId: string, type: string) => {
  const interview = await Interview.create({
    userId,
    type,
    messages: [
      {
        sender: "ai",
        text: "Welcome to your mock interview. Tell me about yourself?",
        timeStamp: new Date(),
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
    timeStamp: new Date(),
  });

  const aiReply = "That's a good point. Can you explain it in detail?";

  interview.messages.push({
    sender: "ai",
    text: aiReply,
    timeStamp: new Date(),
  });

  await interview.save(); // Save to DB

  return interview;
};
