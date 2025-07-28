'use client';

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Account, CreateAccountFormInputs, UpdateAccountFormInputs, UpdateAccountStatusFormInputs, User } from '@/types';
import { api } from "@/services/api";
import { Decimal } from "decimal.js"; // Import types

interface AccountContextType {
    accounts: Account[];
    getAccounts: (userId: number) => Promise<Account[]>;
    getActiveAccounts: (userId: number) => Promise<{ success: boolean; number: number; message: string }>;
    getTotalBalance: (userId: number) => Promise<{ success: boolean; balance: string; message: string }>;
    getAccountBalance: (userId: number, accountId: number) => Promise<{ success: boolean; balance: string; message: string }>;
    changeAccountStatus: (userId: number, accountId: number, request: UpdateAccountStatusFormInputs) => Promise<{ success: boolean; message?: string }>;
    loadingAccounts: boolean;
    createAccount: (id: number, account: CreateAccountFormInputs) => Promise<{ success: boolean; message?: string }>;
}

export const AccountContext = createContext<AccountContextType | null>(null);

export const AccountProvider = ({ children }: { children: ReactNode }) => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loadingAccounts, setLoadingAccounts] = useState(true);
    const [id, setId] = React.useState<number | null>(null);

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedId = localStorage.getItem('id');
            if (storedId) {
                setId(parseInt(storedId, 10));
            }
        }
    }, []);

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

    const getAccounts = async (userId: number): Promise<Account[]> => {
        if (!userId) return [];
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

    const getTotalBalance = async (userId: number): Promise<{ success: boolean; balance: string; message: string }> => {
        try {
            const response = await api.getBalance(userId);
            if (!response) {
                console.error('Failed to fetch balance');
                return { success: false, balance: new Decimal(0).toString(), message: 'Failed to fetch balance.' };
            }
            return {
                success: true,
                balance: response.toString(),
                message: 'Balance fetched successfully.'
            }
        } catch (error) {
            console.error('Error fetching balance:', error);
            return { success: false, balance: new Decimal(0).toString(), message: 'Error fetching balance.' };
        }
    };

    const getAccountBalance = async (userId: number, accountId: number): Promise<{ success: boolean; balance: string; message: string }> => {
        try {
            const response = await api.getAccountBalance(userId, accountId);
            if (!response) {
                console.error('Failed to fetch account balance');
                return { success: false, balance: new Decimal(0).toString(), message: 'Failed to fetch account balance.' };
            }
            return { success: true, balance: response.toString(), message: 'Account balance fetched successfully.' };
        } catch (error) {
            console.error('Error fetching account balance:', error);
            return { success: false, balance: new Decimal(0).toString(), message: 'Error fetching account balance.' };
        }
    }

    const getActiveAccounts = async (userId: number): Promise<{ success: boolean; number: number; message: string }> => {
        try {
            const accounts = await api.getActiveAccounts(userId);
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

    const changeAccountStatus = async (userId: number, accountId: number, request: UpdateAccountStatusFormInputs): Promise<{ success: boolean; message?: string }> => {
        if (!userId || !accountId) return { success: false, message: 'Invalid user or account ID.' };

        const account = accounts.find(acc => acc.id === accountId);

        if (account?.balance) {
            if (account.balance.greaterThan(0)) {
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

    return (
        <AccountContext.Provider value={{ accounts, loadingAccounts, createAccount, getTotalBalance, getAccountBalance, changeAccountStatus, getAccounts, getActiveAccounts }}>
            {children}
        </AccountContext.Provider>
    );
};

export const useAccounts = () => {
    const context = useContext(AccountContext);
    if (!context) {
        throw new Error('useAccounts must be used within an AccountProvider');
    }
    return context;
};