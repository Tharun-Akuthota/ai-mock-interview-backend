import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
  };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Unauthorized - No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = verifyToken(token) as { userId: string }; // type assertion, “Trust me. I know what I’m doing. This object has a userId string inside.”

    req.user = { userId: decoded.userId };

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Unauthorized - Invalid token",
    });
  }
};
