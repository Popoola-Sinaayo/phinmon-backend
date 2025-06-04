import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
  email: string;
  fullName: string;
  phoneNumber: string;
  country: string;
  monoAccountId: string;

  isOnboarded: boolean;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    email: { type: String, required: true },
    fullName: { type: String },
    phoneNumber: { type: String },
    isOnboarded: { type: Boolean },
    country: { type: String },
    monoAccountId: { type: String },
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model<IUser>("User", userSchema);
export default User;
