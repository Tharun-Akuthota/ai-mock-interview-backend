import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";
import interviewRoutes from "./modules/interview/interview.routes";
import { authMiddleware } from "./middleware/auth.middleware";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Backend is running successfully",
  });
});

app.get("/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You accessed a protected route",
  });
});

app.use("/auth", authRoutes);
app.use("/interview", interviewRoutes);

export default app;
