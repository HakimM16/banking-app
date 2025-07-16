// src/providers/AuthProvider.tsx
'use client';

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { getUserByUsernamePassword } from '@/lib/data';
import { User, LoginFormInputs } from '@/types'; // Import types

interface AuthContextType {
    currentUser: User | null;
    login: (username: string, password: string) => Promise<{ success: boolean; message?: string; user?: User }>;
    logout: () => void;
    updateUserInContext: (updatedUser: User) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (username: string, password: string): Promise<{ success: boolean; message?: string; user?: User }> => {
        setLoading(true);
        const user = await getUserByUsernamePassword(username, password);
        if (user) {
            setCurrentUser(user);
            localStorage.setItem('currentUser', JSON.stringify(user));
            setLoading(false);
            return { success: true, user };
        } else {
            setLoading(false);
            return { success: false, message: 'Invalid credentials. Please try again.' };
        }
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('currentUser');
    };

    const updateUserInContext = (updatedUser: User) => {
        setCurrentUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p>Loading user session...</p>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ currentUser, login, logout, updateUserInContext }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};