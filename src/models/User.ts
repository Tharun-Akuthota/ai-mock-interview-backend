import mongoose, { Schema, Document } from "mongoose";

// Any object that claims to be IUser must have these properties.
// extends Document, This interface is not just a plain object — it is a MongoDB document.

export interface IUser extends Document {
  email: string;
  passwordHash: string;

  // In MongoDB it’s stored as BSON Date, In Node, it becomes a JS Date
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

export const User = mongoose.model<IUser>("User", UserSchema);
