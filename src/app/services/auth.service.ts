import { Injectable } from '@angular/core';

const USER_KEY = 'shophub_user';

@Injectable({ providedIn: 'root' })
export class AuthService {

    setUser(user: any): void {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    getUser(): any {
        const data = localStorage.getItem(USER_KEY);
        return data ? JSON.parse(data) : null;
    }

    isLoggedIn(): boolean {
        return !!localStorage.getItem(USER_KEY);
    }

    isAdmin(): boolean {
        const user = this.getUser();
        return user?.role === 'admin';
    }

    logout(): void {
        localStorage.removeItem(USER_KEY);
    }
}
