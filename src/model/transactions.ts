import mongoose from "mongoose";

export interface ITransaction extends mongoose.Document {
    transactionId: string;
    type: "credit" | "debit";
  userId: string;
  monoTransactionId: string;
  amount: number;
  currency: string;
  description: string;
  category: string;
  date: Date;
}

const transactionSchema = new mongoose.Schema<ITransaction>(
  {
    transactionId: { type: String, required: true, unique: true },
    type: { type: String, enum: ["credit", "debit"], required: true },
    userId: { type: String, required: true },
    monoTransactionId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    date: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model<ITransaction>("Transaction", transactionSchema);
export default Transaction;