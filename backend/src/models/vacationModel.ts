import mongoose, { Schema } from 'mongoose';
import { IVacation } from '../types/vacation';

const vacationSchema: Schema = new Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    followersCount: { type: Number, default: 0 }
}, {
    timestamps: true
});

const Vacation = mongoose.model<IVacation>('Vacation', vacationSchema);

export default Vacation;
