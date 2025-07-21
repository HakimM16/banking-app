import {
    User,
    Address,
    Account,
    Transaction,
    LoginFormInputs,
    RegisterFormInputs,
    UpdateUserFormInputs,
    UpdateStatusFormInputs,
    CustomiseAddressFormInputs,
    UpdateAccountFormInputs,
    CreateAccountFormInputs,
    UpdateAccountStatusFormInputs,
    DepositFormInputs,
    WithdrawFormInputs,
    TransferFormInputs,
    GetTransactionsRequest, CreateTransactionCategoryFormInputs
} from '@/types';
import axios from 'axios';
import {Decimal} from "decimal.js"; // Or just use native fetch

// In this file, we define the API functions that interact with the backend (Basically the endpoints we created in the backend).

// Define the base URL for your API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// API functions
export const api = {
    // AUTH
    // User login
    login: async (data: LoginFormInputs) => {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, data);
        console.log(`Response data: email=${data.email}, password=${data.password}`);
        if (response.data.token) {
            // Store the token in localStorage (if needed)
            localStorage.setItem('authToken', response.data.token);

            // Set the default Authorization header for all future axios requests
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        }
        return response.data;
    },
    // User registration
    register: async (data: RegisterFormInputs) => {
        const response = await axios.post(`${API_BASE_URL}/auth/register`, data);
        console.log(`Response data: email=${data.email}, password=${data.password}`);
        return response.data;
    },

    // USERS
    getUserProfile: async (userId: number) => {
        const response = await axios.get<User>(`${API_BASE_URL}/user/${userId}`);
        return response.data;
    },

    updateUserProfile: async (userId: number, data: UpdateUserFormInputs) => {
        const response = await axios.put<User>(`${API_BASE_URL}/user/${userId}`, data);
        return response.data;
    },

    deleteUser: async (userId: number) => {
        const response = await axios.delete(`${API_BASE_URL}/user/${userId}`);
        return response.data;
    },

    changeUserStatus: async (userId: number, data: UpdateStatusFormInputs) => {
        const response = await axios.put<User>(`${API_BASE_URL}/user/${userId}/status`, data);
        return response.data;
    },

    createUserAddress: async (userId: number, data: CustomiseAddressFormInputs) => {
        const response = await axios.post<Address>(`${API_BASE_URL}/user/${userId}/create_address`, data);
        return response.data;
    },

    updateUserAddress: async (userId: number, data: CustomiseAddressFormInputs) => {
        const response = await axios.put<Address>(`/api/user/${userId}/update_address`, data);
        return response.data;
    },

    getUserAddress: async (userId: number) => {
        const response = await axios.get<Address>(`${API_BASE_URL}/user/${userId}/address`);
        return response.data;
    },

    // ACCOUNTS
    getAccounts: async (userId: number) => {
        const response = await axios.get<Account[]>(`${API_BASE_URL}/accounts/user/${userId}`);
        return response.data;
    },

    getAccount: async (userId: number, accountId: number) => {
        const response = await axios.get<Account>(`${API_BASE_URL}/accounts/${userId}/${accountId}`);
        return response.data;
    },

    closeAccount: async (userId: number, accountId: number) => {
        const response = await axios.delete(`${API_BASE_URL}/accounts/${userId}/${accountId}`);
        return response.data;
    },

    updateAccountType: async (userId: number, accountId: number, data: UpdateAccountFormInputs) => {
        const response = await axios.patch<Account>(`${API_BASE_URL}/accounts/${userId}/${accountId}`, data);
        return response.data;
    },

    getBalance: async (userId: number, accountId: number) => {
        const response = await axios.get<Decimal>(`${API_BASE_URL}/accounts/${userId}/${accountId}/balance`);
        return response.data;
    },

    createAccount: async (userId: number, data: CreateAccountFormInputs) => {
        const response = await axios.post<Account>(`${API_BASE_URL}/accounts/${userId}`, data);
        return response.data;
    },

    updateAccountStatus: async (userId: number, accountId: number, data: UpdateAccountStatusFormInputs) => {
        const response = await axios.patch<Account>(`${API_BASE_URL}/accounts/${userId}/${accountId}/status`, data);
        return response.data;
    },

    // TRANSACTIONS
    deposit : async (userId: number, data: DepositFormInputs) => {
        const response = await axios.post<Transaction>(`${API_BASE_URL}/transactions/${userId}/deposit`, data);
        return response.data;
    },

    withdraw: async (userId: number, data: WithdrawFormInputs) => {
        const response = await axios.post<Transaction>(`${API_BASE_URL}/transactions/${userId}/withdraw`, data);
        return response.data;
    },

    transfer: async (userId: number, data: TransferFormInputs) => {
        const response = await axios.post<Transaction>(`${API_BASE_URL}/transactions/${userId}/transfer`, data);
        return response.data;
    },

    getTransactions: async (userId: number, accountId: number, data: GetTransactionsRequest) => {
            const response = await axios.get<Transaction[]>(`${API_BASE_URL}/transactions/${userId}/account/${accountId}`, {
                params: data
            });
            return response.data
    },

    // TRANSACTION CATEGORIES

    getTransactionCategory: async (name: string) => {
        const response = await axios.get<Transaction>(`${API_BASE_URL}/transaction-categories/${name}`);
        return response.data;
    },

    getTransactionCategories: async () => {
        const response = await axios.get<Transaction[]>(`${API_BASE_URL}/transaction-categories`);
        return response.data;
    },

    createTransactionCategory: async (data: CreateTransactionCategoryFormInputs) => {
        const response = await axios.post<Transaction>(`${API_BASE_URL}/transaction-categories`, data);
        return response.data;
    }
};
