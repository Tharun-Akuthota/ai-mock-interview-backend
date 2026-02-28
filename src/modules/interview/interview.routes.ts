import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import {
  createInterview,
  dashboardStats,
  getInterview,
  sendMessage,
  completeInterview,
} from "./interview.controller";

const router = Router();

router.post("/start", authMiddleware, createInterview);
router.post("/message", authMiddleware, sendMessage);
router.get("/dashboard/stats", authMiddleware, dashboardStats);
router.get("/:id", authMiddleware, getInterview);
router.post("/:id/complete", authMiddleware, completeInterview);

export default router;
