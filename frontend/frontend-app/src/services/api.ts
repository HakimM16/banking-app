import { User, Account, Transaction, LoginFormInputs, RegisterFormInputs, ProfileFormInputs } from '@/types';
import axios from 'axios'; // Or just use native fetch

// In this file, we define the API functions that interact with the backend (Basically the endpoints we created in the backend).

// Define the base URL for your API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// API functions
export const api = {
    // User login
    login: async (data: LoginFormInputs) => {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, data);
        return response.data;
    },
    // User registration
    register: async (data: RegisterFormInputs) => {
        const response = await axios.post(`${API_BASE_URL}/auth/register`, data);
        return response.data;
    },

    // Get user profile
    getUserProfile: async (userId: number) => {
        const response = await axios.get<User>(`${API_BASE_URL}/users/${userId}`);
        return response.data;
    },

    updateUserProfile: async (userId: number, data: ProfileFormInputs) => {
        const response = await axios.put<User>(`${API_BASE_URL}/users/${userId}`, data);
        return response.data;
    },

    // Account management
    getAccounts: async (userId: number) => {
        const response = await axios.get<Account[]>(`${API_BASE_URL}/users/${userId}/accounts`);
        return response.data;
    },

    getAccountDetails: async (accountId: string) => {
        const response = await axios.get<Account>(`${API_BASE_URL}/accounts/${accountId}`);
        return response.data;
    },

    createAccount: async (userId: number, accountData: Omit<Account, 'id'>) => {
        const response = await axios.post<Account>(`${API_BASE_URL}/users/${userId}/accounts`, accountData);
        return response.data;
    },

    // Transactions
    getTransactions: async (userId: number) => {
        const response = await axios.get<Transaction[]>(`${API_BASE_URL}/users/${userId}/transactions`);
        return response.data;
    },

    createTransaction: async (transactionData: Omit<Transaction, 'id' | 'date'>) => {
        const response = await axios.post<Transaction>(`${API_BASE_URL}/transactions`, transactionData);
        return response.data;
    }
};
