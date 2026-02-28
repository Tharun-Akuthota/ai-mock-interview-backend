import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import {
  addMessageToInterview,
  getDashboardStats,
  startInterview,
  getInterviewById,
  endInterview,
} from "./interview.service";

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
    console.log("BODY : ", req.body);

    const { interviewId, message } = req.body;

    if (!interviewId || !message) {
      console.log("Missing interview id or message");
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
    console.error("ERROR: ", error);

    const status = error.message === "Interview not found" ? 404 : 500;

    return res.status(status).json({
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

export const dashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const stats = await getDashboardStats(req.user!.userId);
    res.json(stats);
  } catch (err) {
    res.status(500).json({
      message: "Failed to load dashboard stats",
    });
  }
};

export const completeInterview = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;
    const interview = await endInterview(id, userId);

    res.json({
      message: "Interview completed",
      interview,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};
