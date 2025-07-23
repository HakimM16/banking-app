// src/components/forms/DepositForm.tsx
'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAccounts } from '@/providers/AccountProvider';
import { useTransactions } from '@/providers/TransactionProvider';
import { useAlerts } from '@/hooks/useAlerts';
import { DepositFormInputs } from '@/types';
import { Decimal } from 'decimal.js';
import axios from "axios";

const DepositForm: React.FC = () => {
    const { accounts } = useAccounts();
    const { makeDeposit } = useTransactions();
    const { addAlert } = useAlerts();

    const categoryNames = ["General Deposit", "Google", "Salary", "Freelance Work", "Dividends", "Investment Return", "Bonus", "Stock sale", "Gift", "Cashback", "Scholarship"];

    const [depositForm, setDepositForm] = useState<DepositFormInputs>({
        accountNumber: '',
        amount: new Decimal(0),
        description: '',
        categoryName: ''
    });

    const id = localStorage.getItem('id');

    const handleDeposit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('authToken');
        // Set the default Authorization header for all future axios requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

        // check if description is empty and set it to 'No comment' if true
        if (depositForm.description.trim() === '') {
            depositForm.description = 'general deposit';
        }

        // check if categoryName is empty and set it to 'General Deposit' if true
        if (depositForm.categoryName.trim() === '') {
            depositForm.categoryName = 'General Deposit';
        }

        if (id) {
            const userId = parseInt(id, 10);

            // Create a modified version of the form data with the amount as a string or number
            const depositData = {
                ...depositForm,
                amount: depositForm.amount
            };

            const result = await makeDeposit(userId, depositData);
            if (result.success) {
                addAlert('Deposit completed successfully!', 'success');
                setDepositForm({ accountNumber: '', amount: new Decimal(0), description: '', categoryName: '' });
                window.location.reload();

            } else {
                addAlert(result.message || 'Deposit failed.', 'error');
            }
        }
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

                <div>
                    <label htmlFor="depositAmount" className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                    <input
                        type="number"
                        id="depositAmount"
                        value={depositForm.amount.isNaN() ? '' : depositForm.amount.toString()}
                        onChange={(e) => {
                            const inputValue = e.target.value;
                            try {
                                // Only create a new Decimal if the value is not empty
                                const newAmount = inputValue === '' ? new Decimal(0) : new Decimal(inputValue);
                                setDepositForm({...depositForm, amount: newAmount});
                            } catch (error) {
                                // If the value cannot be converted to a Decimal, keep the previous value
                                console.error("Invalid decimal value:", error);
                            }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., 1000.00"
                        step="0.01"
                        min="0.01"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="depositCategory" className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                        id="depositCategory"
                        value={depositForm.categoryName}
                        onChange={(e) => setDepositForm({...depositForm, categoryName: e.target.value})}
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