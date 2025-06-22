import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
  email: string;
  fullName: string;
  phoneNumber: string;
  country: string;
  monoAccountId: string;
  balance: number;
  currentPercent: number;
  isOnboarded: boolean;
  pushToken: string;
  preferences: {
    notifications: "all" | "over_set_amount" | "balance_below_amount" | "none";
    notificationSetAmount: number;
  };
}

const userSchema = new mongoose.Schema<IUser>(
  {
    email: { type: String, required: true },
    fullName: { type: String },
    phoneNumber: { type: String },
    isOnboarded: { type: Boolean },
    country: { type: String },
    monoAccountId: { type: String },
    balance: { type: Number, default: 0 },
    currentPercent: { type: Number, default: 0 },
    pushToken: { type: String },
    preferences: {
      notifications: {
        type: String,
        enum: ["all", "over_set_amount", "balance_below_amount", "none"],
      },
      notificationSetAmount: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model<IUser>("User", userSchema);
export default User;
