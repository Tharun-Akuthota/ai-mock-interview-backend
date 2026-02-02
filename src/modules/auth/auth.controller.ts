import { Request, Response } from "express";
import { loginUser, registerUser } from "./auth.service";
import { generateToken } from "../../utils/jwt";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await registerUser(email, password); // it will return user id and mail

    return res.status(201).json({
      message: "User Registered Successfully",
      user,
    });
  } catch (err: any) {
    return res.status(400).json({
      message: err.message || "Registration Failed",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await loginUser(email, password);
    const token = generateToken(user.id.toString());

    return res.status(200).json({
      message: "Login Successful",
      token,
      user,
    });
  } catch (err: any) {
    return res.status(400).json({
      message: err.message || "Login Failed",
    });
  }
};
