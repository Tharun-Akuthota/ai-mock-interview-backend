import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { createInterview, sendMessage } from "./interview.controller";

const router = Router();

router.post("/start", authMiddleware, createInterview);
router.post("/message", authMiddleware, sendMessage);

export default router;
