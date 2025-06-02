import User, { IUser } from "../model/user";


class UserRepository {
    async createUser(userData: Partial<IUser>) {
        const user = await User.create(userData);
        return user;
    }

    async getUserByEmail(email: string) {
        const user = await User.find({ email })
        return user;
    }

    async getUserById(userId: string) {
        const user = await User.findById(userId);
        return user;
    }
    async updateUser(userId: string, updateData: Partial<IUser>) {
        const user = await User.findByIdAndUpdate(userId, updateData, {
            new: true,
        })
    }
}

export default UserRepository