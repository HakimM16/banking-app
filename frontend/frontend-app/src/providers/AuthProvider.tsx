// src/providers/AuthProvider.tsx
'use client';

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { getUserByUsernamePassword } from '@/lib/data';
import { User, LoginFormInputs } from '@/types';
import {api} from "@/services/api"; // Import types

interface AuthContextType {
    currentUser: User | null;
    login: (loginData: LoginFormInputs) => Promise<{ success: boolean; message?: string; user?: User }>;
    logout: () => void;
    updateUserInContext: (updatedUser: User) => void;
    isAuthenticated: boolean;
    loading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Initialize auth state from localStorage
    useEffect(() => {
        const initAuth = () => {
            try {
                const storedUser = localStorage.getItem('currentUser');
                if (storedUser) {
                    const user = JSON.parse(storedUser);
                    setCurrentUser(user);
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error("Failed to parse stored user:", error);
                localStorage.removeItem('currentUser');
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = async (loginData: LoginFormInputs): Promise<{ success: boolean; message?: string; user?: User }> => {
        console.log('Login function called');
        try {
            const response = await api.login(loginData);
            console.log('API response:', response);

            if (response && response.token) {
                console.log('Setting user and auth state');
                setCurrentUser(response.email);
                setIsAuthenticated(true);

                // Store user data and token in localStorage
                localStorage.setItem('id', response.id.toString());
                localStorage.setItem('currentUser', JSON.stringify(response.email));
                localStorage.setItem('authToken', response.token);

                console.log('Auth state updated - isAuthenticated should be true');
                return { success: true, user: response.email };
            } else {
                console.log('Login failed:', response.message);
                return { success: false, message: response.message || 'Invalid credentials' };
            }
        } catch (error) {
            console.log('Login error:', error);
            return { success: false, message: 'Login failed. Please try again.' };
        }
    };

    const logout = () => {
        setCurrentUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('currentUser');
    };

    const updateUserInContext = (updatedUser: User) => {
        setCurrentUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    };

    // Always provide the context, don't block the entire app with loading screen
    return (
        <AuthContext.Provider value={{ currentUser, login, logout, updateUserInContext, isAuthenticated, loading }}>
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

