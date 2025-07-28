// src/components/forms/TransferForm.tsx
'use client';

import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useAccounts } from '@/providers/AccountProvider';
import { useTransactions } from '@/providers/TransactionProvider';
import { TransferFormInputs } from '@/types';
import {Decimal} from "decimal.js";
import axios from "axios"; // Import type

// TransferForm component allows users to transfer money between their accounts
const TransferForm: React.FC = () => {
    // Get accounts, transfer function, and alert function from context/providers
    const { accounts, getAccountBalance } = useAccounts();
    const { makeTransfer } = useTransactions();
    const [ isBalanceLess, setIsBalanceLess ] = useState(false);
    const [fromId, setFromId] = useState<number | null>(null);

    // State for form inputs
    const [transferForm, setTransferForm] = useState<TransferFormInputs>({
        fromAccount: '',
        toAccount: '',
        amount: new Decimal(0),
        description: ''
    });

    // Get user id from localStorage
    const id = localStorage.getItem('id');

    // Handle form submission for transfer
    const handleTransfer = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('authToken');
        // Set the default Authorization header for all future axios requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // check if description is empty and set it to 'No comment' if true
        if (transferForm.description.trim() === '') {
            transferForm.description = 'General Transfer';
        }


        if (id) {
            const userId = parseInt(id, 10);

            // check if fromAccount balance is less than amount
            if (fromId) {
                const fromAccount = await getAccountBalance(userId, fromId);
                if (fromAccount.success && new Decimal(fromAccount.balance).lessThan(transferForm.amount)) {
                    setIsBalanceLess(true);
                    return;
                } else {
                    setIsBalanceLess(false);
                }
            }

            // Prepare transfer data
            const transferData = {
                ...transferForm,
                amount: transferForm.amount
            };


            // Call makeTransfer and handle result
            const result = await makeTransfer(userId, transferData);
            if (result.success) {
                // Reset form after successful transfer
                setTransferForm({ fromAccount: '', toAccount: '', amount: new Decimal(0), description: '' });
                window.location.reload();
            } else {
                console.log(result.message || 'Transfer failed.', 'error');
            }
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Send size={20} /> Transfer Money
            </h3>
            <form onSubmit={handleTransfer} className="space-y-4">
                {/* From Account selection */}
                <div>
                    <label htmlFor="fromAccount" className="block text-sm font-medium text-gray-700 mb-2">From Account</label>
                    <select
                        id="fromAccount"
                        value={transferForm.fromAccount}
                        onChange={(e) => {
                            setTransferForm({ ...transferForm, fromAccount: e.target.value });
                            const selectedAccount = accounts.find(acc => acc.accountNumber === e.target.value);
                            setFromId(selectedAccount ? selectedAccount.id : null);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">Select an account</option>
                        {accounts
                            .filter(acc => acc.status === 'OPEN')
                            .map(acc => (
                                <option key={acc.id} value={acc.accountNumber}>
                                    {acc.accountType === 'CREDIT'
                                        ? `ISA (${acc.accountNumber}) - £${acc.balance.toLocaleString()}`
                                        : `${acc.accountType.charAt(0).toUpperCase() + acc.accountType.slice(1)} (${acc.accountNumber}) - £${acc.balance.toLocaleString()}`
                                    }
                                </option>
                            ))}
                    </select>
                </div>

                {/* To Account selection */}
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
                        {accounts
                            .filter(acc => acc.status === 'OPEN' && acc.accountNumber !== transferForm.fromAccount)
                            .map(acc => (
                                <option key={acc.id} value={acc.accountNumber}>
                                    {acc.accountType === 'CREDIT'
                                        ? `ISA (${acc.accountNumber}) - £${acc.balance.toLocaleString()}`
                                        : `${acc.accountType.charAt(0).toUpperCase() + acc.accountType.slice(1)} (${acc.accountNumber}) - £${acc.balance.toLocaleString()}`
                                    }
                                </option>
                            ))}
                    </select>
                </div>

                {/* Amount input */}
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                    <input
                        type="number"
                        id="amount"
                        value={transferForm.amount.isNaN() ? '' : transferForm.amount.toString()}
                        onChange={(e) => {
                            const inputValue = e.target.value;
                            try {
                                // Only create a new Decimal if the value is not empty
                                const newAmount = inputValue === '' ? new Decimal(0) : new Decimal(inputValue);
                                setTransferForm({...transferForm, amount: newAmount});
                            } catch (error) {
                                // If the value cannot be converted to a Decimal, keep the previous value
                                console.error("Invalid decimal value:", error);
                            }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., 500.00"
                        step="0.01"
                        min="0.01"
                        required
                    />
                </div>

                {/* Description input */}
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

                {/* Submit button */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                    <Send size={20} />
                    Process Transfer
                </button>
            </form>

            {/* Error message for insufficient balance */}
            {isBalanceLess && (
                <p className="text-red-600 mt-2 ">
                    Insufficient balance in the selected account.
                </p>
            )}
        </div>
    );
};

export default TransferForm;