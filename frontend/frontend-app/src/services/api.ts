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
    GetTransactionsRequest, CreateTransactionCategoryFormInputs, AccountCount, TransactionCount
} from '@/types';
import axios, {AxiosResponse} from 'axios';
import {Decimal} from "decimal.js"; // Or just use native fetch

// In this file, we define the API functions that interact with the backend (Basically the endpoints we created in the backend).

// Define the base URL for your API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// API functions for interacting with the backend endpoints
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

        // Get user profile by user ID
        getUserProfile: async (userId: number) => {
            const response = await axios.get<User>(`${API_BASE_URL}/user/${userId}`);
            return response.data;
        },

        // Update user profile
        updateUserProfile: async (userId: number, data: UpdateUserFormInputs) => {
            const response = await axios.put<User>(`${API_BASE_URL}/user/${userId}`, data);
            return response.data;
        },

        // Create a new address for the user
        createUserAddress: async (userId: number, data: CustomiseAddressFormInputs) => {
            const response = await axios.post<Address>(`${API_BASE_URL}/user/${userId}/create_address`, data);
            return response.data;
        },

        // Update user's address
        updateUserAddress: async (userId: number, data: CustomiseAddressFormInputs) => {
            const response = await axios.put<Address>(`${API_BASE_URL}/user/${userId}/update_address`, data);
            return response.data;
        },

        // Get user's address
        getUserAddress: async (userId: number) => {
            const response = await axios.get<Address>(`${API_BASE_URL}/user/${userId}/address`);
            return response.data;
        },

        // ACCOUNTS

        // Get all accounts for a user
        getAccounts: async (userId: number) => {
            const response = await axios.get<Account[]>(`${API_BASE_URL}/accounts/user/${userId}`);
            return response.data;
        },

        // Get count of active accounts for a user
        getActiveAccounts: async (userId: number): Promise<AccountCount> => {
            const response: AxiosResponse<AccountCount> = await axios.get<AccountCount>(`${API_BASE_URL}/accounts/${userId}/active-accounts`);
            return response.data;
        },

        // Get total balance for a user
        getBalance: async (userId: number) => {
            const response = await axios.get<Decimal>(`${API_BASE_URL}/accounts/${userId}/total-balance`);
            return response.data;
        },

        // Get balance for account
        getAccountBalance: async (userId: number, accountId: number) => {
            const response = await axios.get<Decimal>(`${API_BASE_URL}/accounts/${userId}/${accountId}/balance`);
            return response.data;
        },

        // Create a new account for a user
        createAccount: async (userId: number, data: CreateAccountFormInputs) => {
            const response = await axios.post<Account>(`${API_BASE_URL}/accounts/${userId}`, data);
            return response.data;
        },

        // Update account status
        updateAccountStatus: async (userId: number, accountId: number, data: UpdateAccountStatusFormInputs) => {
            const response = await axios.patch<Account>(`${API_BASE_URL}/accounts/${userId}/${accountId}/status`, data);
            return response.data;
        },

        // TRANSACTIONS

        // Deposit funds into user's account
        deposit : async (userId: number, data: DepositFormInputs) => {
            const response = await axios.post<Transaction>(`${API_BASE_URL}/transactions/${userId}/deposit`, data);
            return response.data;
        },

        // Withdraw funds from user's account
        withdraw: async (userId: number, data: WithdrawFormInputs) => {
            const response = await axios.post<Transaction>(`${API_BASE_URL}/transactions/${userId}/withdraw`, data);
            return response.data;
        },

        // Transfer funds between accounts
        transfer: async (userId: number, data: TransferFormInputs) => {
            const response = await axios.post<Transaction>(`${API_BASE_URL}/transactions/${userId}/transfer`, data);
            return response.data;
        },

        // Get all transactions for a user's account
        getTransactions: async (userId: number) => {
            const response = await axios.get<Transaction[]>(`${API_BASE_URL}/transactions/${userId}/account`);
            return response.data;
        },

        // Get total count of transactions for a user
        getTransactionsCount: async (userId: number) => {
            const response = await axios.get<{TransactionCount}>(`${API_BASE_URL}/transactions/${userId}/total`);
            return response.data;
        },

    };