import OTP, { IOTP } from "../model/otp";

class OtpRepository {

    async createOtp(otpData: Partial<IOTP>) {
        const otp = await OTP.create(otpData);
        return otp;
    }

    async getOtpByEmail(email: string) {
        const otp = await OTP.findOne({ email })
        return otp;
    }

    async deleteOtpByEmail(email: string) {
        const otp = await OTP.deleteOne({ email });
        return otp;
    }
}


export default OtpRepository;