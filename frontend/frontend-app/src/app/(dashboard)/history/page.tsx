// src/app/(dashboard)/history/page.tsx
'use client';

import React, { useState } from 'react';
import { Search, History } from 'lucide-react';
import { useTransactions } from '@/providers/TransactionProvider';
import { useAccounts } from '@/providers/AccountProvider';
import TransactionItem from '@/components/TransactionItem';

export default function TransactionHistoryPage() {
    const { transactions, getFilteredTransactions } = useTransactions();
    const { accounts } = useAccounts();

    const [transactionFilter, setTransactionFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTransactions = getFilteredTransactions(transactionFilter, searchTerm);

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                <History size={32} /> Transaction History
            </h1>

            <div className="bg-white p-6 rounded-xl shadow-md mb-6 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <input
                        type="text"
                        placeholder="Search by description or amount..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
                    />
                    <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>

                <div className="flex items-center gap-2">
                    <label htmlFor="filter" className="text-gray-700">Filter by Type:</label>
                    <select
                        id="filter"
                        value={transactionFilter}
                        onChange={(e) => setTransactionFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All</option>
                        <option value="transfer">Transfer</option>
                        <option value="deposit">Deposit</option>
                        <option value="withdrawal">Withdrawal</option>
                    </select>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
                {filteredTransactions.length > 0 ? (
                    <div className="space-y-4">
                        {filteredTransactions.map((transaction) => (
                            <TransactionItem key={transaction.id} transaction={transaction} accounts={accounts} />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-8">No transactions found matching your criteria.</p>
                )}
            </div>
        </div>
    );
}