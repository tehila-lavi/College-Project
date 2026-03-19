export interface IVacation extends Document {
    name: string;
    image: string;
    description: string;
    price: number;
    startDate: Date;
    endDate: Date;
    followersCount: number;
    createdAt: Date;
    updatedAt: Date;
}