// src/providers/TransactionProvider.tsx
'use client';

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useAuth } from './AuthProvider';
import { getUserTransactions } from '@/lib/data';
import { Transaction, TransferFormInputs, DepositFormInputs, WithdrawFormInputs } from '@/types'; // Import types
import Decimal from 'decimal.js';
import {api} from "@/services/api";

interface TransactionContextType {
    transactions: Transaction[];
    loadingTransactions: boolean;
    makeDeposit: (userId: number, request: DepositFormInputs) => Promise<{ success: boolean; message?: string }>;
    makeWithdrawal: (userId: number, request: WithdrawFormInputs) => Promise<{ success: boolean; message?: string }>;
    makeTransfer: (userId: number, request: TransferFormInputs) => Promise<{ success: boolean; message?: string }>;
    getTransactions: (userId: number) => Promise<{ success: boolean; transactions?: Transaction[]; message?: string }>;
}

export const TransactionContext = createContext<TransactionContextType | null>(null);

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
    const { currentUser } = useAuth();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loadingTransactions, setLoadingTransactions] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            if (currentUser?.id) {
                setLoadingTransactions(true);
                const userTransactions = await getUserTransactions(currentUser.id);
                setTransactions(userTransactions);
                setLoadingTransactions(false);
            } else {
                setTransactions([]);
                setLoadingTransactions(false);
            }
        };
        fetchTransactions();
    }, [currentUser]);

    const makeDeposit = async (userId: number, request: DepositFormInputs): Promise<{ success: boolean; message?: string }> => {
        if (!currentUser) return { success: false, message: 'User not logged in.' };
        console.log(request)

        const amount = new Decimal(request.amount).toNumber();
        if (isNaN(amount) || amount <= 0) return { success: false, message: 'Amount must be a positive number.' };
        if (amount > 50000) return { success: false, message: 'Deposit limit exceeded. Maximum amount is $50,000.' };

        try {
            // change the amount to a decimal
            request.amount = new Decimal(request.amount); // Convert Decimal to string
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

    }

    const makeWithdrawal = async (userId: number, request: WithdrawFormInputs): Promise<{ success: boolean; message?: string }> => {
        if (!currentUser) return { success: false, message: 'User not logged in.' };

        const amount = new Decimal(request.amount).toNumber();
        if (isNaN(amount) || amount <= 0) return { success: false, message: 'Amount must be a positive number.' };
        if (amount > 5000) return { success: false, message: 'Withdrawal limit exceeded. Maximum amount is $5,000.' };

        try {
            // change the amount to a decimal
            request.amount = new Decimal(request.amount); // Convert Decimal to string
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
    }

    const makeTransfer = async (userId: number, request: TransferFormInputs): Promise<{ success: boolean; message?: string }> => {
        if (!currentUser) return { success: false, message: 'User not logged in.' };

        const amount = new Decimal(request.amount).toNumber();
        if (isNaN(amount) || amount <= 0) return { success: false, message: 'Amount must be a positive number.' };
        if (amount > 10000) return { success: false, message: 'Transfer limit exceeded. Maximum amount is $10,000.' };
        console.log(request);

        try {
            // change the amount to a decimal
            request.amount = new Decimal(request.amount); // Convert Decimal to string
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
    }

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
    }


    return (
        <TransactionContext.Provider value={{
            transactions,
            loadingTransactions,
            makeDeposit,
            makeWithdrawal,
            makeTransfer,
            getTransactions,
        }}>
            {children}
        </TransactionContext.Provider>
    );
};

export const useTransactions = () => {
    const context = useContext(TransactionContext);
    if (!context) {
        throw new Error('useTransactions must be used within a TransactionProvider');
    }
    return context;
};