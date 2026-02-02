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
