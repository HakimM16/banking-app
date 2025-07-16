// src/providers/AccountProvider.tsx
'use client';

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useAuth } from './AuthProvider';
import { getUserAccounts, createNewAccount, toggleAccountStatusInDB } from '@/lib/data';
import { Account, User } from '@/types'; // Import types

interface AccountContextType {
    accounts: Account[];
    loadingAccounts: boolean;
    createAccount: (accountType: 'checking' | 'savings') => Promise<{ success: boolean; message?: string }>;
    toggleAccountStatus: (accountId: string) => Promise<{ success: boolean; message?: string }>;
}

export const AccountContext = createContext<AccountContextType | null>(null);

export const AccountProvider = ({ children }: { children: ReactNode }) => {
    const { currentUser, updateUserInContext } = useAuth();
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loadingAccounts, setLoadingAccounts] = useState(true);

    useEffect(() => {
        const fetchAccounts = async () => {
            if (currentUser?.id) {
                setLoadingAccounts(true);
                const userAccounts = await getUserAccounts(currentUser.id);
                setAccounts(userAccounts);
                setLoadingAccounts(false);
            } else {
                setAccounts([]);
                setLoadingAccounts(false);
            }
        };
        fetchAccounts();
    }, [currentUser]);

    const createAccount = async (accountType: 'checking' | 'savings'): Promise<{ success: boolean; message?: string }> => {
        if (!currentUser) return { success: false, message: 'User not logged in.' };
        const { success, account, updatedUser, message } = await createNewAccount(currentUser.id, accountType);
        if (success && account && updatedUser) {
            setAccounts(prev => [...prev, account]);
            updateUserInContext(updatedUser); // Update global user context
        }
        return { success, message };
    };

    const toggleAccountStatus = async (accountId: string): Promise<{ success: boolean; message?: string }> => {
        if (!currentUser) return { success: false, message: 'User not logged in.' };
        const { success, updatedUser, message } = await toggleAccountStatusInDB(currentUser.id, accountId);
        if (success && updatedUser) {
            setAccounts(updatedUser.accounts);
            updateUserInContext(updatedUser); // Update global user context
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