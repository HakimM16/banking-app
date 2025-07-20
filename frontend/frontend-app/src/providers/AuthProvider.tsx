// src/providers/AuthProvider.tsx
'use client';

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { getUserByUsernamePassword } from '@/lib/data';
import {User, LoginFormInputs, RegisterFormInputs, CustomiseAddressFormInputs} from '@/types';
import {api} from "@/services/api"; // Import types

interface AuthContextType {
    currentUser: User | null;
    register: (registerData: RegisterFormInputs) => Promise<{ success: boolean; id?: number; message?: string }>;
    login: (loginData: LoginFormInputs) => Promise<{ success: boolean; message?: string; user?: User }>;
    createAddress: (addressData: CustomiseAddressFormInputs, id: number | null) => Promise<{ success: boolean; message?: string }>;
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

    const register = async (registerData: RegisterFormInputs): Promise<{ success: boolean; id?: number; message?: string;  }> => {
        console.log('Register function called with data:', registerData);
        try {
            const response = await api.register(registerData);
            console.log('API response:', response);

            if (response) {
                console.log('Registration successful');
                return { success: true, id: response.id };
            } else {
                console.log('Registration failed:', response.message);
                return { success: false, message: response.message || 'Registration failed' };
            }
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, message: 'Registration failed. Please try again.' };
        }
    };

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

    const createAddress = async (addressData: CustomiseAddressFormInputs, id: number | null): Promise<{ success: boolean; message?: string }> => {
        console.log('Create address function called with data:', addressData);
        try {

            if (id !== null) {

                const response = await api.createUserAddress(id, addressData);
                console.log('API response:', response);

                if (response) {
                    console.log('Address creation successful');
                    return {success: true};
                } else {
                    console.log('Address creation failed:');
                    return {success: false, message: 'Address creation failed'};
                }
            } else {
                return { success: false, message: 'Invalid user ID' };
            }
        } catch (error) {
            console.error('Address creation error:', error);
            return { success: false, message: 'Address creation failed. Please try again.' };
        }
    }

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
        <AuthContext.Provider value={{ currentUser, register, login, createAddress, logout, updateUserInContext, isAuthenticated, loading }}>
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

