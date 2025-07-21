// src/providers/AccountProvider.tsx
'use client';

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useAuth } from './AuthProvider';
import { getUserAccounts, createNewAccount, toggleAccountStatusInDB } from '@/lib/data';
import {Account, CreateAccountFormInputs, User} from '@/types';
import {api} from "@/services/api"; // Import types

interface AccountContextType {
    accounts: Account[];
    loadingAccounts: boolean;
    createAccount: (id: number, account: CreateAccountFormInputs) => Promise<{ success: boolean; message?: string }>;
    toggleAccountStatus: (accountId: string) => Promise<{ success: boolean; message?: string }>;
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

    useEffect(() => {
        const fetchAccounts = async () => {
            if (id) {
                setLoadingAccounts(true);
                const userAccounts = await getUserAccounts(id);
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

    const toggleAccountStatus = async (accountId: string): Promise<{ success: boolean; message?: string }> => {
        if (!id) return { success: false, message: 'User not logged in.' };
        const { success, updatedUser, message } = await toggleAccountStatusInDB(id, accountId);
        if (success && updatedUser) {
            setAccounts(prevAccounts =>
                prevAccounts.map(account =>
                    account.id === accountId ? { ...account, isActive: !account.status } : account
                )
            );
        } else {
            console.error('Error toggling account status:', message);
        }
        return { success, message };
    };

    return (
        <AccountContext.Provider value={{ accounts, loadingAccounts, createAccount, toggleAccountStatus }}>
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