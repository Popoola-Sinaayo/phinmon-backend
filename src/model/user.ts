import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
  email: string;
  fullName: string;
  phoneNumber: string;

  isOnboarded: boolean;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    isOnboarded: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model<IUser>("User", userSchema);
export default User;
