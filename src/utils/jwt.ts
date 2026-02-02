import jwt from "jsonwebtoken";

const JWT_TOKEN = process.env.JWT_TOKEN || "secret";

export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_TOKEN, {
    expiresIn: "7d",
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_TOKEN);
};
