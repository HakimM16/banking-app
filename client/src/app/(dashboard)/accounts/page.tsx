// src/app/(dashboard)/accounts/page.tsx
'use client';

import React, {useEffect, useState} from 'react';
import { Plus, Minus } from 'lucide-react';
import { useAccounts } from '@/providers/AccountProvider';
import { useAuth } from '@/providers/AuthProvider';
import AccountCard from '@/components/AccountCard';
import {UpdateAccountStatusFormInputs} from "@/types";
import axios from "axios";

// AccountsPage component for managing user bank accounts
export default function AccountsPage() {
    // Get current user from AuthProvider
    const { currentUser } = useAuth();
    // Get accounts and account actions from AccountProvider
    const { accounts, createAccount, changeAccountStatus } = useAccounts();
    // State for user id
    const [id, setId] = useState<string | null>(null);

    const [existing, setExisting] = useState<boolean>(false);

    // State to control account creation modal
    const [isCreatingAccount, setIsCreatingAccount] = useState(false);
    // State for account creation form
    const [accountForm, setAccountForm] = useState({
        accountType: 'DEBIT', // Default to Debit
    });

    // State for updating account status
    const [accountStatus, setAccountStatus] = useState<UpdateAccountStatusFormInputs>({
        status: 'OPEN', // Default to OPEN
    });

    // Get id from localStorage if not in URL params
    // Access localStorage only on client side
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setId(localStorage.getItem('id'));
        }
    }, []);

    // Handle account creation
    const handleCreateAccount = async () => {
        // Check if there is an existing account of the same type
        const existingAccount = accounts.find(account => account.accountType === accountForm.accountType);
        if (existingAccount) {
            setExisting(true);
            return;
        }

        const token = localStorage.getItem('authToken');
        // Set the default Authorization header for all future axios requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        if (id) {
            const result = await createAccount(parseInt(id, 10), accountForm);
            console.log(accountForm)
            // Show error alert if creation failed
            if (result.success) {
                console.log(result.message || 'Failed to create account.', 'error');
            }
        }
    };

    // Handle toggling account status (OPEN/CLOSED)
    // Handle toggling account status (OPEN/CLOSED)
    const handleToggleStatus = async (accountId: number) => {
        const token = localStorage.getItem('authToken');
        // Set the default Authorization header for all future axios requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Find the current account to get its current status
        const currentAccount = accounts.find(account => account.id === accountId);
        if (!currentAccount) return;

        // Determine new status based on current status
        const newStatus = currentAccount.status === 'OPEN' ? 'CLOSED' : 'OPEN';
        const statusUpdate = { status: newStatus };

        if (id) {
            const result = await changeAccountStatus(parseInt(id, 10), accountId, statusUpdate);
            if (result.success) {
                console.log('Account status updated successfully!', 'success');
            } else {
                console.log(result.message || 'Failed to update account status.', 'error');
            }
        }
    };

    // Show loading if user data is not available
    if (!currentUser) {
        return (
            <div className="flex h-screen items-center justify-center bg-indigo-900">
                <div className="text-white text-xl">Loading data</div>
            </div>
        )
    }

    // Main render
    return (
        <div className="pt-13 px-7 pb-7">
            {/* Header section */}
            <div className="flex items-center justify-between mb-8 gap-3">
                <div>
                    <h1 className="text-3xl font-bold text-gray-50 mb-2">Accounts</h1>
                    <p className="text-gray-200">Manage your bank accounts</p>
                </div>
                {/* Button to open account creation modal */}
                <button
                    onClick={() => setIsCreatingAccount(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <Plus size={20} />
                    Create Account
                </button>
            </div>

            {/* Account creation modal */}
            {accounts.length < 3 ? (
                isCreatingAccount && (
                    <div className="bg-white p-6 rounded-xl shadow-md mb-6">
                        <h3 className="text-lg font-semibold mb-4">Create New Account</h3>
                        <div className="flex flex-col md:flex-row items-start md:items-end gap-4">
                            <div>
                                <label htmlFor="accountType" className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
                                <select
                                    id="accountType"
                                    value={accountForm.accountType}
                                    onChange={(e) => setAccountForm({...accountForm, accountType: e.target.value.toUpperCase()})}
                                    className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="DEBIT">Debit</option>
                                    <option value="SAVINGS">Savings</option>
                                    <option value="CREDIT">ISA</option>
                                </select>
                            </div>
                            {/* Confirm create account button */}
                            <button
                                onClick={handleCreateAccount}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                            >
                                <Plus size={20} />
                                Confirm Create
                            </button>
                            {/* Cancel account creation button */}
                            <button
                                onClick={() => setIsCreatingAccount(false)}
                                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-colors flex items-center gap-2"
                            >
                                <Minus size={20} />
                                Cancel
                            </button>
                        </div>
                        {/* Show existing account warning if applicable */}
                        {existing && (
                            <p className="text-red-500 mt-4">
                                An account of this type already exists. Please choose a different type.
                            </p>
                        )}
                    </div>
                )
            ) : (
                <div className="bg-white p-6 rounded-xl shadow-md mb-6 flex justify-center items-center">
                    <h3 className="text-lg font-semibold mb-4 text-center">Maximum Accounts Created</h3>
                </div>
            )}

            {/* Accounts grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {accounts.length > 0 ? (
                    accounts.map((account) => (
                        <div key={account.id} className="bg-white p-6 rounded-xl shadow-md">
                            {/* Account card */}
                            <AccountCard account={account} />
                            <div className="mt-4 flex justify-end">
                                {/* Button to toggle account status */}
                                <button
                                    onClick={() => handleToggleStatus(account.id)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        account.status === 'OPEN'
                                            ? 'bg-red-500 text-white hover:bg-red-600'
                                            : 'bg-green-500 text-white hover:bg-green-600'
                                    }`}
                                >
                                    {account.status === 'OPEN' ? 'Deactivate' : 'Activate'}
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    // Message if no accounts found
                    <p className="text-gray-500 col-span-full">No accounts found. Create one to get started!</p>
                )}
            </div>
        </div>
    );
}