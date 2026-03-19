const TOKEN_KEY = 'token';

class StorageService {
    getToken(): string | null {
        return localStorage.getItem(TOKEN_KEY);
    }

    setToken(token: string): void {
        localStorage.setItem(TOKEN_KEY, token);
    }

    removeToken(): void {
        localStorage.removeItem(TOKEN_KEY);
        this.removeFollowedVacations();
        this.removeUserInfo();
    }

    getUserInfo(): { firstName: string, lastName: string } | null {
        const data = localStorage.getItem('user_info');
        return data ? JSON.parse(data) : null;
    }

    setUserInfo(user: { firstName: string, lastName: string }): void {
        localStorage.setItem('user_info', JSON.stringify({
            firstName: user.firstName,
            lastName: user.lastName
        }));
    }

    removeUserInfo(): void {
        localStorage.removeItem('user_info');
    }

    getFollowedVacations(): string[] {
        const data = localStorage.getItem('followed_vacations');
        return data ? JSON.parse(data) : [];
    }

    setFollowedVacations(vacations: string[]): void {
        localStorage.setItem('followed_vacations', JSON.stringify(vacations));
    }

    addFollowedVacation(id: string): void {
        const current = this.getFollowedVacations();
        if (!current.includes(id)) {
            this.setFollowedVacations([...current, id]);
        }
    }

    removeFollowedVacation(id: string): void {
        const current = this.getFollowedVacations();
        this.setFollowedVacations(current.filter(vId => vId !== id));
    }

    removeFollowedVacations(): void {
        localStorage.removeItem('followed_vacations');
    }
}

export const storage = new StorageService();
