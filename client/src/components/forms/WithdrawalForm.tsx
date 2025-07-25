// src/components/forms/WithdrawalForm.tsx
'use client';

import React, { useState } from 'react';
import { Minus } from 'lucide-react';
import { useAccounts } from '@/providers/AccountProvider';
import { useTransactions } from '@/providers/TransactionProvider';
import { useAlerts } from '@/hooks/useAlerts';
import { WithdrawFormInputs } from '@/types';
import {Decimal} from "decimal.js";
import axios from "axios"; // Import type

// WithdrawalForm component allows users to submit a withdrawal transaction
const WithdrawalForm: React.FC = () => {
    // Get accounts from context/provider
    const { accounts, getAccountBalance } = useAccounts();
    // Get withdrawal function from transactions context/provider
    const { makeWithdrawal } = useTransactions();
    // Get alert function from custom hook
    const { addAlert } = useAlerts();
    const [ isBalanceLess, setIsBalanceLess ] = useState(false);
    const [fromId, setFromId] = useState<number | null>(null);

    // List of withdrawal categories
    const categoryNames = [
        "General Withdrawal", "Tesco", "Rent", "Amazon", "Dining Out", "Charity", "Coffee Shop",
        "Public Transport", "Clothing", "Ride Sharing", "Subscription Services"
    ];

    // State for withdrawal form inputs
    const [withdrawalForm, setWithdrawalForm] = useState<WithdrawFormInputs>({
        accountNumber: '',
        amount: new Decimal(0),
        description: '',
        categoryName: ''
    });

    // Get user id from local storage
    const id = localStorage.getItem('id');

    // Handles form submission for withdrawal
    const handleWithdrawal = async (e: React.FormEvent) => {
        e.preventDefault();
        // Get auth token from local storage
        const token = localStorage.getItem('authToken');
        // Set default Authorization header for axios
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;



        // check if description is empty and set it to 'No comment' if true
        if (withdrawalForm.description.trim() === '') {
            withdrawalForm.description = 'General withdrawal';
        }

        // check if categoryName is empty and set it to 'General Withdrawal' if true
        if (withdrawalForm.categoryName.trim() === '') {
            withdrawalForm.categoryName = 'General Withdrawal';
        }

        if (id) {
            const userId = parseInt(id, 10);

            // check if fromAccount balance is less than amount
            if (fromId) {
                const fromAccount = await getAccountBalance(userId, fromId);
                if (fromAccount.success && new Decimal(fromAccount.balance).lessThan(withdrawalForm.amount)) {
                    setIsBalanceLess(true);
                    return;
                } else {
                    setIsBalanceLess(false);
                }
            }

            // Prepare withdrawal data
            const withdrawData = {
                ...withdrawalForm,
                amount: withdrawalForm.amount
            };

            // Call withdrawal function
            const result = await makeWithdrawal(userId, withdrawData);
            if (result.success) {
                addAlert('Withdrawal completed successfully!', 'success');
                // Reset form after success
                setWithdrawalForm({ accountNumber: '', amount: new Decimal(0), description: '', categoryName: '' });
                window.location.reload();
            } else {
                addAlert(result.message || 'Withdrawal failed.', 'error');
            }
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Minus size={20} /> Withdraw Money
            </h3>
            <form onSubmit={handleWithdrawal} className="space-y-4">
                {/* Account selection */}
                <div>
                    <label htmlFor="withdrawalAccount" className="block text-sm font-medium text-gray-700 mb-2">
                        From Account
                    </label>
                    <select
                        id="withdrawalAccount"
                        value={withdrawalForm.accountNumber}
                        onChange={(e) => {
                            setWithdrawalForm({...withdrawalForm, accountNumber: e.target.value});
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

                {/* Amount input */}
                <div>
                    <label htmlFor="withdrawalAmount" className="block text-sm font-medium text-gray-700 mb-2">
                        Amount
                    </label>
                    <input
                        type="number"
                        id="withdrawalAmount"
                        value={withdrawalForm.amount.isNaN() ? '' : withdrawalForm.amount.toString()}
                        onChange={(e) => {
                            const inputValue = e.target.value;
                            try {
                                // Only create a new Decimal if the value is not empty
                                const newAmount = inputValue === '' ? new Decimal(0) : new Decimal(inputValue);
                                setWithdrawalForm({ ...withdrawalForm, amount: newAmount });
                            } catch (error) {
                                // If the value cannot be converted to a Decimal, keep the previous value
                                console.error("Invalid decimal value:", error);
                            }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., 100.00"
                        step="0.01"
                        min="0.01"
                        required
                    />
                </div>

                {/* Category selection */}
                <div>
                    <label htmlFor="withdrawalCategory" className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                    </label>
                    <select
                        id="withdrawalCategory"
                        value={withdrawalForm.categoryName}
                        onChange={(e) => setWithdrawalForm({ ...withdrawalForm, categoryName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        {categoryNames.map(category => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Description input */}
                <div>
                    <label htmlFor="withdrawalDescription" className="block text-sm font-medium text-gray-700 mb-2">
                        Description (Optional)
                    </label>
                    <input
                        type="text"
                        id="withdrawalDescription"
                        value={withdrawalForm.description}
                        onChange={(e) => setWithdrawalForm({ ...withdrawalForm, description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., ATM withdrawal"
                    />
                </div>

                {/* Submit button */}
                <button
                    type="submit"
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                    <Minus size={20} />
                    Process Withdrawal
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
export default WithdrawalForm;