// src/app/(dashboard)/transactions/page.tsx
import DepositForm from '@/components/forms/DepositForm';
import TransferForm from '@/components/forms/TransferForm';
import WithdrawalForm from '@/components/forms/WithdrawalForm';
import React from 'react'; // Ensure React is imported

export default function TransactionsPage() {
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Transactions</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                <TransferForm />
                <DepositForm />
                <WithdrawalForm />
            </div>
        </div>
    );
}