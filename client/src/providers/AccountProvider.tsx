'use client';

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Account, CreateAccountFormInputs, UpdateAccountFormInputs, UpdateAccountStatusFormInputs, User } from '@/types';
import { api } from "@/services/api";
import { Decimal } from "decimal.js"; // Import types

// Define the shape of the Account context
interface AccountContextType {
    accounts: Account[];
    getAccounts: (userId: number) => Promise<Account[]>;
    getActiveAccounts: (userId: number) => Promise<{ success: boolean; number: Number; message: string }>;
    getTotalBalance: (userId: number) => Promise<{ success: boolean; balance: Decimal; message: string }>;
    getAccountBalance: (userId: number, accountId: number) => Promise<{ success: boolean; balance: Decimal; message: string }>;
    changeAccountStatus: (userId: number, accountId: number, request: UpdateAccountStatusFormInputs) => Promise<{ success: boolean; message?: string }>;
    loadingAccounts: boolean;
    createAccount: (id: number, account: CreateAccountFormInputs) => Promise<{ success: boolean; message?: string }>;
}

// Create the Account context
export const AccountContext = createContext<AccountContextType | null>(null);

// AccountProvider component to provide account-related state and functions
export const AccountProvider = ({ children }: { children: ReactNode }) => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loadingAccounts, setLoadingAccounts] = useState(true);
    const [id, setId] = React.useState<number | null>(null);

    // Retrieve user id from localStorage
    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedId = localStorage.getItem('id');
            if (storedId) {
                setId(parseInt(storedId, 10));
            }
        }
    }, []);

    // Fetch accounts when the component mounts or when id changes
    useEffect(() => {
        const fetchAccounts = async () => {
            if (id) {
                setLoadingAccounts(true);
                const userAccounts = await getAccounts(id);
                setAccounts(userAccounts);
                setLoadingAccounts(false);
            } else {
                setAccounts([]);
                setLoadingAccounts(false);
            }
        };
        fetchAccounts();
    }, [id]);

    // Create a new account for the user
    const createAccount = async (id: number, account: CreateAccountFormInputs): Promise<{ success: boolean; message?: string }> => {
        if (!id) return { success: false, message: 'User not logged in.' };
        try {
            const newAccount = await api.createAccount(id, account);
            if (!newAccount) {
                return { success: false, message: 'Failed to create account.' };
            }
            setAccounts(prevAccounts => [...prevAccounts, newAccount]);
            return { success: true };
        } catch (error) {
            console.error('Error creating account:', error);
            return { success: false, message: 'Failed to create account.' };
        }
    }

    // Fetch all accounts for a user
    const getAccounts = async (userId: number): Promise<Account[]> => {
        if (!userId) return [];
        const accounts = await api.getAccounts(userId);
        console.log(accounts)
        try {
            const accounts = await api.getAccounts(userId);
            if (!accounts) {
                console.log('Failed to fetch accounts');
                return [];
            }
            setAccounts(accounts);
            return accounts;
        } catch (error) {
            console.error('Error fetching accounts:', error);
            return [];
        }
    }

    // Fetch the total balance for a user
    const getTotalBalance = async (userId: number): Promise<{ success: boolean; balance: Decimal; message: string }> => {
        try {
            const response = await api.getBalance(userId);
            // console.log(response)
            if (!response) {
                console.error('Failed to fetch balance');
                return { success: false, balance: new Decimal(0), message: 'Failed to fetch balance.' };
            }
            // Return the balance from the response
            // @ts-ignore
            return {
                success: true,
                balance: response.balance, // Convert Decimal to string
                message: 'Balance fetched successfully.'
            }
        } catch (error) {
            console.error('Error fetching balance:', error);
            return { success: false, balance: new Decimal(0), message: 'Error fetching balance.' };
        }
    };

    // Get account balance
    const getAccountBalance = async (userId: number, accountId: number): Promise<{ success: boolean; balance: Decimal; message: string }> => {
        try {
            const response = await api.getAccountBalance(userId, accountId);
            if (!response) {
                console.error('Failed to fetch account balance');
                return { success: false, balance: new Decimal(0), message: 'Failed to fetch account balance.' };
            }
            // @ts-ignore
            return { success: true, balance: response.balance, message: 'Account balance fetched successfully.' };
        } catch (error) {
            console.error('Error fetching account balance:', error);
            return { success: false, balance: new Decimal(0), message: 'Error fetching account balance.' };
        }
    }

    // Fetch the number of active accounts for a user
    const getActiveAccounts = async (userId: number): Promise<{ success: boolean; number: Number; message: string }> => {
        try {
            const accounts = await api.getActiveAccounts(userId);
            // console.log("Active accounts response:", accounts);
            if (!accounts) {
                console.error('Failed to fetch active accounts');
                return { success: false, number: 0, message: 'Failed to fetch active accounts.' };
            }
            return { success: true, number: accounts.accountsCount, message: 'Active accounts fetched successfully.' };
        } catch (error) {
            console.error('Error fetching active accounts:', error);
            return { success: false, number: 0, message: 'Error fetching active accounts.' };
        }
    }

    // Change the status of an account (e.g., activate/deactivate)
    const changeAccountStatus = async (userId: number, accountId: number, request: UpdateAccountStatusFormInputs): Promise<{ success: boolean; message?: string }> => {
        if (!userId || !accountId) return { success: false, message: 'Invalid user or account ID.' };

        // Check if balance is zero before changing status
        const account = accounts.find(acc => acc.id === accountId);

        if (account?.balance) {
            const balanceDecimal = new Decimal(account.balance.toString());
            if (balanceDecimal.greaterThan(0)) {
                console.log("Balance is not zero");
                return { success: false, message: 'Cannot change status of account with non-zero balance.' };
            }
        }

        try {
            const updatedAccount = await api.updateAccountStatus(userId, accountId, request);
            if (!updatedAccount) {
                return { success: false, message: 'Failed to update account.' };
            }
            setAccounts(prevAccounts =>
                prevAccounts.map(account =>
                    account.id === accountId ? updatedAccount : account
                )
            );
            return { success: true };
        } catch (error) {
            console.error('Error updating account:', error);
            return { success: false, message: 'Failed to update account.' };
        }
    }

    // Provide the context value to children components
    return (
        <AccountContext.Provider value={{ accounts, loadingAccounts, createAccount, getTotalBalance, getAccountBalance, changeAccountStatus, getAccounts, getActiveAccounts }}>
            {children}
        </AccountContext.Provider>
    );
};

// Custom hook to use the Account context
export const useAccounts = () => {
    const context = useContext(AccountContext);
    if (!context) {
        throw new Error('useAccounts must be used within an AccountProvider');
    }
    return context;
};