// src/providers/TransactionProvider.tsx
'use client';

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useAuth } from './AuthProvider';
import { addTransaction, getUserTransactions, updateAccountBalances } from '@/lib/data';
import { useAccounts } from './AccountProvider';
import { Transaction, TransferFormInputs, DepositFormInputs, WithdrawFormInputs } from '@/types'; // Import types
import Decimal from 'decimal.js';
import {api} from "@/services/api";

interface TransactionContextType {
    transactions: Transaction[];
    loadingTransactions: boolean;
    makeDeposit: (userId: number, request: DepositFormInputs) => Promise<{ success: boolean; message?: string }>;
    processTransfer: (data: TransferFormInputs) => Promise<{ success: boolean; message?: string }>;
    processWithdrawal: (data: WithdrawalFormInputs) => Promise<{ success: boolean; message?: string }>;
    getFilteredTransactions: (filter: string, searchTerm: string) => Transaction[];
}

export const TransactionContext = createContext<TransactionContextType | null>(null);

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
    const { currentUser, updateUserInContext } = useAuth();
    const { accounts } = useAccounts();
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

        /*const account = accounts.find(acc => acc.id === request.account);
        if (!account) return { success: false, message: 'Account not found.' };

        const { success: balanceUpdateSuccess, updatedUser, message: balanceUpdateMessage } = await updateAccountBalances(
            userId,
            null,
            request.account,
            amount,
            'deposit'
        );

        if (!balanceUpdateSuccess) {
            return { success: false, message: balanceUpdateMessage };
        }

        const newTransactionData: Omit<Transaction, 'id' | 'date' | 'status'> = {
            userId,
            fromAccount: null,
            toAccount: request.account,
            amount,
            type: 'deposit',
            description: request.description || 'Cash deposit',
        };

        const { success: txnSuccess, transaction, message: txnMessage } = await addTransaction(newTransactionData);

        if (txnSuccess && transaction && updatedUser) {
            setTransactions(prev => [...prev, transaction]);
            updateUserInContext(updatedUser);
        }
        return { success: txnSuccess, message: txnMessage };*/
    }

    const processTransfer = async (transferData: TransferFormInputs): Promise<{ success: boolean; message?: string }> => {
        if (!currentUser) return { success: false, message: 'User not logged in.' };

        const amount = parseFloat(transferData.amount);
        if (isNaN(amount) || amount <= 0) return { success: false, message: 'Amount must be a positive number.' };
        if (amount > 10000) return { success: false, message: 'Transfer limit exceeded. Maximum amount is $10,000.' };

        const fromAccount = accounts.find(acc => acc.id === transferData.fromAccount);
        if (!fromAccount || fromAccount.balance < amount) return { success: false, message: 'Insufficient funds in source account.' };

        const { success: balanceUpdateSuccess, updatedUser, message: balanceUpdateMessage } = await updateAccountBalances(
            currentUser.id,
            transferData.fromAccount,
            transferData.toAccount,
            amount,
            'transfer'
        );

        if (!balanceUpdateSuccess) {
            return { success: false, message: balanceUpdateMessage };
        }

        const newTransactionData: Omit<Transaction, 'id' | 'date' | 'status'> = {
            userId: currentUser.id,
            fromAccount: transferData.fromAccount,
            toAccount: transferData.toAccount,
            amount,
            type: 'transfer',
            description: transferData.description || 'Internal transfer',
        };

        const { success: txnSuccess, transaction, message: txnMessage } = await addTransaction(newTransactionData);

        if (txnSuccess && transaction && updatedUser) {
            setTransactions(prev => [...prev, transaction]);
            updateUserInContext(updatedUser);
        }
        return { success: txnSuccess, message: txnMessage };
    };

    const processWithdrawal = async (withdrawalData: WithdrawalFormInputs): Promise<{ success: boolean; message?: string }> => {
        if (!currentUser) return { success: false, message: 'User not logged in.' };

        const amount = parseFloat(withdrawalData.amount);
        if (isNaN(amount) || amount <= 0) return { success: false, message: 'Amount must be a positive number.' };
        if (amount > 5000) return { success: false, message: 'Withdrawal limit exceeded. Maximum amount is $5,000.' };

        const account = accounts.find(acc => acc.id === withdrawalData.account);
        if (!account || account.balance < amount) return { success: false, message: 'Insufficient funds.' };

        const { success: balanceUpdateSuccess, updatedUser, message: balanceUpdateMessage } = await updateAccountBalances(
            currentUser.id,
            withdrawalData.account,
            null,
            amount,
            'withdrawal'
        );

        if (!balanceUpdateSuccess) {
            return { success: false, message: balanceUpdateMessage };
        }

        const newTransactionData: Omit<Transaction, 'id' | 'date' | 'status'> = {
            userId: currentUser.id,
            fromAccount: withdrawalData.account,
            toAccount: null,
            amount,
            type: 'withdrawal',
            description: withdrawalData.description || 'Cash withdrawal',
        };

        const { success: txnSuccess, transaction, message: txnMessage } = await addTransaction(newTransactionData);

        if (txnSuccess && transaction && updatedUser) {
            setTransactions(prev => [...prev, transaction]);
            updateUserInContext(updatedUser);
        }
        return { success: txnSuccess, message: txnMessage };
    };

    const getFilteredTransactions = (filter: string, searchTerm: string): Transaction[] => {
        let filtered = transactions.filter(t => t.userId === currentUser?.id);

        if (filter !== 'all') {
            filtered = filtered.filter(t => t.type === filter);
        }

        if (searchTerm) {
            filtered = filtered.filter(t =>
                t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.amount.toString().includes(searchTerm)
            );
        }
        return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    };


    return (
        <TransactionContext.Provider value={{
            transactions,
            loadingTransactions,
            makeDeposit,
            processTransfer,
            processWithdrawal,
            getFilteredTransactions
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