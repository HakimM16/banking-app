// src/components/forms/TransferForm.tsx
'use client';

import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useAccounts } from '@/providers/AccountProvider';
import { useTransactions } from '@/providers/TransactionProvider';
import { useAlerts } from '@/hooks/useAlerts';
import { TransferFormInputs } from '@/types';
import {redirect} from "next/navigation"; // Import type

const TransferForm: React.FC = () => {
    const { accounts } = useAccounts();
    const { processTransfer } = useTransactions();
    const { addAlert } = useAlerts();

    const [transferForm, setTransferForm] = useState<TransferFormInputs>({
        fromAccount: '',
        toAccount: '',
        amount: '',
        description: ''
    });

    const handleTransfer = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await processTransfer(transferForm);
        if (result.success) {
            addAlert('Transfer completed successfully!', 'success');
            setTransferForm({ fromAccount: '', toAccount: '', amount: '', description: '' });
        } else {
            addAlert(result.message || 'Transfer failed.', 'error');
        }
        return redirect('/home');
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Send size={20} /> Transfer Money
            </h3>
            <form onSubmit={handleTransfer} className="space-y-4">
                <div>
                    <label htmlFor="fromAccount" className="block text-sm font-medium text-gray-700 mb-2">From Account</label>
                    <select
                        id="fromAccount"
                        value={transferForm.fromAccount}
                        onChange={(e) => setTransferForm({...transferForm, fromAccount: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">Select an account</option>
                        {accounts.map(acc => (
                            <option key={acc.id} value={acc.id}>
                                {acc.accountType.charAt(0).toUpperCase() + acc.accountType.slice(1)} ({acc.accountNumber}) - ${acc.balance.toLocaleString()}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="toAccount" className="block text-sm font-medium text-gray-700 mb-2">To Account</label>
                    <select
                        id="toAccount"
                        value={transferForm.toAccount}
                        onChange={(e) => setTransferForm({...transferForm, toAccount: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">Select an account</option>
                        {accounts.map(acc => (
                            <option key={acc.id} value={acc.id}>
                                {acc.accountType.charAt(0).toUpperCase() + acc.accountType.slice(1)} ({acc.accountNumber}) - ${acc.balance.toLocaleString()}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                    <input
                        type="number"
                        id="amount"
                        value={transferForm.amount}
                        onChange={(e) => setTransferForm({...transferForm, amount: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., 500.00"
                        step="0.01"
                        min="0.01"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                    <input
                        type="text"
                        id="description"
                        value={transferForm.description}
                        onChange={(e) => setTransferForm({...transferForm, description: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Monthly bill payment"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                    <Send size={20} />
                    Process Transfer
                </button>
            </form>
        </div>
    );
};

export default TransferForm;