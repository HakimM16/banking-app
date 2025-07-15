// src/components/forms/WithdrawalForm.tsx
'use client';

import React, { useState } from 'react';
import { Minus } from 'lucide-react';
import { useAccounts } from '@/providers/AccountProvider';
import { useTransactions } from '@/providers/TransactionProvider';
import { useAlerts } from '@/hooks/useAlerts';
import { WithdrawalFormInputs } from '@/types'; // Import type

const WithdrawalForm: React.FC = () => {
    const { accounts } = useAccounts();
    const { processWithdrawal } = useTransactions();
    const { addAlert } = useAlerts();

    const [withdrawalForm, setWithdrawalForm] = useState<WithdrawalFormInputs>({
        account: '',
        amount: '',
        description: ''
    });

    const handleWithdrawal = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await processWithdrawal(withdrawalForm);
        if (result.success) {
            addAlert('Withdrawal completed successfully!', 'success');
            setWithdrawalForm({ account: '', amount: '', description: '' });
        } else {
            addAlert(result.message || 'Withdrawal failed.', 'error');
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Minus size={20} /> Withdraw Money
            </h3>
            <form onSubmit={handleWithdrawal} className="space-y-4">
                <div>
                    <label htmlFor="withdrawalAccount" className="block text-sm font-medium text-gray-700 mb-2">From Account</label>
                    <select
                        id="withdrawalAccount"
                        value={withdrawalForm.account}
                        onChange={(e) => setWithdrawalForm({...withdrawalForm, account: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">Select an account</option>
                        {accounts.map(acc => (
                            <option key={acc.id} value={acc.id}>
                                {acc.type.charAt(0).toUpperCase() + acc.type.slice(1)} ({acc.accountNumber}) - ${acc.balance.toLocaleString()}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="withdrawalAmount" className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                    <input
                        type="number"
                        id="withdrawalAmount"
                        value={withdrawalForm.amount}
                        onChange={(e) => setWithdrawalForm({...withdrawalForm, amount: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., 100.00"
                        step="0.01"
                        min="0.01"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="withdrawalDescription" className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                    <input
                        type="text"
                        id="withdrawalDescription"
                        value={withdrawalForm.description}
                        onChange={(e) => setWithdrawalForm({...withdrawalForm, description: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., ATM withdrawal"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                    <Minus size={20} />
                    Process Withdrawal
                </button>
            </form>
        </div>
    );
};

export default WithdrawalForm;