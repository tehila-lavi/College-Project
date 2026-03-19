import { Types } from "mongoose";

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    username: string;
    password?: string;
    role: 'user' | 'admin';
    followedVacations: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}