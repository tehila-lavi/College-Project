import Vacation from '../models/vacationModel';
import { IVacation } from '../types/vacation';
import User from '../models/userModel';
import { Types } from 'mongoose';
import { getIO } from '../sockets/socketManager';

class VacationController {
    async getVacations(userId: Types.ObjectId): Promise<IVacation[]> {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const allVacations = await Vacation.find();


        const isFollowed = (vacationId: Types.ObjectId) => user.followedVacations.some(id => id.equals(vacationId));

        const followed: IVacation[] = [];
        const upcoming: IVacation[] = [];
        const past: IVacation[] = [];

        const now = new Date();

        allVacations.forEach(vacation => {
            if (isFollowed(vacation._id as Types.ObjectId)) {
                followed.push(vacation);
            } else if (new Date(vacation.startDate) >= now) {
                upcoming.push(vacation);
            } else {
                past.push(vacation);
            }
        });


        followed.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
        upcoming.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
        past.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

        return [...followed, ...upcoming, ...past];
    }

    async addVacation(vacationData: Partial<IVacation>): Promise<IVacation> {
        const vacation = new Vacation(vacationData);
        const savedVacation = await vacation.save();
        getIO().emit('vacation_added', savedVacation);
        return savedVacation;
    }

    async updateVacation(vacationId: string, vacationData: Partial<IVacation>): Promise<IVacation | null> {
        const updated = await Vacation.findByIdAndUpdate(vacationId, vacationData, { new: true });
        if (updated) {
            getIO().emit('vacation_updated', updated);
        }
        return updated;
    }

    async deleteVacation(vacationId: string): Promise<void> {
        const deleted = await Vacation.findByIdAndDelete(vacationId);
        if (deleted) {
            getIO().emit('vacation_deleted', vacationId);
        }
    }

    async followVacation(userId: Types.ObjectId, vacationId: string): Promise<void> {
        const isFollowed = await User.findOne({ _id: userId, followedVacations: vacationId });

        if (isFollowed) {

            await User.findByIdAndUpdate(userId, { $pull: { followedVacations: vacationId } });
            const updated = await Vacation.findByIdAndUpdate(vacationId, { $inc: { followersCount: -1 } }, { new: true });
            if (updated) getIO().emit('vacation_updated', updated);
        } else {

            await User.findByIdAndUpdate(userId, { $addToSet: { followedVacations: vacationId } });
            const updated = await Vacation.findByIdAndUpdate(vacationId, { $inc: { followersCount: 1 } }, { new: true });
            if (updated) getIO().emit('vacation_updated', updated);
        }
    }
}

export default new VacationController();
