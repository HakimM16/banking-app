// src/app/(dashboard)/page.tsx
'use client';

import React, {useEffect, useState} from 'react';
import DashboardSummary from '@/components/DashboardSummary'; // Still imported, but handles data fetching internally now
import TransactionItem from '@/components/TransactionItem';
import AccountCard from '@/components/AccountCard';
import { Plus, Send, History } from 'lucide-react';
import { useAccounts } from '@/providers/AccountProvider';
import { useTransactions } from '@/providers/TransactionProvider';
import { useRouter } from 'next/navigation';
import axios from "axios";
import {Transaction} from "@/types";

// DashboardPage component displays the main dashboard for the user
export default function DashboardPage() {
    // Get accounts from AccountProvider context
    const { accounts } = useAccounts();
    // Get getTransactions function from TransactionProvider context
    const { getTransactions } = useTransactions();
    // State for filtering transactions (currently unused)
    const [transactionFilter, setTransactionFilter] = useState('all');
    // Next.js router for navigation
    const router = useRouter();

    // Retrieve auth token from localStorage
    const token = localStorage.getItem('authToken');
    // Set the default Authorization header for all future axios requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // Retrieve user id from localStorage and parse to integer
    const id: string = localStorage.getItem('id') || '';
    const userId = parseInt(id, 10);

    // Retrieve user's name from localStorage
    const name = localStorage.getItem('name');

    // State to hold all transactions for the user
    const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);

    // Fetch transactions from the API when the component mounts or when dependencies change
    useEffect(() => {
        const fetchTransactions = async () => {
            const result = await getTransactions(userId);
            if (result.success && result.transactions) {
                setAllTransactions(result.transactions);
            } else {
                setAllTransactions([]);
            }
        };
        fetchTransactions();
    }, [transactionFilter, userId, getTransactions]);

    return (
        <div className="p-6">
            {/* Dashboard header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-50 mb-2">Dashboard</h1>
                <p className="text-gray-200">Welcome back, {name || "User"}!</p>
            </div>

            {/* Dashboard summary component */}
            <DashboardSummary />

            {/* Quick Actions and Account Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Actions section */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                        {/* Button to navigate to transactions page */}
                        <button
                            onClick={() => router.push('/transactions')}
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <Send size={20} />
                            Transfer Money
                        </button>
                        {/* Button to navigate to accounts page */}
                        <button
                            onClick={() => router.push('/accounts')}
                            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                            <Plus size={20} />
                            Create Account
                        </button>
                        {/* Button to navigate to history page */}
                        <button
                            onClick={() => router.push('/history')}
                            className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                        >
                            <History size={20} />
                            View History
                        </button>
                    </div>
                </div>

                {/* Account Summary section */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Account Summary</h3>
                    <div className="space-y-4">
                        {accounts.length > 0 ? (
                            // Render AccountCard for each account
                            accounts.map((account) => (
                                <AccountCard key={account.id} account={account} />
                            ))
                        ) : (
                            // Show message if no accounts exist
                            <p className="text-gray-500">No accounts found. Create one to get started!</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Transactions section */}
            <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
                <div className="space-y-3">
                    {allTransactions.length > 0 ? (
                        // Show up to 5 most recent transactions
                        [...allTransactions].reverse().slice(0, 5).map((transaction) => (
                            <TransactionItem key={transaction.id} transaction={transaction} accounts={accounts} transactions={allTransactions} />
                        ))
                    ) : (
                        // Show message if no transactions exist
                        <p className="text-gray-500">No recent transactions.</p>
                    )}
                </div>
            </div>
        </div>
    );
}