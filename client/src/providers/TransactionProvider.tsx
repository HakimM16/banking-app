// src/providers/TransactionProvider.tsx
'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { useAuth } from './AuthProvider';
import { Transaction, TransferFormInputs, DepositFormInputs, WithdrawFormInputs } from '@/types'; // Import types
import Decimal from 'decimal.js';
import {api} from "@/services/api";

// Defines the shape of the transaction context
interface TransactionContextType {
    transactions: Transaction[];
    loadingTransactions: boolean;
    makeDeposit: (userId: number, request: DepositFormInputs) => Promise<{ success: boolean; message?: string }>;
    makeWithdrawal: (userId: number, request: WithdrawFormInputs) => Promise<{ success: boolean; message?: string }>;
    makeTransfer: (userId: number, request: TransferFormInputs) => Promise<{ success: boolean; message?: string }>;
    getTransactions: (userId: number) => Promise<{ success: boolean; transactions?: Transaction[]; message?: string }>;
    getTransactionsCount: (userId: number) => Promise<{ success: boolean; count?: number; message?: string }>;
}

// Create the transaction context
export const TransactionContext = createContext<TransactionContextType | null>(null);

// TransactionProvider component to wrap children with transaction context
export const TransactionProvider = ({ children }: { children: ReactNode }) => {
    const { currentUser } = useAuth();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loadingTransactions, setLoadingTransactions] = useState(true);

    // Handles deposit logic
    const makeDeposit = async (userId: number, request: DepositFormInputs): Promise<{ success: boolean; message?: string }> => {
        if (!currentUser) return { success: false, message: 'User not logged in.' };
        console.log(request);

        const amount = new Decimal(request.amount).toNumber();
        if (isNaN(amount) || amount <= 0) return { success: false, message: 'Amount must be a positive number.' };
        if (amount > 10000) return { success: false, message: 'Deposit limit exceeded. Maximum amount is £10,000.' };

        try {
            // Convert amount to Decimal
            request.amount = new Decimal(request.amount);
            console.log("After conversion: " + request);

            const deposit = await api.deposit(userId, request);
            if (deposit) {
                return { success: true };
            } else {
                return { success: false, message: 'Failed to process deposit.' };
            }
        } catch (error) {
            console.error('Error processing deposit:', error);
            return { success: false, message: 'Failed to process deposit.' };
        }
    };

    // Handles withdrawal logic
    const makeWithdrawal = async (userId: number, request: WithdrawFormInputs): Promise<{ success: boolean; message?: string }> => {
        if (!currentUser) return { success: false, message: 'User not logged in.' };

        const amount = new Decimal(request.amount).toNumber();
        if (isNaN(amount) || amount <= 0) return { success: false, message: 'Amount must be a positive number.' };
        if (amount > 5000) return { success: false, message: 'Withdrawal limit exceeded. Maximum amount is £5,000.' };

        try {
            // Convert amount to Decimal
            request.amount = new Decimal(request.amount);
            console.log("After conversion: " + request);

            const withdrawal = await api.withdraw(userId, request);
            if (withdrawal) {
                return { success: true };
            } else {
                return { success: false, message: 'Failed to process withdrawal.' };
            }
        } catch (error) {
            console.error('Error processing withdrawal:', error);
            return { success: false, message: 'Failed to process withdrawal.' };
        }
    };

    // Handles transfer logic
    const makeTransfer = async (userId: number, request: TransferFormInputs): Promise<{ success: boolean; message?: string }> => {
        if (!currentUser) return { success: false, message: 'User not logged in.' };

        const amount = new Decimal(request.amount).toNumber();
        if (isNaN(amount) || amount <= 0) return { success: false, message: 'Amount must be a positive number.' };
        if (amount > 10000) return { success: false, message: 'Transfer limit exceeded. Maximum amount is $10,000.' };
        console.log(request);

        try {
            // Convert amount to Decimal
            request.amount = new Decimal(request.amount);
            console.log("After conversion: " + request);

            const transfer = await api.transfer(userId, request);
            if (transfer) {
                return { success: true };
            } else {
                return { success: false, message: 'Failed to process transfer.' };
            }
        } catch (error) {
            console.error('Error processing transfer:', error);
            return { success: false, message: 'Failed to process transfer.' };
        }
    };

    // Fetches transactions for a user
    const getTransactions = async (userId: number): Promise<{ success: boolean; transactions?: Transaction[]; message?: string }> => {
        try {
            const transactions = await api.getTransactions(userId);
            if (transactions) {
                return { success: true, transactions };
            } else {
                return { success: false, message: 'Failed to fetch transactions.' };
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
            return { success: false, message: 'Failed to fetch transactions.' };
        }
    };

    // Fetches the count of transactions for a user
    const getTransactionsCount = async (userId: number): Promise<{ success: boolean; count?: number; message?: string }> => {
        try {
            const response = await api.getTransactionsCount(userId);
            console.log("Response from getTransactionsCount:", response);
            if (response) {
                // Note: Make sure the API returns the correct property name
                return { success: true, count: response.transactionsCount };
            } else {
                return { success: false, count: 0 };
            }
        } catch (error) {
            console.error('Error fetching transactions count:', error);
            return { success: false, message: 'Failed to fetch transactions count.' };
        }
    };

    // Provide context values to children
    return (
        <TransactionContext.Provider value={{
            transactions,
            loadingTransactions,
            makeDeposit,
            makeWithdrawal,
            makeTransfer,
            getTransactions,
            getTransactionsCount
        }}>
            {children}
        </TransactionContext.Provider>
    );
};

// Custom hook to use the transaction context
export const useTransactions = () => {
    const context = useContext(TransactionContext);
    if (!context) {
        throw new Error('useTransactions must be used within a TransactionProvider');
    }
    return context;
};