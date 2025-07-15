// src/components/DashboardSummary.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { DollarSign, CreditCard, ArrowUpDown } from 'lucide-react';
import { formatCurrency } from '@/utils/helpers';
import { getUserByUserId } from '@/lib/data';
import { User, Account } from '@/types';

interface DashboardSummaryProps {
    userId: number;
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({ userId }) => {
    const [currentUser, setCurrentUser] = useState<User | undefined>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await getUserByUserId(userId);
                setCurrentUser(user);
            } catch (error) {
                console.error('Error fetching user:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, [userId]);

    if (isLoading) return <div>Loading...</div>;
    if (!currentUser) return <p>User data not found for dashboard summary.</p>;

    const getTotalBalance = (): number => {
        return currentUser.accounts.reduce((total: number, acc: Account) => total + acc.balance, 0) || 0;
    };

    const getRecentTransactionsCount = (): number => {
        return 3;
    }
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-blue-100 mb-1">Total Balance</p>
                        <p className="text-2xl font-bold">{formatCurrency(getTotalBalance())}</p>
                    </div>
                    <DollarSign size={40} className="text-blue-200" />
                </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-green-100 mb-1">Active Accounts</p>
                        <p className="text-2xl font-bold">{currentUser.accounts.filter((acc: Account) => acc.status === 'active').length}</p>
                    </div>
                    <CreditCard size={40} className="text-green-200" />
                </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-purple-100 mb-1">Recent Transactions</p>
                        <p className="text-2xl font-bold">{getRecentTransactionsCount()}</p>
                    </div>
                    <ArrowUpDown size={40} className="text-purple-200" />
                </div>
            </div>
        </div>
    );
};

export default DashboardSummary;