import User, { IUser } from "../model/user";
import { categoryKeywords } from "../utils/categoryKeywords";

class UserRepository {
  async createUser(userData: Partial<IUser>) {
    const user = await User.create({
      ...userData,
      preferences: {
        nottifications: "all",
        notificationSetAmount: 0,
        userMappedKeyWords: categoryKeywords,
      },
    });
    return user;
  }

  async getUserByEmail(email: string) {
    const user = await User.findOne({ email });
    return user;
  }

  async getUserById(userId: string) {
    const user = await User.findById(userId);
    return user;
  }

  async getUserByMonoAccountId(monoAccountId: string) {
    const user = await User.findOne({ monoAccountId });
    return user;
  }
  async updateUser(userId: string, updateData: Partial<IUser>) {
    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
    return user;
  }
}

export default UserRepository