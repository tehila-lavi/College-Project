import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/authService';
import type { UserInfo } from '../services/authService';

interface AuthContextType {
    isAuthenticated: boolean;
    userRole: 'user' | 'admin' | null;
    userId: string | null;
    isAdmin: boolean;
    user: UserInfo;
    login: (credentials: any) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserInfo>(authService.getUserInfo());

    const login = async (credentials: any) => {
        await authService.login(credentials);
        const userInfo = authService.getUserInfo();
        setUser(userInfo);
    };

    const logout = () => {
        authService.logout();
        setUser({ role: null, isAdmin: false, id: null, firstName: '', lastName: '' });
        window.location.href = '/login'; 
    };

    useEffect(() => {
        const handleForceLogout = () => logout();
        window.addEventListener('auth:logout', handleForceLogout);
        return () => window.removeEventListener('auth:logout', handleForceLogout);
    }, []);

    const value: AuthContextType = {
        isAuthenticated: !!user.id,
        userRole: user.role,
        userId: user.id,
        isAdmin: user.isAdmin,
        user,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
