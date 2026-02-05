import mongoose, { Schema, Document, Mongoose } from "mongoose";

export interface IMessage {
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
}

export interface IInterview extends Document {
  userId: mongoose.Types.ObjectId;
  type: string;
  messages: IMessage[];
  feedback?: string;
  score?: string;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  sender: {
    type: String,
    enum: ["user", "ai"],
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  }, // added inside bcs each msg needed its own time
});

const InterviewSchema = new Schema<IInterview>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", // "This ObjectId refers to a document in another collection."
      required: true,
    },

    type: {
      type: String,
      required: true,
    },
    messages: [MessageSchema],
    feedback: {
      type: String,
    },
    score: Number,
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // added outside {} bcs it is Mongoose Option, automatic feature added/maintained by Mongoose
  },
);

export const Interview = mongoose.model<IInterview>(
  "Interview", // Model name
  InterviewSchema,
);
