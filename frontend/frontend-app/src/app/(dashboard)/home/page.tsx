'use client';

import React, { useEffect, useState } from 'react';
import DashboardSummary from '@/components/DashboardSummary';
import TransactionItem from '@/components/TransactionItem';
import AccountCard from '@/components/AccountCard';
import { Plus, Send, History } from 'lucide-react';
import { useAccounts } from '@/providers/AccountProvider';
import { useTransactions } from '@/providers/TransactionProvider';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Transaction } from '@/types';
import { useAuth } from '@/providers/AuthProvider';

export default function DashboardPage() {
    const { accounts } = useAccounts();
    const { getTransactions } = useTransactions();
    const [transactionFilter, setTransactionFilter] = useState('all');
    const router = useRouter();
    const { currentUser } = useAuth();

    const token = localStorage.getItem('authToken');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const id: string = localStorage.getItem('id') || '';
    const userId = parseInt(id, 10);
    const name = localStorage.getItem('name');

    const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        if (!userId || isNaN(userId)) return;

        const fetchTransactions = async () => {
            try {
                const result = await getTransactions(userId);
                if (result.success && result.transactions) {
                    console.log('Setting transactions:', result.transactions.length);
                    setAllTransactions(result.transactions);
                } else {
                    console.log('No transactions found, setting empty array');
                    setAllTransactions([]);
                }
            } catch (error) {
                console.error('Error fetching transactions:', error);
                setAllTransactions([]);
            }
        };

        fetchTransactions();
    }, [transactionFilter, userId]);

    console.log(allTransactions.length === 0 ? "No transactions found" : `Found ${allTransactions.length} transactions`);

    if (!currentUser) {
        return (
            <div className="flex h-screen items-center justify-center bg-indigo-900">
                <div className="text-white text-xl">Loading data</div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-50 mb-2">Dashboard</h1>
                <p className="text-gray-200">Welcome back, {name || 'User'}!</p>
            </div>

            <DashboardSummary />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                        <button
                            onClick={() => router.push('/transactions')}
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <Send size={20} />
                            Transfer Money
                        </button>
                        <button
                            onClick={() => router.push('/accounts')}
                            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                            <Plus size={20} />
                            Create Account
                        </button>
                        <button
                            onClick={() => router.push('/history')}
                            className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                        >
                            <History size={20} />
                            View History
                        </button>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Account Summary</h3>
                    <div className="space-y-4">
                        {accounts.length > 0 ? (
                            accounts.map((account) => (
                                <AccountCard key={account.id} account={account} />
                            ))
                        ) : (
                            <p className="text-gray-500">No accounts found. Create one to get started!</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
                <div className="space-y-3">
                    {allTransactions.length === 0 ? (
                        <p className="text-gray-500">No recent transactions.</p>
                    ) : (
                        [...allTransactions].reverse().slice(0, 5).map((transaction, index) => (
                            <TransactionItem
                                key={transaction.id ? `tx-${transaction.id}` : `tx-index-${index}`}
                                transaction={transaction}
                                accounts={accounts}
                                transactions={allTransactions}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}