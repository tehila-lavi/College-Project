import mongoose, { Schema, Document, Types } from 'mongoose';
import bcrypt from 'bcrypt';
import { IUser } from '../types/user';

const userSchema: Schema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    followedVacations: [{ type: Schema.Types.ObjectId, ref: 'Vacation' }]
}, {
    timestamps: true
});


userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    try {
        const pepper = process.env.PEPPER || '';
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password + pepper, salt);
    } catch (error) {
        throw error;
    }
});


userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    const pepper = process.env.PEPPER || '';
    return await bcrypt.compare(candidatePassword + pepper, this.password as string);
};


userSchema.set('toJSON', {
    transform: (doc: unknown, ret: any) => {
        delete ret.password;
        return ret;
    }
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
