import mongoose from "mongoose";

export interface IChatWithAI extends mongoose.Document {
  userId: string;
  question: string;
  answer: string;
  timestamp: Date;
}

const chatWithAISchema = new mongoose.Schema<IChatWithAI>(
  {
    userId: { type: String, required: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const ChatWithAI = mongoose.model<IChatWithAI>("ChatWithAI", chatWithAISchema);
export default ChatWithAI;
