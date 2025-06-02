import mongoose from "mongoose";

export interface IOTP extends mongoose.Document {
  email: string;
  otp: string;
  expiresAt: Date;
}
const otpSchema = new mongoose.Schema<IOTP>(
  {
    email: { type: String, required: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);
const OTP = mongoose.model<IOTP>("OTP", otpSchema);
export default OTP;