import OtpRepository from "../repository/otp";
import UserRepository from "../repository/user";

class UserService {
    private userRepository: UserRepository;
    private otpRepository: OtpRepository;

    constructor() { 
        this.userRepository = new UserRepository();
        this.otpRepository = new OtpRepository();
    }

    
}

export default UserService;