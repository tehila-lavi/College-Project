export interface Vacation {
    id: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    price: number;
    image: string;
    followersCount: number;
    isFollowed?: boolean;
}

export interface AddVacationPayload {
    name: string;
    image: string;
    description: string;
    price: number;
    startDate: string;
    endDate: string;
}
export interface VacationCardProps {
    vacation: Vacation;
    isAdmin: boolean;
    isFollowing: boolean;
    onFollow: (id: string) => void;
    onDelete?: (id: string) => void;
    onEdit?: (id: string) => void;
}
export type UpdateVacationPayload = Partial<AddVacationPayload>;
