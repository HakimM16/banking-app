// src/app/(dashboard)/history/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Search, History } from 'lucide-react';
import { useTransactions } from '@/providers/TransactionProvider';
import { useAccounts } from '@/providers/AccountProvider';
import TransactionItem from '@/components/TransactionItem';
import { Transaction} from '@/types';
import axios from "axios";
import {useAuth} from "@/providers/AuthProvider";

export default function TransactionHistoryPage() {
    const { getTransactions } = useTransactions();
    const { accounts } = useAccounts();
    const { currentUser } = useAuth();

    const [transactionFilter, setTransactionFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const token = localStorage.getItem('authToken');
    // Set the default Authorization header for all future axios requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const id: string = localStorage.getItem('id') || '';
    const userId = parseInt(id, 10);

    const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);

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

    // Filter transactions based on type and search term
    useEffect(() => {
        let filtered = [...allTransactions];

        // Filter by transaction type
        if (transactionFilter === 'TRANSFER') {
            filtered = filtered.filter(transaction => transaction.transactionType === 'TRANSFER');
        } else if (transactionFilter === 'DEPOSIT') {
            filtered = filtered.filter(transaction => transaction.transactionType === 'DEPOSIT');
        } else if (transactionFilter === 'WITHDRAWAL') {
            filtered = filtered.filter(transaction => transaction.transactionType === 'WITHDRAWAL');
        }

        // Filter by search term (description or amount)
        if (searchTerm) {
            const lowerSearchTerm = searchTerm.toLowerCase();
            filtered = filtered.filter(transaction =>
                transaction.description.toLowerCase().includes(lowerSearchTerm) ||
                transaction.amount.toString().includes(lowerSearchTerm)
            );
        }

        setFilteredTransactions(filtered);
    }, [allTransactions, transactionFilter, searchTerm]);

    if (!currentUser) {
        return (
            <div className="flex h-screen items-center justify-center bg-indigo-900">
                <div className="text-white text-xl">Loading data</div>
            </div>
        )
    }

return (
    <div className="p-6">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-50 mb-8 flex items-center gap-3">
            <History size={32} /> Transaction History
        </h1>

        {/* Filter Controls */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-6 flex flex-col md:flex-row gap-4">
            <div className="flex items-center gap-2">
                <label htmlFor="filter" className="text-gray-700">Filter by Type:</label>
                <select
                    id="filter"
                    value={transactionFilter}
                    onChange={(e) => setTransactionFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="all">All</option>
                    <option value="TRANSFER">Transfer</option>
                    <option value="DEPOSIT">Deposit</option>
                    <option value="WITHDRAWAL">Withdrawal</option>
                </select>
            </div>
        </div>

        {/* Transaction List */}
        <div className="bg-white p-6 rounded-xl shadow-md">
            {filteredTransactions.length > 0 ? (
                <div className="space-y-4">
                    {/* Render each transaction item */}
                    {[...filteredTransactions].reverse().map((transaction: Transaction) => (
                        <TransactionItem
                            key={transaction.id}
                            transaction={transaction}
                            accounts={accounts}
                            transactions={allTransactions} // Pass all transactions for finding matches
                        />
                    ))}
                </div>
            ) : (
                // Show message if no transactions found
                <p className="text-gray-500 text-center py-8">No transactions found matching your criteria.</p>
            )}
        </div>
    </div>
);
}