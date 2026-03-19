import User from '../models/userModel';
import { IUser } from '../types/user';
import jwt from 'jsonwebtoken';

class AuthController {
    async isUserExists(username: string): Promise<boolean> {
        const user = await User.findOne({ username });
        return !!user;
    }

    async register(userData: Partial<IUser>, adminSecret?: string): Promise<IUser> {
        let role: 'user' | 'admin' = 'user';

        if (adminSecret === process.env.ADMIN_SECRET) {
            const adminExists = await User.findOne({ role: 'admin' });
            if (!adminExists) {
                role = 'admin';
            }
            else {
                throw new Error('Admin already exists');
            }
        }

        const user = new User({ ...userData, role });
        return await user.save();
    }

    async login(username: string, password: string): Promise<{ user: IUser, token: string }> {
        const user = await User.findOne({ username });
        if (!user) {
            throw new Error('Invalid username ');
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new Error('Invalid password');
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1h' }
        );

        return { user, token };
    }
}

export default new AuthController();
