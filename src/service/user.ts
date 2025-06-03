import config from "../config";
import { BaseError } from "../error";
import OtpRepository from "../repository/otp";
import UserRepository from "../repository/user";
import sendMail from "../sendMail";
import jwt from "jsonwebtoken";
import { otpTemplate } from "../utils/mailTemplates";
import { IUser } from "../model/user";

class UserService {
  private userRepository: UserRepository;
  private otpRepository: OtpRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.otpRepository = new OtpRepository();
  }

  async authenticateUser(email: string): Promise<any> {
    try {
      const user = await this.userRepository.getUserByEmail(email);
      if (user) {
        await this.createSendOtp(email);
        return user;
      } else {
        const user = await this.userRepository.createUser({
          email,
        });
        await this.createSendOtp(email);
        return user;
      }
    } catch (error) {
      console.error("Error in authenticateUser:", error);
      throw new BaseError("Authentication failed", 500);
    }
  }

  async createSendOtp(email: string) {
    const user = this.userRepository.getUserByEmail(email);
    if (!user) {
      throw new BaseError("User does not exist", 404);
    }
    // Delete any existing OTP for the email before creating a new one
    await this.otpRepository.deleteOtpByEmail(email);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpDoc = await this.otpRepository.createOtp({
      email,
      otp: otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // OTP valid for 10 minutes
    });
    const OTP_TEMPLATE = otpTemplate(otpDoc.otp);
    await sendMail(email, "OTP Verification", OTP_TEMPLATE);
    return;
  }

  async verifyOtp(email: string, otp: string) {
    try {
      const otpDoc = await this.otpRepository.getOtpByEmail(email);
      if (!otpDoc) {
        throw new BaseError("OTP not found for this email", 404);
      }
      if (otpDoc.otp !== otp) {
        throw new BaseError("Invalid OTP", 400);
      }
      if (otpDoc.expiresAt < new Date()) {
        throw new BaseError("OTP has expired", 400);
      }
      const user = await this.userRepository.getUserByEmail(email);
      if (!user) {
        throw new BaseError("User not found", 404);
      }

      const token = jwt.sign(
        { id: user._id as string, email },
        config().JWT_SECRET
        // {
        //   expiresIn: "30d",
        // }
      );
      return {
        user,
        token,
      };
    } catch (error) {
      throw new BaseError("OTP verification failed", 500);
    }
  }

  async updateOnboardingInformation(userId: string, data: Partial<IUser>) {
    try {
      const user = await this.userRepository.updateUser(userId, data);
      return user;
    } catch (error) {
      console.error("Error in updateOnboardingInformation:", error);
      throw new BaseError("Failed to update onboarding information", 500);
    }
  }
}

export default UserService;
