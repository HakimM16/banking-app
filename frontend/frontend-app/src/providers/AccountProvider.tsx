// src/providers/AccountProvider.tsx
'use client';

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useAuth } from './AuthProvider';
import {Account, CreateAccountFormInputs, UpdateAccountFormInputs, UpdateAccountStatusFormInputs, User} from '@/types';
import {api} from "@/services/api";
import {Decimal} from "decimal.js"; // Import types

interface AccountContextType {
    accounts: Account[];
    getAccounts: (userId: number) => Promise<Account[]>;
    changeAccountStatus: (userId: number, accountId: number, request: UpdateAccountStatusFormInputs) => Promise<{ success: boolean; message?: string }>;
    loadingAccounts: boolean;
    createAccount: (id: number, account: CreateAccountFormInputs) => Promise<{ success: boolean; message?: string }>;
}

export const AccountContext = createContext<AccountContextType | null>(null);

export const AccountProvider = ({ children }: { children: ReactNode }) => {
    const { getUser } = useAuth();
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loadingAccounts, setLoadingAccounts] = useState(true);
    const [id, setId] = React.useState<number | null>(null);

    const storedId = localStorage.getItem('id');
    React.useEffect(() => {
        if (storedId) {
            setId(parseInt(storedId, 10));
        }
    }, [storedId]);

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

    const createAccount = async (id : number, account: CreateAccountFormInputs) : Promise<{ success: boolean; message?: string }> => {
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
        const accounts = await api.getAccounts(userId);
        console.log(accounts)
        try {
            const accounts = await api.getAccounts(userId);
            if (!accounts) {
                console.error('Failed to fetch accounts');
                return [];
            }
            setAccounts(accounts);
            return accounts;
        } catch (error) {
            console.error('Error fetching accounts:', error);
            return [];
        }
    }

    const changeAccountStatus = async(userId: number, accountId: number, request: UpdateAccountStatusFormInputs) : Promise<{ success: boolean; message?: string }> => {
        if (!userId || !accountId) return { success: false, message: 'Invalid user or account ID.' };

        // check if balance is zero
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

    return (
        <AccountContext.Provider value={{ accounts, loadingAccounts, createAccount, changeAccountStatus, getAccounts }}>
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