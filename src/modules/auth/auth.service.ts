import bcrypt from "bcrypt";

import { User } from "../../models/User";

export const registerUser = async (email: string, password: string) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("User Already Exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    passwordHash,
  });

  return {
    id: user._id,
    email: user.email,
  };
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid Credentials");
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);

  if (!isMatch) {
    throw new Error("Invalid Credentials");
  }

  return {
    id: user._id,
    email: user.email,
  };
};
