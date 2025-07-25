// src/app/(dashboard)/transactions/page.tsx
'use client';
import DepositForm from '@/components/forms/DepositForm';
import TransferForm from '@/components/forms/TransferForm';
import WithdrawalForm from '@/components/forms/WithdrawalForm';
import React from 'react';
import {useAuth} from "@/providers/AuthProvider"; // Ensure React is imported

export default function TransactionsPage() {

    const { currentUser } = useAuth();

    if (!currentUser) {
        return (
            <div className="flex h-screen items-center justify-center bg-indigo-900">
                <div className="text-white text-xl">Loading data</div>
            </div>
        )
    }

    return (
        <div className="pt-12 px-6 pb-6">
            <h1 className="text-3xl font-bold text-gray-50 mb-8">Transactions</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                <TransferForm />
                <DepositForm />
                <WithdrawalForm />
            </div>
        </div>
    );
}