import httpClient from '../api/httpClient';
import type { Vacation, AddVacationPayload, UpdateVacationPayload } from '../types/vacation';

class VacationService {

    async getAllVacations(): Promise<Vacation[]> {
        try {
            const response = await httpClient.get<any[]>('/vacations');
            return response.data.map(v => ({
                ...v,
                id: v.id || v._id
            }));
        } catch (error: any) {
            this.handleError(error);
        }
    }


    async addVacation(vacationData: AddVacationPayload): Promise<Vacation> {
        try {
            const response = await httpClient.post<Vacation>('/vacations', vacationData);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }


    async updateVacation(id: string, vacationData: UpdateVacationPayload): Promise<Vacation> {
        try {
            const response = await httpClient.put<Vacation>(`/vacations/${id}`, vacationData);
            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }


    async deleteVacation(id: string): Promise<{ message: string }> {
        try {
            const response = await httpClient.delete(`/vacations/${id}`);
            return { message: response.data || 'Vacation deleted successfully' };
        } catch (error: any) {
            this.handleError(error);
        }
    }


    async followVacation(vacationId: string): Promise<{ message: string }> {
        try {
            const response = await httpClient.post('/vacations/follow', { vacationId });
            return { message: response.data?.message || 'Follow status updated successfully' };
        } catch (error: any) {
            this.handleError(error);
        }
    }


    private handleError(error: any): never {
        let errorMessage = 'An unexpected error occurred.';

        if (error.response) {
            errorMessage = error.response.data?.message || `Server Error: ${error.response.status}`;
        } else if (error.request) {
            errorMessage = 'No response received from the server. Please check your network.';
        } else {
            errorMessage = error.message;
        }

        throw new Error(errorMessage);
    }
}

export default new VacationService();
