import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
  email: string;
  fullName: string;
  phoneNumber: string;
  country: string;
  monoAccountId: string[];
  balance: number;
  previousBalance: number;
  currentPercent: number;
  isOnboarded: boolean;
  pushToken: string;
  preferences: {
    notifications: "all" | "over_set_amount" | "balance_below_amount" | "none";
    notificationSetAmount: number;
    userMappedKeyWords: {
      food: string[];
      transport: string[];
      shopping: string[];
      bills: string[];
      entertainment: string[];
      savings: string[];
      health: string[];
      education: string[];
      subscriptions: string[];
      gifting: string[];
      home: string[];
      income: string[];
      bank_charges: string[];
      donations: string[];
    };
  };
}

const userSchema = new mongoose.Schema<IUser>(
  {
    email: { type: String, required: true },
    fullName: { type: String },
    phoneNumber: { type: String },
    isOnboarded: { type: Boolean },
    country: { type: String },
    monoAccountId: [{ type: String }],
    balance: { type: Number, default: 0 },
    previousBalance: { type: Number, default: 0 },
    currentPercent: { type: Number, default: 0 },
    pushToken: { type: String },
    preferences: {
      notifications: {
        type: String,
        enum: ["all", "over_set_amount", "balance_below_amount", "none"],
      },
      notificationSetAmount: { type: Number, default: 0 },
      userMappedKeyWords: {
        food: [String],
        transport: [String],
        shopping: [String],
        bills: [String],
        entertainment: [String],
        savings: [String],
        health: [String],
        education: [String],
        subscriptions: [String],
        gifting: [String],
        home: [String],
        income: [String],
        bank_charges: [String],
        donations: [String],
      },
    },
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model<IUser>("User", userSchema);
export default User;
