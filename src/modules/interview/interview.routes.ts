import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import {
  createInterview,
  getInterview,
  sendMessage,
} from "./interview.controller";
import { startInterview } from "./interview.service";

const router = Router();

router.post("/start", authMiddleware, createInterview);
router.post("/message", authMiddleware, sendMessage);
router.get("/:id", authMiddleware, getInterview);

export default router;
