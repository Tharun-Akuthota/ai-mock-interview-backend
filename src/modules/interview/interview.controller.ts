import { Response } from "express";
import { startInterview } from "./interview.service";
import { AuthRequest } from "../../middleware/auth.middleware";
import { addMessageToInterview } from "./interview.service";
import { getInterviewById } from "./interview.service";

export const createInterview = async (req: AuthRequest, res: Response) => {
  try {
    const { type } = req.body;

    if (!type) {
      return res.status(400).json({
        message: "Interview type is required",
      });
    }

    const userId = req.user!.userId; // non-null ! assertion

    const interview = await startInterview(userId, type);
    return res.status(201).json({
      message: "Interview started",
      interview,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to start interview",
    });
  }
};

export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { interviewId, message } = req.body;

    if (!interviewId || !message) {
      return res.status(400).json({
        message: "Interview Id and message are required",
      });
    }

    const userId = req.user!.userId;

    const interview = await addMessageToInterview(interviewId, userId, message);

    return res.status(200).json({
      message: "Message added",
      interview,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message || "Failed to send message",
    });
  }
};

export const getInterview = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;
    const interview = await getInterviewById(id, userId);

    return res.status(200).json({ interview });
  } catch (error: any) {
    return res.status(404).json({
      message: error.message,
    });
  }
};
