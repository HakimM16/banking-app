// src/providers/AuthProvider.tsx
'use client';

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import {
    User,
    LoginFormInputs,
    RegisterFormInputs,
    CustomiseAddressFormInputs,
    UpdateUserFormInputs,
    Email
} from '@/types';
import {api} from "@/services/api";
import axios from "axios"; // Import types

// Define the shape of the authentication context
interface AuthContextType {
    currentUser: string | null;
    register: (registerData: RegisterFormInputs) => Promise<{ success: boolean; id?: number; message?: string }>;
    login: (loginData: LoginFormInputs) => Promise<{ success: boolean; message?: string; user?: User }>;
    getUser: (id: number | null) => Promise<User | null>;
    updateUser: (id: number | null, userData: UpdateUserFormInputs) => Promise<{ success: boolean; message?: string }>;
    emailExists: (email: string) => Promise<{ exists: boolean; message?: string }>;
    createAddress: (addressData: CustomiseAddressFormInputs, id: number | null) => Promise<{ success: boolean; message?: string }>;
    getAddress: (id: number | null) => Promise<{ success: boolean; address?: CustomiseAddressFormInputs; message?: string }>;
    updateAddress: (id: number | null, addressData: CustomiseAddressFormInputs) => Promise<{ success: boolean; message?: string }>;
    logout: () => void;
    isAuthenticated: boolean;
    loading: boolean;
    isTokenValid: () => boolean;
}

// Create the authentication context
export const AuthContext = createContext<AuthContextType | null>(null);

// AuthProvider component to wrap the app and provide authentication state and actions
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    // State for the current user
    const [currentUser, setCurrentUser] = useState<string | null>(null);
    // State for loading status
    const [loading, setLoading] = useState(true);
    // State for authentication status
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Initialize auth state from localStorage on mount
    useEffect(() => {
        const initAuth = () => {
            try {
                const storedUser = localStorage.getItem('currentUser');
                const token = isTokenValid();
                if (storedUser) {
                    try {
                        // Try to parse as JSON first
                        const user = storedUser;
                        setCurrentUser(user);
                        setIsAuthenticated(true);
                    } catch {
                        // If it's not JSON, treat it as a plain string
                        setCurrentUser(storedUser);
                        setIsAuthenticated(true);
                    }
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

    // Check if the authorization token in localStorage is valid (not expired)
    const isTokenValid = (): boolean => {
        const token = localStorage.getItem('authToken');
        if (!token) return false;

        try {
            // Assuming JWT: decode payload to check exp
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (!payload.exp) return false;
            // exp is in seconds since epoch
            return Date.now() < payload.exp * 1000;
        } catch {
            return false;
        }
    };

    // Register a new user
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

    // Log in a user
    const login = async (loginData: LoginFormInputs): Promise<{ success: boolean; message?: string; user?: User }> => {
        try {
            const response = await api.login(loginData);

            if (response && response.token) {
                console.log('Setting user and auth state');
                setCurrentUser(response.email);
                setIsAuthenticated(true);

                // Store user data and token in localStorage
                localStorage.setItem('id', response.id.toString());
                localStorage.setItem('currentUser', response.email.toString());
                localStorage.setItem('name', response.name);

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

    // Retrieve a user by ID
    const getUser = async (id: number | null): Promise<User | null> => {
        console.log('Get user function called with ID:', id);
        try {
            if (id !== null) {
                const response = await api.getUserProfile(id);

                if (response) {
                    console.log('User retrieval successful');
                    return response;
                } else {
                    console.log('User retrieval failed');
                    return null;
                }
            } else {
                console.log('Invalid user ID');
                return null;
            }
        } catch (error) {
            console.error('User retrieval error:', error);
            return null;
        }
    }

    // Update a user's profile
    const updateUser = async (id: number | null, userData: UpdateUserFormInputs): Promise<{ success: boolean; message?: string }> => {
        console.log('Update user function called with ID:', id, 'and data:', userData);
        try {
            if (id !== null) {
                const response = await api.updateUserProfile(id, userData);
                console.log('API response:', response);

                if (response) {
                    console.log('User update successful');
                    return { success: true };
                } else {
                    console.log('User update failed');
                    return { success: false, message: 'User update failed' };
                }
            } else {
                return { success: false, message: 'Invalid user ID' };
            }
        } catch (error) {
            console.error('User update error:', error);
            return { success: false, message: 'User update failed. Please try again.' };
        }
    }

    const emailExists = async (email: string): Promise<{ exists: boolean; message?: string }> => {
        console.log('Email exists function called with email:', email);
        const token = localStorage.getItem('authToken');
        // Set default Authorization header for axios
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        try {
            const response = await api.emailExists(email);
            console.log('API response:', response);

            if (response) {
                console.log('Email exists');
                return { exists: true };
            } else {
                console.log('Email does not exist');
                return { exists: false };
            }
        } catch (error) {
            console.error('Email existence check error:', error);
            return { exists: false, message: 'Error checking email existence' };
        }
    }

    // Create a new address for a user
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

    // Retrieve a user's address by ID
    const getAddress = async (id: number | null): Promise<{ success: boolean; address?: CustomiseAddressFormInputs; message?: string }> => {
        console.log('Get address function called with ID:', id);
        try {
            if (id !== null) {
                const response = await api.getUserAddress(id);
                if (response) {
                    console.log('Address retrieval successful');
                    return { success: true, address: response };
                } else {
                    console.log('Address retrieval failed');
                    return { success: false, message: 'Address retrieval failed' };
                }
            } else {
                return { success: false, message: 'Invalid user ID' };
            }
        } catch (error) {
            console.error('Address retrieval error:', error);
            return { success: false, message: 'Address retrieval failed. Please try again.' };
        }
    }

    // Update a user's address
    const updateAddress = async (id: number | null, addressData: CustomiseAddressFormInputs): Promise<{ success: boolean; message?: string }> => {
        console.log('Update address function called with ID:', id, 'and data:', addressData);
        try {
            if (id !== null) {
                const response = await api.updateUserAddress(id, addressData);
                console.log('API response:', response);

                if (response) {
                    console.log('Address update successful');
                    return { success: true };
                } else {
                    console.log('Address update failed');
                    return { success: false, message: 'Address update failed' };
                }
            } else {
                return { success: false, message: 'Invalid user ID' };
            }
        } catch (error) {
            console.error('Address update error:', error);
            return { success: false, message: 'Address update failed. Please try again.' };
        }
    }

    // Log out the current user
    const logout = () => {
        setCurrentUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('currentUser');
    };

    // Always provide the context, don't block the entire app with loading screen
    return (
        <AuthContext.Provider value={{ currentUser, register, login, getUser, emailExists, createAddress, getAddress, updateAddress,  logout, updateUser, isAuthenticated, loading, isTokenValid }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
