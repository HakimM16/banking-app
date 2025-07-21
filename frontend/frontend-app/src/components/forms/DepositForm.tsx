// src/components/forms/DepositForm.tsx
'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAccounts } from '@/providers/AccountProvider';
import { useTransactions } from '@/providers/TransactionProvider';
import { useAlerts } from '@/hooks/useAlerts';
import { DepositFormInputs } from '@/types';
import { Decimal } from 'decimal.js';
import { redirect } from 'next/navigation';

const DepositForm: React.FC = () => {
    const { accounts } = useAccounts();
    const { processDeposit } = useTransactions();
    const { addAlert } = useAlerts();

    const [depositForm, setDepositForm] = useState<DepositFormInputs>({
        accountNumber: '',
        amount: new Decimal(0),
        description: '',
    });

    const handleDeposit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await processDeposit(depositForm);
        if (result.success) {
            addAlert('Deposit completed successfully!', 'success');
            setDepositForm({ accountNumber: '', amount: new Decimal(0), description: '' });
        } else {
            addAlert(result.message || 'Deposit failed.', 'error');
        }
        return redirect('/home');
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Plus size={20} /> Deposit Money
            </h3>
            <form onSubmit={handleDeposit} className="space-y-4">
                <div>
                    <label htmlFor="depositAccount" className="block text-sm font-medium text-gray-700 mb-2">To Account</label>
                    <select
                        id="depositAccount"
                        value={depositForm.accountNumber}
                        onChange={(e) => setDepositForm({...depositForm, accountNumber: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">Select an account</option>
                        {accounts.map(acc => (
                            <option key={acc.id} value={acc.accountNumber}>
                                {acc.accountType.charAt(0).toUpperCase() + acc.accountType.slice(1)} ({acc.accountNumber}) - ${acc.balance.toLocaleString()}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="depositAmount" className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                    <input
                        type="number"
                        id="depositAmount"
                        value={depositForm.amount.toString()}
                        onChange={(e) => setDepositForm({...depositForm, amount: new Decimal(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., 1000.00"
                        step="0.01"
                        min="0.01"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="depositDescription" className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                    <input
                        type="text"
                        id="depositDescription"
                        value={depositForm.description}
                        onChange={(e) => setDepositForm({...depositForm, description: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Salary deposit"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                    <Plus size={20} />
                    Process Deposit
                </button>
            </form>
        </div>
    );
};

export default DepositForm;