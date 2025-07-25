// src/components/DashboardSummary.tsx
'use client';

import React, { useEffect, useState } from 'react';
import {CreditCard, ArrowUpDown, PoundSterling} from 'lucide-react';
import { formatCurrency } from '@/utils/helpers';
import { useAccounts } from '@/providers/AccountProvider';
import { useTransactions } from "@/providers/TransactionProvider";
import Decimal from 'decimal.js';
import axios from "axios";

// DashboardSummary component displays user's financial summary
const DashboardSummary: React.FC<{}> = () => {
    // Get account and transaction utility functions from context providers
    const { getTotalBalance, getActiveAccounts } = useAccounts();
    const { getTransactionsCount } = useTransactions();

    // Retrieve auth token from localStorage
    const token = localStorage.getItem('authToken');
    // Set the default Authorization header for all future axios requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // State to store user id
    const [id, setId] = React.useState<number | null>(null);

    // Get id from localStorage if not in URL params
    const storedId = localStorage.getItem('id');
    React.useEffect(() => {
        if (storedId) {
            setId(parseInt(storedId, 10));
        }
    }, [storedId]);

    // State for balance, active accounts, and recent transactions count
    const [getBalance, setGetBalance] = useState<{ success: boolean; balance: Decimal; message: string } | null>(null);
    const [activeAccounts, setActiveAccounts] = useState<{ success: boolean; number: Number; message: string } | null>();
    const [recentTransactionsCount, setRecentTransactionsCount] = useState<{ success: boolean; count?: number; message?: string }>();

    // Fetch summary data when dependencies change
    useEffect(() => {
        if (id) {
            // Fetch total balance
            const fetchBalance = async () => {
                const balance = await getTotalBalance(id);
                setGetBalance(balance);
            };

            // Fetch active accounts count
            const getAccountsCount = async () => {
                const accounts = await getActiveAccounts(id);
                setActiveAccounts(accounts);
            }

            // Fetch recent transactions count
            const getRecentTransactionsCount = async () => {
                const counts = await getTransactionsCount(id);
                setRecentTransactionsCount(counts);
            };

            fetchBalance();
            getAccountsCount();
            getRecentTransactionsCount();
        }

    }, [getTotalBalance, getActiveAccounts, getTransactionsCount, id]);

    // Render summary cards
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Balance Card */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-blue-100 mb-1">Total Balance</p>
                        <p className="text-2xl font-bold">
                            {getBalance ? formatCurrency(getBalance.balance) : 'Loading...'}
                        </p>
                    </div>
                    <PoundSterling size={40} className="text-blue-200" />
                </div>
            </div>

            {/* Active Accounts Card */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-green-100 mb-1">Active Accounts</p>
                        <p className="text-2xl font-bold">{activeAccounts ? activeAccounts.number.toString() : 0}</p>
                    </div>
                    <CreditCard size={40} className="text-green-200" />
                </div>
            </div>

            {/* Number of Transactions Card */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-purple-100 mb-1">Number of Transactions</p>
                        <p className="text-2xl font-bold">{recentTransactionsCount ? recentTransactionsCount.count?.toString() : 0}</p>
                    </div>
                    <ArrowUpDown size={40} className="text-purple-200" />
                </div>
            </div>
        </div>
    );
};

export default DashboardSummary;