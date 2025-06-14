import config from "../config";
import { BaseError } from "../error";
import OtpRepository from "../repository/otp";
import UserRepository from "../repository/user";
import sendMail from "../sendMail";
import jwt from "jsonwebtoken";
import { otpTemplate } from "../utils/mailTemplates";
import { IUser } from "../model/user";
import { monoInstance, plaidInstance } from "../external/request";
import { CountryCode, Products } from "plaid";

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

  async initiateConnection(
    userId: string,
    institutionId: string,
    selectedAuthMethod: string
  ) {
    try {
      const user = await this.userRepository.getUserById(userId);
      if (!user) {
        throw new BaseError("User not found", 404);
      }
      const response = await monoInstance.post("/v2/accounts/initiate", {
        customer: {
          email: user.email,
          name: user.fullName,
        },
        scope: "auth",
        institution: {
          id: institutionId,
          auth_method: selectedAuthMethod,
        },
        redirect_url: "https://example.com/redirect",
      });
      return response.data;
    } catch (error) {
      console.error("Error in initiateConnection:", error);
      throw new BaseError("Failed to initiate connection", 500);
    }
  }

  async getAllInstitutions() {
    try {
      const response = await monoInstance.get("/v3/institutions");
      return response.data;
    } catch (error) {
      console.error("Error in getListOfInstitutions:", error);
      throw new BaseError("Failed to fetch institutions", 500);
    }
  }

  async exchangeCodeForToken(userId: string, code: string) {
    try {
      const user = await this.userRepository.getUserById(userId);
      if (!user) {
        throw new BaseError("User not found", 404);
      }
      const response = await monoInstance.post("/v2/accounts/auth", {
        code,
      });
      await this.userRepository.updateUser(userId, {});
      return response.data;
    } catch (error) {
      console.error("Error in exchangeCodeForToken:", error);
      throw new BaseError("Failed to exchange code for token", 500);
    }
  }

  async initiatePlaidLinkToken(userId: string) {
    try {
      const user = await this.userRepository.getUserById(userId);
      // const responseInst = await plaidInstance.institutionsGet({
      //   count: 10,
      //   offset: 0,
      //   country_codes: [CountryCode.Us],
      //   options: {
      //     products: [Products.Auth],
      //   },
      // });
      // console.log("Institutions:", responseInst.data.institutions);
      const response = await plaidInstance.linkTokenCreate({
        user: {
          client_user_id: userId,
          // email_address: user?.email,

          // phone_number: "+12025550143", // Placeholder, replace with actual phone number if available
        },
        client_name: "Phinmon",
        products: [Products.Auth],
        country_codes: [CountryCode.Us],
        language: "en",
        // institution_id: "ins_130958",
        // institution_id: "ins_109508",

        hosted_link: {
          completion_redirect_uri: "https://example.com/redirect",
          // delivery_method: "email" as any,
          is_mobile_app: false,
        },
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error in initiatePlaidLinkToken:", error);
      throw new BaseError("Failed to initiate Plaid link token", 500);
    }
  }

  async handleWebhookEvent(body: any) {
    try {
      console.log("Received webhook event:", body);
      const { event, data } = body;
      if (event === "mono.events.account_updated") {
      }
    } catch (error) {
      console.error("Error in handleWebhookEvent:", error);
      throw new BaseError("Failed to handle webhook event", 500);
    }
  }
}

export default UserService;
