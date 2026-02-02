import { Router } from "express";
import { createInterview } from "./interview.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.post("/start", authMiddleware, createInterview);

export default router;
