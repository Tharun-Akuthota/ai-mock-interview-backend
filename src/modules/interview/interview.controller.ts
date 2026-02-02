import { Response } from "express";
import { startInterview } from "./interview.service";
import { AuthRequest } from "../../middleware/auth.middleware";

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
